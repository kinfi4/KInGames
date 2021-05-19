from django.conf import settings
from django.db.models import Count, Q, F, Value, Avg
from django.db.models.functions import Concat
from django.db import transaction
from django.core.exceptions import MultipleObjectsReturned

from api.models import Game, Category, KinGamesUser, User, Cart, CartGame, Comment, ORDER_BY_NUM_COMMENTS, \
    ORDER_BY_POINTS, UserMark
from api.exceptions import CantOrderEmptyCart, CantAddHiddenGame


# Games handlers
def create_game(**game_data):
    return Game.objects.create(**game_data)


def add_categories_for_game_creation(categories_slugs: list, game: Game):
    game.categories.set(Category.objects.filter(slug__in=categories_slugs))
    game.save()

    return game


def get_annotate_object_from_order_by_field(order_by):
    if order_by == ORDER_BY_POINTS:
        return {ORDER_BY_POINTS: Avg(F('marks__mark'))}
    elif order_by == ORDER_BY_NUM_COMMENTS:
        return {ORDER_BY_NUM_COMMENTS: Count(F('comments'))}

    return {}


def get_list_games(order_by, skip=0, amount=settings.PAGE_SIZE, **filters):
    annotate = get_annotate_object_from_order_by_field(order_by)

    return Game.objects.filter(**filters) \
               .prefetch_related('categories') \
               .annotate(**annotate) \
               .order_by(order_by)[skip:skip + amount]


def get_list_games_with_categories(categories, order_by, skip=0, amount=settings.PAGE_SIZE, **filters):
    annotate = get_annotate_object_from_order_by_field(order_by)

    return Game.objects \
               .filter(**filters, categories__slug__in=categories) \
               .annotate(num_categories=Count('categories'), **annotate) \
               .filter(num_categories=len(categories)).order_by(f'-{order_by}')[skip:skip + amount]


def delete_game_by_slug(slug: str):
    game = Game.objects.prefetch_related('cart_games__cart__user', 'cart_games').filter(slug=slug).first()

    for cart_game in game.cart_games.all():
        if user := cart_game.cart.user:
            remove_game_from_cart(game_slug=game.slug, remove_whole_row=True, **{'cart__user': user})
        else:
            user_agent = cart_game.cart.user_agent
            remove_game_from_cart(game_slug=game.slug, remove_whole_row=True, **{'cart__user_agent': user_agent})

    game.delete()


def get_game_by_slug(slug: str):
    return Game.objects.annotate(avg_mark=Avg(F('marks__mark'))).prefetch_related('categories').get(slug=slug)


def get_number_of_games_filtered_with_categories(categories, **filters):
    return Game.objects.filter(**filters, categories__slug__in=categories) \
        .annotate(num_categories=Count('categories')) \
        .filter(num_categories=len(categories)).count()


def get_number_of_games(**filters):
    return Game.objects.filter(**filters).count()


def change_game_hidden(game_slug):
    game = Game.objects.get(slug=game_slug)
    game.hidden = not game.hidden
    game.save(update_fields=['hidden'])
    print(game.hidden)


# Game marks handlers
def add_mark_to_the_game(game_slug, user, points):
    mark = UserMark.objects.get_or_create(game=Game.objects.get(slug=game_slug), user=user)[0]
    mark.mark = points
    mark.save(update_fields=['mark'])

    return Game.objects.aggregate(new_avg=Avg(F('marks__mark')))


# Categories handlers
def get_all_categories():
    return Category.objects.all()


# Users handlers
def create_default_kin_user(user):
    return KinGamesUser.objects.create(django_user=user)


def delete_user(user: User):
    user.delete()


def get_list_users(skip=0, amount=settings.PAGE_SIZE, **filters):
    return User.objects.filter(
        Q(first_name__icontains=filters.get('first_name', '')) |
        Q(last_name__icontains=filters.get('last_name', ''))
    ).select_related('kin_user')[skip:skip + amount]


def change_user_role(username, role):
    user = User.objects.select_related('kin_user').get(username=username)
    user.kin_user.role = role
    user.kin_user.save(update_fields=['role'])


# Cart handlers
def get_user_cart_size(**user_filters):
    cart = Cart.objects.filter(**user_filters).only('total_products').first()
    return 0 if not cart else cart.total_products


def user_has_cart(**user_filter):
    return Cart.objects.filter(**user_filter).exists()


def get_user_cart(**cart_filters):
    return Cart.objects.prefetch_related('cart_games__game').get_or_create(**cart_filters)[0]


@transaction.atomic
def add_game_to_cart(game_slug, cart_filter, cart_game_filter):
    try:
        cart = Cart.objects.select_for_update().get_or_create(**cart_filter)[0]
    except MultipleObjectsReturned:
        for c in Cart.objects.filter(**cart_filter):
            c.delete()

        cart = Cart.objects.select_for_update().get_or_create(**cart_filter)[0]

    cart_game = CartGame.objects.select_for_update().filter(game__slug=game_slug, **cart_game_filter).first()
    game = Game.objects.select_for_update().get(slug=game_slug)

    if game.hidden:
        raise CantAddHiddenGame()

    cart.final_price += game.price
    cart.total_products += 1
    cart.save(update_fields=['final_price', 'total_products'])

    game.number_of_licences -= 1
    game.save(update_fields=['number_of_licences'])

    if not cart_game:
        CartGame.objects.create(game=game, cart=cart, final_price=game.price)
    else:
        cart_game.qty += 1
        cart_game.final_price += game.price
        cart_game.save(update_fields=['qty', 'final_price'])


@transaction.atomic
def remove_game_from_cart(game_slug, remove_whole_row, **cart_filter):
    cart_game = CartGame.objects.select_for_update().select_related('cart', 'game').filter(game__slug=game_slug,
                                                                                           **cart_filter).first()
    if not cart_game:
        raise ValueError(f'Game {game_slug} does not belong to the {cart_filter} cart')

    if remove_whole_row:
        delete__cart_game(cart_game)
        return

    cart, game = cart_game.cart, cart_game.game

    cart.total_products -= 1
    cart.final_price -= game.price
    cart.save(update_fields=['total_products', 'final_price'])

    game.number_of_licences += 1
    game.save(update_fields=['number_of_licences'])

    if cart_game.qty == 1:
        cart_game.delete()
    else:
        cart_game.qty -= 1
        cart_game.final_price -= game.price
        cart_game.save(update_fields=['qty', 'final_price'])


@transaction.atomic
def delete__cart_game(cart_game):
    cart, game = cart_game.cart, cart_game.game

    cart.total_products -= cart_game.qty
    cart.final_price -= cart_game.qty * game.price
    game.number_of_licences += cart_game.qty

    cart.save(update_fields=['total_products', 'final_price'])
    game.save(update_fields=['number_of_licences'])

    cart_game.delete()


def make_order(**cart_filters):
    cart = get_user_cart(**cart_filters)

    if not cart or cart.total_products == 0:
        raise CantOrderEmptyCart()

    for cart_game in cart.cart_games.all():
        game = cart_game.game
        game.bought_times += cart_game.qty
        game.save(update_fields=['bought_times'])

    cart.delete()


# Comment handlers
def get_game_top_level_comments(game_slug):
    return Comment.objects.annotate(replied_number=Count('inner_comments')) \
        .select_related('user') \
        .filter(game__slug=game_slug, top_level_comment__isnull=True).order_by('-created_at')


def get_top_level_comment_replies(comment_id):
    return Comment.objects \
        .annotate(
        replied_full_name=Concat(F('replied_comment__user__first_name'), Value(' '),
                                 F('replied_comment__user__last_name')),
        replied_name_color=F('replied_comment__user__kin_user__name_color')
    ).filter(top_level_comment_id=comment_id) \
        .order_by('created_at')


def get_comment_by_id(comment_id):
    return Comment.objects.annotate(
        replied_full_name=Concat(F('replied_comment__user__first_name'), Value(' '),
                                 F('replied_comment__user__last_name')),
        replied_name_color=F('replied_comment__user__kin_user__name_color'),
        replied_number=Count('inner_comments')
    ).get(pk=comment_id)


def add_comment(username, game_slug, body, replied_on_pk=None, top_level_comment_pk=None):
    game = Game.objects.get(slug=game_slug)
    user = User.objects.get(username=username)
    return Comment.objects.create(user=user, game=game, body=body, top_level_comment_id=top_level_comment_pk,
                                  replied_comment_id=replied_on_pk)


def delete_comment(pk):
    comment = Comment.objects.get(pk=pk)
    comment.delete()

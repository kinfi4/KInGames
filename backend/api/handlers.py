from django.conf import settings
from django.db.models import Count, Q

from api.models import Game, Category, KinGamesUser, User, Cart, CartGame, Comment


# Games handlers
def create_game(**game_data):
    return Game.objects.create(**game_data)


def add_categories_for_game_creation(categories_slugs: list, game: Game):
    game.categories.set(Category.objects.filter(slug__in=categories_slugs))
    game.save()

    return game


def get_list_games(skip=0, amount=settings.PAGE_SIZE, **filters):
    return Game.objects.filter(**filters).prefetch_related('categories')[skip:skip + amount]


def get_list_games_with_categories(categories, skip=0, amount=settings.PAGE_SIZE, **filters):
    return Game.objects \
               .filter(**filters, categories__slug__in=categories) \
               .annotate(num_categories=Count('categories')) \
               .filter(num_categories=len(categories))[skip:skip + amount]


def delete_game_by_slug(slug: str):
    Game.objects.filter(slug=slug).first().delete()


def get_game_by_slug(slug: str):
    return Game.objects.prefetch_related('categories').get(slug=slug)


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
        Q(first_name__contains=filters.get('first_name', '')) |
        Q(last_name__contains=filters.get('last_name', ''))
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


def get_user_cart(**user_filter):
    return Cart.objects.prefetch_related('cart_games__game').get_or_create(**user_filter)[0]


def add_game_to_cart(game_slug, cart_filter, cart_game_filter):
    cart_game = CartGame.objects.filter(game__slug=game_slug, **cart_game_filter).first()
    cart = Cart.objects.get_or_create(**cart_filter)[0]
    game = Game.objects.get(slug=game_slug)

    cart.final_price += game.price
    cart.total_products += 1
    cart.save(update_fields=['final_price', 'total_products'])

    game.number_of_licences -= 1
    game.save(update_fields=['number_of_licences'])

    if not cart_game:
        CartGame.objects.create(game=game, cart=cart)
    else:
        cart_game.qty += 1
        cart_game.save(update_fields=['qty'])


def remove_game_from_cart(game_slug, **cart_filter):
    cart_game = CartGame.objects.select_related('cart', 'game').filter(game__slug=game_slug, **cart_filter).first()

    if not cart_game:
        raise ValueError(f'Game {game_slug} does not belong to the {cart_filter} cart')

    cart, game = cart_game.cart, cart_game.game

    cart.total_products -= 1
    cart.final_price -= game.price
    cart.save(update_fields=['total_products', 'final_price'])

    game.number_of_licences += 1
    cart.save(update_fields=['number_of_licences'])

    if cart_game.qty == 1:
        cart_game.delete()
    else:
        cart_game.qty -= 1
        cart_game.save(update_fields=['qty'])


# Comment handlers
def get_game_top_level_comments(game_slug):
    return Comment.objects.filter(game__slug=game_slug, top_level_comment=None)


def get_top_level_comment_replies(comment_id):
    return Comment.objects.get(top_level_comment_id=comment_id)


def get_comment_by_id(comment_id):
    return Comment.objects.get(pk=comment_id)


def add_comment(username, game_slug, body, replied_on_pk=None, top_level_comment_pk=None):
    game = Game.objects.get(slug=game_slug)
    user = User.objects.get(username=username)
    return Comment.objects.create(user=user, game=game, body=body, top_level_comment_id=top_level_comment_pk,
                                  replied_id=replied_on_pk)


def delete_comment(pk):
    comment = Comment.objects.get(pk=pk)
    comment.delete()

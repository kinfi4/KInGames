from django.conf import settings
from django.db.models import Count, Q

from api.models import Game, Category, KinGamesUser, User


def create_game(**game_data):
    return Game.objects.create(**game_data)


def add_categories_for_game_creation(categories_slugs: list, game: Game):
    game.categories.set(Category.objects.filter(slug__in=categories_slugs))
    game.save()

    return game


def get_list_games(skip=0, amount=settings.PAGE_SIZE, **filters):
    return Game.objects.filter(**filters).prefetch_related('categories')[skip:skip + amount]


def get_list_games_with_categories(categories, skip=0, amount=settings.PAGE_SIZE, *filters):
    return Game.objects \
               .filter(*filters, categories__slug__in=categories) \
               .annotate(num_categories=Count('categories')) \
               .filter(num_categories=len(categories))[skip:skip + amount]


def delete_game_by_slug(slug: str):
    Game.objects.filter(slug=slug).first().delete()


def get_game_by_slug(slug: str):
    return Game.objects.prefetch_related('categories').get(slug=slug)


def get_all_categories():
    return Category.objects.all()


def create_default_kin_user(user):
    return KinGamesUser.objects.create(django_user=user)


def delete_user(user: User):
    user.delete()


def get_list_users(skip=0, amount=settings.PAGE_SIZE, **filters):
    return User.objects.filter(
        Q(first_name__contains=filters.get('first_name', '')) |
        Q(last_name__contains=filters.get('last_name', ''))
    ).select_related('kin_user')[skip:skip+amount]


def change_user_role(username, role):
    user = User.objects.select_related('kin_user').get(username=username)
    user.kin_user.role = role
    user.kin_user.save(update_fields=['role'])

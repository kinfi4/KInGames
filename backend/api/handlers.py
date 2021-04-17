from django.conf import settings

from api.models import Game, Category, KinGamesUser, User


def create_game(**game_data):
    return Game.objects.create(**game_data)


def add_categories_for_game_creation(categories_raw: list, game: Game):
    game.categories.set(Category.objects.filter(slug__in=[cat['slug'] for cat in categories_raw]))
    game.save()

    return game


def get_list_games(skip=0, amount=settings.PAGE_SIZE, **filters):
    return Game.objects.filter(**filters).prefetch_related('categories')[skip*amount:amount]


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

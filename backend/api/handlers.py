from django.conf import settings

from api.models import Game, Category


def create_game(**game_data):
    return Game.objects.create(**game_data)


def add_categories_for_game_creation(categories: list, game: Game):
    game.categories.set(Category.objects.get(name=cat_name) for cat_name in categories)
    game.save()

    return game


def get_list_games(skip=0, amount=settings.PAGE_SIZE, **filters):
    return Game.objects.filter(**filters).prefetch_related('categories')[skip*amount:amount]

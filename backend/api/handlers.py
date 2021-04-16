from django.conf import settings

from api.models import Game, Category


def create_game(**game_data):
    return Game.objects.create(**game_data)


def add_categories_for_game_creation(categories_raw: list, game: Game):
    cats = Category.objects.filter(slug__in=[cat['slug'] for cat in categories_raw])
    print(cats)
    game.categories.set(cats)
    game.save()

    return game


def get_list_games(skip=0, amount=settings.PAGE_SIZE, **filters):
    return Game.objects.filter(**filters).prefetch_related('categories')[skip*amount:amount]

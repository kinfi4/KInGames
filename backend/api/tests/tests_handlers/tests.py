from django.test import TestCase
from django.core.exceptions import ObjectDoesNotExist

from api.handlers import get_list_games, delete_game_by_slug, get_game_by_slug, create_game
from api.models import Game, Category
from api.tests.constants import TestData


class TestGameHandlers(TestCase):
    def setUp(self) -> None:
        categories = []
        for category_data in TestData.TEST_CATEGORIES_DATA:
            categories.append(Category.objects.create(**category_data))

        for game_data, category in zip(TestData.TEST_GAMES_DATA, categories):
            Game.objects.create(**game_data).categories.set([category])

    def test_getting_list_games(self):
        games = get_list_games()
        db_games = Game.objects.all()

        self.assertListEqual(list(games), list(db_games))

    def test_getting_list_games_filtered(self):
        games = get_list_games(categories__name__in=[TestData.TEST_CATEGORIES_DATA[0]['name']])
        db_games = Game.objects.filter(categories__name__in=[TestData.TEST_CATEGORIES_DATA[0]['name']])

        self.assertListEqual(list(games), list(db_games))

    def test__delete_get_game_by_slug(self):
        test_slug = 'TEST_SLUG'
        test_title = 'doesnt matter'

        create_game(title=test_title, slug=test_slug, price='12.00')

        game = get_game_by_slug(test_slug)
        self.assertEqual(game.title, test_title)

        delete_game_by_slug(test_slug)
        with self.assertRaises(ObjectDoesNotExist):
            get_game_by_slug(test_slug)

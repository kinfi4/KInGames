from django.test import TestCase
from django.core.exceptions import ObjectDoesNotExist
from ddt import ddt, data, unpack

from api.handlers import get_list_games, delete_game_by_slug, get_game_by_slug, create_game, delete_user, \
    create_default_kin_user, get_list_users
from api.models import Game, Category, User, KinGamesUser
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


@ddt
class TestUserHandlers(TestCase):
    def setUp(self) -> None:
        users = User.objects.bulk_create([User(**user_data) for user_data in TestData.TEST_USERS_DATA])

        for user in users:
            KinGamesUser.objects.create(django_user=user)

    def test_deleting_user(self):
        user = User.objects.get(username=TestData.TEST_USERS_DATA[0]['username'])
        delete_user(user)

        with self.assertRaises(ObjectDoesNotExist):
            user = User.objects.get(username=TestData.TEST_USERS_DATA[0]['username'])

    def test_creating_default_kin_user__must_not_raise_error(self):
        username = 'Some username'
        user = User.objects.create(username=username, password='1234')
        create_default_kin_user(user)

        try:
            KinGamesUser.objects.get(django_user__username=username)
        except ObjectDoesNotExist:
            self.fail()

    @data(['tom', [TestData.TEST_USERS_DATA[0]]], ['mari', [TestData.TEST_USERS_DATA[0], TestData.TEST_USERS_DATA[1]]])
    @unpack
    def test_filtering_users(self, filtering_string, list_of_correct_results):
        filters = {'first_name': filtering_string, 'last_name': filtering_string}

        results = get_list_users(skip=0, **filters)

        self.assertListEqual([result.username for result in results],
                             [correct_res['username'] for correct_res in list_of_correct_results])

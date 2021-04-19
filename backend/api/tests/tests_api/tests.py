import unittest

from django.test import TestCase, Client
from rest_framework.authtoken.models import Token
from django.core.exceptions import ObjectDoesNotExist

from api.tests.constants import TestData, TestAnswers, APIUrls
from api.models import Category, Game, User


class TestGameAPI(TestCase):
    def setUp(self) -> None:
        test_user = User.objects.create_user(username=TestData.TEST_USERNAME, password=TestData.TEST_USER_PASSWORD)
        token = Token.objects.create(user=test_user)

        self.client = Client(HTTP_AUTHORIZATION=f'Token {token.key}')

        categories = []
        for category_data in TestData.TEST_CATEGORIES_DATA:
            categories.append(Category.objects.create(**category_data))

        for game_data, category in zip(TestData.TEST_GAMES_DATA, categories):
            Game.objects.create(**game_data).categories.set([category])

    def test_getting_list_games(self):
        response = self.client.get(APIUrls.GET_GAMES_URL)
        db_games = Game.objects.all()

        for response_game, db_game in zip(response.data, db_games):
            self.assertEqual(response_game['title'], db_game.title)
            self.assertEqual(float(response_game['price']), float(db_game.price))
            self.assertEqual(response_game['slug'], db_game.slug)

    TEST_TITLE, TEST_PRICE, NEW_TEST_TITLE = 'TEST_TITLE', 999.00, 'NEW_TEST_TITLE'

    def object_game_equal_response(self, db_tested_game, title=TEST_TITLE):
        self.assertEqual(db_tested_game.title, title)
        self.assertEqual(float(db_tested_game.price), float(self.TEST_PRICE))

        response = self.client.get(APIUrls.SINGLE_GAME(db_tested_game.slug)).data

        self.assertEqual(response['title'], db_tested_game.title)
        self.assertEqual(float(response['price']), float(db_tested_game.price))

    def test_crud_on_game(self):
        self.client.post(APIUrls.GET_GAMES_URL, data={
            'title': self.TEST_TITLE,
            'price': self.TEST_PRICE
        }, content_type='application/json')

        db_tested_game = Game.objects.get(title=self.TEST_TITLE)
        self.object_game_equal_response(db_tested_game)

        self.client.put(APIUrls.SINGLE_GAME(db_tested_game.slug), data={'title': self.NEW_TEST_TITLE},
                        content_type='application/json')

        db_tested_game = Game.objects.get(title=self.NEW_TEST_TITLE)
        self.object_game_equal_response(db_tested_game, title=self.NEW_TEST_TITLE)

        self.client.delete(APIUrls.SINGLE_GAME(db_tested_game.slug))

        with self.assertRaises(ObjectDoesNotExist):
            Game.objects.get(title=self.NEW_TEST_TITLE)

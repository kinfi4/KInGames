from django.test import TestCase, Client
from rest_framework.authtoken.models import Token
from django.core.exceptions import ObjectDoesNotExist
from rest_framework import status

from api.tests.constants import TestData, APIUrls
from api.models import Category, Game, User, KinGamesUser, Comment, CartGame, Cart


class TestGameAPI(TestCase):
    TEST_TITLE, TEST_PRICE, NEW_TEST_TITLE = 'TEST_TITLE', 999.00, 'NEW_TEST_TITLE'

    def setUp(self) -> None:
        test_user = User.objects.create_user(username=TestData.TEST_USERNAME, password=TestData.TEST_USER_PASSWORD)
        KinGamesUser.objects.create(django_user=test_user, role='ADMIN')
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


class TestCommentsAPI(TestCase):
    TEST_GAME_TITLE, TEST_PRICE, TEST_GAME_SLUG = 'TEST_TITLE', 999.00, 'TEST_SLUG'

    def setUp(self) -> None:
        test_user = User.objects.create_user(username=TestData.TEST_USERNAME, password=TestData.TEST_USER_PASSWORD)
        KinGamesUser.objects.create(django_user=test_user, role='ADMIN')
        token = Token.objects.create(user=test_user)

        self.client = Client(HTTP_AUTHORIZATION=f'Token {token.key}')

        game = Game.objects.create(title=self.TEST_GAME_TITLE, slug=self.TEST_GAME_SLUG, price=self.TEST_PRICE)

        for data in TestData.TEST_TOP_LEVEL_COMMENTS:
            Comment.objects.create(user=test_user, game=game, **data)

        self.comment_with_replies = Comment.objects.first()

        for data in TestData.TEST_REPLIED_COMMENTS:
            Comment.objects.create(user=test_user, game=game, top_level_comment=self.comment_with_replies, **data)

    def test_getting_top_level_comments(self):
        db_comments = Comment.objects.filter(game__slug=self.TEST_GAME_SLUG, top_level_comment=None)
        api_comments = self.client.get(APIUrls.TOP_LEVEL_COMMENTS_URL(self.TEST_GAME_SLUG)).data

        self.assertListEqual([comment.body for comment in db_comments], [comment['body'] for comment in api_comments])

    def test_getting_comment_replies(self):
        db_replied = Comment.objects.filter(top_level_comment=self.comment_with_replies)
        api_replied = self.client.get(APIUrls.MANAGE_COMMENT_URL(self.comment_with_replies.id)).data

        self.assertListEqual([comment.body for comment in db_replied], [comment['body'] for comment in api_replied])

    def test_CRUD_on_comments(self):
        comment_body = 'Some new unique body'
        response = self.client.post(APIUrls.POST_COMMENT_URL, data={
            'body': comment_body,
            'game_slug': self.TEST_GAME_SLUG
        }, content_type='application/json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        comment = Comment.objects.filter(body=comment_body).first()
        self.assertEqual(comment.body, comment_body)

        new_comment_body = 'And this is completely new body'
        response = self.client.put(APIUrls.MANAGE_COMMENT_URL(comment.id), {
            'body': new_comment_body
        }, content_type='application/json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        comment = Comment.objects.filter(body=new_comment_body).first()
        self.assertEqual(comment.body, new_comment_body)

        response = self.client.get(APIUrls.GET_SINGLE_COMMENT_URL(comment.id))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['body'], new_comment_body)

        response = self.client.delete(APIUrls.MANAGE_COMMENT_URL(comment.id))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

        with self.assertRaises(ObjectDoesNotExist):
            Comment.objects.get(body=new_comment_body)

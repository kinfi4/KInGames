from django.test import TestCase, Client
from rest_framework.authtoken.models import Token
from rest_framework import status

from api.models import User, Category, Game, KinGamesUser, Comment
from api.tests.constants import TestData, APIUrls


class Test(TestCase):
    def setUp(self) -> None:
        self.game = Game.objects.create(title='SomeTitle', slug='someslug', price=299)

        user = User.objects.create_user(username='Test user', password='123456')
        KinGamesUser.objects.create(django_user=user, role='USER')
        user_token = Token.objects.create(user=user)
        self.user_model = user

        self.user_comment = Comment.objects.create(user=user, body='Some body!', game=self.game)

        admin = User.objects.create_user(username='Test admin', password='123456')
        KinGamesUser.objects.create(django_user=admin, role='ADMIN')
        admin_token = Token.objects.create(user=admin)
        self.admin_model = admin

        self.admin_comment = Comment.objects.create(user=admin, body='Some another body!', game=self.game)

        manager = User.objects.create_user(username='Test manager', password='123456')
        KinGamesUser.objects.create(django_user=manager, role='MANAGER')
        manager_token = Token.objects.create(user=manager)

        self.user = Client(HTTP_AUTHORIZATION=f'Token {user_token.key}')
        self.manager = Client(HTTP_AUTHORIZATION=f'Token {manager_token.key}')
        self.admin = Client(HTTP_AUTHORIZATION=f'Token {admin_token.key}')
        self.anonymous_client = Client()

        self.clients = [self.user, self.manager, self.admin, self.anonymous_client]

    @classmethod
    def setUpTestData(cls):
        categories = []
        for category_data in TestData.TEST_CATEGORIES_DATA:
            categories.append(Category.objects.create(**category_data))

        for game_data, category in zip(TestData.TEST_GAMES_DATA, categories):
            Game.objects.create(**game_data).categories.set([category])

    def make_request_and_check_response_status(self, client, url, request_type, expected_status, data=None):
        if request_type == 'GET':
            response = client.get(url)
        elif request_type == 'POST':
            response = client.post(url, data, content_type='application/json')
        elif request_type == 'PUT':
            response = client.put(url, data, content_type='application/json')
        elif request_type == 'DELETE':
            response = client.delete(url)
        else:
            raise ValueError('You passed unexpected request method')

        self.assertEqual(response.status_code, expected_status)

    def check_all_clients_can_make_request(self, clients, url, request_type, expected_status, data=None):
        for client in clients:
            self.make_request_and_check_response_status(client, url, request_type, expected_status, data)

    def test_getting_games__allowed_all(self):
        self.check_all_clients_can_make_request(self.clients, APIUrls.GET_GAMES_URL, 'GET', status.HTTP_200_OK)
        self.check_all_clients_can_make_request(self.clients, APIUrls.SINGLE_GAME(Game.objects.first().slug),
                                                'GET', status.HTTP_200_OK)

    def test_create_update_delete_games__allowed_to_admin_manager(self):
        # Testing user and anonymous user permissions
        self.check_all_clients_can_make_request([self.user, self.anonymous_client], APIUrls.GET_GAMES_URL, 'POST',
                                                status.HTTP_403_FORBIDDEN)

        for method in ['PUT', 'DELETE']:
            self.check_all_clients_can_make_request([self.user, self.anonymous_client],
                                                    APIUrls.SINGLE_GAME(Game.objects.first().slug),
                                                    method, status.HTTP_403_FORBIDDEN)
        # Testing admin permissions
        self.make_request_and_check_response_status(self.admin, APIUrls.GET_GAMES_URL, 'POST', status.HTTP_201_CREATED,
                                                    data={'title': 'Just title', 'price': 100.00})
        self.make_request_and_check_response_status(self.admin, APIUrls.SINGLE_GAME(Game.objects.first().slug), 'PUT',
                                                    status.HTTP_200_OK,
                                                    data={'title': 'New title'})
        self.make_request_and_check_response_status(self.admin, APIUrls.SINGLE_GAME(Game.objects.first().slug),
                                                    'DELETE',
                                                    status.HTTP_204_NO_CONTENT)

        # Testing manager permissions
        self.make_request_and_check_response_status(self.manager, APIUrls.GET_GAMES_URL, 'POST',
                                                    status.HTTP_201_CREATED,
                                                    data={'title': 'Just some title', 'price': 100.00})
        self.make_request_and_check_response_status(self.manager, APIUrls.SINGLE_GAME(Game.objects.first().slug), 'PUT',
                                                    status.HTTP_200_OK,
                                                    data={'title': 'New title'})
        self.make_request_and_check_response_status(self.manager, APIUrls.SINGLE_GAME(Game.objects.first().slug),
                                                    'DELETE',
                                                    status.HTTP_204_NO_CONTENT)

    def test_getting_comments__allowed_all(self):
        self.check_all_clients_can_make_request(self.clients, APIUrls.TOP_LEVEL_COMMENTS_URL(self.game.slug),
                                                'GET', status.HTTP_200_OK)

    def test_deleting_comments__allowed_owner_manager_admin(self):
        for client in [self.user, self.admin, self.manager]:
            self.make_request_and_check_response_status(client, APIUrls.MANAGE_COMMENT_URL(self.user_comment.id),
                                                        'DELETE', status.HTTP_204_NO_CONTENT)
            self.user_comment = Comment.objects.create(user=self.user_model, body='Some body!', game=self.game)

        self.make_request_and_check_response_status(self.anonymous_client,
                                                    APIUrls.MANAGE_COMMENT_URL(self.user_comment.id),
                                                    'DELETE', status.HTTP_403_FORBIDDEN)

        for client in [self.admin, self.manager]:
            self.make_request_and_check_response_status(client, APIUrls.MANAGE_COMMENT_URL(self.admin_comment.id),
                                                        'DELETE', status.HTTP_204_NO_CONTENT)
            self.admin_comment = Comment.objects.create(user=self.admin_model, body='Some body!', game=self.game)

        self.make_request_and_check_response_status(self.user, APIUrls.MANAGE_COMMENT_URL(self.admin_comment.id),
                                                    'DELETE', status.HTTP_403_FORBIDDEN)

    def editing_comment__allowed_only_owner(self):
        self.check_all_clients_can_make_request([self.admin, self.manager, self.anonymous_client],
                                                APIUrls.MANAGE_COMMENT_URL(self.user_comment.id),
                                                'PUT', status.HTTP_403_FORBIDDEN, {'body': 'doesnt matter'})

        self.make_request_and_check_response_status(self.user, APIUrls.MANAGE_COMMENT_URL(self.user_comment.id),
                                                    'PUT', status.HTTP_200_OK, {'body': 'and this is matter'})

    def test_posting_comments__allowed_user_manager_admin(self):
        self.check_all_clients_can_make_request([self.user, self.admin, self.manager],
                                                APIUrls.POST_COMMENT_URL,
                                                'POST', status.HTTP_201_CREATED,
                                                {'body': 'Just some body', 'game_slug': self.game.slug})

        self.make_request_and_check_response_status(self.anonymous_client, APIUrls.POST_COMMENT_URL,
                                                    'POST', status.HTTP_403_FORBIDDEN,
                                                    {'body': 'Just some body', 'game_slug': self.game.slug})

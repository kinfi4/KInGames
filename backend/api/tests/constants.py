from unittest import mock

from django.urls import reverse


class TestData:
    TEST_USERNAME = 'test_name'
    TEST_USER_PASSWORD = '12345678'

    TEST_GAMES_FIELDS = ['title', 'description', 'slug']

    TEST_CATEGORIES_DATA = [
        {
            'name': 'Strategy',
            'slug': 'strategy'
        },
        {
            'name': 'action',
            'slug': 'action'
        },
        {
            'name': 'adventure',
            'slug': 'adventure'
        }
    ]

    TEST_GAMES_DATA = [
        {
            'title': 'The Witcher 3',
            'description': 'Just some text around here',
            'price': '234.39',
            'slug': 'witcher3'
        },
        {
            'title': 'Test game',
            'description': 'Just some test text',
            'price': '222.39',
            'slug': 'test_game'
        },
        {
            'title': 'Another test game',
            'description': 'Just some text around here',
            'price': '333.00',
            'slug': 'another_test'
        },
        {
            'title': 'And another',
            'description': 'Just some test text',
            'price': '12.50',
            'slug': 'and_another_test'
        }
    ]

    TEST_USERS_DATA = [
        {
            'username': 'tom',
            'password': '1234',
            'first_name': 'Tom',
            'last_name': 'Marinavich',
        },
        {
            'username': 'sam',
            'password': '1234',
            'first_name': 'Sam',
            'last_name': 'Marinski',
        },
        {
            'username': 'mark',
            'password': '1234',
            'first_name': 'Mark',
            'last_name': 'Makarov',
        }
    ]

    TEST_TOP_LEVEL_COMMENTS = [
        {
            'body': 'Some test body'
        },
        {
            'body': 'Another body'
        },
        {
            'body': 'And another'
        },
        {
            'body': 'And another again'
        },
    ]

    TEST_REPLIED_COMMENTS = [
        {'body': 'Some replied body'}, {'body': 'Some more body'}
    ]


class APIUrls:
    GET_GAMES_URL = reverse('list_games')
    USER_CONFIG_URL = reverse('user')
    POST_COMMENT_URL = reverse('comments')

    @staticmethod
    def SINGLE_GAME(slug):
        return reverse('single_game', args=(slug,))

    @staticmethod
    def TOP_LEVEL_COMMENTS_URL(slug):
        return f'{reverse("comments")}?game_slug={slug}'

    @staticmethod
    def GET_SINGLE_COMMENT_URL(pk):
        return reverse('single_comment', args=(pk,))

    @staticmethod
    def MANAGE_COMMENT_URL(pk):
        return reverse('manage_comment', args=(pk,))

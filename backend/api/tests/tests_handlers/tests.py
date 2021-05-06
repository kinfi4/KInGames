from django.test import TestCase
from django.core.exceptions import ObjectDoesNotExist
from ddt import ddt, data, unpack

from api.handlers import get_list_games, delete_game_by_slug, get_game_by_slug, create_game, delete_user, \
    create_default_kin_user, get_list_users, get_user_cart_size, user_has_cart, delete_comment, \
    add_game_to_cart, remove_game_from_cart, add_comment, get_user_cart, get_comment_by_id, \
    get_game_top_level_comments, get_top_level_comment_replies
from api.models import Game, Category, User, KinGamesUser, Cart, CartGame, Comment
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


class TestCartHandlers(TestCase):
    def setUp(self) -> None:
        Game.objects.bulk_create([Game(**game_data) for game_data in TestData.TEST_GAMES_DATA])
        self.user = User.objects.create_user(username=TestData.TEST_USERNAME, password=TestData.TEST_USER_PASSWORD)

    def test_getting_user_cart_size_handler__and_user_has_cart_handler__no_cart_at_the_begging_then_we_add_cart(self):
        cart_filter = {'user': self.user}
        size = get_user_cart_size(**cart_filter)

        self.assertEqual(size, 0)
        self.assertFalse(user_has_cart(**cart_filter))

        cart = Cart.objects.create(user=self.user)
        game = Game.objects.first()
        CartGame.objects.create(game=game, cart=cart, final_price=game.price)

        cart.total_products += 1
        cart.save(update_fields=['total_products'])

        size = get_user_cart_size(**cart_filter)
        self.assertEqual(size, 1)
        self.assertTrue(user_has_cart(**cart_filter))

    def test_creating_user_cart(self):
        cart_filter = {'user': self.user}

        self.assertFalse(Cart.objects.filter(user=self.user).exists())
        get_user_cart(**cart_filter)
        self.assertTrue(Cart.objects.filter(user=self.user).exists())

    def test_managing_cart__adding_game_to_cart__removing_game_from_cart(self):
        cart_game_filter, cart_filter = {'cart__user': self.user}, {'user': self.user}

        Cart.objects.create(**cart_filter)

        game1 = Game.objects.all()[0]
        game2 = Game.objects.all()[1]

        add_game_to_cart(game1.slug, cart_filter, cart_game_filter)

        cart = Cart.objects.get(user=self.user)
        self.assertEqual(cart.total_products, 1)
        self.assertEqual(cart.final_price, game1.price)

        add_game_to_cart(game2.slug, cart_filter, cart_game_filter)
        add_game_to_cart(game2.slug, cart_filter, cart_game_filter)

        cart = Cart.objects.get(user=self.user)
        self.assertEqual(cart.total_products, 3)
        self.assertEqual(cart.final_price, game1.price + game2.price * 2)

        remove_game_from_cart(game2.slug, True, **cart_game_filter)

        cart = Cart.objects.get(user=self.user)
        self.assertEqual(cart.total_products, 1)
        self.assertEqual(cart.final_price, game1.price)

        remove_game_from_cart(game1.slug, False, **cart_game_filter)

        cart = Cart.objects.get(user=self.user)
        self.assertEqual(cart.total_products, 0)
        self.assertEqual(cart.final_price, 0)


class TestCommentsHandlers(TestCase):
    TEST_GAME_SLUG = 'TEST_SLUG'
    COMMENTS_BODIES = ['Some body1', 'Some body2', 'Some body3']

    def setUp(self) -> None:
        self.users = User.objects.bulk_create([User(**user_data) for user_data in TestData.TEST_USERS_DATA])
        for user in self.users:
            KinGamesUser.objects.create(django_user=user)

        self.game = Game.objects.create(slug=self.TEST_GAME_SLUG, price=333)

        self.top_level_comments = Comment.objects.bulk_create(
            [Comment(game=self.game, user=self.users[user_index], body=body) for body, user_index in
             zip(self.COMMENTS_BODIES, range(3))]
        )

        Comment.objects.create(game=self.game, user=self.users[0], body='Reply',
                               top_level_comment=self.top_level_comments[-1])

    def test_adding_comments(self):
        comments_number = Comment.objects.count()
        self.assertEqual(comments_number, 4)

        comment_body = 'Here we go'
        add_comment(self.users[0].username, self.game.slug, body=comment_body)

        comments = Comment.objects.values_list('body')
        self.assertIn(comment_body, [comment_body[0] for comment_body in comments])

    def test_removing_comments(self):
        comments_number = Comment.objects.count()
        self.assertEqual(comments_number, 4)

        comment = Comment.objects.first()
        comment_body = comment.body
        delete_comment(comment.id)

        comments = Comment.objects.values_list('body')
        self.assertNotIn(comment_body, [comment_body[0] for comment_body in comments])

    def test_getting_comment_by_id(self):
        first_comment = Comment.objects.first()

        self.assertEqual(get_comment_by_id(first_comment.id), first_comment)

    def test_getting_top_level_comments(self):
        db_comments = Comment.objects.filter(top_level_comment=None)
        handler_comments = get_game_top_level_comments(self.game.slug)

        self.assertListEqual(list(db_comments), list(handler_comments))

    def test_getting_comments_replies(self):
        first_comment = Comment.objects.filter(body=self.COMMENTS_BODIES[-1]).first()
        self.assertListEqual(list(first_comment.inner_comments.all()),
                             list(get_top_level_comment_replies(first_comment.id)))

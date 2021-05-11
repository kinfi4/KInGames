import os
import glob
from random import choice

from django.db.utils import IntegrityError
from django.conf import settings

from api.models import User, KinGamesUser, USER, MANAGER, Game, Category
from api.utils.create_random_string import generate_random_string
from api.utils.generate_slug import generate_slug_from_title

USER_NAMES = """Gaynelle Coffee 
Alesia Newbill 
Katy Mccasland 
Ollie Demos 
Mose Yao 
Elba Scheff 
Malinda Bolen 
Odell Gatchell 
Cesar Cuddy 
Kimi Granville 
Della Bonifacio 
Gail Schill 
Bernadette Dyess 
Joye Bachman 
Aletha Clower 
Lu Boivin 
Casimira Rego 
Noble Woolridge 
Cathi Dobrowolski 
Tricia Mandelbaum 
Leda Lykins 
Kendal Oltman 
Shelby Mickley 
Kathrin Yau 
Annamarie Voris 
Zella Holt 
Dane Heckard 
Toby Tassin 
Suellen Derose 
Samual Estes 
Noelle Ricotta 
Nelida Schlemmer 
Marlen Debartolo 
Lucas Litton 
Elbert Mckitrick 
Mariella Buchholz 
Angelita Love 
Carli Chappell 
Cristopher Hawker 
Pearlie Taggert 
Rochel Small 
Stuart Roller 
Shalonda Grado 
Davida Recker 
Dell Temples 
Carolee Averette 
Michaele Dobbin 
Alene Heitman 
Francesca Peeples 
Aurora Ferreri"""

ROLES = [USER, MANAGER]

DESCRIPTION_TEXT = 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using, making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for  will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).'

GAMES = [
    {
        'title': 'Enlisted',
        'preview_image': 'games_previews/img.png',
        'price': 120.99,
        'categories': ['Action', 'Rpg', 'Simulator']
    },
    {
        'title': 'War Thunder',
        'preview_image': 'games_previews/img_1.png',
        'price': 222.99,
        'categories': ['Action', 'Rpg', 'Simulator']
    },
    {
        'title': 'Call of Duty Modern Warfare 2',
        'preview_image': 'games_previews/img_2.png',
        'price': 100.50,
        'categories': ['Action', '1st Person']
    },
    {
        'title': 'Fights in Tight Spaces',
        'preview_image': 'games_previews/img_3.png',
        'price': 99.50,
        'categories': ['Action', 'Fighting']
    },
    {
        'title': 'Black Desert',
        'preview_image': 'games_previews/img_4.png',
        'price': 99.50,
        'categories': ['Action', 'Rpg']
    },
    {
        'title': 'Black Desert',
        'preview_image': 'games_previews/img_5.png',
        'price': 88.90,
        'categories': ['Action', 'Rpg', 'Simulator']
    },
    {
        'title': 'The Witcher 3: Wild Hunt',
        'preview_image': 'games_previews/1.jpg',
        'price': 999.90,
        'categories': ['Action', 'Rpg', 'Adventure']
    },
    {
        'title': 'Assassin Creed Valhalla',
        'preview_image': 'games_previews/assasin.jpg',
        'price': 999.90,
        'categories': ['Action', 'Rpg', 'Adventure', 'Stealth']
    },
    {
        'title': 'Cyberpunk 2077',
        'preview_image': 'games_previews/Обложка_компьютерной_игры_Cyberpunk_2077.jpg',
        'price': 120.60,
        'categories': ['Action', 'Rpg', 'Adventure', '1st Person']
    },
    {
        'title': 'Resident Evil Village',
        'preview_image': 'games_previews/img_6.png',
        'price': 444.00,
        'categories': ['Horror', '1st Person']
    },
    {
        'title': 'TOTAL WAR: ROME REMASTERED',
        'preview_image': 'games_previews/img_7.png',
        'price': 666.00,
        'categories': ['Adventure', 'Strategy']
    },
    {
        'title': 'DAYS GONE',
        'preview_image': 'games_previews/img_8.png',
        'price': 120.00,
        'categories': ['Adventure', 'Action']
    },
    {
        'title': 'DOOM ETERNAL – DELUXE EDITION',
        'preview_image': 'games_previews/img_9.png',
        'price': 999.00,
        'categories': ['Action']
    },
    {
        'title': 'DYING LIGHT 2',
        'preview_image': 'games_previews/img_10.png',
        'price': 99.99,
        'categories': ['Action', 'Zombie', 'Rpg', '1st Person', 'Adventure']
    },
    {
        'title': 'DYING LIGHT',
        'preview_image': 'games_previews/img_11.png',
        'price': 99.99,
        'categories': ['Action', 'Zombie', 'Rpg', '1st Person', 'Adventure']
    },
    {
        'title': 'CONTROL ULTIMATE EDITION',
        'preview_image': 'games_previews/img_12.png',
        'price': 100.99,
        'categories': ['Action', 'Adventure']
    },
    {
        'title': 'DEATH STRANDING',
        'preview_image': 'games_previews/img_13.png',
        'price': 199.99,
        'categories': ['Action', 'Adventure']
    },
    {
        'title': 'DESTINY 2: BEYOND LIGHT',
        'preview_image': 'games_previews/img_14.png',
        'price': 111.99,
        'categories': ['Action', 'Adventure']
    },
    {
        'title': 'MUDRUNNER',
        'preview_image': 'games_previews/img_15.png',
        'price': 333.50,
        'categories': ['Simulator']
    },
    {
        'title': 'TERRARIA',
        'preview_image': 'games_previews/img_16.png',
        'price': 333.50,
        'categories': ['Action', 'Rpg', 'Adventure']
    },
    {
        'title': 'DARK SOULS III',
        'preview_image': 'games_previews/img_17.png',
        'price': 234.50,
        'categories': ['Action', 'Adventure']
    },
    {
        'title': 'TOTAL WAR: WARHAMMER III',
        'preview_image': 'games_previews/img_18.png',
        'price': 66.50,
        'categories': ['Action', 'Adventure', 'Strategy']
    },
    {
        'title': 'THE ELDER SCROLLS V: SKYRIM',
        'preview_image': 'games_previews/img_19.png',
        'price': 332.50,
        'categories': ['Adventure', 'Rpg']
    },
    {
        'title': 'RESIDENT EVIL 4',
        'preview_image': 'games_previews/img_20.png',
        'price': 129.50,
        'categories': ['Adventure', 'Horror']
    },
    {
        'title': 'S.T.A.L.K.E.R.: CALL OF PRIPYAT',
        'preview_image': 'games_previews/img_21.png',
        'price': 77.10,
        'categories': ['Adventure', 'Horror', 'Action', 'Rpg']
    },
    {
        'title': 'NEED FOR SPEED: RIVALS',
        'preview_image': 'games_previews/img_22.png',
        'price': 200.00,
        'categories': ['Race']
    },
    {
        'title': 'SQUAD',
        'preview_image': 'games_previews/img_23.png',
        'price': 199.00,
        'categories': ['Strategy', 'Action']
    },
    {
        'title': 'DRAGON AGE 2',
        'preview_image': 'games_previews/img_24.png',
        'price': 197.00,
        'categories': ['Rpg', 'Action', 'Adventure']
    },
    {
        'title': 'TITANFALL 2',
        'preview_image': 'games_previews/img_25.png',
        'price': 197.00,
        'categories': ['Action']
    },
    {
        'title': 'DEAD BY DAYLIGHT',
        'preview_image': 'games_previews/img_26.png',
        'price': 230.00,
        'categories': ['Action']
    },
    {
        'title': 'DARKSIDERS WARMASTERED',
        'preview_image': 'games_previews/img_27.png',
        'price': 230.00,
        'categories': ['Rpg', 'Action', 'Adventure']
    },
    {
        'title': 'STELLARIS: NEMESIS',
        'preview_image': 'games_previews/img_28.png',
        'price': 500.00,
        'categories': ['Strategy', 'Simulator']
    },
    {
        'title': 'FIFA 2021',
        'preview_image': 'games_previews/img_29.png',
        'price': 123.00,
        'categories': ['Sport', 'Simulator']
    },
    {
        'title': 'PROTOTYPE 2',
        'preview_image': 'games_previews/img_30.png',
        'price': 444.00,
        'categories': ['Action', 'Adventure']
    },
    {
        'title': 'MASS EFFECT',
        'preview_image': 'games_previews/img_31.png',
        'price': 746.00,
        'categories': ['Action', 'Rpg']
    },
    {
        'title': 'METRO EXODUS',
        'preview_image': 'games_previews/img_32.png',
        'price': 77.00,
        'categories': ['Action']
    },
    {
        'title': 'FAR CRY 5',
        'preview_image': 'games_previews/img_33.png',
        'price': 99.00,
        'categories': ['Action', 'Adventure']
    },
    {
        'title': 'TEKKEN 7',
        'preview_image': 'games_previews/img_34.png',
        'price': 100.00,
        'categories': ['Fighting', 'Sport']
    },
    {
        'title': 'HITMAN: ABSOLUTION',
        'preview_image': 'games_previews/img_35.png',
        'price': 100.00,
        'categories': ['Action']
    },
    {
        'title': 'KILLING FLOOR 2',
        'preview_image': 'games_previews/img_36.png',
        'price': 10.00,
        'categories': ['Action', 'Fighting']
    },
    {
        'title': 'HORIZON ZERO DAWN',
        'preview_image': 'games_previews/img_37.png',
        'price': 999.00,
        'categories': ['Action', 'Rpg']
    },
    {
        'title': 'DISHONORED 2',
        'preview_image': 'games_previews/img_38.png',
        'price': 888.00,
        'categories': ['Action']
    },
    {
        'title': 'RISEN',
        'preview_image': 'games_previews/img_39.png',
        'price': 299.00,
        'categories': ['Rpg']
    },
    {
        'title': 'THE DARKNESS II',
        'preview_image': 'games_previews/img_40.png',
        'price': 299.00,
        'categories': ['Rpg', 'Action']
    },
    {
        'title': 'BATTLEFIELD 3',
        'preview_image': 'games_previews/img_41.png',
        'price': 300.00,
        'categories': ['Action']
    },
]

CATEGORIES = ['Action', 'Race', 'Zombie', 'Stealth', 'Rpg', 'Horror', 'Fighting', 'Arcade', 'Sport', 'Strategy',
              'Simulation', 'Adventure', '1st Person']


def create_users():
    avatars = glob.glob(os.path.join(settings.MEDIA_ROOT, 'user_avatars/img*.png'))

    for full_name, avatar in zip(USER_NAMES.split('\n'), avatars):
        try:
            user = User.objects.create_user(
                username=full_name.replace(' ', '').lower(),
                password=generate_random_string(7),
                first_name=full_name.split()[0],
                last_name=full_name.split()[1])

            avatar_file = os.path.join('user_avatars', os.path.split(avatar)[-1])
            KinGamesUser.objects.get_or_create(django_user_id=user.id, avatar=avatar_file, role=choice(ROLES))
        except IntegrityError:
            pass


def create_categories():
    for category_name in CATEGORIES:
        try:
            Category.objects.create(name=category_name, slug=category_name.lower())
        except IntegrityError:
            pass


def create_games():
    create_categories()

    for game_data in GAMES:
        try:
            categories = game_data.pop('categories')
            game = Game.objects.create(slug=generate_slug_from_title(game_data.get('title')),
                                       description=DESCRIPTION_TEXT, **game_data)

            game.categories.set(Category.objects.filter(name__in=categories))
            game.save()
        except IntegrityError:
            pass




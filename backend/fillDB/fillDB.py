import os
import glob
from random import choice

from django.db.utils import IntegrityError
from django.conf import settings

from api.models import User, KinGamesUser, USER, MANAGER
from api.utils.create_random_string import generate_random_string

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

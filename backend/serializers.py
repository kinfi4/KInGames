from rest_framework import serializers

from api.models import Cart, CartGame, Game, KinGamesUser, User, Category, Comment


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ('name', 'slug')


class KinUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = KinGamesUser
        fields = '__all__'


class UserSerializer(serializers.ModelSerializer):
    kin_user = KinUserSerializer(required=False)

    class Meta:
        model = User
        fields = ('username', 'first_name', 'second_name')



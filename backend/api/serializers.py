from rest_framework import serializers

from api.handlers import create_game, add_categories_for_game_creation
from api.models import Cart, CartGame, Game, KinGamesUser, User, Category, Comment


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ('name', 'slug')

    def save(self, **kwargs):
        super().save(**kwargs)


class KinUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = KinGamesUser
        fields = '__all__'


class UserSerializer(serializers.ModelSerializer):
    kin_user = KinUserSerializer(required=False)

    class Meta:
        model = User
        fields = ('username', 'first_name', 'second_name')


class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = '__all__'


class GetGameSerializer(serializers.Serializer):
    title = serializers.CharField(max_length=255)
    description = serializers.CharField()
    preview_image = serializers.ImageField()
    price = serializers.DecimalField(max_digits=7, decimal_places=2)
    slug = serializers.SlugField()

    categories = CategorySerializer(many=True)

    def update(self, instance, validated_data):
        pass

    def create(self, validated_data):
        pass


class CreateGameSerializer(serializers.Serializer):
    title = serializers.CharField(max_length=255, required=True)
    description = serializers.CharField(required=False)
    preview_image = serializers.ImageField(required=False, allow_null=True)
    price = serializers.DecimalField(max_digits=7, decimal_places=2, required=True)

    categories = CategorySerializer(many=True)

    def create(self, validated_data: dict):
        categories_raw = validated_data.pop('categories', [])
        game = create_game(**validated_data)

        add_categories_for_game_creation(categories_raw, game)

        return game

    def update(self, instance, validated_data):
        pass


class UpdateGameSerializer(serializers.Serializer):
    title = serializers.CharField(max_length=255, required=False)
    description = serializers.CharField(required=False)
    preview_image = serializers.ImageField(required=False, allow_null=True)
    price = serializers.DecimalField(max_digits=7, decimal_places=2, required=True)

    categories = CategorySerializer(many=True)

    def create(self, validated_data):
        pass

    def update(self, instance: Game, validated_data: dict):
        add_categories_for_game_creation(validated_data.pop('categories', []), instance)
        instance.__dict__.update(**validated_data)
        instance.save()

        return instance

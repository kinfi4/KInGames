import logging
from math import ceil

from rest_framework import status
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView
from django.core.exceptions import ObjectDoesNotExist
from django.db import IntegrityError
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from django.conf import settings

from api.handlers import get_list_games, delete_game_by_slug, get_game_by_slug, get_list_games_with_categories, \
    get_number_of_games
from api.serializers import GetGameSerializer, CreateGameSerializer, UpdateGameSerializer
from api.permissions import IsManagerOrAdminOrReadonly

logger = logging.Logger(__name__)


class GamesListView(APIView):
    permission_classes = [IsManagerOrAdminOrReadonly]

    def get(self, request: Request):
        try:
            page = int(request.query_params.get('page', 0))
        except ValueError:
            return Response(status=status.HTTP_400_BAD_REQUEST, data={'error': 'Page must be an integer'})

        categories = request.query_params.get('category', '').split('%')
        title = request.query_params.get('title', '')

        filters = {}
        if title:
            filters['title__icontains'] = title

        if categories[0]:
            games = get_list_games_with_categories(categories, skip=page * settings.PAGE_SIZE, **filters)
        else:
            games = get_list_games(skip=page * settings.PAGE_SIZE, **filters)

        games_serialized = GetGameSerializer(games, many=True)

        response_data = {
            'games': games_serialized.data,
            'pagination': {
                'current_page': page + 1,
                'last_page': ceil(get_number_of_games() / settings.PAGE_SIZE)
            }
        }

        return Response(status=status.HTTP_200_OK, data=response_data)

    def post(self, request: Request):
        game_serialized = CreateGameSerializer(data=request.data)

        if game_serialized.is_valid():
            try:
                game_serialized.save()
            except IntegrityError:
                return Response(status=status.HTTP_400_BAD_REQUEST,
                                data={'errors': 'Game with this title already exists'})

            return Response(status=status.HTTP_201_CREATED, data=game_serialized.data)

        logger.warning(f'User {request.user.username} invalid input errors: {game_serialized.errors}')
        return Response(status=status.HTTP_400_BAD_REQUEST, data=game_serialized.errors)


class GameView(APIView):
    permission_classes = [IsManagerOrAdminOrReadonly, IsAuthenticatedOrReadOnly]

    @staticmethod
    def _get_game(slug):
        try:
            return get_game_by_slug(slug)
        except ObjectDoesNotExist:
            return None

    def get(self, request: Request, slug):
        if not (game := self._get_game(slug)):
            return Response(status=status.HTTP_404_NOT_FOUND, data={'error': f'There is no game with slug = {slug}'})

        game_serialized = GetGameSerializer(game)
        return Response(status=status.HTTP_200_OK, data=game_serialized.data)

    def put(self, request: Request, slug):
        if not (game := self._get_game(slug)):
            return Response(status=status.HTTP_404_NOT_FOUND, data={'error': f'There is no game with slug = {slug}'})

        game_serialized = UpdateGameSerializer(game, data=request.data)
        if game_serialized.is_valid():
            game_serialized.save()
            return Response(data=game_serialized.data)

        logger.warning(f'User {request.user.username} invalid input errors: {game_serialized.errors}')
        return Response(status=status.HTTP_400_BAD_REQUEST, data=game_serialized.errors)

    def delete(self, request: Request, slug):
        try:
            delete_game_by_slug(slug)
        except AttributeError:  # use AttributeError because in handler method delete evoke on None, if game not exist
            return Response(status=status.HTTP_404_NOT_FOUND, data={'error': f'There is no game with slug = {slug}'})

        return Response(status=status.HTTP_204_NO_CONTENT)

# {
# "title": "Test title",
#   "description": "t is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).",
#         "price": "150.00",
# "categories": [{"slug": "rpg"}, {"slug": "strategy"}]
# }

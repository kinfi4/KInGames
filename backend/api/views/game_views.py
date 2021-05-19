import logging
import math

from rest_framework import status
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView
from django.core.exceptions import ObjectDoesNotExist
from django.db import IntegrityError
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from django.conf import settings

from api.handlers import get_list_games, delete_game_by_slug, get_game_by_slug, get_list_games_with_categories, \
    get_number_of_games, get_number_of_games_filtered_with_categories, change_game_hidden, add_mark_to_the_game, \
    get_user_mark_and_number_of_marks_for_game, get_number_of_marks_for_game
from api.serializers import GetGameSerializer, CreateGameSerializer, UpdateGameSerializer
from api.permissions import IsManagerOrAdminOrReadonly
from api.models import ORDER_BY_NUM_COMMENTS

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
        order_by = request.query_params.get('order_by', ORDER_BY_NUM_COMMENTS)

        filters = {}
        if title:
            filters['title__icontains'] = title

        if categories[0]:
            games = get_list_games_with_categories(categories, order_by=order_by, skip=page * settings.PAGE_SIZE,
                                                   **filters)
            games_number = get_number_of_games_filtered_with_categories(categories, **filters)
        else:
            games = get_list_games(order_by=order_by, skip=page * settings.PAGE_SIZE, **filters)
            games_number = get_number_of_games(**filters)

        games_serialized = GetGameSerializer(games, many=True)

        response_data = {
            'games': games_serialized.data,
            'pagination': {
                'current_page': page + 1,
                'last_page': math.ceil(games_number / settings.PAGE_SIZE)
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


class HideGameView(APIView):
    permission_classes = [IsManagerOrAdminOrReadonly]

    def post(self, request: Request, slug):
        try:
            change_game_hidden(slug)
        except ObjectDoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        return Response(status=status.HTTP_200_OK)


class GameMark(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request: Request, slug):
        if request.user.is_anonymous:
            data = get_number_of_marks_for_game(slug)
            avg_mark = data.get('avg_mark') if data.get('avg_mark') is not None else 0.0
            return Response(data={'estimated_times': data.get('estimated_times'), 'avg_mark': avg_mark})

        try:
            data = get_user_mark_and_number_of_marks_for_game(request.user, slug)
            avg_mark = data.avg_mark if data.avg_mark is not None else 0.0
            return Response(
                data={'user_mark': data.mark, 'estimated_times': data.estimated_times, 'avg_mark': avg_mark})
        except ObjectDoesNotExist:
            data = get_number_of_marks_for_game(slug)
            avg_mark = data.get('avg_mark') if data.get('avg_mark') is not None else 0.0
            return Response(data={'estimated_times': data.get('estimated_times'), 'avg_mark': avg_mark})

    def post(self, request: Request, slug):
        mark = request.data.get('mark')

        if not (10 >= mark >= 0):
            return Response(status=status.HTTP_400_BAD_REQUEST,
                            data={'errors': 'Invalid mark, the mark must be between 0 and 10'})

        new_avg = add_mark_to_the_game(slug, request.user, mark)
        return Response(data=new_avg)

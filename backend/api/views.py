from rest_framework import status
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from api.handlers import get_list_games
from api.serializers import GetGameSerializer


class GamesListView(APIView):
    def get(self, request: Request):
        try:
            page = int(request.query_params.get('page', 0))
        except ValueError:
            return Response(status=status.HTTP_400_BAD_REQUEST, data={'error': 'Page must be an integer'})

        categories = request.query_params.get('category', '').split('%')

        filters = {}
        if categories[0]:
            filters['categories__in'] = categories

        games = get_list_games(skip=page, **filters)
        games_serialized = GetGameSerializer(games, many=True)

        return Response(status=status.HTTP_200_OK, data=games_serialized.data)

    def post(self, request: Request):
        pass


class GameView(APIView):
    def get(self, request: Request):
        pass

    def put(self, request: Request):
        pass

    def delete(self, request: Request):
        pass

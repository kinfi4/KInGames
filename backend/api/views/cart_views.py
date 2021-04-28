from rest_framework.views import APIView
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework import status

from api.handlers import get_user_cart, add_game_to_cart, remove_game_from_cart, get_user_cart_size
from api.serializers import CartSerializer


class UserCartView(APIView):
    def get(self, request: Request):
        cart_filters = {}
        if not request.user:
            cart_filters['user_agent'] = request['userAgent']
            cart_filters['for_anonymous_user'] = True
        else:
            cart_filters['user'] = request.user

        cart = get_user_cart(**cart_filters)

        cart_serialized = CartSerializer(cart)
        return Response(data=cart_serialized.data)

    def post(self, request: Request):
        cart_game_filters = {}
        if request.user:
            cart_game_filters['cart__user'] = request.user
        else:
            cart_game_filters['cart__user_agent'] = request['userAgent']

        game_slug = request.data.get('game_slug', '')
        add = request.data.get('add', True)

        if not game_slug:
            return Response(status=status.HTTP_400_BAD_REQUEST,
                            data={'errors': 'You did not specify game, you want to add'})

        if add:
            add_game_to_cart(game_slug, **cart_game_filters)
        else:
            try:
                remove_game_from_cart(game_slug, **cart_game_filters)
            except ValueError:
                return Response(status=status.HTTP_400_BAD_REQUEST,
                                data={'errors': 'Cant remove game from the cart, there is no such game there'})

        return Response(status=status.HTTP_200_OK)


class UserCartSizeView(APIView):
    def get(self, request: Request):
        cart_filters = {}
        if not request.user:
            cart_filters['user_agent'] = request['userAgent']
            cart_filters['for_anonymous_user'] = True
        else:
            cart_filters['user'] = request.user

        cart_size = get_user_cart_size(**cart_filters)

        return Response(data={'size': cart_size})

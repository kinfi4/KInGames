import logging

from rest_framework.views import APIView
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework import status

from api.handlers import get_user_cart, add_game_to_cart, remove_game_from_cart, get_user_cart_size
from api.serializers import CartSerializer

logger = logging.Logger(__name__)


class UserCartView(APIView):
    def get(self, request: Request):
        cart_filters = {}
        if request.user.is_anonymous:
            cart_filters['user_agent'] = request.META.get('HTTP_USER_AGENT')
            cart_filters['for_anonymous_user'] = True
        else:
            cart_filters['user'] = request.user

        cart = get_user_cart(**cart_filters)

        cart_serialized = CartSerializer(cart)
        return Response(data=cart_serialized.data)

    def post(self, request: Request):
        cart_game_filter, cart_filter = {}, {}

        if not request.user.is_anonymous:
            cart_game_filter['cart__user'] = request.user
            cart_filter['user'] = request.user
        else:
            cart_game_filter['cart__user_agent'] = request.META.get('HTTP_USER_AGENT')
            cart_filter['user_agent'] = request.META.get('HTTP_USER_AGENT')

        game_slug = request.data.get('game_slug', '')
        add = request.data.get('add', True)
        remove_whole_row = request.data.get('remove_whole_row', False)

        if not game_slug:
            return Response(status=status.HTTP_400_BAD_REQUEST,
                            data={'errors': 'You did not specify game, you want to add'})

        if add:
            add_game_to_cart(game_slug, cart_filter, cart_game_filter)
        else:
            try:
                remove_game_from_cart(game_slug, remove_whole_row, **cart_game_filter)
            except ValueError as e:
                logger.warning(str(e))
                return Response(status=status.HTTP_400_BAD_REQUEST,
                                data={'errors': 'Cant remove game from the cart, there is no such game there'})

        return Response(status=status.HTTP_200_OK)


class UserCartSizeView(APIView):
    def get(self, request: Request):
        cart_filters = {}
        if request.user.is_anonymous:
            cart_filters['user_agent'] = request.META.get('HTTP_USER_AGENT')
            cart_filters['for_anonymous_user'] = True
        else:
            cart_filters['user'] = request.user

        cart_size = get_user_cart_size(**cart_filters)

        return Response(data={'size': cart_size})

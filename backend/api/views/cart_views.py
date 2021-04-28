from rest_framework.views import APIView
from rest_framework.request import Request
from rest_framework.response import Response

from api.handlers import get_user_cart, user_has_cart
from api.serializers import CartSerializer


class UserCartView(APIView):
    def get(self, request: Request):
        filters = {}
        if not request.user:
            filters['user_agent'] = request['userAgent']
            filters['for_anonymous_user'] = True
        else:
            filters['user'] = request.user

        cart = get_user_cart(**filters)

        cart_serialized = CartSerializer(cart)
        return Response(data=cart_serialized.data)

    def post(self, request: Request):
        pass

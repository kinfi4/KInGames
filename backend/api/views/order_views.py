from rest_framework import status
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from api.handlers import make_order
from api.exceptions import CantOrderEmptyCart


class ProceedOrderView(APIView):
    def post(self, request: Request):
        cart_filters = {}
        if request.user.is_anonymous:
            cart_filters['user_agent'] = request.META.get('HTTP_USER_AGENT')
            cart_filters['for_anonymous_user'] = True
        else:
            cart_filters['user'] = request.user

        try:
            make_order(**cart_filters)
        except CantOrderEmptyCart:
            return Response(status=status.HTTP_400_BAD_REQUEST, data={'errors': 'Cant make order with empty cart'})

        return Response(status=status.HTTP_200_OK)

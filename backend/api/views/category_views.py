from rest_framework import status
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from api.handlers import get_all_categories
from api.serializers import CategorySerializer
from api.permissions import IsManagerOrAdminOrReadonly


class CategoryListView(APIView):
    permission_classes = [IsManagerOrAdminOrReadonly]

    def get(self, request: Request):
        categories = get_all_categories()
        categories_serialized = CategorySerializer(categories, many=True)

        return Response(data=categories_serialized.data)

    def post(self, request: Request):
        category_serialized = CategorySerializer(data=request.data)

        if category_serialized.is_valid(raise_exception=True):
            category_serialized.save()
            return Response(data=category_serialized.data)

        return Response(status=status.HTTP_400_BAD_REQUEST, data=category_serialized.errors)

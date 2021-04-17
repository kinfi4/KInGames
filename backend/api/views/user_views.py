from rest_framework import status
from rest_framework.views import APIView
from rest_framework.request import Request
from rest_framework.response import Response

from api.serializers import UserSerializer
from api.handlers import create_default_kin_user, delete_user


class ConfigUserView(APIView):
    def get(self, request: Request):
        if not request.user or not request.user.is_authenticated:
            return Response(status=status.HTTP_404_NOT_FOUND, data={'error': 'User not found'})

        user_serialized = UserSerializer(request.user)
        return Response(data=user_serialized.data)

    def post(self, request: Request):
        if not request.user:
            return Response(status=status.HTTP_404_NOT_FOUND, data={'error': 'User not found'})

        create_default_kin_user(request.user)
        result = UserSerializer(request.user, data=request.data)

        if result.is_valid():
            result.save()
            return Response(status=status.HTTP_201_CREATED)

        print(result.errors)
        return Response(status=status.HTTP_400_BAD_REQUEST, data={'error': result.errors})

    def put(self, request: Request):
        if not request.user:
            return Response(status=status.HTTP_404_NOT_FOUND, data={'error': 'User not found'})

        updated_user = UserSerializer(request.user, data=request.data)

        if updated_user.is_valid():
            updated_user.save()
            return Response(data=updated_user.data)

        return Response(status=status.HTTP_400_BAD_REQUEST, data=updated_user.errors)

    def delete(self, request: Request):
        if not request.user:
            return Response(status=status.HTTP_404_NOT_FOUND, data={'error': 'User not found'})

        delete_user(request.user)
        return Response(status=status.HTTP_204_NO_CONTENT)

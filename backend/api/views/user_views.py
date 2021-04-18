from rest_framework import status
from rest_framework.views import APIView
from rest_framework.request import Request
from rest_framework.response import Response

from api.serializers import UserSerializer, KinUserSerializer
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

    @staticmethod
    def update__kin_user(user, request_data: dict):
        updated_data = {}

        role = request_data.get('role')
        if role:
            updated_data['role'] = role

        avatar = request_data.get('avatar')
        if avatar:
            updated_data['avatar'] = avatar

        if updated_data:
            updated_data['django_user'] = user.id

            result = KinUserSerializer(user.kin_user, data=updated_data)

            if result.is_valid():
                result.save()
                return

            print(result.errors)
            return result.errors

    def put(self, request: Request):
        if not request.user:
            return Response(status=status.HTTP_404_NOT_FOUND, data={'error': 'User not found'})

        updated__kin_user_errors = self.update__kin_user(request.user, request.data)
        updated_user = UserSerializer(request.user, data=request.data)

        if updated_user.is_valid():
            updated_user.save()
            return Response(data=updated_user.data)
        
        errors = updated_user.errors.update(updated__kin_user_errors)

        return Response(status=status.HTTP_400_BAD_REQUEST, data=errors)

    def delete(self, request: Request):
        if not request.user:
            return Response(status=status.HTTP_404_NOT_FOUND, data={'error': 'User not found'})

        delete_user(request.user)
        return Response(status=status.HTTP_204_NO_CONTENT)

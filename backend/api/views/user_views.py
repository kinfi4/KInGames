from rest_framework import status
from rest_framework.views import APIView
from rest_framework.request import Request
from rest_framework.response import Response
from django.core.exceptions import ObjectDoesNotExist

from api.serializers import UserSerializer, KinUserSerializer
from api.handlers import create_default_kin_user, delete_user, get_list_users, change_user_role
from api.permissions import IsAdmin
from api.models import MANAGER, USER


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

        print(updated_user.errors)
        errors = updated_user.errors.update(updated__kin_user_errors)

        return Response(status=status.HTTP_400_BAD_REQUEST, data=errors)

    def delete(self, request: Request):
        if not request.user:
            return Response(status=status.HTTP_404_NOT_FOUND, data={'error': 'User not found'})

        delete_user(request.user)
        return Response(status=status.HTTP_204_NO_CONTENT)


class ManageUsersForAdmin(APIView):
    permission_classes = [IsAdmin]

    def get(self, request: Request):
        name = request.query_params.get('name', '')

        filters = {}
        if name:
            filters['first_name'] = name
            filters['last_name'] = name

        users = get_list_users(**filters)
        users_serialized = UserSerializer(users, many=True)

        return Response(data=users_serialized.data)

    def post(self, request: Request):
        username = request.data.get('username', '')
        role = request.data.get('role', '')

        if not username or not role:
            return Response(status=status.HTTP_400_BAD_REQUEST,
                            data={'errors': 'username or new role for the user is not specified'})

        if role not in (MANAGER, USER):
            return Response(status=status.HTTP_400_BAD_REQUEST,
                            data={'errors': 'As a admin you can set user role as manager or simple user only'})

        try:
            change_user_role(username, role)
        except ObjectDoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        return Response(data={'message': 'Role changed successfully'})

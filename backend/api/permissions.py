from rest_framework.permissions import BasePermission, SAFE_METHODS
from rest_framework.request import Request

from api.models import ADMIN, MANAGER


class IsAdmin(BasePermission):
    def has_permission(self, request: Request, view):
        if request.user.is_anonymous:
            return False

        return request.user.kin_user.role == ADMIN


class IsManagerOrAdminOrReadonly(BasePermission):
    def has_permission(self, request: Request, view):
        if request.method in SAFE_METHODS:
            return True

        if request.user.is_anonymous:
            return False

        return request.method in SAFE_METHODS or request.user.kin_user.role in (ADMIN, MANAGER)


class CommentManagePermission(BasePermission):
    def has_object_permission(self, request: Request, view, obj):
        if request.method in SAFE_METHODS:
            return True

        if request.user.is_anonymous or (request.method == 'PUT' and request.user != obj.user):
            return False

        return request.user.kin_user.role in (ADMIN, MANAGER) or request.user == obj.user

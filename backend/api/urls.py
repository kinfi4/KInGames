from django.urls import path

from api.views.game_views import GamesListView, GameView
from api.views.user_views import ConfigUserView, ManageUsersForAdmin
from api.views.category_views import CategoryListView
from api.views.cart_views import UserCartView
from api.views.comments_views import ManageCommentView, TopLevelCommentsView


urlpatterns = [
    path('games', GamesListView.as_view(), name='list_games'),
    path('games/<str:slug>', GameView.as_view(), name='single_game'),
    path('user', ConfigUserView.as_view(), name='user'),
    path('categories', CategoryListView.as_view(), name='categories'),
    path('manage-users', ManageUsersForAdmin.as_view(), name='kin_users'),
    path('user-cart', UserCartView.as_view(), name='user_cart'),
    path('comments', TopLevelCommentsView.as_view(), name='comments'),
    path('comments/<int:pk>', ManageCommentView.as_view(), name='manage_comment')
]

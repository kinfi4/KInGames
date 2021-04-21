from django.urls import path

from api.views.game_views import GamesListView, GameView
from api.views.user_views import ConfigUserView
from api.views.category_views import CategoryListView


urlpatterns = [
    path('games', GamesListView.as_view(), name='list_games'),
    path('games/<str:slug>', GameView.as_view(), name='single_game'),
    path('user', ConfigUserView.as_view(), name='user'),
    path('categories', CategoryListView.as_view(), name='categories'),
]

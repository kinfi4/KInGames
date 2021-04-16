from django.urls import path

from api.views import GamesListView, GameView

urlpatterns = [
    path('games', GamesListView.as_view(), name='list_games'),
    path('games/<str:slug>', GameView.as_view(), name='single_game')
]

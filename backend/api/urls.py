from django.urls import path

from api.views import GamesListView

urlpatterns = [
    path('games', GamesListView.as_view(), name='list_games'),
]

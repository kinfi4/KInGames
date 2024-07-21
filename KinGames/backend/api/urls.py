from django.urls import path

from api.views import (
    GamesListView,
    GameView,
    HideGameView,
    ConfigUserView,
    CategoryListView,
    ManageUsersForAdmin,
    UserCartView,
    UserCartSizeView,
    TopLevelCommentsView,
    ManageCommentView,
    GetSingleCommentView,
    ProceedOrderView,
    GameMark
)


urlpatterns = [
    path('games', GamesListView.as_view(), name='list_games'),
    path('games/<str:slug>', GameView.as_view(), name='single_game'),
    path('hide-game/<str:slug>', HideGameView.as_view(), name='hide_game'),
    path('user', ConfigUserView.as_view(), name='user'),
    path('categories', CategoryListView.as_view(), name='categories'),
    path('manage-users', ManageUsersForAdmin.as_view(), name='kin_users'),
    path('user-cart', UserCartView.as_view(), name='user_cart'),
    path('cart-size', UserCartSizeView.as_view(), name='user_cart_size'),
    path('comments', TopLevelCommentsView.as_view(), name='comments'),
    path('comments/<int:pk>', ManageCommentView.as_view(), name='manage_comment'),
    path('get-comment/<int:pk>', GetSingleCommentView.as_view(), name='single_comment'),
    path('make-order', ProceedOrderView.as_view(), name='make_order'),
    path('estimate-game/<str:slug>', GameMark.as_view(), name='estimate_game'),
]

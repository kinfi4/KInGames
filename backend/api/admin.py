from django.contrib import admin
from api.models import Game, KinGamesUser, CartGame, Cart, Category, Comment


admin.site.register(Game)
admin.site.register(KinGamesUser)
admin.site.register(Category)
admin.site.register(Cart)
admin.site.register(CartGame)
admin.site.register(Comment)

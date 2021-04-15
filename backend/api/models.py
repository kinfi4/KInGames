from django.db import models
from django.contrib.auth.models import User


USER = 'USER'
MANAGER = 'MANAGER'
ADMIN = 'ADMIN'

ROLES = (
    (USER, 'Simple KinGames user'),
    (MANAGER, 'Manager'),
    (ADMIN, 'admin of the service')
)


class KinGamesUser(models.Model):
    django_user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='kin_user')
    avatar = models.ImageField(upload_to='user_avatars', default='user_avatars/default_avatar.png')
    role = models.CharField(max_length=10, choices=ROLES, default=USER)


class Category(models.Model):
    name = models.CharField(max_length=55)
    slug = models.SlugField(unique=True)


class Game(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    preview_image = models.ImageField(upload_to='games_previews', default='games_previews/default.png')
    price = models.DecimalField(max_digits=7, decimal_places=2)
    slug = models.SlugField(unique=True)

    categories = models.ManyToManyField(Category, related_name='games')


class Comment(models.Model):
    user = models.ForeignKey(KinGamesUser, on_delete=models.CASCADE, related_name='comments')
    game = models.ForeignKey(Game, on_delete=models.CASCADE, related_name='comments')
    body = models.CharField(max_length=600, default='None')
    created_at = models.DateTimeField(auto_now_add=True, null=True)


class Cart(models.Model):
    user = models.ForeignKey(KinGamesUser, null=True, on_delete=models.CASCADE, related_name='carts')
    user_agent = models.CharField(max_length=200, null=True, blank=True)
    for_anonymous_user = models.BooleanField(default=False)

    games = models.ManyToManyField(Game, related_name='related_carts', blank=True)
    total_products = models.PositiveIntegerField(default=1)
    final_price = models.DecimalField(max_digits=10, default=0, decimal_places=2)


class CartGame(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE)
    game = models.ForeignKey(Game, on_delete=models.CASCADE)
    qty = models.PositiveIntegerField(default=1, verbose_name='Number of products')
    final_price = models.DecimalField(max_digits=9, decimal_places=2)

    def __str__(self):
        return self.game.title

    def save(self, *args, **kwargs):
        self.final_price = self.qty * self.game.price
        super().save(*args, **kwargs)

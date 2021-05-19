from random import choice

from django.db import models
from django.contrib.auth.models import User
from PIL import Image

from api.utils.truncate_string import truncate_string

USER = 'USER'
MANAGER = 'MANAGER'
ADMIN = 'ADMIN'

ROLES = (
    (USER, 'Simple KinGames user'),
    (MANAGER, 'Manager'),
    (ADMIN, 'admin of the service')
)
COLORS = (
    ('#ffc6c6', 'Light red'),
    ('#81cdd5', 'Light blue'),
    ('#9bc17b', 'Light green'),
    ('#ffb876', 'Orange'),
    ('#ae81d5', 'Purple'),
    ('#e5b2da', 'Pink'),
    ('#ffce67', 'Yellow')
)
ORDER_BY_NUM_COMMENTS = 'commented_times'
ORDER_BY_POINTS = 'av_mark'
ORDER_BY_BOUGHT_TIMES = 'bought_times'


class KinGamesUser(models.Model):
    django_user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='kin_user')
    avatar = models.ImageField(upload_to='user_avatars', default='user_avatars/default_avatar.png')
    role = models.CharField(max_length=10, choices=ROLES, default=USER)
    name_color = models.CharField(max_length=100, choices=COLORS, default='#ffc6c6')

    def save(self, *args, **kwargs):
        self.name_color = choice(COLORS)[0]
        super(KinGamesUser, self).save(*args, **kwargs)

    def delete(self, *args):
        print('Deleting')
        self.avatar.delete()
        # self.avatar.storage.delete(self.avatar.name)
        super().delete(*args)

    def __str__(self):
        return self.django_user.username


class Category(models.Model):
    name = models.CharField(max_length=55, unique=True)
    slug = models.SlugField(unique=True)

    def __str__(self):
        return self.name


class Game(models.Model):
    title = models.CharField(max_length=255, db_index=True)
    description = models.TextField()
    preview_image = models.ImageField(upload_to='games_previews', default='games_previews/default.png')
    price = models.DecimalField(max_digits=7, decimal_places=2, db_index=True)
    slug = models.SlugField(unique=True, db_index=True)
    is_wide = models.BooleanField(default=False)
    hidden = models.BooleanField(default=False)
    number_of_licences = models.IntegerField(default=1000)
    bought_times = models.IntegerField(default=0, db_index=True)

    categories = models.ManyToManyField(Category, related_name='games', db_index=True)

    def save(self, *args, **kwargs):
        image = Image.open(self.preview_image)
        w, h = image.size
        self.is_wide = w > h * 1.5

        if not self.hidden:
            self.hidden = self.number_of_licences == 0

        super().save(*args, **kwargs)

    def delete(self, *args):
        self.preview_image.storage.delete(self.preview_image.name)
        super().delete(*args)

    def __str__(self):
        return self.title


class UserMark(models.Model):
    game = models.ForeignKey(Game, related_name='marks', on_delete=models.CASCADE)
    user = models.ForeignKey(User, related_name='estimated_games', on_delete=models.CASCADE)

    mark = models.IntegerField()


class Comment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='comments')
    game = models.ForeignKey(Game, on_delete=models.CASCADE, related_name='comments')
    body = models.CharField(max_length=600, default='None')
    created_at = models.DateTimeField(auto_now_add=True, null=True, db_index=True)

    top_level_comment = models.ForeignKey('Comment', on_delete=models.CASCADE, related_name='inner_comments', null=True,
                                          blank=True)
    replied_comment = models.ForeignKey('Comment', on_delete=models.CASCADE, related_name='replies', null=True,
                                        blank=True)

    @property
    def replied_text(self):
        return truncate_string(self.replied_comment.body)

    def __str__(self):
        return truncate_string(self.body)


class Cart(models.Model):
    user = models.OneToOneField(User, null=True, on_delete=models.CASCADE, related_name='cart', blank=True)
    user_agent = models.CharField(max_length=200, null=True, blank=True)
    for_anonymous_user = models.BooleanField(default=False)

    total_products = models.PositiveIntegerField(default=0)
    final_price = models.DecimalField(max_digits=10, default=0, decimal_places=2)

    def __str__(self):
        return f'{self.final_price}'

    def save(self, *args, **kwargs):
        self.for_anonymous_user = True if self.user_agent else False
        super().save(*args, **kwargs)


class CartGame(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='cart_games')
    game = models.ForeignKey(Game, on_delete=models.CASCADE, related_name='cart_games')
    qty = models.PositiveIntegerField(default=1, verbose_name='Number of products')
    final_price = models.DecimalField(max_digits=9, decimal_places=2)

    def __str__(self):
        return self.game.title

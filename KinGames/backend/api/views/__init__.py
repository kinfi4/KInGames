from .cart_views import *
from .comments_views import *
from .order_views import *
from .user_views import *
from .category_views import *
from .game_views import *

__all__ = (
    cart_views.__all__
    + comments_views.__all__
    + order_views.__all__
    + user_views.__all__
    + category_views.__all__
    + game_views.__all__
)

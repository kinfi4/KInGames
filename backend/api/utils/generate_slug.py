from string import ascii_lowercase
from random import choice


def generate_slug_from_title(title: str) -> str:
    return title.lower()


def generate_random_string(length=5):
    return ''.join(choice(ascii_lowercase) for _ in range(length))

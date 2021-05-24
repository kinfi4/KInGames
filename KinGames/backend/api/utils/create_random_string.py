from string import ascii_lowercase
from random import choice


def generate_random_string(length=7):
    return ''.join([choice(ascii_lowercase) for _ in range(length)])

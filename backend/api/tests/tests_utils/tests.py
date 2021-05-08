from ddt import ddt, data, unpack
from django.test import TestCase

from api.utils.generate_slug import generate_slug_from_title
from api.utils.truncate_string import truncate_string


@ddt
class Test(TestCase):
    @data(['1234567890', 5, '12345...'], ['1234567890', 11, '1234567890'])
    @unpack
    def test_truncating_strings(self, input_string, truncate_length, output_string):
        self.assertEqual(truncate_string(input_string, length=truncate_length), output_string)

    def test_creating_slug_from_title(self):
        self.assertEqual(generate_slug_from_title('Witcher3'), 'witcher3')

# Generated by Django 3.2 on 2021-05-12 17:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0016_auto_20210512_1746'),
    ]

    operations = [
        migrations.AlterField(
            model_name='game',
            name='price',
            field=models.DecimalField(db_index=True, decimal_places=2, max_digits=7),
        ),
    ]

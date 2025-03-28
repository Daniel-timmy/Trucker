# Generated by Django 5.1.7 on 2025-03-24 18:38

import django_ulid.models
import ulid.api.api
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tracker', '0004_alter_driver_id'),
    ]

    operations = [
        migrations.AlterField(
            model_name='driver',
            name='id',
            field=django_ulid.models.ULIDField(default=ulid.api.api.Api.new, editable=False, primary_key=True, serialize=False),
        ),
        migrations.AlterField(
            model_name='driver',
            name='phone_number',
            field=models.IntegerField(null=True),
        ),
    ]

# Generated by Django 5.1.7 on 2025-04-02 10:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tracker', '0003_driver_start_date'),
    ]

    operations = [
        migrations.AlterField(
            model_name='driver',
            name='start_date',
            field=models.DateField(null=True),
        ),
    ]

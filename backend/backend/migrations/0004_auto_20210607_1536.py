# Generated by Django 3.0.7 on 2021-06-07 20:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0003_auto_20210607_1313'),
    ]

    operations = [
        migrations.AddField(
            model_name='machine',
            name='identifier',
            field=models.IntegerField(default=0),
        ),
        migrations.AlterField(
            model_name='machine',
            name='electric_feed',
            field=models.CharField(choices=[('directa', 'Directa'), ('variador', 'Variador')], max_length=8, null=True),
        ),
        migrations.AlterField(
            model_name='machine',
            name='power_units',
            field=models.CharField(choices=[('KW', 'KiloWatts'), ('HP', 'HorsePower')], default='KW', max_length=2),
        ),
    ]
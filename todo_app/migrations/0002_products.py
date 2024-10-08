# Generated by Django 5.1 on 2024-09-03 10:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('todo_app', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Products',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('description', models.TextField()),
                ('inStock', models.BooleanField(default=False)),
                ('image', models.ImageField(upload_to='product/images/')),
                ('price', models.DecimalField(decimal_places=2, max_digits=10)),
            ],
        ),
    ]

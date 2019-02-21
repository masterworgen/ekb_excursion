# Generated by Django 2.1.5 on 2019-02-20 12:16

import ckeditor.fields
import ckeditor_uploader.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Blog',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('header', models.CharField(max_length=40)),
                ('date_create', models.DateTimeField(auto_now_add=True)),
                ('text', ckeditor_uploader.fields.RichTextUploadingField(blank=True, default='')),
            ],
        ),
        migrations.CreateModel(
            name='Excursions',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50)),
                ('text', ckeditor_uploader.fields.RichTextUploadingField(blank=True, default='')),
                ('json', ckeditor.fields.RichTextField(blank=True, default='')),
            ],
        ),
        migrations.CreateModel(
            name='Feedback',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=20)),
                ('date_create', models.DateTimeField(auto_now_add=True)),
                ('text', ckeditor_uploader.fields.RichTextUploadingField(blank=True, default='')),
                ('verification', models.BooleanField()),
            ],
        ),
    ]

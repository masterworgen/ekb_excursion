from django.db import models
from ckeditor.fields import RichTextField
from ckeditor_uploader.fields import RichTextUploadingField

class Blog(models.Model):
    header = models.CharField(max_length=40)
    date_create = models.DateTimeField(auto_now_add=True)
    text = RichTextUploadingField(blank=True, default='')


class Feedback(models.Model):
    name = models.CharField(max_length=20)
    date_create = models.DateTimeField(auto_now_add=True)
    text = RichTextUploadingField(blank=True, default='')
    verification = models.BooleanField()


class Excursions(models.Model):
    name = models.CharField(max_length=50)
    text = RichTextUploadingField(blank=True, default='')
    json = RichTextField(blank=True, default='')
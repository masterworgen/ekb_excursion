from django.db import models

class Blog(models.Model):
    header = models.CharField(max_length=40)
    date_create = models.DateTimeField(auto_now_add=True)
    text = models.TextField(blank=True)


class Feedback(models.Model):
    name = models.CharField(max_length=20)
    date_create = models.DateTimeField(auto_now_add=True)
    text = models.TextField(blank=True)
    verification = models.BooleanField()


class Excursions(models.Model):
    name = models.CharField(max_length=50)
    text = models.TextField(blank=True)
    json = models.TextField(blank=True)
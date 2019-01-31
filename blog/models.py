from django.db import models

class Blog(models.Model):
    header = models.CharField(max_length=40)
    date_create = models.DateTimeField(auto_now_add=True)
    text = models.TextField(blank=True)

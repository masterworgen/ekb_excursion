from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect
from blog.models import Blog


# Create your views here.
def index(request):
    news = Blog.objects.all()
    return render(request, "index.html", {"news": news})


def feedback(request):
    return HttpResponse("<h2>Отзывы</h2>")


def addNews(request):
    if request.method == "POST":
        news = Blog()
        news.header = request.POST.get("name")
        news.date_create = request.POST.get("age")
        news.text = request.POST.get("text")
        news.save()
    return HttpResponseRedirect("/")
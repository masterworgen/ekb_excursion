from django.shortcuts import render, redirect
from django.http import HttpResponse, HttpResponseRedirect
from blog.models import Blog


def get_response(request, template, params):
    if request.method == "GET":
        if "content" in request.GET and request.GET["content"]:
            return render(request, template, params)
        else:
            params["template"] = template
            return render(request, "index.html", params)


def index(request):
    return redirect("/news/")


def news(request):
    news_list = Blog.objects.all()
    return get_response(request, "news.html", {"news": news_list})


def feedback(request):
    return get_response(request, "feedback.html", {})


def addNews(request):
    if request.method == "POST":
        news = Blog()
        news.header = request.POST.get("name")
        news.date_create = request.POST.get("age")
        news.text = request.POST.get("text")
        news.save()
    return HttpResponseRedirect("/")

def news(request, topic_id):
    news = Blog.objects.get(id=topic_id)
    return render(request, 'post_list.html', {"news": news})
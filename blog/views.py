from django.shortcuts import render, redirect
from django.http import HttpResponse, HttpResponseRedirect
from blog.models import Blog, Feedback


def get_response(request, template, params):
    if request.method == "GET":
        if "content" in request.GET and request.GET["content"]:
            return render(request, template, params)
        else:
            params["template"] = template
            return render(request, "index.html", params)


def index(request):
    return redirect("/news/")


def news(request, topic_id=None):
    if topic_id is not None:
        article = Blog.objects.get(id=topic_id)
        return get_response(request, 'news_article.html', {"news_article": article})
    else:
        news_list = Blog.objects.all()
        return get_response(request, "news_list.html", {"news_list": news_list})


def feedback(request):
    fb = Feedback(request.POST)
    if request.method == "POST":
        fb.name = request.POST.get("name")
        fb.date_create = request.POST.get("dc")
        fb.text = request.POST.get("text")
        fb.verification = 0
        return render(request, "feedback.html")
    elif request.method == "GET":
        return render(request, "feedback.html", {"form": fb})

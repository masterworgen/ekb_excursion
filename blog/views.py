from django.shortcuts import render, redirect
from django.http import HttpResponse, HttpResponseRedirect
from blog.models import Blog, Feedback, Excursion
from django.core.mail import send_mail

def get_response(request, template, params):
    if request.method == "GET" and "content" in request.GET and request.GET["content"]:
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


def excursions(request):
    excursions_list = Excursion.objects.all()
    if request.method == "POST":
        exc = Excursion.objects.get(id=request.POST.get("excursionId")).name
        text = request.POST.get("name") + " записался на экскурсию: " + exc + "\nПочта: "+request.POST.get("email")+"\nТелефон: "+request.POST.get("tel")
        send_mail('Запись на эксурсию', text, 'excurison@екб-прогулка.рф',
                  ['excurison@екб-прогулка.рф'], fail_silently=False)
    return get_response(request, "excursions.html", {"excursions": excursions_list})


def feedback(request):
    if request.method == "POST":
        fb = Feedback()
        fb.name = request.POST.get("name")
        fb.text = request.POST.get("text")
        fb.verification = False
        fb.save()
        return HttpResponse("need_verification")
    fb = Feedback.objects.order_by("-date_create").filter(verification=True)
    return get_response(request, 'feedback.html', {"fb":fb})
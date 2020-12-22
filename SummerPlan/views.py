from django.http import HttpResponse
from django.shortcuts import render


def hello(request):
    return HttpResponse("Hello world! CS411_Self_Study")


def cs411(request):
    context = {}
    context['hello'] = 'Welcome to CS411SU20, Self_Study'
    return render(request, 'cs411.html', context)


# def cs411(request):
#     import datetime
#     now = datetime.datetime.now()
#     return render(request, "cs411.html", )


# def cs411(request):
#     views_name = "真香警告"
#     return render(request, "cs411.html", {"name": views_name})
#
#
# def cs411(request):
#     views_list = ["真香警告1", "真香警告2", "真香警告3"]
#     return render(request, "cs411.html", {"views_list": views_list})


# def cs411(request):
#     views_dict = {"name": "真香警告"}
#     return render(request, "cs411.html", {"views_dict": views_dict})

# def cs411(request):
#     name = "SU20_CS411_Self_Study"
#     return render(request, "cs411.html", {"name": name})





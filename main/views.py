from django.http import HttpResponse, JsonResponse
from django.template import loader
from django.utils import timezone
from django.shortcuts import render, redirect
from django.urls import reverse
from urllib.parse import urlencode
from django.views.decorators.csrf import csrf_exempt
from main.kerbspaceHack.process import getCurb
import ast

# Create your views here.


def main(request):
    if request.method == "GET":
        return render(request, 'main/index.html')

    elif request.method == "POST":
        # do back end here
        pass


def map(request):
    if request.method == "GET":
        return render(request, 'main/map.html')

    elif request.method == "POST":
        # do some back end here
        search_string = request.POST['DESTINATION']
        print(search_string)

        return render(request, 'main/map.html')


def about(request):
    if request.method == "GET":
        return render(request, 'main/about.html')


def contact(request):
    if request.method == "GET":
        return render(request, 'main/contact.html')


@csrf_exempt
def apicall(request):
    if request.method == "POST":
        locDict = ast.literal_eval(request.body.decode('utf-8'))
        lat = locDict["lat"]
        lng = locDict["lng"]
        print(request.body)
        jsonOut = JsonResponse(getCurb([lat, lng], 1000), safe=False)

        print(jsonOut)
        return jsonOut

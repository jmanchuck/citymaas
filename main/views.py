from django.http import HttpResponse
from django.template import loader
from django.utils import timezone
from django.shortcuts import render, redirect
from django.urls import reverse
from urllib.parse import urlencode
# from kerbspaceHack.process import squareFinder

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

# print(squareFinder("51.519781, -0.129711", 100))

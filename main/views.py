from django.shortcuts import render
from django.http import HttpResponse
from django.template import loader
from django.utils import timezone
from django.shortcuts import render, redirect
from django.urls import reverse
from urllib.parse import urlencode
from kerbspaceHack.process import squareFinder

# Create your views here.
print

def main(request):
    if request.method == "GET":
        return render(request, 'main/index.html')

    elif request.method == "POST":
        # do back end here

        pass

def destination(request):
    if request.method == "GET":
        return render(request, 'main/index.html')

    elif request.method == "POST":
        return

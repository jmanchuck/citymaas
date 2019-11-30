from django.shortcuts import render
from django.http import HttpResponse
from django.template import loader
from django.utils import timezone
from django.shortcuts import render, redirect
from django.urls import reverse
from urllib.parse import urlencode
# import kerbspaceHack.process as process

# Create your views here.

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

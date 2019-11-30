from __future__ import print_function
import time
import swagger_client
from swagger_client.rest import ApiException
from pprint import pprint
import pandas as pd
from math import sin, cos, sqrt, atan2, radians
import json
import calendar


# create an instance of the API class
api_instance = swagger_client.FeaturesControllerApi()
ocp_apim_subscription_key = 'c105fb930d5b43b09d8da802326651e9'  # str |
# str | viewport - a bounding box specified by two coordinates. First coordinate is bottom left second is top right. For example 51.31159579347505,-0.43013610839850003,51.73880216751415,0.25513610839837497 (optional)
viewport = '51.514784, -0.133652, 51.530104, -0.117755'

# bedford square
location = "51.519781, -0.129711"

# in m
radius = 100

daysDict = dict(enumerate(calendar.day_name))

accepted_parking = []
kerbLoc = []
disability = []

print(daysDict)
exit()


def squareFinder(loc, radius):
    # arguments:
    #   loc (string): 'lat, long'
    square_corners = ""
    latitude, longitude = loc.split(',')
    latitude, longitude = float(latitude), float(longitude)
    d_vertical = sin((radius/1e3)/69)
    d_horizontal = d_vertical / cos(d_vertical)
    square_corners += str(longitude - d_horizontal) + ", " + str(latitude - d_vertical) + \
        ", " + str(longitude + d_horizontal) + ", " + str(latitude + d_vertical)

    return square_corners


def distanceFinder(loc1, loc2):
    # in meters
    R = 6373.0
    lat1, lon1 = radians(loc1[0]), radians(loc1[1])
    lat2, lon2 = radians(loc2[0]), radians(loc2[1])
    dlon = lon2 - lon1
    dlat = lat2 - lat1
    a = sin(dlat / 2)**2 + cos(lat1) * cos(lat2) * sin(dlon / 2)**2
    c = 2 * atan2(sqrt(a), sqrt(1 - a))
    distance = R * c * 1e3
    return distance

# square_corners = squareFinder(location, 100).split(',')
# print(square_corners)
# loc1, loc2 = square_corners[0] + ',' + square_corners[1], square_corners[2] + ',' + square_corners[3]


def kerbSize(coordList):
    distances = []
    kerbspaces = 0
    for i in range(len(coordList) - 1):

        loc1 = coordList[i][::-1]
        loc2 = coordList[i+1][::-1]
        for j in range(2):
            loc1[j] = str(loc1[j])
            loc2[j] = str(loc2[j])

        print(loc1, loc2)
        loc1 = ','.join(loc1)
        loc2 = ','.join(loc2)
        distances.append(distanceFinder(loc1, loc2))
        print(distanceFinder(loc1, loc2))

    for distance in distances:
        kerbspaces += distance / 5

    return int(kerbspaces)

def kerbCenter(coordList):
    n = len(coordList)

    if n % 2 != 0:
        return coordList[n//2+1][::-1]
    else:
        lower = coordList[int(n/2)-1]
        higher = coordList[int(n/2)]
        result = []
        result.append((lower[0] + higher[0])/2)
        result.append((lower[1] + higher[1])/2)
        return result[::-1]


try:
    api_response = api_instance.get_features_by_viewport_using_get(
        ocp_apim_subscription_key, viewport=viewport)
except ApiException as e:
    print("Exception when calling FeaturesControllerApi->get_features_by_viewport_using_get: %s\n" % e)


for i in range(0, len(api_response.features)):
    kerb = api_response.features[i]
    regulations = kerb.properties['regulations']
    coord = kerb.geometry.coordinates
    for j in range(0, len(regulations)):
        if regulations[j]['rule']['payment']:
            if j == 0:
                accepted_parking.append(kerb)
                kerbLoc.append(kerbCenter(coord))
                disability.append(False)
        try:
            classes = regulations[j]['userClasses'][0]['classes'][0]
        except KeyError:
            pass
        if classes[0:2] == 'Di':
            if j == 0:
                accepted_parking.append(kerb)
                kerbLoc.append(kerbCenter(coord))
                disability.append(True)


# pprint(accepted_parking)
dist = []
for i in range(0, len(kerbLoc)):
    dist.append(distanceFinder(location, kerbLoc[i]))
zipped = zip(dist, kerbLoc, disability)
distSort, kerbLocSort, disabilitySort = zip(*sorted(zipped))


jsonList = [{'distance': dist, 'location': loc, 'disabilitySpace': dis}
            for dist, loc, dis in zip(distSort, kerbLocSort, disabilitySort)]

with open('output.json', 'w') as fout:
    json.dump(jsonList, fout)


# pprint(kerbLoc)
# pprint(accepted_parkingSort)

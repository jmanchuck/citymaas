from __future__ import print_function
import time
import swagger_client
from swagger_client.rest import ApiException
from pprint import pprint
import pandas as pd
from math import sin, cos, sqrt, atan2, radians
import json
import datetime


# create an instance of the API class
api_instance = swagger_client.FeaturesControllerApi()
ocp_apim_subscription_key = 'c105fb930d5b43b09d8da802326651e9'  # str |


def squareFinder(loc, radius):
    longitude, latitude = float(loc[0]), float(loc[1])
    d_vertical = (radius/1e3)/69
    d_horizontal = d_vertical / cos(d_vertical)
    return "{0}, {1}, {2}, {3}".format(longitude - d_horizontal, latitude - d_vertical, longitude + d_horizontal, latitude + d_vertical)


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


def kerbSize(coordList):
    distances = []
    kerbspaces = 0
    for i in range(len(coordList) - 1):
        loc1 = coordList[i][::-1]
        loc2 = coordList[i+1][::-1]
        distances.append(distanceFinder(loc1, loc2))
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


def getCurb(location, radius):

    day = datetime.datetime.today().weekday()

    accepted_parking = []
    kerbLoc = []
    disability = []
    kerbSizeList = []
    daysDict = {
        0: 'mo',
        1: 'tu',
        2: 'we',
        3: 'th',
        4: 'fri',
        5: 'sa',
        6: 'su'
    }

    viewport = squareFinder(location, radius)

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
            timeSpans = regulations[j]['timeSpans'][0]
            daysOfWeek = timeSpans['daysOfWeek']['days']
            for dayString in daysOfWeek:
                if dayString == daysDict[day]:
                    if regulations[j]['rule']['payment'] and regulations[j]['rule']['activity'] == 'parking':
                        if j == 0:
                            accepted_parking.append(kerb)
                            kerbLoc.append(kerbCenter(coord))
                            disability.append(False)
                            kerbSizeList.append(kerbSize(coord))
                    try:
                        classes = regulations[j]['userClasses'][0]['classes'][0]
                    except KeyError:
                        pass
                    if classes[0:2] == 'Di':
                        if j == 0:
                            accepted_parking.append(kerb)
                            kerbLoc.append(kerbCenter(coord))
                            disability.append(True)
                            kerbSizeList.append(kerbSize(coord))

    dist = []
    for i in range(0, len(kerbLoc)):
        dist.append(distanceFinder(location, kerbLoc[i]))
    zipped = zip(dist, kerbLoc, disability, kerbSizeList)
    distSort, kerbLocSort, disabilitySort, kerbSizeSort = zip(*sorted(zipped))

    jsonList = [{'distance': dist, 'location': loc, 'disabilitySpace': dis, 'kerbSize': size}
                for dist, loc, dis, size in zip(distSort, kerbLocSort, disabilitySort, kerbSizeSort)]

    return json.dumps(jsonList)

    # pprint(kerbLoc)
    # pprint(accepted_parkingSort)


if __name__ == "__main__":
    # bedford square
    location = [51.519781, -0.129711]
    # in m
    radius = 1000
    getCurb(location, radius)

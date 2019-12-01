import requests


def getCrimeLevel(lat, lng):
    params = {
        'lat': lat,
        'lng': lng
    }
    response = requests.get(url='https://data.police.uk/api/crimes-street/all-crime', params=params)
    crime_case = len(response.json())
    return 10 if crime_case >= 10000 else crime_case / 1000.0


print(getCrimeLevel(52.629729, -1.131592))

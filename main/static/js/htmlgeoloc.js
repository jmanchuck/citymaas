function getLocation(callback) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition( callback );
    }
    else {
        callback({coords:{latitude: 51.518656299999996, longitude: -0.0784656}});
    }
}
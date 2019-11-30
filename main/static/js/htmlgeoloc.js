function getLocation(callback) {
    var promise = new Promise(function(resolve, reject) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                function(position){
                    resolve([position.coords.latitude, position.coords.longitude])
                }
            );
        } else {
          reject("Unknown");
        }
    });

    return promise;
}
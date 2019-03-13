function initMap() {
  //location permission
  var infoWindow = new google.maps.InfoWindow();
  var map;
  var searchResult = "";

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function(position) {
        console.log(position);
        var pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        //塞目前座標
        document.getElementById("currentLoc").innerHTML =
          pos.lat + "," + pos.lng;
        //map options
        var options = {
          zoom: 15,
          center: pos
        };
        //new map
        var mapElement = document.getElementById("map");
        map = new google.maps.Map(mapElement, options);

        //infoWindow.setPosition(pos);
        map.setCenter(pos);
        addMarker(pos, "目前位置");

        //呼叫placeserveice
        var service = new google.maps.places.PlacesService(map);
        //search result
        service.nearbySearch(
          {
            location: pos,
            radius: 10000,
            type: ["hospital"]
          },
          callback
        );
      },
      function() {
        handleLocationError(true, infoWindow, map.getCenter());
      }
    );
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }

  //add marker
  function addMarker(coords, content) {
    var marker = new google.maps.Marker({
      position: coords,
      map: map
    });
    //add information
    marker.addListener("click", addInfo);
    function addInfo() {
      infoWindow.setContent(content);
      infoWindow.open(map, marker);
    }
  }

  //callback
  function callback(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      for (var i = 0; i < results.length; i++) {
        console.log(results[i]);
        var infoDisplay = results[i].name + "<br/>" + results[i].vicinity;
        addMarker(results[i].geometry.location, infoDisplay);
        searchResult += results[i].name + "<br/>";
      }
      console.log(searchResult);
      document.getElementById("results").innerHTML = searchResult;
    } else {
      alert("Geocode was not successful for the following reason: " + status);
    }
  }
}
function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(
    browserHasGeolocation
      ? "Error: The Geolocation service failed."
      : "Error: Your browser doesn't support geolocation."
  );
  infoWindow.open(map);
}

var map;
var searchResult = "";
var infoWindow;
function initMap() {
  //new map
  map = new google.maps.Map(document.getElementById("map"), { zoom: 15 });
  //location permission
  infoWindow = new google.maps.InfoWindow();
  //如果允許定位
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function(position) {
        var pos = new google.maps.LatLng(
          position.coords.latitude,
          position.coords.longitude
        );
        //塞目前座標
        document.getElementById("currentLoc").innerHTML =
          "(" +
          Math.round(position.coords.latitude * 100) / 100 +
          "," +
          Math.round(position.coords.longitude * 100) / 100 +
          ")";

        //infoWindow.setPosition(pos);
        map.setCenter(pos);
        addMarker(pos, "目前位置");

        //呼叫placeserveice
        var service = new google.maps.places.PlacesService(map);
        //search result
        service.nearbySearch(
          {
            location: pos,
            radius: 10000, //unit:meter
            type: ["hospital"]
          },
          //callback,接回傳結果
          function(results, status) {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
              for (var i = 0; i <= 10; i++) {
                var distance = google.maps.geometry.spherical.computeDistanceBetween(
                  pos,
                  results[i].geometry.location
                );
                var infoDisplay =
                  results[i].name +
                  "<br/>" +
                  results[i].vicinity +
                  "<br/>" +
                  "距離:" +
                  Math.round((distance / 1000) * 10) / 10 +
                  "公里";
                addMarker(results[i].geometry.location, infoDisplay);
                searchResult += results[i].name + "<br/>";
              }
              document.getElementById("results").innerHTML = searchResult;
            } else {
              alert(
                "Geocode was not successful for the following reason: " + status
              );
            }
          }
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
  function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(
      browserHasGeolocation
        ? "Error: The Geolocation service failed."
        : "Error: Your browser doesn't support geolocation."
    );
    infoWindow.open(map);
  }
  //add marker
  function addMarker(coords, content) {
    var marker = new google.maps.Marker({
      position: coords,
      map: map
    });
    //add information
    marker.addListener("click", function() {
      infoWindow.setContent(content);
      infoWindow.open(map, marker);
    });
  }
}
//新增標籤
function addAddress() {
  var content = {
    title: document.getElementById("titleAdd").value,
    address: document.getElementById("addressAdd").value
  };
  var addPos = {
    lat: parseFloat(document.getElementById("latitudeAdd").value),
    lng: parseFloat(document.getElementById("longtitudeAdd").value)
  };
  var addMarker = new google.maps.Marker({
    position: addPos,
    map: map,
    content: content.title + "<br/>" + content.address,
    icon:
      "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png"
  });
  addMarker.addListener("click", function() {
    infoWindow.setContent(content.title + "<br/>" + content.address);
    infoWindow.open(map, addMarker);
  });
  $("#results").append("<span>" + addPos.lat, addPos.lng + "</span>" + "<br/>");
}
var map;
var searchResult = [];
var markers = [];
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
              for (let i = 0; i <= 10; i++) {
                var distance = google.maps.geometry.spherical.computeDistanceBetween(
                  pos,
                  results[i].geometry.location
                );
                let infoDisplay =
                  results[i].name +
                  "<br/>" +
                  results[i].vicinity +
                  "<br/>" +
                  "距離:" +
                  Math.round((distance / 1000) * 10) / 10 +
                  "公里" +
                  "<br/><button id = 'deleteBtn'>Delete</button>";
                addMarker(results[i].geometry.location, infoDisplay);
                searchResult.push(results[i].name);
              }
              document.getElementById("results").innerHTML = arrTostr(
                searchResult
              );
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
      map: map,
      animation: google.maps.Animation.DROP
    });
    markers.push(marker);
    //add information
    marker.addListener("click", function() {
      infoWindow.setContent(content);
      infoWindow.open(map, marker);
      infoWindow.addListener("domready", function() {
        var btn = document.getElementById("deleteBtn");
        btn.onclick = function() {
          //remove item from array
          removeA(markers, marker, searchResult);
          marker.setMap(null);
          let searchStr = arrTostr(searchResult);
          document.getElementById("results").innerHTML = searchStr;
        };
      });
    });
  }
  ////////////////////////////////////////////////////////
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
    animation: google.maps.Animation.DROP,
    icon:
      "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png"
  });
  markers.push(addMarker);

  addMarker.addListener("click", function() {
    infoWindow.setContent(
      content.title +
        "<br/>" +
        content.address +
        "<br/><button id = 'deleteBtn'>Delete</button>"
    );
    infoWindow.open(map, addMarker);
    infoWindow.addListener("domready", function() {
      var btn = document.getElementById("deleteBtn");
      btn.onclick = function() {
        //remove item from array
        removeA(markers, addMarker, searchResult);
        addMarker.setMap(null);
        let searchStr = arrTostr(searchResult);
        console.log(searchStr);
        document.getElementById("results").innerHTML = searchStr;
      };
    });
  });
  $("#results").append("<span>" + content.title + "</span>" + "<br/>");
}
//陣列中刪除特定值
function removeA(arr, removeItem, searchResult) {
  for (let i = 0; i <= arr.length; i++) {
    if (arr[i] === removeItem) {
      arr.splice(i, 1);
      searchResult.splice(i - 1, 1);
    }
  }
  return arr;
}
//陣列轉字串(插空白)
function arrTostr(arr) {
  var results = "";
  for (let i = 0; i < arr.length; i++) {
    results += arr[i] + "<br/>";
  }
  return results;
}

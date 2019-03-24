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
                addMarker(
                  results[i].geometry.location,
                  results[i].name,
                  results[i].vicinity,
                  distance
                );
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
  function addMarker(coords, result_name, result_vicinity, distance) {
    var marker = new google.maps.Marker({
      position: coords,
      map: map,
      animation: google.maps.Animation.DROP
    });
    markers.push(marker);
    //info window content
    content =
      result_name +
      "<br/>" +
      result_vicinity +
      "<br/>" +
      "距離:" +
      Math.round((distance / 1000) * 10) / 10 +
      "公里" +
      "<br/><button id = 'deleteBtn'>Delete</button>" +
      "<button id = 'updateBtn'>Update</button>";
    //////////////////////
    //add information
    marker.addListener("click", function() {
      infoWindow.setContent(content);
      infoWindow.open(map, marker);
      infoWindow.addListener("domready", function() {
        let deleteBtn = document.getElementById("deleteBtn");
        let updateBtn = document.getElementById("updateBtn");
        deleteBtn.onclick = function() {
          //remove item from array
          removeA(markers, marker, searchResult);
          marker.setMap(null);
          let searchStr = arrTostr(searchResult);
          document.getElementById("results").innerHTML = searchStr;
        };
        updateBtn.onclick = function() {
          let input_info =
            "名稱:" +
            "<input type='text' id='name_up'><br/>" +
            "地址:" +
            "<input type='text' id='address_up'><br/>" +
            "<button id = 'updateSave'>Save</button>";
          infoWindow.setContent(input_info);
          $("#updateSave").click(function() {
            let new_name = $("#name_up").val();
            let new_address = $("#address_up").val();
            //info window content
            let new_content =
              new_name +
              "<br/>" +
              new_address +
              "<br/>" +
              "距離:" +
              Math.round((distance / 1000) * 10) / 10 +
              "公里" +
              "<br/><button id = 'deleteBtn'>Delete</button>" +
              "<button id = 'updateBtn'>Update</button>";
            //////////////////////
            infoWindow.setContent(new_content);
          });

          console.log(a);
        };
      });
    });
  }
  ////////////////////////////////////////////////////////
}
//新增標籤
function addAddress() {
  let content = {
    title: document.getElementById("titleAdd").value,
    address: document.getElementById("addressAdd").value
  };
  let addPos = {
    lat: parseFloat(document.getElementById("latitudeAdd").value),
    lng: parseFloat(document.getElementById("longtitudeAdd").value)
  };
  let addMarker = new google.maps.Marker({
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
      let btn = document.getElementById("deleteBtn");
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

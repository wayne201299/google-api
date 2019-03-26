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
        searchResult.push({
          location: pos,
          name: "目前位置",
          Address: "",
          distance: 0
        });
        addMarker(0, searchResult);

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
                //搜尋結果累加
                searchResult.push({
                  location: results[i].geometry.location,
                  name: results[i].name,
                  Address: results[i].vicinity,
                  distance: Math.round((distance / 1000) * 10) / 10
                });
                //加標籤
                addMarker(i + 1, searchResult);
              }
            } else {
              alert(
                "Geocode was not successful for the following reason: " + status
              );
            }
            renderResult(searchResult);
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
}
//add marker
function addMarker(identify, searchResult) {
  var marker = new google.maps.Marker({
    position: searchResult[identify].location,
    map: map,
    animation: google.maps.Animation.DROP
  });
  markers.push(marker);
  //console.log(identify);
  //console.log(searchResult[identify].location);
  //add information
  marker.addListener("click", function() {
    //info window content
    content =
      searchResult[identify].name +
      "<br/>" +
      searchResult[identify].Address +
      "<br/>" +
      "距離:" +
      searchResult[identify].distance +
      "公里" +
      "<br/><button id = 'deleteBtn'>Delete</button>" +
      "<button id = 'updateBtn'>Update</button>";
    //////////////////////
    infoWindow.setContent(content);
    infoWindow.open(map, marker);
    infoWindow.addListener("domready", function() {
      let deleteBtn = document.getElementById("deleteBtn");
      deleteBtn.onclick = function() {
        //remove item from array
        delete markers[identify];
        delete searchResult[identify];
        //markers.splice(identify, 1);
        //searchResult.splice(identify, 1);

        marker.setMap(null);
        renderResult(searchResult);
      };
      let updateBtn = document.getElementById("updateBtn");
      updateBtn.onclick = function() {
        let input_info =
          "名稱:" +
          "<input type='text' id='name_up'><br/>" +
          "地址:" +
          "<input type='text' id='address_up'><br/>" +
          "<button id = 'updateSave'>Save</button>";
        infoWindow.setContent(input_info);
        $("#updateSave").click(function() {
          //update search results
          searchResult[identify].name = $("#name_up").val();
          searchResult[identify].Address = $("#address_up").val();
          //info window content
          let new_content =
            searchResult[identify].name +
            "<br/>" +
            searchResult[identify].Address +
            "<br/>" +
            "距離:" +
            searchResult[identify].distance +
            "公里" +
            "<br/><button id = 'deleteBtn'>Delete</button>" +
            "<button id = 'updateBtn'>Update</button>";
          infoWindow.setContent(new_content);
          //render results
          renderResult(searchResult);
        });
      };
    });
  });
}
////////////////////////////////////////////////////////
//新增標籤
function addAddress() {
  let addPos = {
    lat: parseFloat($("#latitudeAdd").val()),
    lng: parseFloat($("#longtitudeAdd").val())
  };
  searchResult.push({
    location: addPos,
    name: $("#titleAdd").val(),
    Address: $("#addressAdd").val(),
    distance: "???"
  });
  addMarker(searchResult.length - 1, searchResult);
  renderResult(searchResult);
}
//陣列中刪除特定值
function removeA(arr, removeItem, searchResult) {
  for (let i = 0; i <= arr.length; i++) {
    if (arr[i] === removeItem) {
      arr.splice(i, 1);
      searchResult.splice(i, 1);
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
//刷新搜尋結果
function renderResult(results) {
  console.log(results);
  let searchStr = arrTostr(
    results
      .map(item => Object.values(item)[1])
      .filter(item => item !== undefined || item === "目前座標")
  );
  document.getElementById("results").innerHTML = searchStr;
}

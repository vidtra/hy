let map;

$(document).ready(function () {
    mapboxgl.accessToken =
        "pk.eyJ1Ijoibm9jdHlzcyIsImEiOiJjbDh2aTFqY2gwZTlsM3ZxcTRnOGZ0b3hmIn0.CDy8vkgqrviTRnZ-0SXeow";

    map = new mapboxgl.Map({
        container: "map", // container ID
        center: [-122.420679, 37.772537], // starting position [lng, lat]
        zoom: 13, // starting zoom
        style: "mapbox://styles/mapbox/streets-v11", // style URL or style object
        hash: true, // sync `center`, `zoom`, `pitch`, and `bearing` with URL
        // Use `transformRequest` to modify requests that begin with `http://myHost`.
        transformRequest: (url, resourceType) => {
            if (resourceType === "Source" && url.startsWith("http://myHost")) {
                return {
                    url: url.replace("http", "https"),
                    headers: { "my-custom-header": true },
                    credentials: "include", // Include cookies for cross-origin requests
                };
            }
        },
    });

    const nav = new mapboxgl.NavigationControl({
        visualizePitch: true,
    });
    map.addControl(nav, "bottom-right");

    get_restaurants();
});

function get_restaurants() {
    $("#restaurant-box").empty();
    $.ajax({
        type: "GET",
        url: "/restaurants",
        data: {},
        success: function (response) {
            let restaurants = response["restaurants"];
            for (let i = 0; i < restaurants.length; i++) {
                let restaurant = restaurants[i];
                make_card(i, restaurant);
                make_marker(restaurant);
                add_info(i, restaurant);
            }
        },
    });
}

function make_card(i, restaurant) {
    let html_temp = `<div class="card" id="card-${i}">
                  <div class="card-body">
                      <h5 class="card-title"><a href="${restaurant.link}" class="restaurant-title">${restaurant.name}</a></h5>
                      <h6 class="card-subtitle mb-2 text-muted">${restaurant.categories}</h6>
                      <p class="card-text">${restaurant.location}</p>
                      <button class="btn btn-danger" onclick="delete_restaurant('${restaurant.name}');">Delete</button>
                  </div>
               </div>`;
    $("#restaurant-box").append(html_temp);
}

function make_marker(restaurant) {
    new mapboxgl.Marker().setLngLat(restaurant.coordinates).addTo(map);
}

function add_info(i, restaurant) {
    new mapboxgl.Popup({
        offset: {
            bottom: [0, -35],
        },
    })
        .setLngLat(restaurant.coordinates)
        .setHTML(
            `<div class="iw-inner" onclick="map.flyTo({center: [${restaurant.coordinates}]}); scroll_to_card(${i});">
                  <h5>${restaurant.name}</h5>
                  <p>${restaurant.location}
                  </div>`
        )
        .setMaxWidth("300px")
        .addTo(map);
}

function scroll_to_card(i) {
    $("#restaurant-box").animate(
        {
            scrollTop:
                $("#restaurant-box").get(0).scrollTop +
                $(`#card-${i}`).position().top,
        },
        1000
    );
}

function create_restaurant() {
    let name = $('#input-name').val();
    let categories = $('#input-categories').val();
    let location = $('#input-location').val();

    let longitude = $('#input-longitude').val();
    let latitude = $('#input-latitude').val();

    longitude = parseFloat(longitude);
    latitude = parseFloat(latitude);

    $.ajax({
        type: 'POST',
        url: '/restaurant/create',
        data: {
            name: name,
            categories: categories,
            location: location,
            longitude: longitude,
            latitude: latitude,
        },
        success: function (response) {
            if (response.result === 'success') {
                alert(response.msg);
                window.location.reload();
            } else {
                alert('Something went wrong');
            }
        }
    });
}

function delete_restaurant(name) {
    $.ajax({
        type: 'POST',
        url: '/restaurant/delete',
        data: {
            name: name,
        },
        success: function (response) {
            if (response.result === 'success') {
                alert(response.msg);
                window.location.reload();
            } else {
                alert('Something went wrong');
            }
        }
    });
}

function test() {
    if(true) {
        var x = 13
    }

    console.log(x)
}

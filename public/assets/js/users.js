//get user input value
$("#add_user").on("click", event => {
    event.preventDefault();
    let username = $("#user_name").val();
    let email = $("#user_email").val();
    let password = $("#user_password").val();
    let photo = $("#user_photo").val();
    let location = $("#user_location").val();
    let artists = $("#user_artists").val().toLowerCase().split(",").map(artist => artist.trim());
    let newUser = { username, email, password, photo, location, artists };


    //send newUser to the server
    $.post("/users/", newUser, (res) => {
        if (res.message === "OK") {
            //get user match 
            $.get("/users/match/" + res.userId, (res) => {
                if (res.message !== "OK") {
                    console.log("FAIL matching");
                    return;
                }
                showMatch(res.result);
            })
            showCurUser(newUser);
        } else { console.log("Failed creating new user"); }
    });
})

//send username to the lastFm after enter
$("#user_name").on("blur", () => {
    getLfArtists($("#user_name").val());
})

//get user data from last.fm
function getLfArtists(userName) {
    $.get(`http://ws.audioscrobbler.com/2.0/?method=user.gettopartists&user=${userName}&api_key=a5ca8821e39cdb5efd2e5667070084b2&format=json`,
        (res) => {
            if (!res) {
                console.log("FAIL get data");
                return;
            } else {
                let artists = res.topartists.artist.map(artist => artist.name);
                $("#user_artists").val(artists);
            }
        });
}

//displaying current user 
function showCurUser(user) {
    $("#form_container").css('display', 'none');
    $("#form_user_container").append(`<p><span>Username:</span> ${user.username}</p><p><span>Location:</span>${user.location}</p><img class='user_photo' src='${user.photo}'>`);

    $("#form_user_container").append("<h2>Favorite Artists:</h2><ul class='artists_table'></ul>");
    user.artists.forEach(artist => {
        $(".artists_table").append(`<li class='artist'>${artist}</li>`);
    })
}

//displaying user match
function showMatch(users) {
    let source = $("#template-hbs").html();
    //https://stackoverflow.com/questions/1144783/how-to-replace-all-occurrences-of-a-string
    source = source.replace(/\[/g, "{").replace(/\]/g, "}");
    const template = Handlebars.compile(source);
    let html = {
        user: users
    };
    let theCompiledHtml = template(html);
    $('#matching_container').append(theCompiledHtml);
}


//get user geolocation
//https://stackoverflow.com/questions/6797569/get-city-name-using-geolocation
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(successFunction, errorFunction);
} else {
    console.log("Browser doesn't support geolocaton");
}

//handle the latitude and the longitude
function successFunction(position) {
    console.log(position);
    let { latitude, longitude } = position.coords;
    codeLatLng(latitude, longitude);
}

function errorFunction(arg) {
    console.log("Unable to get current location from the browser");
}

function codeLatLng(lat, lng) {
    const geocoder = new google.maps.Geocoder();
    let latlng = new google.maps.LatLng(lat, lng);
    geocoder.geocode({ 'latLng': latlng }, function (results, status) {
        console.log(results);
        if (status == google.maps.GeocoderStatus.OK) {
            console.log(results[1]);
            console.log(results[0]);
            if (results[1]) {
                //find country name
                for (let i = 0; i < results[0].address_components.length; i++) {
                    for (let b = 0; b < results[0].address_components[i].types.length; b++) {
                        //there are different types that might hold a city admin_area_lvl_1 usually does in come cases looking for sublocality type will be more appropriate
                        if (results[0].address_components[i].types[b] == "administrative_area_level_1") {
                            city = results[0].address_components[i];
                            break;
                        }
                    }
                }
                $("#user_location").val(city.long_name);

            } else {
                console.log("No results found");
            }
        } else {
            console.log("Geocoder failed due to: " + status);
        }
    });
}



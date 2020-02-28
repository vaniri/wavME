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
        console.log("user for curuser", res);
        if (res.message === "OK") {
            localStorage.token = res.token;

            getUserMatch(res.userId);
            showCurUser(newUser);
        } else { alert("username or email is not available"); }
    });
});

function getUserMatch(userId) {
    $.ajax({
        type: "GET",
        url: "/users/match/" + userId,
        beforeSend: xhr => {
            if (localStorage.token) {
                xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.token);
            }
        },
        success: res => {
            if (res.message !== "OK") {
                console.log("FAIL matching", res);
                return;
            }
            showMatch(res.result);
        }
    });
}

$("#log_in").on("click", event => {
    event.preventDefault();
    let email = $("#existuser_email").val();
    let password = $("#existuser_password").val();

    let existUser = { email, password };

    $.post("/users/login", existUser, (res) => {
        if (res.message !== "OK") {
            console.log("Login failed: ", res.reason);
        }

        localStorage.token = res.token;
        getUserMatch(res.userId);
        showCurUser(res.profile);
    });
});

//create account with lastFm 
$("#user_name").on("blur", () => {
    getLfArtistsFromLastFm($("#user_name").val());
});

function getLfArtistsFromLastFm(userName) {
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

//create account with spotify
$("#submit_spotify").on("click", event => {
    event.preventDefault();
    location.href = 'https://accounts.spotify.com/authorize?client_id=973c7a45dcef46e299c4aad1b3bb7587&response_type=token&redirect_uri=http%3A%2F%2Flocalhost%3A8000%2F&scope=user-read-private%20user-read-email%20user-top-read&state=34fFs29kd09';
});

const searchParams = new URLSearchParams(location.hash.substr(1));
let spotifyToken = searchParams.get("access_token");
if (spotifyToken) { 
    console.log("got access token", spotifyToken);
    $.ajax({
        url: "https://api.spotify.com/v1/me",
        headers: { "Authorization": "Bearer " + spotifyToken },
        success: res => {
            $("#user_name").val(res.display_name);
            $("#user_email").val(res.email);
        }
    });
    $.ajax({
        url: "https://api.spotify.com/v1/me/top/artists",
        headers: { "Authorization": "Bearer " + spotifyToken },
        success: res => {
            let artistsName = res.items.map(item => item.name);
            let artStr = artistsName.join(",");
            $("#user_artists").val(artStr);    
        }
        })
}
//https://developer.spotify.com/documentation/general/guides/authorization-guide/
//https://developer.spotify.com/documentation/web-api/reference/personalization/get-users-top-artists-and-tracks/
//https://developer.mozilla.org/ru/docs/Web/API/Location


//displaying current user 
function showCurUser(user) {
    $("#form_user_container").css('display', 'none');
    $("#curuser_container").css('display', 'block');
    $("#curuser_container").append(`<p class='users_p'><span class='username_loc'>Username:</span> ${user.username}</p><p class='users_p'><span class='username_loc'>Location:</span> ${user.location}</p><img class='user_photo' src='${user.photo}'>`);
    $("#curuser_container").append("<h2>Favorite Artists:</h2><ul class='artists_table'></ul>");
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
    users.forEach(user => user.matchArtists.forEach(artist => $(`li[data-name="${artist.name}"]`).addClass("match")));
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

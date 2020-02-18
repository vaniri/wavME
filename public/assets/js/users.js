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
            console.log(res.userId);
            //get user with certain id
            $.get("/users/match/" + res.userId, (res) => {
                console.log(res);
            })
            showCurUser(newUser);
        } else { console.log("Failed creating new user"); }
    });
})

//displaying current user 
function showCurUser(user) {
    $("#form_container").css('display', 'none');
    $("#form_user_container").append(`<p><span>Username:</span> ${user.username}</p><p><span>Location:</span> ${user.location}</p><img class='user_photo' src='${user.photo}>`);
    $("#form_user_container").append("<h2>Favorite Artists:</h2><ul class='artists_table'></ul>");
    user.artists.forEach(artist => {
        $(".artists_table").append(`<li class='artist'>${artist}</li>`);
    })
}

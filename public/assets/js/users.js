$("#add_user").on("click", event => {
    event.preventDefault();
    let username = $("#user_nqme").val();
    let email = $("#user_email").val();
    let password = $("#user_password").val();
    let photo = $("#user_photo").val();
    let location = $("#user_location").val();
    let artists  = $("#user_artists").val().trim().toLowerCase().split(",");
    console.log(artists);
    let newUser = { username, email, password, photo, location };
    $.post("/users/users", newUser, () => {
        console.log(newUser);
    });
})
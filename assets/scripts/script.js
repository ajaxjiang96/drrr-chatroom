// jQuery Document
let chatlog = [];

$(document).ready(function() {
    // Do some initial setup
    getName();
    buildMessages();

    // poll for new messages every 2.5 seconds
    var msgInterval = setInterval(buildMessages, 500);


    // Register event handlers
    $("#name-form").on("submit", function(e) {
        e.preventDefault();
        var name = $("#user-name").val();

        // Clear the text field
        $("#user-name").val("");

        $.ajax({
            url: "/name",
            type: "POST",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({
                "name": name
            }),
            success: function(response) {
                console.log(response)
                var name = response.user.username;
                console.log(name)
                updateUI(name);
            }
        });
    });

    // Set the user to empty string
    $("#logout").click(function() {
        logout();
    });

    // Stop polling for messages.  You will hvave to reload the
    // page to start polling again.
    $("#pause").click(function() {
        var exit = confirm("Are you sure you want to end the session?");
        if (exit == true) {
            clearInterval(msgInterval);
        }
    });

    $("#msgform").on("submit", function() {
        // TODO : complete this function according to the comments above
        var name = $(".name").text();
        var message = $('#usermsg').val();
        console.log(message);
        $("#usermsg").val("");
        $('#chatbox').animate({scrollBottom: $('#chatbox').height()}, 1000);

        $.ajax({
            url: "/addmsg",
            type: "POST",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({
                text: message,
                from: name
            }),
            success: function(response) {

                buildMessages();

                console.log("send success")
            }
        });
        return false;
    });
    // Get the user name from the server by making an
    // ajax GET request to the url "/name"
    // The callback function on success will call updateUI
    // with the new value for name
    function getName() {
        // TODO : complete this function according to the comments above


        $.ajax({
            url: "/name",
            type: "GET",
            dataType: "json",
            success: function(response) {
                var name = response['name'];
                if (response['name']) {
                    console.log("name");
                }
                updateUI(name);
            }
        });

    }

    // Send the user name to the server
    function postName() {
        var name = $("#user-name").val();

        // Clear the text field
        $("#user-name").val("");

        $.ajax({
            url: "/name",
            type: "POST",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({
                "name": name
            }),
            success: function(response) {
                console.log(response)
                var name = response.user.name;
                updateUI(name);
            }
        });
    }

    // Set the user name to empty
    function logout() {
        $.get("/logout", function(data) {
            updateUI("");
        });
    }

    // If the user has not entered a name show the name entry input
    // Otherwise display the name
    function updateUI(name) {
        $(".name").html(name);
        if (name !== '') {
            $("#name-form").hide();
            $("#msgform").show();
            $(".welcome").show();
        } else {
            $("#name-form").show();
            $("#msgform").hide();
        }
    }

    // Get list of messages to display in the chat box
    function buildMessages() {
        $.get('messages', function(data) {
            let parent = $('#chatbox');
            parent.empty();
            // var diff = (chatlog).not(data).get();
            // console.log(diff);
            let messages = JSON.parse(data);
            for (let i = 0; i < messages.length; i++) {
                let msgwrapper = $('<div>').css("display", "block");
                let tmp = $('<div>').addClass("msg");
                let profile = $('<div>').addClass("profile");
                let photo = $('<div>').addClass("photo").css("background-color", messages[i].color);
                let name = $('<div>').addClass("name-text").text(messages[i].from);
                let messageWrapper = $('<div>').addClass("text-wrapper");
                let message = $('<p>').text(messages[i].text).addClass("text");
                messageWrapper.append(message);
                console.log(data)
                message.css("background-color", messages[i].color);
                profile.append(photo);
                profile.append(name);

                // if (messages[i].from == $(".name").text()) {
                //     tmp.css("margin-right", "0");
                //     // tmp.addClass("right");
                //     // tmp.css("display", "block");
                //     tmp.append(messageWrapper);
                //     tmp.append(profile);
                // } else {
                    tmp.append(profile);
                    tmp.append(messageWrapper);
                // }
                msgwrapper.append(tmp);
                parent.append(msgwrapper);
                // parent.animate({scrollTop: parent.height()}, 1000);
            }
        });
    }

});

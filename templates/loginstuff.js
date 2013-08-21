/*
1. Add to logic.js
2. Call refreshAuthDisplay() instead of refreshQuestions() on initial load
3. Update the appendQuestionsToInterface() method to display the profile picture
*/
// Refresh logged in status, and reload items if logged in
function refreshAuthDisplay() {
    var isLoggedIn = client.currentUser !== null;
    $("#logged-in").toggle(isLoggedIn);
    $("#logged-out").toggle(!isLoggedIn);

    if (isLoggedIn) {
        $('#message').empty();
        refreshQuestions();
    }
    else {
        $('#message').html('You must login to access data.');
    }
}

// Function to login
function logIn() {
    client.login("facebook").then(refreshAuthDisplay, function (error) {
        alert(error);
    });
}

// Function to logut
function logOut() {
    client.logout();
    refreshAuthDisplay();
}

// Loop on questions and create list items out of them
function appendQuestionsToInterface(questions) {
    var listItems = $.map(questions, function (question) {
        var facebookId = question.userId.split(':')[1];
        return $('<li><img class="profile" src="http://graph.facebook.com/' + facebookId + '/picture"/>')
            .append($('<h3 class="question">' + question.text + '</h3>'))
            .append($('<div class="date">' + question.date + '</div>'))
    });
    $('#message').empty();
    $('#questions').empty().append(listItems);
}

// Wire up the login and logout buttons
$("#logged-out button").click(logIn);
$("#logged-in button").click(logOut);


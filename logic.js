$(function () {
    // Add client reference
    var client = new WindowsAzure.MobileServiceClient(
        "https://sabbourchatroom.azure-mobile.net/",
        "DukynDbJjBwavIJjwicAQlCozuQKCs61"
    );

    // Add reference to questions table
    questionTable = client.getTable('question');

    // Function to add a question
    function addQuestion(questionText, callbackFunction, errorFunction) {
        var question = { text: questionText, date: new Date().toTimeString()};
        questionTable.insert(question).then(callbackFunction, errorFunction);
    }

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

    // Function to refresh the questions
    function refreshQuestions() {
        $('#message').html('Loading..');
        questionTable.read().then(appendQuestionsToInterface, handleError);
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

    // Handle errors
    function handleError(error) {
        var text = error + (error.request ? ' - ' + error.request.status : '');
        $('#errorlog').append($('<li>').text(text));
    }


    // Wire up the button with the method calls
    $('#add-question').submit(function (evt) {
        // Get textbox value
        var textbox = $('#question-text'),
            questionText = textbox.val();
        if (questionText !== '') {
            // Call add question, then refresh the todo items when done
            addQuestion(questionText, refreshQuestions, handleError);
        }
        // Clear the text box
        textbox.val('').focus();
        // Prevent the form from submitting
        evt.preventDefault();
    });

    // Wire up the login and logout buttons
    $("#logged-out button").click(logIn);
    $("#logged-in button").click(logOut);

    // Refresh questions on initial load
    refreshAuthDisplay();
});
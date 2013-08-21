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
        var question = { text: questionText, date: new Date().toTimeString() };
        questionTable.insert(question).then(callbackFunction, errorFunction);
    }

    // Function to refresh the questions
    function refreshQuestions() {
        questionTable.read().then(appendQuestionsToInterface, handleError);
    }

    // Loop on questions and create list items out of them
    function appendQuestionsToInterface(questions) {
        var listItems = $.map(questions, function (question) {
            return $('<li>')
            .append($('<h3 class="question">' + question.text + '</h3>'))
            .append($('<div class="date">' + question.date + '</div>'))
        });

        $('#questions').empty().append(listItems);
    }

    // Handle errors
    function handleError(error) {
        var text = error + (error.request ? ' - ' + error.request.status : '');
        $('#errorlog').append($('<li>').text(text));
    }


    // Refresh questions on initial load
    refreshQuestions();

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
});
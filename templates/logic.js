$(function () {   
    // Add client reference

    // Add reference to questions table

    // Function to add a question
    function addQuestion(questionText, callbackFunction, errorFunction) {
        
    }

    // Function to refresh the questions
    function refreshQuestions() {
        
    }
    
    // Loop on questions and create list items out of them
    function appendQuestionsToInterface(questions) {
        var listItems = $.map(questions, function (question) {
            return $('<li>')
            .append($('<div>' + question.text + " asked at " + question.date + '</div>'));
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
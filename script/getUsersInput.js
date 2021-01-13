import apiCall from './apiCall.js';
import handleNominations from './handleNominations.js';

const getUsersInput = (function() {
    const form = document.getElementsByTagName('form')[0];
    const inputField = document.getElementById('movie');
    const suggestions = document.getElementsByClassName('suggestions')[0];
    const showNominationsButton = document.getElementsByClassName('showNominations')[0];
    
    /**
     * function to pass value of input field to make api calls
     * @param {SubmitEvent} event The submit event object from submitting the form
     */
    function handleFormSubmission(event) {
        event.preventDefault();
        apiCall.omdb(inputField.value, true);
        inputField.value = '';
    };

    /**
     * function to handle changes to user's input for search autocompletion
     */
    function handleInputChanges() {
        apiCall.omdb(inputField.value, false);
        if (!inputField.value) {
            suggestions.innerHTML = ''; // empty suggestions if input field is empty
        };
    };

    /**
     * function to get user's input
     */
    function getInput() {
        form.onsubmit = handleFormSubmission;
        inputField.addEventListener('input', handleInputChanges);
    };

    function init() {
        showNominationsButton.onclick = handleNominations.buildNominationsDisplay;
        getInput();
    };

    return {
        init: init
    };
}());

export default getUsersInput;
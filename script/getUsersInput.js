import apiCall from './apiCall.js';

const getUsersInput = (function() {
    const form = document.getElementsByClassName('searchField')[0];
    const inputField = document.getElementById('movie');
    const searchButton = form.getElementsByClassName('searchButton')[0];
    const suggestions = document.getElementsByClassName('suggestions')[0];
    const nextPageButton = document.getElementsByClassName('nextPage')[0];
    const previousPageButton = document.getElementsByClassName('previousPage')[0];
    let page = 1;
    let currentSearch = 'harry';

    /**
     * function to pass value of input field to make api calls
     * @param {SubmitEvent} event The submit event object from submitting the form
     */
    function handleFormSubmission(event) {
        event.preventDefault();
    };

    /**
     * function to handle changes to user's input for search autocompletion
     */
    function handleInputChanges() {
        currentSearch = inputField.value;
        apiCall.omdb(currentSearch, false, 1);
        if (!inputField.value) {
            suggestions.innerHTML = ''; // empty suggestions if input field is empty
            suggestions.classList.add('hidden');
        };
    };

    function handleSearchButton() {
        page = 1;
        apiCall.omdb(inputField.value, true, page, true);
        currentSearch = inputField.value;
        inputField.value = '';
    };

    function handleNextPageButton() {
        page++;
        apiCall.omdb(currentSearch, true, page);
    };

    function handlePreviousPageButton() {
        page--;
        if (page < 1) page = 1;
        apiCall.omdb(currentSearch, true, page);
    };

    /**
     * function to get user's input
     */
    function getInput() {
        form.onsubmit = handleFormSubmission;
        inputField.addEventListener('input', handleInputChanges);
    };

    function init() {
        searchButton.onclick = handleSearchButton;
        nextPageButton.onclick = handleNextPageButton;
        previousPageButton.onclick = handlePreviousPageButton;
        getInput();
        apiCall.omdb(currentSearch, true, 1);
    };

    return {
        init: init
    };
}());

export default getUsersInput;
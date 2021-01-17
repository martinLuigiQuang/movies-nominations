import apiCall from './apiCall.js';

const getUsersInput = (function() {
    const form = document.getElementsByClassName('searchField')[0]; // search field form element
    const inputField = document.getElementById('movie'); // input field for movie titles and year
    const searchButton = form.getElementsByClassName('searchButton')[0]; // search button in search field
    const suggestions = document.getElementsByClassName('suggestions')[0]; // dropdown autosuggestion menu
    const nextPageButton = document.getElementsByClassName('nextPage')[0]; // next search result page button
    const previousPageButton = document.getElementsByClassName('previousPage')[0]; // previous search result page button
    let page = 1; // search result page; default value is 1
    let currentSearch = 'harry'; // current search value; default is 'harry'

    /**
     * Prevent the form element from refreshing the page when it submits
     * @param {SubmitEvent} event The submit event object from submitting the form
     */
    function handleFormSubmission(event) {
        event.preventDefault();
    };

    /**
     * Handle changes to user's input for search autosuggestion
     */
    function handleInputChanges() {
        currentSearch = inputField.value;
        apiCall.omdb(currentSearch, false, 1);
        if (!inputField.value) {
            suggestions.innerHTML = ''; // empty suggestions if input field is empty
            suggestions.classList.add('hidden');
        };
    };

    /**
     * Pass user's input to apiCall module to get responses from API
     * Update current search to the newest search
     * Empty input field
     */
    function handleSearchButton() {
        page = 1;
        apiCall.omdb(inputField.value, true, page, true);
        currentSearch = inputField.value;
        inputField.value = '';
    };

    /**
     * Move to next search results page
     */
    function handleNextPageButton() {
        page++;
        apiCall.omdb(currentSearch, true, page);
    };

    /**
     * Move to previous search results page
     */
    function handlePreviousPageButton() {
        page--;
        if (page < 1) page = 1;
        apiCall.omdb(currentSearch, true, page);
    };

    /**
     * Get user's input from input field
     */
    function getInput() {
        form.onsubmit = handleFormSubmission;
        inputField.addEventListener('input', handleInputChanges);
    };

    /**
     * Attach event listeners to search button, next page button, and previous page button
     * Make API calls according to user's input
     */
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
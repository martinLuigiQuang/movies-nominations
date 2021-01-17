import handleLongTitles from './handleLongTitles.js';

const displaySearchSuggestions = (function() {
    let search = ''; // the current user's input in the input field
    const inputField = document.getElementById('movie'); // the input field in the search field form
    const suggestions = document.getElementsByClassName('suggestions')[0]; // the dropdown autosuggestion menu

    /**
     * Create the dropdown autosuggestion menu
     * @param {Array} movies The movies array from API response
     */
    function createSuggestionsList(movies) {
        const suggestionsList = 
            movies.length
            ?   `<ul>
                    ${
                        movies.map( movie => {
                            return `<li><a href="#">${handleLongTitles(movie.Title, 45)}, ${movie.Year}</a></li>`
                        }).reduce( (acc, cur) => {
                            return acc + cur;
                        })  
                    }
                </ul>`
            :   ''
        ;
        const template = document.createElement('template');
        template.innerHTML = suggestionsList;
        return template;
    };

    /**
     * Handle the selection of an autosuggested title
     * @param {ClickEvent} event The click event on one of the autosuggested titles in the dropdown menu
     * @param {function} apiCall The function to make API calls
     */
    function handleSuggestionSelection(event, apiCall) {
        search = event.target.innerText;
        if (search.trim()) {
            suggestions.innerHTML = '';
            apiCall(search, true, 1, true);
            inputField.value = '';
        } else {
            suggestions.innerHTML = '';
        };
        suggestions.classList.add('hidden');
    };

    /**
     * Bind the dropdown autosuggestion menu to a DOM element
     * Attach event listeners to each of the autosuggested titles
     * @param {Array} movies The movies array from API response 
     * @param {function} apiCall The function to make API calls
     */
    function buildSuggestionsList(movies, apiCall) {
        if (Array.isArray(movies)) {
            const suggestionsList = createSuggestionsList(movies);
            suggestions.innerHTML = '';
            suggestions.classList.remove('hidden');
            suggestions.appendChild(suggestionsList.content);
            const suggestionsListItems = [...suggestions.getElementsByTagName('a')];
            suggestionsListItems.forEach( item => {
                item.onclick = (event) => handleSuggestionSelection(event, apiCall);
            });
        };
    };
    
    return {
        build: buildSuggestionsList
    };
}());

export default displaySearchSuggestions;
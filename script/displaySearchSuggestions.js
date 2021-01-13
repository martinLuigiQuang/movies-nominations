import apiCall from './apiCall.js';
import displaySearchResults from './displaySearchResults.js';

const displaySearchSuggestions = (function() {
    const inputField = document.getElementById('movie');
    const suggestions = document.getElementsByClassName('suggestions')[0];

    function createSuggestionsList(movies) {
        const suggestionsList = 
            movies.length
            ?   `<ul>
                    ${
                        movies.map( movie => {
                            return `<li><a>${movie.Title} (${movie.Year})</a></li>`
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

    function handleSuggestionSelection(event, apiCall) {
        const search = event.target.innerText;
        suggestions.innerHTML = '';
        apiCall(search, true);
        inputField.value = '';
    };

    function buildSuggestionsList(movies, apiCall) {
        if (Array.isArray(movies)) {
            const suggestionsList = createSuggestionsList(movies);
            suggestions.innerHTML = '';
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
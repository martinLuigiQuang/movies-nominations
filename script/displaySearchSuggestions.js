const displaySearchSuggestions = (function() {
    const inputField = document.getElementById('movie');
    const suggestions = document.getElementsByClassName('suggestions')[0];

    function createSuggestionsList(movies) {
        const suggestionsList = 
            movies.length
            ?   `<ul>
                    ${
                        movies.map( movie => {
                            return `<li><a href="#">${handleLongTitle(movie.Title, 45)} (${movie.Year})</a></li>`
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

    function handleLongTitle(title, maxLength) {
        if (title.length > maxLength) {
            if (title.charAt(maxLength - 1) !== ' ') {
                const omittedInfo = title.slice(maxLength, title.length);
                let positionOfNextSpace = omittedInfo.search(' ');
                if (positionOfNextSpace < 0) {
                    const numOfCharsToEndOfString = title.length - maxLength;
                    if (numOfCharsToEndOfString < 10) {
                        positionOfNextSpace = numOfCharsToEndOfString;
                    };
                };
                maxLength += positionOfNextSpace;
            };
            title = title.slice(0, maxLength);
            title += ' ...';
        };
        return title;
    };

    function handleSuggestionSelection(event, apiCall) {
        const search = event.target.innerText;
        if (search.trim()) {
            suggestions.innerHTML = '';
            apiCall(search, true);
            inputField.value = '';
        } else {
            suggestions.innerHTML = '';
        }
    };

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
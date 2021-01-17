import handleNominations from './handleNominations.js';

const displaySearchResults = (function() {
    const searchResultsSection = document.getElementsByClassName('searchResults')[0];
    const suggestions = document.getElementsByClassName('suggestions')[0];

    function createIndividualMovieContainer(movie) {
        return `
            <div class="movieContainer">
                <figure class="posterContainer">
                    <img 
                        src="
                            ${
                                movie.Poster === 'N/A'
                                ?   `../assets/no-poster.jpg`
                                :   movie.Poster
                            }
                        "
                        alt="poster for ${movie.Title} ${movie.Year}"
                    />
                </figure> <!-- clsoing posterContainer -->
                <div class="movieDetails">
                    <h3>${handleLongTitle(movie.Title, 45)}</h3>
                    <p>(${movie.Year})</p>
                    <button class="nominateButton" value="${movie.imdbID}">nominate</button>
                </div> <!-- closing movieDetail -->
            </div> <!-- closing movieContainer -->
        `;
    };

    function createSearchResultsDisplay(movies) {
        const searchResultsDisplay = `
        ${
            movies.map( movie => {
                return createIndividualMovieContainer(movie);
            }).reduce( (acc, cur) => {
                return acc + cur;
            })
        }
        `;
        const template = document.createElement('template');
        template.innerHTML = searchResultsDisplay;
        return template;
    };
    
    function buildSearchResultsDisplay(movies) {
        suggestions.innerHTML = '';
        suggestions.classList.add('hidden');
        if (Array.isArray(movies)) {
            const searchResultsDisplay = createSearchResultsDisplay(movies);
            searchResultsSection.innerHTML = '';
            searchResultsSection.appendChild(searchResultsDisplay.content);
            const nominateButtons = [...searchResultsSection.getElementsByClassName('nominateButton')];
            nominateButtons.forEach( button => {
                button.onclick = handleNominations.getNominations;
            });
            handleNominations.disableNominateButtons();
        };
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

    return {
        build: buildSearchResultsDisplay
    };
}());

export default displaySearchResults;
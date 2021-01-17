import handleNominations from './handleNominations.js';
import handleLongTitles from './handleLongTitles.js';

const displaySearchResults = (function() {
    const searchResultsSection = document.getElementsByClassName('searchResults')[0]; // the search results display section
    const suggestions = document.getElementsByClassName('suggestions')[0]; // the dropdown autosuggestion menu
    /**
     * Create individual movie container for each movie
     * @param {Object} movie The movie object from API response
     */
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
                    <h3>${handleLongTitles(movie.Title, 45)}</h3>
                    <p>(${movie.Year})</p>
                    <button class="nominateButton" value="${movie.imdbID}">nominate</button>
                </div> <!-- closing movieDetail -->
            </div> <!-- closing movieContainer -->
        `;
    };

    /**
     * Create the search results display section
     * @param {Array} movies The movies array from API response 
     */
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
    
    /**
     * Bind the search results display section to a DOM element
     * Attach event listeners to each of the nominate buttons
     * Disable any nominate button that has a value that matches the ID of any of the nominated movies
     * @param {Array} movies The movies array from API response 
     */
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

    return {
        build: buildSearchResultsDisplay
    };
}());

export default displaySearchResults;
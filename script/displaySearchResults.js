import handleNominations from './handleNominations.js';

const displaySearchResults = (function() {
    const searchResultsSection = document.getElementsByClassName('results')[0];
    const showNominationsButton = document.getElementsByClassName('showNominations')[0];
    function createIndividualMovieContainer(movie) {
        const isDisabled = handleNominations.disableNominateButton(movie);
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
                <h3>${movie.Title}</h3>
                <p>(${movie.Year})</p>
                ${
                    isDisabled
                    ?   `<button class="nominateButton disabled" disabled="true">nominate</button>`
                    :   `<button class="nominateButton">nominate</button>`
                }
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
        if (Array.isArray(movies)) {
            const searchResultsDisplay = createSearchResultsDisplay(movies);
            searchResultsSection.innerHTML = '';
            searchResultsSection.appendChild(searchResultsDisplay.content);
            const nominateButtons = [...searchResultsSection.getElementsByClassName('nominateButton')];
            nominateButtons.forEach( button => {
                button.onclick = handleNominations.getNominations;
            });
        };
        showNominationsButton.onclick = handleNominations.buildNominationsDisplay;
    };

    return {
        build: buildSearchResultsDisplay
    };
}());

export default displaySearchResults;
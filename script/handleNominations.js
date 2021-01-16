const handleNominations = (function() {
    const nominationSection = document.getElementsByClassName('nominations')[0];
    const popUpMessageDiv = document.getElementsByClassName('popUp')[0];
    let showNominations = false;
    let nominations = [];

    function getNominations(event) {
        if (nominations.length < 5) {
            event.target.setAttribute('disabled', 'true');
            event.target.classList.add('disabled');
            const [poster] = event.target.parentNode.parentNode.children;
            const [title, year] = event.target.parentNode.children;
            const movieNomination = {
                'Poster': poster.children[0].src,
                'Title': title.innerText,
                'Year': parseMovieYear(year.innerText)
            };
            nominations.push(movieNomination);
            buildNominationsDisplay();
        };
        buildPopUpMessage();
        const timeout = setTimeout(() => {
            popUpMessageDiv.classList.add('hidden'); 
            clearTimeout(timeout);
        }, 1000);
    };

    function buildPopUpMessage() {
        const numOfNominationsLeft = 5 - nominations.length;
        const message = `<h3>You have ${ numOfNominationsLeft } ${ numOfNominationsLeft === 1 ? 'nomination' : 'nominations' } left</h3>`;
        popUpMessageDiv.innerHTML = message;
        popUpMessageDiv.classList.remove('hidden');
    };

    function parseMovieYear(year) {
        const movieYearRegex = /([0-9]{4})/;
        const movieYear = movieYearRegex.exec(year);
        return movieYear[1];
    };

    function disableNominateButton(movie) {
        let isDisabled = false;
        if (!nominations.length) return isDisabled;
        nominations.forEach( nomination => {
            if (movie.Poster === 'N/A') {
                isDisabled = isDisabled || movie.Title === nomination.Title && `${movie.Year}` === nomination.Year;
                if (isDisabled) return isDisabled;
            } else {
                isDisabled = isDisabled || movie.Poster === nomination.Poster && movie.Title === nomination.Title && `${movie.Year}` === nomination.Year;
                if (isDisabled) return isDisabled;
            };
        });
        return isDisabled;
    };

    function createIndividualDisplay(movie) {
        return `
            <div class="movieContainer">
                <figure class="posterContainer">
                    <img 
                        src="${movie.Poster}" 
                        alt="poster for ${movie.Title} ${movie.Year}"
                    />
                </figure> <!-- closing posterContainer -->
                <div class="movieDetails">
                    <h3>${movie.Title}</h3>
                    <p>${movie.Year}</p>
                    <button class="removeButton">Remove</button>
                </div> <!-- closing moviesDetails -->
            </div> <!-- closing movieContainer -->
        `;
    };

    function createNominationsDisplay() {
        let nominationsDisplay = '';
        if (nominations.length) {
            nominationsDisplay = `
                <div class="nominationsContainer">
                    ${
                        nominations.map( (movie, index) => {
                            return createIndividualDisplay(movie, index);
                        }).reduce( (acc, cur) => {
                            return acc + cur;
                        })  
                    }
                </div> <!-- closing nominationsContainer -->
            `;
        } else {
            nominationsDisplay = `<p>You haven't nominated a movie yet!</p>`;            
        };
        const template = document.createElement('template');
        template.innerHTML = nominationsDisplay;
        return template;
    };

    function removeNomination(event) {
        const [removedPoster] = event.target.parentNode.parentNode.children;
        const [removedTitle, removedYear] = event.target.parentNode.children;
        let arrayIndex;
        nominations.forEach( (movie, index) => {
            if (removedPoster.children[0].src === movie.Poster && removedTitle.innerText === movie.Title && removedYear.innerText === movie.Year) {
                arrayIndex = index;
                return;
            };
        });
        if (arrayIndex !== undefined || arrayIndex !== null) {
            nominations.splice(arrayIndex, 1);
            buildNominationsDisplay();
            const movies = [...document.getElementsByClassName('movieContainer')];
            movies.forEach( movie => {
                const [poster] = movie.children;
                const [title, year, button] = movie.children[1].children;
                if (poster.children[0].src === removedPoster.children[0].src && title.innerText === removedTitle.innerText && year.innerText === `(${removedYear.innerText})`)  {
                    button.removeAttribute('disabled');
                };
            });
        };
    };

    function buildNominationsDisplay() {
        const nominationsDisplay = createNominationsDisplay();
        nominationSection.innerHTML = '';
        nominationSection.appendChild(nominationsDisplay.content);
        const removeButtons = [...nominationSection.getElementsByClassName('removeButton')];
        removeButtons.forEach( button => {
            button.onclick = removeNomination;
        });
        if (nominations.length === 0) {
            showNominations = !showNominations;
        };
    };
    
    return {
        disableNominateButton: disableNominateButton,
        getNominations: getNominations,
        buildNominationsDisplay: buildNominationsDisplay
    };
}());

export default handleNominations;
const handleNominations = (function() {
    const nominationSection = document.getElementsByClassName('nominations')[0];
    let showNominations = false;
    let nominations = [];

    function getNominations(event) {
        event.target.setAttribute('disabled', 'true');
        event.target.classList.add('disabled');
        const [poster] = event.target.parentNode.parentNode.children;
        const [title, year] = event.target.parentNode.children;
        const movieNomination = {
            'Poster': poster.children[0].src,
            'Title': title.innerText,
            'Year': year.innerText
        };
        nominations.push(movieNomination);
        checkNominations();
    };

    function disableNominateButton(movie) {
        let isDisabled = false;
        if (!nominations.length) return isDisabled;
        nominations.forEach( nomination => {
            if (movie.Poster === 'N/A') {
                isDisabled = isDisabled || movie.Title === nomination.Title && `(${movie.Year})` === nomination.Year;
                if (isDisabled) return isDisabled;
            } else {
                isDisabled = isDisabled || movie.Poster === nomination.Poster && movie.Title === nomination.Title && `(${movie.Year})` === nomination.Year;
                if (isDisabled) return isDisabled;
            };
        });
        return isDisabled;
    };

    function checkNominations() {
        if (nominations.length > 5) {
            // display full nominations message 
            console.log('you have enough nominations');
        } else {
            // display acknowledgement of nomination
            console.log('thank you')
        };
    };

    function createIndividualDisplay(movie) {
        return `
            <div class="nominationContainer">
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
            </div> <!-- closing nominationContainer -->
        `;
    };

    function createNominationsDisplay() {
        let nominationsDisplay = '';
        if (nominations.length) {
            nominationsDisplay = nominations.map( (movie, index) => {
                return createIndividualDisplay(movie, index);
            }).reduce( (acc, cur) => {
                return acc + cur;
            });
        } else {
            nominationsDisplay = `<h2>You haven't nominated a movie yet!</h2>`;            
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
            if (nominations.length) {
                buildNominationsDisplay();
            } else {
                nominationSection.innerHTML = '';
            };
            const movies = [...document.getElementsByClassName('movieContainer')];
            movies.forEach( movie => {
                const [poster] = movie.children;
                const [title, year, button] = movie.children[1].children;
                if (poster.children[0].src === removedPoster.children[0].src && title.innerText === removedTitle.innerText && year.innerText === removedYear.innerText)  {
                    button.removeAttribute('disabled');
                };
            });
        };
    };

    function buildNominationsDisplay() {
        if (!showNominations) {
            const nominationsDisplay = createNominationsDisplay();
            nominationSection.innerHTML = '';
            nominationSection.appendChild(nominationsDisplay.content);
            const removeButtons = [...nominationSection.getElementsByClassName('removeButton')];
            removeButtons.forEach( button => {
                button.onclick = removeNomination;
            });
            showNominations = !showNominations;
        } else {
            nominationSection.innerHTML = '';
            showNominations = !showNominations;
        }
    };
    
    return {
        disableNominateButton: disableNominateButton,
        getNominations: getNominations,
        buildNominationsDisplay: buildNominationsDisplay
    };
}());

export default handleNominations;
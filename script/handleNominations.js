import firebase from './firebase.js';

const handleNominations = (function() {
    const databaseReference = firebase.database().ref();
    const nominationSection = document.getElementsByClassName('nominations')[0];
    const searchResultsSection = document.getElementsByClassName('searchResults')[0];
    const popUpMessageDiv = document.getElementsByClassName('popUp')[0];
    const collapseNominationsButton = document.getElementsByClassName('collapseNominations')[0];
    collapseNominationsButton.onclick = handleCollapseNominationsButton;
    let showNominations = false;
    let nominations = [];

    databaseReference.on('value', data => {
        const firebaseDataObj = data.val();
        nominations = firebaseDataObj;
        buildNominationsDisplay();
    });

    function getNominations(event) {
        if (nominations.length < 5) {
            event.target.setAttribute('disabled', 'true');
            event.target.classList.add('disabled');
            const [poster] = event.target.parentNode.parentNode.children;
            const [title, year] = event.target.parentNode.children;
            const movieNomination = {
                'Poster': poster.children[0].src,
                'Title': title.innerText,
                'Year': parseMovieYear(year.innerText),
                'ID': event.target.value
            };
            nominations.push(movieNomination);
            databaseReference.set(nominations);
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

    function handleCollapseNominationsButton() {
        nominationSection.classList.toggle('hidden');
    };

    function parseMovieYear(year) {
        const movieYearRegex = /([0-9]{4})/;
        const movieYear = movieYearRegex.exec(year);
        return movieYear[1];
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
                    <button class="removeButton" value="${movie.ID}">Remove</button>
                </div> <!-- closing moviesDetails -->
            </div> <!-- closing movieContainer -->
        `;
    };

    function createNominationsDisplay() {
        let nominationsDisplay = '';
        if (!nominations || !nominations.length) {
            nominationsDisplay = `<p>You haven't nominated a movie yet!</p>`;            
        } else {
            nominationsDisplay = `
                <div class="nominationsContainer">
                    ${
                        nominations.length
                        ?   nominations.map( (movie, index) => {
                                return createIndividualDisplay(movie, index);
                            }).reduce( (acc, cur) => {
                                return acc + cur;
                            })  
                        :   ''
                    }
                </div> <!-- closing nominationsContainer -->
            `;
        };
        const template = document.createElement('template');
        template.innerHTML = nominationsDisplay;
        return template;
    };

    function removeNomination(event) {
        const [,, removedButton] = event.target.parentNode.children;
        let arrayIndex;
        nominations.forEach( (movie, index) => {
            if (movie.ID === removedButton.value) {
                arrayIndex = index;
                return;
            };
        });
        if (arrayIndex !== undefined || arrayIndex !== null) {
            nominations.splice(arrayIndex, 1);
            databaseReference.set(nominations);
            buildNominationsDisplay();
            const movies = [...searchResultsSection.getElementsByClassName('movieContainer')];
            movies.forEach( movie => {
                const [,, button] = movie.children[1].children;
                if (button.value === removedButton.value)  {
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
        if (nominations) {
            showNominations = !showNominations;
        };
        disableNominateButtons();
    };

    function disableNominateButtons() {
        const movies = [...searchResultsSection.getElementsByClassName('movieContainer')];
        if (nominations) {
            movies.forEach( movie => {
                const [,, button] = movie.children[1].children;
                nominations.forEach( nomination => {
                    const {ID} = nomination;
                    if (ID === button.value)  {
                        button.setAttribute('disabled', 'true');
                    };
                });
            });
        } else {
            nominations = [];
        };
    };
    
    return {
        getNominations: getNominations,
        buildNominationsDisplay: buildNominationsDisplay,
        disableNominateButtons: disableNominateButtons
    };
}());

export default handleNominations;
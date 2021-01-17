import firebase from './firebase.js';

const handleNominations = (function() {
    const databaseReference = firebase.database().ref(); // firebase reference
    const nominationSection = document.getElementsByClassName('nominations')[0]; // nominations display section
    const searchResultsSection = document.getElementsByClassName('searchResults')[0]; // search results display section
    const popUpMessageDiv = document.getElementsByClassName('popUp')[0]; // pop up messagge element
    const collapseNominationsButton = document.getElementsByClassName('collapseNominations')[0]; // collapse nomination button
    collapseNominationsButton.onclick = handleCollapseNominationsButton; // attach event listener to collapse nomination button
    let showNominations = false; // boolean value to toggle nominations display section
    let nominations = []; // nominations array

    // Get data from firebase and build the nominations display section accordingly
    databaseReference.on('value', data => {
        const firebaseDataObj = data.val();
        nominations = firebaseDataObj;
        buildNominationsDisplay();
    });

    /**
     * Get user's nominated movie information
     * Push to firebase
     * Display then clear pop up message after 1 second 
     * @param {ClickEvent} event The click event from the nomimate buttons in search results display section
     */
    function getNominations(event) {
        if (nominations.length < 5) {
            // Disable the nominate button when clicked
            event.target.setAttribute('disabled', 'true');
            event.target.classList.add('disabled');
            // Gather movie information and push to firebase
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
            // Build the nominations display section
            buildNominationsDisplay();
        };
        // Build the pop up message
        buildPopUpMessage();
        // Clear the pop up message after 1 second
        const timeout = setTimeout(() => {
            popUpMessageDiv.classList.add('hidden'); 
            clearTimeout(timeout);
        }, 1000);
    };

    /**
     * Obtain movie year from DOM element innerText by RegEx
     * @param {string} year The innerText of a DOM element that carries the year of the movie
     */
    function parseMovieYear(year) {
        const movieYearRegex = /([0-9]{4})/;
        const movieYear = movieYearRegex.exec(year);
        return movieYear[1];
    };

    /**
     * 
     * @param {ClickEvent} event The click event from remove nomination button in the nominations display section
     */
    function removeNomination(event) {
        // Gather the id for the movie to be removed
        const [,, removedButton] = event.target.parentNode.children;
        // Find the indexed position of the movie to be removed in the nominations array
        let arrayIndex;
        if (nominations) {
            nominations.forEach( (movie, index) => {
                if (movie.ID === removedButton.value) {
                    arrayIndex = index;
                    return;
                };
            });
        };
        if (arrayIndex !== undefined && arrayIndex !== null) {
            // Remove the movie from nominations array
            nominations.splice(arrayIndex, 1);
            // Update firebase with the new nominations array
            databaseReference.set(nominations);
            // Rebuild nominations display section
            buildNominationsDisplay();
            // Loop through each movie in the search results display section and enable the nominate button for the movie just removed from the nominations array
            const movies = [...searchResultsSection.getElementsByClassName('movieContainer')];
            movies.forEach( movie => {
                const [,, button] = movie.children[1].children;
                if (button.value === removedButton.value)  {
                    // Enable the nominate button if the movie id matches that of the movie removed from the nominations
                    button.removeAttribute('disabled');
                };
            });
        };
    };

    /**
     * Loop through the movies in the search results display section and disable the buttons of the movies that have been nominated
     */
    function disableNominateButtons() {
        // Get the movies on display in the search results display section
        const movies = [...searchResultsSection.getElementsByClassName('movieContainer')];
        if (nominations) {
            movies.forEach( movie => {
                const [,, button] = movie.children[1].children;
                nominations.forEach( nomination => {
                    const {ID} = nomination;
                    if (ID === button.value)  {
                        // Disable the corresponding nominate button if a match is found
                        button.setAttribute('disabled', 'true');
                    };
                });
            });
        } else {
            nominations = [];
        };
    };

    /**
     * Toggle the 'hidden' class for nominations display section
     */
    function handleCollapseNominationsButton() {
        nominationSection.classList.toggle('hidden');
    };

    /**
     * Create the individual display for each nominated movie
     * @param {Object} movie The movie object from nominations array
     */
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

    /**
     * Create the nominations display section
     */
    function createNominationsDisplay() {
        let nominationsDisplay = '';
        // Display message when there are no nominations
        if (!nominations || !nominations.length) {
            nominationsDisplay = `<p>You haven't nominated a movie yet!</p>`;            
        } else {
            // Display the nominations
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

    /**
     * Create the pop up message for how many nominations are left
     */
    function buildPopUpMessage() {
        const numOfNominationsLeft = 5 - nominations.length;
        const message = `<h3>You have ${ numOfNominationsLeft } ${ numOfNominationsLeft === 1 ? 'nomination' : 'nominations' } left</h3>`;
        popUpMessageDiv.innerHTML = message;
        popUpMessageDiv.classList.remove('hidden');
    };

    /**
     * Bind the nominations display section to DOM element
     * Attach event listeners to remove nomination buttons
     * Disable nominate buttons in the search results display section if a movie has been nominated
     */
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
    
    return {
        getNominations: getNominations,
        buildNominationsDisplay: buildNominationsDisplay,
        disableNominateButtons: disableNominateButtons
    };
}());

export default handleNominations;
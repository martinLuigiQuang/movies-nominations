import displaySearchResults from './displaySearchResults.js';
import displaySearchSuggestions from './displaySearchSuggestions.js';

const apiCall = (function() {
    let cachedMovies = []; // cached movies array
    let apiPage = 1; // the page parameter for API call
    let numOfMoviesToDisplay = 9; // the number of movies to be displayed in the search results display section
    let totalNumOfSearchResults = 1; // the total number of movies returned from the API call

    /**
     * function to parse the movie year, if any, and the movie title
     * @param {string} search The value of the input field
     */
    function parseMovieYear(search) {
        const movieYearRegex = /, ([0-9]{4})/;
        const movieYear = movieYearRegex.exec(search);
        search = search.replace(/, [0-9][0-9][0-9][0-9]/, '').trim();
        return [search, movieYear];
    };

    /**
     * Get the url for the API call
     * @param {string} movieTitle The full movie title
     * @param {Array} movieYear The RegEx result array containing the information of the movie year
     * @param {integer} apiPage The page parameter for the API call
     */
    function getApiUrl(movieTitle, movieYear, apiPage) {
        let url = 'http://www.omdbapi.com/';
        if (movieYear && movieTitle) {
            url = url + `?s=${movieTitle}&y=${movieYear[1]}&type=movie&page=${apiPage}&apikey=b1bd9324`;
        } else if (movieTitle) {
            url = url + `?s=${movieTitle}&type=movie&page=${apiPage}&apikey=b1bd9324`;
        } else if (movieYear) {
            url = url + `?s=${movieYear[1]}&y=${movieYear[1]}&type=movie&page=${apiPage}&apikey=b1bd9324`;
        };
        return url;
    };

    /**
     * Record the total number of movies returned from API call
     * Cache the movies from API call in the local cachedMovies array for pagination
     * Display the response from API call in the search results display section
     * Increase the apiPage parameter for the next API call, in case the next page button is clicked
     * @param {Object} response The response object from API call
     * @param {integer} page The search results display section page
     * @param {integer} numOfMoviesToDisplay The number of movies to be displayed in the search results display section
     */
    function displayApiResponse(response, page, numOfMoviesToDisplay) {
        if (response.Response === 'True') {
            totalNumOfSearchResults = response.totalResults;
            cachedMovies.push(...response.Search);
            displaySearchResults.build(cachedMovies.slice(numOfMoviesToDisplay * (page - 1), numOfMoviesToDisplay * page));
            apiPage++;
        };
    };

    /**
     * async function to make api calls
     * @param {string} search The value of the input field
     * @param {boolean} isSubmitted True if form is submitted and false if not  
     * @param {integet} page The search results display section page
     * @param {boolean} isNewSearch True if a new search input was submitted by the user     
     */
    async function omdb(search, isSubmitted, page, isNewSearch) {
        if (isNewSearch) {
            cachedMovies = [];
            apiPage = 1;
        };
        // Parse the search input for movie title and movie year if any
        const [movieTitle, movieYear] = parseMovieYear(search);
        // If the search is submitted, build the search results display section
        if (isSubmitted) {
            // If the cachedMovies array does not have enough movies for the search results display section, make new API calls
            while (9 * page > cachedMovies.length && totalNumOfSearchResults > cachedMovies.length) {
                const url = getApiUrl(movieTitle, movieYear, apiPage);
                try {
                    const promise = await fetch(url);
                    const response = await promise.json();
                    displayApiResponse(response, page, numOfMoviesToDisplay);
                } catch (err) {
                    console.log(err);
                    break;
                };
            } 
            // If the cachedMovies array has enough movies to display, build search results display section from cached movies array
            if (9 * page < cachedMovies.length) {
                displaySearchResults.build(cachedMovies.slice(numOfMoviesToDisplay * (page - 1), numOfMoviesToDisplay * page));
            };
        // If the search is not yet submitted, build the dropdown autosuggestion menu
        } else {
            const url = getApiUrl(movieTitle, movieYear, 1);
            try {
                const promise = await fetch(url);
                const response = await promise.json();
                displaySearchSuggestions.build(response.Search, omdb);
            } catch (err) {
                console.log(err);
            };
        };
    };

    return {
        omdb: omdb
    };
}());

export default apiCall;
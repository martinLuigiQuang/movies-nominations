import displaySearchResults from './displaySearchResults.js';
import displaySearchSuggestions from './displaySearchSuggestions.js';

const apiCall = (function() {
    let cachedMovies = [];
    let apiPage = 1;
    let numOfMoviesToDisplay = 9; 

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

    function displayApiResponse(response, page, numOfMoviesToDisplay) {
        if (response.Response === 'True') {
            cachedMovies.push(...response.Search);
            displaySearchResults.build(cachedMovies.slice(numOfMoviesToDisplay * (page - 1), numOfMoviesToDisplay * page));
            apiPage++;
        };
    };

    /**
     * async function to make api calls
     * @param {string} search The value of the input field
     * @param {boolean} isSubmitted True if form is submitted and false if not  
     */
    async function omdb(search, isSubmitted, page, isNewSearch) {
        if (isNewSearch) {
            cachedMovies = [];
            apiPage = 1;
        };
        const [movieTitle, movieYear] = parseMovieYear(search);
        if (isSubmitted) {
            while (9 * page > cachedMovies.length) {
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
            if (9 * page < cachedMovies.length) {
                displaySearchResults.build(cachedMovies.slice(numOfMoviesToDisplay * (page - 1), numOfMoviesToDisplay * page));
            };
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
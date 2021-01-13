import displaySearchResults from './displaySearchResults.js';
import displaySearchSuggestions from './displaySearchSuggestions.js';

const apiCall = (function() {
    /** 
     * function to handle too-many-results error and no-movies-found error; those responses would return with a string value 'False' for Response;
     * @param {Object} reponse The response from api call
     * @param {boolean} isSubmitted True if form is submitted and false if not  
     */
    function handleResponse(response, isSubmitted) {
        if (response.Response === "True") {
            isSubmitted 
            ?   displaySearchResults.build(response.Search)
            :   displaySearchSuggestions.build(response.Search, omdb);
        } else {
            // console.log(response);
        };
    };

    /**
     * function to parse the movie year, if any, and the movie title
     * @param {string} search The value of the input field
     */
    function parseMovieYear(search) {
        const movieYearRegex = /\(([0-9]{4})\)/;
        const movieYear = movieYearRegex.exec(search);
        search = search.replace(/\([0-9][0-9][0-9][0-9]\)/, '').trim();
        return [search, movieYear];
    };

    /**
     * async function to make api calls
     * @param {string} search The value of the input field
     * @param {boolean} isSubmitted True if form is submitted and false if not  
     */
    async function omdb(search, isSubmitted) {
        let url = 'http://www.omdbapi.com/';
        const [movieTitle, movieYear] = parseMovieYear(search);
        if (movieYear) {
            url = url + `?s=${movieTitle}&y=${movieYear[1]}&type=movie&apikey=b1bd9324`;
        } else {
            url = url + `?s=${movieTitle}&type=movie&apikey=b1bd9324`
        };
        try {
            const promise = await fetch(url);
            const response = await promise.json();
            handleResponse(response, isSubmitted);
        } catch (err) {
            console.log(err);
        };
    };

    return {
        omdb: omdb
    };
}());

export default apiCall;
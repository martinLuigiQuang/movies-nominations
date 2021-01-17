/**
 * Truncate the long movie titles and place ellipses at their right place
 * @param {string} title The full title of the a movie
 * @param {integer} maxLength The maximum number of characters for the title
 */
export default function handleLongTitles(title, maxLength) {
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
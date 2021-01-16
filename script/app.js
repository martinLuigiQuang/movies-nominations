import getUsersInput from './getUsersInput.js';
import handleNominations from './handleNominations.js';

const app = {
    getUsersInput: getUsersInput.init,
    getNominations: handleNominations.buildNominationsDisplay,
    init: function() {
        this.getUsersInput();
        this.getNominations();
    }
};

if (document.readyState === 'complete') {
    app.init();
} else {
    document.addEventListener('DOMContentLoaded', () => app.init());
}
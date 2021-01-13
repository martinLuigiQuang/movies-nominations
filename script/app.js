import getUsersInput from './getUsersInput.js';

const app = {
    getUsersInput: getUsersInput.init,
    init: function() {
        this.getUsersInput();
    }
};

if (document.readyState === 'complete') {
    app.init();
} else {
    document.addEventListener('DOMContentLoaded', () => app.init());
}
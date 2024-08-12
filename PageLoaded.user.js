// Close the window if the URL matches certain patterns
if (/.*dutchycorp\.space\/defi.*|anchoreth/i.test(window.location.href)) {
    window.close();
}

// Define the added title
const addedTitle = ' (Page Loaded)';

// Define the title function
const title = () => {
    // Check if the URL matches certain patterns
    if (/faucetpay\.io/ig.test(window.location.href)) {
        remove();
        document.title = document.title.replace(`${addedTitle}.*}`,'')+addedTitle;
    } else if (/autofaucet\.dutchycorp/ig.test(window.location.href)) {
        remove();
        // Define the added title
        document.title = document.title.replace(`${addedTitle}.*}`,'')+addedTitle;
    } else {
        cancelTitleUpdate();
    }
};

// Define the remove function
const remove = () => {
    // Listen for the 'P' key press
    window.addEventListener('keydown', function check(event) {
        if (event.key.toLowerCase() === 'p') {
            cancelTitleUpdate();
            document.title = document.title.replace(addedTitle, '');
            this.removeEventListener('keydown', check, false);
        }
    }, { once: true });
};

// Define the cancelTitleUpdate function
let titleUpdateInterval;
const cancelTitleUpdate = () => {
    clearInterval(titleUpdateInterval);
};

// Wait for the page to fully load
window.onload = () => {
    // Check if the text has already been added to the title
    if (!(new RegExp(addedTitle, 'i').test(document.title))) {
        // Add text to page title
        title();
    }
    if (/roll/ig.test(window.location.href)) {
        titleUpdateInterval = setInterval(title, 1000)
    }
};

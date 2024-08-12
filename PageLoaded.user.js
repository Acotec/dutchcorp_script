// Close the window if the URL matches certain patterns
if (/.*dutchycorp\.space\/defi.*|anchoreth/i.test(window.location.href)) {
    window.close();
}

const addedTitle = '(Page Loaded)';

const updateTitle = () => {
    if (/faucetpay\.io|autofaucet\.dutchycorp/ig.test(window.location.href)) {
        showFloatingText();
        window.addEventListener('keydown', hideFloatingTextOnPKeyPress, { once: true });
    }
};

const hideFloatingTextOnPKeyPress = (event) => {
    if (event.key.toLowerCase() === 'p') {
        hideFloatingText();
    }
};

let floatingText;

const showFloatingText = () => {
    floatingText = document.createElement('div');
    floatingText.textContent = addedTitle;
    floatingText.style.position = 'fixed';
    floatingText.style.top = '10px';
    floatingText.style.right = '10px';
    floatingText.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    floatingText.style.color = 'white';
    floatingText.style.padding = '5px 10px';
    floatingText.style.borderRadius = '5px';
    floatingText.style.zIndex = '9999';
    document.body.appendChild(floatingText);
};

const hideFloatingText = () => {
    if (floatingText) {
        floatingText.remove();
        floatingText = null;
    }
};

window.onload = updateTitle;

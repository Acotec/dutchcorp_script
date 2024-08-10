(function() {
    'use strict';
    // The script will run multiple instances
    // Instance A: will execute at nopecha.com
    // Instance B: will execute at each recaptcha iframe (checkbox iframe)

    // Workflow:
    // 1- Instance A will add the 'shortcut' listener (CRL+i)
    // 2- Instances B will create value change listeners monitoring a storage var named 'shortcut_triggered'

    // 3- When Instance A detects the CTRL+I, it will save the timestamp in 'shortcut_triggered'.
    // 4- Instances B will detect that the value of 'shortcut_triggered' changed, triggering the click on the checkbox

    // Instance A code:
    var key ='c-i'
    function qSelector(selector) {
        return document.querySelector(selector);
    }
    const RECAPTCHA_STATUS = "#recaptcha-accessible-status";
    var recaptchaInitialStatus = qSelector(RECAPTCHA_STATUS) ? qSelector(RECAPTCHA_STATUS).innerText : ""
    function updateReCaptchaLabel(){
        function checkboxLabel(text) {
            let label = qSelector("#recaptcha-anchor-label")
            if (label) {
                label.textContent=text
            }
        }
        if (qSelector(RECAPTCHA_STATUS) && (qSelector(RECAPTCHA_STATUS).innerText != recaptchaInitialStatus)) {
            //console.log("SOLVED");
            checkboxLabel("SOLVED")
        }else{
            //console.log(recaptchaInitialStatus);
        }
    }

    setInterval(updateReCaptchaLabel,0);
    if (!/recaptcha\/api2\/anchor/gi.test(location.href)) {
        // Start listening for keypress events
        VM.shortcut.register(key, () => {GM_setValue('shortcut_triggered', Date.now());/* c-i pressed */});
    }

    // Instance B code:
    if (/recaptcha\/api2\/anchor/gi.test(location.href)) {
        VM.shortcut.register(key, () => {GM_setValue('shortcut_triggered', Date.now());/* c-i pressed */});
        function onShortcutDetected(name, old_value, new_value, remote) {
            console.log(GM_getValue('shortcut_triggered'))
            document.querySelector(".rc-anchor").click()
        }
        // Start listening for 'messages'/shortcuts from Instance A/mainframe
        GM_addValueChangeListener('shortcut_triggered', onShortcutDetected);
    }
})();

(function () {
    const CLOSEWIN =true;
    const RELOADWIN =true;
    const DEBUG =false;
    const startTime=3;
    const startTimeEnd=5
    if (window.history.replaceState) {
        window.history.replaceState(null, null, decodeURIComponent(window.location.href));
    } //to prevent resubmit on refresh and back button

    //to prevent multiple page with thesame url
    // window.addEventListener('storage', () => {
    //     window.close();
    // }, false)

    // localStorage.setItem('Sentinel',Math.random())

    //---------------------------------------------------------//
    var messageError,
        linkCantBypass,
        invalid,
        //var location = window.location
        listOfAcceptDomains = GM_getValue("domains", ""),
        retry_bypass_if_fail = 3,
        retry_fail_connect = 10,
        green_icon = GM_getValue("green_icon", ""),
        green_icon1 = GM_getValue("green_icon1", ""),
        grey_icon = GM_getValue("grey_icon", ""),
        red_icon = GM_getValue("red_icon", ""),
        gist_id = "493dc66ecebd58a75b730a77ef676632";


    var dutchy = `autofaucet.dutchycorp.space|free-bonk.com|earnbitmoon.club|banfaucet.com|cashbux.work|criptolia.site|tronpayz.com|bitsbon.com|viefaucet.com|cryptoclaimhub.com|bitbitz.cc`

    // Configuration for different shortlink sites
     var websiteConfigs = {
         'tronpayz.com/links': {
             linkSelector: '.col-lg-3 .btn-primary',
             closeSelector: '.card-body',
             titleSelector: '.card-title',
             claimBadgeSelector: '.badge-soft-info',
             claimButtonSelector: '.btn-primary'
         },
         "faucet-bit.com": {
             "linkSelector": "a[href^='https://faucet-bit.com/links/go/']",
             "closeSelector": ".card.card-body",
             "titleSelector": ".card-title",
             "claimBadgeSelector": ".badge.badge-info",
             "claimButtonSelector": ".btn.btn-primary",
         },
         'criptolia.site/links': {
             linkSelector: '.col-lg-3 .btn-primary',
             closeSelector: '.card-body',
             titleSelector: '.card-title',
             claimBadgeSelector: '.badge-soft-info',
             claimButtonSelector: '.btn-primary'
         },

         "litefaucet.in/links":{
             linkSelector: '.col-lg-3 .btn-primary',
             closeSelector: '.card-body',
             titleSelector: '.card-title',
             claimBadgeSelector: '.badge',
             claimButtonSelector: '.btn-primary'
         },
         "routinefaucet.net/shortlinks": {
             linkSelector: 'button[onclick^="goShortlink"]',
             closeSelector: 'tr',
             titleSelector: 'td a',
             claimBadgeSelector: '[class*="align-middle"]:nth-of-type(3)',
             claimButtonSelector: 'button[onclick^="goShortlink"]',
             runOnce:true
         },
         "earnbitmoon.club/shortlinks": {
             linkSelector: 'button[onclick^="goShortlink"]',
             closeSelector: 'tr',
             titleSelector: '.align-middle',
             claimBadgeSelector: '[class*="align-middle"]:nth-of-type(3)',
             claimButtonSelector: 'button[onclick^="goShortlink"]',
             runOnce:true
         },
         'coinfaucet.store/links': {
             linkSelector: '.col-lg-3 .btn-primary', // Selects the claim button/link
             closeSelector: '.card-body', // Selects the container
             titleSelector: '.card-title', // Selects the title
             claimBadgeSelector: '.badge-info', // Selects the badge showing "5/5"
             claimButtonSelector: '.btn-primary' // Selects the "Claim" button
         },
         "fundsreward.com": {
             "linkSelector": "a[href^='https://fundsreward.com/links/pre_verify/']",
             "closeSelector": ".card.card-body",
             "titleSelector": ".card-title",
             "claimBadgeSelector": ".badge.badge-info",
             "claimButtonSelector": ".btn.btn-primary"
         },
         'claimcoin.in/links': {
             linkSelector: "a[href^='https://claimcoin.in/links/go/']",
             closeSelector: ".card.card-body",
             titleSelector: ".card-title",
             claimBadgeSelector: ".badge.badge-info",
             claimButtonSelector: ".btn.btn-success",
         },
         "viefaucet.com": {
             linkSelector: ".el-card__body ",
             closeSelector: ".el-card__body",
             titleSelector: ".link-name",
             claimBadgeSelector: ".el-tag__content",
             claimButtonSelector: '.el-button--success'
         },
         'cryptoclaimhub.com/shortlinks': {
             linkSelector: ".card-body a.btn-primary",
             closeSelector: ".card-body",
             titleSelector: ".mb-2 strong",
             claimBadgeSelector: ".fs-5",
             claimButtonSelector: ".btn-primary"
         },
         "bitbitz.cc/shortlinks": {
             linkSelector: ".bitcard-body",
             closeSelector: ".mt-4",
             titleSelector: ".fw-bold",
             claimBadgeSelector: ".float-end",
             claimButtonSelector: '.shortlink-card',
             split:' '
         },
         'cashbux.work/links': {
             linkSelector: '.card-body a.btn-primary',
             closeSelector: '.card-body',
             titleSelector: '.card-title',
             claimBadgeSelector: '.badge-info',
             claimButtonSelector: '.btn-primary'
         },
         'banfaucet.com/links': {
             linkSelector: '.card-lg .btn-one',
             closeSelector: '.card-lg',
             titleSelector: '.title',
             claimBadgeSelector: '.pill.yellow',
             claimButtonSelector: '.btn-one'
         },
         "autofaucet.dutchycorp.space": {
             linkSelector: '.gradient-btn.btn.btn-small',
             closeSelector: '.card.hoverable',
             titleSelector: '.hoverable p',
             claimBadgeSelector: '.fa-eye + b',
             claimButtonSelector: 'a[data-tooltip="Visit Shortlink"]'
         }
     };
    // Function to update dutchy list with new domains
    function updateDutchyList(dutchy, websiteConfigs) {
        // Convert dutchy string to array
        let dutchyArray = dutchy.split('|');

        // Get domains from websiteConfigs keys and clean them
        const shortlinkDomains = Object.keys(websiteConfigs).map(key => {
            // Remove '/links' or '/shortlinks' and any escape characters
            return key//.replace(/\/links$|\/shortlinks$|\\/g, '');
        });

        // Add new domains that aren't in dutchy
        shortlinkDomains.forEach(domain => {
            if (!dutchyArray.includes(domain.replace(/\/links$|\/shortlinks$|\\/g, ''))) {
                dutchyArray.push(domain);
            }
        });

        // Convert back to pipe-separated string
        return dutchyArray.join('|');
    }

    // Update the dutchy list
    dutchy= updateDutchyList(dutchy, websiteConfigs);
    console.log('Updated dutchy list:',dutchy);

    if (!new RegExp(dutchy,'gi').test(window.location.href)
       ){
        window.addEventListener('storage', () => {
            // Close this tab if it doesn't match our domain
            if (!new RegExp(dutchy,'gi').test(window.location.href)
               ) {
                //window.close();
            }
        }, false);

        // Trigger storage event every second

        setTimeout(() => {
            localStorage.setItem('closeOthers', Date.now());
        }, Math.floor(Math.random() * 5000) + 1000);
        //return
    }

    String.prototype.insert = function (index, string) {
        if (index > 0) {
            return this.substring(0, index) + string + this.substr(index);
        }

        return string + this;
    };

    function getIcons() {
        fetch(
            "https://gist.githubusercontent.com/Harfho/63966e7f7145a5607e710a4cdcb31906/raw/ALBypass_icons.json"
        )
            .then((response) => {
            if (response.ok) {
                return response.json();
            }
            return Promise.reject(response);
        })
            .then((result) => {
            DEBUG && console.log(result);
            let green_icon = result.green_icon;
            let green_icon1 = result.green_icon1;
            let grey_icon = result.grey_icon;
            let red_icon = result.red_icon;
            GM_setValue("green_icon", green_icon);
            GM_setValue("green_icon1", green_icon1);
            GM_setValue("grey_icon", grey_icon);
            GM_setValue("red_icon", red_icon);
        })
            .catch((error) => {
            //alert(error)
            //DEBUG && console.error(error);
            DEBUG && console.log("can't get Icons because of ", error);
            window.location.reload(true);
        });
    }
    (0 != green_icon && 0 != green_icon1 && 0 != grey_icon && 0 != red_icon) ||
        getIcons();

    function favicon(icon_base64) {
        GM_addElement(document.getElementsByTagName("head")[0], "link", {
            href: icon_base64,
            rel: "icon",
            type: "image/png",
        });
    }

    function waitForKeyElements(t, o, e, i, n) {
        void 0 === e && (e = !0),
            void 0 === i && (i = 300),
            void 0 === n && (n = -1);
        var r = "function" == typeof t ? t() : document.querySelectorAll(t),
            u = r && 0 < r.length;
        u &&
            r.forEach(function (t) {
            var e = "data-userscript-alreadyFound";
            t.getAttribute(e) ||
                !1 ||
                (o(t) ? (u = !1) : t.setAttribute(e, !0));
        }),
            0 === n ||
            (u && e) ||
            (--n,
             setTimeout(function () {
            waitForKeyElements(t, o, e, i, n);
        }, i));
    }

    function OnPhone() {
        0 == GM_getValue("OnPhone", !1) ?
            GM_setValue("OnPhone", !0) :
        GM_setValue("OnPhone", !1);
        window.location = decodeURIComponent(window.location.href);
    }

    function AllowToSendEmail() {
        0 == GM_getValue("AllowToSendEmail", !1) ?
            GM_setValue("AllowToSendEmail", !0) :
        GM_setValue("AllowToSendEmail", !1);
        window.location =decodeURIComponent(window.location.href);
    }

    function Bypass() {
        0 == GM_getValue("Bypass", !1) ?
            GM_setValue("Bypass", !0) :
        GM_setValue("Bypass", !1);
        GM_setValue("already_sent", !1);
        window.location =decodeURIComponent(window.location.href);
    }

    function getSimilarWord(inputWord, knownWords, similarityThreshold = 0.3) {
        // Check that the input is valid
        if (typeof inputWord !== "string" || !Array.isArray(knownWords)) {
            throw new Error("Invalid input");
        }
        //console.log(knownWords)

        // Convert the input word to lowercase and get its bigrams
        const inputWordBigrams = getBigrams(inputWord.toLowerCase());

        // Loop through the known words and calculate their similarity scores
        let maxSimilarity = 0;
        let mostSimilarWord = inputWord;
        for (const knownWord of knownWords) {
            // Get the bigrams of the known word and calculate the similarity score
            //console.log(knownWord)

            const knownWordBigrams = getBigrams(knownWord.toLowerCase());
            const similarity = calculateSimilarity(
                inputWordBigrams,
                knownWordBigrams
            );

            // Update the most similar word if the similarity score is higher than the threshold
            if (
                similarity > maxSimilarity &&
                similarity >= similarityThreshold
            ) {
                maxSimilarity = similarity;
                mostSimilarWord = knownWord;
            }
        }
        // Returns an array of bigrams from the given string
        function getBigrams(word) {
            // Split the string into an array of characters, then use map and slice to create bigrams
            return [...word.toLowerCase()]
                .map((_, i, arr) => arr.slice(i, i + 2).join(""))
                .slice(0, -1);
        }

        // Calculates the bigram similarity score between two arrays of bigrams
        function calculateSimilarity(bigrams1, bigrams2) {
            // Create a set from the first array for faster lookup
            const set1 = new Set(bigrams1);

            // Filter the second array for bigrams that are also in the first array, then calculate the similarity score
            const intersection = bigrams2.filter((x) => set1.has(x));
            return (
                intersection.length / Math.max(bigrams1.length, bigrams2.length)
            );
        }
        // Return the most similar word
        //console.log(mostSimilarWord)
        return mostSimilarWord;
    }

    async function updateAcceptDomain() {
        try {
            // Fetch the accept domains from the API
            const response = await fetch("https://api.yuumari.com/alpha-bypass/domains/accept");
            // Check if the network response is okay
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            // Parse the response as JSON
            const result = await response.json();
            // Log the result if in debug mode
            DEBUG && console.log(result);
            // Combine all the domain arrays into a single array
            const elements = Object.values(result).flat();
            // Log the elements if in debug mode
            DEBUG && console.log(elements);
            // Save the domains as a string in GM storage
            GM_setValue("domains", JSON.stringify(elements));
            // Close the window after 2 seconds
            CLOSEWIN && window.close();
            return
        }
        catch (error) {
            // Log the error if in debug mode
            DEBUG && console.log("can't updateAcceptDomain because of ", error);
            console.log("can't updateAcceptDomain because of ", error);
            // Reload the page if there was an error
            await updateAcceptDomain();
            return
            //RELOADWIN&&window.location.reload(true);
        }
    }
    async function sendEmail(toname, temp_id, msg) {
        if(GM_getValue("email_sent")&&
           (window.name||GM_getValue('shortner_name').toLowerCase()==GM_getValue('shortner_name').toLowerCase())
          ){
            if (invalid) {
                updateAcceptDomain();
            } else {
                DEBUG&&console.log('ALREADY SENT EMAIL REGARDING THE SHORTLINK')
                CLOSEWIN && window.close()
            }
            return
        }else{
            const username = "Harfho";
            const from_name = "Harfho";
            const to_name = toname;
            const message = msg;
            const accessToken = atob(
                "NDFjYWY3YmU4MWMwMmRiODIwOWQwNGE2Njg4YWVhZWE="
            );
            const myHeaders = new Headers({
                "Content-Type": "application/json",
            });
            const body = JSON.stringify({
                user_id: "user_oF6Z1O2ypLkxsb5eCKwxN",
                service_id: "gmail",
                accessToken,
                template_id: temp_id,
                template_params: {
                    username,
                    from_name,
                    to_name,
                    message,
                },
            });
            const requestOptions = {
                method: "POST",
                headers: myHeaders,
                body,
                redirect: "follow",
            };
            try {
                const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", requestOptions);
                const result = await response.text();
                GM_setValue("email_sent",true)
                DEBUG && console.log(result);
                GM_notification({
                    title: "!Bypass---- " + linkCantBypass,
                    text: msg,
                    timeout: 10000,
                    ondone: () => {},
                });
                if (invalid) {
                    updateAcceptDomain();
                } else {
                    CLOSEWIN && window.close()
                }
            }
            catch (error) {
                DEBUG && console.log("error", error);
            }
        }
    }
    const crypt = (salt, text) => {
        const textToChars = (text) => text.split("").map((c) => c.charCodeAt(0));
        const byteHex = (n) => ("0" + Number(n).toString(16)).substr(-2);
        const applySaltToChar = (code) => textToChars(salt).reduce((a, b) => a ^ b, code);

        return text
            .split("")
            .map(textToChars)
            .map(applySaltToChar)
            .map(byteHex)
            .join("");
    };
    const decrypt = (salt, encoded) => {
        const textToChars = (text) => text.split("").map((c) => c.charCodeAt(0));
        const applySaltToChar = (code) => textToChars(salt).reduce((a, b) => a ^ b, code);
        return encoded
            .match(/.{1,2}/g)
            .map((hex) => parseInt(hex, 16))
            .map(applySaltToChar)
            .map((charCode) => String.fromCharCode(charCode))
            .join("");
    };
    async function updateDontOpen(linkName=window.name, check = [], message = messageError) {
        // Constants for gist URL and access token
        const GIST_URL = `https://gist.github.com/Harfho/${gist_id}/raw/_DontOpen.txt?timestamp=${+new Date()}`;
        const TOKEN = decrypt('g','000f1738575309000a36282632043f3d3155165f551d2e08240c1d092e330501523f550406335606')

        // Check if linkName matches a certain pattern
        if (/autofaucet.dutchycorp.space/gi.test(linkName)) {
            DEBUG && console.log("can't add link to dontopen");
            CLOSEWIN && window.close();
            return;
        }

        // Make GET request to Gist URL with GM_xmlhttpRequest
        GM_xmlhttpRequest({
            method: "GET",
            url: GIST_URL,
            revalidate: false,
            nocache: true,
            onload: handleResponse, // Pass handling function as callback
        });

        // Function to handle response from Gist GET request
        function handleResponse(response) {
            // Parse response text and format _DontOpen list
            const dontOpenList = response.responseText
            .replace(/'|"|\[|\]/gi, "")
            .split(",")
            .filter((e) => e)
            .map((item) => item.replace(/'/gi, '"').toLowerCase());

            DEBUG && console.log(dontOpenList, linkName);
            GM_setValue("_DontOpen", response.responseText);
            // If linkName is not already in _DontOpen list, update it
            if (!(dontOpenList.indexOf(linkName.toLowerCase())>=0)&& linkName){
                const updatedDontOpenList = [...dontOpenList, linkName.toLowerCase()]; // Use spread syntax to create new array with added linkName
                const raw = JSON.stringify({
                    files: {
                        "_DontOpen.txt": {
                            content: JSON.stringify(updatedDontOpenList), // Update content of _DontOpen.txt file in Gist
                        },
                    },
                });

                // Set headers for PATCH request to Gist API
                const headers = new Headers({
                    accept: "application/vnd.github.v3+json",
                    Authorization: `Bearer ${TOKEN}`,
                    "Content-Type": "application/json",
                });

                // Set options for PATCH request to Gist API
                const requestOptions = {
                    method: "PATCH",
                    headers,
                    body: raw,
                    redirect: "follow",
                };

                // Make PATCH request to Gist API to update _DontOpen list
                fetch(`https://api.github.com/gists/${gist_id}`, requestOptions)
                    .then((response) => response.text())
                    .then((result) => {
                    DEBUG && console.log("Done", updatedDontOpenList);

                    // Set variables for email message
                    const toname = "Yuumari.com";
                    const temp_id = "shortlinks_vicissitude";
                    const pattern = linkCantBypass&&linkCantBypass.replace(
                        /http.*:\/\/|\./gi,
                        " "
                    );
                    const yuumari_pattern = pattern.insert(
                        pattern.indexOf("/"),
                        " "
                    );
                    const msg = `
                    SNAME- ${linkName}
                    Cant Bypass URL ${linkCantBypass}
                    or ${decodeURIComponent(window.location.href)}
                    Because api return with
                    --------------------------------------
                    Error= ${messageError}\n
                    message = ${message}
                    --------------------------------------
                    Yummari pattern="${yuumari_pattern}\n
                    Possible shortlink that cause it can be =${check} OR ${window.name}\n
                    DontOpenListIsNow=${updatedDontOpenList}`;

                    DEBUG && console.log(msg)
                    // Send email with error message
                    sendEmail(toname, temp_id, msg);
                })
                    .catch((error) => {
                    DEBUG && console.log("error", error);
                    CLOSEWIN && window.close();
                });
            }
            else {
                // If linkName is already in _DontOpen list, notify user and update accept domain list
                const msg = `SNAME-${linkName} is Already added to _DontOpen\nReason-${message}\nURL-${linkCantBypass}`;
                GM_notification({
                    title: `Can't Bypass-- ${linkCantBypass}`,
                    text: msg,
                    timeout: 10000,
                    ondone: () => {
                        null
                    },
                });
                DEBUG && console.log("Already added to _DontOpen");
                DEBUG && console.log("Updating Accepted domain shortlinks Lists");
                updateAcceptDomain();
            }
        }
    }

    async function getDomainOrPathNameAndUpdate(
    link = window.name || sessionStorage.getItem("shortner_name"),
     toupdate = "unsupported url",
     message = messageError
    ) {
        const GIST_URL = `https://gist.github.com/Harfho/${gist_id}/raw/_DontOpen.txt?timestamp=${Date.now()}`;

        try {
            const response = await fetchWithRetry(GIST_URL);
            await processShortlinksName(response);
        } catch (error) {
            console.error("Error fetching data:", error);
            // if (RELOADWIN) window.location.reload(true);
        }

        async function fetchWithRetry(url, retries = 3) {
            for (let i = 0; i < retries; i++) {
                try {
                    return await new Promise((resolve, reject) => {
                        GM_xmlhttpRequest({
                            method: "GET",
                            url,
                            revalidate: false,
                            nocache: true,
                            onload: resolve,
                            onerror: reject,
                            onabort: reject
                        });
                    });
                } catch (error) {
                    if (i === retries - 1) throw error;
                }
            }
        }

        function processShortlinksName(response) {
            const shortlinksName = parseShortlinksName(response.responseText);
            const url = decodeURIComponent(window.location.href).toLowerCase().replace(/.*bypass=|\/==.*/, '');
            const pageTitle = document.title.toLowerCase().replace(/.+(\.|\|)|\(page.*|\s/gi, '').trim();
            const urlSplice = url.split("/").splice(2, 2);
            urlSplice.push(url.split('.')[1]);

            const exLink = buildExLink(url, pageTitle, urlSplice);
            DEBUG && console.log(exLink);

            const found = findMatchingShortlinks(exLink, shortlinksName);
            DEBUG && console.log("found", found);

            const uniqueFound = [...new Set(found)];
            DEBUG && console.log("uniqueFound", uniqueFound);

            const pathOrDomain = findPathOrDomain(uniqueFound, shortlinksName);

            updateBasedOnResult(pathOrDomain, shortlinksName, toupdate, message, link);
        }

        function parseShortlinksName(responseText) {
            return responseText
                .replace(/'|"|\[|\]|\s/gi, "")
                .split(",")
                .filter(Boolean)
                .map(s => s.toLowerCase())
                .sort();
        }

        function buildExLink(url, pageTitle, urlSplice) {
            const baseExLink = [
                window.name,
                sessionStorage.getItem("shortner_name"),
                pageTitle,
                urlSplice[0],
                urlSplice[1],
                urlSplice[2],
                new URL(url).host
            ];

            if (document.referrer && !/.*dutchycorp.*/gi.test(document.referrer)) {
                baseExLink.push(new URL(document.referrer).host);
            }

            return baseExLink;
        }

        function findMatchingShortlinks(exLink, shortlinksName) {
            return exLink.filter(e => {
                try {
                    const sr = getSimilarWord(e.toLowerCase(), shortlinksName);
                    DEBUG && console.log(`${e} found to be ${sr}`);
                    return shortlinksName.includes(sr);
                } catch (error) {
                    return false;
                }
            });
        }

        function findPathOrDomain(uniqueFound, shortlinksName) {
            const similarities = uniqueFound.map(item =>
                                                 getSimilarWord(item.replace(/\./gi, "").toLowerCase(), shortlinksName, Math.random() < 0.7 ? 0.8 : 0.9)
                                                );
            console.log(similarities)
            return similarities.length > 1 ? similarities[0] : null;
        }

        function updateBasedOnResult(pathOrDomain, shortlinksName, toupdate, message, link) {
            if (!pathOrDomain) {
                pathOrDomain = getSimilarWord(link.toLowerCase(), shortlinksName, Math.random() < 0.7 ? 0.8 : 0.9);

            }

            if (/(dontopen|down)/i.test(toupdate)) {
                messageError += `(${toupdate})\n`;
            } else if (/unsupported url/i.test(toupdate) && shortlinksName.includes(pathOrDomain)) {
                messageError += `(${toupdate}) shortlink URL was changed;`;
                linkCantBypass = link;
            }

            //GM_setValue('_DontOpen',JSON.stringify(GM_getValue('_DontOpen')))
            console.log(pathOrDomain)
            var new_li =JSON.parse(GM_getValue('_DontOpen'))
            //console.log(new_li)
            
            updateDontOpen(pathOrDomain, [], message);
            return
            
            if(pathOrDomain && !new_li.includes(pathOrDomain)){
                new_li.push(pathOrDomain)
                GM_setValue('_DontOpen',JSON.stringify(new_li))
                console.log(new_li)
                CLOSEWIN && window.close()
                return
            }


        }
    }

    function updateAccesskey() {
        GM_xmlhttpRequest({
            method: "GET",
            url: "https://gist.githubusercontent.com/Harfho/d4805d8a56793fa59d47e464c6eec243/raw/keyEncode.txt",
            revalidate: false,
            nocache: true,
            onload: handleResponse,
            onerror: handleError,
        });

        function handleResponse(response) {
            const accesskey = response.responseText;
            GM_setValue("accesskey", JSON.stringify(accesskey));
            const accesskeyDecoded = atob(
                GM_getValue("accesskey")
                .match(/\w*/gi)
                .filter((e) => e)
                .join("")
            );
            DEBUG && console.log(accesskeyDecoded);
        }

        function handleError(error) {
            DEBUG && console.log("Error updating access key:", error);
        }
    }
    if (GM_getValue("accesskey", false) == false) {
        updateAccesskey();
    }

    function title(link = decodeURIComponent(window.location.href)) {
        // Get shortlink names from storage
        const shortnerName = GM_getValue("shortner_name","null");
        const previousShortnerName = GM_getValue("previous_shortner_name",shortnerName);
        const sessionShortnerName =
              sessionStorage.getItem("shortner_name") || (window.name||shortnerName);

        // Check if page is reloaded

        if (
            window.performance &&
            performance.navigation.type === performance.navigation.TYPE_RELOAD
        ) {
            DEBUG && console.info("This page is reloaded");
            DEBUG && console.log(sessionShortnerName);
        } else {
            DEBUG && console.info("This page is not reloaded");
            sessionStorage.setItem("shortner_name", sessionShortnerName);
        }

        // Get closest shortlink name to the current URL host
        const host = new URL(link).host;
        const shortlinks = [
            window.name,
            shortnerName,
            sessionShortnerName,
            previousShortnerName,
        ].map((s) => {
            console.log('map',s)
            if(!/zigi_tag_id/ig.test(s)){
                return s.toLowerCase()
            }else{
                return ''}
        });
        console.log(shortlinks)
        let closestShortlink = getSimilarWord(window.name||shortnerName, shortlinks, 0.3);
        console.log(closestShortlink)
        // Set document title to the closest shortlink name
        const useShortlink =closestShortlink
        //       host === closestShortlink ?
        //       sessionShortnerName || shortnerName :
        // closestShortlink;
        sessionStorage.setItem("shortner_name", useShortlink);
        document.title = useShortlink;
        DEBUG && console.log("title use", useShortlink);
        return useShortlink;
    }


    //bypass the link
    async function bypass(link) { //a function that takes a link as a parameter and returns a promise
        DEBUG && console.log('BYPASSING RUNNING')
        link = link.replace(/.+:/, "https:"); //replaces the protocol of the provided link with 'https:'
        favicon(green_icon);
        let urlhost = new URL(link).host;
        GM_setValue("previousHost", urlhost);
        DEBUG && console.log(link,urlhost)
        title(link);
        const key = atob(
            GM_getValue("accesskey")
            .match(/\w*/gi)
            .filter((e) => "" != e)[0]
        );
        const baseUrl = "https://api.yuumari.com/alpha-bypass/";
        const u = key;
        const l = link.replace(/\/\/\/.*/ig,'');
        DEBUG && console.log(u,l)
        try {
            const response = await fetch(baseUrl, {
                method: "POST",
                body: new URLSearchParams({
                    u,
                    l,
                }),
            });

            if (!response.ok) {
                DEBUG && console.log("Network response was not OK - HTTP status " + response.status);
                throw new Error("Network response was not OK - HTTP status " + response.status);
                return
            }

            const data = await response.json();
            let message = data.message;

            if (data.result&&!message) {
                sessionStorage.removeItem('tryagain');
                const originalurl = new URL(data.result);
                DEBUG && console.log(originalurl);
                function randomInteger(min, max) {
                    return Math.floor(Math.random() * (max - min + 1)) + min;}
                function randomFloat(min, max) {
                    // Generate a random float between min and max
                    return Math.random() * (max - min) + min;
                }

                const wait = t => new Promise((resolve, reject) => setTimeout(resolve, t))
                const redirect = async () => {
                    // Create and style the popup
                    const popup = document.createElement('div');
                    popup.style.cssText = `
        position: fixed;
        top: 20px;
        left: 20px;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 15px 25px;
        border-radius: 5px;
        font-family: Arial, sans-serif;
        z-index: 99999999999;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    `;
                    document.body.appendChild(popup);


                    const timeInMinutes = randomFloat(startTime,startTimeEnd);

                    const timeInSeconds = Math.floor(timeInMinutes * 60);
                    let remainingSeconds = timeInSeconds;
                    document.title = `${document.title} ${timeInMinutes.toFixed(1)}`

                    // Update popup every second
                    const countdownInterval = setInterval(() => {
                        remainingSeconds--;
                        // Convert remaining seconds to minutes and seconds
                        const minutes = Math.floor(remainingSeconds / 60);
                        const seconds = remainingSeconds % 60;
                        // Format the display
                        popup.textContent = `Redirecting in ${minutes}m${seconds}s/${timeInMinutes.toFixed(1)}m`;

                        if (remainingSeconds <= 0) {
                            clearInterval(countdownInterval);
                            popup.remove();
                        }
                    }, 1000);

                    await wait(timeInSeconds * 1000);
                    window.location.href = originalurl;
                }

                redirect();
                //console.log(originalurl)
                //alert(originalurl)
                return
            } else {
                DEBUG && console.log(`Issue of ${message} happen when bypassing`)
                let tryagain = sessionStorage.getItem('tryagain');
                let check = "pattern.+changed|unsupported domain|invalid domain";
                if (new RegExp(check, 'ig').test(message)) {
                    messageError = message;
                    linkCantBypass = link;
                    getDomainOrPathNameAndUpdate(link, 'dontopen', message);
                } else if (/ticket.*expired|Not.+permitted./ig.test(message)) {
                    messageError = message
                    if (GM_getValue('AllowToSendEmail', false)) {
                        let toname = "Harfho";
                        let temp_id = "api_issue";
                        let msg = `${message}==Get New API key,previous api key(${key}) as expired`;
                        updateAccesskey();
                        sendEmail(toname, temp_id, msg);
                    } else {
                        updateAccesskey();
                        setTimeout(() => {
                            CLOSEWIN && window.close();
                        }, 5000);
                    }
                } else if (/ticket.*locked/ig.test(message)) {
                    let after24h = GM_getValue('after24h', false) || new Date(new Date().getTime() + (24 * 60 * 60 * 1000)).toLocaleString();
                    GM_setValue('after24h', after24h);
                    GM_setValue('Bypass', false);

                    if (GM_getValue('AllowToSendEmail', false)) {
                        let toname = "Harfho";
                        let temp_id = "api_issue";
                        let msg = message + `You have use more than 2 IPs to access Yuumari.com,Wait for 24Hour ${after24h } for API key to continue working`;

                        if (GM_getValue('already_sent', false) == false) {
                            GM_setValue('already_sent', true);
                            sendEmail(toname, temp_id, msg);

                        } else {
                            let msgs = message + `You have use more than 2 IPs to access Yuumari.com,Wait for 24Hour ${after24h } for API key to continue working`;
                            DEBUG && console.log(msgs);
                            GM_notification({
                                title: '!Bypass-- ' + linkCantBypass,
                                text: msgs,
                                timeout: 5000,
                                ondone: () => {
                                    CLOSEWIN && window.close();
                                },
                            });
                        }
                    }
                    else {
                        GM_setValue('already_sent', false);
                        let msgs = message + `You have use more than 2 IPs to access Yuumari.com,Wait for 24Hour ${after24h } for API key to continue working`;
                        DEBUG && console.log(msgs);
                        GM_notification({
                            title: '!Bypass-- ' + linkCantBypass,
                            text: msgs,
                            timeout: 5000,
                            ondone: () => {
                                CLOSEWIN && window.close();
                            },
                        });
                        CLOSEWIN && window.close();
                    }
                } else if (/exceeded/ig.test(message)) {
                    let msg = message + "The limit on the number of requests has exceeded 2 queries per 1sec.";
                    DEBUG && console.log(msg);
                    await bypass(link)
                    return
                    setTimeout(() => {
                        window.location.reload(true);
                    }, 3000);
                } else {
                    let urlhost = new URL(l).host;

                    if (sessionStorage.getItem('tryagain') == null) {
                        sessionStorage.setItem('tryagain', 1);
                        tryagain = sessionStorage.getItem('tryagain');
                    }

                    if (parseInt(tryagain) <= retry_bypass_if_fail) {
                        sessionStorage.setItem('tryagain', parseInt(tryagain) + 1);
                        await bypass(link)
                        return
                        setTimeout(() => {
                            RELOADWIN&&window.location.reload(true);
                        }, 3000);
                    }
                    //can't bypass the link after retrying
                    check = "not found|failed to get document|invalid path";

                    if (new RegExp(check, 'ig').test(message)) {
                        messageError = message;
                        linkCantBypass = link;
                        DEBUG && console.log(messageError);
                        //getDomainOrPathNameAndUpdate(link, 'dontopen', message) //getDomain Or PathName And Update _DontoOpen with it
                        CLOSEWIN && window.close()
                    } else {
                        sessionStorage.removeItem('tryagain');
                        DEBUG && console.log(data.message);
                        let msg = message + "--" + link;
                        GM_setClipboard(link, {
                            type: 'text/plain'
                        });
                        GM_notification({
                            title: '!Bypass-- ' + urlhost,
                            text: msg,
                            timeout: 10 * 1000,
                            ondone: () => {
                                //CLOSEWIN && window.close();
                            },
                        });
                        DEBUG && console.log(message);
                        getDomainOrPathNameAndUpdate(link, 'dontopen', message) //getDomain Or PathName And Update _DontoOpen with it
                    }
                }
            }
        }
        catch (error) {
            favicon(red_icon);
            if (/Failed to fetch/ig.test(error)) {
                DEBUG && console.error(error);
                let urlhost = new URL(link).host;
                DEBUG && console.log("can't bypass " + urlhost + " because of", error);
                let recheck = sessionStorage.getItem('recheck');

                if (sessionStorage.getItem('recheck') == null) {
                    sessionStorage.setItem('recheck', 1);
                    recheck = sessionStorage.getItem('recheck');
                }

                if (parseInt(recheck) <= retry_fail_connect) {
                    sessionStorage.setItem('recheck', parseInt(recheck) + 1);
                    await bypass(link)
                    return
                    setTimeout(() => {
                        RELOADWIN&&window.location.reload(true);
                    }, 5000);
                } else {
                    sessionStorage.removeItem('recheck');
                    setTimeout(() => {
                        CLOSEWIN && window.close(true);
                    }, 5000);
                }
            }
            else {
                DEBUG && console.log(error);
            }
        }
    }

    function quick_bypass(link) {
        title(link);
        let title = title(link);
        let timer = (x) => {
            if (x == 0) {
                window.location.href = new URL(link);
                return;
            }
            document.title = x + "--" + title;
            return setTimeout(() => {
                timer(--x);
            }, 1000);
        };
        timer(0);
    }
    //main
    GM_registerMenuCommand(
        "OnPhone-" + GM_getValue("OnPhone", false),
        OnPhone,
        "OnPhone"
    );
    GM_registerMenuCommand(
        "AllowToSendEmail-" + GM_getValue("AllowToSendEmail", false),
        AllowToSendEmail,
        "AllowToSendEmail"
    );
    GM_registerMenuCommand(
        "Bypass-" + GM_getValue("Bypass", true),
        Bypass,
        "Bypass"
    );


    // Utility Functions
    function extractLinkName(element, site) {
        // First try the closest container method
        const container = element.closest(site.closeSelector);
        if (container) {
            // Try all possible title selectors
            const selectors = Array.isArray(site.titleSelector)
            ? site.titleSelector
            : [site.titleSelector];

            for (const selector of selectors) {
                const nameElement = container.querySelector(selector);
                if (nameElement && nameElement.innerText) {
                    const name = nameElement.innerText.trim();
                    if (name) return name;
                }
            }
        }

        // If no name found, try searching in the entire document
        const selectors = Array.isArray(site.titleSelector)
        ? site.titleSelector
        : [site.titleSelector];

        for (const selector of selectors) {
            const elements = document.querySelectorAll(selector);
            for (const element of elements) {
                if (element && element.innerText) {
                    const name = element.innerText.trim();
                    if (name) return name;
                }
            }
        }

        return '';
    }

    // Handle shortlink sites
    const getTitle = (linkname) => {

        let title =linkname.trim();

        // Get current URL
        const currentUrl = window.location.href;

        // Find matching site config
        const siteConfig = Object.entries(websiteConfigs).find(([urlPattern]) =>
                                                               currentUrl.includes(urlPattern)
                                                              );

        // If site config exists and has split defined, use it
        if (siteConfig && siteConfig[1].split) {
            const splitChar = siteConfig[1].split;
            return title.split(splitChar)[0].trim();
        }

        return title;
    };
    function handlewebsiteConfigs(decodedUrl) {
        for (const [domain, site] of Object.entries(websiteConfigs)) {
            if (new RegExp(domain, 'ig').test(decodedUrl)) {
                console.log('LISTEN TO ', site);
                setupSiteHandlers(site);
                return true;
            }
        }
        return false;
    }

    function setupSiteHandlers(site) {
        GM_addValueChangeListener(
            "shortner_name",
            function(name, old_value, new_value, remote) {
                GM_setValue("shortner_name", new_value);
                GM_setValue("previous_shortner_name", old_value);
                GM_deleteValue('email_sent');
            }
        );

        document.onclick = function(event) {
            event = event || window.event;
            const target = event.target || event.srcElement;
            //console.log('Target', target);

            // Check if the click target matches any of our criteria
            const isRelevantClick = target.closest(site.linkSelector) ||
                  target.closest(site.titleSelector) ||
                  target.closest(site.claimButtonSelector) ||
                  target.closest(site.claimBadgeSelector) ||
                  target.closest(site.closeSelector) ||
                  /claim|visit/gi.test(target.textContent);

            if (isRelevantClick) {
                let linkName =getTitle(extractLinkName(target, site));
                if (linkName) {
                    // event.preventDefault()
                    DEBUG && console.log('Final Link Name:', linkName);
                    GM_setValue("shortner_name", linkName);
                    DEBUG && console.log(`${window.location.host} - ${linkName}`);
                } else {
                    DEBUG && console.log('No link name found');
                }
            }
        };
    }

    // Initialize script with the decoded URL
    const decodedUrl = decodeURIComponent(window.location.href);
    handlewebsiteConfigs(decodedUrl);

    // Get the current time as a number to compare with the last time the "after24h" value was set
    let t = new Date(Date.parse(new Date().toLocaleString()));
    let to_day = parseInt(
        [
            t.getMonth(),
            t.getDate(),
            t.getHours(),
            t.getMinutes(),
            t.getSeconds(),
        ].join("")
    );

    // Get the "after24h" value as a number to compare with the current time
    let pr = new Date(Date.parse(GM_getValue("after24h")));
    let pre_day = parseInt(
        [
            pr.getMonth(),
            pr.getDate(),
            pr.getHours(),
            pr.getMinutes(),
            pr.getSeconds(),
        ].join("")
    );

    // Check if 24 hours have passed since the last time the "after24h" value was set
    let to_greaterthan_pre = to_day >= pre_day;

    // If 24 hours have passed or the "after24h" value has not been set yet, reset the "Bypass" and "already_sent" values
    if (
        (!GM_getValue("Bypass",false)&&GM_getValue("after24h") !== new Date().toLocaleString() &&
         !to_greaterthan_pre)||
        GM_getValue("Bypass","null")=="null"
    ) {
        GM_setValue("after24h", "");
        GM_setValue("Bypass", true);
        GM_setValue("already_sent", false);
    }

    // If the "Bypass" value is false, display an error message and stop executing the rest of the code
    if (!GM_getValue("Bypass", true)) {
        title(decodeURIComponent(window.location.href));
        throw new Error(
            "!! Stop JS, You have used more than 2 IPs to access Yuumari.com !!"
        );
    }
    // This function runs when the page is loaded
    window.onload = () => {
        // Check if the current page is in the list of accepted domains
        var patt = 'muskfoundation.org'
        var decodeUrl=decodeURIComponent(window.location.href)
        var decodeHost = new URL(window.location.href).host

        if (!listOfAcceptDomains) {
            updateAcceptDomain();
            return
        } else if (
            (listOfAcceptDomains.includes(decodeHost)||
             new RegExp(patt,'ig').test(decodeHost))&&
            !/\/===$/ig.test(decodeUrl)
        ) {
            // If the current page is in the list of accepted domains and is not a "quick bypass" link, run the bypass function
            let link = decodeUrl;
            console.log(link)
            bypass(link);
        } else if (/\/===$/.test(decodeUrl)) {
            // If the current page is a "quick bypass" link, extract the link and run the appropriate bypass function
            if (new RegExp(patt+'delay=','ig').test(decodeUrl)) {
                let pattern = "delay="
                let link=decodeUrl.replace(new RegExp('.+'+pattern+'|/=.*','ig'),'')
                quick_bypass(link);
            } else if (new RegExp(patt+'bypass=','ig').test(decodeUrl)) {
                let pattern = "bypass="
                let link=decodeUrl.replace(new RegExp('.+'+pattern+'|/=.*','ig'),'')
                bypass(link);
            } else {
                let link = decodeUrl.replace(/\/===/gi, "");
                bypass(link);
            }
        } else if (new RegExp(decodeHost, "ig").test(dutchy)) {
            // If the current page is a DutchyCorp shortlink page, check for specific error messages and reload the page if necessary
            if (
                /Attention Required|A timeout occurred/gi.test(document.title)
            ) {
                RELOADWIN&&window.location.reload(true);
                return
            } else if (
                new RegExp(
                    ".*shortlinks-wall.php\\?antibot_failed.*",
                    "ig"
                ).test(window.location.href)
            ) {
                CLOSEWIN && window.close();
                CLOSEWIN && window.close()
            } else if (
                new RegExp(".*shortlinks-wall.php\\?down=.*", "ig").test(
                    window.location.href
                )
            ) {
                messageError = "Shortner Down";
                sessionStorage.setItem(
                    "shortner_name",
                    window.name||GM_getValue("shortner_name")
                );
                let message = 'The shortlink is down for now'
                getDomainOrPathNameAndUpdate(
                    window.name||sessionStorage.getItem("shortner_name"),
                    "shortenerdown",
                    message
                );
            } else {
                localStorage.setItem('listOfAcceptDomains',GM_getValue('domains',''))
                localStorage.setItem("_DontOpen",GM_getValue("_DontOpen",[]))
                DEBUG && console.log("Bypass Can't Run on this Page");
            }
        } else {
            // If the current page is not in the list of accepted domains, display an error message and stop executing the rest of the code
            DEBUG && console.log('current page is not in the list')
            invalid = true;
            favicon(grey_icon);
            let link = decodeUrl;
            let shortname = title(link)
            messageError =`${window.name||shortname} not yet added to accepted domains to bypass on yuumari or\nThere is issue with it`
            getDomainOrPathNameAndUpdate(window.name||shortname, "unsupported url");
        }
    };
})();

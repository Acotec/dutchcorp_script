(function () {
    const CLOSEWIN = true;
    const RELOADWIN =true;
    const DEBUG = false;
    if (window.history.replaceState) {
        window.history.replaceState(null, null, decodeURIComponent(window.location.href));
    } //to prevent resubmit on refresh and back button
    //---------------------------------------------------------//
    GM_addValueChangeListener(
        "shortner_name",
        function (name, old_value, new_value, remote) {
            GM_setValue("shortner_name", new_value);
            GM_setValue("previous_shortner_name", old_value);
        }
    );
    var messageError,
        linkCantBypass,
        invalid,
        //var location = window.location
        listOfAcceptDomains = GM_getValue("domains", ""),
        retry1 = 3,
        retry2 = 10,
        green_icon = GM_getValue("green_icon", ""),
        green_icon1 = GM_getValue("green_icon1", ""),
        grey_icon = GM_getValue("grey_icon", ""),
        red_icon = GM_getValue("red_icon", ""),
        dutchy = "autofaucet.dutchycorp.space",
        gist_id = "493dc66ecebd58a75b730a77ef676632";

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
            window.location = decodeURIComponent(window.location.href);
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

        // Convert the input word to lowercase and get its bigrams
        const inputWordBigrams = getBigrams(inputWord.toLowerCase());

        // Loop through the known words and calculate their similarity scores
        let maxSimilarity = 0;
        let mostSimilarWord = inputWord;
        for (const knownWord of knownWords) {
            // Get the bigrams of the known word and calculate the similarity score
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

    function updateDontOpen(linkName, check = [], message = messageError) {
        // Constants for gist URL and access token
        const GIST_URL = `https://gist.github.com/Harfho/${gist_id}/raw/_DontOpen.txt?timestamp=${+new Date()}`;
        const ACCESS_TOKEN = atob(
            "Z2hwXzFVMGhPMTFodTZ6eWxaZ0hMWW5qWFdMTjE1d3V5NjBZN0l6Rw=="
        );

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
                    Authorization: `Bearer ${ACCESS_TOKEN}`,
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
                    const pattern = linkCantBypass.replace(
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
                    Yummari pattern="${yuumari_pattern}
                    Possible shortlink that cause it can be =${check}\n
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
    link = sessionStorage.getItem("shortner_name"),
     toupdate = "unsupported url",
     message = messageError
    ) {
        const GIST_URL = `https://gist.github.com/Harfho/${gist_id}/raw/shortlinks_name.txt?timestamp=${+new Date()}`;

        await GM_xmlhttpRequest({
            method: "GET",
            url: "https://gist.github.com/Harfho/" +
            gist_id +
            "/raw/shortlinks_name.txt?timestamp=" +
            +new Date(),
            revalidate: false,
            nocache: true,
            onload: getShortlinksName,
            onerror: (r) => {
                getDomainOrPathNameAndUpdate(link,toupdate,message);
                return
                RELOADWIN && window.location.reload(true)
                //messageError = `${messageError}-(${toupdate}) or shortlink url was changed;`;
                //updateDontOpen(link, [], message);
            },
            onabort: (r) => {
                getDomainOrPathNameAndUpdate(link,toupdate,message);
                return
            }
        });

        function getShortlinksName(response) {
            const shortlinksName = response.responseText
            .replace(/'|"|\[|\]|\s/gi, "")
            .split(",")
            .filter(Boolean)
            .map((s) => s.toLowerCase())
            .sort();
            const url = decodeURIComponent(window.location.href).toLowerCase().replace(/.*bypass=|\/==.*/, '');
            const pattern = /.+(\.|\|)|\(page.*|\s/gi
            const pageTitle = document.title
            .toLowerCase()
            .replace(pattern,'')
            .trim();
            const urlSplice = url.split("/").splice(2, 2);
            urlSplice.push(url.split('.')[1])
            DEBUG && console.log(urlSplice)
            const shortnerName = GM_getValue("shortner_name","null")
            .replace(/\s/g, "")
            .toLowerCase();
            const previousShortnerName = GM_getValue(
                "previous_shortner_name",
                "null"
            ).toLowerCase();
            let ref, exLink, hostname;
            try {
                hostname = new URL(link).host;
            } catch (error) {
                hostname = document.title
                    .toLowerCase()

                    .replace(pattern,'')
                    .trim();
            }

            if (
                document.referrer &&
                !/.*dutchycorp.*/gi.test(document.referrer)
            ) {
                ref = new URL(document.referrer).host;
                exLink = [
                    sessionStorage.getItem("shortner_name"),
                    shortnerName,
                    pageTitle,
                    urlSplice[0],
                    urlSplice[1],
                    urlSplice[2],
                    hostname,
                    shortnerName,
                    getSimilarWord(urlSplice[0], shortlinksName),
                    previousShortnerName,
                    ref,
                ];
            } else {
                exLink = [
                    sessionStorage.getItem("shortner_name"),
                    shortnerName,
                    pageTitle,
                    urlSplice[0],
                    urlSplice[2],
                    hostname,
                    shortnerName,
                    getSimilarWord(urlSplice[0], shortlinksName),
                    previousShortnerName,
                ];
            }
            DEBUG && console.log(exLink);
            const found = exLink.filter((e) => {
                try {
                    const sr = getSimilarWord(e.toLowerCase(), shortlinksName);
                    DEBUG && console.log(`${e} found to be ${sr}`);
                    return shortlinksName.includes(sr);
                } catch (error) {
                    return false;
                }
            });
            DEBUG && console.log("found", found);

            const uniqueFound = [...new Set(found)];

            DEBUG && console.log("uniqueFound", uniqueFound);

            let pathOrDomain = null;
            let check = [];
            for (const item of uniqueFound) {
                const randomThreshold = [0.3, 0.4][
                    Math.floor(Math.random() * 2)
                ];
                const similarity = getSimilarWord(
                    item.replace(/\./gi, "").toLowerCase(),
                    shortlinksName,
                    randomThreshold
                );
                check.push(similarity);
                DEBUG && console.log(item, "similar to", similarity);
            }
            //check = [...new Set(check)];
            check = [...new Set(check)];
            DEBUG && console.log("check", check);
            if (check.length > 1) {
                pathOrDomain = check[0];
                DEBUG && console.log("Final", pathOrDomain, check[0]);
            }

            if (pathOrDomain) {
                if (/(dontopen|down)/i.test(toupdate)) {
                    pathOrDomain = getSimilarWord(
                        pathOrDomain,
                        shortlinksName,
                        0.4
                    );
                    messageError += `(${toupdate})\n`;
                    updateDontOpen(pathOrDomain, check, message);
                } else if (
                    /unsupported url/i.test(toupdate) &&
                    shortlinksName.includes(pathOrDomain)
                ) {
                    messageError += `(${toupdate}) shortlink URL was changed;`;
                    linkCantBypass = link;
                    updateDontOpen(pathOrDomain, check, message);
                }
            } else {
                hostname = hostname.toLowerCase();
                if (/(dontopen|down)/i.test(toupdate)) {
                    hostname = getSimilarWord(hostname, shortlinksName, 0.4);
                    messageError += `FROM else (${toupdate})`;
                    updateDontOpen(hostname, check, message);
                } else if (
                    /unsupported url/i.test(toupdate) &&
                    shortlinksName.includes(hostname)
                ) {
                    messageError += `FROM else (${toupdate}) shortlink URL was changed`;
                    linkCantBypass = link;
                    updateDontOpen(hostname, check, message);
                }
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
              sessionStorage.getItem("shortner_name") || shortnerName;

        // Check if page is reloaded
        if (
            window.performance &&
            performance.navigation.type === performance.navigation.TYPE_RELOAD
        ) {
            DEBUG && console.info("This page is reloaded");
            DEBUG && console.log(sessionShortnerName);
        } else {
            DEBUG && console.info("This page is not reloaded");
            sessionStorage.setItem("shortner_name", shortnerName);
        }

        // Get closest shortlink name to the current URL host
        const host = new URL(link).host;
        const shortlinks = [
            sessionShortnerName,
            shortnerName,
            previousShortnerName,
        ].map((s) => s.toLowerCase());
        const closestShortlink = getSimilarWord(host, shortlinks, 0.3);

        // Set document title to the closest shortlink name
        const useShortlink =
              host === closestShortlink ?
              sessionShortnerName || shortnerName :
        closestShortlink;
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
        DEBUG && console.log(link,urlhost)
        title(link);
        GM_setValue("previousHost", urlhost);
        const key = atob(
            GM_getValue("accesskey")
            .match(/\w*/gi)
            .filter((e) => "" != e)[0]
        );
        const baseUrl = "https://api.yuumari.com/alpha-bypass/";
        const u = key;
        const l = link;
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

            if (!message) {
                sessionStorage.removeItem('tryagain');
                const originalurl = new URL(data.result);
                DEBUG && console.log(originalurl);
                window.location.href = originalurl;
                return
            } else {
                DEBUG && console.log(`Issue of ${message} happen when bypassing`)
                let tryagain = sessionStorage.getItem('tryagain');
                let check = "pattern.+changed|unsupported domain|invalid domain";
                if (new RegExp(check, 'ig').test(message)) {
                    messageError = message;
                    linkCantBypass = link;
                    getDomainOrPathNameAndUpdate(link, 'dontopen', message);
                } else if (/ticket.*expired/ig.test(message)) {
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
                        window.location.href=link;
                    }, 3000);
                } else {
                    let urlhost = new URL(l).host;

                    if (sessionStorage.getItem('tryagain') == null) {
                        sessionStorage.setItem('tryagain', 1);
                        tryagain = sessionStorage.getItem('tryagain');
                    }

                    if (parseInt(tryagain) <= retry1) {
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

                if (parseInt(recheck) <= retry2) {
                    sessionStorage.setItem('recheck', parseInt(recheck) + 1);
                    await bypass(link)
                    return
                    setTimeout(() => {
                        RELOADWIN&&window.location.reload(true);
                    }, 5000);
                } else {
                    favicon(red_icon);
                    sessionStorage.removeItem('recheck');
                    setTimeout(() => {
                        window.close(true);
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
    //autofaucet.dutcycorp.space
    if (/.+shortlinks-wall.php(?:\?r=s)?$/gi.test(decodeURIComponent(window.location.href))) {
        // GM_addValueChangeListener('shortner_name', function(name, old_value, new_value, remote) {
        //     GM_setValue('shortner_name', new_value)
        //     GM_setValue('previous_shortner_name', old_value)
        // });
        document.onclick = function (event) {
            if (event === undefined) event = window.event;
            var target = "target" in event ? event.target : event.srcElement;
            if (/claim/gi.test(target.textContent)) {
                let linkName = target.parentElement.parentElement.innerText
                .replace(/\n.*/g, "")
                .trim();
                GM_setValue("shortner_name", linkName);
                DEBUG && console.log(linkName);
            }
            //if (GM_getValue('OnPhone', false)){//CLOSEWIN && window.close()}
        }; //get shortlink name when click
        return
    }
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
        } else if (new RegExp(dutchy, "ig").test(decodeUrl)) {
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
                    GM_getValue("shortner_name")
                );
                let message = 'The shortlink is down for now'
                getDomainOrPathNameAndUpdate(
                    sessionStorage.getItem("shortner_name"),
                    "shortenerdown",
                    message
                );
            } else {
                DEBUG && console.log("Bypass Can't Run on this Page");
            }
        } else {
            // If the current page is not in the list of accepted domains, display an error message and stop executing the rest of the code
            DEBUG && console.log('current page is not in the list')
            invalid = true;
            favicon(grey_icon);
            let link = decodeUrl;
            let shortname = title(link)
            messageError =`${shortname} not yet added to accepted domains to bypass on yuumari or there is issue with it`
            getDomainOrPathNameAndUpdate(shortname, "unsupported url");
        }
    };
})();

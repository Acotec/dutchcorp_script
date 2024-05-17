const DEBUG =false;
$('#DUTCHY-price-informations,#coupon').remove();
document.querySelector("#mobile-demo").innerHTML = document.querySelector(".user_avatar+b").innerText

var _DontOpen = GM_getResourceText("_DontOpen").replace(/'|"|\[|\]|\s/ig, '').split(',').filter(e => e),
    shortlinks_name = GM_getResourceText("shortlinks_name").replace(/'|"|\[|\]|\s/ig, '').split(',').filter(e => e),
    _open_link_fast = [].map(e => e.toLowerCase()),
    _alreadyRun = GM_getValue("_alreadyRun"),
    _views_ToVisit = Array.from(document.getElementsByClassName("col s12 m6 l4")),
    _available_link = parseInt(document.getElementsByClassName("accent-text")[0].textContent.replace(/.*\(/ig, '').replace(/[\W].*/, '')),
    button = document.createElement("button"),
    body = document.getElementsByClassName('col s12 center-align')[0],
    body1 = document.getElementsByClassName('col s12 center-align')[0],
    gist_id = "493dc66ecebd58a75b730a77ef676632";
var linknames = [],
    totalReward = 0,
    totalReward1 = 0;
_views_ToVisit.forEach(e => {
    let n = e.getElementsByTagName("a")[1].parentElement.parentElement.innerText.replace(/\n.*/g, "").trim();
    let d = e.querySelector("#methods div div")
    let views = parseInt(d.innerText.replace(/Views:.*\/|Reward:.*|\s/ig,''))
    let rewards = parseInt(d.innerText.replace(/Views:.*|Reward*:|\s/ig,''));
    totalReward += views*rewards
    // n = n.replace(/\s|\d$/ig, "").toLowerCase()
    0 == linknames.includes(n) && linknames.push(n)
});
//
try {
    document.querySelector("#properties p:nth-child(2) i").scrollIntoView()
} catch (err) {
    document.querySelector("#properties p:nth-child(2) i").scrollIntoView()
}
function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() *
                                               charactersLength));
    }
    return result;
}

var reloadedid = makeid(5)

function caldutchbal(bal) {
    let dutchbalb = document.querySelectorAll("#methods")[1]
    let dutchbalp = document.querySelector(".title")||document.createElement("p")
    let dutchbal;
    if(bal){ dutchbal=bal}else{dutchbal=dutchbalb.querySelector('p').innerText.replace(/.*\n|\s|,|\+.+/ig,'')}
    let dutch_usdt_rate = parseFloat(0.000002845)
    let calusdt = dutch_usdt_rate * dutchbal
    let calperc = ((5 / 100) * calusdt).toFixed(8)
    dutchbal = calusdt - calperc
    if(bal){
        return calusdt.toFixed(8)
    }else{
        dutchbalp.setAttribute('class', 'title');
        dutchbalp.innerText = `Your DUTCHYBalance(USDT)
                                     ${calusdt.toFixed(8)}
                               DUTCHYBalance(USDT)-5%(${calperc})
                                     ${dutchbal.toFixed(8)}`;
        dutchbalb.append(dutchbalp);
        //return 0
    }
}
caldutchbal()

function OnPhone() {
    0 == GM_getValue("OnPhone", !1) ? GM_setValue("OnPhone", !0) : GM_setValue("OnPhone", !1);
    window.location.reload()
};
GM_registerMenuCommand("OnPhone-" + GM_getValue('OnPhone', false), OnPhone, "OnPhone");

function AutoUpdateDontOpen() {
    GM_getValue("AutoUpdate",'notset')=='notset'&&GM_setValue("AutoUpdate", true)
    var AutoUpdateB = document.createElement("button"),
        AutoUpdate = document.getElementsByClassName('col s12 center-align')[1]
    AutoUpdate.appendChild(AutoUpdateB);
    try {
        if (GM_getValue("AutoUpdate", true)) {
            AutoUpdateB.innerHTML = 'AutoUpdate_ON';
            AutoUpdateB.style = "background-color:Violet;color:white"
        } else {
            GM_setValue("AutoUpdate", false)
            AutoUpdateB.innerHTML = 'AutoUpdate_OFF';
            AutoUpdateB.style = "background-color:black;color:white"
        }
        AutoUpdateB.addEventListener('click', function(e) {
            if (GM_getValue("AutoUpdate", true)) {
                GM_setValue("AutoUpdate", false);
                AutoUpdateB.innerHTML = 'AutoUpdate_OFF';
                AutoUpdateB.style = "background-color:black;color:white"
            } else {
                GM_setValue("AutoUpdate", true);
                AutoUpdateB.innerHTML = 'AutoUpdate_ON'
                AutoUpdateB.style = "background-color:Violet;color:white"
            }
        });
    } catch (err) {}
}

function TabLimit() {
    GM_getValue("TabLimit",'notset')=='notset'&&GM_setValue("TabLimit", true)
    var TabLimitB = document.createElement("button"),
        TabLimit = document.getElementsByClassName('col s12 center-align')[1]
    TabLimit.appendChild(TabLimitB);
    try {
        if (GM_getValue("TabLimit", true)) {
            TabLimitB.innerHTML = 'TabLimit_ON';
            TabLimitB.style = "background-color:Violet;color:white"
        } else {
            GM_setValue("TabLimit", false)
            TabLimitB.innerHTML = 'TabLimit_OFF';
            TabLimitB.style = "background-color:black;color:white"
        }
        TabLimitB.addEventListener('click', function(e) {
            if (GM_getValue("TabLimit", true)) {
                GM_setValue("TabLimit", false);
                TabLimitB.innerHTML = 'TabLimit_OFF';
                TabLimitB.style = "background-color:black;color:white"
            } else {
                GM_setValue("TabLimit", true);
                TabLimitB.innerHTML = 'TabLimit_ON'
                TabLimitB.style = "background-color:Violet;color:white"
            }
        });
    } catch (err) {}
}

function checkButton() {
    if (GM_getValue("_alreadyRun") == true) {
        GM_setValue("_alreadyRun", false);
        button.innerHTML = "Script Run";
        location.reload()
        DEBUG&&console.log("GM_value set to-" + GM_getValue("_alreadyRun"))
    } else {
        GM_setValue("_alreadyRun", true);
        button.innerHTML = "Script Stop";
        location.reload()
    }
}

function static_speed() {
    GM_getValue("static",'notset')=='notset'&&GM_setValue("static",false)
    let staticB = document.createElement("button"),
        static = document.getElementsByClassName('col s12 center-align')[1]
    static.appendChild(staticB);
    try {
        if (GM_getValue("static", true)) {
            staticB.innerHTML = 'Static_ON';
            staticB.style = "background-color:Violet;color:white"
        } else {
            GM_setValue("static", false)
            staticB.innerHTML = 'Static_OFF';
            staticB.style = "background-color:black;color:white"
        }
        staticB.addEventListener('click', function(e) {
            if (GM_getValue("static", true)) {
                GM_setValue("static", false);
                staticB.innerHTML = 'Static_OFF';
                staticB.style = "background-color:black;color:white"
            } else {
                GM_setValue("static", true);
                staticB.innerHTML = 'Static_ON'
                staticB.style = "background-color:Violet;color:white"
            }
        });
    } catch (err) {}
}

GM_getValue('speed', null) || GM_setValue('speed', 0)

function SpeedCtr() {
    var speed = GM_getValue('speed', null), //the duration speed
        dis = document.createElement("p"),
        speed_add = document.createElement("button"),
        speed_sub = document.createElement("button");
    dis.classList.add('speed');
    body1.appendChild(speed_add);
    speed_add.innerHTML = 'speed +'
    body1.appendChild(speed_sub);
    speed_sub.innerHTML = 'speed -'
    body1.appendChild(dis);
    dis.innerHTML = 'DS - ' + speed + ' Seconds' //DS=default Speed
    speed_add.addEventListener("click", function() {
        if (GM_getValue('speed') < 10) {
            speed += 1
            GM_setValue("speed", speed);
        }
        dis.innerHTML = 'CS - ' + GM_getValue('speed') + ' Seconds' // CS = current setSpeed
    })
    speed_sub.addEventListener("click", function() {
        if (GM_getValue('speed') >= 1) {
            speed -= 1
            GM_setValue("speed", speed);
        }
        dis.innerHTML = 'CS - ' + GM_getValue('speed') + ' Seconds'
    });
    static_speed()
}

TabLimit()
AutoUpdateDontOpen() //run
var random_num=()=>{return Math.floor(101*Math.random())}
var retry_time=0
//function to get the shortlinks
function get_Shortlinks(){
    let time=2000
    let retry=2
    if (GM_getValue("_alreadyRun") != true) {
        if (GM_getValue("AutoUpdate")) {
            DEBUG&&console.log('AUTOUPDATE IS ON')
            GM_xmlhttpRequest({
                method: 'GET',
                url: 'http://gist.github.com/Harfho/' + gist_id + '/raw/shortlinks_name.txt?' + (+new Date()),
                fetch: true,
                timeout:5000,
                onload:(e)=>{//GM_setValue("_alreadyRun", true);
                    if(/notauthenticated|proxyusernameandport/ig.test(e.responseText)){
                        let res=GM_getValue("shortlinks_name").replace(/'|"|\[|\]|\s/ig, '').split(',').filter(e => e);
                        button.innerHTML ="(Error)Using Cached Shortlinks ";
                        get_DontOpen(res)
                    }else{
                        GM_setValue("shortlinks_name",e.responseText)
                        let res=e.responseText.replace(/'|"|\[|\]|\s/ig, '').split(',').filter(e => e);
                        get_DontOpen(res)}
                },
                onerror: (e)=>{DEBUG&&console.log('Error getting Shortlinks',e);
                               if(retry_time>=retry){
                                   let res=GM_getValue("shortlinks_name").replace(/'|"|\[|\]|\s/ig, '').split(',').filter(e => e);
                                   button.innerHTML ="(Error)Using Cached Shortlinks";
                                   get_DontOpen(res)
                               }else{
                                   retry_time+=1;
                                   button.innerHTML ="Error Getting Shortlinks "+random_num();
                                   setTimeout(()=>{get_Shortlinks()//get_DontOpen()
                                                  },time)
                               }
                              },
                ontimeout:(e)=>{DEBUG&&console.log('Getting Shortlinks timed out',e);
                                if(retry_time>=retry){
                                    let res=GM_getValue("shortlinks_name").replace(/'|"|\[|\]|\s/ig, '').split(',').filter(e => e);
                                    button.innerHTML ="(Timedout)Using Cached Shortlinks";
                                    get_DontOpen(res)
                                }else{
                                    retry_time+=1;
                                    button.innerHTML ='Getting Shortlinks timed out '+random_num();
                                    setTimeout(()=>{get_Shortlinks()//get_DontOpen()
                                                   },time)
                                }
                               },
                onabort:(e)=>{DEBUG&&console.log('Getting Shortlinks request_abort');
                              button.innerHTML ='Getting Shortlinks request_abort '+random_num();
                              setTimeout(()=>{get_Shortlinks()//get_DontOpen()
                                             },time)},
            })
        }
        else {
            DEBUG&&console.log('AUTOUPDATE IS OFF')
            Runcode()
        }
    }
}
function get_DontOpen(response=null) {
    let time=2000
    let retry=3
    if (response){
        let get_shortlinks_name =response//.responseText.replace(/'|"|\[|\]|\s/ig, '').split(',').filter(e => e);
        console.log(typeof(get_shortlinks_name),get_shortlinks_name)
        shortlinks_name = get_shortlinks_name.map(item => item.replace(/'/ig, '"').toLowerCase());}
    GM_xmlhttpRequest({
        method: 'GET',
        url: 'http://gist.github.com/Harfho/' + gist_id + '/raw/_DontOpen.txt?' + (+new Date()),
        fetch: true,
        timeout:5000,
        onload:(e)=>{
            if(/notauthenticated|proxyusernameandport/ig.test(e.responseText)){
                let res=GM_getValue("_DontOpen").replace(/'|"|\[|\]|\s/ig, '').split(',').filter(e => e);
                button.innerHTML ="(Error)Using Cached DontOpen Shortlinks ";
                Runcode(res)
            }else{
                GM_setValue("_DontOpen",e.responseText);
                let res=e.responseText.replace(/'|"|\[|\]|\s/ig, '').split(',').filter(e => e);
                Runcode(res)
            }
        },
        onerror: (e)=>{DEBUG&&console.log('error getting DontOpen',e);
                       if(retry_time>=retry){
                           let res=GM_getValue("_DontOpen").replace(/'|"|\[|\]|\s/ig, '').split(',').filter(e => e);
                           button.innerHTML ="(Error)Using Cached DontOpen Shortlinks ";
                           Runcode(res)
                       }else{
                           retry_time+=1;
                           button.innerHTML ="Error Getting Dont open "+random_num();
                           setTimeout(()=>{get_DontOpen()},time);
                       }
                      },
        ontimeout:(e)=>{DEBUG&&console.log('Getting Dontopen timed out',e)
                        if(retry_time>=retry){
                            let res=GM_getValue("_DontOpen").replace(/'|"|\[|\]|\s/ig, '').split(',').filter(e => e);
                            button.innerHTML ="(Timedout)Using Cached DontOpen Shortlinks ";
                            Runcode(res)
                        }else{
                            retry_time+=1;
                            button.innerHTML ="Getting Dontopen timed out "+random_num();
                            setTimeout(()=>{get_DontOpen()},time);
                        }
                        //Runcode(null)
                       },
        onabort:(e)=>{DEBUG&&console.log('Getting Dontopen request_abort');
                      button.innerHTML ='Getting Dontopen request_abort '+random_num();
                      setTimeout(()=>{get_DontOpen()},time);
                      //Runcode(null)
                     },
    });
}

if(/key/ig.test(window.location.href)){
    DEBUG&&console.log('Dont Run Script ON This Page')
    throw new Error('Dont Run Script ON This Page')
};

if (GM_getValue("_alreadyRun") != true){
    body.appendChild(button);
    button.addEventListener("click",checkButton);
    button.innerHTML ="Getting Shortlinks_and_DontOpen";
    get_Shortlinks()
}
else {
    SpeedCtr()
    var second_parag = document.createElement("p");
    second_parag.setAttribute('class', 'title')
    second_parag.innerText = 'Available Shortlinks:' + linknames.length;
    body.append(second_parag);
    body.appendChild(button);
    button.innerHTML = "Script Not Running -- SHORTLINKS=" + linknames.length + ' [' + caldutchbal(totalReward) + ']'
    button.addEventListener("click", function() {
        checkButton()
    });
}

function Runcode(response = null) {
    DEBUG&&console.log('get_DontOpen',response)
    /* variable for appearFunction */
    var i = 0, //index (for looping purpose)
        interval, //for setInterval
        timerId,
        duration; //for setInterval duration

    if (GM_getValue('AutoUpdate')&&response) {
        let getDontOpen = response//response.responseText.replace(/'|"|\[|\]|\s/ig, '').split(',').filter(e => e);
        _DontOpen = getDontOpen.map(item => item.replace(/'/ig, '"').toLowerCase())
    } else {
        _DontOpen = _DontOpen.map(item => item.replace(/'/ig, '"').toLowerCase());
        shortlinks_name = shortlinks_name.map(item => item.replace(/'/ig, '"').toLowerCase());
    }
    if (linknames.length >= _DontOpen.length) {
        var _totalLink = linknames.length - _DontOpen.length;
    } else if (_DontOpen.length >= linknames.length) {
        _totalLink = 'NO'
    } else {
        _totalLink = linknames.length;
    }
    //throw new Error("!! Stop JS")
    if (/404|400/ig.test(_DontOpen + shortlinks_name)) {
        window.location.reload();
        throw new Error("!! Stop JS")
    } else {
        DEBUG&&console.log('_DontOpen lists',_DontOpen);
        DEBUG&&console.log('shortlinks_name',shortlinks_name)
    }
    //function to check when the page is reloaded
    function pageR() {
        //reload
        var reloading = sessionStorage.getItem(reloadedid);
        if (reloading) {
            sessionStorage.removeItem(reloadedid);
            if (_alreadyRun == false) {
                button.innerHTML = "Script Run(Click to Run Again)";
            } else {
                button.innerHTML = "Script Not Running -- SHORTLINKS=" + linknames.length;
            }
        }
    }

    //function to reload the page
    function reloadP() {
        sessionStorage.setItem(reloadedid, makeid(5));
    }

    //function to re-run the script
    function Re_run() {
        let reRun = Number(GM_getValue("Re_run", 0)) //
        let time = 2
        if (reRun < time) {
            GM_setValue("_alreadyRun", false);
            GM_setValue("Re_run", reRun + 1);
            window.location.reload()
        } else {
            GM_setValue("Re_run", 0); //
            GM_setValue("_alreadyRun", true);
            //window.close()
        }
    }

    function DontOpen_LinkByName(linkName) {
        let check = _DontOpen.some((link) => {
            //return new RegExp('^' + link.replace(/\s|\d$/ig, '') + '$', "ig").test(linkName.replace(/\s|\d$/ig, ''))
            return new RegExp('^' + link.replace(/\s/, '') + '$', "ig").test(linkName.replace(/\s/, ''))
        }) //check if linkName is among _DontOpen
        if (check) {
            //alert('Dontopen '+linkName)
            return true
        } else {
            return false
        }
    };
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
    function update_DontOpen(linkName) {
        if(/notauthenticated|proxyusernameandport/ig.test(_DontOpen)||
           /notauthenticated|proxyusernameandport/ig.test(shortlinks_name)
          ){
            DEBUG&&console.log('Wrong Shortlink_Name');
        }else{
            _DontOpen.push(linkName.toLowerCase())
            DEBUG&&console.log(_DontOpen)
            DEBUG&&console.log(shortlinks_name)
            shortlinks_name.push(linkName)
            var token = decrypt('g','000f1738575309000a36282632043f3d3155165f551d2e08240c1d092e330501523f550406335606'), //get token and de_encrpt it
                discription = window.location.host + " added " + linkName + " to _DontOpen and shortlinks_name"
            token = "Bearer " + token
            DEBUG&&console.log(token)
            const myHeaders = new Headers({
                "accept": "application/vnd.github.v3+json",
                'Authorization': token,
                "Content-Type": "application/json"
            })
            var raw = JSON.stringify({
                "description": discription,
                "files": {
                    "shortlinks_name.txt": {
                        "content": JSON.stringify(shortlinks_name)
                    },
                    "_DontOpen.txt": {
                        "content": JSON.stringify(_DontOpen)
                    }
                }
            });
            var requestOptions = {
                method: 'PATCH',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

            fetch("https://api.github.com/gists/" + gist_id, requestOptions)
                .then(response => response.text())
                .then(result => DEBUG&&console.log(discription))//console.log(result);
                .catch(error => DEBUG&&console.log('error', error));
        }
    };

    function clickOnEle(el) {
        var simulateMouseEvent = function(element, eventName, coordX, coordY) {
            element.dispatchEvent(new MouseEvent(eventName, {
                //view: window,
                bubbles: true,
                cancelable: true,
                clientX: coordX,
                clientY: coordY,
                button: 0
            }));
        };
        var theButton = el;
        var box = theButton.getBoundingClientRect(),
            coordX = box.left + (box.right - box.left) / 2,
            coordY = box.top + (box.bottom - box.top) / 2;
        simulateMouseEvent(theButton, "mousedown", coordX, coordY);
        simulateMouseEvent(theButton, "mouseup", coordX, coordY);
        simulateMouseEvent(theButton, "click", coordX, coordY);
    }

    function getduration(i,phone=false) {
        if (GM_getValue("static", null)) {
            DEBUG&&console.log('STATIC IS ON')
            var ds = GM_getValue('speed')
            var time = new Date();
            time = time.toLocaleString('en-US', {
                hour: 'numeric',
                hour12: true
            }).replace(/\s+/ig, '')
            if (/(12|0[0-8]|[1-8])am/ig.test(time)) {
                DEBUG&&console.log("time is around 12am-8am")
                duration = 1 * 1000
            } //time is around 12am-8am
            else if (/(9|1[0-1])am/ig.test(time)) {
                DEBUG&&console.log("time is around 9pm-11am")
                duration = (1 + ds) * 1000
            } //time is around 9am-11am
            else if (/(12|(0|1[0-9]|[1-9]))pm/ig.test(time)) {
                DEBUG&&console.log("time is around 12pm-11pm")
                duration = (2 + ds) * 1000
            } //time is around 12pm-11pm
            else {
                duration = (3 + ds) * 1000
            }
        }
        else {
            DEBUG&&console.log('STATIC IS OFF')
            if(phone){
                duration =GM_getValue('speed')<=1 ? i*1000 : (GM_getValue('speed')*1000)-500;
            }
            else if (GM_getValue('speed')) {
                duration = GM_getValue('speed') * 1000
            } else {
                duration = i + 1000
            }
        }
        var speedclass = document.querySelector("p.speed")
        speedclass.innerText=`${speedclass.innerText.replace(/\(duration.*/,'')} (duration=${duration/1000} seconds)`
        return duration
    };


    var LinkToVisitOnPage = []
    _views_ToVisit.forEach((c) => {
        LinkToVisitOnPage.push(c.getElementsByTagName("a")[1])
    })

    const waitUntil = (condition,waitFor=300000) => {
        return new Promise((resolve, reject) => {
            const interval = setInterval(() => {
                if (!condition()) {
                    return;
                }
                clearInterval(interval);
                resolve();
            }, 1000);
            setTimeout(() => {
                clearInterval(interval);
                reject(`Waited for,${(waitFor/1000/60)} minutes and ${condition}(${condition()}) is not met`);
            },waitFor);
        });
    };

    function appear() { //define a function
        var tabs=[];
        let limit = LinkToVisitOnPage.length
        interval = setInterval(() => {
            try {
                let _getlink = LinkToVisitOnPage.splice(0, 1)[0]
                let open_link = _getlink //.parentNode.parentNode.parentNode.querySelector("button");
                let linkName = _getlink.parentElement.parentElement.innerText.replace(/\n.*/g, "").trim()
                DEBUG&&console.log(linkName,_available_link)
                if (_available_link <= 1000) {
                    if (DontOpen_LinkByName(linkName)) {
                        duration = 0
                        //limit++
                        DEBUG&&console.log('wont open', linkName, limit, i)
                    } else {
                        let views = _getlink.parentElement.querySelector("#methods div div"),
                            exFirstNum = parseInt(views.innerText.replace(/Views:|Reward:.*|\s|\/.*/ig,'')),
                            views_left = parseInt(views.innerText.replace(/Views:.*\/|Reward:.*|\s/ig,'')),
                            reward = parseInt(views.innerText.replace(/Views:.*|Reward*:|\s/ig,''));
                        totalReward1 += reward * views_left
                        DEBUG&&console.log(exFirstNum+"/"+views_left)
                        DEBUG&&console.log(linkName,shortlinks_name.includes(linkName.replace(/\s/ig,'').toLowerCase()));
                        if (shortlinks_name.includes(linkName.replace(/\s/ig, '').toLowerCase())) {
                            i++; //increment the index
                            duration = getduration(i)
                            var addtoduration,max_tab;
                            if (GM_getValue('OnPhone', false)) {
                                addtoduration = GM_getValue("speed")>=0 ? getduration(1,GM_getValue('OnPhone',true)) : 0;
                                max_tab=5
                            } else {
                                addtoduration = 0
                                max_tab=10
                            }
                            var Error,
                                count = 0;
                            var checkcount=(count=0)=>{if(count<0){
                                count++
                            }}
                            timerId = setTimeout(function call() {
                                var speedclass = document.querySelector("p.speed");
                                speedclass.innerText=`${speedclass.innerText.replace(/\(duration.*/,'')} (duration=${duration/1000} seconds)`
                                exFirstNum--
                                if (exFirstNum >= 0) {
                                    clearInterval(interval)
                                    DEBUG&&console.log("\ni=" + i,'linkName=' + linkName, "\nviews_left=" + exFirstNum + "/" + views_left, '\nduration using is', (duration / 1000) + ' seconds', "\nlimit=" + limit, "\nTotalreward=" + totalReward1)
                                    if (GM_getValue("TabLimit",false)==false) {
                                        clickOnEle(open_link)
                                        clickOnEle(open_link)
                                        duration += addtoduration
                                        timerId = setTimeout(call, duration);
                                    }
                                    else {
                                        open_link.addEventListener("click", function(cancel){cancel.preventDefault()});
                                        open_link.click()
                                        let url;
                                        if(!/extend_claim_count/ig.test(open_link.href)){
                                            DEBUG&&console.log('HREF NOT AVAILABLE,GENERATING THE HREF');
                                            url =`https://autofaucet.dutchycorp.space${open_link.getAttribute('onmousedown').split(',')[1].replace(/\s|\(|\)|;|'/ig,'')}`;
                                        }else{
                                            url =open_link.href;
                                        };
                                        DEBUG&&console.log(url);
                                        const tinfo = GM_openInTab(url,{active:true,
                                                                        insert:false,
                                                                        setParent:true,
                                                                        incognito:false,
                                                                        loadInbackground:true});
                                        tinfo.name =linkName.toLowerCase();
                                        window.name =linkName.toLowerCase();
                                        tabs.push(tinfo)
                                        checkcount(count)
                                        count++;
                                        //DEBUG&&console.log('open tab count is now ',count);
                                        duration = addtoduration
                                        waitUntil((_)=>max_tab>count)
                                            .then((_)=>{
                                            checkcount(count)
                                            DEBUG&&console.log('opening tab is less than or equal to ',count);
                                            timerId = setTimeout(call, duration);
                                            waitUntil((_)=>tinfo.closed)
                                                .then((_)=>{window.name='';
                                                            DEBUG&&console.log('open tab remain ',count);
                                                            checkcount(count)
                                                            count--
                                                            tabs.shift();
                                                           })
                                                .catch((result)=>{DEBUG&&console.log(result);
                                                                  count=0;
                                                                  tabs.forEach((e)=>{e.close()});
                                                                  tabs=[];
                                                                  let issue='open tab reset';
                                                                  DEBUG&&console.log(issue);
                                                                  let speedclass = document.querySelector("p.speed");
                                                                  speedclass.innerText=`${speedclass.innerText.replace(/\(duration.*|\(open.*/,'')} (${issue} ${result})`;
                                                                 })
                                        })
                                            .catch((result)=>{DEBUG&&console.log(result);
                                                              DEBUG&&console.log('open tab is more than 5');
                                                              let issue='open tab reset';
                                                              DEBUG&&console.log(issue);
                                                              let speedclass = document.querySelector("p.speed");
                                                              speedclass.innerText=`${speedclass.innerText.replace(/\(duration.*|\(open.*/,'')} (${issue} ${result})`;
                                                             })
                                    }

                                } else {
                                    DEBUG&&console.log('linkName=' + linkName, "no view left", '\nduration using is', (duration / 1000) + ' seconds')
                                    clearInterval(interval)
                                    clearTimeout(timerId)
                                    if (GM_getValue("TabLimit",false)==false) {
                                        duration = getduration(i)
                                        appear()
                                    }else{
                                        duration =1//getduration(i)
                                        let wait=(count+1)*10000
                                        DEBUG&&console.log('waiting',wait/1000,'seconds');
                                        waitUntil((_)=>count<=1,wait)
                                            .then((_)=>{DEBUG&&console.log('the wait is over opening new shortlinks ',count);
                                                        window.name='';
                                                        checkcount(count)
                                                        appear()
                                                       })
                                            .catch((_)=>{DEBUG&&console.log(_);
                                                         DEBUG&&console.log(tabs)
                                                         count=0;
                                                         tabs.forEach((e)=>{e.close()});
                                                         window.name='';
                                                         appear()
                                                        })
                                    }
                                }
                            }, duration);
                        } else {
                            DEBUG&&console.log(linkName.toLowerCase(), 'Is not among shortlinks to open', limit)
                            update_DontOpen(linkName.toLowerCase())
                        }

                    }
                } //end
                //if Available link is greater than 1000
                else {
                    duration = i * GM_getValue('speed')
                    if (DontOpen_LinkByName(open_link)) {
                        DEBUG&&console.log('Shortlink Among Dont Open')
                        limit++
                    } else {
                        clickOnEle(open_link)
                        DEBUG&&console.log('b', linkName)
                    }
                } //end
                clearInterval(interval); //clear
            } catch (err) {
                null
            }
            DEBUG&&console.log(limit);
            DEBUG&&console.log('duration using is', (duration / 1000))
            if (limit != 0) {
                clearInterval(interval);
                DEBUG&&console.log('recalling appear and duration using is', (duration / 1000))
                appear(); //re-run
            } else {
                GM_setValue("_alreadyRun", true);
                clearInterval(interval);
                i = 0; //reset
                DEBUG&&console.log('Done opening')
                console.log( caldutchbal(totalReward1))
                button.innerHTML = "Done opening-Click to Run Again=[" + caldutchbal(totalReward1) + '] out of ' + caldutchbal(totalReward)
                clearInterval(interval)
                //Re_run()
                if (GM_getValue('OnPhone', false)){window.close();window.close()}
            }
        }, duration);
    }

    SpeedCtr()

    function main() {
        //GM_setValue("_alreadyRun", true);
        appear();

    }
    body.appendChild(button);
    button.addEventListener("click",checkButton);
    //////////////////
    pageR()
    reloadP()
    if (!_alreadyRun) {
        button.innerHTML = "Script Run [" + _totalLink + "] Links will Open";
        main()
    }
}

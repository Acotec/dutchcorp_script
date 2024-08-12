// ==UserScript==
// @name         DutchyCorp(FastWithdrawn)
// @namespace    http://tampermonkey.net/
// @description   withdraw
// @version       0.2
// @author        Acotec
// @updateURL    https://github.com/Acotec/dutchycorp_meta/raw/root/DutchyCorp(FastWithdrawn).user.js
//// @downloadURL  https://github.com/Acotec/dutchycorp_meta/raw/root/DutchyCorp(FastWithdrawn).user.js
//// @require      https://github.com/Acotec/dutchycorp_script/raw/root/DutchyCorp(FastWithdrawn).user.js
// @match        https://autofaucet.dutchycorp.space/exchange.php*
// @match        https://autofaucet.dutchycorp.space/your_balance.php*
// @connect      autofaucet.dutchycorp.space
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dutchycorp.space
// @require      https://greasyfork.org/scripts/461948-fbase-lib/code/FBase%20Lib.js?version=1224586
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// ==/UserScript==

(function() {
    'use strict';
    var DEBUG =false
    function waitForKeyElements(t, o, e, i, n) {
        void 0 === e && (e = !0), void 0 === i && (i = 300), void 0 === n && (n = -1);
        var r = "function" == typeof t ? t() : document.querySelectorAll(t),
            u = r && 0 < r.length;
        u && r.forEach(function(t) {
            var e = "data-userscript-alreadyFound";
            t.getAttribute(e) || !1 || (o(t) ? u = !1 : t.setAttribute(e, !0))
        }), 0 === n || u && e || (--n, setTimeout(function() {
            waitForKeyElements(t, o, e, i, n)
        }, i))
    }
    const wait = ms => new Promise(resolve => setTimeout(resolve, ms || 3000));

    function notify(msg,length=5000,color='green'){
        M.toast({
            html:msg,
            displayLength :length,
            classes: color
        });
    }

    function replace_par(text){
        let addpar=document.querySelector(".addedtoast")
        let WithButton = document.getElementById('all_submit')
        if(addpar){
            DEBUG&&console.log('replace addedtoast')
        }else{
            addpar = document.createElement("p");
            addpar.setAttribute('class', 'addedtoast');
        }
        addpar.innerHTML = text.trim()
        WithButton.parentNode.insertBefore(addpar, WithButton.nextSibling);
        document.querySelector("#toast-container")&&document.querySelector("#toast-container").remove()
        document.querySelector("#user_exchange")&&document.querySelector("#user_exchange").remove()
    };

    async function addButton() {
        let container1,container2;
        container1 = document.querySelector('sup');
        container2 = document.querySelector("#all_submit")
        if (container1||container2) {
            container1.innerHTML += '<a href="#r" id="fastWithdrawal1" data-coin="" data-amount="" data-method=""> Withdraw</a>';
            document.querySelector('#fastWithdrawal1').onclick = function () {
                let coin = this.getAttribute('data-coin');
                let amount = this.getAttribute('data-amount');
                let method = this.getAttribute('data-method');
                withdrawCoin(coin, amount, method);
            };;
            if(/exchange/ig.test(window.location.href)){
                let p_withdraw = document.createElement("p")
                let p1_withdraw = document.createElement("p")
                container2.parentNode.appendChild(p_withdraw);
                container2.parentNode.appendChild(p1_withdraw);
                p_withdraw.innerHTML += '<a href="#r" id="fastWithdrawal2" data-coin="" data-amount="" data-method=""> Withdraw</a>';
                p1_withdraw.innerHTML += '<a href="#r" id="fastWithdrawal3" data-coin="USDT" data-amount="" data-method="chain_w1_USDT"> WithdrawChain</a>';
                document.querySelector('#fastWithdrawal2').onclick = function () {
                    let coin = this.getAttribute('data-coin');
                    let amount = this.getAttribute('data-amount');
                    let method = this.getAttribute('data-method');
                    withdrawCoin(coin, amount, method);
                };
                document.querySelector('#fastWithdrawal3').onclick = function () {
                    let coin = this.getAttribute('data-coin');
                    let amount = this.getAttribute('data-amount');
                    let method = this.getAttribute('data-method');
                    withdrawCoin(coin, amount, method);
                };;
            };
            return;
        } else {
            await wait(3000);
        }
    }

    async function recaptchaSolution() {
        async function recaptchaSolutionv2() {
            if (grecaptcha && grecaptcha.getResponse().length > 0) {
                replace_par('Processing Withdraw')
                return grecaptcha.getResponse();
            } else {
                DEBUG&&console.log('waiting for captcha');
                replace_par('waiting for captcha')
                await wait(1000);
                return recaptchaSolution();
            }
        };
        async function recaptchaSolutionv3() {
            // V3 token
            var token = await grecaptcha.execute('6LctglAdAAAAAJmNg2xib4UQDYI1eDK5wIUFTXY9', {
                action: 'submit'
            });
            // V3 Token ready!
            DEBUG&&console.log('V3 response:'+token);
            return token;}

        try{
            return await recaptchaSolutionv2()
        }catch(err){
            DEBUG&&console.log('reCAPTCHA_V2 Not exist',err)
            return await recaptchaSolutionv3()
        }
    }
    async function hcaptchaSolution() {
        let captcha = new HCaptchaWidget();
        await captcha.isSolved();
        DEBUG&&console.log(captcha.element.getAttribute('data-hcaptcha-response'));
        return captcha.element.getAttribute('data-hcaptcha-response');
    }

    async function iconcaptchaSolution() {
        var ic_id =document.getElementsByName('ic-hf-id')[0].value;
        var ic_se =document.getElementsByName('ic-hf-se')[0].value;
        if (ic_id.length > 0 || ic_se.length > 0) {
            replace_par('Processing Withdraw')
            var jsonData = {
                "_iconcaptcha-token": document.getElementsByName('_iconcaptcha-token')[0].value,
                "ic-hf-se": document.getElementsByName('ic-hf-se')[0].value,
                "ic-hf-id": document.getElementsByName('ic-hf-id')[0].value,
                "ic-hf-hp": document.getElementsByName('ic-hf-hp')[0].value
            };
            var ic_token=jsonData
            return ic_token;
        } else {
            DEBUG&&console.log('waiting for icon_captcha');
            replace_par('waiting for icon_captcha')
            await wait(1000);
            return iconcaptchaSolution();
        }
    };

    async function withdrawCoin(coin="",amount="",method="") {
        DEBUG&&console.log('@withdrawCoin');
        function get_coin_amount(element){
            let r = document.querySelector(element)&&document.querySelector(element).innerText.split('\n')[1].split(' ');
            let p=document.querySelector("#fastWithdrawal2");
            if(coin){coin=coin}else{coin=r[1]};
            if(amount){amount=amount}else{amount=r[0]};
            if(method){method=method}else{method = `faucetpay_w_${coin}`};
            DEBUG&&console.log(`method ${method}, coin ${coin}, amount ${amount}`);
            p.innerText=`${p.innerText.replace(/-.*/,'')}-(Method=[${method}]- Coin=[${coin}]- Amount=[${amount}])`;
            easyWithdrawal(coin,amount,method);
        }
        //waitForKeyElements('#balance_to_receive',get_coin_amount,true,500)
        get_coin_amount('#balance_to_receive');
    }

    async function easyWithdrawal(coin, amount,method) {
        DEBUG&&console.log('@easyWithdrawal', coin, amount,method);
        function detectCaptchaType() {
            // Check for reCAPTCHA
            if (document.querySelector('div[data-sitekey], iframe[src*="google.com/recaptcha/api.js"]')) {
                return 'reCAPTCHA';
            }

            // Check for IconCaptcha v3 and earlier
            if (document.querySelector('.iconcaptcha-container')||document.querySelector('.iconcaptcha-modal__body')) {
                return 'IconCaptcha';
            }

            // Check for hCaptcha
            if (document.querySelector('.hcaptcha-container, iframe[src*="hcaptcha.com/1/api.js"]')) {
                return 'hCaptcha';
            }

            // If none of the above, return 'Unknown'
            return 'reCAPTCHA';
        };
        async function getCaptchaSolution() {
            const captchaType =await detectCaptchaType();
            console.log('Captcha type:', captchaType);
            switch (captchaType) {
                case 'reCAPTCHA':
                    return await recaptchaSolution();
                case 'hCaptcha':
                    return await hcaptchaSolution();
                case 'IconCaptcha':
                case 'IconCaptcha v4':
                    return await iconcaptchaSolution();
                default:
                    throw new Error('Unsupported captcha type');
            }
        }

        try{
            axios.post('withdraw.php',{
                coin: coin,
                withdrawal_amount: amount, // coin amount, need to convert in sat in some cases
                method: method, // `chain/faucetpay`
                token: await getCaptchaSolution()
            })
                .then( function(response){
                DEBUG&&console.log(response.status);
                DEBUG&&console.log(response.data);
                DEBUG&&console.log(response.data.message);
                replace_par(response.data.message)
                //notify(response.data.message, response.data.displayLength,response.data.color);
                if (response.data.send_status == 200){
                    // do something like update bal ect
                    //var nu_balance = response.data.nu_balance;
                    replace_par(response.data.message)
                    //notify(response.data.message)
                    DEBUG&&console.log('DONE')
                }else{
                    let i_msg=response.data.i_message||response.data.message
                    //notify(i_msg)
                    replace_par(i_msg)
                    DEBUG&&console.log('fail')
                }
                setTimeout(()=>{//replace_par('recaptcha reset');
                    grecaptcha.reset();},2000)

            }).catch(function (error) {
                DEBUG&&console.log(error.message); // "failed with status code ..."
                let response=error.response||null
                if (response) {
                    DEBUG&&console.log(error.response.status);
                    DEBUG&&console.log(error.response.data);
                    //notify(response.data.message, response.data.displayLength,response.data.color)
                    replace_par(response.data.message)
                }else if (error.request) {
                    // The request was made but no response was received
                    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                    // http.ClientRequest in node.js
                    DEBUG&&console.log(error.request);
                } else {
                    // Something happened in setting up the request that triggered an Error
                    DEBUG&&console.log('Error', error.message);
                }
                replace_par(`The transaction process failed`)
                //notify(`The transaction process failed`)
                DEBUG&&console.log("The transaction process failed")

            })
        }catch(err){
            replace_par(`Error with Axios`)
            console.log('Error with Axios',err)
        };

    }

    setTimeout(() => {
        addButton();
    }, 2000);
})();

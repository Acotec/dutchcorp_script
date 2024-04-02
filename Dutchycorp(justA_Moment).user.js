(function() {
    'use strict';
    if(/just a moment/ig.test(window.document.title)&&
       /extend_claim_count_wall_nu_link_per_click_version/ig.test(window.location.href)
      )
    {
        setInterval(()=>{
            window.location = window.location.href.replace('https',"http")
        },3000)
    }
})();

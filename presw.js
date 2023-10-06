(function(){
var nojs = document.getElementById("nojs-cover");
if(nojs){
    nojs.style.display = "none";
}

// If we include swhandler.js, this app uses service workers.
if(typeof wait_for_svc_worker_setup === "function") {
    // If zzzz is in URL, delete and skip service worker.
    if(typeof window.location.href === "string" && window.location.href.indexOf("zzzz") !== -1) {
        delete_old_service_workers();
    } else {
        wait_for_svc_worker_setup(0).then(function(rsVal){
        });
    }
} else {
    // No service worker mode
}
})();
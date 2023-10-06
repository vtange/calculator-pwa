
function delete_old_service_workers() {
    navigator.serviceWorker.getRegistrations().then(function(registrations) {
        var num = 0;
        for(var i = 0; i < registrations.length; i++) {
            if(registrations[i].active && registrations[i].active.scriptURL.indexOf(window.location.hostname) !== -1) {
                num++;
                registrations[i].unregister();
                console.log("[SWHandler] Unregistering service worker for url, "+registrations[i].active.scriptURL);
            }
        }
        if (num > 0) {
            console.log("[SWHandler] You might need to refresh again for network-first assets.");
        }
    });
}
function wait_for_svc_worker_setup() {
    return new Promise(function(rs,rj){
        if (!navigator.serviceWorker) {
            rs("[SWHandler] navigator.serviceWorker doesn't exist.");
        }
        navigator.serviceWorker.register('./sw.js')
        .then(function(reg) {
            console.log('[SWHandler] registration succeeded.');
            /* navigator.serviceWorker.ready returns a Promise that will never reject,
            and which waits indefinitely until the ServiceWorkerRegistration associated
            with the current page has an ServiceWorkerRegistration.active worker. */
            if(navigator.serviceWorker.ready && typeof navigator.serviceWorker.ready.then == "function")
            {
                navigator.serviceWorker.ready.then(function(oServiceWorkerRegistration){
                    function wait_for_sw_activated_state(iRetryCount){
                        if(oServiceWorkerRegistration.active.state === "activated") {
                            rs("[SWHandler] reached 'activated' state.");
                        }
                        else if(iRetryCount < 100) {
                            console.log("[SWHandler] waiting for 'activated' state...");
                            window.setTimeout(function(){
                                wait_for_sw_activated_state(iRetryCount+1);
                            },500);
                        } else {
                            rs("[SWHandler] state not 'activated' after 100+ retries.");
                        }
                    }
                    wait_for_sw_activated_state(0);
                });
            } else {
                rs("[SWHandler] navigator.serviceWorker.ready doesn't exist.");
            }
        }).catch(function(error) {
            rs('[SWHandler] registration failed with ' + error);
        });
    });
}
importScripts("hashes.js");
// Service worker is a simulated edge server. It caches files fetched online for offline use.
function log(str) {
    console.log(str);
}
if(!hashes) {
    log('[SvcWrker] NO HASHES');
    return;
}
var cacheFiles = [
    './index.html',
    './' + hashes["vendors~main"]["js"],
    './' + hashes["vendors~main"]["js2"],
    './' + hashes["main"]["js"], //<-- Chrome update on reload can break this, uncheck it and unregister if issue reloading
];
var cssPath = hashes["main"]["css"];
//CSS can be missing from hashes.js if we're in dev/inject_mode.
if(cssPath)
{
    cacheFiles.push('./'+cssPath);
}
var cacheName = hashes["vendors~main"]["js"]+hashes["vendors~main"]["js2"]+hashes["main"]["js"]+hashes["main"]["css"];

// Install event
self.addEventListener('install', function(event) {
    log('[SvcWrker] INSTALL');
    event.waitUntil(
        caches.open(cacheName)
        .then(function(cache){
            return cache.addAll(cacheFiles).then(function(){
                log("[SvcWrker] INSTALL---> COMPLETE");
            }).catch(function(err){
                throw err;
            });;
        })
        .catch(function(err){
            throw err;
        })
    )
});

// Activate event
self.addEventListener('activate', function(event) {
    log('[SvcWrker] ACTIVATE');
    event.waitUntil(
        caches.keys()
        .then(function(cacheNames){
            return Promise.all(cacheNames.map(function(existingCacheName){
                if(existingCacheName !== cacheName){
                    log('[SvcWrker] CLEAR_OLD_CACHENAME:', existingCacheName);
                    return caches.delete(existingCacheName);
                }
            }))
        })
        .catch(function(err){
            throw err;
        })
    )
});

// Push event (for mobile push messages)
self.addEventListener('push', function(event) {
    if (!(self.Notification && self.Notification.permission === "granted")) {
        log('[SvcWrker] PUSH_MSG, no permission');
        return;
    } else if (!event.data) {
        log('[SvcWrker] PUSH_MSG, no data');
        return;
    }
    const data = event.data.json() || {};
    const title = data.title || "Test Push Notification Title";
    const message =
      data.message || "Test Push Notification Message.";
    /*const notification = */new self.Notification(title, {
      body: message,
    //   tag: "simple-push-demo-notification",
    //   icon: "images/new-notification.png",
    });
    // notification.addEventListener("click", () => {
    //     clients.openWindow(
    //       "https://example.blog.com/2015/03/04/something-new.html",
    //     );
    //   });
});

// Fetch event
self.addEventListener('fetch', function(event) {
    log("[SvcWrker] FETCH:", event.request.url);
    event.respondWith(
        caches.match(event.request)
        .then(function(response){
            if(response) {
                log("[SvcWrker] FETCH->CACHE_RESPONSE", url);
            } else {
                log("[SvcWrker] FETCH->NO_CACHE_FOUND", url);
            }
            return response || fetch(event.request).then(function(response){
                if(response) {
                    log("[SvcWrker] FETCH->LIVEFETCH_RESPONSE", url);
                } else {
                    log("[SvcWrker] FETCH->NO_LIVEFETCH_RESPONSE", url);
                }
                return response;
            }).catch(function(err){
                //error fetching file
                throw err;
            });
        })
    );
});

var CACHE='yts-5c59b0ac',FILES=['./','index.html','manifest.json','icons/icon-192.png','icons/icon-512.png','icons/apple-touch-icon.png','assets/smg_logo.png','assets/bgm.m4a','assets/bgm.mp3','assets/win.m4a','assets/win.mp3'];
self.addEventListener('install',function(e){self.skipWaiting();e.waitUntil(caches.open(CACHE).then(function(c){return Promise.all(FILES.map(function(f){return c.add(new Request(f,{cache:'reload'})).catch(function(){})}))}))});
self.addEventListener('activate',function(e){e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.filter(function(k){return k.indexOf('yts-')==0&&k!==CACHE}).map(function(k){return caches.delete(k)}))}).then(function(){return self.clients.claim()}))});
self.addEventListener('fetch',function(e){var r=e.request;if(r.method!=='GET'||new URL(r.url).origin!==location.origin)return;
 e.respondWith(caches.match(r,{ignoreSearch:true}).then(function(m){if(m)return m;
  return fetch(r).then(function(res){if(res&&res.ok){var cp=res.clone();caches.open(CACHE).then(function(c){c.put(r,cp)})}return res}).catch(function(){return r.mode==='navigate'?caches.match('index.html'):Response.error()})}))});

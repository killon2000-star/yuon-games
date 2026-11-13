// 오프라인 PWA: 첫 방문 때 전부 캐시, 이후 cache-first (index.html 이 바뀌면 캐시 이름이 바뀜)
var CACHE='mm-7d06b966',FILES=["./","index.html","manifest.json","icons/icon-192.png","icons/icon-512.png","icons/apple-touch-icon.png","music/title.m4a","music/title.mp3","music/bgm.m4a","music/bgm.mp3","music/clear.m4a","music/clear.mp3","music/stuck.m4a","music/stuck.mp3"];
self.addEventListener('install',function(e){self.skipWaiting();e.waitUntil(caches.open(CACHE).then(function(c){return Promise.all(FILES.map(function(f){return c.add(new Request(f,{cache:'reload'})).catch(function(){})}))}))});
self.addEventListener('activate',function(e){e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.filter(function(k){return k.indexOf('mm-')==0&&k!==CACHE}).map(function(k){return caches.delete(k)}))}).then(function(){return self.clients.claim()}))});
self.addEventListener('fetch',function(e){var r=e.request;if(r.method!=='GET')return;
 e.respondWith(caches.match(r,{ignoreSearch:true}).then(function(m){if(m)return m;
  return fetch(r).then(function(res){if(res&&res.ok&&new URL(r.url).origin===location.origin){var cp=res.clone();caches.open(CACHE).then(function(c){c.put(r,cp)})}return res}).catch(function(){return r.mode==='navigate'?caches.match('index.html'):Response.error()})}))});

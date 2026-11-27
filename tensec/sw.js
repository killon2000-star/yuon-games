var CACHE='yts-5fdd0834',FILES=['./','index.html','manifest.json','icons/icon-192.png','icons/icon-512.png','icons/apple-touch-icon.png','assets/smg_logo.png','assets/bgm.m4a','assets/bgm.mp3','assets/win.m4a','assets/win.mp3'];
function isIndexReq(r){
  if(r.mode==='navigate')return true;
  var u=new URL(r.url),p=u.pathname;
  if(/index\.html$/i.test(p)||/\/$/.test(p))return true;
  var dest=r.destination;return dest==='document';
}
self.addEventListener('install',function(e){
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(function(c){
    return Promise.all(FILES.map(function(f){return c.add(new Request(f,{cache:'reload'})).catch(function(){})}));
  }));
});
self.addEventListener('activate',function(e){
  e.waitUntil(caches.keys().then(function(ks){
    return Promise.all(ks.filter(function(k){return k.indexOf('yts-')==0&&k!==CACHE}).map(function(k){return caches.delete(k)}));
  }).then(function(){return self.clients.claim()}));
});
self.addEventListener('fetch',function(e){
  var r=e.request;
  if(r.method!=='GET'||new URL(r.url).origin!==location.origin)return;
  if(isIndexReq(r)){
    e.respondWith(fetch(new Request(r,{cache:'reload'})).then(function(res){
      if(res&&res.ok){var cp=res.clone();caches.open(CACHE).then(function(c){c.put('index.html',cp);try{c.put(r,res.clone())}catch(err){}})}
      return res;
    }).catch(function(){
      return caches.match(r,{ignoreSearch:true}).then(function(m){return m||caches.match('index.html')||caches.match('./')});
    }));
    return;
  }
  e.respondWith(caches.match(r,{ignoreSearch:true}).then(function(m){
    if(m)return m;
    return fetch(r).then(function(res){
      if(res&&res.ok){var cp=res.clone();caches.open(CACHE).then(function(c){c.put(r,cp)})}
      return res;
    }).catch(function(){return Response.error()});
  }));
});

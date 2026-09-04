const CACHE='minimarket-pedidos-dark-v6-20260904';
const ASSETS=['./?app=v6','./index.html','./manifest.json','./icon-192.png','./icon-512.png'];

self.addEventListener('install',e=>{
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));
});

self.addEventListener('activate',e=>{
  e.waitUntil(
    caches.keys()
      .then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))
      .then(()=>self.clients.claim())
  );
});

self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET') return;
  if(e.request.mode==='navigate'){
    e.respondWith(
      fetch(e.request,{cache:'no-store'})
        .then(r=>{
          const c=r.clone();
          caches.open(CACHE).then(cache=>cache.put('./index.html',c));
          return r;
        })
        .catch(()=>caches.match('./index.html'))
    );
    return;
  }
  e.respondWith(
    fetch(e.request,{cache:'no-store'})
      .then(r=>{
        if(r && r.ok){const c=r.clone();caches.open(CACHE).then(cache=>cache.put(e.request,c))}
        return r;
      })
      .catch(()=>caches.match(e.request))
  );
});

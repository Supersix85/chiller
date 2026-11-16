// Per forzare l'aggiornamento dopo una modifica: cambia il numero di versione qui sotto.
const V='diagnosi-chiller-v3';
const FILES=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
// Rete per prima (max 3 s), cache come ripiego: online è sempre aggiornata, offline funziona.
const net=req=>new Promise((ok,ko)=>{const t=setTimeout(ko,3000);fetch(req,{cache:'no-cache'}).then(r=>{clearTimeout(t);ok(r)},e=>{clearTimeout(t);ko(e)})});
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(FILES.map(u=>new Request(u,{cache:'reload'})))).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const q=e.request;if(q.method!=='GET'||new URL(q.url).origin!==location.origin)return;
e.respondWith(net(q).then(r=>{if(r.ok){const c=r.clone();caches.open(V).then(x=>x.put(q,c))}return r}).catch(()=>caches.match(q,{ignoreSearch:true})))});

/* Pooled juice: particles, camera shake, hit-stop, time scale. No per-round allocations after warmup. */
(function(G){
'use strict';
var N=96, pool=[], live=[], shake=0, shakeMag=0, freezeUntil=0, tScale=1, scaleUntil=0, camX=0, camY=0, i, p;
for(i=0;i<N;i++) pool.push({on:false,x:0,y:0,vx:0,vy:0,life:0,max:0,s:1,rot:0,vr:0,k:'gummy',g:1});
function capDpr(){
  var raw=window.devicePixelRatio||1;
  if((G.EG&&G.EG.LOW) || (typeof document!=='undefined'&&document.body&&document.body.classList.contains('low'))) return 1;
  var w=Math.max(window.innerWidth||0, window.innerHeight||0);
  if(w>=1500) return Math.min(1.5, raw);
  return Math.min(2, raw);
}
function grab(){
  var b=pool[0],j;
  for(j=0;j<N;j++) if(!pool[j].on){b=pool[j];break;}
  if(b.on){ /* steal oldest */ b=live.length?live[0]:b; }
  b.on=true; return b;
}
function emit(n,setup){
  var k,b;
  n=Math.min(n,24);
  for(k=0;k<n;k++){ b=grab(); setup(b,k); if(live.indexOf(b)<0) live.push(b); }
}
function burstAt(x,y,kind){
  var n=kind==='gold'?18:kind==='soft'?8:12;
  var ks=['gummy','gummy-yel','gummy-grn','candy','lolly','chew'];
  emit(n,function(b,i){
    var a=(-Math.PI/2)+(i-(n-1)/2)*0.18+(Math.random()-0.5)*0.2;
    var sp=2.2+Math.random()*3.4;
    b.x=x; b.y=y; b.vx=Math.cos(a)*sp; b.vy=Math.sin(a)*sp-1.2;
    b.life=0; b.max=420+Math.random()*280; b.s=0.45+Math.random()*0.55;
    b.rot=Math.random()*6; b.vr=(Math.random()-0.5)*0.25; b.k=ks[i%ks.length]; b.g=1;
  });
}
function confetti(kind){
  var n=kind==='gold'?28:kind==='soft'?10:18, ks=['gummy','gummy-yel','candy','lolly','chew'];
  var w=window.innerWidth||800, safe=100;
  emit(n,function(b,i){
    b.x=w*(0.18+Math.random()*0.64); b.y=safe+20+Math.random()*40;
    b.vx=(Math.random()-0.5)*3; b.vy=1.4+Math.random()*3.2;
    b.life=0; b.max=900+Math.random()*500; b.s=0.5+Math.random()*0.7;
    b.rot=Math.random()*6; b.vr=(Math.random()-0.5)*0.28; b.k=ks[i%ks.length]; b.g=1;
  });
}
function tick(dt){
  if(dt>40)dt=40;
  var now=performance.now();
  if(now>=scaleUntil) tScale=1;
  if(shake>0){
    shake=Math.max(0,shake-dt*0.012);
    var m=shakeMag*shake;
    camX=(Math.random()-0.5)*m; camY=(Math.random()-0.5)*m;
  } else {camX=0;camY=0;}
  var j=0,b;
  for(i=0;i<live.length;i++){
    b=live[i];
    b.life+=dt; b.x+=b.vx*(dt/16.67); b.y+=b.vy*(dt/16.67); b.vy+=0.16*(dt/16.67); b.rot+=b.vr*(dt/16.67);
    b.g=1-b.life/b.max;
    if(b.life>=b.max||b.g<=0){ b.on=false; continue; }
    live[j++]=b;
  }
  live.length=j;
}
function draw(c, D){
  if(!live.length||!D||!D.drawSnack)return;
  var b;
  for(i=0;i<live.length;i++){
    b=live[i]; c.save(); c.globalAlpha=Math.max(0,b.g); D.drawSnack(c,b.k,b.x,b.y,b.s,b.rot); c.restore();
  }
}
function applyCam(c){ if(camX||camY) c.translate(camX,camY); }
function hitstop(ms){ freezeUntil=Math.max(freezeUntil, performance.now()+(ms||60)); }
function frozen(){ return performance.now()<freezeUntil; }
function slowmo(scale,ms){ tScale=scale||0.45; scaleUntil=performance.now()+(ms||220); }
function timeScale(){ return (performance.now()<freezeUntil)?0:tScale; }
function punch(mag,ms){ shake=1; shakeMag=mag||7; if(ms) hitstop(ms); }
function reset(){
  for(i=0;i<N;i++) pool[i].on=false;
  live.length=0; shake=0; shakeMag=0; freezeUntil=0; tScale=1; scaleUntil=0; camX=0; camY=0;
}
G.EGFx={capDpr:capDpr,burstAt:burstAt,confetti:confetti,tick:tick,draw:draw,applyCam:applyCam,
  hitstop:hitstop,frozen:frozen,slowmo:slowmo,timeScale:timeScale,punch:punch,reset:reset,
  liveCount:function(){return live.length}, poolSize:N};
})(typeof window!=='undefined'?window:globalThis);

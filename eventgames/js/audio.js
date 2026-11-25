/* BGM: official kuji/bubble Suno tracks. Synth only for ticks / fail. */
(function(G){
'use strict';
var AC=null, bgm=null, jingle=null, curUrl='', duck=1, wantId='launcher', lastUnlockMs=-1, ready={};
var BGM_MAP={launcher:'bubble',center:'kuji',target:'bubble',stack:'kuji',timing:'bubble',weight:'kuji',jump:'bubble',crane:'kuji'};
function base(){return (G.EG_BASE||'./');}
function audioCtx(){
  if(!AC){try{AC=new(window.AudioContext||window.webkitAudioContext)()}catch(e){}}
  if(AC&&AC.state==='suspended'){try{AC.resume()}catch(e){}}
  return AC;
}
function enabled(){return !G.EG||!G.EG.cfg?true:G.EG.cfg.music!==false;}
function sfxOn(){return !G.EG||!G.EG.cfg?true:G.EG.cfg.sfx!==false;}
function vol(){var v=G.EG&&G.EG.cfg?Number(G.EG.cfg.vol):NaN;return isFinite(v)?Math.max(0,Math.min(1,v)):0.7;}
function defaultBgm(id){return base()+'assets/bgm_'+(BGM_MAP[id]||'bubble')+'.mp3';}
function markSession(){try{sessionStorage.setItem('eg_audio_ok','1')}catch(e){}}
function sessionOk(){try{return sessionStorage.getItem('eg_audio_ok')==='1'}catch(e){return false}}
function isWebView(){return !!(window.Android);}

function preload(url){
  if(!url) return;
  if(ready[url]) return ready[url];
  var a=new Audio();
  a.preload='auto'; a.loop=true;
  ready[url]=a;
  try{a.src=url; a.load();}catch(e){}
  return a;
}
function warmup(){
  preload(base()+'assets/bgm_kuji.mp3');
  preload(base()+'assets/bgm_bubble.mp3');
  var sfx=preload(base()+'assets/sfx_clear.mp3');
  if(sfx) sfx.loop=false;
}
function attachPlay(a,url,t0){
  if(!a||!enabled())return;
  if(bgm&&bgm!==a){try{bgm.pause()}catch(e){}}
  bgm=a; curUrl=url; a.loop=true; a.volume=vol()*0.55*duck;
  var start=function(){
    if(t0>=0) lastUnlockMs=performance.now()-t0;
  };
  if(!a.paused&&!a.ended&&a.currentTime>0){start();return;}
  var p=a.play();
  if(p&&p.then) p.then(start).catch(function(){});
  else a.addEventListener('playing',start,{once:true});
}
function playBgm(gameId){
  if(gameId) wantId=gameId;
  if(!enabled()){stopBgm();return;}
  audioCtx();
  var url=defaultBgm(wantId);
  var a=ready[url]||preload(url);
  if(a && a.readyState>=2){attachPlay(a,url,-1);return;}
  if(a){
    var once=function(){ if(wantId && defaultBgm(wantId)===url) attachPlay(a,url,-1); };
    a.addEventListener('canplaythrough',once,{once:true});
    a.addEventListener('loadeddata',once,{once:true});
    // if already cached by HTTP, try immediately
    try{if(a.readyState>=2) attachPlay(a,url,-1);}catch(e){}
  }
}
function stopBgm(){
  if(bgm){try{bgm.pause();}catch(e){}}
  // keep element in cache; just detach current
  bgm=null; curUrl='';
}
function setDuck(on){
  duck=on?0.28:1;
  if(bgm) bgm.volume=vol()*0.55*duck;
}
function playClear(){
  if(!sfxOn()||!enabled())return;
  setDuck(true);
  try{
    var url=base()+'assets/sfx_clear.mp3';
    jingle=ready[url]||preload(url);
    if(jingle) jingle.loop=false;
    jingle.pause(); try{jingle.currentTime=0}catch(e){}
    jingle.volume=Math.min(1,vol()*0.9);
    var p=jingle.play(); if(p&&p.catch)p.catch(function(){});
    jingle.onended=function(){setDuck(false);};
    setTimeout(function(){if(jingle&&jingle.paused)setDuck(false);},5000);
  }catch(e){setDuck(false);}
}
function tone(freq,dur,type,gain,at){
  if(!sfxOn())return;
  var a=audioCtx(); if(!a)return;
  var o=a.createOscillator(),g=a.createGain(),tm=a.currentTime+(at||0);
  o.type=type||'sine'; o.frequency.value=freq;
  g.gain.setValueAtTime(0.0001,tm);
  g.gain.exponentialRampToValueAtTime(gain||0.1,tm+0.015);
  g.gain.exponentialRampToValueAtTime(0.0001,tm+dur);
  o.connect(g);g.connect(a.destination);o.start(tm);o.stop(tm+dur+0.02);
  o.onended=function(){try{o.disconnect();g.disconnect()}catch(e){}};
}
function sfxGrade(idx){
  if(idx===0){tone(784,0.08,'triangle',0.07);tone(1046,0.12,'triangle',0.08,0.07);tone(1318,0.18,'triangle',0.07,0.15);playClear();return;}
  if(idx===1){tone(659,0.10,'triangle',0.07);tone(880,0.14,'triangle',0.07,0.08);return;}
  if(idx===2){tone(587,0.10,'triangle',0.06);tone(740,0.12,'triangle',0.06,0.08);return;}
  if(idx===3){tone(523,0.10,'triangle',0.06);return;}
  sfxFail();
}
function sfxStart(){tone(523,0.09,'triangle',0.08);tone(784,0.12,'triangle',0.07,0.07);}
function sfxTap(){tone(660,0.05,'square',0.05);}
function sfxTick(){tone(880,0.03,'square',0.03);}
function sfxFail(){tone(247,0.14,'sine',0.06);tone(196,0.22,'sine',0.05,0.12);}
function sfxWin(idx){sfxGrade(idx);}
function unlock(){
  var t0=performance.now();
  audioCtx();
  markSession();
  if(enabled()){
    var url=defaultBgm(wantId);
    var a=ready[url]||preload(url);
    attachPlay(a,url,t0);
  }
}
function resumeIfNeeded(){
  audioCtx();
  if(enabled()){
    if(bgm&&bgm.paused){var p=bgm.play();if(p&&p.catch)p.catch(function(){});}
    else if(!bgm) playBgm(wantId);
  }
}
function setVol(){if(bgm)bgm.volume=vol()*0.55*duck; if(jingle)jingle.volume=Math.min(1,vol()*0.9);}
function isOn(){return enabled();}
function bootAuto(){
  warmup();
}

document.addEventListener('visibilitychange',function(){
  if(!document.hidden) resumeIfNeeded();
  else if(AC&&AC.state==='running'){try{AC.suspend()}catch(e){}}
});
window.addEventListener('pageshow',function(){resumeIfNeeded()});
window.addEventListener('focus',function(){resumeIfNeeded()});

bootAuto();

G.EGAudio={playBgm:playBgm,stopBgm:stopBgm,setDuck:setDuck,playClear:playClear,tone:tone,
  sfxStart:sfxStart,sfxTap:sfxTap,sfxTick:sfxTick,sfxFail:sfxFail,sfxWin:sfxWin,sfxGrade:sfxGrade,unlock:unlock,setVol:setVol,isOn:isOn,audioCtx:audioCtx,
  warmup:warmup,resumeIfNeeded:resumeIfNeeded,lastUnlockMs:function(){return lastUnlockMs},
  isPlaying:function(){return !!(bgm&&!bgm.paused)}, readyState:function(){var u=defaultBgm(wantId),a=ready[u];return a?a.readyState:0}};
})(typeof window!=='undefined'?window:globalThis);

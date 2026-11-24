/* BGM: official kuji/bubble Suno tracks. Synth only for ticks / fail. */
(function(G){
'use strict';
var AC=null, bgm=null, jingle=null, curUrl='', duck=1;
function base(){return (G.EG_BASE||'./');}
function audioCtx(){
  if(!AC){try{AC=new(window.AudioContext||window.webkitAudioContext)()}catch(e){}}
  if(AC&&AC.state==='suspended')AC.resume();
  return AC;
}
function enabled(){return !G.EG||!G.EG.cfg?true:G.EG.cfg.music!==false;}
function sfxOn(){return !G.EG||!G.EG.cfg?true:G.EG.cfg.sfx!==false;}
function vol(){var v=G.EG&&G.EG.cfg?Number(G.EG.cfg.vol):0.7;return isFinite(v)?Math.max(0,Math.min(1,v)):0.7;}

var BGM_MAP={launcher:'bubble',center:'kuji',target:'bubble',stack:'kuji',timing:'bubble'};
function defaultBgm(id){return base()+'assets/bgm_'+(BGM_MAP[id]||'bubble')+'.mp3';}
function tryUrl(url,ok,fail){
  var a=new Audio(); a.preload='auto';
  var done=false;
  a.oncanplaythrough=a.onloadeddata=function(){if(done)return;done=true;ok(a);};
  a.onerror=function(){if(done)return;done=true;fail&&fail();};
  a.src=url; a.load();
  setTimeout(function(){if(!done&&a.readyState>=2){done=true;ok(a);}},1200);
}
function playBgm(gameId){
  if(!enabled()){stopBgm();return;}
  audioCtx();
  var custom=base()+'assets/bgm_'+gameId+'.mp3';
  var fallback=defaultBgm(gameId);
  var want=custom;
  function attach(a,url){
    if(bgm&&curUrl===url){bgm.volume=vol()*0.55*duck; if(bgm.paused){var p=bgm.play();if(p&&p.catch)p.catch(function(){});} return;}
    stopBgm();
    bgm=a; curUrl=url; a.loop=true; a.volume=vol()*0.55*duck;
    var p=a.play(); if(p&&p.catch)p.catch(function(){});
  }
  // Prefer a dropped per-game file; fall back to kuji/bubble tracks.
  tryUrl(custom,function(a){attach(a,custom);},function(){
    if(want===fallback)return;
    tryUrl(fallback,function(a){attach(a,fallback);});
  });
}
function stopBgm(){
  if(bgm){try{bgm.pause();}catch(e){} bgm=null; curUrl='';}
}
function setDuck(on){
  duck=on?0.28:1;
  if(bgm) bgm.volume=vol()*0.55*duck;
}
function playClear(){
  if(!sfxOn()||!enabled())return;
  setDuck(true);
  try{
    if(!jingle){jingle=new Audio(base()+'assets/sfx_clear.mp3');jingle.preload='auto';}
    jingle.pause(); jingle.currentTime=0; jingle.volume=Math.min(1,vol()*0.9);
    var p=jingle.play(); if(p&&p.catch)p.catch(function(){});
    jingle.onended=function(){setDuck(false);};
    setTimeout(function(){if(jingle&&jingle.paused)setDuck(false);},5000);
  }catch(e){setDuck(false);}
}
function tone(freq,dur,type,gain,at){
  if(!sfxOn())return;
  var a=audioCtx(); if(!a)return;
  var o=a.createOscillator(),g=a.createGain(),t=a.currentTime+(at||0);
  o.type=type||'sine'; o.frequency.value=freq;
  g.gain.setValueAtTime(0.0001,t);
  g.gain.exponentialRampToValueAtTime(gain||0.1,t+0.015);
  g.gain.exponentialRampToValueAtTime(0.0001,t+dur);
  o.connect(g);g.connect(a.destination);o.start(t);o.stop(t+dur+0.02);
}
function sfxStart(){tone(523,0.09,'triangle',0.08);tone(784,0.12,'triangle',0.07,0.07);}
function sfxTap(){tone(660,0.05,'square',0.05);}
function sfxTick(){tone(880,0.03,'square',0.03);}
function sfxFail(){tone(247,0.14,'sine',0.06);tone(196,0.22,'sine',0.05,0.12);}
function sfxWin(idx){
  if(idx===0){playClear();tone(1046,0.16,'triangle',0.07,0.02);return;}
  if(idx>0&&idx<=3){playClear();return;}
  sfxFail();
}
function unlock(){audioCtx(); if(bgm&&bgm.paused&&enabled()){var p=bgm.play();if(p&&p.catch)p.catch(function(){});}}
function setVol(){if(bgm)bgm.volume=vol()*0.55*duck; if(jingle)jingle.volume=Math.min(1,vol()*0.9);}
function isOn(){return enabled();}

G.EGAudio={playBgm:playBgm,stopBgm:stopBgm,setDuck:setDuck,playClear:playClear,tone:tone,
  sfxStart:sfxStart,sfxTap:sfxTap,sfxTick:sfxTick,sfxFail:sfxFail,sfxWin:sfxWin,unlock:unlock,setVol:setVol,isOn:isOn,audioCtx:audioCtx};
})(typeof window!=='undefined'?window:globalThis);

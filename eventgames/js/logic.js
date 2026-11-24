/* Event minigames — pure logic (node + browser). No DOM. */
(function(G){
'use strict';
var GAMES=['center','target','stack','timing'];
var PRIZE_NAMES=['하리보 젤리 큰 봉지','하리보 젤리','캔디 3개','캔디 1개','마이쮸 1개'];
var TIER_KO=['1등','2등','3등','4등','참가상'];

function defaultLimits(){
  return{
    // tuned later by tools/sim.js — lower error is better
    center:[0.0025,0.012,0.048,0.100],   // |pos-0.5|
    target:[0.10,0.22,0.40,0.70],       // hit distance / target radius
    stack:[0.21,0.55,1.10,1.80],        // composite error
    timing:[188,228,275,345]            // reaction ms (false-start → 참가상)
  };
}
function defaultCfg(){
  var lim=defaultLimits(), games={};
  GAMES.forEach(function(id){
    games[id]={limits:lim[id].slice(), stock:[null,null,null,null,null]};
  });
  return{
    pin:'0000', staffReset:true, fsOnStart:true, sfx:true, vib:true, music:true, vol:0.7, lang:'',
    sharedStock:false,
    prizes:PRIZE_NAMES.map(function(n){return{name:n,stock:null};}),
    games:games
  };
}
function toMs(v){return Math.round(Number(v)*1000)}
function inStock(p){if(!p)return false;if(p.stock==null||p.stock==='')return true;var n=Number(p.stock);return !isFinite(n)||n>0}
function pickTierIndex(err,limits){
  for(var i=0;i<(limits||[]).length;i++){
    var m=limits[i];
    if(m==null||!isFinite(Number(m))||Number(err)<=Number(m))return i;
  }
  return 4;
}
function prizeList(cfg,gameId){
  var names=(cfg.prizes||[]), out=[], g=(cfg.games&&cfg.games[gameId])||{};
  for(var i=0;i<5;i++){
    var n=(names[i]&&names[i].name)||PRIZE_NAMES[i];
    var stock;
    if(cfg.sharedStock) stock=names[i]?names[i].stock:null;
    else stock=g.stock?g.stock[i]:null;
    out.push({name:n,stock:stock});
  }
  return out;
}
function awardPrize(gameId,err,cfg,opt){
  opt=opt||{};
  var prizes=prizeList(cfg,gameId);
  var limits=((cfg.games&&cfg.games[gameId])||{}).limits||defaultLimits()[gameId];
  var want=opt.falseStart?4:pickTierIndex(err,limits);
  var i=want;
  while(i<prizes.length){
    if(inStock(prizes[i]))return{index:i,prize:prizes[i],err:err,fallen:i!==want,soldOut:false,falseStart:!!opt.falseStart,game:gameId};
    i++;
  }
  return{index:-1,prize:{name:'상품 소진',stock:0},err:err,fallen:true,soldOut:true,falseStart:!!opt.falseStart,game:gameId};
}
function applyAward(gameId,err,cfg,log,opt){
  var a=awardPrize(gameId,err,cfg,opt);
  if(!a.soldOut&&a.prize&&a.prize.stock!=null&&a.prize.stock!==''&&isFinite(Number(a.prize.stock))){
    a.prize.stock=Number(a.prize.stock)-1;if(a.prize.stock<0)a.prize.stock=0;
    if(cfg.sharedStock){if(cfg.prizes[a.index])cfg.prizes[a.index].stock=a.prize.stock;}
    else if(cfg.games[gameId]){cfg.games[gameId].stock=cfg.games[gameId].stock||[null,null,null,null,null];cfg.games[gameId].stock[a.index]=a.prize.stock;}
  }
  log.push({game:gameId,err:a.err,index:a.index,prize:a.prize.name,fallen:!!a.fallen,soldOut:!!a.soldOut,falseStart:!!a.falseStart,at:Date.now()});
  if(log.length>800)log.splice(0,log.length-800);
  return a;
}
function mergeCfg(raw){
  var d=defaultCfg();if(!raw||typeof raw!=='object')return d;
  if(typeof raw.pin==='string'&&/^\d{4}$/.test(raw.pin))d.pin=raw.pin;
  d.staffReset=raw.staffReset!==false;
  d.fsOnStart=raw.fsOnStart!==false;
  d.sfx=raw.sfx!==false;d.vib=raw.vib!==false;d.music=raw.music!==false;
  var v=Number(raw.vol);if(isFinite(v))d.vol=Math.max(0,Math.min(1,v));
  if(raw.lang&&['ko','en','id'].indexOf(raw.lang)>=0)d.lang=raw.lang;
  d.sharedStock=!!raw.sharedStock;
  if(Array.isArray(raw.prizes)&&raw.prizes.length>=5){
    for(var i=0;i<5;i++){
      var p=raw.prizes[i]||{};
      if(typeof p.name==='string'&&p.name.trim())d.prizes[i].name=p.name.trim().slice(0,40);
      if(p.stock==null||p.stock==='')d.prizes[i].stock=null;
      else{var s=Number(p.stock);d.prizes[i].stock=isFinite(s)&&s>=0?Math.floor(s):null}
    }
  }
  GAMES.forEach(function(id){
    var src=(raw.games&&raw.games[id])||{};
    var lim=src.limits||src.maxErr||d.games[id].limits;
    if(Array.isArray(lim)&&lim.length>=4){
      for(var k=0;k<4;k++){var m=Number(lim[k]);if(isFinite(m)&&m>=0)d.games[id].limits[k]=m;}
    }
    if(Array.isArray(src.stock)&&src.stock.length>=5){
      for(var j=0;j<5;j++){
        if(src.stock[j]==null||src.stock[j]==='')d.games[id].stock[j]=null;
        else{var s2=Number(src.stock[j]);d.games[id].stock[j]=isFinite(s2)&&s2>=0?Math.floor(s2):null}
      }
    }
  });
  return d;
}

/* ===== center: ping-pong marker, pos in [0,1], center=0.5 ===== */
function centerSpeed(t){return Math.min(1.95, 1.12 + t*0.12);}
function centerDist(t){return 1.12*t + 0.06*t*t;} // ∫(0.78+0.085 t)dt
function centerPos(t){
  var dist=centerDist(t), cycle=dist%2;
  return cycle<=1?cycle:2-cycle;
}
function centerError(t){return Math.abs(centerPos(t)-0.5);}

/* ===== target: sliding/bobbing target, one throw with lead ===== */
function targetState(t,seed){
  seed=seed||0;
  var w=1.55+0.25*Math.sin(seed*1.7);
  var x=Math.sin(w*t + seed);
  var y=Math.sin(w*1.65*t + 1.2 + seed);
  var vx=w*Math.cos(w*t + seed);
  var vy=w*1.65*Math.cos(w*1.65*t + 1.2 + seed);
  return{x:x,y:y,vx:vx,vy:vy,w:w};
}
var TARGET_FLIGHT=0.40;
function targetHit(tThrow,aimLead,aimErrX,aimErrY,seed){
  // player leads by aimLead seconds (ideal = FLIGHT) plus aim error in target-space
  var now=targetState(tThrow,seed);
  var predX=now.x + now.vx*aimLead;
  var predY=now.y + now.vy*aimLead;
  var land=targetState(tThrow+TARGET_FLIGHT,seed);
  var dx=(predX+aimErrX)-land.x, dy=(predY+aimErrY)-land.y;
  // normalize: x amplitude ~1, y ~1, ring radius uses hypot / typical span
  var dist=Math.sqrt(dx*dx + dy*dy*0.85);
  // scale so 1.0 ≈ outer ring (~ target amplitude 1)
  return{dist:dist, land:land, predX:predX, predY:predY, tThrow:tThrow};
}

/* ===== stack: 7 sliding pastry/gummy blocks ===== */
var STACK_N=7;
function stackPieceSpeed(i,width){
  return (0.70 + i*0.13) / Math.max(0.35, width);
}
function stackDropError(offset,width,perfects,height){
  // offset is signed miss in the same units as width (full start width=1)
  if(width<=0.0001) return {miss:true,width:0,perfect:false,offset:offset};
  var ov=width-Math.abs(offset);
  if(ov<=0) return {miss:true,width:0,perfect:false,offset:offset};
  var perfect=Math.abs(offset)<=Math.max(0.018, 0.03*width);
  return{miss:false,width:ov,perfect:perfect,offset:offset};
}
function stackScore(drops){
  // drops: array of {miss,width,perfect}
  var height=0, width=1, perfects=0, missed=false;
  for(var i=0;i<drops.length;i++){
    if(drops[i].miss){missed=true;break;}
    height++; width=drops[i].width; if(drops[i].perfect)perfects++;
  }
  var err=(STACK_N-height)*0.85 + (1-width)*2.15 - perfects*0.07;
  if(err<0)err=0;
  return{height:height,width:width,perfects:perfects,missed:missed,err:err,n:STACK_N};
}

/* ===== timing: reaction ms, false start ===== */
function timingError(rtMs,falseStart){
  if(falseStart) return {err:9999,falseStart:true,rt:rtMs};
  return {err:Math.max(0,rtMs),falseStart:false,rt:rtMs};
}

/* ===== human-like sim helpers ===== */
function randn(rng){ // Box-Muller
  var u=1-rng(), v=1-rng();
  return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v);
}
function mixGauss(rng,parts){
  // parts: [{w,mu,sd}]
  var r=rng(), acc=0;
  for(var i=0;i<parts.length;i++){acc+=parts[i].w;if(r<=acc)return parts[i].mu+parts[i].sd*randn(rng);}
  var p=parts[parts.length-1];return p.mu+p.sd*randn(rng);
}

function simCenter(rng,n){
  var out=[];
  for(var i=0;i<n;i++){
    // most people tap on 1st or 2nd center crossing (t ≈ 0.64s, 1.9s, …)
    var pass=rng()<0.35?0:rng()<0.75?1:2;
    // time of k-th center: dist = 0.5 + k (because 0→0.5 is 0.5 units, then each next center is +1 unit)
    // invert dist = 0.78t + 0.0425 t^2 = D
    var D=0.5+pass;
    var a=0.06,b=1.12,c=-D;
    var t=(-b+Math.sqrt(b*b-4*a*c))/(2*a);
    var noise=mixGauss(rng,[
      {w:0.16,mu:0,sd:0.014},  // focused
      {w:0.54,mu:0.006,sd:0.038}, // casual
      {w:0.30,mu:0.012,sd:0.075}   // distracted
    ]);
    var tt=Math.max(0.12,t+noise);
    out.push({t:tt,err:centerError(tt)});
  }
  return out;
}
function simTarget(rng,n){
  var out=[];
  for(var i=0;i<n;i++){
    var seed=rng()*6.2, t=0.55+rng()*2.4;
    var leadBias=mixGauss(rng,[{w:0.25,mu:TARGET_FLIGHT,sd:0.04},{w:0.5,mu:TARGET_FLIGHT-0.02,sd:0.08},{w:0.25,mu:TARGET_FLIGHT-0.05,sd:0.12}]);
    var ex=mixGauss(rng,[{w:0.2,mu:0,sd:0.05},{w:0.55,mu:0,sd:0.14},{w:0.25,mu:0,sd:0.28}]);
    var ey=mixGauss(rng,[{w:0.2,mu:0,sd:0.05},{w:0.55,mu:0,sd:0.14},{w:0.25,mu:0,sd:0.28}]);
    out.push(targetHit(t,Math.max(0.05,leadBias),ex,ey,seed));
  }
  return out;
}
function simStack(rng,n){
  var out=[];
  for(var i=0;i<n;i++){
    var width=1, drops=[], skill=mixGauss(rng,[{w:0.2,mu:0.55,sd:0.12},{w:0.55,mu:0.0,sd:0.18},{w:0.25,mu:-0.35,sd:0.2}]);
    skill=Math.max(-0.8,Math.min(1.2,skill));
    for(var k=0;k<STACK_N;k++){
      var spd=stackPieceSpeed(k,width);
      // timing σ in seconds, convert to offset via speed (pos goes  -span..span)
      var sig= (0.072 + k*0.012 + (1-width)*0.06) * (1.20-0.32*skill);
      var off=randn(rng)*sig*spd*0.48;
      off -= skill*0.012;
      var d=stackDropError(off,width);
      drops.push(d);
      if(d.miss) break;
      width=d.width;
    }
    out.push(stackScore(drops));
  }
  return out;
}
function simTiming(rng,n){
  var out=[];
  for(var i=0;i<n;i++){
    var fs=rng()<0.08;
    if(fs){out.push(timingError(0,true));continue;}
    var rt=mixGauss(rng,[
      {w:0.12,mu:192,sd:14},
      {w:0.53,mu:255,sd:30},
      {w:0.35,mu:320,sd:50}
    ]);
    rt=Math.max(135,rt);
    out.push(timingError(rt,false));
  }
  return out;
}


function defaultHits(){var h={};GAMES.forEach(function(id){h[id]=0});return h;}
function mergeHits(raw){
  var d=defaultHits();if(!raw||typeof raw!=='object')return d;
  GAMES.forEach(function(id){var n=Number(raw[id]);if(isFinite(n)&&n>=0)d[id]=Math.floor(n);});
  return d;
}
function bumpExact(hits,gameId){
  if(!hits||GAMES.indexOf(gameId)<0)return 0;
  hits[gameId]=(hits[gameId]||0)+1;return hits[gameId];
}
function resetHits(hits){GAMES.forEach(function(id){hits[id]=0});return hits;}
function distro(errs,limits,falseStarts){
  var c=[0,0,0,0,0],N=errs.length;
  for(var i=0;i<N;i++){
    var idx=(falseStarts&&falseStarts[i])?4:pickTierIndex(errs[i],limits);
    c[idx]++;
  }
  return c.map(function(x){return Math.round(x/N*1000)/10;});
}

G.EGLogic={
  GAMES:GAMES, PRIZE_NAMES:PRIZE_NAMES, TIER_KO:TIER_KO, STACK_N:STACK_N, TARGET_FLIGHT:TARGET_FLIGHT,
  defaultCfg:defaultCfg, defaultLimits:defaultLimits, mergeCfg:mergeCfg,
  pickTierIndex:pickTierIndex, awardPrize:awardPrize, applyAward:applyAward, prizeList:prizeList, inStock:inStock,
  centerPos:centerPos, centerSpeed:centerSpeed, centerError:centerError, centerDist:centerDist,
  targetState:targetState, targetHit:targetHit,
  stackPieceSpeed:stackPieceSpeed, stackDropError:stackDropError, stackScore:stackScore,
  timingError:timingError,
  simCenter:simCenter, simTarget:simTarget, simStack:simStack, simTiming:simTiming, distro:distro, randn:randn,
  defaultHits:defaultHits, mergeHits:mergeHits, bumpExact:bumpExact, resetHits:resetHits
};
if(typeof module!=='undefined') module.exports=G.EGLogic;
})(typeof window!=='undefined'?window:globalThis);

/* Four short event games. Each exposes reset/start/tap/tick/draw/result. */
(function(G){
'use strict';
var L=G.EGLogic, D=G.EGDraw;
function Games(api){
  var cur=null, id=null, st=null;
  function sizePlay(cv){
    var d=Math.min(2, (G.EG&&G.EG.LOW)?1:(window.devicePixelRatio||1));
    var w=cv.clientWidth||innerWidth, h=cv.clientHeight||innerHeight;
    if(cv._w!==w||cv._h!==h||cv._d!==d){cv._w=w;cv._h=h;cv._d=d;cv.width=Math.round(w*d);cv.height=Math.round(h*d);}
    var c=cv.getContext('2d'); c.setTransform(d,0,0,d,0,0); return {c:c,w:w,h:h};
  }
  function capyScale(h,land){return (land?h*0.55:h*0.42)/110;}

  var impl={
    center:{
      start:function(){return {t0:performance.now(), stopped:false, pos:0.5, err:null};},
      tap:function(s){if(s.stopped)return; var t=(performance.now()-s.t0)/1000; s.pos=L.centerPos(t); s.err=Math.abs(s.pos-0.5); s.stopped=true; s.t=t; return true;},
      tick:function(s){if(!s.stopped)s.pos=L.centerPos((performance.now()-s.t0)/1000);},
      result:function(s){return {err:s.err, meta:{pos:s.pos, t:s.t}};},
      draw:function(c,w,h,s,capySt){
        var land=w>h*1.15;
        var barW=Math.min(w*0.88, 720), barH=Math.max(36, Math.min(64,h*0.07));
        var barX=(w-barW)/2, barY=land?h*0.62:h*0.68;
        var sc=capyScale(h,land);
        D.drawCapy(c, w*0.5, barY-14, sc, capySt);
        var zs=(G.EG&&G.EG.zones)?G.EG.zones('center'):null;
        D.drawBar(c,barX,barY,barW,barH,s.pos,zs);
      }
    },
    target:{
      start:function(){return {t0:performance.now(), seed:Math.random()*6.28, thrown:false, flying:false, f0:0, hit:null, land:null, pred:null};},
      tap:function(s){
        if(s.thrown)return;
        var t=(performance.now()-s.t0)/1000;
        s.thrown=true; s.flying=true; s.f0=performance.now(); s.tThrow=t;
        // aim at current with implicit lead = flight (player times the lead themselves by tapping early)
        s.shot=L.targetHit(t, L.TARGET_FLIGHT, 0, 0, s.seed);
        return false; // not finished yet
      },
      tick:function(s){
        if(s.flying && performance.now()-s.f0 >= L.TARGET_FLIGHT*1000){
          s.flying=false; s.hit=s.shot; s.err=s.shot.dist; s.land=s.shot.land; return true;
        }
        return false;
      },
      result:function(s){return {err:s.err, meta:{dist:s.err}};},
      draw:function(c,w,h,s,capySt){
        var land=w>h*1.15;
        var t=s.thrown?s.tThrow:(performance.now()-s.t0)/1000;
        var tg=s.land||L.targetState(t,s.seed);
        var tx=w*0.68+tg.x*w*0.18, ty=(land?h*0.32:h*0.30)+tg.y*h*0.08;
        var R=Math.min(w,h)*0.16;
        D.drawTarget(c,tx,ty,R,!!s.hit);
        var sc=capyScale(h,land);
        var cx=w*0.28, cy=land?h*0.82:h*0.84;
        var throwU=0;
        if(s.flying) throwU=Math.min(1,(performance.now()-s.f0)/(L.TARGET_FLIGHT*1000));
        else if(s.hit) throwU=1;
        D.drawCapy(c,cx,cy,sc, Object.assign({},capySt,{act:s.thrown?'throw':capySt.act,u:s.flying?0.7: (s.hit?1:0), look:0.8}));
        if(s.flying){
          var p=throwU, gx=cx+(tx-cx)*p, gy=cy-70+(ty-(cy-70))*p - Math.sin(p*Math.PI)*h*0.16;
          D.drawGummy(c,gx,gy,1.3,'#ff5b6a',-0.5+p);
        } else if(!s.thrown){
          D.drawGummy(c,cx+sc*70, cy-sc*20, 0.9,'#ff5b6a',0.2);
        } else if(s.hit){
          D.drawGummy(c,tx,ty,1.15,'#ff5b6a',0.3);
        }
      }
    },
    stack:{
      start:function(){
        return {n:0, width:1, drops:[], slideX:-0.8, dir:1, waiting:true, falling:false, done:false, t0:performance.now(), last:0};
      },
      tap:function(s){
        if(s.done||s.falling||!s.waiting)return;
        s.falling=true; s.waiting=false; s.fallT=performance.now();
        var off=s.slideX; // already in width-units relative to center
        var d=L.stackDropError(off,s.width);
        s.pending=d;
        return false;
      },
      tick:function(s){
        if(s.done)return false;
        var now=performance.now();
        if(s.falling){
          if(now-s.fallT>180){
            s.falling=false;
            s.drops.push(s.pending);
            if(s.pending.miss || s.drops.length>=L.STACK_N){s.done=true;s.score=L.stackScore(s.drops);s.err=s.score.err;return true;}
            s.width=s.pending.width; s.n++; s.waiting=true;
            s.slideX=(Math.random()<0.5?-1:1)*(0.55+Math.random()*0.35); s.dir=s.slideX<0?1:-1;
          }
          return false;
        }
        if(s.waiting){
          var spd=L.stackPieceSpeed(s.drops.length,s.width);
          var dt=s.last?Math.min(0.04,(now-s.last)/1000):0.016;
          s.slideX+=s.dir*spd*dt*0.55;
          var span=Math.max(0.85, 0.55+s.width);
          if(s.slideX>span){s.slideX=span;s.dir=-1;}
          if(s.slideX<-span){s.slideX=-span;s.dir=1;}
        }
        s.last=now;
        return false;
      },
      result:function(s){return {err:s.err, meta:s.score};},
      draw:function(c,w,h,s,capySt){
        var land=w>h*1.15;
        var w0=Math.min(w*0.42, 340), bh=Math.min(52,h*0.055);
        var baseY=land?h*0.86:h*0.88, bx=land?w*0.38:w*0.42;
        var blocks=s.drops.filter(function(d){return !d.miss;}).map(function(d,i){
          return {width:d.width, x:0, col:['#ff8fab','#ffd76a','#9be3b0','#cfd8ff','#ffb347','#ff9a3c','#cfd8ff'][i%7]};
        });
        // stacked x should stay centered (trim is already in width)
        var slide=null;
        if(!s.done && (s.waiting||s.falling)){
          var fy=s.falling? Math.min(1,(performance.now()-s.fallT)/180):0;
          slide={width:s.width, x:s.slideX, col:'#ff8fab', fall:fy};
        }
        D.drawTower(c,bx,baseY,blocks,w0,bh,slide);
        var sc=capyScale(h,land)*0.9;
        D.drawCapy(c, land?w*0.82:w*0.82, land?h*0.82:h*0.86, sc, capySt);
      }
    },
    timing:{
      start:function(){
        var delay=1000+Math.random()*1800;
        return {t0:performance.now(), delay:delay, turned:false, done:false, falseStart:false, rt:null};
      },
      tap:function(s){
        if(s.done)return;
        var now=performance.now();
        if(!s.turned){s.done=true;s.falseStart=true;s.rt=0;s.err=9999;return true;}
        s.done=true;s.rt=now-s.turnAt;s.err=Math.max(0,s.rt);
        return true;
      },
      tick:function(s){
        if(!s.turned && !s.done && performance.now()-s.t0>=s.delay){
          s.turned=true; s.turnAt=performance.now(); s.u0=performance.now();
        }
        return false;
      },
      result:function(s){return {err:s.err, falseStart:!!s.falseStart, meta:{rt:s.rt,falseStart:s.falseStart}};},
      draw:function(c,w,h,s,capySt){
        var land=w>h*1.15;
        var sc=capyScale(h,land)*1.08;
        var u=0;
        if(s.turned){u=Math.min(1,(performance.now()-(s.u0||s.turnAt))/180);}
        var act=s.falseStart?'lose':(!s.turned?'back':(u<1?'turn':(s.done?(capySt.act||'wow'):'wow')));
        D.drawCapy(c,w*0.5, land?h*0.78:h*0.80, sc, Object.assign({},capySt,{act:act,u:u,look:0}));
      }
    }
  };

  return {
    start:function(gid){id=gid;st=impl[gid].start();cur=impl[gid];return st;},
    tap:function(){if(!cur||!st)return null; return cur.tap(st);},
    tick:function(){if(!cur||!st)return false; return cur.tick(st);},
    state:function(){return st;},
    id:function(){return id;},
    result:function(){return cur.result(st);},
    draw:function(cv, capySt){
      if(!cur||!st)return;
      var S=sizePlay(cv), c=S.c,w=S.w,h=S.h;
      c.clearRect(0,0,w,h);
      cur.draw(c,w,h,st,capySt||{t:performance.now()/1000,act:'play'});
    },
    drawPreview:function(cv,gid,t){
      var S=sizePlay(cv), c=S.c,w=S.w,h=S.h;
      c.clearRect(0,0,w,h);
      var sc=Math.min(w,h)/140;
      if(gid==='center'){D.drawCapy(c,w*0.5,h*0.72,sc,{t:t,act:'idle'});D.drawBar(c,w*0.08,h*0.84,w*0.84,14,0.5+0.35*Math.sin(t*2));}
      else if(gid==='target'){D.drawCapy(c,w*0.32,h*0.82,sc,{t:t,act:'throw',u:0.5,look:1});D.drawTarget(c,w*0.72,h*0.38,Math.min(w,h)*0.22);}
      else if(gid==='stack'){D.drawTower(c,w*0.36,h*0.88,[{width:1,x:0,col:'#ff8fab'},{width:0.8,x:0.04,col:'#ffd76a'},{width:0.62,x:-0.02,col:'#9be3b0'}],w*0.36,h*0.12);D.drawCapy(c,w*0.78,h*0.86,sc*0.85,{t:t,act:'idle'});}
      else {D.drawCapy(c,w*0.5,h*0.82,sc*1.05,{t:t,act:'turn',u:0.5+0.5*Math.sin(t*1.5)});}
    },
    sizePlay:sizePlay
  };
}
G.EGGames=Games;
})(typeof window!=='undefined'?window:globalThis);

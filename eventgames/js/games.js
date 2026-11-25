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
  function playLayout(w,h){
    var land=w>h*1.15;
    var topSafe=land? Math.max(100, Math.min(136, h*0.17)) : Math.max(124, Math.min(170, h*0.15));
    var botSafe=land? Math.max(152, Math.min(210, h*0.27)) : Math.max(196, Math.min(260, h*0.26));
    var side=Math.max(12, Math.min(w,h)*0.025);
    var x0=side, y0=topSafe, x1=w-side, y1=h-botSafe;
    return {land:land,x0:x0,y0:y0,x1:x1,y1:y1,pw:Math.max(40,x1-x0),ph:Math.max(40,y1-y0),w:w,h:h};
  }
  // Portrait: whole figure ~25-30% of viewport height. Landscape: fit play rect with margin.
  function isResult(){try{var b=document.body;return !!(b&&(b.classList.contains('result')||b.classList.contains('reveal')))}catch(e){return false}}
  // On result, keep the capybara fully visible beside (landscape) or above (portrait) the prize card.
  function resultClear(L, yCap){
    var x0=L.x0, y0=L.y0, x1=L.x1, y1=yCap!=null?yCap:L.y1, xWant=(x0+x1)/2;
    if(isResult()){
      if(L.land){ x0=L.x0+L.pw*0.52; xWant=L.x0+L.pw*0.80; y1=L.y1; }
      else {
        ['recWrap','result','go','next','homeBtn'].forEach(function(id){
          var el=document.getElementById(id);
          if(!el || el.classList.contains('hide')) return;
          var cs=window.getComputedStyle(el);
          if(cs.display==='none'||cs.visibility==='hidden') return;
          var top=el.getBoundingClientRect().top;
          if(top>80) y1=Math.min(y1, top-12);
        });
      }
    }
    return {x0:x0,y0:y0,x1:x1,y1:y1,xWant:xWant};
  }
  function sizePlaceCapy(L, st, x0, y0, x1, y1, xWant, footY){
    var box=D.capyBox(st);
    var prefer=L.land? Math.min((y1-y0)*0.90, L.h*0.32) : Math.min((y1-y0)*0.90, L.h*0.28);
    var sc=D.fitCapyInRect(x0,y0,x1,y1, box, prefer);
    return D.placeCapyInRect(x0,y0,x1,y1, box, sc, xWant, footY);
  }

  var impl={
    center:{
      start:function(){return {t0:performance.now(), stopped:false, pos:0.5, err:null};},
      tap:function(s){if(s.stopped)return; var t=(performance.now()-s.t0)/1000; s.pos=L.centerPos(t); s.err=Math.abs(s.pos-0.5); s.stopped=true; s.t=t; return true;},
      tick:function(s){if(!s.stopped)s.pos=L.centerPos((performance.now()-s.t0)/1000);},
      result:function(s){return {err:s.err, meta:{pos:s.pos, t:s.t}};},
      draw:function(c,w,h,s,capySt){
        var L=playLayout(w,h);
        var barH=Math.max(32, Math.min(L.land?52:58, L.ph*0.10));
        var gap=12;
        var barY=L.y1-barH;
        var R=resultClear(L, isResult()?L.y1:barY-gap);
        var p=sizePlaceCapy(L, capySt, R.x0, R.y0, R.x1, R.y1, R.xWant, R.y1-4);
        D.drawCapy(c, p.x, p.y, p.s, capySt);
        if(!isResult()){
          var barW=Math.min(L.pw*0.98, 840), barX=(w-barW)/2;
          var zs=(G.EG&&G.EG.zones)?G.EG.zones('center'):null;
          D.drawBar(c,barX,barY,barW,barH,s.pos,zs);
        }
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
        var P=playLayout(w,h);
        var t=s.thrown?s.tThrow:(performance.now()-s.t0)/1000;
        var tg=s.land||L.targetState(t,s.seed);
        var st=Object.assign({},capySt,{act:s.thrown?'throw':capySt.act,u:s.flying?0.7: (s.hit?1:0), look:0.8});
        var Rct=resultClear(P, P.y1);
        var capyLeft=isResult()?Rct.x0:(P.x0);
        var capyRight=isResult()?Rct.x1:(P.land? P.x0+P.pw*0.58 : P.x0+P.pw*0.70);
        var xWant=isResult()?Rct.xWant: P.x0+(capyRight-capyLeft)*0.48;
        var p=sizePlaceCapy(P, st, capyLeft, P.y0, capyRight, Rct.y1, xWant, Rct.y1-4);
        D.drawCapy(c,p.x,p.y,p.s, st);
        if(!isResult()){
          var R=Math.min(P.pw,P.ph)*(P.land?0.18:0.16);
          var tx=P.x0+P.pw*(P.land?0.80:0.74)+tg.x*P.pw*0.10;
          var ty=P.y0+Math.max(R+8, P.ph*(P.land?0.30:0.24))+tg.y*P.ph*0.08;
          tx=Math.max(P.x0+R, Math.min(P.x1-R, tx));
          ty=Math.max(P.y0+R, Math.min(p.y-p.s*p.box.t+R, ty));
          D.drawTarget(c,tx,ty,R,!!s.hit);
          var throwU=0;
          if(s.flying) throwU=Math.min(1,(performance.now()-s.f0)/(L.TARGET_FLIGHT*1000));
          else if(s.hit) throwU=1;
          if(s.flying){
            var u=throwU, gx=p.x+(tx-p.x)*u, gy=p.y-40+(ty-(p.y-40))*u - Math.sin(u*Math.PI)*P.ph*0.18;
            D.drawGummy(c,gx,gy,1.15,'#ff5b6a',-0.5+u);
          } else if(!s.thrown){
            D.drawGummy(c,p.x+p.s*62, p.y-p.s*16, 0.8,'#ff5b6a',0.2);
          } else if(s.hit){
            D.drawGummy(c,tx,ty,1.05,'#ff5b6a',0.3);
          }
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
          var span=Math.max(0.85, 0.55+s.width);
          var u=Math.min(1, Math.abs(s.slideX)/span);
          var fac=0.40+0.60*(1-u*u); // slower near the ends
          s.slideX+=s.dir*spd*dt*0.55*fac;
          if(s.slideX>span){s.slideX=span;s.dir=-1;}
          if(s.slideX<-span){s.slideX=-span;s.dir=1;}
        }
        s.last=now;
        return false;
      },
      result:function(s){return {err:s.err, meta:s.score};},
      draw:function(c,w,h,s,capySt){
        var P=playLayout(w,h);
        var R=resultClear(P, P.y1);
        var capyLeft=isResult()?R.x0: P.x0+P.pw*0.50;
        var p=sizePlaceCapy(P, capySt, capyLeft, P.y0, P.x1, R.y1, isResult()?R.xWant: capyLeft+P.pw*0.32, R.y1-4);
        var w0=Math.min((isResult()?P.x0+P.pw*0.50:capyLeft)-P.x0-16, 400), bh=Math.min(48,P.ph*0.08);
        var baseY=P.y1-4, bx=P.x0+w0*0.7;
        var blocks=s.drops.filter(function(d){return !d.miss;}).map(function(d,i){
          return {width:d.width, x:0, col:['#ff8fab','#ffd76a','#9be3b0','#cfd8ff','#ffb347','#ff9a3c','#cfd8ff'][i%7]};
        });
        var slide=null;
        if(!s.done && (s.waiting||s.falling)){
          var fy=s.falling? Math.min(1,(performance.now()-s.fallT)/180):0;
          slide={width:s.width, x:s.slideX, col:'#ff8fab', fall:fy};
        }
        if(!isResult()) D.drawTower(c,bx,baseY,blocks,w0,bh,slide);
        D.drawCapy(c, p.x, p.y, p.s, capySt);
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
        var P=playLayout(w,h);
        var u=0;
        if(s.turned){u=Math.min(1,(performance.now()-(s.u0||s.turnAt))/220); u=u*u*(3-2*u);}
        var act=s.falseStart?'lose':(!s.turned?'back':(u<1?'turn':(s.done?(capySt.act||'wow'):'wow')));
        var st=Object.assign({},capySt,{act:act,u:u,look:0});
        var R=resultClear(P, P.y1);
        var p=sizePlaceCapy(P, st, R.x0, R.y0, R.x1, R.y1, R.xWant, R.y1-4);
        D.drawCapy(c,p.x,p.y,p.s, st);
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
      if(D.drawWorld) D.drawWorld(c,w,h,performance.now()/1000);
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
    sizePlay:sizePlay, playLayout:playLayout
  };
}
G.EGGames=Games;
})(typeof window!=='undefined'?window:globalThis);

/* Four short event games. Each exposes reset/start/tap/tick/draw/result. */
(function(G){
'use strict';
var L=G.EGLogic, D=G.EGDraw;
function Games(api){
  var cur=null, id=null, st=null;
  function sizePlay(cv){
    var d=(G.EGFx&&G.EGFx.capDpr)?G.EGFx.capDpr():Math.min(2, window.devicePixelRatio||1);
    if(G.EG&&G.EG.LOW)d=1;
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
    },
    weight:{
      start:function(){return {t0:performance.now(), seed:Math.random()*6.28, stopped:false, g:100, err:null};},
      tap:function(s){
        if(s.stopped)return;
        var t=(performance.now()-s.t0)/1000;
        s.g=L.weightGrams(t,s.seed); s.err=L.weightError(s.g); s.stopped=true; s.t=t;
        return true;
      },
      tick:function(s){if(!s.stopped)s.g=L.weightGrams((performance.now()-s.t0)/1000,s.seed);},
      result:function(s){return {err:s.err, meta:{grams:s.g, err:s.err, t:s.t}};},
      draw:function(c,w,h,s,capySt){
        var P=playLayout(w,h), R=resultClear(P, P.y1);
        var scaleW=Math.min(P.pw*(P.land?0.42:0.72), 420), scaleH=Math.min(P.ph*0.72, 280);
        var sx=P.land?(isResult()?P.x0+P.pw*0.26:P.x0+P.pw*0.62): (P.x0+P.pw*0.5);
        var sy=R.y1-4;
        if(!isResult()) D.drawScale(c,sx,sy,scaleW,scaleH,s.g,{snacks:4});
        else D.drawScale(c, P.land?P.x0+P.pw*0.26:P.x0+P.pw*0.5, sy, scaleW, scaleH, s.g, {snacks:4, label:(Math.round(s.g*10)/10)+'g'});
        var capyLeft=isResult()?R.x0:(P.land?P.x0:P.x0);
        var capyRight=isResult()?R.x1:(P.land?P.x0+P.pw*0.42:P.x1);
        var xWant=isResult()?R.xWant:(P.land?P.x0+P.pw*0.22:P.x0+P.pw*0.5);
        var st=Object.assign({},capySt,{act:isResult()?capySt.act:(s.stopped?'play':'place'), snack:'gummy'});
        var p=sizePlaceCapy(P, st, capyLeft, P.y0, capyRight, R.y1, xWant, R.y1-4);
        D.drawCapy(c,p.x,p.y,p.s, st);
      }
    },
    jump:{
      start:function(){
        var seed=Math.random()*100;
        return {t0:performance.now(), seed:seed, plan:L.jumpPlan(seed), jumped:false, done:false, tTap:null, err:null, jumpU:0, lateAuto:false};
      },
      tap:function(s){
        if(s.jumped||s.done)return;
        var t=(performance.now()-s.t0)/1000;
        s.tTap=t; s.err=L.jumpError(t,s.plan.tOpt); s.jumped=true; s.late=t>s.plan.tOpt; s.j0=performance.now();
        return false;
      },
      tick:function(s){
        if(s.done)return false;
        var t=(performance.now()-s.t0)/1000;
        if(!s.jumped && t>=s.plan.tHit){
          s.jumped=true; s.lateAuto=true; s.late=true; s.tTap=t; s.err=L.jumpError(t,s.plan.tOpt); s.j0=performance.now();
        }
        if(s.jumped){
          s.jumpU=Math.min(1,(performance.now()-s.j0)/700);
          if(s.jumpU>=1){s.done=true;return true;}
        }
        return false;
      },
      result:function(s){return {err:s.err, meta:{dt:s.err, late:!!s.late, tTap:s.tTap, tOpt:s.plan&&s.plan.tOpt}};},
      draw:function(c,w,h,s,capySt){
        var P=playLayout(w,h), R=resultClear(P, P.y1);
        var yG=R.y1-4;
        if(!isResult()) D.drawGround(c,P.x0,P.x1,yG, (performance.now()-s.t0)/1000);
        var obsX=P.x0+P.pw*(P.land?0.70:0.68);
        var startX=P.x0+P.pw*0.10;
        var t=(performance.now()-s.t0)/1000;
        var tHit=s.plan.tHit, tOpt=s.plan.tOpt;
        var runU=Math.min(1, t/tHit);
        var x, y, act='run', ju=0, hop=0;
        if(!s.jumped){
          x=startX+(obsX-startX-8)*runU;
          y=yG; act='run';
        } else {
          ju=s.jumpU||0;
          var juE=ju*ju*(3-2*ju);
          var early=s.tTap+0.05<tOpt;
          var late=!!s.late;
          var xLand = early? startX+(obsX-startX-8)*Math.min(1,s.tTap/tHit) + (obsX-(startX+(obsX-startX-8)*Math.min(1,s.tTap/tHit)))*0.35
                           : obsX+(P.pw*0.08);
          var x0=startX+(obsX-startX-8)*Math.min(1,(s.tTap||0)/tHit);
          if(late||s.lateAuto){
            // short hop into the crate
            x=x0+(obsX-x0)*Math.min(1,juE*1.1);
            hop=Math.sin(Math.min(1,ju)*Math.PI)*Math.max(18, P.ph*0.10);
            act=ju>0.55?'bump':'jump';
          } else if(early){
            // jump too soon, land short, then slide toward crate
            var mid=x0+(obsX-x0)*0.45;
            x=juE<0.7? x0+(mid-x0)*(juE/0.7) : mid+(obsX-mid)*((juE-0.7)/0.3);
            hop=juE<0.7? Math.sin((juE/0.7)*Math.PI)*Math.max(36,P.ph*0.22) : 0;
            act=juE>0.85?'bump':'jump';
          } else {
            // clear the crate
            x=x0+(xLand-x0)*juE;
            hop=Math.sin(juE*Math.PI)*Math.max(70,P.ph*0.36);
            act='jump';
          }
          y=yG;
        }
        if(!isResult()) D.drawObstacle(c,obsX,yG, P.land?1.45:1.28, 'box');
        var st=Object.assign({},capySt,{act:isResult()?capySt.act:act, u:ju, look:0.2});
        var box=D.capyBox(st);
        var prefer=P.land? Math.min(P.ph*0.70, P.h*0.28) : Math.min(P.ph*0.70, P.h*0.26);
        var sc=D.fitCapyInRect(P.x0,P.y0,P.x1,yG, box, prefer);
        hop=Math.min(hop, Math.max(0, y - (P.y0 + box.t*sc) - 4));
        if(isResult()){
          var p=sizePlaceCapy(P, st, R.x0, R.y0, R.x1, R.y1, R.xWant, R.y1-4);
          D.drawCapy(c,p.x,p.y,p.s,st);
        } else {
          D.drawCapy(c, x, y-hop, sc, st);
        }
      }
    },
    crane:{
      start:function(){
        var seed=Math.random()*6.28;
        var sw=L.craneSweep(0,seed);
        return {t0:performance.now(), seed:seed, gold:sw.gold, pos:sw.pos, dropped:false, done:false, err:null, phase:'move', u:0, held:null, p0:0};
      },
      tap:function(s){
        if(s.dropped||s.done)return;
        var t=(performance.now()-s.t0)/1000;
        var sw=L.craneSweep(t,s.seed);
        s.pos=sw.pos; s.gold=sw.gold; s.err=L.craneError(s.pos,s.gold);
        s.dropped=true; s.phase='down'; s.p0=performance.now(); s.u=0;
        s.held=null; // decided at grab
        return false;
      },
      tick:function(s){
        if(s.done)return false;
        if(!s.dropped) return false;
        var dt=performance.now()-s.p0, lim;
        if(s.phase==='down'){ s.u=Math.min(1,dt/320); if(s.u>=1){s.phase='grab';s.p0=performance.now();s.u=0;} }
        else if(s.phase==='grab'){
          s.u=Math.min(1,dt/180);
          if(s.u>=0.4 && !s.held){ s.held=L.craneHold(s.err); }
          if(s.u>=1){s.phase='up';s.p0=performance.now();s.u=0;}
        }
        else if(s.phase==='up'){
          s.u=Math.min(1,dt/380);
          // mid-tier regular can slip near the top if error is in the 4th band? No: 4th still holds regular; only 'none' is empty.
          // If held is none, claw is empty all the way. If we want a drop animation for 'none' that tried to pinch: show a slip at u>0.45
          if(s.held==='none' && s.u>0.35 && !s.slipped){ s.slipped=true; }
          if(s.u>=1){s.phase='settle';s.p0=performance.now();s.u=0;}
        }
        else if(s.phase==='settle'){
          s.u=Math.min(1,dt/200);
          if(s.u>=1){s.done=true;return true;}
        }
        return false;
      },
      result:function(s){return {err:s.err, meta:{err:s.err, held:s.held, gold:s.gold, pos:s.pos}};},
      draw:function(c,w,h,s,capySt){
        var P=playLayout(w,h), R=resultClear(P, P.y1);
        var t=(performance.now()-s.t0)/1000;
        var pos=s.dropped?s.pos:L.craneSweep(t,s.seed).pos;
        var gold=s.gold;
        var railY=P.y0+Math.min(36,P.ph*0.10);
        var floorY=R.y1-8;
        var downMax=floorY-railY-36;
        var clawY=railY+28, open=0.85, held=null, hideNear=false;
        if(s.dropped){
          if(s.phase==='down'){ clawY=railY+28+downMax*(s.u*s.u*(3-2*s.u)); open=0.85-0.15*s.u; }
          else if(s.phase==='grab'){ clawY=railY+28+downMax; open=0.85*(1-s.u); held=s.held==='none'?null:s.held; hideNear=!!held; }
          else if(s.phase==='up'||s.phase==='settle'||s.done){
            var uu=s.phase==='up'?s.u:1;
            clawY=railY+28+downMax*(1-uu*uu*(3-2*uu));
            open=s.held&&s.held!=='none'?0.15:0.55;
            held=(s.held&&s.held!=='none')?s.held:null;
            hideNear=!!held;
            if(s.held==='none' && s.slipped){ held=null; open=0.7; }
          }
        }
        if(!isResult()){
          D.drawCrane(c,{x0:P.x0+8,x1:P.land?(isResult()?P.x0+P.pw*0.50:P.x1-8):P.x1-8, railY:railY, pos:pos, gold:gold, clawY:clawY, open:open, held:held, hideNear:hideNear, floorY:floorY});
        }
        var st=Object.assign({},capySt,{act:isResult()?capySt.act:'idle', look: (pos-0.5)*2});
        {
          var capyLeft=isResult()?R.x0:P.x0;
          var capyRight=isResult()?R.x1:(P.land?P.x0+P.pw*0.36:P.x0+P.pw*0.42);
          var xWant=isResult()?R.xWant:(P.land?P.x0+P.pw*0.18:P.x0+P.pw*0.20);
          var p=sizePlaceCapy(P, st, capyLeft, P.y0, capyRight, R.y1, xWant, R.y1-4);
          D.drawCapy(c,p.x,p.y,p.s,st);
        }
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
      c.save();
      if(G.EGFx&&G.EGFx.applyCam) G.EGFx.applyCam(c);
      if(D.drawWorld) D.drawWorld(c,w,h,performance.now()/1000);
      cur.draw(c,w,h,st,capySt||{t:performance.now()/1000,act:'play'});
      c.restore();
    },
    drawPreview:function(cv,gid,t){
      var S=sizePlay(cv), c=S.c,w=S.w,h=S.h;
      c.clearRect(0,0,w,h);
      var sc=Math.min(w,h)/140;
      if(gid==='center'){D.drawCapy(c,w*0.5,h*0.72,sc,{t:t,act:'idle'});D.drawBar(c,w*0.08,h*0.84,w*0.84,14,0.5+0.35*Math.sin(t*2));}
      else if(gid==='target'){D.drawCapy(c,w*0.32,h*0.82,sc,{t:t,act:'throw',u:0.5,look:1});D.drawTarget(c,w*0.72,h*0.38,Math.min(w,h)*0.22);}
      else if(gid==='stack'){D.drawTower(c,w*0.36,h*0.88,[{width:1,x:0,col:'#ff8fab'},{width:0.8,x:0.04,col:'#ffd76a'},{width:0.62,x:-0.02,col:'#9be3b0'}],w*0.36,h*0.12);D.drawCapy(c,w*0.78,h*0.86,sc*0.85,{t:t,act:'idle'});}
      else if(gid==='weight'){D.drawScale(c,w*0.62,h*0.92,w*0.7,h*0.7,100+40*Math.sin(t*1.4),{snacks:3});D.drawCapy(c,w*0.22,h*0.90,sc*0.9,{t:t,act:'place',snack:'gummy'});}
      else if(gid==='jump'){D.drawGround(c,8,w-8,h*0.88,t);D.drawObstacle(c,w*0.72,h*0.88,0.7,'box');D.drawCapy(c,w*0.32,h*0.88-Math.abs(Math.sin(t*3))*10,sc*0.9,{t:t,act:'run'});}
      else if(gid==='crane'){D.drawCrane(c,{x0:w*0.08,x1:w*0.92,railY:h*0.14,pos:0.5+0.3*Math.sin(t*1.3),gold:0.55,clawY:h*0.34,open:0.7,held:null,floorY:h*0.86});D.drawCapy(c,w*0.18,h*0.92,sc*0.7,{t:t,act:'idle'});}
      else {D.drawCapy(c,w*0.5,h*0.82,sc*1.05,{t:t,act:'turn',u:0.5+0.5*Math.sin(t*1.5)});}
    },
    sizePlay:sizePlay, playLayout:playLayout
  };
}
G.EGGames=Games;
})(typeof window!=='undefined'?window:globalThis);

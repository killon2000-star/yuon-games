/* Event minigames — canvas drawing: hero capy, snacks, widgets, key art. */
(function(G){
'use strict';
function E(c,x,y,rx,ry,a){c.beginPath();c.ellipse(x,y,rx,ry,a||0,0,7)}
function RG(c,x,y,r,st){var g=c.createRadialGradient(x,y,0,x,y,r);for(var i=0;i<st.length;i+=2)g.addColorStop(st[i],st[i+1]);return g}
function rr(c,x,y,w,h,r){r=Math.min(r,w/2,h/2);c.beginPath();c.moveTo(x+r,y);c.arcTo(x+w,y,x+w,y+h,r);c.arcTo(x+w,y+h,x,y+h,r);c.arcTo(x,y+h,x,y,r);c.arcTo(x,y,x+w,y,r);c.closePath()}
function lerp(a,b,t){return a+(b-a)*t}
function clamp(v,a,b){return v<a?a:v>b?b:v}
function FONT(){return '"Gothic A1","NanumGothic","Noto Sans CJK KR","Apple SD Gothic Neo",system-ui,sans-serif'}

/* ---------- snacks (no brand marks) ---------- */
function drawGummy(c,x,y,s,col,rot){
  col=col||'#ff5b6a';
  var dark=shade(col,-0.22), lite=shade(col,0.28);
  c.save();c.translate(x,y);c.rotate(rot||0);c.scale(s,s);
  c.lineJoin='round';c.lineCap='round';
  // ears
  c.fillStyle=RG(c,-10,-20,14,[0,lite,1,col]);
  E(c,-11,-22,7,8, -0.2);c.fill();E(c,11,-22,7,8,0.2);c.fill();
  c.strokeStyle='rgba(80,40,40,.35)';c.lineWidth=1.2;E(c,-11,-22,7,8,-0.2);c.stroke();E(c,11,-22,7,8,0.2);c.stroke();
  // body
  c.fillStyle=RG(c,-4,-4,28,[0,lite,.55,col,1,dark]);
  rr(c,-18,-18,36,40,16);c.fill();
  c.strokeStyle='rgba(80,40,40,.35)';c.lineWidth=1.4;rr(c,-18,-18,36,40,16);c.stroke();
  // tummy shine
  c.fillStyle='rgba(255,255,255,.38)';E(c,-5,-2,9,11,-0.3);c.fill();
  // face
  c.fillStyle='#3a2416';E(c,-6,-6,2.1,2.6);c.fill();E(c,6,-6,2.1,2.6);c.fill();
  c.fillStyle='#fff';E(c,-6.7,-6.8,0.8,0.9);c.fill();E(c,5.3,-6.8,0.8,0.9);c.fill();
  c.fillStyle='rgba(255,120,140,.45)';E(c,-10,1,3.2,2);c.fill();E(c,10,1,3.2,2);c.fill();
  c.strokeStyle='#3a2416';c.lineWidth=1.3;c.beginPath();c.arc(0,2,3.2,0.15,Math.PI-0.15);c.stroke();
  // arms/legs little nubs
  c.fillStyle=col;E(c,-20,6,5,4,0.4);c.fill();E(c,20,6,5,4,-0.4);c.fill();
  E(c,-10,22,5,4);c.fill();E(c,10,22,5,4);c.fill();
  c.restore();
}
function shade(hex,amt){
  var n=hex.replace('#','');
  if(n.length===3)n=n[0]+n[0]+n[1]+n[1]+n[2]+n[2];
  var r=parseInt(n.slice(0,2),16),g=parseInt(n.slice(2,4),16),b=parseInt(n.slice(4,6),16);
  r=clamp((r+amt*255)|0,0,255);g=clamp((g+amt*255)|0,0,255);b=clamp((b+amt*255)|0,0,255);
  return 'rgb('+r+','+g+','+b+')';
}
function drawCandyWrap(c,x,y,s,rot,wrap,body){
  wrap=wrap||'#7ecbff'; body=body||'#ff8fab';
  c.save();c.translate(x,y);c.rotate(rot||0);c.scale(s,s);
  c.fillStyle=wrap;
  c.beginPath();c.moveTo(-22,0);c.lineTo(-36,-11);c.lineTo(-28,0);c.lineTo(-36,11);c.closePath();c.fill();
  c.beginPath();c.moveTo(22,0);c.lineTo(36,-11);c.lineTo(28,0);c.lineTo(36,11);c.closePath();c.fill();
  c.fillStyle=RG(c,-3,-3,18,[0,'#fff',.4,body,1,shade(body,-0.2)]);
  E(c,0,0,22,13);c.fill();
  c.strokeStyle='rgba(80,52,30,.4)';c.lineWidth=1.4;E(c,0,0,22,13);c.stroke();
  c.strokeStyle='rgba(255,255,255,.55)';c.lineWidth=2;c.beginPath();c.moveTo(-10,-4);c.quadraticCurveTo(0,-8,12,-2);c.stroke();
  // stripe
  c.strokeStyle='rgba(255,255,255,.35)';c.lineWidth=3;c.beginPath();c.moveTo(-16,0);c.lineTo(16,0);c.stroke();
  c.restore();
}
function drawLolly(c,x,y,s,rot,col){
  col=col||'#ff6b9a';
  c.save();c.translate(x,y);c.rotate(rot||0);c.scale(s,s);
  c.strokeStyle='#f3e0c8';c.lineWidth=4;c.lineCap='round';
  c.beginPath();c.moveTo(0,8);c.lineTo(0,34);c.stroke();
  c.fillStyle=RG(c,-6,-8,20,[0,'#fff3',.3,col,1,shade(col,-0.25)]);
  c.beginPath();c.arc(0,-4,16,0,7);c.fill();
  c.strokeStyle='rgba(80,52,30,.35)';c.lineWidth=1.4;c.stroke();
  // swirl
  c.strokeStyle='rgba(255,255,255,.55)';c.lineWidth=2.2;c.beginPath();
  for(var a=0;a<5;a++){var r=2+a*2.4;c.arc(0,-4,r,a*0.8,a*0.8+2.2);}
  c.stroke();
  c.restore();
}
function drawChew(c,x,y,s,rot,col){
  // generic soft stick candy (not a brand)
  col=col||'#ffd35a';
  c.save();c.translate(x,y);c.rotate(rot||0);c.scale(s,s);
  c.fillStyle=RG(c,-4,-6,22,[0,shade(col,0.3),.5,col,1,shade(col,-0.2)]);
  rr(c,-10,-20,20,40,7);c.fill();
  c.strokeStyle='rgba(80,52,30,.35)';c.lineWidth=1.3;rr(c,-10,-20,20,40,7);c.stroke();
  c.fillStyle='rgba(255,255,255,.4)';rr(c,-7,-16,8,12,4);c.fill();
  c.restore();
}
function drawSnack(c,kind,x,y,s,rot){
  if(kind==='gummy'||kind==='gummy-red') drawGummy(c,x,y,s,'#ff5b6a',rot);
  else if(kind==='gummy-yel') drawGummy(c,x,y,s,'#ffd14a',rot);
  else if(kind==='gummy-grn') drawGummy(c,x,y,s,'#7bd86a',rot);
  else if(kind==='gummy-org') drawGummy(c,x,y,s,'#ff9a3c',rot);
  else if(kind==='lolly') drawLolly(c,x,y,s,rot,'#ff6b9a');
  else if(kind==='lolly-blu') drawLolly(c,x,y,s,rot,'#6ec7ff');
  else if(kind==='chew') drawChew(c,x,y,s,rot,'#ffd35a');
  else if(kind==='chew-pink') drawChew(c,x,y,s,rot,'#ff9ec4');
  else if(kind==='candy-blu') drawCandyWrap(c,x,y,s,rot,'#7ecbff','#ff8fab');
  else if(kind==='candy-grn') drawCandyWrap(c,x,y,s,rot,'#9be3b0','#ffb347');
  else drawCandyWrap(c,x,y,s,rot,'#cfd8ff','#ff8fab');
}

/* ---------- hero capybara ---------- */
// 3/4 view, same mascot family as tensec, but BIGGER eyes + squash/stretch + gags.
// Local units: feet rest near y=16, leaf tip ~ y=-92. Height ~110. Draw LARGE.
function capyAnim(st){
  st=st||{};
  var t=st.t||0, act=st.act||'idle';
  var a={sx:1,sy:1,offX:0,offY:0,rot:0,look:st.look||0,lookY:st.lookY||0,blink:0,sweat:st.sweat||0,
         crown:!!st.crown,snack:st.snack||null,eat:!!st.eat,arm:0,face:'idle',stars:0,
         flip:!!st.flip,turn:st.turn==null?1:st.turn, hop:0, tongue:0, brow:0, lean:0};
  var breath=Math.sin(t*2.3);
  a.sy=1+0.045*breath; a.sx=1-0.025*breath;
  a.offY=-1.4*breath;
  var bc=(t%3.2); a.blink=(bc>3.05||bc<0.08)?Math.max(0,Math.min(1,bc>3.05?(bc-3.05)/0.1:1-bc/0.08)):0;
  if(st.blink!=null) a.blink=st.blink;
  if(act==='idle'||act==='wait'){
    a.look=st.look!=null?st.look:0.55*Math.sin(t*0.5);
    a.offX=5.5*Math.sin(t*1.12);
    a.rot=0.045*Math.sin(t*0.9);
    var g=(t%8.4);
    if(g>7.3){var u=(g-7.3)/1.1;a.hop=Math.sin(u*Math.PI)*14;a.sy=1-0.12*Math.sin(u*Math.PI*2);a.face='happy';}
    if(g>2.8&&g<3.6){a.eat=true;a.snack=a.snack||'gummy';a.face='eat';}
  }
  if(act==='play'){
    a.face='focus'; a.sweat=Math.max(a.sweat,0.9); a.brow=1;
    a.look=st.look!=null?st.look:0; a.lean=a.look*0.12; a.sy+=0.03;
  }
  if(act==='run'){
    a.face='focus'; a.lean=0.18; a.brow=1;
    a.hop=Math.abs(Math.sin(t*11))*9; a.arm=0.35+0.4*Math.sin(t*11);
    a.rot=0.06*Math.sin(t*11);
  }
  if(act==='jump'){
    var ju=st.u!=null?st.u:0.5;
    a.face=ju<0.55?'wow':'focus'; a.arm=0.9; a.rot=-0.25+0.55*ju; a.lean=-0.08;
  }
  if(act==='bump'){
    a.face='dizzy'; a.rot=0.55; a.offY=8; a.stars=1; a.arm=-0.2; a.blink=0;
  }
  if(act==='place'){
    a.face='eat'; a.eat=true; a.snack=st.snack||'gummy'; a.arm=0.85; a.lean=0.12;
  }
  if(act==='throw'){
    var u=st.u!=null?st.u:0.6;
    a.face='focus'; a.lean=0.18+0.2*u; a.arm=lerp(-0.3,1.3,u);
    a.sx=1+0.12*Math.sin(u*Math.PI); a.sy=1-0.1*Math.sin(u*Math.PI);
  }
  if(act==='win'||act==='dance'){
    a.face='happy'; a.hop=Math.abs(Math.sin(t*5.2))*16; a.rot=0.08*Math.sin(t*5.2);
    a.arm=0.8+0.3*Math.sin(t*5.2); a.snack=st.snack||'gummy'; a.blink=0;
  }
  if(act==='win1'){
    a.face='wow'; a.crown=true; a.snack=st.snack||'gummy';
    a.hop=Math.abs(Math.sin(t*5.6))*20; a.rot=0.11*Math.sin(t*5.6);
    a.arm=1.1; a.sy=1-0.08*Math.sin(t*5.6); a.blink=0; a.tongue=1;
  }
  if(act==='lose'){
    a.face='dizzy'; a.rot=1.05; a.offY=14; a.stars=1; a.arm=-0.3; a.blink=0;
  }
  if(act==='eat'){a.face='eat';a.eat=true;a.snack=st.snack||'chew';a.arm=0.5;}
  if(act==='back'){a.turn=0;a.face='back';}
  if(act==='turn'){
    var u=st.u!=null?st.u:1;
    a.turn=u; a.face=u>0.55?'wow':'back';
    a.sx*=Math.max(0.18, Math.abs(Math.cos((1-u)*Math.PI/2)));
    if(u>0.7) a.sweat=0.35;
  }
  if(st.rot!=null)a.rot=st.rot;
  if(st.squash!=null){a.sx*=st.squash;a.sy*=2-st.squash;}
  return a;
}

function drawCapy(c,x,y,scale,st){
  var a=capyAnim(st), t=(st&&st.t)||0;
  c.save();
  c.translate(x+a.offX*(scale/4), y+a.offY*(scale/4)-a.hop*(scale/4));
  c.scale(scale,scale);
  if(a.flip)c.scale(-1,1);
  c.rotate(a.rot+a.lean);
  c.scale(a.sx, a.sy);

  // shadow (un-rotate so it stays on the ground)
  c.save();c.rotate(-(a.rot+a.lean));c.scale(1/Math.max(0.2,a.sx),1/a.sy);
  c.fillStyle=RG(c,8,18,1,[0,'rgba(91,70,54,.36)',.62,'rgba(91,70,54,.12)',1,'rgba(91,70,54,0)']);
  c.beginPath();c.save();c.translate(8,34);c.scale(42,8);c.arc(0,0,1,0,7);c.restore();c.fill();
  c.restore();

  c.lineJoin=c.lineCap='round';
  var O='rgba(80,52,30,.82)';
  if(a.turn<0.42){
    drawCapyBack(c,O,a,t);
    // sweat / stars still ok
    c.restore();
    return;
  }

  // hind legs
  c.strokeStyle=O;c.lineWidth=0.7;
  c.fillStyle=RG(c,-28,8,16,[0,'#c08452',1,'#6e4428']);
  rr(c,-36,16,14,20,6);c.fill();c.stroke();
  rr(c,-8,16,14,20,6);c.fill();c.stroke();
  // front legs (a bit forward)
  c.fillStyle=RG(c,10,10,14,[0,'#a8774c',1,'#6e4428']);
  rr(c,2,18,13,18,5.5);c.fill();c.stroke();
  rr(c,22,18,13,18,5.5);c.fill();c.stroke();
  c.fillStyle='#5a3820';
  E(c,-28,34,8,3.8);c.fill();E(c,0,34,8,3.8);c.fill();
  E(c,9,34,7.5,3.6);c.fill();E(c,29,34,7.5,3.6);c.fill();

  // body — long capybara barrel
  c.fillStyle=RG(c,-8,-8,70,[0,'#e8b582',.5,'#c08452',1,'#875733']);
  rr(c,-42,-26,86,48,23);c.fill();
  c.save();rr(c,-42,-26,86,48,23);c.clip();
  c.fillStyle='rgba(255,228,190,.55)';E(c,-6,-14,30,16);c.fill();
  c.fillStyle='rgba(70,40,20,.16)';E(c,22,2,24,18);c.fill();
  c.restore();
  c.strokeStyle=O;c.lineWidth=0.9;rr(c,-42,-26,86,48,23);c.stroke();

  // tail nub
  c.fillStyle='#875733';E(c,-44,-2,6.5,5,0.5);c.fill();c.strokeStyle=O;c.lineWidth=0.6;E(c,-44,-2,6.5,5,0.5);c.stroke();

  // far ear (behind head)
  c.fillStyle=RG(c,18,-58,10,[0,'#b98657',1,'#6e4428']);
  E(c,18,-60,6.2,6.6);c.fill();c.strokeStyle=O;c.lineWidth=0.65;E(c,18,-60,6.2,6.6);c.stroke();
  c.fillStyle='#5a3820';E(c,18.6,-59.6,2.6,2.8);c.fill();

  // head
  c.fillStyle=RG(c,22,-42,48,[0,'#f0c396',.5,'#c68a55',1,'#8a5a34']);
  rr(c,2,-62,52,46,17);c.fill();
  c.save();rr(c,2,-62,52,46,17);c.clip();
  c.fillStyle='rgba(255,226,186,.55)';E(c,18,-50,16,10);c.fill();
  c.restore();
  c.strokeStyle=O;c.lineWidth=0.9;rr(c,2,-62,52,46,17);c.stroke();

  // snout — long boxy capybara muzzle
  c.fillStyle=RG(c,46,-36,28,[0,'#c99062',.55,'#b07849',1,'#86562f']);
  rr(c,30,-52,36,36,14);c.fill();
  c.save();rr(c,30,-52,36,36,14);c.clip();
  c.fillStyle='rgba(70,40,20,.18)';c.fillRect(30,-52,36,9);
  c.restore();
  c.strokeStyle=O;c.lineWidth=0.8;rr(c,30,-52,36,36,14);c.stroke();
  c.fillStyle='rgba(255,240,215,.5)';E(c,44,-42,9,3.2,-0.1);c.fill();
  // nostrils
  c.fillStyle='#3a2416';
  E(c,56,-38,2.1,3.4,0.55);c.fill();E(c,62.5,-37,1.8,3.0,0.55);c.fill();

  // orange + leaf (tensec signature)
  c.save();c.translate(24,-72);
  c.fillStyle=RG(c,0,0,9,[0,'#fff6c2',.45,'#ffd36e',1,'#e09a2e']);
  c.beginPath();c.arc(0,0,8.4,0,7);c.fill();c.strokeStyle=O;c.lineWidth=0.65;c.stroke();
  c.fillStyle='rgba(255,255,255,.85)';E(c,-2.5,-2.6,2.5,1.5,-0.5);c.fill();
  c.fillStyle=RG(c,10,-4,10,[0,'#d4f7de',1,'#3fa86a']);
  E(c,11,-5,8.5,4.0,0.5);c.fill();c.strokeStyle=O;c.lineWidth=0.6;E(c,11,-5,8.5,4.0,0.5);c.stroke();
  c.restore();

  if(a.crown){
    c.save();c.translate(28,-80);
    c.fillStyle='#ffd76a';c.strokeStyle='#b8860b';c.lineWidth=0.7;
    c.beginPath();c.moveTo(-15,8);c.lineTo(-15,-1);c.lineTo(-7,6);c.lineTo(0,-8);c.lineTo(7,6);c.lineTo(15,-1);c.lineTo(15,8);c.closePath();
    c.fill();c.stroke();
    c.fillStyle='#ff6b8a';c.beginPath();c.arc(0,-8,2.3,0,7);c.fill();
    c.restore();
  }

  // blush
  c.fillStyle='rgba(235,110,110,.4)';E(c,22,-32,8,4.2);c.fill();

  if(a.brow){
    c.strokeStyle='#3a2416';c.lineWidth=1.7;
    c.beginPath();c.moveTo(16,-50);c.lineTo(30,-46);c.stroke();
  }

  drawCapyEye(c,26,-40,a,t);
  drawCapyMouth(c,a);

  // snack at mouth / in front of snout
  if(a.snack){
    c.save();
    if(a.eat) c.translate(58,-28);
    else c.translate(70,-8);
    c.rotate(a.eat?-0.4:0.25);
    drawSnack(c,a.snack,0,0,a.eat?0.42:0.55,0);
    c.restore();
  }

  // sweat
  if(a.sweat>0.05){
    for(var i=0;i<4;i++){
      var sy=-58-i*7 + ((t*55+i*18)%26);
      var sx=6-i*3;
      c.save();c.globalAlpha=a.sweat*0.9;
      c.fillStyle=RG(c,sx,sy,5,[0,'#e6f3ff',.5,'#9ec9ff',1,'#5d9be0']);
      c.beginPath();c.moveTo(sx,sy-5);c.quadraticCurveTo(sx+3.5,sy,sx,sy+5);c.quadraticCurveTo(sx-3.5,sy,sx,sy-5);c.fill();
      c.restore();
    }
  }
  if(a.stars){
    for(var k=0;k<5;k++){
      var ang=t*3+k*1.26;
      drawStar(c, 28+Math.cos(ang)*26, -58+Math.sin(ang)*12, 4, '#ffd76a');
    }
  }
  c.restore();
}

function drawStar(c,x,y,r,col){
  c.save();c.fillStyle=col||'#ffd76a';c.strokeStyle='#b8860b';c.lineWidth=0.4;
  c.beginPath();
  for(var i=0;i<5;i++){
    var a=-Math.PI/2+i*Math.PI*2/5, b=a+Math.PI/5;
    if(i===0)c.moveTo(x+Math.cos(a)*r,y+Math.sin(a)*r);
    else c.lineTo(x+Math.cos(a)*r,y+Math.sin(a)*r);
    c.lineTo(x+Math.cos(b)*r*0.45,y+Math.sin(b)*r*0.45);
  }
  c.closePath();c.fill();c.stroke();c.restore();
}
function drawSwirlEye(c,x,y,r,t){
  c.save();
  c.fillStyle='#fff';E(c,x,y,r,r);c.fill();
  c.strokeStyle='rgba(80,52,30,.5)';c.lineWidth=0.65;E(c,x,y,r,r);c.stroke();
  c.translate(x,y);c.rotate((t||0)*4);
  c.strokeStyle='#3a2416';c.lineWidth=1.4;c.lineCap='round';
  c.beginPath();
  for(var a=0;a<Math.PI*2.2;a+=0.2){
    var rr=r*0.15+r*0.7*(a/(Math.PI*2.2));
    var px=Math.cos(a)*rr, py=Math.sin(a)*rr;
    if(a===0)c.moveTo(px,py); else c.lineTo(px,py);
  }
  c.stroke();
  c.restore();
}
function drawCapyEye(c,x,y,a,t){
  var look=a.look*3, lookY=a.lookY*2, open=1-a.blink;
  if(a.face==='dizzy'){
    drawSwirlEye(c,x+look,y,8,t);
    return;
  }
  if(a.face==='happy'){
    c.strokeStyle='#3a2416';c.lineWidth=2.0;
    c.beginPath();c.arc(x+look,y+1,7,Math.PI*1.08,-0.08);c.stroke();
    return;
  }
  var rx=8.2, ry=9.5*Math.max(0.06,open);
  if(ry<0.9){
    c.strokeStyle='#3a2416';c.lineWidth=1.8;
    c.beginPath();c.moveTo(x-8,y);c.lineTo(x+8,y);c.stroke();
    return;
  }
  c.fillStyle='#fff';E(c,x+look*0.15,y,rx,ry);c.fill();
  c.strokeStyle='rgba(80,52,30,.5)';c.lineWidth=0.65;E(c,x+look*0.15,y,rx,ry);c.stroke();
  var iris=a.face==='wow'?5.8:a.face==='focus'?5.2:6.0;
  var ix=x+look, iy=y+lookY+0.6;
  c.fillStyle=RG(c,ix-1,iy-2,iris,[0,'#8a5a34',1,'#2a1810']);
  E(c,ix,iy,iris*0.82,iris*open);c.fill();
  c.fillStyle='#1a0e08';E(c,ix,iy,2.8,3.2*open);c.fill();
  c.fillStyle='#fff';E(c,ix-2.1,iy-2.0,2.1,2.3*open);c.fill();
  if(a.face==='wow'||a.face==='focus'){
    c.fillStyle='rgba(255,255,255,.75)';E(c,ix+2,iy+1.4,1.0,1.2*open);c.fill();
  }
}
function drawCapyMouth(c,a){
  c.strokeStyle='#3a2416';c.lineWidth=1.5;c.lineCap='round';
  if(a.face==='wow'){
    c.fillStyle='#5a3020';E(c,54,-24,5,5.6);c.fill();
    if(a.tongue){c.fillStyle='#ef6d7a';E(c,54,-21,3.2,2.6);c.fill();}
  } else if(a.face==='happy'||a.face==='eat'){
    c.beginPath();c.arc(52,-24,6.5,0.15,Math.PI-0.15);c.stroke();
    if(a.face==='happy'){c.fillStyle='#ef6d7a';c.beginPath();c.arc(52,-23,4,0.2,Math.PI-0.2);c.fill();}
  } else if(a.face==='focus'){
    c.beginPath();c.moveTo(48,-24);c.lineTo(58,-24);c.stroke();
  } else if(a.face==='dizzy'){
    c.beginPath();c.moveTo(48,-23);c.quadraticCurveTo(54,-18,62,-24);c.stroke();
  } else {
    c.beginPath();c.moveTo(48,-24);c.quadraticCurveTo(54,-20,62,-24);c.stroke();
  }
}
function drawCapyBack(c,O,a,t){
  c.strokeStyle=O;c.lineWidth=0.8;
  c.fillStyle=RG(c,0,8,16,[0,'#c08452',1,'#6e4428']);
  rr(c,-28,16,16,20,6);c.fill();c.stroke();
  rr(c,12,16,16,20,6);c.fill();c.stroke();
  c.fillStyle='#5a3820';E(c,-20,34,8,3.6);c.fill();E(c,20,34,8,3.6);c.fill();
  c.fillStyle=RG(c,0,-8,70,[0,'#c08452',.5,'#a06a40',1,'#6e4428']);
  rr(c,-42,-22,84,50,24);c.fill();c.strokeStyle=O;c.lineWidth=0.9;rr(c,-42,-22,84,50,24);c.stroke();
  c.fillStyle=RG(c,0,-48,36,[0,'#d49a62',1,'#8a5a34']);
  E(c,0,-52,28,26);c.fill();c.strokeStyle=O;E(c,0,-52,28,26);c.stroke();
  c.fillStyle='#8a5a34';E(c,-16,-72,7.5,9);c.fill();E(c,16,-72,7.5,9);c.fill();
  c.strokeStyle=O;c.lineWidth=0.65;E(c,-16,-72,7.5,9);c.stroke();E(c,16,-72,7.5,9);c.stroke();
  c.save();c.translate(0,-78);
  c.fillStyle=RG(c,0,0,9,[0,'#fff6c2',1,'#e09a2e']);c.beginPath();c.arc(0,2,7.5,0,7);c.fill();c.strokeStyle=O;c.stroke();
  c.fillStyle='#3fa86a';E(c,9,-3,8.5,3.8,0.5);c.fill();
  c.restore();
}

/* ---------- game widgets ---------- */
function drawBar(c,x,y,w,h,pos,zones){
  // pos 0..1, zones: array of {max,col} from center
  c.save();
  rr(c,x,y,w,h,h/2);c.fillStyle='#fff';c.fill();
  c.strokeStyle='#5b4636';c.lineWidth=4;rr(c,x,y,w,h,h/2);c.stroke();
  var cx=x+w/2, midY=y+h/2;
  var zs=zones||[
    {max:0.0025,col:'#ffd76a'},
    {max:0.012,col:'#ffe9a8'},
    {max:0.048,col:'#cfe8ff'},
    {max:0.100,col:'#f3d4c4'}
  ];
  for(var i=zs.length-1;i>=0;i--){
    var zw=zs[i].max*2*w;
    c.fillStyle=zs[i].col;
    rr(c,cx-zw/2,y+3,zw,h-6,h/2-3);c.fill();
  }
  // center line
  c.strokeStyle='#c45b7a';c.lineWidth=3;c.beginPath();c.moveTo(cx,y+4);c.lineTo(cx,y+h-4);c.stroke();
  // marker (gummy) — squash a little at the ends so the turnaround feels soft
  var mx=x+pos*w, my=midY;
  var edge=Math.min(pos,1-pos);
  var squash=edge<0.08?1+0.4*(1-edge/0.08):1;
  c.save();c.translate(mx,my);
  c.fillStyle='rgba(91,70,54,.2)';E(c,0,h*0.4,14*squash,5/squash);c.fill();
  c.restore();
  c.save();c.translate(mx,my-6);c.scale(squash,2-squash);
  drawGummy(c,0,0, Math.max(0.7,h/28), '#ff5b6a', Math.sin(pos*Math.PI*2)*0.25);
  c.restore();
  c.restore();
}
function drawTarget(c,x,y,R,hit){
  var rings=['#f4f0e8','#ff8fab','#f4f0e8','#7ecbff','#ffd76a'];
  var rad=[1,0.7,0.4,0.22,0.1];
  c.save();
  for(var i=0;i<rings.length;i++){
    c.fillStyle=rings[i];
    c.beginPath();c.arc(x,y,R*rad[i],0,7);c.fill();
    c.strokeStyle='rgba(91,70,54,.45)';c.lineWidth=2;c.stroke();
  }
  if(hit){
    c.strokeStyle='#5b4636';c.lineWidth=3;
    c.beginPath();c.arc(x,y,8,0,7);c.stroke();
  }
  c.restore();
}
function drawTower(c,x,baseY,blocks,w0,h,slide){
  // blocks: [{width,x,col,kind}] from bottom, width relative to 1, x is center offset
  c.save();
  var n=blocks.length;
  for(var i=0;i<n;i++){
    var b=blocks[i], bw=b.width*w0, bh=h;
    var bx=x+(b.x||0)*w0 - bw/2, by=baseY-(i+1)*bh;
    var col=b.col||['#ff8fab','#ffd76a','#9be3b0','#cfd8ff','#ffb347'][i%5];
    c.fillStyle=col;
    rr(c,bx,by,bw,bh-3,10);c.fill();
    c.strokeStyle='#5b4636';c.lineWidth=3;rr(c,bx,by,bw,bh-3,10);c.stroke();
    c.fillStyle='rgba(255,255,255,.35)';rr(c,bx+6,by+4,bw*0.4,bh*0.3,6);c.fill();
    if(b.kind==='gummy') drawGummy(c,bx+bw/2,by+bh*0.4, bh/42, shade(col,0), 0);
  }
  if(slide){
    var bw=slide.width*w0, bh=h;
    var bx=x+slide.x*w0-bw/2, by=baseY-(n+1)*bh - 8;
    var col=slide.col||'#ff8fab';
    c.fillStyle=col;rr(c,bx,by,bw,bh-3,10);c.fill();
    c.strokeStyle='#5b4636';c.lineWidth=3;rr(c,bx,by,bw,bh-3,10);c.stroke();
  }
  c.restore();
}
function drawClock(c,x,y,s,text,hidden){
  c.save();c.translate(x,y);c.scale(s,s);
  c.fillStyle='#fff';c.beginPath();c.arc(0,0,46,0,7);c.fill();
  c.strokeStyle='#5b4636';c.lineWidth=5;c.stroke();
  c.strokeStyle='#ff8fab';c.lineWidth=6;c.beginPath();c.arc(0,0,46, -Math.PI/2, Math.PI*1.3);c.stroke();
  c.fillStyle='#ff8fab';c.beginPath();c.arc(0,0,6,0,7);c.fill();
  if(hidden){
    c.fillStyle='#5b4636';c.font='bold 22px '+FONT();c.textAlign='center';c.textBaseline='middle';
    c.fillText('?',0,4);
  } else {
    c.fillStyle='#5b4636';c.font='bold 22px '+FONT();c.textAlign='center';c.textBaseline='middle';
    c.fillText(text||'10.00',0,8);
    c.strokeStyle='#5b4636';c.lineWidth=4;c.lineCap='round';
    c.beginPath();c.moveTo(0,0);c.lineTo(0,-26);c.stroke();
    c.lineWidth=3;c.beginPath();c.moveTo(0,0);c.lineTo(16,8);c.stroke();
  }
  c.restore();
}

/* ---------- backgrounds / type / logo ---------- */
function drawPastelBg(c,w,h){
  var g=c.createLinearGradient(0,0,0,h);
  g.addColorStop(0,'#fff3f7');g.addColorStop(0.45,'#fde7ef');g.addColorStop(1,'#d9ecff');
  c.fillStyle=g;c.fillRect(0,0,w,h);
  c.fillStyle='rgba(255,246,200,.55)';E(c,w*0.2,h*0.08,w*0.45,h*0.18);c.fill();
  c.fillStyle='rgba(217,236,255,.55)';E(c,w*0.9,h*0.75,w*0.4,h*0.22);c.fill();
  c.fillStyle='rgba(255,214,232,.45)';E(c,w*0.1,h*0.9,w*0.35,h*0.16);c.fill();
}

function drawWorld(c,w,h,t,opt){
  // Translucent stage + slowly drifting pastel decorations. Leaves the top chrome clear.
  opt=opt||{}; t=t||0;
  var reduce=opt.still||(typeof document!=='undefined'&&document.body&&document.body.classList.contains('low'));
  if(reduce) t=0;
  var top=opt.topSafe!=null?opt.topSafe:Math.max(96, Math.min(140, h*0.16));
  c.save();
  // floor / stage
  var fy=h*0.90, frx=Math.min(w*0.46, h*0.62), fry=Math.max(18,h*0.055);
  var fg=c.createRadialGradient(w*0.5,fy,fry*0.2,w*0.5,fy,frx);
  fg.addColorStop(0,'rgba(255,255,255,0.55)');
  fg.addColorStop(1,'rgba(255,255,255,0)');
  c.fillStyle=fg;
  c.beginPath();c.ellipse(w*0.5,fy,frx,fry,0,0,Math.PI*2);c.fill();
  c.strokeStyle='rgba(91,70,54,0.08)';c.lineWidth=2;
  c.beginPath();c.ellipse(w*0.5,fy,frx*0.82,fry*0.7,0,0,Math.PI*2);c.stroke();
  // soft polka in the mid band (not over the top bar)
  var i,x,y,s;
  c.fillStyle='rgba(255,255,255,0.22)';
  for(i=0;i<18;i++){
    x=((i*97.3)+w*0.07)%w;
    y=top+28+((i*53.1)%Math.max(40,h-top-140));
    c.beginPath();c.arc(x,y,3+(i%3),0,7);c.fill();
  }
  // clouds
  function cloud(cx,cy,sc,a){
    c.globalAlpha=a;c.fillStyle='#fff';
    c.beginPath();
    c.ellipse(cx,cy,38*sc,16*sc,0,0,7);
    c.ellipse(cx-22*sc,cy+2,22*sc,12*sc,0,0,7);
    c.ellipse(cx+24*sc,cy+1,24*sc,13*sc,0,0,7);
    c.fill();
    c.globalAlpha=1;
  }
  for(i=0;i<5;i++){
    var spd=8+i*5;
    x=((i*w*0.23 + t*spd)%(w+220))-110;
    y=top+30+(i%3)*Math.min(52,h*0.07);
    cloud(x,y,0.7+i*0.12,0.22+0.08*(i%3));
  }
  // twinkling stars / sparkles, mid-field
  for(i=0;i<10;i++){
    x=(i*w*0.11+40)%w;
    y=top+50+((i*71)%Math.max(60,h*0.45));
    var tw=0.25+0.25*Math.sin(t*1.6+i);
    c.globalAlpha=tw;
    c.fillStyle='#ffd76a';
    c.save();c.translate(x,y);c.rotate(0.2);
    c.beginPath();
    for(var k=0;k<4;k++){c.rotate(Math.PI/2);c.lineTo(0,5.5);c.lineTo(1.6,1.6);}
    c.closePath();c.fill();
    c.restore();
    c.globalAlpha=1;
  }
  // slow snacks
  if(typeof drawSnack==='function'){
    var kinds=['gummy','candy','lolly','chew','gummy-yel'];
    for(i=0;i<7;i++){
      x=w*((0.08+i*0.13 + Math.sin(t*0.25+i)*0.03)%1);
      y=top+70+((i*89)%Math.max(80,h*0.5))+Math.sin(t*0.7+i)*10;
      if(y>h-80) continue;
      c.globalAlpha=0.38;
      drawSnack(c,kinds[i%kinds.length],x,y,0.55+0.12*(i%3),t*0.4+i);
      c.globalAlpha=1;
    }
  }
  c.restore();
}


function drawScale(c,cx,baseY,W,H,grams,opt){
  opt=opt||{};
  var w=W||240, h=H||200, x=cx, y=baseY;
  c.save();
  // floor shadow
  c.fillStyle='rgba(91,70,54,0.16)';
  c.beginPath(); c.ellipse(x,y+2,w*0.42,h*0.055,0,0,7); c.fill();
  // wooden body
  var bw=w*0.62, bh=h*0.22, bx=x-bw/2, by=y-bh;
  var body=c.createLinearGradient(bx,by,bx,by+bh);
  body.addColorStop(0,'#f3d3a8'); body.addColorStop(0.5,'#e4b87a'); body.addColorStop(1,'#c99258');
  c.fillStyle=body; c.strokeStyle='#5b4636'; c.lineWidth=4;
  rr(c,bx,by,bw,bh,14); c.fill(); c.stroke();
  // feet
  c.fillStyle='#b07a42';
  rr(c,bx+8,y-8,bw*0.2,10,4); c.fill(); c.stroke();
  rr(c,bx+bw-8-bw*0.2,y-8,bw*0.2,10,4); c.fill(); c.stroke();
  // stem with highlight
  var sw=w*0.11, sx=x-sw/2, sy=y-bh-h*0.28, sh=h*0.30;
  var stg=c.createLinearGradient(sx,sy,sx+sw,sy);
  stg.addColorStop(0,'#f7e2c4'); stg.addColorStop(0.45,'#e8c899'); stg.addColorStop(1,'#c9a06a');
  c.fillStyle=stg; rr(c,sx,sy,sw,sh,6); c.fill(); c.stroke();
  // pan
  var panW=w*0.78, panH=h*0.11, panY=sy;
  c.fillStyle='rgba(91,70,54,0.14)';
  c.beginPath(); c.ellipse(x,panY+4,panW*0.46,panH*0.45,0,0,7); c.fill();
  var pan=c.createLinearGradient(x,panY-panH,x,panY+6);
  pan.addColorStop(0,'#fffaf3'); pan.addColorStop(1,'#efe0cc');
  c.fillStyle=pan; c.lineWidth=4;
  c.beginPath(); c.ellipse(x,panY,panW*0.5,panH*0.55,0,0,7); c.fill(); c.stroke();
  c.strokeStyle='rgba(255,255,255,0.7)'; c.lineWidth=2;
  c.beginPath(); c.ellipse(x,panY-2,panW*0.36,panH*0.28,0,Math.PI,0); c.stroke();
  var kinds=['gummy','chew','lolly','gummy-yel','candy'];
  var i,n=opt.snacks==null?4:opt.snacks;
  for(i=0;i<n;i++){
    var px=x-panW*0.28+i*(panW*0.16), py=panY-panH*0.7-(i%2)*5;
    c.fillStyle='rgba(91,70,54,0.12)'; c.beginPath(); c.ellipse(px,panY-2,10,4,0,0,7); c.fill();
    drawSnack(c,kinds[i%kinds.length],px,py,0.58+0.08*(i%3),0.15*i);
  }
  // dial
  var dx=x, dy=y-h*0.78, R=Math.max(32,Math.min(w,h)*0.30);
  c.fillStyle='rgba(91,70,54,0.16)'; c.beginPath(); c.arc(dx+2,dy+4,R+2,0,7); c.fill();
  var ring=c.createLinearGradient(dx-R,dy-R,dx+R,dy+R);
  ring.addColorStop(0,'#f7f0e6'); ring.addColorStop(1,'#d9c4a6');
  c.fillStyle=ring; c.strokeStyle='#5b4636'; c.lineWidth=5;
  c.beginPath(); c.arc(dx,dy,R+3,0,7); c.fill(); c.stroke();
  c.fillStyle='#fffdf8'; c.beginPath(); c.arc(dx,dy,R-4,0,7); c.fill();
  c.strokeStyle='#ead9c2'; c.lineWidth=2; c.beginPath(); c.arc(dx,dy,R-8,0,7); c.stroke();
  // 100g gold band
  c.strokeStyle='#ffd76a'; c.lineWidth=7; c.lineCap='round';
  var a100=-Math.PI*0.75+(100/200)*Math.PI*1.5;
  c.beginPath(); c.arc(dx,dy,R-16,a100-0.12,a100+0.12); c.stroke();
  c.lineCap='butt';
  for(i=0;i<=10;i++){
    var g=i*20, a=-Math.PI*0.75+(g/200)*Math.PI*1.5;
    var inner=R*(i%5===0?0.62:0.76);
    c.strokeStyle=g===100?'#c45b7a':'#5b4636';
    c.lineWidth=g===100?4:i%5===0?2.4:1.2;
    c.beginPath(); c.moveTo(dx+Math.cos(a)*inner,dy+Math.sin(a)*inner);
    c.lineTo(dx+Math.cos(a)*(R-10),dy+Math.sin(a)*(R-10)); c.stroke();
    if(i%5===0){
      c.fillStyle=g===100?'#c45b7a':'#5b4636';
      c.font='800 '+Math.round(R*0.20)+'px '+FONT; c.textAlign='center'; c.textBaseline='middle';
      c.fillText(String(g), dx+Math.cos(a)*(R*0.46), dy+Math.sin(a)*(R*0.46));
    }
  }
  c.fillStyle='#c45b7a'; c.font='900 '+Math.round(R*0.16)+'px '+FONT;
  c.fillText('g', dx, dy+R*0.18);
  var gg=Math.max(0,Math.min(200,grams==null?100:grams));
  var na=-Math.PI*0.75+(gg/200)*Math.PI*1.5;
  c.save(); c.translate(dx,dy); c.rotate(na);
  c.fillStyle='rgba(91,70,54,0.2)'; c.beginPath(); c.moveTo(R*0.72,2); c.lineTo(-R*0.14,5); c.lineTo(-R*0.14,-1); c.closePath(); c.fill();
  var nd=c.createLinearGradient(0,-4,0,4); nd.addColorStop(0,'#ff9aa8'); nd.addColorStop(1,'#c45b7a');
  c.fillStyle=nd;
  c.beginPath(); c.moveTo(R*0.78,0); c.lineTo(-R*0.16,3.8); c.lineTo(-R*0.16,-3.8); c.closePath(); c.fill();
  c.strokeStyle='#5b4636'; c.lineWidth=1.4; c.stroke();
  c.restore();
  var hub=c.createRadialGradient(dx-2,dy-2,1,dx,dy,8);
  hub.addColorStop(0,'#fff'); hub.addColorStop(1,'#5b4636');
  c.fillStyle=hub; c.beginPath(); c.arc(dx,dy,6.5,0,7); c.fill();
  c.strokeStyle='#5b4636'; c.lineWidth=2; c.stroke();
  if(opt.label){
    c.fillStyle='#fff'; c.strokeStyle='#5b4636'; c.lineWidth=3;
    var lw=Math.max(64, opt.label.length*14), lh=26;
    rr(c,dx-lw/2,dy+R+8,lw,lh,10); c.fill(); c.stroke();
    c.fillStyle='#5b4636'; c.font='900 '+Math.round(R*0.28)+'px '+FONT;
    c.textAlign='center'; c.textBaseline='middle';
    c.fillText(opt.label, dx, dy+R+8+lh/2);
  }
  c.restore();
}

function drawObstacle(c,x,baseY,s,kind){
  s=s||1;
  c.save(); c.translate(x,baseY);
  c.fillStyle='rgba(91,70,54,0.2)';
  c.beginPath(); c.ellipse(2,3,32*s,8*s,0,0,7); c.fill();
  // crate body
  var g=c.createLinearGradient(-28*s,-52*s,20*s,0);
  g.addColorStop(0,'#f6d7a8'); g.addColorStop(0.5,'#e2b36e'); g.addColorStop(1,'#c48a42');
  c.fillStyle=g; c.strokeStyle='#5b4636'; c.lineWidth=4;
  rr(c,-28*s,-50*s,56*s,50*s,6); c.fill(); c.stroke();
  // slats
  c.strokeStyle='#5b4636'; c.lineWidth=2;
  c.beginPath(); c.moveTo(-28*s,-34*s); c.lineTo(28*s,-34*s);
  c.moveTo(-28*s,-18*s); c.lineTo(28*s,-18*s); c.stroke();
  c.strokeStyle='rgba(255,255,255,0.35)'; c.lineWidth=2;
  c.beginPath(); c.moveTo(-22*s,-48*s); c.lineTo(-22*s,-4*s); c.stroke();
  // metal corners
  c.fillStyle='#d0c4b0'; c.strokeStyle='#5b4636'; c.lineWidth=2;
  c.beginPath(); c.moveTo(-28*s,-50*s); c.lineTo(-16*s,-50*s); c.lineTo(-16*s,-44*s); c.lineTo(-22*s,-44*s); c.lineTo(-22*s,-38*s); c.lineTo(-28*s,-38*s); c.closePath(); c.fill(); c.stroke();
  c.beginPath(); c.moveTo(28*s,-50*s); c.lineTo(16*s,-50*s); c.lineTo(16*s,-44*s); c.lineTo(22*s,-44*s); c.lineTo(22*s,-38*s); c.lineTo(28*s,-38*s); c.closePath(); c.fill(); c.stroke();
  // pink band
  c.fillStyle='#ff8fab'; rr(c,-20*s,-32*s,40*s,10*s,3); c.fill();
  c.strokeStyle='#5b4636'; c.lineWidth=2; c.stroke();
  c.fillStyle='#fff'; c.font='800 '+Math.round(10*s)+'px '+FONT; c.textAlign='center'; c.textBaseline='middle';
  c.fillText('SNACK',0,-27*s);
  drawSnack(c,'gummy',-8*s,-58*s,0.5,-0.2);
  drawSnack(c,'lolly',10*s,-60*s,0.45,0.3);
  c.restore();
}

function drawGround(c,x0,x1,y,t){
  var w=Math.max(40,x1-x0), i,x,h,g;
  c.save();
  g=c.createLinearGradient(0,y-16,0,y+44);
  g.addColorStop(0,'#d4f0c2'); g.addColorStop(0.28,'#9bd48a'); g.addColorStop(0.55,'#e8c48a'); g.addColorStop(1,'#c99658');
  c.fillStyle=g;
  c.beginPath();
  c.moveTo(x0-24,y+48); c.lineTo(x0-24,y+2);
  c.quadraticCurveTo(x0+w*0.22,y-16,x0+w*0.5,y-8);
  c.quadraticCurveTo(x0+w*0.78,y-16,x1+24,y+2);
  c.lineTo(x1+24,y+48); c.closePath(); c.fill();
  c.strokeStyle='#5b4636'; c.lineWidth=4;
  c.beginPath();
  c.moveTo(x0-24,y+2);
  c.quadraticCurveTo(x0+w*0.22,y-16,x0+w*0.5,y-8);
  c.quadraticCurveTo(x0+w*0.78,y-16,x1+24,y+2);
  c.stroke();
  // highlight lip
  c.strokeStyle='rgba(255,255,255,0.35)'; c.lineWidth=2;
  c.beginPath();
  c.moveTo(x0-16,y+4);
  c.quadraticCurveTo(x0+w*0.22,y-12,x0+w*0.5,y-4);
  c.quadraticCurveTo(x0+w*0.78,y-12,x1+16,y+4);
  c.stroke();
  for(i=0;i<18;i++){
    x=x0+((i*67+(t||0)*10)%w);
    h=8+(i%4)*4;
    c.fillStyle=i%2?'#7bc98a':'#b6e39a';
    c.strokeStyle='#5b4636'; c.lineWidth=1.6;
    c.beginPath(); c.moveTo(x,y-1); c.quadraticCurveTo(x+5,y-h,x+10,y-1); c.closePath(); c.fill(); c.stroke();
    if(i%5===0){
      c.fillStyle='#ff8fab'; c.beginPath(); c.arc(x+5,y-h-3,2.4,0,7); c.fill();
    }
  }
  c.restore();
}

function drawCrane(c,opt){
  var x0=opt.x0, x1=opt.x1, railY=opt.railY, pos=opt.pos, gold=opt.gold;
  var clawY=opt.clawY, open=opt.open==null?0.7:opt.open, floorY=opt.floorY;
  var cx=x0+(x1-x0)*pos, gx=x0+(x1-x0)*gold;
  var track=Math.max(80,x1-x0);
  c.save();
  // shelf shadow + wood
  c.fillStyle='rgba(91,70,54,0.16)';
  c.beginPath(); c.ellipse((x0+x1)/2,floorY+8,track*0.5,10,0,0,7); c.fill();
  var wood=c.createLinearGradient(0,floorY-14,0,floorY+10);
  wood.addColorStop(0,'#f0d0a4'); wood.addColorStop(1,'#c99658');
  c.fillStyle=wood; c.strokeStyle='#5b4636'; c.lineWidth=4;
  rr(c,x0-18,floorY-10,track+36,18,7); c.fill(); c.stroke();
  c.fillStyle='#e8c48a'; rr(c,x0-18,floorY-16,track+36,8,4); c.fill(); c.stroke();
  // candies
  var i,n=7;
  for(i=0;i<n;i++){
    var u=(i+0.5)/n, sx=x0+(x1-x0)*u, isGold=Math.abs(u-gold)<(0.5/n);
    if(isGold && opt.held==='gold') continue;
    if(!isGold && opt.held==='regular' && Math.abs(u-pos)<(0.7/n) && opt.hideNear) continue;
    c.fillStyle='rgba(91,70,54,0.12)'; c.beginPath(); c.ellipse(sx,floorY-4,12,4,0,0,7); c.fill();
    if(isGold){
      c.save(); c.translate(sx,floorY-20);
      c.fillStyle='rgba(255,215,106,0.35)'; c.beginPath(); c.arc(0,0,22,0,7); c.fill();
      var gd=c.createRadialGradient(-4,-4,2,0,0,16);
      gd.addColorStop(0,'#fff4b0'); gd.addColorStop(0.5,'#ffd76a'); gd.addColorStop(1,'#e2a322');
      c.fillStyle=gd; c.strokeStyle='#5b4636'; c.lineWidth=3.5;
      c.beginPath(); c.ellipse(0,0,16,13,-0.2,0,7); c.fill(); c.stroke();
      c.fillStyle='#fff8d0'; c.beginPath(); c.ellipse(-5,-5,5,3,0,0,7); c.fill();
      // tiny crown mark
      c.fillStyle='#c45b7a'; c.font='900 10px '+FONT; c.textAlign='center'; c.textBaseline='middle'; c.fillText('★',0,1);
      c.restore();
    } else {
      drawSnack(c,['gummy','gummy-yel','lolly','chew','candy'][i%5],sx,floorY-18,0.75,0.1*i);
    }
  }
  // rail
  var rail=c.createLinearGradient(0,railY-10,0,railY+8);
  rail.addColorStop(0,'#eef2ff'); rail.addColorStop(0.5,'#c5d0f5'); rail.addColorStop(1,'#8ea0d8');
  c.fillStyle=rail; c.strokeStyle='#5b4636'; c.lineWidth=4;
  rr(c,x0-24,railY-8,track+48,16,6); c.fill(); c.stroke();
  // bolts
  c.fillStyle='#5b4636';
  for(i=0;i<6;i++){ var bx=x0-10+i*((track+20)/5); c.beginPath(); c.arc(bx,railY,2.2,0,7); c.fill(); }
  // trolley
  var tg=c.createLinearGradient(cx,railY-18,cx,railY+12);
  tg.addColorStop(0,'#c8f5d4'); tg.addColorStop(1,'#6fc48a');
  c.fillStyle=tg; rr(c,cx-22,railY-16,44,24,7); c.fill(); c.stroke();
  c.fillStyle='#5b4636'; c.beginPath(); c.arc(cx-12,railY+8,3.5,0,7); c.fill(); c.beginPath(); c.arc(cx+12,railY+8,3.5,0,7); c.fill();
  // pulley + cable
  c.fillStyle='#ffe3ef'; c.beginPath(); c.arc(cx,railY+14,6,0,7); c.fill(); c.stroke();
  c.strokeStyle='#5b4636'; c.lineWidth=3;
  c.beginPath(); c.moveTo(cx,railY+20); c.lineTo(cx,clawY-18); c.stroke();
  // claw
  c.save(); c.translate(cx,clawY);
  var spread=11+20*open;
  var cg=c.createLinearGradient(-10,-16,10,24);
  cg.addColorStop(0,'#fff5f9'); cg.addColorStop(1,'#ffb3c7');
  c.fillStyle=cg; c.strokeStyle='#5b4636'; c.lineWidth=3.2;
  c.beginPath(); c.arc(0,-8,11,0,7); c.fill(); c.stroke();
  c.beginPath(); c.moveTo(-6,-4); c.quadraticCurveTo(-spread,8,-spread+1,24); c.lineTo(-spread+11,24); c.quadraticCurveTo(-8,8,-2,-2); c.closePath(); c.fill(); c.stroke();
  c.beginPath(); c.moveTo(6,-4); c.quadraticCurveTo(spread,8,spread-1,24); c.lineTo(spread-11,24); c.quadraticCurveTo(8,8,2,-2); c.closePath(); c.fill(); c.stroke();
  // inner pads
  c.fillStyle='#ff8fab';
  c.beginPath(); c.ellipse(-spread+6,18,4,5,0,0,7); c.fill();
  c.beginPath(); c.ellipse(spread-6,18,4,5,0,0,7); c.fill();
  if(opt.held==='gold'){
    var gd=c.createRadialGradient(-3,16,2,0,18,15);
    gd.addColorStop(0,'#fff4b0'); gd.addColorStop(1,'#e2a322');
    c.fillStyle=gd; c.strokeStyle='#5b4636'; c.lineWidth=3;
    c.beginPath(); c.ellipse(0,20,15,12,0,0,7); c.fill(); c.stroke();
  } else if(opt.held==='regular'){
    drawSnack(c,'gummy',0,20,0.8,0.2);
  }
  c.restore();
  c.restore();
}

function drawTitle(c,text,x,y,px,maxW){
  c.save();
  c.font='900 '+px+'px '+FONT();
  c.textAlign='center';c.textBaseline='middle';
  c.lineJoin='round';c.miterLimit=2;
  var tw=c.measureText(text).width;
  if(maxW&&tw>maxW){c.font='900 '+(px*maxW/tw)+'px '+FONT();}
  c.lineWidth=Math.max(8,px*0.14);
  c.strokeStyle='#5b4636';
  c.fillStyle='#ff8fab';
  c.strokeText(text,x,y);c.fillText(text,x,y);
  c.restore();
}
function drawLogo(c,img,cx,y,maxW,maxH){
  if(!img||!img.width){
    c.save();c.font='900 36px '+FONT();c.textAlign='center';c.fillStyle='#c43b3b';
    c.fillText('SMG STORE',cx,y+20);c.restore();return;
  }
  var r=Math.min(maxW/img.width, maxH/img.height);
  var w=img.width*r,h=img.height*r;
  c.drawImage(img, cx-w/2, y, w, h);
  return h;
}

/* Measure capy local AABB (relative to draw anchor) including props + animation slack. */
var _capyBoxCache={};
function measureCapy(st){
  var pad=180, S=3;
  var W=pad*2*S, H=pad*2*S;
  var cv=(typeof document!=='undefined')?document.createElement('canvas'):null;
  if(!cv) return {l:72,r:102,t:122,b:52};
  cv.width=W; cv.height=H;
  var c=cv.getContext('2d');
  c.clearRect(0,0,W,H);
  drawCapy(c, pad*S, pad*S, S, st||{});
  var data=c.getImageData(0,0,W,H).data;
  var minX=W,minY=H,maxX=0,maxY=0,found=0;
  for(var i=3,n=data.length;i<n;i+=4){
    if(data[i]>10){
      var p=(i/4)|0, x=p%W, y=(p/W)|0;
      if(x<minX)minX=x; if(x>maxX)maxX=x; if(y<minY)minY=y; if(y>maxY)maxY=y; found=1;
    }
  }
  if(!found) return {l:72,r:102,t:122,b:52};
  return {l:(pad*S-minX)/S, r:(maxX-pad*S)/S, t:(pad*S-minY)/S, b:(maxY-pad*S)/S};
}
function capyBox(st, sampleT){
  st=st||{};
  var key=[st.act||'idle', st.crown?1:0, st.snack||'', st.u==null?'':String(Math.round((st.u||0)*10)), st.sweat?1:0, st.flip?1:0].join('|');
  if(_capyBoxCache[key]) return _capyBoxCache[key];
  var times=sampleT||[0,0.4,0.85,1.3,2.0,2.8,3.15,4.2,6.3,6.8];
  var u={l:0,r:0,t:0,b:0};
  for(var i=0;i<times.length;i++){
    var b=measureCapy(Object.assign({},st,{t:times[i]}));
    if(b.l>u.l)u.l=b.l; if(b.r>u.r)u.r=b.r; if(b.t>u.t)u.t=b.t; if(b.b>u.b)u.b=b.b;
  }
  u.l+=8; u.r+=8; u.t+=10; u.b+=8;
  return _capyBoxCache[key]=u;
}
function safeRect(w,h,frac){
  frac=frac==null?0.06:frac;
  return {x0:w*frac, y0:h*frac, x1:w*(1-frac), y1:h*(1-frac), m:frac, w:w, h:h};
}
function fitCapyInRect(x0,y0,x1,y1, box, preferH){
  var bw=box.l+box.r, bh=box.t+box.b, rw=Math.max(8,x1-x0), rh=Math.max(8,y1-y0);
  var s=Math.min(rw/bw, rh/bh);
  if(preferH) s=Math.min(s, preferH/bh);
  return Math.max(0.2, s);
}
function placeCapyInRect(x0,y0,x1,y1, box, scale, xWant, footY){
  var x=xWant, y=(footY!=null)?footY:(y1-box.b*scale);
  x=Math.max(x0+box.l*scale, Math.min(x1-box.r*scale, x));
  y=Math.max(y0+box.t*scale, Math.min(y1-box.b*scale, y));
  return {x:x,y:y,s:scale,box:box};
}

function scatterSnacks(c,w,h,seed,count,rect){
  var kinds=['gummy','gummy-yel','gummy-grn','gummy-org','candy','candy-blu','candy-grn','lolly','lolly-blu','chew','chew-pink'];
  var rng=(function(){var s=seed||1;return function(){s=(s*1664525+1013904223)>>>0;return s/4294967296;};})();
  var x0=rect?rect.x0:w*0.10, y0=rect?rect.y0:h*0.22, x1=rect?rect.x1:w*0.90, y1=rect?rect.y1:h*0.78;
  var maxS=Math.min(w,h)*0.0016;
  for(var i=0;i<count;i++){
    var k=kinds[(rng()*kinds.length)|0];
    var s=0.55+rng()*0.85;
    var rad=28*s*(w/1080);
    var x=x0+rad+rng()*Math.max(8,x1-x0-rad*2);
    var y=y0+rad+rng()*Math.max(8,y1-y0-rad*2);
    var rot=(rng()-0.5)*1.2;
    drawSnack(c,k,x,y,s*(w/1080),rot);
  }
}

/* ---------- key art scenes (no watermark) ---------- */
function drawKeyart(c,w,h,id,assets){
  assets=assets||{};
  var logo=assets.logo;
  var t=assets.t!=null?assets.t:0.85;
  var portrait=h>w*1.2;
  var S=safeRect(w,h,0.075);
  if(!assets.noBg) drawPastelBg(c,w,h);

  var titles={
    launcher:'이벤트 미니게임 모음',
    center:'정중앙 멈추기',
    target:'과녁 맞추기',
    stack:'카피바라 탑 쌓기',
    timing:'타이밍 잡기',
    tensec:'10초 맞추기'
  };

  // Header: full SMG STORE logo + title, entirely inside the 6% safe area.
  var logoMaxW=S.x1-S.x0;
  var logoMaxH=Math.min(h*0.12, portrait?230:180);
  var logoR=(logo&&logo.width)?Math.min(logoMaxW/logo.width, logoMaxH/logo.height):0;
  var logoH=logoR?logo.height*logoR:(h*0.08);
  var titleSize=portrait?Math.min(70,w*0.085):Math.min(56,w*0.075);
  var headerBottom=S.y0+logoH+(portrait?h*0.018:h*0.022)+titleSize*0.85;
  var C={x0:S.x0, y0:headerBottom+(portrait?h*0.02:h*0.015), x1:S.x1, y1:S.y1, w:S.x1-S.x0, h:S.y1-(headerBottom+(portrait?h*0.02:h*0.015))};

  if(!assets.noBg) scatterSnacks(c,w,h, id==='center'?3:id==='target'?5:id==='stack'?7:id==='timing'?9:id==='tensec'?11:13, 8, {x0:C.x0,y0:C.y0,x1:C.x1,y1:C.y1});

  // Whole-figure height ~25-30% of portrait canvas; in square, fit the leftover safe area.
  var wantH=portrait? h*0.28 : Math.min(h*0.34, C.h*0.72);

  function putCapy(st, xFrac, footY){
    var box=capyBox(st);
    var sc=fitCapyInRect(C.x0,C.y0,C.x1,C.y1, box, wantH);
    var x=C.x0+C.w*(xFrac==null?0.5:xFrac);
    var p=placeCapyInRect(C.x0,C.y0,C.x1,C.y1, box, sc, x, footY);
    drawCapy(c,p.x,p.y,p.s,st);
    return p;
  }

  if(id==='launcher'){
    var st={t:t,act:'win1',snack:'gummy',crown:true};
    var p=putCapy(st, 0.52, C.y1-4);
    var barW=Math.min(C.w*0.34, 320), barH=portrait?36:28;
    drawBar(c, C.x0, C.y0+C.h*0.12, barW, barH, 0.51);
    var tR=Math.min(C.w,C.h)*0.11;
    drawTarget(c, C.x1-tR-8, C.y0+tR+8, tR);
    var tw=Math.min(C.w*0.18, 160), th=portrait?36:28;
    drawTower(c, C.x0+tw*0.7, p.y+p.box.b*p.s*0.15, [
      {width:1,x:0,col:'#ff8fab'},{width:0.86,x:0.04,col:'#ffd76a'},{width:0.7,x:-0.02,col:'#9be3b0'}
    ], tw, th);
    drawSnack(c,'lolly', Math.min(C.x1-30, p.x+p.s*p.box.r+24), p.y-p.s*20, 1.3, 0.3);
    drawSnack(c,'candy-blu', C.x0+36, C.y0+C.h*0.36, 1.15, -0.4);
  }
  else if(id==='center'){
    var st={t:t,act:'play',look:0.2,sweat:1};
    var box=capyBox(st);
    var barH=portrait?56:44;
    var gap=16;
    var subH=barH+gap+titleSize*0.7;
    var sc=fitCapyInRect(C.x0,C.y0,C.x1,C.y1-subH, box, wantH);
    var foot=C.y1-subH-4;
    var p=placeCapyInRect(C.x0,C.y0,C.x1,C.y1-subH, box, sc, (C.x0+C.x1)/2, foot);
    drawCapy(c,p.x,p.y,p.s,st);
    var barY=p.y+p.box.b*p.s+gap;
    var barW=C.w;
    drawBar(c, C.x0, barY, barW, barH, 0.505);
    drawTitle(c,'딱 가운데!', w/2, Math.min(S.y1-8, barY+barH+titleSize*0.7), portrait?40:32, C.w);
  }
  else if(id==='target'){
    var st={t:t,act:'throw',u:0.75,look:0.8,snack:null};
    var box=capyBox(st);
    var tR=Math.min(C.w,C.h)*(portrait?0.16:0.18);
    var sc=fitCapyInRect(C.x0,C.y0, C.x0+C.w*0.62, C.y1, box, wantH);
    var p=placeCapyInRect(C.x0,C.y0, C.x0+C.w*0.62, C.y1, box, sc, C.x0+C.w*0.30, C.y1-4);
    drawCapy(c,p.x,p.y,p.s,st);
    var tx=Math.min(C.x1-tR, C.x0+C.w*0.78);
    var ty=C.y0+tR+8;
    drawTarget(c,tx,ty,tR);
    drawGummy(c, (p.x+tx)/2, (p.y-p.s*40+ty)/2, 1.35, '#ff5b6a', -0.6);
  }
  else if(id==='stack'){
    var st={t:t,act:'win',snack:'gummy-org',look:-0.3};
    var box=capyBox(st);
    var sc=fitCapyInRect(C.x0+C.w*0.42, C.y0, C.x1, C.y1, box, wantH);
    var p=placeCapyInRect(C.x0+C.w*0.42, C.y0, C.x1, C.y1, box, sc, C.x0+C.w*0.78, C.y1-4);
    var tw=Math.min(C.w*0.38, p.x-p.s*p.box.l-C.x0-16);
    var th=portrait?44:34;
    drawTower(c, C.x0+tw*0.7, C.y1-4, [
      {width:1,x:0,col:'#ff8fab'},{width:0.92,x:0.02,col:'#ffd76a'},
      {width:0.84,x:-0.01,col:'#9be3b0'},{width:0.74,x:0.03,col:'#cfd8ff'},
      {width:0.62,x:-0.02,col:'#ffb347'}
    ], tw, th, {width:0.62,x:0.12,col:'#ff8fab'});
    drawCapy(c,p.x,p.y,p.s,st);
  }
  else if(id==='timing'){
    var st={t:t,act:'turn',u:0.95,look:0};
    putCapy(st, 0.5, C.y1-4);
    drawTitle(c,'지금!', w/2, C.y0+titleSize, portrait?72:52, C.w*0.8);
    drawSnack(c,'lolly', C.x0+40, C.y0+C.h*0.28, 1.25, -0.4);
    drawSnack(c,'candy', C.x1-40, C.y0+C.h*0.30, 1.15, 0.3);
  }
  else if(id==='tensec'){
    var st={t:t,act:'win1',crown:true,snack:'candy'};
    var clockS=portrait?1.7:1.45;
    var clockR=70*clockS;
    var clockY=C.y0+clockR+8;
    drawClock(c, w*0.50, clockY, clockS, '10.00', false);
    var y0c=clockY+clockR+12;
    if(assets.tensecCapy && assets.tensecCapy.width){
      var img=assets.tensecCapy;
      var maxH=Math.min(wantH, C.y1-y0c);
      var ih=maxH, iw=ih*(img.width/img.height);
      if(iw>C.w){iw=C.w; ih=iw*(img.height/img.width);}
      var cx=w*0.50, cy=C.y1-4;
      c.drawImage(img, cx-iw/2, Math.max(y0c, cy-ih), iw, ih);
    } else {
      var box=capyBox(st);
      var sc=fitCapyInRect(C.x0,y0c,C.x1,C.y1, box, wantH);
      var p=placeCapyInRect(C.x0,y0c,C.x1,C.y1, box, sc, w*0.50, C.y1-4);
      drawCapy(c,p.x,p.y,p.s,st);
    }
  }

  // logo + title last so the capy never covers them; both inside the 6% safe area
  drawLogo(c,logo,w/2, S.y0, logoMaxW, logoMaxH);
  var titleY=S.y0+logoH+(portrait?h*0.018:h*0.022)+titleSize*0.55;
  drawTitle(c, titles[id]||titles.launcher, w/2, titleY, titleSize, S.x1-S.x0);

  if(!assets.noBg){
    var vg=c.createRadialGradient(w/2,h*0.55,h*0.2,w/2,h*0.55,h*0.85);
    vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(91,70,54,0.05)');
    c.fillStyle=vg;c.fillRect(0,0,w,h);
  }
}

function applyWatermark(c,w,h,logo){
  // SMG STORE already on art; add anti-crop name + bottom-right credit. NO YUON text.
  c.save();
  c.translate(w/2,h/2);c.rotate(-Math.PI/5);
  c.globalAlpha=0.16;
  c.fillStyle='#5b4636';
  c.font='700 '+Math.floor(w*0.062)+'px '+FONT();
  c.textAlign='center';c.textBaseline='middle';
  c.fillText('온인터내셔널 유명훈',0,0);
  c.font='700 '+Math.floor(w*0.045)+'px '+FONT();
  c.fillText('온인터내셔널 유명훈',0,-h*0.14);
  c.fillText('온인터내셔널 유명훈',0,h*0.14);
  c.restore();
  c.save();
  c.globalAlpha=0.62;
  c.fillStyle='#5b4636';
  c.font='700 '+Math.max(22,Math.floor(w*0.028))+'px '+FONT();
  c.textAlign='right';c.textBaseline='bottom';
  c.fillText('온인터내셔널 유명훈', w-Math.max(24,w*0.03), h-Math.max(22,h*0.025));
  c.restore();
}

G.EGDraw={
  E:E,RG:RG,rr:rr,FONT:FONT,shade:shade,
  drawGummy:drawGummy,drawCandyWrap:drawCandyWrap,drawLolly:drawLolly,drawChew:drawChew,drawSnack:drawSnack,
  drawCapy:drawCapy,capyAnim:capyAnim,measureCapy:measureCapy,capyBox:capyBox,
  safeRect:safeRect,fitCapyInRect:fitCapyInRect,placeCapyInRect:placeCapyInRect,
  drawBar:drawBar,drawTarget:drawTarget,drawTower:drawTower,drawClock:drawClock,
  drawScale:drawScale,drawObstacle:drawObstacle,drawGround:drawGround,drawCrane:drawCrane,
  drawPastelBg:drawPastelBg,drawWorld:drawWorld,drawTitle:drawTitle,drawLogo:drawLogo,scatterSnacks:scatterSnacks,
  drawKeyart:drawKeyart,applyWatermark:applyWatermark
};
if(typeof module!=='undefined') module.exports=G.EGDraw;
})(typeof window!=='undefined'?window:globalThis);

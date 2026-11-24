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
    var g=(t%7.2);
    if(g>6.2){var u=(g-6.2)/1.0;a.hop=Math.sin(u*Math.PI)*16;a.sy=1-0.14*Math.sin(u*Math.PI*2);a.face='happy';}
    if(g>2.5&&g<3.3){a.eat=true;a.snack=a.snack||'gummy';a.face='eat';}
  }
  if(act==='play'){
    a.face='focus'; a.sweat=Math.max(a.sweat,0.9); a.brow=1;
    a.look=st.look!=null?st.look:0; a.lean=a.look*0.12; a.sy+=0.03;
  }
  if(act==='throw'){
    var u=st.u!=null?st.u:0.6;
    a.face='focus'; a.lean=0.18+0.2*u; a.arm=lerp(-0.3,1.3,u);
    a.sx=1+0.12*Math.sin(u*Math.PI); a.sy=1-0.1*Math.sin(u*Math.PI);
  }
  if(act==='win'||act==='dance'){
    a.face='happy'; a.hop=Math.abs(Math.sin(t*8))*18; a.rot=0.1*Math.sin(t*8);
    a.arm=0.8+0.35*Math.sin(t*8); a.snack=st.snack||'gummy'; a.blink=0;
  }
  if(act==='win1'){
    a.face='wow'; a.crown=true; a.snack=st.snack||'gummy';
    a.hop=Math.abs(Math.sin(t*9))*24; a.rot=0.14*Math.sin(t*9);
    a.arm=1.1; a.sy=1-0.1*Math.sin(t*9); a.blink=0; a.tongue=1;
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
  // marker (gummy)
  var mx=x+pos*w, my=midY;
  c.save();c.translate(mx,my);
  c.fillStyle='rgba(91,70,54,.2)';E(c,0,h*0.4,14,5);c.fill();
  c.restore();
  drawGummy(c,mx,my-6, Math.max(0.7,h/28), '#ff5b6a', Math.sin(pos*20)*0.2);
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
function scatterSnacks(c,w,h,seed,count){
  var kinds=['gummy','gummy-yel','gummy-grn','gummy-org','candy','candy-blu','candy-grn','lolly','lolly-blu','chew','chew-pink'];
  var rng=(function(){var s=seed||1;return function(){s=(s*1664525+1013904223)>>>0;return s/4294967296;};})();
  for(var i=0;i<count;i++){
    var k=kinds[(rng()*kinds.length)|0];
    var x=w*(0.06+rng()*0.88), y=h*(0.18+rng()*0.72);
    var s=0.7+rng()*1.3, rot=(rng()-0.5)*1.2;
    drawSnack(c,k,x,y,s*(w/1080),rot);
  }
}

/* ---------- key art scenes (no watermark) ---------- */
function drawKeyart(c,w,h,id,assets){
  assets=assets||{};
  var logo=assets.logo;
  var t=assets.t!=null?assets.t:0.85;
  drawPastelBg(c,w,h);
  scatterSnacks(c,w,h, id==='center'?3:id==='target'?5:id==='stack'?7:id==='timing'?9:id==='tensec'?11:13, 10);
  var portrait=h>w*1.2;
  var capyH = portrait? h*0.42 : h*0.48;
  var scale = capyH/110;
  var titles={
    launcher:'이벤트 미니게임 모음',
    center:'정중앙 멈추기',
    target:'과녁 맞추기',
    stack:'카피바라 탑 쌓기',
    timing:'타이밍 잡기',
    tensec:'10초 맞추기'
  };

  if(id==='launcher'){
    drawBar(c, w*0.08, portrait?h*0.40:h*0.38, w*0.30, portrait?48:36, 0.51);
    drawTarget(c, w*0.86, portrait?h*0.38:h*0.34, portrait?w*0.11:w*0.09);
    drawTower(c, w*0.18, portrait?h*0.92:h*0.90, [
      {width:1,x:0,col:'#ff8fab'},{width:0.86,x:0.04,col:'#ffd76a'},{width:0.7,x:-0.02,col:'#9be3b0'}
    ], portrait?w*0.16:w*0.14, portrait?46:36);
    drawCapy(c, w*0.50, portrait?h*0.78:h*0.82, scale,{t:t,act:'win1',snack:'gummy',crown:true});
    drawSnack(c,'lolly', w*0.84, portrait?h*0.80:h*0.74, 2.2, 0.3);
    drawSnack(c,'candy-blu', w*0.16, portrait?h*0.58:h*0.62, 1.8, -0.4);
  }
  else if(id==='center'){
    drawCapy(c,w*0.50, portrait?h*0.68:h*0.70, scale,{t:t,act:'play',look:0.2,sweat:1});
    drawBar(c, w*0.08, portrait?h*0.82:h*0.84, w*0.84, portrait?70:54, 0.505);
    drawTitle(c,'딱 가운데!', w/2, portrait?h*0.91:h*0.94, portrait?48:36, w*0.8);
  }
  else if(id==='target'){
    drawCapy(c, w*0.34, portrait?h*0.80:h*0.82, scale*1.05,{t:t,act:'throw',u:0.75,look:0.8,snack:null});
    drawTarget(c, w*0.74, portrait?h*0.48:h*0.44, portrait?w*0.20:w*0.16);
    drawGummy(c, w*0.60, portrait?h*0.52:h*0.50, 1.8, '#ff5b6a', -0.6);
    drawSnack(c,'gummy-yel', w*0.12, portrait?h*0.40:h*0.34, 1.4, 0.3);
    drawSnack(c,'gummy-grn', w*0.88, portrait?h*0.82:h*0.80, 1.5, -0.2);
  }
  else if(id==='stack'){
    drawTower(c, w*0.32, portrait?h*0.88:h*0.86, [
      {width:1,x:0,col:'#ff8fab'},{width:0.92,x:0.02,col:'#ffd76a'},
      {width:0.84,x:-0.01,col:'#9be3b0'},{width:0.74,x:0.03,col:'#cfd8ff'},
      {width:0.62,x:-0.02,col:'#ffb347'}
    ], portrait?w*0.36:w*0.30, portrait?58:44, {width:0.62,x:0.12,col:'#ff8fab'});
    drawCapy(c, w*0.72, portrait?h*0.82:h*0.84, scale,{t:t,act:'win',snack:'gummy-org',look:-0.3});
  }
  else if(id==='timing'){
    drawCapy(c,w*0.50, portrait?h*0.78:h*0.80, scale*1.08,{t:t,act:'turn',u:0.95,look:0});
    drawTitle(c,'지금!', w/2, portrait?h*0.38:h*0.34, portrait?84:56, w*0.7);
    drawSnack(c,'lolly', w*0.14, portrait?h*0.50:h*0.48, 2.0, -0.4);
    drawSnack(c,'candy', w*0.88, portrait?h*0.52:h*0.50, 1.8, 0.3);
  }
  else if(id==='tensec'){
    if(assets.tensecCapy){
      var img=assets.tensecCapy, ih=capyH*1.25, iw=ih*(img.width/img.height);
      c.drawImage(img, w*0.50-iw/2, (portrait?h*0.82:h*0.84)-ih*0.92, iw, ih);
    } else {
      drawCapy(c,w*0.50, portrait?h*0.82:h*0.84, scale,{t:t,act:'win1',crown:true,snack:'candy'});
    }
    drawClock(c, w*0.50, portrait?h*0.44:h*0.40, portrait?2.3:1.8, '10.00', false);
    drawSnack(c,'gummy', w*0.14, portrait?h*0.52:h*0.50, 1.8, -0.3);
    drawSnack(c,'lolly-blu', w*0.88, portrait?h*0.58:h*0.54, 2.0, 0.4);
  }

  // logo + title last so the capy never covers them
  var top=portrait?h*0.035:h*0.04;
  var logoH=drawLogo(c,logo,w/2, top, Math.min(w*0.46,520), Math.min(h*0.12, 220))|| (h*0.1);
  var titleY=top+logoH+(portrait?h*0.045:h*0.06);
  drawTitle(c, titles[id]||titles.launcher, w/2, titleY, portrait?Math.min(92,w*0.105):Math.min(74,w*0.085), w*0.9);

  var vg=c.createRadialGradient(w/2,h*0.55,h*0.2,w/2,h*0.55,h*0.85);
  vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(91,70,54,0.05)');
  c.fillStyle=vg;c.fillRect(0,0,w,h);
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
  drawCapy:drawCapy,capyAnim:capyAnim,
  drawBar:drawBar,drawTarget:drawTarget,drawTower:drawTower,drawClock:drawClock,
  drawPastelBg:drawPastelBg,drawTitle:drawTitle,drawLogo:drawLogo,scatterSnacks:scatterSnacks,
  drawKeyart:drawKeyart,applyWatermark:applyWatermark
};
if(typeof module!=='undefined') module.exports=G.EGDraw;
})(typeof window!=='undefined'?window:globalThis);

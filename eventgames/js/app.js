/* Event minigames shell: launcher + games, admin, i18n, hits, fullscreen. */
(function(){
'use strict';
var L=window.EGLogic, D=window.EGDraw, A=window.EGAudio;
var LS_CFG='eventgames_cfg', LS_HITS='eventgames_hits';
var LOW=/[?&]low=1/.test(location.search)||(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches);
if(LOW) document.body.classList.add('low');
var LANGS=['ko','en','id'];
var I18N={
ko:{
  pack:'이벤트 미니게임 모음',
  helpPack:'한 판이 금방 끝나는 이벤트 게임입니다. 게임을 골라 주세요.',
  start:'시작', stop:'정지', throw:'던지기', drop:'놓기', wait:'준비…', now:'지금!',
  next:'다음 참가자', again:'다시 하기', back:'모음으로',
  rec:'기록', errExact:'정확해요!',
  tier:['1등','2등','3등','4등','참가상'],
  stockLeft:'남은 수량', fallen:'재고가 없어 아래 등급으로 지급되었습니다', soldOut:'상품이 모두 소진되었습니다',
  pinTitle:'관리자', pinWrong:'비밀번호가 달라요', cancel:'취소',
  adTitle:'이벤트 설정', lbStaff:'다음 참가자 확인', lbSfx:'효과음', lbVib:'진동', lbMusic:'음악', lbVol:'음량', lbPin:'비밀번호 4자리',
  lbShared:'상품 재고 공유', lbPrizes:'상품·기준', prizeHint:'1등 기준이 가장 빡셉니다. 재고를 비우면 무제한. 재고 0이면 아래 등급으로 내려갑니다.',
  lbHits:'정확히 맞춘 사람', hitsHint:'1등에 해당하는 “정확한 히트”만 셉니다. 참가자 화면에도 보입니다.',
  resetHits:'횟수 초기화', confirmHits:'정확히 맞춘 사람 수를 모두 0으로 할까요?',
  lbLog:'간단 기록', save:'저장', close:'닫기', on:'켜짐', off:'꺼짐', saved:'저장했습니다', langName:'한국어',
  fs:'전체화면', fsExit:'전체화면 종료', lbFsStart:'시작 시 전체화면',
  iosHint:'공유 → 홈 화면에 추가하면 전체화면으로 실행돼요',
  games:{
    center:{title:'정중앙 멈추기', help:'좌우로 움직이는 젤리를 정가운데에서 멈추세요.', unit:'거리', hit:'오늘 정중앙 맞춘 사람 {n}명'},
    target:{title:'과녁 맞추기', help:'움직이는 과녁의 정중앙에 젤리를 던지세요. 조금 앞서 누르면 됩니다.', unit:'거리', hit:'오늘 과녁 정중앙 맞춘 사람 {n}명'},
    stack:{title:'카피바라 탑 쌓기', help:'움직이는 블록을 타이밍 맞춰 떨어뜨려 높이 쌓으세요.', unit:'오차', hit:'오늘 완벽한 탑을 쌓은 사람 {n}명'},
    timing:{title:'타이밍 잡기', help:'카피바라가 돌아보면 바로 누르세요. 먼저 누르면 실격입니다.', unit:'ms', hit:'오늘 정확히 잡아낸 사람 {n}명'}
  },
  falseStart:'너무 빨랐어요!',
  metaCenter:'가운데에서 {v}',
  metaTarget:'중심에서 {v}',
  metaStack:'{h}층 · 완벽한 블록 {p}개',
  metaTiming:'{v}ms',
  plus:'+1'
},
en:{
  pack:'Event Minigames', helpPack:'Short party games — pick one to play.',
  start:'START', stop:'STOP', throw:'THROW', drop:'DROP', wait:'Ready…', now:'NOW!',
  next:'Next player', again:'Play again', back:'All games',
  rec:'Result', errExact:'Perfect!',
  tier:['1st','2nd','3rd','4th','Thanks'],
  stockLeft:'Left', fallen:'Out of stock, so the next prize was given', soldOut:'All prizes are gone',
  pinTitle:'Staff', pinWrong:'Wrong PIN', cancel:'Cancel',
  adTitle:'Event settings', lbStaff:'Staff must confirm next', lbSfx:'Sound', lbVib:'Vibration', lbMusic:'Music', lbVol:'Volume', lbPin:'4-digit PIN',
  lbShared:'Share prize stock', lbPrizes:'Prizes & limits', prizeHint:'Tighter 1st-place limit is harder. Leave stock blank for unlimited. Stock 0 falls to the next prize.',
  lbHits:'Perfect hits', hitsHint:'Only exact 1st-place hits are counted, and the count is shown to players.',
  resetHits:'Reset counts', confirmHits:'Reset every perfect-hit count to 0?',
  lbLog:'Log', save:'Save', close:'Close', on:'ON', off:'OFF', saved:'Saved', langName:'English',
  fs:'Full screen', fsExit:'Exit full screen', lbFsStart:'Full screen on Start',
  iosHint:'Share → Add to Home Screen to play full screen',
  games:{
    center:{title:'Stop in the Center', help:'Stop the sliding gummy right in the middle.', unit:'dist', hit:'{n} perfect center hits today'},
    target:{title:'Hit the Target', help:'Throw a gummy at the bullseye of the moving target. Lead it a little.', unit:'dist', hit:'{n} bullseyes today'},
    stack:{title:'Capybara Tower', help:'Tap to drop blocks and stack them as high as you can.', unit:'err', hit:'{n} perfect towers today'},
    timing:{title:'Quick Turn', help:'Tap the moment the capybara turns around. Too early is a miss.', unit:'ms', hit:'{n} perfect reactions today'}
  },
  falseStart:'Too early!',
  metaCenter:'{v} from center', metaTarget:'{v} from center', metaStack:'{h} high · {p} perfect', metaTiming:'{v} ms',
  plus:'+1'
},
id:{
  pack:'Minigame Acara', helpPack:'Permainan singkat untuk acara — pilih satu.',
  start:'MULAI', stop:'BERHENTI', throw:'LEMPAR', drop:'JATUHKAN', wait:'Siap…', now:'SEKARANG!',
  next:'Peserta berikut', again:'Main lagi', back:'Semua game',
  rec:'Hasil', errExact:'Sempurna!',
  tier:['Juara 1','Juara 2','Juara 3','Juara 4','Hadiah trobosan'],
  stockLeft:'Sisa', fallen:'Stok habis, hadiah tingkat berikutnya diberikan', soldOut:'Semua hadiah habis',
  pinTitle:'Staf', pinWrong:'PIN salah', cancel:'Batal',
  adTitle:'Pengaturan acara', lbStaff:'Staf konfirmasi peserta berikut', lbSfx:'Suara', lbVib:'Getar', lbMusic:'Musik', lbVol:'Volume', lbPin:'PIN 4 digit',
  lbShared:'Stok hadiah bersama', lbPrizes:'Hadiah & batas', prizeHint:'Batas juara 1 lebih ketat. Kosongkan stok untuk tak terbatas. Stok 0 turun ke hadiah berikutnya.',
  lbHits:'Tembakan tepat', hitsHint:'Hanya juara 1 (tepat) yang dihitung, dan tampil di layar pemain.',
  resetHits:'Reset hitungan', confirmHits:'Reset semua hitungan tepat ke 0?',
  lbLog:'Catatan', save:'Simpan', close:'Tutup', on:'NYALA', off:'MATI', saved:'Tersimpan', langName:'Bahasa Indonesia',
  fs:'Layar penuh', fsExit:'Keluar layar penuh', lbFsStart:'Layar penuh saat Mulai',
  iosHint:'Bagikan → Tambah ke Layar Utama untuk tampilan penuh',
  games:{
    center:{title:'Berhenti di Tengah', help:'Hentikan permen di tepat tengah.', unit:'jarak', hit:'{n} orang tepat di tengah hari ini'},
    target:{title:'Lempar Sasaran', help:'Lempar permen ke pusat sasaran yang bergerak.', unit:'jarak', hit:'{n} tembakan tepat hari ini'},
    stack:{title:'Menara Capybara', help:'Jatuhkan blok dan tumpuk setinggi mungkin.', unit:'selisih', hit:'{n} menara sempurna hari ini'},
    timing:{title:'Giliran Cepat', help:'Ketuk saat capybara berbalik. Terlalu cepat = gagal.', unit:'ms', hit:'{n} reaksi tepat hari ini'}
  },
  falseStart:'Terlalu cepat!',
  metaCenter:'{v} dari tengah', metaTarget:'{v} dari tengah', metaStack:'{h} tingkat · {p} sempurna', metaTiming:'{v} ms',
  plus:'+1'
}
};

function detectGame(){
  var q=/[?&]g=(center|target|stack|timing)/.exec(location.search); if(q)return q[1];
  var d=document.body.getAttribute('data-game'); if(d&&d!=='launcher')return d;
  var p=location.pathname||'';
  var m=p.match(/\/(center|target|stack|timing)(?:\/|\/index\.html)?$/);
  return m?m[1]:'launcher';
}
function detectLang(){
  var q=/[?&]lang=(en|id|ko)/.exec(location.search);if(q)return q[1];
  try{var s=JSON.parse(localStorage.getItem(LS_CFG)||'{}');if(s.lang&&LANGS.indexOf(s.lang)>=0)return s.lang}catch(e){}
  var ls=navigator.languages&&navigator.languages.length?navigator.languages:[navigator.language||'ko'];
  for(var i=0;i<ls.length;i++){var l=(ls[i]||'').toLowerCase();if(/^(id|in|ms)\b/.test(l))return'id';if(/^ko\b/.test(l))return'ko';if(/^en\b/.test(l))return'en'}
  return'ko';
}
function loadCfg(){try{return L.mergeCfg(JSON.parse(localStorage.getItem(LS_CFG)||'null'))}catch(e){return L.defaultCfg()}}
function saveCfg(c){try{localStorage.setItem(LS_CFG,JSON.stringify(c))}catch(e){}}
function loadHits(){try{return L.mergeHits(JSON.parse(localStorage.getItem(LS_HITS)||'null'))}catch(e){return L.defaultHits()}}
function saveHits(h){try{localStorage.setItem(LS_HITS,JSON.stringify(h))}catch(e){}}

var cfg=loadCfg(), hits=loadHits(), lang=cfg.lang||detectLang(), T=I18N[lang]||I18N.ko;
var GAME=detectGame(), mode='title', raf=0, lastAward=null, pinBuf='', GPlay=window.EGGames(window);
var $=function(id){return document.getElementById(id)};
window.EG={cfg:cfg, LOW:LOW, lang:lang, game:GAME};

function t(k){return T[k]||I18N.ko[k]||k}
function gT(id,k){return (T.games[id]||I18N.ko.games[id])[k]}
function hitText(id,n){return gT(id,'hit').replace('{n}', String(n|0));}

/* chrome */
function isIOS(){var ua=navigator.userAgent||'';return /iPad|iPhone|iPod/.test(ua)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1)}
function isStandalone(){return window.navigator.standalone===true||(window.matchMedia&&(matchMedia('(display-mode: standalone)').matches||matchMedia('(display-mode: fullscreen)').matches))}
function canFS(){if(window.Android)return false;if(isIOS())return false;var el=document.documentElement;return !!(el.requestFullscreen||el.webkitRequestFullscreen||el.webkitRequestFullScreen)}
function isFS(){return !!(document.fullscreenElement||document.webkitFullscreenElement||document.webkitIsFullScreen)}
function enterFS(){
  if(!canFS()||isFS())return;
  var opts={navigationUI:'hide'};
  function req(node){
    var fn=node&&(node.requestFullscreen||node.webkitRequestFullscreen||node.webkitRequestFullScreen);
    if(!fn)return Promise.reject(new Error('no fs'));
    try{var p=fn.call(node,opts);return (p&&typeof p.then==='function')?p:Promise.resolve()}
    catch(e){return Promise.reject(e)}
  }
  req(document.documentElement).catch(function(){return req(document.body)}).catch(function(){});
}
function exitFS(){var ex=document.exitFullscreen||document.webkitExitFullscreen||document.webkitCancelFullScreen;if(ex)try{ex.call(document)}catch(e){}}
function toggleFS(ev){if(ev){ev.stopPropagation()}if(isFS())exitFS();else enterFS()}
function updateFSUI(){
  var b=$('btnFS'); if(!b)return;
  var show=canFS(); b.classList.toggle('hide',!show); b.classList.toggle('on',isFS());
  b.setAttribute('aria-label',isFS()?t('fsExit'):t('fs')); b.textContent=isFS()?'⛶':'⛶';
}
function syncChrome(){
  updateFSUI();
  var hint=$('iosHint');
  if(hint){var show=isIOS()&&!isStandalone()&&mode==='title'; hint.classList.toggle('hide',!show);}
  var bm=$('btnBgm');
  if(bm){bm.classList.toggle('on',cfg.music);bm.classList.toggle('off',!cfg.music);bm.textContent=cfg.music?'♪':'♪̸';}
}
function fitH(){
  var vv=window.visualViewport,h=Math.round((vv&&vv.height)||window.innerHeight),top=vv?Math.round(vv.offsetTop):0;
  document.documentElement.style.setProperty('--app-h',h+'px');
  document.documentElement.style.setProperty('--app-top',top+'px');
}
function vibe(ms){
  if(!cfg.vib)return;
  try{if(window.Android&&Android.vibrate)Android.vibrate(ms)}catch(e){}
  try{if(navigator.vibrate)navigator.vibrate(ms)}catch(e){}
}
function keepOn(on){try{if(window.Android&&Android.keepScreenOn)Android.keepScreenOn(!!on)}catch(e){}}

function applyLang(){
  T=I18N[lang]||I18N.ko; cfg.lang=lang; window.EG.lang=lang;
  document.documentElement.lang=lang;
  var chip=$('chipLang'); if(chip)chip.textContent=t('langName');
  if($('pinTitle'))$('pinTitle').textContent=t('pinTitle');
  if($('pinCancel'))$('pinCancel').textContent=t('cancel');
  if($('adTitle'))$('adTitle').textContent=t('adTitle');
  if($('adSave'))$('adSave').textContent=t('save');
  if($('adClose'))$('adClose').textContent=t('close');
  if($('adHits'))$('adHits').textContent=t('resetHits');
  if(GAME==='launcher'){
    if($('title'))$('title').textContent=t('pack');
    if($('help'))$('help').textContent=t('helpPack');
    L.GAMES.forEach(function(id){
      var el=$('gt-'+id); if(el)el.textContent=gT(id,'title');
      var h=$('gh-'+id); if(h)h.textContent=hitText(id,hits[id]||0);
    });
    if($('go'))$('go').classList.add('hide');
    if($('homeBtn'))$('homeBtn').classList.add('hide');
  } else {
    if($('title'))$('title').textContent=gT(GAME,'title');
    if($('help'))$('help').textContent=gT(GAME,'help');
    if($('homeBtn')){$('homeBtn').classList.remove('hide');$('homeBtn').textContent=t('back');}
    if($('go')&&mode==='title'){$('go').classList.remove('hide','stop','wide');$('go').textContent=t('start');}
  }
  updateHitBadge();
  if($('iosHint'))$('iosHint').textContent=t('iosHint');
  syncChrome();
}
function updateHitBadge(pop){
  var el=$('hitBadge'); if(!el)return;
  if(GAME==='launcher'){el.classList.add('hide');return;}
  el.classList.remove('hide');
  el.innerHTML=hitText(GAME,hits[GAME]||0).replace(/(\d+)/,'<b>$1</b>');
  if(pop){el.classList.remove('pop');void el.offsetWidth;el.classList.add('pop');}
}
function showPlus(){
  var el=$('hitFloat'); if(!el)return;
  el.textContent=t('plus');
  el.classList.remove('on');void el.offsetWidth;el.classList.add('on');
}

function cycleLang(){var i=LANGS.indexOf(lang);lang=LANGS[(i+1)%LANGS.length];cfg.lang=lang;saveCfg(cfg);applyLang();}
function toggleMusic(){cfg.music=!cfg.music;saveCfg(cfg);if(cfg.music){A.unlock();A.playBgm(GAME);}else A.stopBgm();syncChrome();}

/* modes */
function capyState(){
  var now=performance.now()/1000;
  if(mode==='title') return {t:now,act:'idle'};
  if(mode==='run'){
    if(GAME==='center'){var s=GPlay.state(); return {t:now,act:'play',look:(s&&(s.pos-0.5)*2)||0,sweat:1};}
    if(GAME==='timing') return {t:now,act:'play'};
    return {t:now,act:'play'};
  }
  if(lastAward){
    if(lastAward.index===0) return {t:now,act:'win1',crown:true,snack:'gummy'};
    if(lastAward.index>0&&lastAward.index<=3) return {t:now,act:'win',snack:'candy'};
    return {t:now,act:'lose'};
  }
  return {t:now,act:'idle'};
}
function loop(){
  raf=requestAnimationFrame(loop);
  var play=$('play'); if(!play)return;
  if(GAME==='launcher'){
    // previews
    L.GAMES.forEach(function(id){
      var cv=$('pv-'+id); if(!cv)return;
      GPlay.drawPreview(cv,id,performance.now()/1000);
    });
    return;
  }
  if(mode==='run'){
    var done=GPlay.tick();
    if(GAME==='center'||GAME==='stack'){/* continuous */}
    GPlay.draw(play, capyState());
    if(done) finish();
  } else {
    if(mode==='title'){
      var S=GPlay.sizePlay(play), c=S.c,w=S.w,h=S.h;
      c.clearRect(0,0,w,h);
      var Lyt=GPlay.playLayout(w,h), st=capyState(), box=D.capyBox(st);
      var y1=Lyt.y1;
      if(!Lyt.land){
        ['title','help','go','homeBtn'].forEach(function(id){
          var el=document.getElementById(id);
          if(!el||el.classList.contains('hide'))return;
          var top=el.getBoundingClientRect().top;
          if(top>40) y1=Math.min(y1, top-12);
        });
      }
      var prefer=Lyt.land? Math.min((y1-Lyt.y0)*0.90, Lyt.h*0.42) : Math.min((y1-Lyt.y0)*0.90, Lyt.h*0.28);
      var x1=Lyt.land? Lyt.x0+Lyt.pw*0.56 : Lyt.x1;
      var xWant=Lyt.land? Lyt.x0+Lyt.pw*0.30 : w*0.5;
      var sc=D.fitCapyInRect(Lyt.x0,Lyt.y0,x1,y1, box, prefer);
      var pos=D.placeCapyInRect(Lyt.x0,Lyt.y0,x1,y1, box, sc, xWant, y1-4);
      D.drawCapy(c,pos.x,pos.y,pos.s,st);
    } else {
      GPlay.draw(play, capyState());
    }
  }
}
function goLabel(){
  if(GAME==='target')return t('throw');
  if(GAME==='stack')return t('drop');
  if(GAME==='timing')return t('now');
  return t('stop');
}
function startRun(ev){
  if(ev){ev.preventDefault();ev.stopPropagation();}
  A.unlock();
  if(cfg.fsOnStart)enterFS();
  mode='run'; document.body.classList.add('playing');
  lastAward=null;
  $('result').classList.add('hide');
  $('go').classList.remove('hide'); $('go').classList.add('stop'); $('go').textContent=goLabel();
  if(GAME==='stack')$('go').classList.add('wide');
  GPlay.start(GAME);
  A.sfxStart(); vibe(18); keepOn(true); syncChrome(); A.playBgm(GAME);
}
function onPlayTap(ev){
  if(mode!=='run')return;
  if(ev&&ev.target&&(ev.target.closest&&ev.target.closest('#logo,#topRight,#admin,#pin')))return;
  ev&&ev.preventDefault();
  A.sfxTap(); vibe(12);
  var finished=GPlay.tap();
  if(finished) finish();
}
function finish(){
  if(mode!=='run')return;
  mode='result'; document.body.classList.remove('playing'); document.body.classList.add('result');
  keepOn(false);
  var r=GPlay.result();
  var a=L.applyAward(GAME, r.err, cfg, /*log*/[], {falseStart:!!r.falseStart});
  lastAward=a; saveCfg(cfg);
  if(a.index===0){
    L.bumpExact(hits,GAME); saveHits(hits);
    updateHitBadge(true); showPlus();
  }
  renderResult(a,r);
  A.sfxWin(a.index);
  if(a.index===0)vibe(70); else if(a.index>0&&a.index<=3)vibe(40); else vibe(20);
  burst(a.index===0?'gold':(a.index>0&&a.index<=3?'ok':'soft'));
  $('go').classList.add('hide');
  syncChrome();
}
function fmt(v,game){
  if(game==='timing')return Math.round(v);
  return (Math.round(v*1000)/1000).toFixed(3).replace(/0+$/,'').replace(/\.$/,'');
}
function renderResult(a,r){
  var box=$('result'); box.classList.remove('hide');
  var tier=$('tier'), prize=$('prize'), meta=$('meta'), fallen=$('fallen'), next=$('next');
  var idx=a.index<0?4:a.index;
  if(a.soldOut){tier.textContent=t('soldOut'); prize.textContent=a.prize.name; prize.className='t-1';}
  else {tier.textContent=t('tier')[idx]; prize.textContent=a.prize.name; prize.className='t'+idx;}
  var m='';
  if(a.falseStart) m=t('falseStart');
  else if(GAME==='center') m=t('metaCenter').replace('{v}',fmt(a.err,GAME));
  else if(GAME==='target') m=t('metaTarget').replace('{v}',fmt(a.err,GAME));
  else if(GAME==='stack'&&r&&r.meta) m=t('metaStack').replace('{h}',r.meta.height).replace('{p}',r.meta.perfects);
  else if(GAME==='timing') m=t('metaTiming').replace('{v}',fmt(a.err,GAME));
  meta.innerHTML=m;
  if(a.fallen&&!a.soldOut){fallen.classList.remove('hide');fallen.textContent=t('fallen');}
  else fallen.classList.add('hide');
  next.textContent=cfg.staffReset?t('next'):t('again');
}
function showTitle(){
  mode='title'; lastAward=null; document.body.classList.remove('playing','result');
  $('result').classList.add('hide');
  if(GAME!=='launcher'){$('go').classList.remove('hide','stop','wide');$('go').textContent=t('start');}
  applyLang(); keepOn(false);
}

/* confetti candy */
var bits=[], fxR=0, fx, fxx;
function sizeFx(){fx=$('fx'); if(!fx)return; fxx=fx.getContext('2d'); var d=LOW?1:Math.min(2,devicePixelRatio||1);fx.width=innerWidth*d;fx.height=innerHeight*d;fxx.setTransform(d,0,0,d,0,0)}
function burst(kind){
  bits=[]; var n=LOW?16:(kind==='gold'?70:kind==='soft'?28:48);
  for(var i=0;i<n;i++) bits.push({x:innerWidth*(.15+Math.random()*.7),y:-20-Math.random()*40,v:2+Math.random()*5,vx:(Math.random()-.5)*4,s:.5+Math.random()*1,rot:Math.random()*6,vr:(Math.random()-.5)*.3,k:['gummy','gummy-yel','gummy-grn','candy','lolly','chew'][(Math.random()*6)|0]});
  if(!fxR)fxR=requestAnimationFrame(tickFx);
}
function tickFx(){
  if(!fxx){fxR=0;return;}
  fxx.clearRect(0,0,innerWidth,innerHeight);
  var live=0;
  for(var i=0;i<bits.length;i++){
    var b=bits[i];if(!b)continue;b.y+=b.v;b.x+=b.vx;b.v+=0.08;b.rot+=b.vr;
    if(b.y>innerHeight+40){bits[i]=null;continue}live++;
    D.drawSnack(fxx,b.k,b.x,b.y,b.s,b.rot);
  }
  if(live)fxR=requestAnimationFrame(tickFx);else{fxR=0;fxx.clearRect(0,0,innerWidth,innerHeight)}
}

/* admin */
function showPin(){pinBuf='';$('pin').classList.remove('hide');$('pinShow').textContent='••••';$('pinErr').textContent='';}
function hidePin(){$('pin').classList.add('hide');pinBuf='';}
function buildPad(){
  var pad=$('pad'); if(!pad||pad.childElementCount)return;
  for(var i=1;i<=12;i++){
    var b=document.createElement('button'); b.type='button';
    var k=i<=9?String(i):i===10?'←':i===11?'0':'OK';
    b.textContent=k; pad.appendChild(b);
    b.addEventListener('click',function(k){return function(){pinKey(k)};}(k));
  }
}
function pinKey(k){
  if(k==='←'){pinBuf=pinBuf.slice(0,-1);}
  else if(k==='OK'){submitPin();return;}
  else if(pinBuf.length<4)pinBuf+=k;
  $('pinShow').textContent=pinBuf.length?pinBuf.replace(/./g,'•'):'••••';
  if(pinBuf.length===4)submitPin();
}
function submitPin(){
  if(pinBuf===cfg.pin){hidePin();openAdmin();vibe(20)}
  else{$('pinErr').textContent=t('pinWrong');pinBuf='';$('pinShow').textContent='••••';vibe(30)}
}
function setToggle(el,on){el.className='tg'+(on?' on':'');el.textContent=on?t('on'):t('off');el.setAttribute('aria-pressed',on?'true':'false')}
var adGame=GAME==='launcher'?'center':GAME;
function openAdmin(){
  $('admin').classList.remove('hide');
  setToggle($('tgStaff'),cfg.staffReset);
  setToggle($('tgSfx'),cfg.sfx);
  setToggle($('tgVib'),cfg.vib);
  setToggle($('tgMusic'),cfg.music);
  setToggle($('tgFsStart'),cfg.fsOnStart);
  setToggle($('tgShared'),cfg.sharedStock);
  $('inPin').value=cfg.pin; $('inVol').value=Math.round(cfg.vol*100);
  renderPrizeTable();
  renderHitsAdmin();
}
function renderHitsAdmin(){
  var box=$('hitsBox'); if(!box)return;
  box.innerHTML=L.GAMES.map(function(id){
    return '<div class="srow"><span>'+gT(id,'title')+'</span><b>'+(hits[id]||0)+'</b></div>';
  }).join('');
}
function renderPrizeTable(){
  var tb=$('pTable').querySelector('tbody'); tb.innerHTML='';
  var lim=cfg.games[adGame].limits;
  var names=t('tier');
  for(var i=0;i<5;i++){
    var tr=document.createElement('tr');
    var stock=cfg.sharedStock?cfg.prizes[i].stock:cfg.games[adGame].stock[i];
    tr.innerHTML='<td>'+names[i]+'</td>'+
      '<td><input data-k="name" data-i="'+i+'" value="'+String(cfg.prizes[i].name).replace(/"/g,'&quot;')+'"></td>'+
      (i<4?'<td><input data-k="lim" data-i="'+i+'" type="number" step="any" value="'+lim[i]+'"></td>':'<td>—</td>')+
      '<td><input data-k="stock" data-i="'+i+'" type="number" min="0" step="1" value="'+(stock==null?'':stock)+'"></td>';
    tb.appendChild(tr);
  }
  var tabs=$('gameTabs'); if(tabs){
    tabs.querySelectorAll('.tab').forEach(function(b){b.classList.toggle('on',b.getAttribute('data-g')===adGame)});
  }
}
function readAdminForm(){
  var next=L.mergeCfg(cfg);
  next.staffReset=$('tgStaff').classList.contains('on');
  next.sfx=$('tgSfx').classList.contains('on');
  next.vib=$('tgVib').classList.contains('on');
  next.music=$('tgMusic').classList.contains('on');
  next.fsOnStart=$('tgFsStart').classList.contains('on');
  next.sharedStock=$('tgShared').classList.contains('on');
  var pin=$('inPin').value; if(/^\d{4}$/.test(pin))next.pin=pin;
  var v=Number($('inVol').value); if(isFinite(v))next.vol=Math.max(0,Math.min(1,v/100));
  next.prizes=next.prizes||L.defaultCfg().prizes;
  var ins=$('pTable').querySelectorAll('input');
  ins.forEach(function(inp){
    var i=+inp.getAttribute('data-i'), k=inp.getAttribute('data-k'), val=inp.value;
    if(k==='name'&&val.trim())next.prizes[i].name=val.trim().slice(0,40);
    if(k==='lim'){var m=Number(val);if(isFinite(m)&&m>=0)next.games[adGame].limits[i]=m;}
    if(k==='stock'){
      var s=(val===''||val==null)?null:Number(val);
      s=(s==null||!isFinite(s))?null:Math.max(0,Math.floor(s));
      if(next.sharedStock)next.prizes[i].stock=s;
      else next.games[adGame].stock[i]=s;
    }
  });
  return next;
}
function saveAdmin(){cfg=readAdminForm();window.EG.cfg=cfg;saveCfg(cfg);openAdmin();applyLang();A.setVol();if(cfg.music)A.playBgm(GAME);else A.stopBgm();}
function closeAdmin(){$('admin').classList.add('hide');}

function goHome(){
  if(GAME==='launcher')return;
  location.href=document.body.getAttribute('data-base')||window.EG_BASE||'../';
}

/* boot */
function boot(){
  window.EG_BASE=document.body.getAttribute('data-base')||'./';
  // logo
  var img=$('logoImg');
  if(img){
    img.src=window.EG_BASE+'assets/smg_logo.png';
    img.onerror=function(){img.classList.add('hide');var fb=$('logoText');if(fb)fb.classList.remove('hide');};
  }
  fitH(); sizeFx(); applyLang();
  buildPad();
  if(GAME==='launcher')$('grid').classList.remove('hide');
  else $('grid').classList.add('hide');

  $('btnFS').addEventListener('click',toggleFS);
  $('chipLang').addEventListener('click',cycleLang);
  $('btnBgm').addEventListener('click',function(e){e.preventDefault();toggleMusic();});
  $('go').addEventListener('pointerdown',function(e){
    e.preventDefault(); A.unlock();
    if(mode==='title') startRun(e);
    else if(mode==='run') onPlayTap(e);
  });
  $('next').addEventListener('pointerdown',function(e){e.preventDefault();showTitle();});
  $('homeBtn').addEventListener('click',function(e){e.preventDefault();goHome();});
  $('play').style.pointerEvents='none';
  document.addEventListener('pointerdown',function(e){
    A.unlock();
    if(mode==='run'){
      var t=e.target;
      if(t&&t.closest&&t.closest('#logo,#topRight,#go,#admin,#pin,.ov'))return;
      onPlayTap(e);
    }
  },{passive:false});

  var lpOn=false,lpT=0;
  function lpClear(){lpOn=false;if(lpT){clearTimeout(lpT);lpT=0}}
  $('logo').addEventListener('pointerdown',function(e){e.preventDefault();lpOn=true;lpT=setTimeout(function(){if(lpOn){vibe(20);showPin()}},1200)});
  ['pointerup','pointercancel','pointerleave'].forEach(function(ev){$('logo').addEventListener(ev,lpClear)});
  $('pinCancel').addEventListener('click',hidePin);
  $('adSave').addEventListener('click',saveAdmin);
  $('adClose').addEventListener('click',closeAdmin);
  $('tgStaff').addEventListener('click',function(){setToggle(this,!this.classList.contains('on'))});
  $('tgSfx').addEventListener('click',function(){setToggle(this,!this.classList.contains('on'))});
  $('tgVib').addEventListener('click',function(){setToggle(this,!this.classList.contains('on'))});
  $('tgMusic').addEventListener('click',function(){setToggle(this,!this.classList.contains('on'))});
  $('tgFsStart').addEventListener('click',function(){setToggle(this,!this.classList.contains('on'))});
  $('tgShared').addEventListener('click',function(){setToggle(this,!this.classList.contains('on'))});
  $('adHits').addEventListener('click',function(){
    if(!confirm(t('confirmHits')))return;
    hits=L.resetHits(hits); saveHits(hits); renderHitsAdmin(); updateHitBadge(); applyLang();
  });
  if($('gameTabs')){
    $('gameTabs').addEventListener('click',function(e){
      var b=e.target.closest('.tab'); if(!b)return; adGame=b.getAttribute('data-g'); renderPrizeTable();
    });
  }
  L.GAMES.forEach(function(id){
    var a=$('gc-'+id); if(!a)return;
    a.addEventListener('click',function(e){
      // allow default nav
      A.unlock();
    });
  });
  ['fullscreenchange','webkitfullscreenchange'].forEach(function(ev){document.addEventListener(ev,updateFSUI)});
  addEventListener('resize',function(){fitH();sizeFx();},{passive:true});
  if(window.visualViewport){visualViewport.addEventListener('resize',fitH);visualViewport.addEventListener('scroll',fitH);}
  window.onAndroidBack=function(){
    if(!$('admin').classList.contains('hide')){closeAdmin();return' stay'}
    if(!$('pin').classList.contains('hide')){hidePin();return' stay'}
    if(mode==='run'||mode==='result'){showTitle();return' stay'}
    if(GAME!=='launcher'){goHome();return' stay'}
    return'exit';
  };
  if('serviceWorker' in navigator&&location.protocol!=='file:'&&!/[?&]nosw=1/.test(location.search)){
    navigator.serviceWorker.register(window.EG_BASE+'sw.js',{scope:window.EG_BASE});
  }
  A.playBgm(GAME);
  if(!raf)loop();

  window.__eg={
    lang:function(){return lang},
    GAME:GAME, defaultCfg:L.defaultCfg, mergeCfg:L.mergeCfg, awardPrize:L.awardPrize, applyAward:L.applyAward,
    pickTierIndex:L.pickTierIndex, loadHits:loadHits, hits:function(){return hits}, bumpExact:function(id){L.bumpExact(hits,id||GAME);saveHits(hits);updateHitBadge(true);showPlus();},
    resetHits:function(){hits=L.resetHits(hits);saveHits(hits);updateHitBadge();},
    startRun:startRun, finish:function(){ /* force */ if(mode!=='run')GPlay.start(GAME); finish(); },
    forceResult:function(err,opt){
      if(!GPlay.state()) GPlay.start(GAME);
      var s=GPlay.state();
      if(s){
        if(GAME==='center'){s.stopped=true;s.pos=0.5;s.err=err||0;}
        if(GAME==='target'){s.thrown=true;s.flying=false;s.hit={dist:err||0};s.err=err||0;s.land={x:0,y:0};s.shot=s.hit;}
        if(GAME==='stack'){
          var n=L.STACK_N||7, drops=[], i;
          for(i=0;i<n;i++) drops.push({width:1,x:0,miss:false,perfect:true});
          s.done=true;s.waiting=false;s.falling=false;s.drops=drops;
          s.score=L.stackScore(drops); s.err=err||0;
        }
        if(GAME==='timing'){s.turned=true;s.done=true;s.falseStart=false;s.err=err||0;s.rt=err||0;s.u0=performance.now()-400;s.turnAt=s.u0;}
      }
      mode='result'; var a=L.applyAward(GAME,err,cfg,[],opt||{}); lastAward=a; saveCfg(cfg);
      if(a.index===0){L.bumpExact(hits,GAME);saveHits(hits);updateHitBadge(true);showPlus();}
      var meta=opt&&opt.meta; if(!meta&&s&&s.score) meta=s.score;
      renderResult(a,{err:err,meta:meta,falseStart:opt&&opt.falseStart});
      burst(a.index===0?'gold':(a.index>0&&a.index<=3?'ok':'soft'));
      document.body.classList.remove('playing'); document.body.classList.add('result'); $('go').classList.add('hide');
      var play=$('play'); if(play) GPlay.draw(play, capyState());
    },
    showTitle:showTitle, openAdmin:function(bypass){if(bypass&&/[?&](nosw|test)=1/.test(location.search))openAdmin();else showPin()},
    setLang:function(l){if(LANGS.indexOf(l)>=0){lang=l;cfg.lang=l;applyLang()}},
    isIOS:isIOS, canFS:canFS, isStandalone:isStandalone, cfg:function(){return cfg},
    t:t, hitText:hitText, playBgm:function(){A.playBgm(GAME)}
  };
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);
else boot();
})();

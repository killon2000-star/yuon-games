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
  start:'시작', stop:'정지', throw:'던지기', drop:'놓기', jumpBtn:'점프', grab:'집기', wait:'준비…', now:'지금!',
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
    center:{title:'정중앙 멈추기', help:'시작을 누른 뒤, 좌우로 움직이는 젤리가 가운데 분홍 선에 왔을 때 정지를 누르세요.', unit:'거리', hit:'오늘 정중앙 맞춘 사람 {n}명'},
    target:{title:'과녁 맞추기', help:'시작 후 과녁이 움직입니다. 한가운데를 노리고, 조금 일찍 던지기를 누르세요.', unit:'거리', hit:'오늘 과녁 정중앙 맞춘 사람 {n}명'},
    stack:{title:'카피바라 탑 쌓기', help:'시작을 누르면 블록이 좌우로 움직입니다. 아래 탑과 맞춰 떨어뜨려 7층을 쌓으세요.', unit:'오차', hit:'오늘 완벽한 탑을 쌓은 사람 {n}명'},
    timing:{title:'타이밍 잡기', help:'카피바라가 등을 보입니다. 갑자기 돌아보는 순간 바로 지금! 을 누르세요. 먼저 누르면 실격입니다.', unit:'ms', hit:'오늘 정확히 잡아낸 사람 {n}명'},
    weight:{title:'과자 무게 맞추기', help:'시작을 누른 뒤, 저울 바늘이 100g에 왔을 때 정지를 누르세요.', unit:'g', hit:'오늘 100g을 맞춘 사람 {n}명'},
    jump:{title:'카피바라 점프', help:'달려오는 카피바라가 상자 앞에서 점프하도록, 한 번 눌러 주세요.', unit:'초', hit:'오늘 완벽한 점프를 한 사람 {n}명'},
    crane:{title:'사탕 뽑기 크레인', help:'집게가 황금 사탕 위에 왔을 때 집기를 누르세요.', unit:'거리', hit:'오늘 황금 사탕을 집은 사람 {n}명'}
  },
  falseStart:'너무 빨랐어요!',
  metaCenter:'가운데에서 {v}',
  metaTarget:'중심에서 {v}',
  metaStack:'{h}층 · 완벽한 블록 {p}개',
  metaTiming:'{v}ms',
  plus:'+1', prizePrev:'1등 상품: {n}', floorUnit:'층',
  metaWeight:'{v}g', metaJump:'{v}', metaCrane:'목표에서 {v}',
  grade:['PERFECT','GREAT','GOOD','NICE','MISS'], gramUnit:'g', jumpFast:'초 빠름', jumpSlow:'초 늦음'
},
en:{
  pack:'Event Minigames', helpPack:'Short party games — pick one to play.',
  start:'START', stop:'STOP', throw:'THROW', drop:'DROP', jumpBtn:'JUMP', grab:'GRAB', wait:'Ready…', now:'NOW!',
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
    center:{title:'Stop in the Center', help:'Press Start, then press Stop when the sliding gummy hits the pink center line.', unit:'dist', hit:'{n} perfect center hits today'},
    target:{title:'Hit the Target', help:'After Start, throw a little early so the gummy meets the moving bullseye.', unit:'dist', hit:'{n} bullseyes today'},
    stack:{title:'Capybara Tower', help:'Press Start, then drop each moving block so it lines up. Stack all 7 floors.', unit:'err', hit:'{n} perfect towers today'},
    timing:{title:'Quick Turn', help:'The capybara faces away. Tap NOW! the instant it turns around. Too early is a miss.', unit:'ms', hit:'{n} perfect reactions today'},
    weight:{title:'Snack Scale', help:'Press Start, then press Stop when the needle hits 100g.', unit:'g', hit:'{n} perfect 100g stops today'},
    jump:{title:'Capybara Jump', help:'Tap once so the running capybara jumps over the crate.', unit:'sec', hit:'{n} perfect jumps today'},
    crane:{title:'Candy Crane', help:'Press Grab when the claw is over the golden candy.', unit:'dist', hit:'{n} golden catches today'}
  },
  falseStart:'Too early!',
  metaCenter:'{v} from center', metaTarget:'{v} from center', metaStack:'{h} high · {p} perfect', metaTiming:'{v} ms',
  plus:'+1', prizePrev:'1st prize: {n}', floorUnit:'F',
  metaWeight:'{v}g', metaJump:'{v}', metaCrane:'{v} from target',
  grade:['PERFECT','GREAT','GOOD','NICE','MISS'], gramUnit:'g', jumpFast:'s early', jumpSlow:'s late'
},
id:{
  pack:'Minigame Acara', helpPack:'Permainan singkat untuk acara — pilih satu.',
  start:'MULAI', stop:'BERHENTI', throw:'LEMPAR', drop:'JATUHKAN', jumpBtn:'LOMPAT', grab:'AMBIL', wait:'Siap…', now:'SEKARANG!',
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
    center:{title:'Berhenti di Tengah', help:'Tekan Mulai, lalu tekan Berhenti saat permen tepat di garis tengah.', unit:'jarak', hit:'{n} orang tepat di tengah hari ini'},
    target:{title:'Lempar Sasaran', help:'Setelah Mulai, lempar sedikit lebih awal agar mengenai pusat sasaran.', unit:'jarak', hit:'{n} tembakan tepat hari ini'},
    stack:{title:'Menara Capybara', help:'Tekan Mulai, lalu jatuhkan blok agar sejajar. Tumpuk 7 lantai.', unit:'selisih', hit:'{n} menara sempurna hari ini'},
    timing:{title:'Giliran Cepat', help:'Capybara memunggungi Anda. Ketuk SEKARANG! saat ia berbalik. Terlalu cepat = gagal.', unit:'ms', hit:'{n} reaksi tepat hari ini'},
    weight:{title:'Timbang Permen', help:'Tekan Mulai, lalu tekan Berhenti saat jarum di 100g.', unit:'g', hit:'{n} orang tepat 100g hari ini'},
    jump:{title:'Lompat Capybara', help:'Ketuk sekali agar capybara lompat melewati kotak.', unit:'dtk', hit:'{n} lompatan sempurna hari ini'},
    crane:{title:'Derek Permen', help:'Tekan Ambil saat capit di atas permen emas.', unit:'jarak', hit:'{n} tangkapan emas hari ini'}
  },
  falseStart:'Terlalu cepat!',
  metaCenter:'{v} dari tengah', metaTarget:'{v} dari tengah', metaStack:'{h} tingkat · {p} sempurna', metaTiming:'{v} ms',
  plus:'+1', prizePrev:'Hadiah juara 1: {n}', floorUnit:'lt',
  metaWeight:'{v}g', metaJump:'{v}', metaCrane:'{v} dari sasaran',
  grade:['PERFECT','GREAT','GOOD','NICE','MISS'], gramUnit:'g', jumpFast:' dtk lebih cepat', jumpSlow:' dtk lebih lambat'
}
};

function detectGame(){
  var q=/[?&]g=(center|target|stack|timing|weight|jump|crane)/.exec(location.search); if(q)return q[1];
  var d=document.body.getAttribute('data-game'); if(d&&d!=='launcher')return d;
  var p=location.pathname||'';
  var m=p.match(/\/(center|target|stack|timing|weight|jump|crane)(?:\/|\/index\.html)?$/);
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
var GAME=detectGame(), mode='title', raf=0, lastAward=null, lastResult=null, pinBuf='', GPlay=window.EGGames(window);
var revealing=false, revealT=0, ignoreClick=0, REVEAL_HOLD=2.5, recAnim=0;
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
function measureChrome(){
  var bot=0;
  ['logo','topRight'].forEach(function(id){
    var el=$(id); if(!el)return;
    var r=el.getBoundingClientRect();
    if(r.bottom>bot) bot=r.bottom;
  });
  var h=Math.max(84, Math.ceil(bot+10));
  document.documentElement.style.setProperty('--chrome-h', h+'px');
  return h;
}
function chromeSafe(){
  var v=parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--chrome-h'));
  return isFinite(v)&&v>0?v:92;
}
function fitH(){
  var vv=window.visualViewport,h=Math.round((vv&&vv.height)||window.innerHeight),top=vv?Math.round(vv.offsetTop):0;
  document.documentElement.style.setProperty('--app-h',h+'px');
  document.documentElement.style.setProperty('--app-top',top+'px');
  measureChrome();
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
    (L.LAUNCHER_GAMES||L.GAMES).forEach(function(id){
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
    fillPrizesPreview();
  }
  updateHitBadge();
  if($('iosHint'))$('iosHint').textContent=t('iosHint');
  syncChrome();
  measureChrome();
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
    (L.LAUNCHER_GAMES||L.GAMES).forEach(function(id){
      var cv=$('pv-'+id); if(!cv)return;
      GPlay.drawPreview(cv,id,performance.now()/1000);
    });
    if(play){
      var S=GPlay.sizePlay(play), c=S.c,w=S.w,h=S.h;
      c.clearRect(0,0,w,h);
      c.save();
      if(window.EGFx&&EGFx.applyCam) EGFx.applyCam(c);
      if(D.drawWorld) D.drawWorld(c,w,h,performance.now()/1000);
      var st={t:performance.now()/1000,act:'idle'};
      var box=D.capyBox(st), land=w>h*1.05;
      var y0=Math.max(h*0.18, chromeSafe()+8), y1=h*0.96;
      var x0=0, x1=land?w*0.40:w;
      var prefer=Math.min(h*(land?0.40:0.22), y1-y0);
      var sc=D.fitCapyInRect(x0,y0,x1,y1, box, prefer);
      var pos=D.placeCapyInRect(x0,y0,x1,y1, box, sc, land?w*0.18:w*0.5, y1-8);
      D.drawCapy(c,pos.x,pos.y,pos.s,st);
    }
    return;
  }
  if(mode==='run'){
    var done=false;
    if(!(window.EGFx&&EGFx.frozen&&EGFx.frozen())) done=GPlay.tick();
    if(GAME==='center'||GAME==='stack'){/* continuous */}
    GPlay.draw(play, capyState());
    if(done) finish();
  } else {
    if(mode==='title'){
      var S=GPlay.sizePlay(play), c=S.c,w=S.w,h=S.h;
      c.clearRect(0,0,w,h);
      if(D.drawWorld) D.drawWorld(c,w,h,performance.now()/1000);
      var Lyt=GPlay.playLayout(w,h), st=capyState(), box=D.capyBox(st);
      var y1=Lyt.y1;
      if(!Lyt.land){
        ['title','help','go','homeBtn','prizesPreview'].forEach(function(id){
          var el=document.getElementById(id);
          if(!el||el.classList.contains('hide'))return;
          var top=el.getBoundingClientRect().top;
          if(top>40) y1=Math.min(y1, top-12);
        });
      }
      var prefer=Lyt.land? Math.min((y1-Lyt.y0)*0.90, Lyt.h*0.32) : Math.min((y1-Lyt.y0)*0.90, Lyt.h*0.28);
      var x1=Lyt.land? Lyt.x0+Lyt.pw*0.56 : Lyt.x1;
      var xWant=Lyt.land? Lyt.x0+Lyt.pw*0.30 : w*0.5;
      var sc=D.fitCapyInRect(Lyt.x0,Lyt.y0,x1,y1, box, prefer);
      var pos=D.placeCapyInRect(Lyt.x0,Lyt.y0,x1,y1, box, sc, xWant, y1-4);
      D.drawCapy(c,pos.x,pos.y,pos.s,st);
      c.restore();
    } else {
      GPlay.draw(play, capyState());
    }
  }
}
function goLabel(){
  if(GAME==='target')return t('throw');
  if(GAME==='stack')return t('drop');
  if(GAME==='timing')return t('now');
  if(GAME==='jump')return t('jumpBtn');
  if(GAME==='crane')return t('grab');
  return t('stop');
}
function busy(){return revealing||mode==='reveal'}
function markPointer(){ignoreClick=performance.now()+450}
function clickFresh(){return performance.now()>=ignoreClick}
function ensureUi(){
  var stage=$('stage'); if(!stage)return;
  if(!$('recWrap')){
    var w=document.createElement('div');
    w.id='recWrap'; w.className='hide'; w.setAttribute('aria-live','polite');
    w.innerHTML='<div id="recLabel"></div><div id="recVal"><span id="recNum"></span><span id="recUnit"></span></div>';
    var res=$('result');
    if(res) stage.insertBefore(w,res); else stage.appendChild(w);
  }
  if(!$('grade')){
    var g=document.createElement('div'); g.id='grade'; g.className='hide';
    var rec=$('recWrap'); if(rec&&rec.parentNode) rec.parentNode.insertBefore(g, rec.nextSibling);
    else stage.appendChild(g);
  }
  if(!$('prizesPreview') && GAME!=='launcher'){
    var p=document.createElement('div');
    p.id='prizesPreview';
    var help=$('help');
    if(help&&help.parentNode) help.parentNode.insertBefore(p, help.nextSibling);
    else stage.insertBefore(p, stage.firstChild);
  }
}
function fillPrizesPreview(){
  var el=$('prizesPreview'); if(!el||GAME==='launcher')return;
  var list=L.prizeList?L.prizeList(cfg,GAME):((cfg.prizes)||[]);
  var p=list&&list[0];
  if(!p||!p.name){el.classList.add('hide');return;}
  el.classList.remove('hide');
  el.textContent=(t('prizePrev')||'1등 상품: {n}').replace('{n}', p.name);
}
function recordParts(a,r){
  if(a&&a.falseStart) return {label:t('rec'), num:t('falseStart'), unit:''};
  if(GAME==='timing') return {label:t('rec'), num:String(Math.round(a.err)), unit:'ms'};
  if(GAME==='stack'){
    var h=(r&&r.meta&&r.meta.height!=null)?r.meta.height:'-';
    return {label:t('rec'), num:String(h), unit:t('floorUnit')||'층', raw:Number(h)};
  }
  if(GAME==='weight'){
    var g=(r&&r.meta&&r.meta.grams!=null)?r.meta.grams:(100+(a&&a.err||0));
    if(a&&a.err<=1.5) return {label:t('rec'), num:t('errExact'), unit:''};
    return {label:t('rec'), num:(Math.round(g*10)/10).toString(), unit:t('gramUnit')||'g', raw:g};
  }
  if(GAME==='jump'){
    if(a&&a.err<=0.045) return {label:t('rec'), num:t('errExact'), unit:''};
    var late=r&&r.meta&&r.meta.late;
    return {label:t('rec'), num:fmt(a.err,'jump'), unit: late?t('jumpSlow'):t('jumpFast')};
  }
  if(GAME==='crane'){
    if(a&&a.err<=0.016) return {label:t('rec'), num:t('errExact'), unit:''};
    return {label:t('rec'), num:fmt(a.err,'crane'), unit:''};
  }
  if((GAME==='center'||GAME==='target') && a && a.err<=0.0025) return {label:t('rec'), num:t('errExact'), unit:''};
  return {label:t('rec'), num:fmt(a.err,GAME), unit:''};
}
function startCountUp(a,r){
  if(recAnim){cancelAnimationFrame(recAnim);recAnim=0}
  var parts=recordParts(a,r);
  if(parts.raw==null||!isFinite(parts.raw)) return;
  var from=GAME==='weight'?Math.max(0,parts.raw-20):0, to=parts.raw, t0=performance.now(), dur=400;
  function step(now){
    var u=Math.min(1,(now-t0)/dur); u=u*u*(3-2*u);
    var v=from+(to-from)*u;
    if($('recNum')){
      if(GAME==='weight') $('recNum').textContent=(Math.round(v*10)/10).toString();
      else if(GAME==='jump') $('recNum').textContent=fmt(v,'jump');
      else $('recNum').textContent=String(Math.round(v));
    }
    if(u<1) recAnim=requestAnimationFrame(step);
    else {recAnim=0; paintRecord(a,r,true);}
  }
  recAnim=requestAnimationFrame(step);
}
function paintRecord(a,r,big){
  ensureUi();
  var wrap=$('recWrap'); if(!wrap)return;
  var parts=recordParts(a,r);
  $('recLabel').textContent=parts.label;
  $('recNum').textContent=parts.num;
  $('recUnit').textContent=parts.unit||'';
  wrap.classList.toggle('hide', false);
  wrap.classList.toggle('big', !!big);
  wrap.classList.remove('pop'); void wrap.offsetWidth; wrap.classList.add('pop');
}
function clearReveal(){
  revealing=false;
  if(revealT){clearTimeout(revealT);revealT=0}
  document.body.classList.remove('reveal');
}
function startReveal(a,r){
  revealing=true; mode='reveal'; lastAward=a; lastResult=r;
  document.body.classList.remove('playing','result');
  document.body.classList.add('reveal');
  if($('result'))$('result').classList.add('hide');
  if($('go'))$('go').classList.add('hide');
  if($('grade'))$('grade').classList.add('hide');
  paintRecord(a,r,true);
  startCountUp(a,r);
  keepOn(true);
  try{A.sfxTap()}catch(e){}
  if(window.EGFx){ EGFx.punch(a.index===0?9:5, a.index===0?80:45); if(a.index===0) EGFx.slowmo(0.42,180); }
  syncChrome(); measureChrome();
  revealT=setTimeout(function(){revealT=0; showPrize(a,r);}, Math.round(REVEAL_HOLD*1000));
}
function showPrize(a,r,opts){
  opts=opts||{};
  clearReveal();
  mode='result';
  document.body.classList.remove('playing','reveal');
  document.body.classList.add('result');
  renderResult(a,r);
  paintRecord(a,r,true);
  if($('go'))$('go').classList.add('hide');
  if(a.index===0 && !opts.silent) showPlus();
  if(!opts.silent){
    A.sfxWin(a.index);
    if(a.index===0)vibe(70); else if(a.index>0&&a.index<=3)vibe(40); else vibe(20);
    burst(a.index===0?'gold':(a.index>0&&a.index<=3?'ok':'soft'));
  }
  keepOn(false);
  syncChrome(); measureChrome();
  if($('next')) try{$('next').focus()}catch(e){}
}
function startRun(ev){
  if(busy()||mode==='run')return;
  if(ev){ev.preventDefault();ev.stopPropagation();}
  clearReveal();
  A.unlock();
  if(cfg.fsOnStart)enterFS();
  mode='run'; document.body.classList.remove('result','reveal'); document.body.classList.add('playing');
  lastAward=null; lastResult=null;
  $('result').classList.add('hide');
  if($('recWrap'))$('recWrap').classList.add('hide');
  $('go').classList.remove('hide'); $('go').classList.add('stop'); $('go').textContent=goLabel();
  if(GAME==='stack')$('go').classList.add('wide');
  GPlay.start(GAME);
  A.sfxStart(); vibe(18); keepOn(true); syncChrome(); A.playBgm(GAME);
}
function onPlayTap(ev){
  if(busy()||mode!=='run')return;
  if(ev&&ev.target&&(ev.target.closest&&ev.target.closest('#logo,#topRight,#admin,#pin')))return;
  ev&&ev.preventDefault();
  A.sfxTap(); vibe(12);
  var finished=GPlay.tap();
  if(finished) finish();
}
function onGo(e){
  if(e){e.preventDefault(); if(e.stopPropagation)e.stopPropagation()}
  A.unlock();
  if(busy())return;
  if(mode==='title') startRun(e);
  else if(mode==='run') onPlayTap(e);
}
function finish(){
  if(mode!=='run')return;
  var r=GPlay.result();
  var a=L.applyAward(GAME, r.err, cfg, /*log*/[], {falseStart:!!r.falseStart});
  lastAward=a; lastResult=r; saveCfg(cfg);
  if(a.index===0){
    L.bumpExact(hits,GAME); saveHits(hits);
    updateHitBadge(true);
  }
  startReveal(a,r);
}
function fmt(v,game){
  if(game==='timing')return Math.round(v);
  if(game==='weight')return (Math.round(v*10)/10).toFixed(1).replace(/\.0$/,'');
  if(game==='jump')return (Math.round(v*1000)/1000).toFixed(3).replace(/0+$/,'').replace(/\.$/,'');
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
  else if(GAME==='weight') m=t('metaWeight').replace('{v}', (r&&r.meta&&r.meta.grams!=null)?fmt(r.meta.grams,'weight'):fmt(a.err,'weight'));
  else if(GAME==='jump') m=t('metaJump').replace('{v}', (a.err<=0.045)?t('errExact'):(fmt(a.err,'jump')+((r&&r.meta&&r.meta.late)?t('jumpSlow'):t('jumpFast'))));
  else if(GAME==='crane') m=t('metaCrane').replace('{v}',fmt(a.err,'crane'));
  meta.innerHTML=m;
  var grade=$('grade');
  if(grade){
    var gi=a.index<0||a.index>4?4:a.index;
    var labels=t('grade')||['PERFECT','GREAT','GOOD','NICE','MISS'];
    grade.textContent=labels[gi]||'';
    grade.className='g'+gi;
    grade.classList.remove('hide');
  }
  if(a.fallen&&!a.soldOut){fallen.classList.remove('hide');fallen.textContent=t('fallen');}
  else fallen.classList.add('hide');
  next.textContent=cfg.staffReset?t('next'):t('again');
}
function showTitle(){
  clearReveal();
  mode='title'; lastAward=null; lastResult=null;
  document.body.classList.remove('playing','result','reveal');
  $('result').classList.add('hide');
  if($('recWrap'))$('recWrap').classList.add('hide');
  if($('grade'))$('grade').classList.add('hide');
  if(window.EGFx&&EGFx.reset) EGFx.reset();
  if(recAnim){cancelAnimationFrame(recAnim);recAnim=0}
  if(GAME!=='launcher'){$('go').classList.remove('hide','stop','wide');$('go').textContent=t('start');}
  applyLang(); keepOn(false); measureChrome();
}

/* confetti candy */
var bits=[], fxR=0, fx, fxx;
function sizeFx(){fx=$('fx'); if(!fx)return; fxx=fx.getContext('2d'); var d=LOW?1:((window.EGFx&&EGFx.capDpr)?EGFx.capDpr():Math.min(2,devicePixelRatio||1));fx.width=innerWidth*d;fx.height=innerHeight*d;fxx.setTransform(d,0,0,d,0,0)}
function uiRects(){
  var ids=['logo','topRight','hitBadge','result','recWrap','grade','go','next','homeBtn','title','help','prizesPreview','grid'], out=[], i,el,s,r;
  for(i=0;i<ids.length;i++){
    el=$(ids[i]); if(!el||el.classList.contains('hide')) continue;
    s=getComputedStyle(el); if(s.display==='none'||s.visibility==='hidden'||parseFloat(s.opacity)===0) continue;
    r=el.getBoundingClientRect();
    if(r.width>2&&r.height>2) out.push({l:r.left-10,t:r.top-10,r:r.right+10,b:r.bottom+10});
  }
  return out;
}
function hitsUi(x,y,sc,rects){
  var pad=18*Math.max(0.7,sc||1), i,u;
  for(i=0;i<rects.length;i++){
    u=rects[i];
    if(x+pad>u.l && x-pad<u.r && y+pad>u.t && y-pad<u.b) return true;
  }
  return false;
}
function fxSafe(){
  var s=chromeSafe();
  var b=$('hitBadge');
  if(b && !b.classList.contains('hide')){
    var r=b.getBoundingClientRect();
    if(r.bottom+8>s) s=r.bottom+8;
  }
  return s;
}
function burst(kind){
  if(window.EGFx&&EGFx.confetti){ EGFx.confetti(kind); if(!fxR)fxR=requestAnimationFrame(tickFx); return; }
  // legacy fallback

  bits=[]; var n=LOW?16:(kind==='gold'?70:kind==='soft'?28:48);
  var safe=fxSafe();
  var rects=uiRects();
  var land=innerWidth>innerHeight*1.05;
  var resultOn=mode==='result'||mode==='reveal';
  for(var i=0;i<n;i++){
    var x,y,tries=0;
    do{
      if(resultOn&&land) x=innerWidth*(0.52+Math.random()*0.42);
      else x=innerWidth*(0.10+Math.random()*0.80);
      y=safe+20+Math.random()*Math.max(40, innerHeight-safe-80);
      tries++;
    }while(tries<10 && hitsUi(x,y,1,rects));
    bits.push({x:x,y:y,v:1.6+Math.random()*4.2,vx:(Math.random()-.5)*3.2,s:.5+Math.random()*1,rot:Math.random()*6,vr:(Math.random()-.5)*.3,k:['gummy','gummy-yel','gummy-grn','candy','lolly','chew'][(Math.random()*6)|0]});
  }
  if(!fxR)fxR=requestAnimationFrame(tickFx);
}
function tickFx(){
  if(!fxx){fxR=0;return;}
  fxx.clearRect(0,0,innerWidth,innerHeight);
  if(window.EGFx&&EGFx.draw){
    EGFx.tick(16.67);
    var safe0=fxSafe();
    fxx.save(); fxx.beginPath(); fxx.rect(0,safe0,innerWidth,Math.max(0,innerHeight-safe0)); fxx.clip();
    EGFx.draw(fxx,D); fxx.restore();
    if(EGFx.liveCount()) fxR=requestAnimationFrame(tickFx); else fxR=0;
    return;
  }
  var live=0, safe=fxSafe(), rects=uiRects();
  fxx.save();
  fxx.beginPath(); fxx.rect(0,safe,innerWidth,Math.max(0,innerHeight-safe)); fxx.clip();
  for(var i=0;i<bits.length;i++){
    var b=bits[i];if(!b)continue;b.y+=b.v;b.x+=b.vx;b.v+=0.08;b.rot+=b.vr;
    if(b.y>innerHeight+40){bits[i]=null;continue}live++;
    if(b.y+20<safe)continue;
    if(hitsUi(b.x,b.y,b.s,rects))continue;
    D.drawSnack(fxx,b.k,b.x,b.y,b.s,b.rot);
  }
  fxx.restore();
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
  box.innerHTML=(L.LAUNCHER_GAMES||L.GAMES).map(function(id){
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
  ensureUi();
  fitH(); sizeFx(); applyLang();
  buildPad();
  if(GAME==='launcher')$('grid').classList.remove('hide');
  else $('grid').classList.add('hide');
  fillPrizesPreview(); measureChrome();

  $('btnFS').addEventListener('click',toggleFS);
  $('chipLang').addEventListener('click',cycleLang);
  $('btnBgm').addEventListener('click',function(e){e.preventDefault();toggleMusic();});
  function bindAct(el, fn){
    if(!el)return;
    el.addEventListener('pointerdown',function(e){markPointer();fn(e);});
    el.addEventListener('click',function(e){if(!clickFresh()){e.preventDefault();return;}fn(e);});
  }
  bindAct($('go'), onGo);
  bindAct($('next'), function(e){e.preventDefault(); if(busy())return; showTitle();});
  $('homeBtn').addEventListener('click',function(e){e.preventDefault(); if(busy())return; goHome();});
  $('play').style.pointerEvents='none';
  document.addEventListener('pointerdown',function(e){
    A.unlock();
    if(busy())return;
    if(mode==='run'){
      var t=e.target;
      if(t&&t.closest&&t.closest('#logo,#topRight,#go,#admin,#pin,.ov'))return;
      markPointer();
      onPlayTap(e);
    }
  },{passive:false});
  document.addEventListener('click',function(e){
    if(!clickFresh())return;
    if(busy())return;
    if(mode==='run'){
      var t=e.target;
      if(t&&t.closest&&t.closest('#logo,#topRight,#go,#admin,#pin,.ov,button,a,input'))return;
      onPlayTap(e);
    }
  },{passive:false});
  document.addEventListener('keydown',function(e){
    if(e.repeat)return;
    var k=e.key, code=e.keyCode;
    var isOk=k==='Enter'||k===' '||k==='Spacebar'||k==='OK'||k==='Accept'||k==='Select'||code===13||code===32;
    if(!isOk)return;
    if($('admin')&&!$('admin').classList.contains('hide'))return;
    if($('pin')&&!$('pin').classList.contains('hide'))return;
    var tag=(e.target&&e.target.tagName||'').toLowerCase();
    if(tag==='input'||tag==='textarea')return;
    if(busy()){e.preventDefault();return;}
    if(mode==='result'){e.preventDefault();showTitle();return;}
    if(mode==='title'||mode==='run'){e.preventDefault();onGo(e);}
  });

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
    if(mode==='run'||mode==='result'||mode==='reveal'){showTitle();return' stay'}
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
    startRun:startRun, finish:function(){ if(mode!=='run'){ if(!GPlay.state()) GPlay.start(GAME); mode='run'; document.body.classList.add('playing'); } finish(); },
    forceResult:function(err,opt){
      opt=opt||{};
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
        if(GAME==='weight'){s.stopped=true;s.g=100+(err||0);s.err=err||0;s.t=1;}
        if(GAME==='jump'){
          s.plan=s.plan||L.jumpPlan(1);
          s.jumped=true;s.done=true;s.err=err||0;s.tTap=s.plan.tOpt+(err||0);s.late=(err||0)>0;s.jumpU=1;s.j0=performance.now()-800;
        }
        if(GAME==='crane'){
          var sw=L.craneSweep?L.craneSweep(0,1):{gold:0.5,pos:0.5};
          s.dropped=true;s.done=true;s.gold=sw.gold;s.pos=sw.gold+(err||0);s.err=err||0;s.phase='settle';s.u=1;
          s.held=(L.craneHold?L.craneHold(s.err):((err||0)<=0.04?'gold':'none'));
        }
      }
      var a=L.applyAward(GAME,err,cfg,[],opt); lastAward=a; saveCfg(cfg);
      var meta=opt.meta; if(!meta&&s&&s.score) meta=s.score;
      if(!meta&&GAME==='weight'&&s) meta={grams:s.g,err:s.err};
      if(!meta&&GAME==='jump'&&s) meta={dt:s.err,late:!!s.late,tTap:s.tTap,tOpt:s.plan&&s.plan.tOpt};
      if(!meta&&GAME==='crane'&&s) meta={err:s.err,held:s.held,gold:s.gold,pos:s.pos};
      var r={err:err,meta:meta,falseStart:!!opt.falseStart};
      lastResult=r;
      if(a.index===0){L.bumpExact(hits,GAME);saveHits(hits);updateHitBadge(true);}
      var playEl=$('play');
      if(opt.hold){
        startReveal(a,r);
        if(playEl) GPlay.draw(playEl, capyState());
        return a;
      }
      clearReveal();
      mode='result';
      if(a.index===0) showPlus();
      renderResult(a,r);
      paintRecord(a,r,true);
      if(!opt.silent) burst(a.index===0?'gold':(a.index>0&&a.index<=3?'ok':'soft'));
      document.body.classList.remove('playing','reveal'); document.body.classList.add('result'); $('go').classList.add('hide');
      if(playEl) GPlay.draw(playEl, capyState());
      measureChrome();
      return a;
    },
    mode:function(){return mode},
    revealing:function(){return revealing},
    showTitle:showTitle, openAdmin:function(bypass){if(bypass&&/[?&](nosw|test)=1/.test(location.search))openAdmin();else showPin()},
    setLang:function(l){if(LANGS.indexOf(l)>=0){lang=l;cfg.lang=l;applyLang()}},
    isIOS:isIOS, canFS:canFS, isStandalone:isStandalone, cfg:function(){return cfg},
    t:t, hitText:hitText, playBgm:function(){A.playBgm(GAME)}
  };
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);
else boot();
})();

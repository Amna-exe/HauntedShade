/* ---- AUDIO: put mp3s in audio/ named ambience|haunt|burn|success|fail|scare|hover|click. Missing files fall back to beeps. ---- */
const snd={},ok={};let muted=false,ac,musicV=.5,sfxV=.8;
['ambience','haunt','burn','success','fail','scare','hover','click'].forEach(n=>{const optional=n=='hover'||n=='click',a=optional?new Audio():new Audio('audio/'+n+'.mp3');if(!optional)a.onerror=()=>ok[n]=0;snd[n]=a;ok[n]=optional?0:1});
snd.ambience.loop=true;
try{const s=JSON.parse(localStorage.getItem('hs_audio')||'{}');if(s.m!=null)musicV=s.m;if(s.s!=null)sfxV=s.s;if(s.x)muted=true}catch(e){}
function applyVol(){snd.ambience.volume=musicV;snd.ambience.muted=muted;for(const n in snd)if(n!='ambience')snd[n].volume=sfxV;
try{localStorage.setItem('hs_audio',JSON.stringify({m:musicV,s:sfxV,x:muted}))}catch(e){}}
function music(){if(ok.ambience&&snd.ambience.paused)snd.ambience.play().catch(()=>{})}
applyVol();
function beep(f,d,t,v){if(muted)return;try{ac=ac||new AudioContext();const o=ac.createOscillator(),g=ac.createGain();o.type=t||'sine';o.frequency.value=f;g.gain.value=(v||.08)*sfxV;g.gain.exponentialRampToValueAtTime(.001,ac.currentTime+d);o.connect(g);g.connect(ac.destination);o.start();o.stop(ac.currentTime+d)}catch(e){}}
const fb={ambience(){},haunt(){beep(520,.3,'triangle')},burn(){beep(140,.15,'sawtooth',.05)},scare(){beep(880,.12,'square',.05);setTimeout(()=>beep(1100,.18,'square',.05),110)},hover(){beep(720,.035,'triangle',.025)},click(){beep(360,.06,'square',.035)},
success(){[523,659,784].forEach((f,i)=>setTimeout(()=>beep(f,.25),i*130))},fail(){[300,220,150].forEach((f,i)=>setTimeout(()=>beep(f,.3,'square',.05),i*160))}};
function play(n){if(muted)return;if(ok[n]){try{snd[n].currentTime=0;snd[n].play().catch(()=>{ok[n]=0;fb[n]()})}catch(e){fb[n]()}}else fb[n]()}

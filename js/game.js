/* GAME: state, update, draw, loop */
const K={},P={};let st='title',g,last=0,scr='main',sel=0,mouse=[0,0],drag=null;let day=1,sym=0,fearT=0,keys={},score=0;
const bc=document.createElement('canvas');bc.width=W;bc.height=H;const bx=bc.getContext('2d');
function reset(){g={p:[44,170],v:[0,0],spirit:100,t:g?g.t%DAY:0,haunted:{},prog:{},msg:'',mt:0,burnT:0,lit:false,near:null,why:'',cx:0,cy:0,alert:0,dash:0,dcd:0,pcd:0,room:null,rn:'',banner:0,people:mkPeople(),cap:null,q:[],ty:0,sl:0,seen:{},epi:'',bk:0,end:'',fresh:0,card:null,wisps:mkWisps(),cd:0};
R.forEach(r=>{r.on=r.on0;r.ban=0;r.tg=0});WIN.forEach(w=>{w.closed=0;w.ct=0});O.forEach(o=>o.shake=0)}
reset();
function say(s){g.msg=s;g.mt=2.4}
function start(){score=0;day=1;sym=0;fearT=0;keys={};beginDay()}
function beginDay(){reset();g.t=0;st='card';g.card=DAYS[day-1]}
function go(){st='play';music()}
function adv(){if(st=='card')go();else if(st=='lose')beginDay();else if(st=='ending')back()}
function saved(){try{return JSON.parse(localStorage.getItem('hs_end')||'[]')}catch(e){return[]}}
function addGhostStat(kind,value){try{const s=JSON.parse(localStorage.getItem('hs_ghost_stats')||'{}');s[kind]=(s[kind]||0)+value;localStorage.setItem('hs_ghost_stats',JSON.stringify(s))}catch(e){}}
function end(id){try{const b=+localStorage.getItem('hs_best')||0;g.best=score>b;if(g.best)localStorage.setItem('hs_best',score)}catch(e){}const u=saved();g.fresh=!u.includes(id);if(g.fresh){u.push(id);try{localStorage.setItem('hs_end',JSON.stringify(u))}catch(e){}}g.end=id;st='ending';play(id=='rest'||id=='rooms'?'success':'fail')}
function pick(n){if(n==1)end('alone');else if(n==2){if(sym<3){say('He is not ready to let go...');return}end(Object.keys(keys).length>=4&&sym>=5?'rest':'rooms')}else end('ashes')}
function intro(){reset();st='intro'}
function nextSlide(){if(g.ty<INTRO[g.sl].length)g.ty=1e9;else{g.sl++;g.ty=0;if(g.sl>=INTRO.length)start()}}
function back(){st='title';scr='main'}
function update(dt){upd(dt);for(const k in P)P[k]=0}
function upd(dt){
if(st=='intro'){g.ty+=dt*38;return}
if(st=='title'){g.t=(g.t+dt*8)%DAY;updPeople(dt,0);return}
if(st!='play')return;
g.t+=dt;
let best=99,near=null;const c=(k,d,rg,v)=>{if(d<rg&&d<best){best=d;near={k,v}}};
for(const o of T)if(!g.haunted[o[0]])c('haunt',Math.hypot(g.p[0]-o[6]-o[4]/2,g.p[1]-o[7]-o[5]*.8),24,o);
for(const w of WIN)c('win',Math.hypot(g.p[0]-w.cx,g.p[1]-w.cy),20,w);
for(const s of SW)c('sw',Math.hypot(g.p[0]-s.x,g.p[1]-s.y),14,s);
g.near=near;
const hold=(K.f||K[' '])&&near&&near.k=='haunt';g.hold=!!hold;
if((P.f||P[' '])&&near){if(near.k=='win'){near.v.closed^=1;near.v.ct=0;beep(300,.1,'square',.05)}else if(near.k=='sw'){flick(near.v.r)}}
// movement (walls block you; doors are the gaps) + dash
if(P.shift&&g.dcd<=0&&g.spirit>10){g.dash=.3;g.dcd=4;g.spirit-=8}g.dash-=dt;g.dcd-=dt;g.pcd-=dt;
const ix=(K.d||K.arrowright?1:0)-(K.a||K.arrowleft?1:0),iy=(K.s||K.arrowdown?1:0)-(K.w||K.arrowup?1:0),l=Math.hypot(ix,iy)||1,sp=(hold?25:62)*(g.dash>0?2.6:1),k=Math.min(1,dt*8);
g.v[0]+=(ix/l*sp-g.v[0])*k;g.v[1]+=(iy/l*sp-g.v[1])*k;
g.p[0]+=g.v[0]*dt;g.p[1]+=g.v[1]*dt;wallHit(g.p,4);g.p[0]=clamp(g.p[0],6,W-6);g.p[1]=clamp(g.p[1],6,H-6);
g.cx+=(clamp(g.p[0]*S-432,0,W*S-864)-g.cx)*Math.min(1,dt*6);g.cy+=(clamp(g.p[1]*S-216,0,H*S-432)-g.cy)*Math.min(1,dt*6);
const rm=roomOf(g.p[0],g.p[1]);if(rm&&rm!==g.room){g.room=rm;g.rn=rm.name;g.banner=2}g.banner-=dt;
// sunlight: beams (blocked by closed curtains and by furniture shadows)
let lit=false;
for(const b of beams(Math.min(g.t/DAY,1))){const r=b.w.r;if(g.room!==r||!inQ(g.p,b.P))continue;let sh=false;
for(let s=3;s<70&&!sh;s+=3){const qx=g.p[0]-b.d[0]*s,qy=g.p[1]-b.d[1]*s;sh=FURN.some(f=>f.r===r&&qx>=f.x&&qx<=f.x+f.w&&qy>=f.y&&qy<=f.y+f.h)}if(!sh)lit=true}
g.lit=lit;
if(lit){g.spirit-=24*dt;g.burnT-=dt;if(g.burnT<=0){play('burn');g.burnT=.8}}else{const sf=O.some(o=>g.haunted[o[0]]&&Math.hypot(g.p[0]-o[6]-o[4]/2,g.p[1]-o[7]-o[5]*.8)<22);g.spirit=Math.min(100,g.spirit+(sf?20:7)*dt);g.burnT=0}
// family sees you if you are visible (in light, or in a room with the light on)
const vis=lit||(g.room&&g.room.on);let see=0;
for(const p of g.people)if(vis&&roomOf(p.x,p.y)===g.room&&Math.hypot(p.x-g.p[0],p.y-g.p[1])<80){see=1;p.seen=.5}
g.wisps=g.wisps.filter(w=>{if(Math.hypot(g.p[0]-w.x,g.p[1]-w.y)<9){score+=w.v;addGhostStat('echoes',w.v);say('+'+w.v+' echo');beep(880,.08,'triangle');return 0}return 1});
g.alert=clamp(g.alert+(see?32:-10)*dt,0,100);
if(g.alert>50&&((g.cd=(g.cd||0)-dt)<=0)){g.cd=6;const q=g.people[Math.random()*3|0],r=roomOf(q.x,q.y);if(r){r.on=1;WIN.forEach(w=>{if(w.r===r)w.closed=0});say('The family fights back!')}}
WIN.forEach(w=>{if(w.closed&&(w.ct+=dt)>25)w.closed=0});O.forEach(o=>o.shake=Math.max(0,o.shake-dt));
// poltergeist (E): shake the nearest object, family comes to look
if(P.e&&g.pcd<=0&&g.spirit>20){let bo=null,bd=28;for(const o of O){const d=Math.hypot(g.p[0]-o[6]-o[4]/2,g.p[1]-o[7]-o[5]*.8);if(d<bd){bd=d;bo=o}}
if(bo){bo.shake=.6;g.pcd=5;g.spirit-=15;polter(bo);beep(200,.2,'square')}}
for(const o of T)if(!(hold&&near.v===o))g.prog[o[0]]=Math.max(0,(g.prog[o[0]]||0)-dt*.8);
if(hold){const o=near.v,id=o[0];g.prog[id]=(g.prog[id]||0)+dt;
if(g.prog[id]>=1.5){g.haunted[id]=1;addGhostStat('haunts',1);g.spirit=Math.max(1,g.spirit-12);play('haunt');score+=25;say('BOO! The '+o[1].toLowerCase()+' is haunted');if(MEM[id]){if(!keys[id])sym++;keys[id]=1;cap('Gartner',MEM[id])}scareAll(o)}}
if(g.cap){g.cap.t+=dt*40;if((g.cap.life-=dt)<=0)g.cap=null}else if(g.q.length)g.cap=g.q.shift();
updPeople(dt,hold);if(g.mt>0)g.mt-=dt;
const F=g.people.map(p=>p.fear),done=day==1?F[0]>=3:day==2?F.filter(v=>v>=2).length>=2:F.every(v=>v>=2);
if(done){score+=Math.round((DAY-g.t)*2);play('success');if(day<3){day++;beginDay()}else{st='choice';g.msg=''}}
else if(g.spirit<=0){if(day==3&&g.people.some(p=>roomOf(p.x,p.y)===g.room))end('proof');else{st='lose';g.why='Burned up in the sunlight!';g.epi='You reform at dawn and try the day again.';play('fail')}}
else if(g.alert>=100)end('exorcised');
else if(g.t>=DAY)end('signed')}

function draw(){
x.setTransform(1,0,0,1,0,0);x.fillStyle='#1b1424';x.fillRect(0,0,864,432);
if(loaded<3){txt('Loading...',432,216,24);return}
if(!PAT.olive)mkPat();
const t=performance.now()/1000,cx=st=='title'?0:g.cx,cy=st=='title'?0:g.cy;
x.setTransform(S,0,0,S,-cx,-cy);
R.forEach(r=>{x.fillStyle=PAT[r.fl];x.fillRect(r.x,r.y,r.w,r.h)});
x.fillStyle='#5b3a24';WALLS.forEach(w=>x.fillRect(w[0],w[1],w[2],w[3]));
x.fillStyle='#7d5030';WALLS.forEach(w=>x.fillRect(w[0],w[1],w[2],1));
x.fillStyle='#a06a38';DOORS.forEach(d=>x.fillRect(d[0],d[1],d[2],d[3]));
[...O].sort((a,b)=>a[7]+a[5]-b[7]-b[5]).forEach(o=>{const h=g.haunted[o[0]],sx=o.shake?Math.sin(t*70)*1.2:0;x.drawImage(im[h?'f2':'f1'],o[2],o[3],o[4],o[5],o[6]+sx,o[7],o[4],o[5])});
SW.forEach(s=>{x.fillStyle=s.r.on?'#ffe680':'#555';x.fillRect(s.x-2,s.y-3,4,6)});
g.people.forEach(p=>person(p,t));
R.forEach(r=>{x.fillStyle='rgba(12,8,38,'+(r.on?.2:Math.min(.92,r.dk+.2))+')';x.fillRect(r.x,r.y,r.w,r.h)});
bx.clearRect(0,0,W,H);
for(const b of beams(Math.min(g.t/DAY,1))){const r=b.w.r;bx.save();bx.beginPath();bx.rect(r.x,r.y,r.w,r.h);bx.clip();bx.fillStyle='rgba(255,196,80,.34)';bx.beginPath();
b.P.forEach((p,i)=>i?bx.lineTo(p[0],p[1]):bx.moveTo(p[0],p[1]));bx.fill();bx.globalCompositeOperation='destination-out';FURN.forEach(f=>{if(f.r===r)shadow(bx,f,b.d)});bx.restore()}
x.drawImage(bc,0,0);drawWisps(t);
WIN.forEach(w=>{x.fillStyle=w.closed?'#8a3a5a':'#fff6c0';w.side=='w'?x.fillRect(w.p1[0]-1.5,w.p1[1],3,w.p2[1]-w.p1[1]):x.fillRect(w.p1[0],w.p1[1]-1.5,w.p2[0]-w.p1[0],3)});
ghost(g.p[0],g.p[1],t,g.lit&&st=='play',st=='play'&&(g.hold||g.pcd>4.4));
x.setTransform(1,0,0,1,0,0);spooky(t,cx,cy);
g.people.forEach(p=>{const b=p.scare>0?'!!':p.seen>0?'!':p.sus>0?'?':'';if(b)txt(b,p.x*S-cx,(p.y-27*p.sz)*S-cy,18,p.scare>0?'#ff8a8a':p.seen>0?'#ffb04d':'#ffe08a')});
if(st=='intro'){drawIntro();return}
if(st=='title'){drawMenu();return}if(st=='card'){drawCard();return}if(st=='ending'){drawEnding();return}
x.fillStyle='rgba(10,6,24,.6)';x.fillRect(12,10,230,62);x.fillRect(622,10,230,86);
x.fillStyle='#2a1f40';x.fillRect(18,16,160,18);x.fillStyle=g.lit?'#ff6b6b':'#8fe0ff';x.fillRect(18,16,160*clamp(g.spirit/100,0,1),18);txt('spirit',186,31,14,'#fff','left');
x.fillStyle='#2a1f40';x.fillRect(18,38,160,10);x.fillStyle='#ff9a3a';x.fillRect(18,38,160*g.alert/100,10);txt('seen',186,48,12,'#fff','left');txt('Echoes '+score,18,68,14,'#ffd98a','left');
x.fillStyle='#2a1f40';x.fillRect(628,16,130,18);x.fillStyle='#ffc94d';x.fillRect(628,16,130*clamp(g.t/DAY,0,1),18);txt('day',768,31,14,'#fff','left');g.people.forEach((p,i)=>{txt(p.n,630,60+i*14,12,'#fff','left');for(let k=0;k<3;k++){x.fillStyle=k<p.fear?'#ff6b6b':'#2a1f40';x.fillRect(676+k*16,52+i*14,12,8)}});txt('Goal: '+MISS[day-1],432,56,13,'#ffd98a');
txt('Day '+day+' / 3',432,32,20,'#bfe6ff');
if(st=='play'){const n=g.near;if(n){const v=n.v,pxy=n.k=='haunt'?[v[6]+v[4]/2,v[7]]:n.k=='win'?[v.cx,v.cy]:[v.x,v.y],px=pxy[0]*S-cx,py=pxy[1]*S-cy-8;
const lab=n.k=='haunt'?'Hold F: haunt '+v[1].toLowerCase():n.k=='win'?'F: '+(v.closed?'open':'close')+' curtains':'F: lights '+(v.r.on?'off':'on');txt(lab,px,py,14,'#fff');
if(n.k=='haunt'){x.fillStyle='#2a1f40';x.fillRect(px-40,py+6,80,8);x.fillStyle='#9dffb0';x.fillRect(px-40,py+6,80*(g.prog[v[0]]||0)/1.5,8)}}
drawCap();if(g.mt>0)txt(g.msg,432,410,18,'#9dffb0');if(g.lit)txt('IN THE LIGHT! Find shade!',432,386,18,'#ff8a8a');if(g.banner>0)txt(g.rn,432,76,22,'#ffd98a');
txt('F interact  E poltergeist'+(g.pcd>0?' ('+Math.ceil(g.pcd)+'s)':'')+'  Shift dash'+(g.dcd>0?' ('+Math.ceil(g.dcd)+'s)':'')+'  Esc menu',16,422,12,'#9a8fb5','left');
const mx=742,my=366,m=.25;x.fillStyle='rgba(10,6,24,.7)';x.fillRect(mx-4,my-4,W*m+8,H*m+8);
R.forEach(r=>{x.strokeStyle=r.on?'#ffe680':'#6a5a8a';x.lineWidth=1;x.strokeRect(mx+r.x*m,my+r.y*m,r.w*m,r.h*m)});
T.forEach(o=>{if(!g.haunted[o[0]]){x.fillStyle='#ffd98a';x.fillRect(mx+o[6]*m,my+o[7]*m,2,2)}});
g.people.forEach(p=>{x.fillStyle=p.col;x.fillRect(mx+p.x*m-1,my+p.y*m-1,3,3)});x.fillStyle='#fff';x.fillRect(mx+g.p[0]*m-2,my+g.p[1]*m-2,4,4)}
if(st=='lose'){x.fillStyle='rgba(10,6,24,.75)';x.fillRect(0,0,864,432);txt('GAME OVER',432,170,48,'#ff8a8a');txt(g.why,432,225,22);para(g.epi,432,262,16,640,'center');txt('Click or press R to retry the day',432,350,20,'#ffd98a')}
if(st=='choice')drawChoice()}
function loop(ts){const dt=Math.min(.05,(ts-last)/1000||0);last=ts;update(dt);draw();requestAnimationFrame(loop)}
requestAnimationFrame(loop);
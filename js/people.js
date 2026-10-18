/* FAMILY: wander room to room through doors; expression follows fear (0 calm,1 worried,2 scared,3 terrified).
   To use your own character sprites, replace person() below. */
const FAM=[['Dad','#3b6fd8','#4a2e1b',1],['Mom','#d84a8a','#e0a030',1],['Kid','#38b86a','#2b1b10',.75]];
function mkPeople(){return FAM.map((f,i)=>{const r=R[[1,2,6][i]];return{n:f[0],col:f[1],hair:f[2],sz:f[3],x:r.x+r.w/2,y:r.y+r.h/2,path:[],wait:rnd(0,2),lightCd:rnd(2,6),fear:0,scare:0,flee:0,sus:0,seen:0,walk:0,mv:0,fd:0}})}
function pathTo(p,tr,tx,ty){const a=roomOf(p.x,p.y)||roomById('hall'),pts=[],hc=108;
if(a===tr)return[[tx,ty]];
if(a.id!='hall'){const dx=a.x+a.w/2;pts.push([dx,a.y<92?a.y+a.h-6:a.y+6],[dx,hc])}
const db=tr.x+tr.w/2;pts.push([db,hc]);if(tr.id!='hall')pts.push([db,tr.y<92?tr.y+tr.h-6:tr.y+6]);pts.push([tx,ty]);return pts}
function pickTarget(p,avoid){const a=R.filter(r=>r!==avoid&&r.ban<=0),r=a.length?a[Math.random()*a.length|0]:R.find(v=>v!==avoid)||R[0];p.path=pathTo(p,r,rnd(r.x+8,r.x+r.w-8),rnd(r.y+10,r.y+r.h-6))}
function updPeople(dt,hold){for(const r of R){if(r.tt>0&&(r.tt-=dt)<=0)r.tg=0;if(r.ban>0)r.ban-=dt}for(const p of g.people){
p.scare=Math.max(0,p.scare-dt);p.sus=Math.max(0,p.sus-dt);p.seen=Math.max(0,p.seen-dt);p.mv=0;if(p.fear>0&&(p.fd-=dt)<=0){p.fear--;p.fd=36-day*5}
if(hold&&Math.hypot(g.p[0]-p.x,g.p[1]-p.y)<55)p.sus=.6;
const room=roomOf(p.x,p.y);p.lightCd-=dt;if(st=='play'&&room&&!room.on&&p.lightCd<=0&&p.wait<=0){room.on=1;room.tt=0;p.lightCd=rnd(8,16);beep(520,.08,'triangle',.035)}
let sp=13+p.fear*5;if(p.flee>0){p.flee-=dt;sp=45}
if(p.wait>0){p.wait-=dt;continue}
if(!p.path.length){pickTarget(p);continue}
const t=p.path[0],dx=t[0]-p.x,dy=t[1]-p.y,d=Math.hypot(dx,dy);
if(d<2){p.path.shift();if(!p.path.length)p.wait=rnd(1.5,4)}else{p.x+=dx/d*sp*dt;p.y+=dy/d*sp*dt;p.mv=1;p.walk+=dt*sp/13}}}
function scareAll(o){const cx=o[6]+o[4]/2,cy=o[7]+o[5]*.8,r=roomById(o[9]);let any=0;
for(const p of g.people){if(roomOf(p.x,p.y)===r||Math.hypot(p.x-cx,p.y-cy)<60){p.fear=Math.min(3,p.fear+1);p.fd=36-day*5;fearT++;score+=10;p.scare=3;p.flee=2.5;pickTarget(p,r);p.wait=0;if(!any)bark(p);any=1;if(p.fear==3)say(p.n+' is terrified!')}else p.sus=1.5}
if(any)play('scare')}
// poltergeist noise: nearby family walks over to investigate
function lureNear(o){const cx=o[6]+o[4]/2,cy=o[7]+o[5]*.8,r=roomById(o[9]);r.ban=0;
for(const p of g.people)if(1){p.path=pathTo(p,r,cx,Math.min(cy+8,r.y+r.h-4));p.wait=0;p.sus=1.5}}

function person(p,t){const L=p.scare>0?Math.max(2,p.fear):Math.max(p.fear,p.sus>0?1:0),w=Math.sin(p.walk*8)*1.6*p.mv;
x.save();x.translate(p.x+(L>=2?Math.sin(t*45)*.6:0),p.y);x.scale(p.sz,p.sz);
x.fillStyle='rgba(0,0,0,.28)';x.beginPath();x.ellipse(0,0,5,1.8,0,0,7);x.fill();
x.fillStyle='#2b2b44';x.fillRect(-2.5,-5,2,5+w);x.fillRect(.5,-5,2,5-w);
x.fillStyle=p.col;x.fillRect(-4,-12,8,8);const ay=L>=2?-17:-11;x.fillRect(-6,ay,2,6);x.fillRect(4,ay,2,6);
x.fillStyle=L==3?'#f4eeff':'#ffd7b5';x.beginPath();x.arc(0,-16,4.6,0,7);x.fill();
x.fillStyle=p.hair;x.beginPath();x.arc(0,-17,4.8,Math.PI,0);x.fill();
const ey=-16;
if(L>=2){x.fillStyle='#fff';x.beginPath();x.arc(-1.8,ey,L==3?1.7:1.4,0,7);x.arc(1.8,ey,L==3?1.7:1.4,0,7);x.fill();x.fillStyle='#111';x.beginPath();x.arc(-1.8,ey,.6,0,7);x.arc(1.8,ey,.6,0,7);x.fill()}
else{x.fillStyle='#111';x.beginPath();x.arc(-1.8,ey,.7,0,7);x.arc(1.8,ey,.7,0,7);x.fill()}
x.strokeStyle='#111';x.lineWidth=.6;x.beginPath();
if(L==1){x.moveTo(-3,ey-2);x.lineTo(-1,ey-1.4);x.moveTo(3,ey-2);x.lineTo(1,ey-1.4);x.moveTo(-1.2,-13);x.lineTo(1.2,-13)}
else if(L==0){x.arc(0,-14.2,1.6,.2,Math.PI-.2)}
x.stroke();
if(L>=2){x.fillStyle='#401020';x.beginPath();x.ellipse(0,-13.2,L==3?1.5:1,L==3?2:1.4,0,0,7);x.fill()}
if(L==2){x.fillStyle='#6cc8ff';x.beginPath();x.ellipse(5,-19,.8,1.3,0,0,7);x.fill()}
x.restore()}


// poltergeist: lure the family, and scare anyone close to you
function polter(o){lureNear(o);for(const p of g.people)if(Math.hypot(p.x-g.p[0],p.y-g.p[1])<45){p.fear=Math.min(3,p.fear+1);p.fd=36-day*5;fearT++;score+=10;p.scare=3;p.flee=2.5;pickTarget(p,roomOf(p.x,p.y));p.wait=0;play('scare')}}

// light switch: toggling 4 times quickly drives everyone out of the room, and they avoid it for 15s
function flick(r){r.on^=1;beep(450,.08,'square',.05);r.tt=2;r.tg=(r.tg||0)+1;
if(r.tg>=4){r.tg=0;r.ban=15;let n=0;for(const p of g.people)if(roomOf(p.x,p.y)===r){p.flee=2.5;p.sus=1.5;p.wait=0;pickTarget(p,r);n++}if(n)say('The flickering drives them out!')}}

// collectible echoes: glowing wisps scattered through the house (gold = 50 pts)
function mkWisps(){const a=[];for(let i=0;i<8;i++){const r=R[Math.random()*R.length|0];a.push({x:rnd(r.x+10,r.x+r.w-10),y:rnd(r.y+10,r.y+r.h-10),v:i==0?50:10})}return a}
function drawWisps(t){for(const w of g.wisps){const b=3+Math.sin(t*4+w.x)*1,c=w.v>10?'#ffd24d':'#9fe8ff';x.fillStyle=c;x.globalAlpha=.25;x.beginPath();x.arc(w.x,w.y-4,b*2.2,0,7);x.fill();x.globalAlpha=1;
x.beginPath();for(let i=0;i<8;i++){const r=i%2?b*.5:b,a=i*Math.PI/4+t;x.lineTo(w.x+Math.cos(a)*r,w.y-4+Math.sin(a)*r)}x.closePath();x.fill()}}
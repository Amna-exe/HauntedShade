const MENU=['Play','Customize','How to play','Audio','Endings'];
const hit=(p,x0,y0,w,h)=>p[0]>=x0&&p[0]<=x0+w&&p[1]>=y0&&p[1]<=y0+h;
const pt=e=>{const r=cv.getBoundingClientRect();return[(e.clientX-r.left)*864/r.width,(e.clientY-r.top)*432/r.height]};
let uiHoverId='',uiHoverAt=0;
function uiHover(id){if(st=='play')return;if(!id){uiHoverId='';return}if(id==uiHoverId)return;const n=performance.now();if(n-uiHoverAt<60)return;uiHoverId=id;uiHoverAt=n;play('hover')}
function uiClick(){if(st!='play')play('click')}
function choose(i){uiClick();if(i==0)intro();else{scr=['','cust','how','audio','ends'][i];hp=0}}
function setSlider(w){const v=clamp((mouse[0]-380)/240,0,1);if(w=='m')musicV=v;else sfxV=v;applyVol()}
function hoverItem(){if(st=='play')return uiHover('');if(st=='intro')return uiHover('intro');if(st=='card')return uiHover('daycard');if(st=='choice'){for(let i=0;i<3;i++)if(hit(mouse,132,150+i*60,600,48))return uiHover('choice'+i);return uiHover('')}if(st!='title')return uiHover('');
if(scr=='main'){for(let i=0;i<MENU.length;i++)if(hit(mouse,332,154+i*42,200,36))return uiHover('menu'+i)}else if(scr=='how')return uiHover('how');else if(scr=='ends'){for(let i=0;i<ENDS.length;i++){const q=24+i%4*208,r=212+(i/4|0)*92;if(hit(mouse,q,r,196,82))return uiHover('end'+i)}}else if(scr=='cust'){for(let i=0;i<3;i++){const y=126+i*62;if(hit(mouse,42,y,202,54))return uiHover('face'+i);if(hit(mouse,262,y,202,54))return uiHover('wraith'+i)}if(hit(mouse,570,368,180,38))return uiHover('custback')}else if(scr=='audio'){if(hit(mouse,370,190,260,30))return uiHover('music');if(hit(mouse,370,250,260,30))return uiHover('sfx');if(hit(mouse,332,300,200,44))return uiHover('mute');if(hit(mouse,332,360,200,44))return uiHover('audioback')}uiHover('')}
cv.addEventListener('pointermove',e=>{mouse=pt(e);if(drag)setSlider(drag);if(st=='title'&&scr=='main')MENU.forEach((m,i)=>{if(hit(mouse,332,154+i*42,200,36)&&sel!=i){sel=i;uiHover('menu'+i)}});hoverItem()});
cv.addEventListener('pointerdown',e=>{mouse=pt(e);music();
if(st=='play')return;if(st=='intro'){uiClick();nextSlide();return}if(st=='choice'){[0,1,2].forEach(i=>{if(hit(mouse,132,150+i*60,600,48)){uiClick();pick(i+1)}});return}if(st!='title'){uiClick();adv();return}
if(scr=='main')MENU.forEach((m,i)=>{if(hit(mouse,332,154+i*42,200,36))choose(i)});
else if(scr=='how'){uiClick();if(++hp>=HOW.length)scr='main'}else if(scr=='ends'){uiClick();scr='main'}else if(scr=='cust')custClick();
else if(hit(mouse,370,190,260,30)){uiClick();drag='m';setSlider('m')}
else if(hit(mouse,370,250,260,30)){uiClick();drag='s';setSlider('s')}
else if(hit(mouse,332,300,200,44)){uiClick();muted=!muted;applyVol()}
else if(hit(mouse,332,360,200,44)){uiClick();scr='main'}});
addEventListener('pointerup',()=>{if(drag=='s')play('haunt');drag=null});
addEventListener('keydown',e=>{const k=e.key.toLowerCase();if(!e.repeat)P[k]=1;K[k]=1;music();
if(['arrowup','arrowdown','arrowleft','arrowright',' '].includes(k))e.preventDefault();
if(k=='m'){muted=!muted;applyVol()}
if(st=='play'){if(k=='r')start();if(k=='escape')back();return}
if(st=='intro'){if(k=='enter'||k==' '){uiClick();nextSlide()}if(k=='escape')start();return}if(st=='choice'){if(k=='1'||k=='2'||k=='3'){uiClick();pick(+k)}return}if(st!='title'){if(k=='r'||k=='enter'||k==' '){uiClick();adv()}if(k=='escape')back();return}
if(scr=='how'){if(k=='escape'||k=='backspace')scr='main';else if(k=='arrowleft'&&hp>0){hp--;uiHover('how'+hp)}else if(k=='enter'||k==' '||k=='arrowright'){uiClick();if(++hp>=HOW.length)scr='main'}return}if(scr=='cust'){if(k=='escape'||k=='enter'||k=='backspace'){uiClick();scr='main'}else if(k=='arrowleft'||k=='a'){uiClick();cust(0,-1)}else if(k=='arrowright'||k=='d'){uiClick();cust(0,1)}else if(k=='arrowup'||k=='w'){uiClick();cust(1,-1)}else if(k=='arrowdown'||k=='s'){uiClick();cust(1,1)}return}if(scr!='main'){if(k=='escape'||k=='enter'||k=='backspace'){uiClick();scr='main'}
else if(scr=='audio'&&(k=='arrowleft'||k=='arrowright')){uiClick();musicV=clamp(musicV+(k=='arrowleft'?-.1:.1),0,1);applyVol()}return}
if(k=='arrowdown'||k=='s'){sel=(sel+1)%MENU.length;uiHover('menu'+sel)}else if(k=='arrowup'||k=='w'){sel=(sel+MENU.length-1)%MENU.length;uiHover('menu'+sel)}else if(k=='enter'||k==' ')choose(sel)});
addEventListener('keyup',e=>K[e.key.toLowerCase()]=0);

function txt(s,px,py,sz,col,al){x.font=sz+'px DigitalDisco,ui-monospace,Menlo,Consolas,monospace';x.textAlign=al||'center';x.lineWidth=4;x.strokeStyle='#12091f';x.strokeText(s,px,py);x.fillStyle=col||'#fff';x.fillText(s,px,py)}
function ghost(px,py,t,lit,sp){if(drawCustom(px,py,t,lit,sp))return;x.save();x.translate(px,py);x.fillStyle='rgba(0,0,0,.3)';x.beginPath();x.ellipse(0,10,6,2,0,0,7);x.fill();
x.translate(0,Math.sin(t*3)*1.2);x.fillStyle=lit?'#ffc2c2':'#eaf6ff';x.beginPath();x.arc(0,-3,7,Math.PI,0);
x.lineTo(7,6);x.lineTo(3.5,9);x.lineTo(0,6);x.lineTo(-3.5,9);x.lineTo(-7,6);x.closePath();x.fill();
x.fillStyle='#1a1230';x.beginPath();x.ellipse(-2.5,-3,1.2,2,0,0,7);x.ellipse(2.5,-3,1.2,2,0,0,7);x.fill();
x.beginPath();x.ellipse(0,1,1.4,1.8,0,0,7);x.fill();x.restore()}
function btn(l,x0,y0,w,h,on){x.fillStyle=on?'#bfe6ff':'rgba(20,12,40,.85)';x.fillRect(x0,y0,w,h);x.strokeStyle='#bfe6ff';x.lineWidth=3;x.strokeRect(x0,y0,w,h);
x.font='20px DigitalDisco,ui-monospace,Menlo,Consolas,monospace';x.textAlign='center';x.fillStyle=on?'#1a1230':'#fff';x.fillText(l,x0+w/2,y0+h/2+7)}
function slider(l,v,y){txt(l,360,y+7,18,'#fff','right');x.fillStyle='#2a1f40';x.fillRect(380,y-5,240,10);x.fillStyle='#8fe0ff';x.fillRect(380,y-5,240*v,10);
x.fillStyle='#fff';x.beginPath();x.arc(380+240*v,y,10,0,7);x.fill();txt(Math.round(v*100)+'%',650,y+7,16,'#ffd98a','left')}
function drawMenu(){
x.fillStyle='rgba(10,6,24,.72)';x.fillRect(0,0,864,432);
x.setTransform(1,0,0,1,0,0);
if(scr!='cust')txt('HAUNTED SHADE',432,138,48,'#bfe6ff');
if(scr=='main'){MENU.forEach((m,i)=>btn(m,332,154+i*42,200,36,sel==i));txt('Mouse or arrows + Enter',432,410,14,'#9a8fb5')}
else if(scr=='how'){const h=HOW[hp];x.fillStyle='rgba(20,12,40,.9)';x.fillRect(180,166,504,202);x.strokeStyle='#bfe6ff';x.lineWidth=3;x.strokeRect(180,166,504,202);txt(h[0]+'  ('+(hp+1)+'/'+HOW.length+')',432,198,18,'#bfe6ff');h[1].forEach((s,i)=>txt(s,432,228+i*24,15));txt(hp<HOW.length-1?'Click / Enter: next     Esc: back':'Click / Enter: finish',432,390,16,'#ffd98a')}
else if(scr=='ends')drawEnds();else if(scr=='cust')drawCust();else{slider('Music',musicV,205);slider('Effects',sfxV,265);
btn('Sound: '+(muted?'OFF':'ON'),332,300,200,44,hit(mouse,332,300,200,44));btn('Back',332,360,200,44,hit(mouse,332,360,200,44))}}

function wrapL(s,max,sz){x.font=sz+'px DigitalDisco,ui-monospace,Menlo,Consolas,monospace';const out=[];let l='';for(const w of s.split(' ')){const t=l?l+' '+w:w;if(x.measureText(t).width>max&&l){out.push(l);l=w}else l=t}out.push(l);return out}
function para(s,px,py,sz,max,al,n,col){let r=n==null?1e9:n;wrapL(s,max,sz).forEach((l,i)=>{const t=l.slice(0,Math.max(0,r));r-=l.length+1;if(t)txt(t,px,py+i*(sz+10),sz,col,al)})}
function drawIntro(){x.fillStyle='rgba(10,6,24,.9)';x.fillRect(0,0,864,432);const t=performance.now()/1000;
portrait(INTRO_FACE[g.sl],165,t);
para(INTRO[g.sl],330,160,22,480,'left',Math.floor(g.ty),'#fff');
txt((g.sl+1)+' / '+INTRO.length,330,350,14,'#9a8fb5','left');txt('Enter / click: next     Esc: skip',432,412,14,'#ffd98a')}
function drawCap(){const c=g.cap;if(!c)return;x.fillStyle='rgba(10,6,24,.9)';x.fillRect(16,298,714,56);x.strokeStyle='#bfe6ff';x.lineWidth=2;x.strokeRect(16,298,714,56);
txt(c.who,28,318,14,c.who=='Gartner'?'#bfe6ff':'#ffd98a','left');para(c.text,28,342,16,690,'left',Math.floor(c.t),'#fff')}

function drawEnds(){const u=saved();txt('Endings '+ENDS.filter(e=>u.includes(e.id)).length+'/'+ENDS.length,432,200,16,'#ffd98a');
ENDS.forEach((e,i)=>{const cx=24+i%4*208,cy=212+(i/4|0)*92,o=u.includes(e.id);x.fillStyle=o?'rgba(40,30,70,.95)':'rgba(15,10,30,.9)';x.fillRect(cx,cy,196,82);x.strokeStyle=o?'#ffd98a':'#4a3f66';x.lineWidth=2;x.strokeRect(cx,cy,196,82);
txt(o?e.t:'???',cx+98,cy+22,15,o?'#bfe6ff':'#6a5a8a');para(o?e.e:e.h,cx+98,cy+44,11,180,'center',null,o?'#fff':'#6a5a8a')});
txt('Click or press Esc to go back',432,412,14,'#ffd98a')}
function drawCard(){x.fillStyle='rgba(10,6,24,.94)';x.fillRect(0,0,864,432);const c=g.card;txt(c[0],432,170,36,'#bfe6ff');txt(c[1],432,225,20);para(c[2],432,265,16,640,'center');txt('Click or press Enter',432,380,16,'#ffd98a')}
function drawEnding(){const e=ENDS.find(v=>v.id==g.end);x.fillStyle='rgba(10,6,24,.92)';x.fillRect(0,0,864,432);txt(g.fresh?'NEW ENDING':'ENDING',432,120,18,'#ffd98a');txt(e.t,432,190,44,'#bfe6ff');para(e.e,432,250,18,640,'center');
txt('Score '+score+(g.best?'  NEW BEST':''),432,305,20,'#9dffb0');txt('Endings '+ENDS.filter(v=>saved().includes(v.id)).length+'/'+ENDS.length,432,340,16,'#9a8fb5');txt('Click to return to the menu',432,390,18,'#ffd98a')}
function drawChoice(){x.fillStyle='rgba(10,6,24,.85)';x.fillRect(0,0,864,432);txt('They are breaking. What will you do?',432,100,24,'#ffd98a');
[['1  Finish them. One last scare.',1],['2  Let go.'+(sym<3?' (needs sympathy)':''),sym>=3],['3  Light the furnace.',1]].forEach((o,i)=>{x.fillStyle=o[1]?'rgba(40,30,70,.95)':'rgba(15,10,30,.9)';x.fillRect(132,150+i*60,600,48);x.strokeStyle=o[1]?'#bfe6ff':'#4a3f66';x.lineWidth=3;x.strokeRect(132,150+i*60,600,48);txt(o[0],432,181+i*60,20,o[1]?'#fff':'#6a5a8a')});
if(g.mt>0)txt(g.msg,432,360,16,'#9dffb0')}

// Gartner portrait: put the expression images in NPC_2/ (Aggression, Calm, Sadness, Smile, Special, Talk). Change GEXT if they are not .png
const GEXT='png',GP={},INTRO_FACE=['Calm','Sadness','Aggression'];
['Aggression','Calm','Sadness','Smile','Special','Talk'].forEach(n=>{const i=new Image();i.src='NPC_2/'+n+'.'+GEXT;GP[n]=i});
function portrait(n,cx,t){const i=GP[n];if(i&&i.complete&&i.naturalWidth){let h=330,w=i.naturalWidth*h/i.naturalHeight;if(w>290){w=290;h=w*i.naturalHeight/i.naturalWidth}x.drawImage(i,cx-w/2,60+Math.sin(t*2)*3,w,h)}
else{x.setTransform(10,0,0,10,0,0);ghost(15,20+Math.sin(t*2)*.6,t,false);x.setTransform(1,0,0,1,0,0)}}

let hp=0;
const HOW=[['CONTROLS',['WASD / Arrows: float around the house','Hold F near a glowing object: haunt it (costs spirit)','F at a window: open or close the curtains','F at a light switch: lights on or off','E: poltergeist noise        Shift: dash','M: mute        Esc: menu']],
['SURVIVE',['Sunlight burns you. Watch the spirit bar.','Furniture shade and closed curtains keep you safe.','Rest beside a haunted object to recharge fast.','Do not be seen in sunlight or in a lit room.','The seen bar fills when the family spots you. Full = exorcism.','Fear fades after 30 seconds. Chain your scares.']],
['TRICKS',['Flick a light switch 4 times: the room empties for 15s.','E: the noise pulls the whole family to that room.','Lure them in, then haunt them while they gather.','Key memories (clock, mirror, toys, books, wardrobe)','win sympathy when haunted. Sympathy unlocks kinder endings.']],
['LIMITS AND SCORE',['E costs 15 spirit and dash costs 8. Low spirit means no tricks.','Be seen and the family fights back: lights on, curtains open.','Fear fades faster every day.','Collect glowing echoes for points. Gold ones are worth 50.','Haunts, scares and fast finishes score points. Beat your best.']],
['THE THREE DAYS',['Day 1  First Light: terrify Dad. Learn sun and haunting.','Day 2  Stopped Clock: scare two of them at once.','Day 3  Sunset: scare all three at once, then choose:','finish them, let go, or light the furnace.','A scared person has 2+ pips. Fear fades, so scare in quick turns.','Seven endings are hidden. Check the Endings menu.']]];
function spooky(t,cx,cy){x.save();x.globalCompositeOperation='saturation';x.globalAlpha=.45;x.fillStyle='#808080';x.fillRect(0,0,864,432);x.globalCompositeOperation='source-over';x.globalAlpha=1;
const px=st=='play'?g.p[0]*S-cx:432,py=st=='play'?g.p[1]*S-cy:216,f=.9+.1*Math.sin(t*9)*Math.sin(t*2.3),gr=x.createRadialGradient(px,py,100,px,py,480);
gr.addColorStop(0,'rgba(5,0,15,0)');gr.addColorStop(1,'rgba(5,0,15,'+.8*f+')');x.fillStyle=gr;x.fillRect(0,0,864,432);x.restore()}

/* ---- GHOST CUSTOMIZER: Ghost/Wraith_0N/Vector Parts/<part>.png ; if a file is missing the old drawn ghost is used ---- */
const GDIR='Ghost/Wraith_0%/Vector Parts/',GPARTS=['Body','Head','Face 01','Face 02','Face 03','Left Arm','Left Hand','Right Arm','Right Hand','Spells Effect'],GI=[],CG={w:0,f:0};
const FACE_PRICES=[0,50,100];
try{Object.assign(CG,JSON.parse(localStorage.getItem('hs_ghost')||'{}'))}catch(e){}
for(let w=0;w<3;w++){GI[w]={};GPARTS.forEach(n=>{const i=new Image();i.src=encodeURI(GDIR.replace('%',w+1)+n+'.png');GI[w][n]=i})}
const gok=i=>i&&i.complete&&i.naturalWidth,GS=12;
// LAYOUT (tweak if parts sit wrong): arm=[x offset in body widths, y offset in body heights, anchor x, anchor y]; head likewise
const GL={arm:[.42,-.12,.5,.1],head:[0,-.3,.5,.7]};
function ghostStats(){try{return JSON.parse(localStorage.getItem('hs_ghost_stats')||'{}')}catch(e){return{}}}
function unlockedWraith(i){const s=ghostStats(),u=WRAITH_UNLOCKS[i];return u.kind=='starter'||(s[u.kind]||0)>=u.need}
function unlockText(i){const u=WRAITH_UNLOCKS[i],s=ghostStats();if(u.kind=='starter')return'Unlocked';return (s[u.kind]||0)+'/'+u.need+' '+u.kind}
if(!unlockedWraith(CG.w))CG.w=0;
function unlockedFace(i){return (ghostStats().echoes||0)>=FACE_PRICES[i]}
function faceText(i){return unlockedFace(i)?'Unlocked':FACE_PRICES[i]+' points'}
if(!unlockedFace(CG.f))CG.f=0;
function drawCustom(px,py,t,lit,sp){const I=GI[CG.w],B=I.Body;if(!gok(B))return false;
const sc=GS/128,bw=128*sc,fl=st=='play'&&g.v[0]<-6;
const put=(im,ax,ay,X,Y)=>{if(!gok(im))return null;const w=im.naturalWidth*sc,h=im.naturalHeight*sc;x.drawImage(im,X-w*ax,Y-h*ay,w,h);return[X,Y,w,h]};
const arm=(side,sw)=>{const a=put(I[side+' Arm'],GL.arm[2],GL.arm[3],(side=='Left'?-1:1)*bw*GL.arm[0],GS*GL.arm[1]+sw);if(a)put(I[side+' Hand'],.5,.5,a[0],a[1]+a[3]*(1-GL.arm[3]))};
x.save();x.translate(px,py);x.fillStyle='rgba(0,0,0,.3)';x.beginPath();x.ellipse(0,GS*.55,6,2,0,0,7);x.fill();
x.translate(0,Math.sin(t*3)*1.2);if(fl)x.scale(-1,1);if(lit&&'filter' in x)x.filter='sepia(1) saturate(5) hue-rotate(-25deg)';
const s1=Math.sin(t*3+1)*.8,s2=Math.sin(t*3+2)*.8;
arm('Right',s1);put(B,.5,.5,0,0);arm('Left',s2);
const h=put(I.Head,GL.head[2],GL.head[3],bw*GL.head[0],GS*GL.head[1]);
if(h)put(I['Face 0'+(CG.f+1)],.5,.5,h[0]+6,h[1]-h[3]*(GL.head[3]-.5));
const E=I['Spells Effect'];if(sp&&gok(E)){x.globalAlpha=.55+.3*Math.sin(t*10);const w=34,hh=34*E.naturalHeight/E.naturalWidth;x.drawImage(E,-w/2,-hh/2,w,hh);x.globalAlpha=1}
x.restore();return true}
function saveGhost(){try{localStorage.setItem('hs_ghost',JSON.stringify(CG))}catch(e){}}
function cust(r,d){const next=(r?CG.f:CG.w)+d+(r?3:3);const i=next%3;
if(r?unlockedFace(i):unlockedWraith(i)){if(r)CG.f=i;else CG.w=i;saveGhost();beep(600,.06,'square',.04)}
else say('Locked: '+(r?faceText(i):unlockText(i)))}
function custSelect(r,i){uiClick();if(r?unlockedFace(i):unlockedWraith(i)){if(r)CG.f=i;else CG.w=i;saveGhost();beep(600,.06,'square',.04)}else say('Locked: '+(r?faceText(i):unlockText(i)))}
function keyIcon(px,py,locked){x.save();x.translate(px,py);x.strokeStyle=locked?'#9a8fb5':'#ffd98a';x.fillStyle=locked?'#9a8fb5':'#ffd98a';x.lineWidth=2;x.beginPath();x.arc(-3,0,4,0,7);x.stroke();x.fillRect(1,-1,9,3);x.fillRect(6,2,2,4);x.restore()}
function custClick(){if(hit(mouse,570,368,180,38)){uiClick();scr='main';return}
for(let i=0;i<3;i++){const y=126+i*62;if(hit(mouse,42,y,202,54))custSelect(1,i);if(hit(mouse,262,y,202,54))custSelect(0,i)}}
function custCard(x0,y0,w,h,label,sub,active,locked){x.fillStyle=active?'rgba(65,48,90,.95)':'rgba(20,12,40,.9)';x.fillRect(x0,y0,w,h);x.strokeStyle=active?'#ffd98a':'#bfe6ff';x.lineWidth=2;x.strokeRect(x0,y0,w,h);keyIcon(x0+18,y0+19,locked);txt(label,x0+34,y0+22,15,locked?'#8c819f':'#fff','left');txt(sub,x0+34,y0+42,11,locked?'#8c819f':'#ffd98a','left')}
function drawCust(){const t=performance.now()/1000;txt('CUSTOMIZE',432,56,24,'#bfe6ff');txt('Faces',145,94,17,'#ffd98a','center');txt('Outfits',365,94,17,'#ffd98a','center');
for(let i=0;i<3;i++){const y=126+i*62;custCard(42,y,202,54,'Face '+(i+1),faceText(i),CG.f==i,!unlockedFace(i));custCard(262,y,202,54,'Wraith '+(i+1),unlockText(i),CG.w==i,!unlockedWraith(i))}
x.fillStyle='rgba(20,12,40,.9)';x.fillRect(535,78,250,270);x.strokeStyle='#bfe6ff';x.lineWidth=3;x.strokeRect(535,78,250,270);txt('YOUR GHOST',660,104,15,'#bfe6ff');x.save();x.translate(660,284);x.scale(9,9);ghost(0,0,t,false,false);x.restore();
btn('Back',570,368,180,38,hit(mouse,570,368,180,38));txt('Click an item to equip    A/D outfit   W/S face',432,420,12,'#9a8fb5')}
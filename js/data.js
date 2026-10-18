/* DATA: constants, rooms, walls, windows (sun beams), furniture, switches */
const S=3,DAY=150,NEED=10,W=448,H=216;
const WRAITH_UNLOCKS=[
  {label:'Wraith 01',kind:'starter',need:0},
  {label:'Wraith 02',kind:'echoes',need:100},
  {label:'Wraith 03',kind:'haunts',need:25}
];
const cv=document.getElementById('c'),x=cv.getContext('2d');x.imageSmoothingEnabled=false;
const im={};let loaded=0;
for(const k in IMG){const i=new Image();i.onload=()=>loaded++;i.src=IMG[k];im[k]=i}
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),rnd=(a,b)=>a+Math.random()*(b-a);
// floor patterns cut from the floors sheet
const PAT={};
function mkPat(){const c={olive:[20,20,56,56],orange:[84,18,56,28],red:[84,52,56,24],cream:[148,18,56,58],tan:[212,18,56,26],otile:[212,52,56,70],brick:[20,84,56,40],beige:[84,84,56,40],brick2:[148,84,56,40]};
for(const k in c){const a=c[k],n=document.createElement('canvas');n.width=a[2];n.height=a[3];n.getContext('2d').drawImage(im.house,a[0],a[1],a[2],a[3],0,0,a[2],a[3]);PAT[k]=x.createPattern(n,'repeat')}}
// ROOMS: id,name,x,y,w,h,floor,darkness,lightsOnAtStart
const R=[['entry','Entry hall',8,128,72,80,'brick',.45,0],['living','Living room',84,128,120,80,'cream',.35,1],['kitchen','Kitchen',208,128,80,80,'otile',.4,1],
['study','Study',292,128,72,80,'olive',.6,0],['base','Basement',368,128,72,80,'brick2',.8,0],['master','Master bedroom',8,8,88,80,'beige',.45,0],
['kid',"Kid's room",100,8,88,80,'tan',.35,1],['bath','Bathroom',192,8,72,80,'otile',.45,0],['attic','Attic',268,8,96,80,'red',.65,0],
['hall','Hallway and stairs',8,92,432,32,'beige',.55,0]].map(a=>({id:a[0],name:a[1],x:a[2],y:a[3],w:a[4],h:a[5],fl:a[6],dk:a[7],on0:a[8],on:a[8]}));
const roomById=id=>R.find(r=>r.id==id);
const roomOf=(px,py)=>R.find(r=>px>=r.x&&px<r.x+r.w&&py>=r.y&&py<r.y+r.h);
// WALLS (x,y,w,h) with a door gap on the hallway side of every room
const WALLS=[[4,92,4,32],[440,92,4,32],[368,88,72,4]],DOORS=[];
R.forEach(r=>{if(r.id=='hall')return;const t=4,n=r.y<92,dx=r.x+r.w/2,gp=8;
const full=yy=>WALLS.push([r.x-t,yy,r.w+2*t,t]),gap=yy=>{WALLS.push([r.x-t,yy,dx-gp-(r.x-t),t],[dx+gp,yy,r.x+r.w+t-(dx+gp),t]);DOORS.push([dx-gp,yy,2*gp,t])};
n?(full(r.y-t),gap(r.y+r.h)):(gap(r.y-t),full(r.y+r.h));WALLS.push([r.x-t,r.y,t,r.h],[r.x+r.w,r.y,t,r.h])});
function wallHit(p,rad){for(const w of WALLS){const cx=clamp(p[0],w[0],w[0]+w[2]),cy=clamp(p[1],w[1],w[1]+w[3]);let dx=p[0]-cx,dy=p[1]-cy,d=Math.hypot(dx,dy);
if(d<rad){if(d<.001){dx=0;dy=-1;d=1}p[0]+=dx/d*(rad-d);p[1]+=dy/d*(rad-d)}}}
// WINDOWS: room,side,position(0-1),width,startAngle,sweep -> a sun beam that swings through the day
const WIN=[['living','s',.3,24,-.6,1.2],['living','s',.75,24,-.7,1.3],['entry','w',.5,20,-.4,.9],['kitchen','s',.5,24,-.5,1.1],['master','n',.5,22,-.5,1],
['kid','n',.3,18,-.4,1],['kid','n',.75,18,-.6,1.1],['bath','n',.5,14,-.3,.8],['attic','n',.5,40,-.7,1.4]].map(a=>{const r=roomById(a[0]),s=a[1],c=a[2],w=a[3];let p1,p2;
if(s=='w'){const xx=r.x-2,y1=r.y+r.h*c-w/2;p1=[xx,y1];p2=[xx,y1+w]}else{const yy=s=='n'?r.y-2:r.y+r.h+2,x1=r.x+r.w*c-w/2;p1=[x1,yy];p2=[x1+w,yy]}
return{r,side:s,p1,p2,a0:a[4],sw:a[5],closed:0,ct:0,cx:(p1[0]+p2[0])/2,cy:(p1[1]+p2[1])/2}});
function beams(t){return WIN.filter(w=>!w.closed).map(w=>{const a=w.a0+w.sw*t,L=110,s=w.side,d=s=='n'?[Math.sin(a),Math.cos(a)]:s=='s'?[Math.sin(a),-Math.cos(a)]:[Math.cos(a),Math.sin(a)];
return{w,d,P:[w.p1,w.p2,[w.p2[0]+d[0]*L,w.p2[1]+d[1]*L],[w.p1[0]+d[0]*L,w.p1[1]+d[1]*L]]}})}
function inQ(p,P){let s=0;for(let i=0;i<4;i++){const a=P[i],b=P[(i+1)%4],c=(b[0]-a[0])*(p[1]-a[1])-(b[1]-a[1])*(p[0]-a[0]);s|=c>0?1:2}return s!=3}
function shadow(c,f,d){const L=70,q=[[f.x,f.y],[f.x+f.w,f.y],[f.x+f.w,f.y+f.h],[f.x,f.y+f.h]];c.fillRect(f.x,f.y,f.w,f.h);
for(let i=0;i<4;i++){const a=q[i],b=q[(i+1)%4];c.beginPath();c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);c.lineTo(b[0]+d[0]*L,b[1]+d[1]*L);c.lineTo(a[0]+d[0]*L,a[1]+d[1]*L);c.closePath();c.fill()}}
// OBJECTS: id,name,srcX,srcY,w,h,destX,destY,haunt?,room
const O=[['coat','Coat rack',49,116,13,44,12,132,1,'entry'],['mirror','Hall mirror',115,114,25,44,50,132,1,'entry'],['plant','Plant',3,168,12,23,14,182,0,'entry'],
['clock','Grandfather clock',70,113,22,46,90,132,1,'living'],['fire','Fireplace',148,112,25,40,118,132,1,'living'],['sofa','Sofa',24,166,50,26,134,176,1,'living'],
['arm','Armchair',176,116,23,37,92,168,0,'living'],['plant2','Plant',3,168,12,23,186,184,0,'living'],
['fridge','Fridge',35,196,26,53,212,132,1,'kitchen'],['stove','Stove',65,193,30,40,246,132,1,'kitchen'],['table','Table',1,32,46,30,224,172,0,'kitchen'],['plant3','Plant',3,168,12,23,272,180,0,'kitchen'],
['books','Bookshelf',33,64,46,46,296,132,1,'study'],['desk','Desk',4,117,25,35,300,172,0,'study'],['arm2','Armchair',176,116,23,37,338,168,0,'study'],['plant4','Plant',3,168,12,23,346,134,0,'study'],
['dmirror','Dusty mirror',115,114,25,44,372,132,1,'base'],['furnace','Old furnace',65,193,30,40,372,166,1,'base'],['iron','Ironing board',51,265,24,22,410,180,0,'base'],['coat2','Coat rack',49,116,13,44,420,134,0,'base'],
['dresser','Dresser',4,117,25,35,12,12,1,'master'],['mmirror','Mirror',115,114,25,44,70,10,1,'master'],['ward','Wardrobe',97,65,46,45,12,42,1,'master'],['arm3','Armchair',176,116,23,37,66,50,0,'master'],
['toys','Toy shelf',33,64,46,46,138,10,1,'kid'],['chest','Toy chest',4,117,25,35,106,48,1,'kid'],['ptable','Play table',1,32,46,30,140,56,0,'kid'],['plant5','Plant',3,168,12,23,108,12,0,'kid'],
['tub','Bathtub',82,265,42,22,196,12,1,'bath'],['toilet','Toilet',129,257,15,31,244,12,0,'bath'],['sink','Sink',23,258,20,28,212,46,0,'bath'],['plant6','Plant',3,168,12,23,246,56,0,'bath'],
['amirror','Old mirror',115,114,25,44,300,12,1,'attic'],['aclock','Old clock',70,113,22,46,332,12,1,'attic'],['coat3','Coat rack',49,116,13,44,272,14,0,'attic'],['arm4','Armchair',176,116,23,37,300,50,0,'attic'],['table3','Table',1,32,46,30,316,56,0,'attic']];
O.forEach(o=>o.shake=0);
const T=O.filter(o=>o[8]);
const FURN=O.map(o=>({r:roomById(o[9]),x:o[6]+1,y:o[7]+o[5]*.4,w:o[4]-2,h:o[5]*.6}));
// LIGHT SWITCHES (one per room, next to the door)
const SW=R.filter(r=>r.id!='hall').map(r=>({r,x:r.x+r.w/2+12,y:r.y<92?r.y+r.h-5:r.y+5}));
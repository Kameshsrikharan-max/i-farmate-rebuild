"use strict";
if(!CanvasRenderingContext2D.prototype.roundRect){
  CanvasRenderingContext2D.prototype.roundRect=function(x,y,w,h,r){r=Math.min(r,w/2,h/2);this.moveTo(x+r,y);this.lineTo(x+w-r,y);this.arcTo(x+w,y,x+w,y+r,r);this.lineTo(x+w,y+h-r);this.arcTo(x+w,y+h,x+w-r,y+h,r);this.lineTo(x+r,y+h);this.arcTo(x,y+h,x,y+h-r,r);this.lineTo(x,y+r);this.arcTo(x,y,x+r,y,r);this.closePath();return this;};
}

/* ── LOADER ── */
const loader=document.getElementById('loader');
loader.addEventListener('animationend',()=>{loader.classList.add('done');setTimeout(()=>loader.remove(),650);},{once:true});
setTimeout(()=>{if(loader.parentNode){loader.classList.add('done');setTimeout(()=>loader.remove(),650);}},2000);

/* ── CURSOR ── */
const cur=document.getElementById('cursor'),ring=document.getElementById('cr');
let mx=window.innerWidth/2,my=window.innerHeight/2,rx=mx,ry=my;
document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY});
(function ac(){rx+=(mx-rx)*.13;ry+=(my-ry)*.13;cur.style.left=mx+'px';cur.style.top=my+'px';ring.style.left=rx+'px';ring.style.top=ry+'px';requestAnimationFrame(ac);})();
document.querySelectorAll('a,button').forEach(el=>{
  el.addEventListener('mouseenter',()=>{cur.style.width='20px';cur.style.height='20px';ring.style.width='52px';ring.style.height='52px'});
  el.addEventListener('mouseleave',()=>{cur.style.width='10px';cur.style.height='10px';ring.style.width='36px';ring.style.height='36px'});
});

/* ══ NAVBAR ══ */
const navToggle=document.getElementById('nav-toggle');
const navBar=document.getElementById('nav-bar');
const navRingCircle=document.getElementById('nav-ring-circle');
const pb=document.getElementById('pb');
const ringCircumference=2*Math.PI*26;
let navOpen=false;
function openNav(){navOpen=true;navBar.classList.add('open');navToggle.classList.add('open');navToggle.setAttribute('aria-expanded','true');navToggle.setAttribute('aria-label','Close navigation');}
function closeNav(){navOpen=false;navBar.classList.remove('open');navToggle.classList.remove('open');navToggle.setAttribute('aria-expanded','false');navToggle.setAttribute('aria-label','Open navigation');}
navToggle.addEventListener('click',()=>{if(navOpen) closeNav(); else openNav();});
document.querySelectorAll('.nb-link,.nb-brand,.nb-cta').forEach(a=>{a.addEventListener('click',()=>closeNav());});
document.addEventListener('click',e=>{if(navOpen&&!navBar.contains(e.target)&&!navToggle.contains(e.target)){closeNav();}});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&navOpen)closeNav();});
function updateScrollProgress(){
  const sy=window.scrollY,msy=document.documentElement.scrollHeight-window.innerHeight;
  const prog=msy>0?sy/msy:0;
  pb.style.width=(prog*100)+'%';
  const offset=ringCircumference*(1-prog);
  navRingCircle.style.strokeDashoffset=offset;
  const sections=['hero','cap','about','ben','explore','prod','cta'];
  let current='hero';
  sections.forEach(id=>{const el=document.getElementById(id);if(el&&el.getBoundingClientRect().top<window.innerHeight*0.5)current=id;});
  document.querySelectorAll('.nb-link').forEach(a=>{const href=a.getAttribute('href').replace('#','');a.classList.toggle('nb-active',href===current);});
}
window.addEventListener('scroll',updateScrollProgress,{passive:true});
updateScrollProgress();

/* ── CUBE DRAG ── */
(function initCubeDrag(){
  const cubeEl=document.getElementById('about-cube');if(!cubeEl)return;
  let isDragging=false,startX=0,startY=0,rotX=-15,rotY=0,dragRotX=-15,dragRotY=0;
  cubeEl.parentElement.addEventListener('mousedown',e=>{isDragging=true;startX=e.clientX;startY=e.clientY;dragRotX=rotX;dragRotY=rotY;cubeEl.style.animation='none';e.preventDefault();});
  window.addEventListener('mousemove',e=>{if(!isDragging)return;rotY=dragRotY+(e.clientX-startX)*0.5;rotX=dragRotX-(e.clientY-startY)*0.5;cubeEl.style.transform=`rotateX(${rotX}deg) rotateY(${rotY}deg)`;});
  window.addEventListener('mouseup',()=>{if(!isDragging)return;isDragging=false;setTimeout(()=>{const style=document.createElement('style');const id='cube-anim-'+Date.now();style.textContent=`@keyframes cubeRotateDynamic{0%{transform:rotateX(${rotX}deg) rotateY(${rotY}deg)}100%{transform:rotateX(${rotX}deg) rotateY(${rotY+360}deg)}}`;document.head.appendChild(style);cubeEl.style.animation=`cubeRotateDynamic 12s linear infinite`;},2000);});
  cubeEl.parentElement.addEventListener('touchstart',e=>{const t=e.touches[0];isDragging=true;startX=t.clientX;startY=t.clientY;dragRotX=rotX;dragRotY=rotY;cubeEl.style.animation='none';e.preventDefault();},{passive:false});
  window.addEventListener('touchmove',e=>{if(!isDragging)return;const t=e.touches[0];rotY=dragRotY+(t.clientX-startX)*0.5;rotX=dragRotX-(t.clientY-startY)*0.5;cubeEl.style.transform=`rotateX(${rotX}deg) rotateY(${rotY}deg)`;},{passive:true});
  window.addEventListener('touchend',()=>{isDragging=false;});
})();

/* ── ROOT CANVAS ── */
const rcan=document.getElementById('rc'),rctx=rcan.getContext('2d');
function szRC(){rcan.width=rcan.offsetWidth;rcan.height=rcan.offsetHeight}
szRC();window.addEventListener('resize',szRC,{passive:true});
const roots=[];
class Rt{constructor(x,y,a,d){this.x=x;this.y=y;this.a=a;this.d=d;this.l=0;this.ml=40+Math.random()*80;this.sp=.5+Math.random()*.7;this.sp2=false;this.al=.08+Math.random()*.15;this.w=Math.max(.3,1.6-d*.22);}grow(){if(this.l<this.ml){this.l+=this.sp;if(!this.sp2&&this.l>this.ml*.65&&this.d<5&&Math.random()<.007){this.sp2=true;const s=(Math.random()-.5)*.85;const ex=this.x+Math.cos(this.a)*this.l,ey=this.y+Math.sin(this.a)*this.l;roots.push(new Rt(ex,ey,this.a+s,this.d+1));if(Math.random()<.35)roots.push(new Rt(ex,ey,this.a-s*.6,this.d+1));}}}draw(ctx){const ex=this.x+Math.cos(this.a)*this.l,ey=this.y+Math.sin(this.a)*this.l;ctx.beginPath();ctx.moveTo(this.x,this.y);ctx.lineTo(ex,ey);ctx.strokeStyle=`rgba(57,255,20,${this.al})`;ctx.lineWidth=this.w;ctx.stroke();}}
for(let i=0;i<7;i++)roots.push(new Rt(rcan.width*(.1+Math.random()*.8),rcan.height*(.5+Math.random()*.5),-Math.PI*.5+(Math.random()-.5)*.55,0));
let rf=0,rf2=0;
(function ar(){rf++;if(rf%2===0){rctx.clearRect(0,0,rcan.width,rcan.height);roots.forEach(r=>{r.grow();r.draw(rctx)});rf2++;if(rf2%90===0&&roots.length<250)roots.push(new Rt(rcan.width*(.1+Math.random()*.8),rcan.height*(.6+Math.random()*.4),-Math.PI*.5+(Math.random()-.5)*.5,0));if(roots.length>450)roots.splice(0,40);}requestAnimationFrame(ar);})();

/* ── GRASS CANVAS ── */
const gcan=document.getElementById('gc'),gctx=gcan.getContext('2d');
function szGC(){gcan.width=window.innerWidth;gcan.height=170;}
szGC();window.addEventListener('resize',()=>{szGC();initGrass();},{passive:true});
class Blade{constructor(x){this.x=x;this.by=gcan.height;this.mh=32+Math.random()*55;this.h=0;this.a=(Math.random()-.5)*.42;this.th=1.6+Math.random()*1.8;this.hue=108+Math.random()*28;this.ph=Math.random()*Math.PI*2;this.amp=.035+Math.random()*.06;this.cut=false;this.gs=.45+Math.random()*.8;this.c1=`hsl(${this.hue},62%,16%)`;this.c2=`hsl(${this.hue+10},82%,36%)`;this.c3=`hsl(${this.hue+22},98%,55%)`;this.c4=`hsla(${this.hue+30},100%,72%,.5)`;this.sw=0;}update(t){if(!this.cut&&this.h<this.mh)this.h=Math.min(this.h+this.gs,this.mh);if(this.cut)this.h=Math.max(this.h-2.2,0);this.sw=Math.sin(t*.00065+this.ph)*this.amp*this.h;}draw(){if(this.h<1)return;const sw=this.sw,h=this.h,bw=this.th;const cp1x=sw*.28,cp1y=-h*.38;const cp2x=sw*.68,cp2y=-h*.72;const tx=sw,ty=-h;const grd=gctx.createLinearGradient(0,0,tx,ty);grd.addColorStop(0,this.c1);grd.addColorStop(.38,this.c2);grd.addColorStop(.78,this.c3);grd.addColorStop(1,this.c4);gctx.save();gctx.translate(this.x,this.by);gctx.rotate(this.a);gctx.beginPath();gctx.moveTo(-bw,0);gctx.bezierCurveTo(-bw+cp1x*.5,cp1y,-bw*.25+cp2x,cp2y,tx-.4,ty);gctx.lineTo(tx,ty-1.5);gctx.lineTo(tx+.4,ty);gctx.bezierCurveTo(bw*.25+cp2x,cp2y,bw+cp1x*.5,cp1y,bw,0);gctx.closePath();gctx.fillStyle=grd;gctx.fill();gctx.restore();}}
class Cutter{constructor(){this.x=-70;this.active=false;this.done=false;this.ba=0;this.lp=0;}activate(){this.x=-70;this.active=true;this.done=false;}update(blades){if(!this.active)return;this.x+=2.8;this.ba+=.32;this.lp+=.16;const lo=this.x-24,hi=this.x+24;for(let i=0;i<blades.length;i++){const b=blades[i];if(b.x<lo)continue;if(b.x>hi)break;if(!b.cut&&b.h>3)b.cut=true;}if(this.x>gcan.width+80){this.active=false;this.done=true;}}draw(){if(!this.active)return;const x=this.x,y=gcan.height-20;gctx.save();const tg=gctx.createLinearGradient(x-55,0,x,0);tg.addColorStop(0,'rgba(57,255,20,0)');tg.addColorStop(1,'rgba(57,255,20,.04)');gctx.fillStyle=tg;gctx.fillRect(x-55,y-32,55,38);gctx.fillStyle='#1c2416';gctx.strokeStyle='#39FF14';gctx.lineWidth=1.4;gctx.beginPath();this._rr(x-17,y-25,34,19,4);gctx.fill();gctx.stroke();gctx.beginPath();this._rr(x-11,y-39,22,15,3);gctx.fill();gctx.stroke();const vg=gctx.createLinearGradient(x-7,0,x+7,0);vg.addColorStop(0,'rgba(57,255,20,.15)');vg.addColorStop(.5,'rgba(57,255,20,.85)');vg.addColorStop(1,'rgba(57,255,20,.15)');gctx.fillStyle=vg;gctx.beginPath();this._rr(x-7,y-36,14,5,1.5);gctx.fill();gctx.strokeStyle='rgba(57,255,20,.75)';gctx.lineWidth=1.1;gctx.beginPath();gctx.moveTo(x,y-39);gctx.lineTo(x,y-46);gctx.stroke();gctx.beginPath();gctx.arc(x,y-48,2.8,0,Math.PI*2);gctx.fillStyle='#39FF14';gctx.fill();gctx.strokeStyle='#E8A020';gctx.lineWidth=1.8;gctx.beginPath();gctx.moveTo(x+17,y-17);gctx.lineTo(x+30,y-17);gctx.stroke();gctx.save();gctx.translate(x+30,y-17);for(let i=0;i<4;i++){const a=this.ba+i*Math.PI/2;gctx.beginPath();gctx.moveTo(0,0);gctx.lineTo(Math.cos(a)*8,Math.sin(a)*8);gctx.strokeStyle='rgba(232,160,32,.75)';gctx.lineWidth=1.8;gctx.lineCap='round';gctx.stroke();}gctx.beginPath();gctx.arc(0,0,3,0,Math.PI*2);gctx.fillStyle='#E8A020';gctx.fill();gctx.restore();gctx.strokeStyle='rgba(57,255,20,.55)';gctx.lineWidth=1.3;gctx.beginPath();gctx.moveTo(x-17,y-17);gctx.lineTo(x-26,y-26);gctx.stroke();gctx.beginPath();gctx.arc(x-28,y-28,3.5,0,Math.PI*2);gctx.fillStyle='rgba(57,255,20,.12)';gctx.strokeStyle='rgba(57,255,20,.7)';gctx.lineWidth=1;gctx.fill();gctx.stroke();gctx.save();gctx.translate(x-28,y-28);gctx.rotate(this.ba*.4);gctx.strokeStyle='rgba(57,255,20,.55)';gctx.lineWidth=.9;gctx.beginPath();gctx.moveTo(-3,0);gctx.lineTo(3,0);gctx.stroke();gctx.beginPath();gctx.moveTo(0,-3);gctx.lineTo(0,3);gctx.stroke();gctx.restore();const lo2=Math.sin(this.lp)*2.5;[-11,11].forEach((ox,i)=>{const wy=y+lo2*(i===0?1:-1);gctx.beginPath();gctx.arc(x+ox,wy,6,0,Math.PI*2);gctx.fillStyle='#0a1208';gctx.strokeStyle='#39FF14';gctx.lineWidth=1;gctx.fill();gctx.stroke();gctx.save();gctx.translate(x+ox,wy);gctx.rotate(this.lp*(ox>0?1:-1));gctx.strokeStyle='rgba(57,255,20,.4)';gctx.lineWidth=.8;gctx.beginPath();gctx.moveTo(-4,0);gctx.lineTo(4,0);gctx.stroke();gctx.beginPath();gctx.moveTo(0,-4);gctx.lineTo(0,4);gctx.stroke();gctx.restore();});const blinkOn=Math.floor(this.ba*1.2)%2===0;gctx.beginPath();gctx.arc(x+6,y-30,2,0,Math.PI*2);gctx.fillStyle=blinkOn?'#39FF14':'rgba(57,255,20,.15)';gctx.fill();if(Math.random()<.4){const sx=x-6+Math.random()*12,sy=y-6;gctx.beginPath();gctx.arc(sx,sy,1,0,Math.PI*2);gctx.fillStyle=`rgba(232,160,32,${Math.random()*.6+.2})`;gctx.fill();}gctx.restore();}_rr(x,y,w,h,r){r=Math.min(r,w/2,h/2);gctx.moveTo(x+r,y);gctx.lineTo(x+w-r,y);gctx.arcTo(x+w,y,x+w,y+r,r);gctx.lineTo(x+w,y+h-r);gctx.arcTo(x+w,y+h,x+w-r,y+h,r);gctx.lineTo(x+r,y+h);gctx.arcTo(x,y+h,x,y+h-r,r);gctx.lineTo(x,y+r);gctx.arcTo(x,y,x+r,y,r);gctx.closePath();}}
let blades=[],cutter=new Cutter();
let gPhase='growing',gStart=Date.now(),gCutTime=0;
function initGrass(){blades=[];cutter=new Cutter();gPhase='growing';gStart=Date.now();const sp=4.2,cnt=Math.floor(gcan.width/sp);for(let i=0;i<cnt;i++)blades.push(new Blade(sp/2+i*sp+Math.random()*1.2));blades.sort((a,b)=>a.x-b.x);}
initGrass();
(function ag(){const now=Date.now(),elapsed=now-gStart;gctx.clearRect(0,0,gcan.width,gcan.height);blades.forEach(b=>{b.update(now);b.draw();});if(gPhase==='growing'){if(elapsed>6500&&!cutter.active&&!cutter.done)cutter.activate();if(cutter.done){gPhase='cut';gCutTime=now;}}else if(gPhase==='cut'){if(now-gCutTime>10000){gPhase='growing';gStart=now;blades.forEach(b=>{b.cut=false;b.h=0;b.gs=.45+Math.random()*.8;});cutter=new Cutter();}}cutter.update(blades);cutter.draw();requestAnimationFrame(ag);})();

/* ── SCROLL ROBOTS ── */
const rbdEl=document.getElementById('rbd'),rbuEl=document.getElementById('rbu');
const robotTipEl=document.getElementById('robot-tip');
const tipTextEl=document.querySelector('.tip-text');
const rdC=document.createElement('canvas');rdC.width=54;rdC.height=74;rbdEl.appendChild(rdC);
const ruC=document.createElement('canvas');ruC.width=54;ruC.height=74;rbuEl.appendChild(ruC);
const rdx=rdC.getContext('2d'),rux=ruC.getContext('2d');
const SECTION_TIPS=[{id:'hero',msg:"🚜 i-Farmate here! I work 24/7 so farmers don't have to."},{id:'about',msg:"🌱 Zero chemicals. Full autonomy. That's how I farm."},{id:'rcs',msg:"🤖 That scene below? That's me meeting a farmer for the first time!"},{id:'cap',msg:"▶ Watch the demo on the right — live on the field!"},{id:'ben',msg:"🌾 Flip the cards to explore who benefits from i-Farmate!"},{id:'how',msg:"🔄 Patrol → Detect → Act → Report. Four steps to smarter farming."},{id:'explore',msg:"🖼 Swipe through to explore everything i-Farmate can do!"},{id:'prod',msg:"📦 FarmFair, TerraMate, Thaniyas — the full agri-ecosystem!"},{id:'cta',msg:"🚀 Book a demo! I'd love to visit your farm."},{id:'footer-section',msg:"📞 Reach out anytime. Thank you for exploring i-Farmate! 🌿"}];
let robotTipTimer=null,lastShownSection='';
function showRobotTip(msg){if(robotTipTimer)clearTimeout(robotTipTimer);tipTextEl.textContent=msg;robotTipEl.classList.add('show');robotTipTimer=setTimeout(()=>robotTipEl.classList.remove('show'),4500);}
function updateRobotTipForScroll(robotVisualY){let closestSection=null,closestDist=Infinity;SECTION_TIPS.forEach(s=>{const el=document.getElementById(s.id);if(!el)return;const rect=el.getBoundingClientRect(),mid=(rect.top+rect.bottom)/2,dist=Math.abs(robotVisualY-mid);if(dist<closestDist){closestDist=dist;closestSection=s;}});if(closestSection&&closestSection.id!==lastShownSection&&closestDist<window.innerHeight*0.45){lastShownSection=closestSection.id;showRobotTip(closestSection.msg);}}
function drawHarvester(ctx,lf,active){ctx.clearRect(0,0,54,74);if(!active)return;const t=lf,cx=27,by=62;ctx.save();ctx.translate(cx,by);const lean=Math.sin(t*.07)*1.2;ctx.rotate(lean*Math.PI/180);ctx.save();ctx.globalAlpha=.18;ctx.beginPath();ctx.ellipse(1,4,9,2.5,0,0,Math.PI*2);ctx.fillStyle='#000';ctx.fill();ctx.restore();[[-15,-5],[6,-5]].forEach(([ox,oy])=>{ctx.beginPath();ctx.roundRect(ox,oy,9,9,2.5);ctx.fillStyle='#192414';ctx.strokeStyle='#39FF14';ctx.lineWidth=1;ctx.fill();ctx.stroke();ctx.fillStyle='rgba(57,255,20,.28)';for(let i=0;i<3;i++){ctx.beginPath();ctx.roundRect(ox+i*3,.5+oy,1.8,7,1);ctx.fill();}ctx.fillStyle='#192414';});ctx.fillStyle='#0a1208';ctx.strokeStyle='rgba(57,255,20,.45)';ctx.lineWidth=.8;ctx.beginPath();ctx.roundRect(-4,-2.5,8,5,2);ctx.fill();ctx.stroke();ctx.fillStyle='#1c2416';ctx.strokeStyle='#39FF14';ctx.lineWidth=1.4;ctx.beginPath();ctx.roundRect(-12,-24,24,20,3.5);ctx.fill();ctx.stroke();ctx.strokeStyle='rgba(57,255,20,.32)';ctx.lineWidth=.8;ctx.beginPath();ctx.roundRect(-9,-22,18,13,1.5);ctx.stroke();['#39FF14','#E8A020','#39FF14'].forEach((c,i)=>{ctx.beginPath();ctx.arc(-4+i*4,-18,1.4,0,Math.PI*2);ctx.fillStyle=Math.floor(t*.045+i)%2===0?c:'rgba(57,255,20,.18)';ctx.fill();});ctx.strokeStyle='rgba(57,255,20,.38)';ctx.lineWidth=.65;ctx.beginPath();ctx.moveTo(-6,-13);ctx.lineTo(2,-13);ctx.stroke();ctx.beginPath();ctx.moveTo(-6,-10);ctx.lineTo(5,-10);ctx.stroke();const as=Math.sin(t*.08)*6;ctx.strokeStyle='rgba(57,255,20,.65)';ctx.lineWidth=1.3;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(12,-16);ctx.lineTo(19,-16+as);ctx.stroke();ctx.save();ctx.translate(19,-16+as);for(let i=0;i<3;i++){const ba=t*.12+i*(Math.PI*2/3);ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(Math.cos(ba)*6,Math.sin(ba)*6);ctx.strokeStyle=`rgba(232,160,32,${.6+Math.abs(Math.cos(ba))*.3})`;ctx.lineWidth=1.5;ctx.lineCap='round';ctx.stroke();}ctx.beginPath();ctx.arc(0,0,2.5,0,Math.PI*2);ctx.fillStyle='#E8A020';ctx.fill();ctx.restore();ctx.strokeStyle='rgba(57,255,20,.55)';ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(-12,-16);ctx.lineTo(-19,-14-as*.4);ctx.stroke();ctx.beginPath();ctx.arc(-21,-13-as*.4,2.5,0,Math.PI*2);ctx.fillStyle='rgba(57,255,20,.12)';ctx.strokeStyle='rgba(57,255,20,.55)';ctx.lineWidth=.9;ctx.fill();ctx.stroke();ctx.save();ctx.translate(-21,-13-as*.4);ctx.rotate(t*.06);ctx.strokeStyle='rgba(57,255,20,.45)';ctx.lineWidth=.7;ctx.beginPath();ctx.moveTo(-2.5,0);ctx.lineTo(2.5,0);ctx.stroke();ctx.beginPath();ctx.moveTo(0,-2.5);ctx.lineTo(0,2.5);ctx.stroke();ctx.restore();ctx.fillStyle='#1c2416';ctx.strokeStyle='#39FF14';ctx.lineWidth=1.4;ctx.beginPath();ctx.roundRect(-9,-36,18,13,2.5);ctx.fill();ctx.stroke();const vg=ctx.createLinearGradient(-6,-34,6,-34);vg.addColorStop(0,'rgba(57,255,20,.12)');vg.addColorStop(.5,'rgba(57,255,20,.82)');vg.addColorStop(1,'rgba(57,255,20,.12)');ctx.beginPath();ctx.roundRect(-6,-34.5,12,5.5,1.2);ctx.fillStyle=vg;ctx.fill();ctx.strokeStyle='rgba(57,255,20,.38)';ctx.lineWidth=.65;ctx.beginPath();ctx.moveTo(2.5,-36);ctx.lineTo(6.5,-42);ctx.stroke();ctx.beginPath();ctx.arc(6.5,-44,2.2,0,Math.PI*2);ctx.fillStyle=Math.floor(t*.038)%2===0?'#39FF14':'#1a5a08';ctx.fill();if(Math.random()<.3){const sx=(Math.random()-.5)*10,sy=-3+Math.random()*3;ctx.beginPath();ctx.arc(sx,sy,.8,0,Math.PI*2);ctx.fillStyle=`rgba(232,160,32,${Math.random()*.5+.2})`;ctx.fill();}ctx.restore();}
function drawInspector(ctx,lf,active){ctx.clearRect(0,0,54,74);if(!active)return;const t=lf,cx=27,by=62;const hv=Math.sin(t*.11)*1.8;ctx.save();ctx.translate(cx,by+hv);const lean=-Math.sin(t*.07)*1.2;ctx.rotate(lean*Math.PI/180);ctx.save();ctx.globalAlpha=.15;ctx.beginPath();ctx.ellipse(1,4-hv,8,2,0,0,Math.PI*2);ctx.fillStyle='#000';ctx.fill();ctx.restore();[-8,8].forEach(ox=>{ctx.beginPath();ctx.arc(ox,0,5,0,Math.PI*2);ctx.fillStyle='#111808';ctx.strokeStyle='#39FF14';ctx.lineWidth=1.1;ctx.fill();ctx.stroke();ctx.save();ctx.translate(ox,0);ctx.rotate(t*.14*(ox>0?1:-1));ctx.strokeStyle='rgba(57,255,20,.45)';ctx.lineWidth=.8;ctx.beginPath();ctx.moveTo(-4,0);ctx.lineTo(4,0);ctx.stroke();ctx.beginPath();ctx.moveTo(0,-4);ctx.lineTo(0,4);ctx.stroke();ctx.restore();});ctx.fillStyle='#1a2614';ctx.strokeStyle='rgba(57,255,20,.85)';ctx.lineWidth=1.4;ctx.beginPath();ctx.roundRect(-10,-23,20,19,4);ctx.fill();ctx.stroke();ctx.strokeStyle='rgba(57,255,20,.28)';ctx.lineWidth=.75;ctx.beginPath();ctx.roundRect(-7,-21,14,11,1.5);ctx.stroke();const sy2=-21+((t*1.8)%11);ctx.fillStyle='rgba(57,255,20,.38)';ctx.fillRect(-6,sy2,12,1.3);ctx.fillStyle='rgba(232,160,32,.38)';ctx.fillRect(-10,-12.5,20,1.4);const as2=Math.sin(t*.09)*4.5;ctx.strokeStyle='rgba(232,160,32,.78)';ctx.lineWidth=1.1;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(10,-14);ctx.lineTo(17,-14+as2);ctx.stroke();ctx.beginPath();ctx.roundRect(16,-17+as2,5.5,5.5,1.5);ctx.fillStyle='rgba(232,160,32,.12)';ctx.strokeStyle='rgba(232,160,32,.65)';ctx.lineWidth=.9;ctx.fill();ctx.stroke();ctx.strokeStyle='rgba(57,255,20,.65)';ctx.lineWidth=1.1;ctx.beginPath();ctx.moveTo(-10,-14);ctx.lineTo(-17,-12-as2*.4);ctx.stroke();ctx.beginPath();ctx.arc(-19,-11-as2*.4,2.5,0,Math.PI*2);ctx.fillStyle='rgba(57,255,20,.12)';ctx.strokeStyle='rgba(57,255,20,.6)';ctx.lineWidth=.9;ctx.fill();ctx.stroke();ctx.fillStyle='#1a2614';ctx.strokeStyle='rgba(57,255,20,.85)';ctx.lineWidth=1.4;ctx.beginPath();ctx.arc(0,-29,9.5,0,Math.PI*2);ctx.fill();ctx.stroke();[[-3.5,-30],[3.5,-30]].forEach(([ex,ey])=>{ctx.beginPath();ctx.arc(ex,ey,2.2,0,Math.PI*2);ctx.fillStyle=Math.floor(t*.055)%2===0?'rgba(57,255,20,.88)':'rgba(57,255,20,.35)';ctx.fill();});ctx.strokeStyle='rgba(57,255,20,.55)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(0,-38.5);ctx.lineTo(0,-44);ctx.stroke();ctx.save();ctx.translate(0,-45.5);ctx.rotate(t*.07);ctx.strokeStyle='rgba(57,255,20,.45)';ctx.lineWidth=.9;ctx.beginPath();ctx.moveTo(-3.5,0);ctx.lineTo(3.5,0);ctx.stroke();ctx.beginPath();ctx.arc(0,0,3.5,0,Math.PI*2);ctx.strokeStyle='rgba(57,255,20,.28)';ctx.stroke();ctx.restore();ctx.restore();}
let rY=90,prevSY=0,rLF=0,rActiveDown=true;
(function aro(){const sy=window.scrollY,msy=document.documentElement.scrollHeight-window.innerHeight,prog=msy>0?Math.min(1,sy/msy):0,delta=sy-prevSY;prevSY=sy;if(Math.abs(delta)>1){const newDown=delta>0;if(newDown!==rActiveDown){rActiveDown=newDown;rbdEl.style.display=newDown?'block':'none';rbuEl.style.display=newDown?'none':'block';}}const targetY=90+prog*(window.innerHeight-190);rY+=(targetY-rY)*.09;rbdEl.style.top=rY+'px';rbuEl.style.top=rY+'px';robotTipEl.style.top=(rY+10)+'px';updateRobotTipForScroll(rY+37);rLF+=Math.abs(delta)>.5?1.8:.25;drawHarvester(rdx,rLF,rActiveDown);drawInspector(rux,rLF,!rActiveDown);requestAnimationFrame(aro);})();

/* ── DRONE ── */
const droneWrap=document.getElementById('drone-wrap'),droneCvs=document.getElementById('drone-canvas'),droneTip=document.getElementById('drone-tooltip'),dctx=droneCvs.getContext('2d');
const droneTipText=document.querySelector('.drone-tip-text');
let droneX=window.innerWidth+60,droneY=-60,droneTX=window.innerWidth/2,droneTY=window.innerHeight/2,dronePropRot=0,droneT=0,droneAngle=0,droneVisible=true,droneTipShown=false;
function pickDroneTarget(){const margin=120;droneTX=margin+Math.random()*(window.innerWidth-margin*2);droneTY=margin+Math.random()*(window.innerHeight-margin*1.5);}
pickDroneTarget();setInterval(()=>{if(droneVisible)pickDroneTarget();},10000);
const DRONE_TIPS=['🌾 Scanning crop health…','🔍 Monitoring soil data…','⚡ All systems nominal!','📡 Sending field report…','🌱 Protecting your harvest.','🤖 AI-powered precision farming.','💧 Checking soil moisture…','🌿 Zero chemicals. Pure results.'];
let droneNearTarget=false;
function checkDroneNearTarget(){const dist=Math.hypot(droneX-droneTX,droneY-droneTY);if(dist<30&&!droneNearTarget&&droneVisible&&!droneTipShown){droneNearTarget=true;const msg=DRONE_TIPS[Math.floor(Math.random()*DRONE_TIPS.length)];droneTipText.textContent=msg;droneTip.style.opacity='1';droneTip.style.transform='translateX(-50%) translateY(0)';droneTipShown=true;setTimeout(()=>{droneTip.style.opacity='0';droneTip.style.transform='translateX(-50%) translateY(-8px)';droneTipShown=false;droneNearTarget=false;},2800);}if(dist>60)droneNearTarget=false;}
function checkDroneVisibility(){const heroEl=document.getElementById('hero');if(!heroEl)return;const heroBottom=heroEl.offsetTop+heroEl.offsetHeight,shouldShow=window.scrollY<heroBottom-100;if(shouldShow!==droneVisible){droneVisible=shouldShow;droneWrap.style.opacity=shouldShow?'1':'0';if(!shouldShow){droneTip.style.opacity='0';droneTipShown=false;}else{pickDroneTarget();}}}
window.addEventListener('scroll',checkDroneVisibility,{passive:true});checkDroneVisibility();
setTimeout(()=>{if(!droneVisible)return;droneTipText.textContent='🌱 i-Farmate — AI-powered farming, 24/7.';droneTip.style.opacity='1';droneTip.style.transform='translateX(-50%) translateY(0)';droneTipShown=true;setTimeout(()=>{droneTip.style.opacity='0';droneTip.style.transform='translateX(-50%) translateY(-8px)';droneTipShown=false;},3500);},3000);
function drawDrone(t){dctx.clearRect(0,0,90,90);const cx=45,cy=48;const glow=dctx.createRadialGradient(cx,cy,4,cx,cy,32);glow.addColorStop(0,'rgba(57,255,20,.18)');glow.addColorStop(1,'rgba(57,255,20,0)');dctx.beginPath();dctx.arc(cx,cy,32,0,Math.PI*2);dctx.fillStyle=glow;dctx.fill();[[-1,-1],[1,-1],[1,1],[-1,1]].forEach(([sx,sy2],i)=>{dctx.save();dctx.translate(cx,cy);dctx.rotate(Math.PI/4+i*Math.PI/2);dctx.fillStyle=i%2===0?'rgba(57,255,20,.7)':'rgba(232,160,32,.55)';dctx.fillRect(-1,0,2,24);dctx.beginPath();dctx.arc(0,24,4,0,Math.PI*2);dctx.fillStyle='#1c2416';dctx.fill();dctx.strokeStyle=i%2===0?'#39FF14':'#E8A020';dctx.lineWidth=1;dctx.stroke();dctx.save();dctx.translate(0,24);dctx.rotate(dronePropRot*(i%2===0?1:-1));dctx.strokeStyle=i%2===0?'rgba(57,255,20,.8)':'rgba(232,160,32,.7)';dctx.lineWidth=1.5;dctx.lineCap='round';dctx.beginPath();dctx.moveTo(-11,0);dctx.lineTo(11,0);dctx.stroke();dctx.beginPath();dctx.moveTo(0,-5);dctx.lineTo(0,5);dctx.stroke();dctx.restore();dctx.restore();});dctx.save();dctx.translate(cx,cy);dctx.beginPath();dctx.roundRect(-10,-4,20,8,3);dctx.fillStyle='#0a1208';dctx.strokeStyle='rgba(57,255,20,.6)';dctx.lineWidth=1.2;dctx.fill();dctx.stroke();dctx.beginPath();dctx.roundRect(-11,-12,22,14,4);dctx.fillStyle='#1c2416';dctx.strokeStyle='#39FF14';dctx.lineWidth=1.4;dctx.fill();dctx.stroke();dctx.beginPath();dctx.ellipse(0,-12,9,5,0,Math.PI,0);dctx.fillStyle='#141a10';dctx.strokeStyle='rgba(57,255,20,.5)';dctx.lineWidth=1;dctx.fill();dctx.stroke();dctx.beginPath();dctx.arc(0,-6,3.5,0,Math.PI*2);dctx.fillStyle='rgba(57,255,20,.1)';dctx.strokeStyle='#39FF14';dctx.lineWidth=1;dctx.fill();dctx.stroke();dctx.beginPath();dctx.arc(0,-6,1.8,0,Math.PI*2);dctx.fillStyle='#39FF14';dctx.fill();const blinkOn=Math.floor(t*.04)%2===0;dctx.beginPath();dctx.arc(-7,-2,1.5,0,Math.PI*2);dctx.fillStyle=blinkOn?'#39FF14':'rgba(57,255,20,.2)';dctx.fill();dctx.beginPath();dctx.arc(7,-2,1.5,0,Math.PI*2);dctx.fillStyle=blinkOn?'#E8A020':'rgba(232,160,32,.2)';dctx.fill();dctx.restore();}
(function animateDrone(){droneT++;dronePropRot+=0.28;const hoverBob=Math.sin(droneT*.022)*4;droneX+=(droneTX-droneX)*0.018;droneY+=(droneTY+hoverBob-droneY)*0.018;const vx=droneTX-droneX;droneAngle=Math.max(-0.22,Math.min(0.22,vx*0.004));droneWrap.style.left=(droneX-45)+'px';droneWrap.style.top=(droneY-45)+'px';dctx.save();dctx.translate(45,45);dctx.rotate(droneAngle);dctx.translate(-45,-45);drawDrone(droneT);dctx.restore();checkDroneNearTarget();requestAnimationFrame(animateDrone);})();

/* ══ WHO BENEFITS */
(function initBenSection(){
document.querySelectorAll('.ben-flip-card').forEach(card=>{card.addEventListener('click',function(e){if(e.target.classList.contains('ben-read-more-btn'))return;this.classList.toggle('flipped');});});
document.querySelectorAll('.ben-read-more-btn').forEach(btn=>{btn.addEventListener('click',function(e){e.stopPropagation();const id=this.dataset.card;const shutter=document.getElementById('bsh-'+id);const card=document.getElementById('bfc-'+id);if(!shutter)return;const cardH=card.offsetHeight;shutter.style.height=Math.max(cardH,360)+'px';shutter.classList.add('open');card.classList.remove('flipped');});});
document.querySelectorAll('.ben-shutter-close').forEach(btn=>{btn.addEventListener('click',function(e){e.stopPropagation();const id=this.dataset.card;const shutter=document.getElementById('bsh-'+id);if(shutter)shutter.classList.remove('open');});});

  const railCvs=document.getElementById('ben-rail-canvas');
  if(!railCvs)return;
  const rctx2=railCvs.getContext('2d');
  const railWrap=document.getElementById('ben-rail-wrap');
  let railT=0;

  function resizeRailCanvas(){const h=railWrap.offsetHeight||2000;railCvs.width=6;railCvs.height=h;railCvs.style.width='6px';railCvs.style.height=h+'px';}
  resizeRailCanvas();
  window.addEventListener('resize',resizeRailCanvas,{passive:true});

  function drawRailLine(ctx,H,progress){ctx.clearRect(0,0,6,H);const grad=ctx.createLinearGradient(0,0,0,H); grad.addColorStop(0,'rgba(57,255,20,0)');grad.addColorStop(0.1,'rgba(57,255,20,0.15)');grad.addColorStop(0.9,'rgba(57,255,20,0.15)');grad.addColorStop(1,'rgba(57,255,20,0)');
    ctx.strokeStyle=grad;ctx.lineWidth=2;ctx.setLineDash([8,10]);ctx.beginPath();ctx.moveTo(3,0);ctx.lineTo(3,H);ctx.stroke();ctx.setLineDash([]);
    
    const progH=H*progress;
    const progGrad=ctx.createLinearGradient(0,0,0,progH);
    progGrad.addColorStop(0,'rgba(57,255,20,0.8)');
    progGrad.addColorStop(1,'rgba(57,255,20,0.2)');
    ctx.strokeStyle=progGrad;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(3,0);ctx.lineTo(3,progH);ctx.stroke();}

  function drawRailRobot(ctx,cx,cy,t,scale){
    const S=scale||1;
    ctx.save();
    ctx.translate(cx,cy);
    ctx.save();ctx.globalAlpha=.2;
    ctx.beginPath();ctx.ellipse(0,28*S,11*S,3*S,0,0,Math.PI*2);
    ctx.fillStyle='#000';ctx.fill();
    ctx.restore();

    [[-11*S,0],[11*S,0]].forEach(([tx2,ty2])=>{
      ctx.fillStyle='#0d1a08';ctx.strokeStyle='rgba(57,255,20,.55)';ctx.lineWidth=1.1*S;
      ctx.beginPath();ctx.roundRect(tx2-6*S,ty2+18*S,12*S,8*S,2.5*S);ctx.fill();ctx.stroke();
      [tx2-3*S,tx2+3*S].forEach(wx=>{
        ctx.beginPath();ctx.arc(wx,ty2+22*S,3*S,0,Math.PI*2);
        ctx.fillStyle='#0a1208';ctx.strokeStyle='rgba(57,255,20,.5)';ctx.lineWidth=.9*S;
        ctx.fill();ctx.stroke();
        ctx.save();ctx.translate(wx,ty2+22*S);ctx.rotate(t*.18);
        ctx.strokeStyle='rgba(57,255,20,.35)';ctx.lineWidth=.7*S;
        ctx.beginPath();ctx.moveTo(-2.5*S,0);ctx.lineTo(2.5*S,0);ctx.stroke();
        ctx.restore();});
    });

    const bG=ctx.createLinearGradient(-13*S,-8*S,13*S,18*S);
    bG.addColorStop(0,'#1c2e10');bG.addColorStop(1,'#0e1a06');
    ctx.fillStyle=bG;ctx.strokeStyle='#39FF14';ctx.lineWidth=1.4*S;
    ctx.beginPath();ctx.roundRect(-13*S,0*S,26*S,19*S,3.5*S);ctx.fill();ctx.stroke();
    const scanY=(t*0.8%(18*S));
    ctx.fillStyle='rgba(57,255,20,.3)';ctx.fillRect(-10*S,scanY,20*S,1.2*S);
    [-4*S,4*S].forEach((lx,li)=>{
      ctx.beginPath();ctx.arc(lx,9*S,1.6*S,0,Math.PI*2);
      ctx.fillStyle=Math.floor(t*.06+li)%3===0?'#39FF14':'rgba(57,255,20,.15)';ctx.fill();});
    const armSwing=Math.sin(t*.05)*0.2;
    [[-14*S,2*S,armSwing],[14*S,2*S,-armSwing]].forEach(([ax,ay,aa])=>{
      ctx.save();ctx.translate(ax,ay);ctx.rotate(aa);
      ctx.fillStyle='#1c2e10';ctx.strokeStyle='rgba(57,255,20,.4)';ctx.lineWidth=1*S;
      ctx.beginPath();ctx.roundRect(-3*S,0,6*S,12*S,2*S);ctx.fill();ctx.stroke();
      ctx.save();ctx.translate(0,12*S);ctx.rotate(aa*.5);
      ctx.beginPath();ctx.arc(0,0,3.2*S,0,Math.PI*2);
      ctx.fillStyle='#0a1208';ctx.strokeStyle='rgba(57,255,20,.55)';ctx.lineWidth=.9*S;ctx.fill();ctx.stroke();
      ctx.restore();ctx.restore();});
    const headBob=Math.sin(t*.04)*1.5*S;
    const hG=ctx.createLinearGradient(-11*S,-26*S+headBob,11*S,-8*S+headBob);
    hG.addColorStop(0,'#1e3010');hG.addColorStop(1,'#0e1e06');
    ctx.fillStyle=hG;ctx.strokeStyle='#39FF14';ctx.lineWidth=1.5*S;
    ctx.beginPath();ctx.roundRect(-11*S,-26*S+headBob,22*S,18*S,4.5*S);ctx.fill();ctx.stroke();
    const blinkH=Math.sin(t*.015)>0.98?0.3:1.0;
    [-4.5*S,4.5*S].forEach(ex=>{const eG=ctx.createRadialGradient(ex,-18*S+headBob,0,ex,-18*S+headBob,3.5*S);eG.addColorStop(0,'rgba(57,255,20,.95)');eG.addColorStop(1,'rgba(57,255,20,.05)');
      ctx.save();
      ctx.beginPath();ctx.ellipse(ex,-18*S+headBob,3.2*S,3.2*S*blinkH,0,0,Math.PI*2);
      ctx.fillStyle=eG;ctx.fill();
      ctx.restore();});
    const antW=Math.sin(t*.07)*2.5*S;
    ctx.strokeStyle='rgba(57,255,20,.65)';ctx.lineWidth=1.2*S;ctx.lineCap='round';
    ctx.beginPath();ctx.moveTo(0,-26*S+headBob);ctx.lineTo(antW,-38*S+headBob);ctx.stroke();
    const antGlow=ctx.createRadialGradient(antW,-38*S+headBob,0,antW,-38*S+headBob,3*S);
    antGlow.addColorStop(0,'rgba(57,255,20,1)');antGlow.addColorStop(1,'rgba(57,255,20,0)');
    ctx.beginPath();ctx.arc(antW,-38*S+headBob,2.8*S,0,Math.PI*2);ctx.fillStyle=antGlow;ctx.fill();
    ctx.save();ctx.globalAlpha=0.35;
    ctx.fillStyle='rgba(57,255,20,.08)';ctx.strokeStyle='rgba(57,255,20,.25)';ctx.lineWidth=.8*S;
    ctx.beginPath();
    ctx.moveTo(13*S,0);ctx.lineTo(17*S,-4*S);ctx.lineTo(17*S,14*S);ctx.lineTo(13*S,19*S);ctx.closePath();
    ctx.fill();ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(11*S,-26*S+headBob);ctx.lineTo(15*S,-30*S+headBob);ctx.lineTo(15*S,-12*S+headBob);ctx.lineTo(11*S,-8*S+headBob);ctx.closePath();
    ctx.fill();ctx.stroke();
    ctx.restore();

    const glowR=ctx.createRadialGradient(0,0,0,0,0,22*S);glowR.addColorStop(0,'rgba(57,255,20,0.04)');glowR.addColorStop(1,'rgba(57,255,20,0)');ctx.beginPath();ctx.arc(0,0,22*S,0,Math.PI*2);ctx.fillStyle=glowR;ctx.fill();ctx.restore();}

  let benRailRobotY=0,benRailT=0;
  function updateBenRailRobot(){
    const benEl=document.getElementById('ben');
    if(!benEl)return;
    const rect=benEl.getBoundingClientRect();
    const H=railCvs.height||railWrap.offsetHeight||2000;
  
    const visibleTop=Math.max(0,-rect.top);
    const sectionH=benEl.offsetHeight;
    const progress=Math.min(1,Math.max(0,visibleTop/sectionH));
    benRailRobotY=progress*H;drawRailLine(rctx2,H,progress);rctx2.clearRect(0,Math.max(0,benRailRobotY-50),6,100);drawRailLine(rctx2,H,progress);

    if(railCvs.width<80){railCvs.width=80;railCvs.style.width='80px';railCvs.style.left='50%';railCvs.style.transform='translateX(-50%)';}
    rctx2.clearRect(0,0,80,H);drawRailLine(rctx2,H,progress);drawRailRobot(rctx2,40,benRailRobotY,benRailT,1.0);}
benRailT=0;(function animateBenRail(){benRailT++;updateBenRailRobot();requestAnimationFrame(animateBenRail);})();})();

/* ══ MEET THE MACHINE ══ */
const sceneCvs=document.getElementById('scene-canvas');
const sctx=sceneCvs.getContext('2d');
function resizeScene(){sceneCvs.width=sceneCvs.offsetWidth||window.innerWidth;sceneCvs.height=600;}
resizeScene();window.addEventListener('resize',resizeScene,{passive:true});
const SCENE={ROBOT_ENTER:0,ROBOT_STAND:1,ROBOT_INTRO:2,MAN_ENTER:3,CONVO:4,GOODBYE:5,DONE:6};
let sceneState=SCENE.ROBOT_ENTER,sceneT=0,stateT=0,sceneStarted=false;
const robot={x:-120,y:0,targetX:-60,scale:1,wobble:0,legPhase:0,armWave:0,eyeBlink:0,antennaWave:0,speaking:false,facingRight:true};
const man={x:800,targetX:80,scale:1,legPhase:0,armSwing:0,waving:false,speaking:false,facingLeft:true};
const CONVO_SCRIPT=[{speaker:'man',text:"What is i-Farmate?",duration:140},{speaker:'robot',text:"I am an AI-powered farming robot\nthat automates planting, weeding,\nand crop monitoring.",duration:200},{speaker:'man',text:"How do you remove weeds?",duration:130},{speaker:'robot',text:"I use cameras and AI to identify\nand remove weeds without\nharming crops.",duration:190},{speaker:'man',text:"How do you monitor crops?",duration:130},{speaker:'robot',text:"I continuously track plant health,\nsoil conditions, and crop growth\nin real time.",duration:190},{speaker:'man',text:"Can you detect pests\nand weather changes?",duration:150},{speaker:'robot',text:"Yes, I detect pest threats early\nand adapt my actions based on\nweather conditions.",duration:200},{speaker:'man',text:"How can farmers track you?",duration:130},{speaker:'robot',text:"Farmers can monitor my work\nand field data through a mobile\nor web application.",duration:200},{speaker:'robot',text:"For more details,\nplease contact us. Thank you!",duration:190},{speaker:'man',text:"Sure, thank you! 😊🌱🤖",duration:150}];
let convoIndex=0,convoTimer=0,typedChars=0,typingTimer=0;
let sceneObserved=false;
const sceneObs=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting&&!sceneObserved){sceneObserved=true;sceneStarted=true;sceneObs.disconnect();}});},{threshold:0.3});
sceneObs.observe(sceneCvs);
function drawSceneBackground(ctx,W,H){ctx.clearRect(0,0,W,H);const bg=ctx.createLinearGradient(0,0,0,H);bg.addColorStop(0,'rgba(6,10,5,0.5)');bg.addColorStop(.6,'rgba(10,18,8,0.6)');bg.addColorStop(1,'rgba(13,26,10,0.7)');ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);const gy=H*0.78;const groundGrad=ctx.createLinearGradient(0,gy,0,H);groundGrad.addColorStop(0,'rgba(26,46,10,0.9)');groundGrad.addColorStop(.4,'rgba(20,34,8,0.95)');groundGrad.addColorStop(1,'rgba(10,18,5,0.98)');ctx.fillStyle=groundGrad;ctx.fillRect(0,gy,W,H-gy);ctx.beginPath();ctx.moveTo(0,gy);ctx.lineTo(W,gy);ctx.strokeStyle='rgba(57,255,20,.3)';ctx.lineWidth=1.5;ctx.stroke();}
function drawRobot3D(ctx,cx,gy,t,scale,opts){const S=scale*1.0,fw=opts.facingRight?1:-1,wobble=opts.wobble||0,lp=opts.legPhase||0,aw=opts.armWave||0,speaking=opts.speaking||false;ctx.save();ctx.translate(cx,gy);ctx.save();ctx.globalAlpha=.22;const shadowGrad=ctx.createRadialGradient(0,8,0,0,8,55*S);shadowGrad.addColorStop(0,'rgba(0,0,0,0.55)');shadowGrad.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=shadowGrad;ctx.scale(1,0.3);ctx.beginPath();ctx.arc(0,8*S/0.3,45*S,0,Math.PI*2);ctx.fill();ctx.restore();const treadY=-28*S+wobble;[-1,1].forEach(side=>{const tx2=side*28*S*fw;ctx.save();ctx.translate(tx2,treadY);ctx.fillStyle='#0d1a08';ctx.strokeStyle='rgba(57,255,20,.5)';ctx.lineWidth=1.2*S;ctx.beginPath();ctx.roundRect(-12*S,-8*S,24*S,16*S,4*S);ctx.fill();ctx.stroke();[-6*S,6*S].forEach(wx=>{ctx.beginPath();ctx.arc(wx,0,5*S,0,Math.PI*2);ctx.fillStyle='#0a1208';ctx.strokeStyle='rgba(57,255,20,.6)';ctx.lineWidth=1.2*S;ctx.fill();ctx.stroke();ctx.save();ctx.rotate(lp*(side===1?1:-1));ctx.strokeStyle='rgba(57,255,20,.4)';ctx.lineWidth=0.8*S;ctx.beginPath();ctx.moveTo(-4*S,0);ctx.lineTo(4*S,0);ctx.stroke();ctx.beginPath();ctx.moveTo(0,-4*S);ctx.lineTo(0,4*S);ctx.stroke();ctx.restore();});ctx.restore();});const bodyY=-100*S+wobble;const bodyGrad=ctx.createLinearGradient(-20*S,bodyY,20*S,bodyY+54*S);bodyGrad.addColorStop(0,'#1c2e10');bodyGrad.addColorStop(.5,'#152208');bodyGrad.addColorStop(1,'#0e1a06');ctx.fillStyle=bodyGrad;ctx.strokeStyle='#39FF14';ctx.lineWidth=1.8*S;ctx.beginPath();ctx.roundRect(-22*S,bodyY,44*S,54*S,6*S);ctx.fill();ctx.stroke();const dispY=bodyY+14*S;ctx.fillStyle='rgba(57,255,20,.08)';ctx.strokeStyle='rgba(57,255,20,.4)';ctx.lineWidth=1*S;ctx.beginPath();ctx.roundRect(-14*S,dispY,28*S,14*S,2*S);ctx.fill();ctx.stroke();const scanY=dispY+(t*1.2%(14*S));ctx.fillStyle='rgba(57,255,20,.35)';ctx.fillRect(-13*S,scanY,26*S,1.5*S);[-6*S,0,6*S].forEach((lx2,li)=>{ctx.beginPath();ctx.arc(lx2,bodyY+34*S,2.5*S,0,Math.PI*2);const colors=['#39FF14','#E8A020','#39FF14'];ctx.fillStyle=Math.floor(t*.05+li)%3===0?colors[li]:'rgba(57,255,20,.15)';ctx.fill();});const armAngleR=fw>0?(-0.15+Math.sin(lp*0.5)*0.08+aw*0.4):(-0.15-Math.sin(lp*0.5)*0.08);const armAngleL=fw>0?(0.15-Math.sin(lp*0.5)*0.08):(0.15+Math.sin(lp*0.5)*0.08+aw*0.4);[[-1,armAngleL],[1,armAngleR]].forEach(([side2,aa])=>{ctx.save();ctx.translate(side2*fw*24*S,bodyY+8*S);ctx.rotate(aa);ctx.fillStyle='#1c2e10';ctx.strokeStyle='rgba(57,255,20,.5)';ctx.lineWidth=1.2*S;ctx.beginPath();ctx.roundRect(-5*S,0,10*S,22*S,3*S);ctx.fill();ctx.stroke();ctx.save();ctx.translate(0,22*S);ctx.rotate(aa*0.5);ctx.fillStyle='#111e0a';ctx.strokeStyle='rgba(57,255,20,.4)';ctx.lineWidth=1*S;ctx.beginPath();ctx.roundRect(-4*S,0,8*S,18*S,3*S);ctx.fill();ctx.stroke();ctx.translate(0,18*S);ctx.beginPath();ctx.arc(0,0,5*S,0,Math.PI*2);ctx.fillStyle='#0a1208';ctx.strokeStyle='rgba(57,255,20,.7)';ctx.lineWidth=1.2*S;ctx.fill();ctx.stroke();ctx.restore();ctx.restore();});const headY=-142*S+wobble+Math.sin(t*.03)*2*S;const headGrad=ctx.createLinearGradient(-18*S,headY,18*S,headY+36*S);headGrad.addColorStop(0,'#1e3010');headGrad.addColorStop(1,'#0e1e06');ctx.fillStyle=headGrad;ctx.strokeStyle='#39FF14';ctx.lineWidth=1.8*S;ctx.beginPath();ctx.roundRect(-18*S,headY,36*S,36*S,8*S);ctx.fill();ctx.stroke();const blinkH=opts.eyeBlink>0.8?0.5:1.0;[-7*S,7*S].forEach((ex2)=>{ctx.beginPath();ctx.arc(ex2,headY+14*S,5*S,0,Math.PI*2);ctx.fillStyle='rgba(57,255,20,.12)';ctx.fill();const eyeGlow=ctx.createRadialGradient(ex2,headY+14*S,0,ex2,headY+14*S,4.5*S);eyeGlow.addColorStop(0,'rgba(57,255,20,0.9)');eyeGlow.addColorStop(1,'rgba(57,255,20,0.1)');ctx.save();ctx.beginPath();ctx.ellipse(ex2,headY+14*S,4*S,4*S*blinkH,0,0,Math.PI*2);ctx.fillStyle=eyeGlow;ctx.fill();ctx.restore();ctx.beginPath();ctx.arc(ex2+fw*1*S,headY+14*S,1.5*S,0,Math.PI*2);ctx.fillStyle='#0a1208';ctx.fill();});if(speaking){const mw=(5+Math.sin(t*.15)*4)*S;ctx.fillStyle='rgba(57,255,20,.6)';ctx.beginPath();ctx.roundRect(-mw/2,headY+24*S,mw,3*S,1*S);ctx.fill();}else{ctx.fillStyle='rgba(57,255,20,.3)';ctx.beginPath();ctx.roundRect(-6*S,headY+24*S,12*S,2*S,1*S);ctx.fill();}const antWave=Math.sin(t*.08)*3*S+(opts.antennaWave||0)*5*S;ctx.strokeStyle='rgba(57,255,20,.7)';ctx.lineWidth=1.5*S;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(0,headY);ctx.lineTo(antWave,headY-16*S);ctx.stroke();const antGlow=ctx.createRadialGradient(antWave,headY-16*S,0,antWave,headY-16*S,4*S);antGlow.addColorStop(0,speaking?'rgba(57,255,20,1)':'rgba(57,255,20,0.6)');antGlow.addColorStop(1,'rgba(57,255,20,0)');ctx.beginPath();ctx.arc(antWave,headY-16*S,3.5*S,0,Math.PI*2);ctx.fillStyle=antGlow;ctx.fill();ctx.restore();}
function drawMan(ctx,cx,gy,t,opts){const S=1.0,fw=opts.facingLeft?-1:1,lp=opts.legPhase||0,waving=opts.waving||false,speaking=opts.speaking||false;ctx.save();ctx.translate(cx,gy);ctx.save();ctx.globalAlpha=0.2;const shadowGrad=ctx.createRadialGradient(0,5,0,0,5,40);shadowGrad.addColorStop(0,'rgba(0,0,0,0.5)');shadowGrad.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=shadowGrad;ctx.scale(1.2,0.25);ctx.beginPath();ctx.arc(0,5/0.25,38,0,Math.PI*2);ctx.fill();ctx.restore();const leftLegAngle=Math.sin(lp)*0.35,rightLegAngle=-Math.sin(lp)*0.35;[[fw*8,leftLegAngle],[fw*-8,rightLegAngle]].forEach(([lx2,la])=>{ctx.save();ctx.translate(lx2,-10);ctx.rotate(la);ctx.fillStyle='#2a3d1a';ctx.beginPath();ctx.roundRect(-5,-2,10,24,3);ctx.fill();ctx.save();ctx.translate(0,24);ctx.rotate(la*0.5);ctx.fillStyle='#1e2e10';ctx.beginPath();ctx.roundRect(-4,0,8,22,3);ctx.fill();ctx.save();ctx.translate(fw*2,22);ctx.fillStyle='#111';ctx.beginPath();ctx.roundRect(fw>0?-5:-9,-2,14,8,3);ctx.fill();ctx.restore();ctx.restore();ctx.restore();});const torsoY=-85;const shirtGrad=ctx.createLinearGradient(-14,torsoY,14,torsoY+40);shirtGrad.addColorStop(0,'#2d4a18');shirtGrad.addColorStop(1,'#1e3210');ctx.fillStyle=shirtGrad;ctx.beginPath();ctx.roundRect(-14,torsoY,28,42,5);ctx.fill();ctx.fillStyle='#0a0f06';ctx.strokeStyle='rgba(57,255,20,.3)';ctx.lineWidth=0.8;ctx.beginPath();ctx.roundRect(-14,torsoY+38,28,5,1);ctx.fill();ctx.stroke();const walkArmL=Math.sin(lp)*0.3,walkArmR=-Math.sin(lp)*0.3,waveArm=waving?(-0.8+Math.sin(t*.1)*0.4):walkArmR;[[fw*14,torsoY+4,walkArmL,false],[fw*-14,torsoY+4,waving?waveArm:walkArmL,waving]].forEach(([ax,ay,aa,isWave])=>{ctx.save();ctx.translate(ax,ay);ctx.rotate(aa);ctx.fillStyle='#2d4a18';ctx.beginPath();ctx.roundRect(fw>0?0:-8,0,8,20,3);ctx.fill();ctx.save();ctx.translate(fw>0?4:-4,20);if(isWave)ctx.rotate(-0.6+Math.sin(t*.1)*0.3);else ctx.rotate(aa*0.4);ctx.fillStyle='#d4956a';ctx.beginPath();ctx.roundRect(-4,0,8,16,3);ctx.fill();ctx.translate(0,16);ctx.beginPath();ctx.arc(0,0,5,0,Math.PI*2);ctx.fillStyle='#d4956a';ctx.fill();ctx.restore();ctx.restore();});ctx.fillStyle='#d4956a';ctx.beginPath();ctx.roundRect(-5,-100,10,12,3);ctx.fill();ctx.fillStyle='#e8aa80';ctx.beginPath();ctx.arc(0,-116,15,0,Math.PI*2);ctx.fill();ctx.fillStyle='#1a0f08';ctx.beginPath();ctx.arc(0,-116,15,Math.PI,0);ctx.fill();ctx.fillRect(-15,-120,30,8);[-5,5].forEach(ex2=>{ctx.beginPath();ctx.arc(ex2,-117,2.5,0,Math.PI*2);ctx.fillStyle='#1a0f08';ctx.fill();});if(speaking){const mw=3+Math.sin(t*.12)*2;ctx.beginPath();ctx.ellipse(0,-113,mw,1.5+Math.abs(Math.sin(t*.12)),0,0,Math.PI*2);ctx.fillStyle='#6a3020';ctx.fill();}else{ctx.strokeStyle='#6a3020';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(-4,-113);ctx.quadraticCurveTo(0,-111,4,-113);ctx.stroke();}ctx.fillStyle='#c4a055';ctx.strokeStyle='#8a6030';ctx.lineWidth=1.2;ctx.beginPath();ctx.ellipse(0,-129,22,5,0,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.fillStyle='#c4a055';ctx.strokeStyle='#8a6030';ctx.lineWidth=1.2;ctx.beginPath();ctx.roundRect(-12,-146,24,18,4);ctx.fill();ctx.stroke();ctx.fillStyle='#2d4a18';ctx.fillRect(-12,-133,24,4);ctx.restore();}
function drawSpeechBubble(ctx,x,y,text,fromLeft,W,H){const lines=text.split('\n'),maxLen=Math.max(...lines.map(l=>l.length));const bubbleW=Math.min(Math.max(maxLen*8+32,120),260),lineH=18,bubbleH=lines.length*lineH+24;let bx=fromLeft?x+30:x-bubbleW-30;bx=Math.max(10,Math.min(bx,W-bubbleW-10));const by=y-bubbleH-20;ctx.save();ctx.fillStyle=fromLeft?'rgba(20,35,12,0.96)':'rgba(12,22,8,0.96)';ctx.strokeStyle=fromLeft?'rgba(57,255,20,0.8)':'rgba(232,160,32,0.8)';ctx.lineWidth=1.5;ctx.beginPath();ctx.roundRect(bx,by,bubbleW,bubbleH,8);ctx.fill();ctx.stroke();const tailX=fromLeft?bx+20:bx+bubbleW-20;ctx.beginPath();ctx.moveTo(tailX-8,by+bubbleH);ctx.lineTo(fromLeft?x+10:x-10,by+bubbleH+18);ctx.lineTo(tailX+8,by+bubbleH);ctx.closePath();ctx.fill();ctx.stroke();ctx.font=`bold 9px 'Space Grotesk', sans-serif`;ctx.fillStyle=fromLeft?'rgba(57,255,20,0.7)':'rgba(232,160,32,0.7)';ctx.textAlign='left';ctx.fillText(fromLeft?'🤖 i-Farmate':'👨 Farmer',bx+10,by+13);ctx.font=`12px 'Inter', sans-serif`;ctx.fillStyle=fromLeft?'rgba(240,244,236,0.95)':'rgba(255,240,200,0.95)';ctx.textAlign='left';lines.forEach((line,i)=>{ctx.fillText(line,bx+12,by+28+i*lineH);});}
function drawNameLabel(ctx,cx,gy,name,isRobot){ctx.save();ctx.font=`bold 11px 'Space Grotesk', sans-serif`;ctx.textAlign='center';const tw=ctx.measureText(name).width,bw=tw+20,bh=18,bx=cx-bw/2,by=gy+8;ctx.fillStyle=isRobot?'rgba(20,35,12,0.8)':'rgba(12,22,8,0.8)';ctx.strokeStyle=isRobot?'rgba(57,255,20,0.5)':'rgba(232,160,32,0.4)';ctx.lineWidth=1;ctx.beginPath();ctx.roundRect(bx,by,bw,bh,3);ctx.fill();ctx.stroke();ctx.fillStyle=isRobot?'#39FF14':'#E8A020';ctx.fillText(name,cx,by+13);ctx.restore();}
function drawReplayBtn(ctx,W,H){const bw=140,bh=40,bx=W/2-bw/2,by=H-60;ctx.fillStyle='rgba(10,13,8,0.9)';ctx.strokeStyle='rgba(57,255,20,0.7)';ctx.lineWidth=1.5;ctx.beginPath();ctx.roundRect(bx,by,bw,bh,4);ctx.fill();ctx.stroke();ctx.font=`bold 13px 'Space Grotesk', sans-serif`;ctx.textAlign='center';ctx.fillStyle='#39FF14';ctx.fillText('▶ Replay Scene',W/2,by+26);sceneCvs._replayBtn={bx,by,bw,bh};}
sceneCvs.addEventListener('click',e=>{if(!sceneCvs._replayBtn)return;const rect=sceneCvs.getBoundingClientRect(),px=e.clientX-rect.left,py=e.clientY-rect.top;const {bx,by,bw,bh}=sceneCvs._replayBtn;if(px>=bx&&px<=bx+bw&&py>=by&&py<=by+bh){sceneState=SCENE.ROBOT_ENTER;stateT=0;sceneT=0;convoIndex=0;convoTimer=0;typedChars=0;typingTimer=0;robot.x=-120;man.x=sceneCvs.width+120;robot.speaking=false;man.speaking=false;man.waving=false;sceneCvs._replayBtn=null;}});
(function animateScene(){if(!sceneStarted){requestAnimationFrame(animateScene);return;}const W=sceneCvs.width,H=sceneCvs.height,groundY=H*0.78,centerX=W/2;sceneT++;stateT++;sctx.clearRect(0,0,W,H);drawSceneBackground(sctx,W,H);switch(sceneState){case SCENE.ROBOT_ENTER:{const progress=Math.min(1,stateT/80),eased=1-Math.pow(1-progress,3);robot.x=-150+(centerX-60+150)*eased;robot.scale=0.4+0.6*eased;robot.legPhase+=0.12;robot.wobble=Math.sin(robot.legPhase)*3;robot.facingRight=true;drawRobot3D(sctx,centerX+robot.x-centerX,groundY,sceneT,robot.scale,robot);if(stateT>85){sceneState=SCENE.ROBOT_STAND;stateT=0;}break;}case SCENE.ROBOT_STAND:{robot.x=centerX-60-centerX;robot.scale=1.0;robot.legPhase*=0.9;robot.wobble=Math.sin(sceneT*.04)*2;robot.antennaWave=Math.sin(sceneT*.06)*0.5;robot.speaking=false;robot.facingRight=true;drawRobot3D(sctx,centerX-60,groundY,sceneT,1.0,robot);if(stateT>60){sceneState=SCENE.ROBOT_INTRO;stateT=0;}break;}case SCENE.ROBOT_INTRO:{robot.speaking=true;robot.antennaWave=1;robot.wobble=Math.sin(sceneT*.04)*2;drawRobot3D(sctx,centerX-60,groundY,sceneT,1.0,robot);const intro="Hello! I am i-Farmate 🤖\nYour autonomous AI farming robot.\nI work 24/7 to protect your crops!";typingTimer++;if(typingTimer%2===0&&typedChars<intro.length)typedChars++;drawSpeechBubble(sctx,centerX-60,groundY-160,intro.substring(0,typedChars),true,W,H);if(stateT>180){sceneState=SCENE.MAN_ENTER;stateT=0;typedChars=0;typingTimer=0;robot.speaking=false;}break;}case SCENE.MAN_ENTER:{robot.speaking=false;robot.wobble=Math.sin(sceneT*.04)*1.5;drawRobot3D(sctx,centerX-60,groundY,sceneT,1.0,robot);const progress=Math.min(1,stateT/90),eased=1-Math.pow(1-progress,2);man.x=W+120-(W+120-(centerX+80))*eased;man.legPhase+=0.14*progress;man.waving=progress>0.8;man.facingLeft=true;drawMan(sctx,man.x,groundY,sceneT,man);drawNameLabel(sctx,centerX-60,groundY,'i-Farmate',true);drawNameLabel(sctx,man.x,groundY,'Farmer',false);if(progress>0.8){robot.armWave=Math.sin(sceneT*.1)*0.5;}if(stateT>100){man.x=centerX+80;man.legPhase=0;man.waving=false;sceneState=SCENE.CONVO;stateT=0;convoIndex=0;convoTimer=0;typedChars=0;typingTimer=0;}break;}case SCENE.CONVO:{robot.wobble=Math.sin(sceneT*.04)*1.5;robot.facingRight=true;man.facingLeft=true;const line=CONVO_SCRIPT[convoIndex];if(!line){sceneState=SCENE.GOODBYE;stateT=0;break;}const isRobot=line.speaker==='robot';robot.speaking=isRobot;man.speaking=!isRobot;robot.antennaWave=isRobot?0.8:0.2;man.waving=false;typingTimer++;if(typingTimer%2===0&&typedChars<line.text.length)typedChars++;convoTimer++;if(convoTimer>=line.duration){convoIndex++;convoTimer=0;typedChars=0;typingTimer=0;}drawRobot3D(sctx,centerX-60,groundY,sceneT,1.0,robot);drawMan(sctx,man.x,groundY,sceneT,man);drawNameLabel(sctx,centerX-60,groundY,'i-Farmate',true);drawNameLabel(sctx,man.x,groundY,'Farmer',false);if(typedChars>0){if(isRobot)drawSpeechBubble(sctx,centerX-60,groundY-160,line.text.substring(0,typedChars),true,W,H);else drawSpeechBubble(sctx,man.x,groundY-160,line.text.substring(0,typedChars),false,W,H);}sctx.save();const dotW=CONVO_SCRIPT.length*16,dotStartX=W/2-dotW/2;CONVO_SCRIPT.forEach((_,i)=>{sctx.beginPath();sctx.arc(dotStartX+i*16+8,H-20,4,0,Math.PI*2);sctx.fillStyle=i===convoIndex?'#39FF14':i<convoIndex?'rgba(57,255,20,0.5)':'rgba(57,255,20,0.15)';sctx.fill();});sctx.restore();break;}case SCENE.GOODBYE:{robot.speaking=false;man.speaking=false;man.waving=true;const progress=Math.min(1,stateT/100),robotExit=centerX-60-progress*300,manExit=centerX+80+progress*350;robot.legPhase+=0.12;man.legPhase+=0.14;robot.facingRight=false;man.facingLeft=false;drawRobot3D(sctx,robotExit,groundY,sceneT,1.0-progress*0.3,robot);drawMan(sctx,manExit,groundY,sceneT,man);if(stateT>110){sceneState=SCENE.DONE;stateT=0;}break;}case SCENE.DONE:{const alpha=Math.min(1,stateT/40);sctx.save();sctx.globalAlpha=alpha;sctx.textAlign='center';sctx.font=`bold 22px 'Space Grotesk', sans-serif`;sctx.fillStyle='rgba(57,255,20,0.9)';sctx.fillText('i-Farmate — Your AI Farm Companion 🌱',W/2,H/2-30);sctx.font=`14px 'Inter', sans-serif`;sctx.fillStyle='rgba(240,244,236,0.6)';sctx.fillText('24/7 Autonomous · AI-Precision · Zero Chemicals',W/2,H/2+5);sctx.restore();drawReplayBtn(sctx,W,H);break;}}requestAnimationFrame(animateScene);})();

/* CAROUSEL */
const capTrack=document.getElementById('cap-track');
const capDots=document.querySelectorAll('.carousel-dot');
const capTimerBar=document.getElementById('cap-timer-bar');
const capPageNum=document.getElementById('cap-page-num');
let capPage=0,capPages=2,capInterval=null;
function gotoCapPage(n){capPage=(n+capPages)%capPages;capTrack.style.transform=`translateX(-${capPage*100}%)`;capDots.forEach((d,i)=>d.classList.toggle('active',i===capPage));if(capPageNum)capPageNum.textContent=capPage+1;resetCapTimer();}
function resetCapTimer(){capTimerBar.style.transition='none';capTimerBar.style.width='0%';clearInterval(capInterval);requestAnimationFrame(()=>requestAnimationFrame(()=>{capTimerBar.style.transition='width 5s linear';capTimerBar.style.width='100%';}));capInterval=setInterval(()=>gotoCapPage(capPage+1),5000);}
document.getElementById('cap-prev').addEventListener('click',()=>gotoCapPage(capPage-1));
document.getElementById('cap-next').addEventListener('click',()=>gotoCapPage(capPage+1));
capDots.forEach(d=>d.addEventListener('click',()=>gotoCapPage(+d.dataset.idx)));
resetCapTimer();

const obsRV=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('vs');obsRV.unobserve(e.target);}});},{threshold:.08,rootMargin:'0px 0px -40px 0px'});
document.querySelectorAll('.rv,.rl,.rr,.rs').forEach(el=>obsRV.observe(el));

const sps=document.querySelectorAll('.sp'),vlEl=document.getElementById('vl'),v1=document.getElementById('v1'),v2=document.getElementById('v2');
const SD=[{l:'Field Patrol',a:'Coverage: 94%',b:'Speed: 0.8 m/s'},{l:'AI Detection',a:'Anomalies: 3 found',b:'Confidence: 97%'},{l:'Intervention',a:'Weeds removed: 12',b:'Precision: ±2mm'},{l:'Data Report',a:'Health index: 8.6/10',b:'Next action: 2h'}];
let as2=0;
function setStep(n){sps.forEach((s,i)=>s.classList.toggle('active',i===n));const d=SD[n];if(vlEl)vlEl.textContent=d.l;if(v1)v1.textContent=d.a;if(v2)v2.textContent=d.b;as2=n;}
sps.forEach((s,i)=>s.addEventListener('click',()=>setStep(i)));
setInterval(()=>setStep((as2+1)%sps.length),3200);

/* MINI HOW ROBOT */
const howSection=document.getElementById('how');
const howRobotCvs=document.getElementById('how-robot');
const hrCtx=howRobotCvs.getContext('2d');
let hrX=0,hrY=0,hrTX=0,hrTY=0,hrT=0,hrActive=false,hrLegPhase=0,hrVX=0,hrVY=0;
function drawHowRobot(ctx,t,vx,vy){ctx.clearRect(0,0,60,80);const cx=30,by=72;hrLegPhase+=Math.sqrt(vx*vx+vy*vy)*.08+0.06;const tilt=Math.max(-.2,Math.min(.2,vx*.008)),fw=vx>0?1:-1;ctx.save();ctx.translate(cx,by);ctx.rotate(tilt);[-12,12].forEach(ox=>{ctx.fillStyle='#0d1a08';ctx.strokeStyle='rgba(57,255,20,.55)';ctx.lineWidth=1.1;ctx.beginPath();ctx.roundRect(ox-7,-8,14,10,3);ctx.fill();ctx.stroke();ctx.save();ctx.translate(ox,-3);ctx.beginPath();ctx.arc(0,0,3.5,0,Math.PI*2);ctx.fillStyle='#0a1208';ctx.strokeStyle='rgba(57,255,20,.5)';ctx.fill();ctx.stroke();ctx.save();ctx.rotate(hrLegPhase*(ox>0?1:-1));ctx.strokeStyle='rgba(57,255,20,.35)';ctx.lineWidth=.8;ctx.beginPath();ctx.moveTo(-3,0);ctx.lineTo(3,0);ctx.stroke();ctx.restore();ctx.restore();});const bG=ctx.createLinearGradient(-14,-36,14,-10);bG.addColorStop(0,'#1c2e10');bG.addColorStop(1,'#0e1a06');ctx.fillStyle=bG;ctx.strokeStyle='#39FF14';ctx.lineWidth=1.5;ctx.beginPath();ctx.roundRect(-14,-36,28,32,4);ctx.fill();ctx.stroke();const hG=ctx.createLinearGradient(-13,-58,13,-42);hG.addColorStop(0,'#1e3210');hG.addColorStop(1,'#0e1e06');ctx.fillStyle=hG;ctx.strokeStyle='#39FF14';ctx.lineWidth=1.5;ctx.beginPath();ctx.roundRect(-13,-60+Math.sin(t*.04)*1.5,26,20,5);ctx.fill();ctx.stroke();[-5,5].forEach(ex=>{const eG=ctx.createRadialGradient(ex,-51,0,ex,-51,3);eG.addColorStop(0,'rgba(57,255,20,.95)');eG.addColorStop(1,'rgba(57,255,20,.05)');ctx.beginPath();ctx.arc(ex,-51,3,0,Math.PI*2);ctx.fillStyle=eG;ctx.fill();});ctx.restore();}
howSection.addEventListener('mouseenter',()=>{hrActive=true;howRobotCvs.style.display='block';});
howSection.addEventListener('mouseleave',()=>{hrActive=false;howRobotCvs.style.display='none';});
howSection.addEventListener('mousemove',e=>{hrVX=e.clientX-hrTX;hrVY=e.clientY-hrTY;hrTX=e.clientX;hrTY=e.clientY;});
const howStyle=document.createElement('style');howStyle.textContent='#how{cursor:none}';document.head.appendChild(howStyle);
(function animateHowRobot(){hrT++;if(hrActive){hrX+=(hrTX-hrX)*.15;hrY+=(hrTY-hrY)*.15;howRobotCvs.style.left=hrX+'px';howRobotCvs.style.top=hrY+'px';drawHowRobot(hrCtx,hrT,hrVX,hrVY);hrVX*=0.85;hrVY*=0.85;}requestAnimationFrame(animateHowRobot);})();

const fc2=document.getElementById('fc');
if(fc2){const fctx=fc2.getContext('2d');function szFC(){const p=fc2.parentElement;fc2.width=p.offsetWidth;fc2.height=p.offsetHeight;}szFC();window.addEventListener('resize',szFC,{passive:true});let bx2=30,by3=0,bt=0,rows=[],sd=1;function buildR(){rows=[];const h=fc2.height;for(let i=0;i<7;i++)rows.push({y:60+(i/6)*(h-120),sc:0});by3=rows[0]?rows[0].y:0;}buildR();(function afc(){if(!rows.length){requestAnimationFrame(afc);return;}const w=fc2.width,h=fc2.height;fctx.clearRect(0,0,w,h);rows.forEach(r=>{fctx.beginPath();fctx.moveTo(20,r.y);fctx.lineTo(w-20,r.y);fctx.strokeStyle='rgba(57,255,20,.07)';fctx.lineWidth=1;fctx.stroke();if(r.sc>0){fctx.fillStyle='rgba(57,255,20,.04)';fctx.fillRect(20,r.y-10,(w-40)*r.sc,20);}for(let c=0;c<12;c++){const cx2=30+(c/11)*(w-60);fctx.beginPath();fctx.arc(cx2,r.y,2.8,0,Math.PI*2);fctx.fillStyle=r.sc>c/11?'rgba(57,255,20,.48)':'rgba(57,255,20,.09)';fctx.fill();}});fctx.save();fctx.translate(bx2,by3);fctx.beginPath();fctx.arc(0,0,8,0,Math.PI*2);fctx.fillStyle='rgba(57,255,20,.13)';fctx.fill();fctx.strokeStyle='#39FF14';fctx.lineWidth=1.4;fctx.stroke();fctx.beginPath();fctx.arc(0,0,2.8,0,Math.PI*2);fctx.fillStyle='#39FF14';fctx.fill();fctx.restore();bx2+=1.4*sd;if(bx2>=w-30){sd=-1;if(bt<rows.length-1)bt++;}if(bx2<=30){sd=1;if(bt<rows.length-1)bt++;}by3+=(rows[bt].y-by3)*.08;rows[bt].sc=Math.min(1,rows[bt].sc+.0025);requestAnimationFrame(afc);})();}

window.addEventListener('scroll',()=>{const hc=document.querySelector('.hc');if(hc)hc.style.transform=`translateY(${window.scrollY*.28}px)`;},{passive:true});

document.querySelectorAll('.bp,.bo').forEach(btn=>{btn.addEventListener('mousemove',e=>{const r=btn.getBoundingClientRect();btn.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.1}px,${(e.clientY-r.top-r.height/2)*.1}px)`;});btn.addEventListener('mouseleave',()=>{btn.style.transform='';});});

let lpt=0;
window.addEventListener('scroll',()=>{const now=Date.now();if(now-lpt<400)return;lpt=now;[90,window.innerWidth-90].forEach(x=>{const p=document.createElement('div');p.style.cssText=`position:fixed;left:${x}px;top:${window.innerHeight*.5}px;width:3px;height:3px;background:#39FF14;border-radius:50%;pointer-events:none;z-index:9997;transition:all .9s ease;box-shadow:0 0 5px #39FF14`;document.body.appendChild(p);requestAnimationFrame(()=>{p.style.transform=`translate(${(Math.random()-.5)*70}px,${-35-Math.random()*50}px)`;p.style.opacity='0';});setTimeout(()=>p.remove(),950);});},{passive:true});

/* CONTACT FORM */
const rcBox=document.getElementById('recaptcha-box'),rcCheck=document.getElementById('recaptcha-check'),submitBtn=document.getElementById('submit-btn');
const fnameEl=document.getElementById('f-name'),femailEl=document.getElementById('f-email'),fserviceEl=document.getElementById('f-service'),fmsgEl=document.getElementById('f-msg');
let rcDone=false;
function validateForm(){const ok=fnameEl.value.trim()!==''&&femailEl.value.trim().includes('@')&&fserviceEl.value!==''&&fmsgEl.value.trim()!==''&&rcDone;submitBtn.disabled=!ok;}
[fnameEl,femailEl,fserviceEl,fmsgEl].forEach(el=>el.addEventListener('input',validateForm));
rcBox.addEventListener('click',()=>{if(rcDone)return;rcCheck.style.animation='rcSpin 0.6s ease';setTimeout(()=>{rcDone=true;rcCheck.classList.add('checked');rcCheck.style.animation='';validateForm();},600);});
const rcStyle=document.createElement('style');rcStyle.textContent=`@keyframes rcSpin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}`;document.head.appendChild(rcStyle);
submitBtn.addEventListener('click',()=>{if(submitBtn.disabled)return;submitBtn.textContent='Sending…';submitBtn.disabled=true;setTimeout(()=>{document.getElementById('form-body').style.display='none';document.getElementById('form-success').style.display='block';},1200);});

const footerVideo=document.getElementById('footerVideo');
const videos=['video/fv1.mp4','video/fv2.mp4'];
let current=0;
footerVideo.addEventListener('ended',()=>{current=(current+1)%videos.length;footerVideo.src=videos[current];footerVideo.play();});
/* OTHER PRODUCTS MODALS */
function initCircuit(canvasId){const cvs=document.getElementById(canvasId);if(!cvs)return;const ctx=cvs.getContext('2d');
  let W,H,nodes,traces,t=0,animId=null,isActive=false;
  function resize(){const p=cvs.parentElement;W=cvs.width=p.offsetWidth;H=cvs.height=p.offsetHeight;buildCircuit();}
  function buildCircuit(){nodes=[];traces=[];const cols=Math.floor(W/55),rows=Math.floor(H/55);
    for(let r=0;r<=rows;r++){for(let c=0;c<=cols;c++){if(Math.random()<0.5){nodes.push({x:c*(W/cols)+(Math.random()-.5)*20,y:r*(H/rows)+(Math.random()-.5)*20,pulse:Math.random()*Math.PI*2});}}}
    for(let i=0;i<nodes.length;i++){for(let j=i+1;j<nodes.length;j++){const dx=nodes[j].x-nodes[i].x,dy=nodes[j].y-nodes[i].y;const dist=Math.sqrt(dx*dx+dy*dy);if(dist<110&&Math.random()<0.4){traces.push({a:i,b:j,progress:0,speed:.006+Math.random()*.01,active:false,delay:Math.random()*120});}}}
    traces.slice(0,8).forEach(tr=>tr.active=true);}
  function draw(){ctx.clearRect(0,0,W,H);if(!isActive){animId=null;return;}t++;traces.forEach(tr=>{if(!tr.active){tr.delay--;if(tr.delay<=0){tr.active=true;tr.delay=0;}return;}
      tr.progress=Math.min(1,tr.progress+tr.speed);const a=nodes[tr.a],b=nodes[tr.b];if(!a||!b)return;const ex=a.x+(b.x-a.x)*tr.progress,ey=a.y+(b.y-a.y)*tr.progress;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(ex,ey);ctx.strokeStyle='rgba(57,255,20,0.08)';ctx.lineWidth=1;ctx.stroke();if(tr.progress<1){ctx.beginPath();ctx.arc(ex,ey,1.8,0,Math.PI*2);ctx.fillStyle='rgba(57,255,20,0.7)';ctx.fill();}else{tr.active=false;tr.progress=0;tr.delay=40+Math.random()*80;}});
    nodes.forEach(n=>{n.pulse+=0.04;const alpha=0.1+Math.abs(Math.sin(n.pulse))*0.2;ctx.beginPath();ctx.arc(n.x,n.y,2,0,Math.PI*2);ctx.fillStyle=`rgba(57,255,20,${alpha})`;ctx.fill();});animId=requestAnimationFrame(draw);}
function start(){isActive=true;if(!animId)draw();}
function stop(){isActive=false;}resize();window.addEventListener('resize',resize,{passive:true});return{start,stop};}
const circuits={farmfair:initCircuit('cc-1'),terramate:initCircuit('cc-2'),thaniyas:initCircuit('cc-3')};
document.querySelectorAll('.pc').forEach(card=>{const id=card.dataset.product;card.addEventListener('mouseenter',()=>circuits[id]&&circuits[id].start());card.addEventListener('mouseleave',()=>circuits[id]&&circuits[id].stop());});
const backdrop=document.getElementById('prod-backdrop');let currentModal=null;
function openModal(productId){if(currentModal&&currentModal!==productId)closeModal(currentModal,false);currentModal=productId;
  const panel=document.getElementById('modal-'+productId);
  const card=document.querySelector(`[data-product="${productId}"].pc`);
  if(!panel)return;document.querySelectorAll('.pc').forEach(c=>c.classList.remove('modal-active'));if(card)card.classList.add('modal-active');
  backdrop.classList.add('open');panel.classList.add('open');document.body.style.overflow='hidden';
  const points=panel.querySelectorAll('.pmp-point');points.forEach(p=>p.classList.remove('revealed'));points.forEach((p,i)=>setTimeout(()=>p.classList.add('revealed'),350+i*80));circuits[productId]&&circuits[productId].start();
  const body=panel.querySelector('.pmp-body');if(body)body.scrollTop=0;}
function closeModal(productId,clearCurrent=true){const panel=document.getElementById('modal-'+productId);if(!panel)return;
panel.classList.remove('open');
backdrop.classList.remove('open');
document.body.style.overflow='';
document.querySelectorAll('.pc').forEach(c=>c.classList.remove('modal-active'));if(clearCurrent)currentModal=null;} 
document.querySelectorAll('.pc-learn').forEach(btn=>{btn.addEventListener('click',e=>{e.stopPropagation();openModal(btn.dataset.product);});}); 
document.querySelectorAll('.pmp-close').forEach(btn=>{btn.addEventListener('click',()=>closeModal(btn.dataset.close));}); 
document.querySelectorAll('.pmp-next-btn').forEach(btn=>{btn.addEventListener('click',()=>{const next=btn.dataset.next;if(currentModal)closeModal(currentModal,false);openModal(next);});}); 
document.querySelectorAll('.pmp-dot').forEach(dot=>{dot.addEventListener('click',()=>{const target=dot.dataset.target;if(currentModal)closeModal(currentModal,false);openModal(target);});}); 
backdrop.addEventListener('click',()=>{if(currentModal)closeModal(currentModal);});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&currentModal)closeModal(currentModal);});



(function(){const slides=document.querySelectorAll('.explore-slide');const dots=document.querySelectorAll('.explore-dots .explore-dot');let cur=0;
  function goTo(n){cur=(n+4)%4;slides.forEach((s,i)=>s.classList.toggle('active',i===cur));dots.forEach((d,i)=>d.classList.toggle('active',i===cur));document.getElementById('explore-current').textContent=String(cur+1).padStart(2,'0');}
  document.getElementById('explore-prev').addEventListener('click',()=>goTo(cur-1));
  document.getElementById('explore-next').addEventListener('click',()=>goTo(cur+1));
  dots.forEach((d,i)=>d.addEventListener('click',()=>goTo(i)));
  setInterval(()=>goTo(cur+1),6000);})();

/* ══════════════════════════════════════════
   TEAM ORBIT — auto-rotating, tap-to-center
   ══════════════════════════════════════════ */
(function initTeamOrbit(){

  const TEAM = [
    { name:"Seenuvasan Balakrishnan",   role:"CTO",                         img:"./images/cto.jpg"    },
    { name:"Sundhararajan Devaprakash", role:"CEO",                         img:"./images/ceo.jpg"    },
    { name:"Rani Ponmathi .P",          role:"Head – Indian Operations",    img:"./images/HIO.jpg"    },
    { name:"John Bosco",                role:"React JS & .Net Developer",   img:"./images/john.jpg"   },
    { name:"Mohammed Bashil",           role:"Senior iOS Developer",        img:"./images/Bashil.jpg" },
    { name:"Rashmi MD",                 role:"Market Research Manager",     img:"./images/Rashmi.jpg" }
  ];

  const stage       = document.getElementById('orbitStage');
  if(!stage) return;

  const track        = document.getElementById('orbitTrack');
  const centerWrap    = document.getElementById('orbitCenter');
  const centerVideo   = document.getElementById('orbitCenterVideo');
  const centerImg     = document.getElementById('centerImg');
  const tagEl          = document.getElementById('orbitTag');
  const nameEl         = document.getElementById('orbitName');
  const hintEl         = document.getElementById('orbitHint');
  const backBtn        = document.getElementById('orbitBackBtn');
  const frame           = document.getElementById('orbitCenterFrame');

  let angle = 0;
  let paused = false;
  let resumeTimer = null;
  let activeIndex = null;
  let nodes = [];
  const SPEED = 0.080;
  const AUTO_RETURN_MS = 6000;

  /* ── Build orbiting node photos ── */
  function buildNodes(){
    track.innerHTML = '';
    nodes = TEAM.map((member, i) => {
      const el = document.createElement('div');
      el.className = 'orbit-node';
      el.setAttribute('role','button');
      el.setAttribute('tabindex','0');
      el.setAttribute('aria-label', `${member.name}, ${member.role}`);
      el.innerHTML =
        `<div class="orbit-node-photo">
           <img src="${member.img}" alt="${member.name}" loading="lazy">
         </div>
         <div class="orbit-node-label">
           <div class="orbit-node-name">${member.name}</div>
           <div class="orbit-node-role">${member.role}</div>
         </div>`;
      el.addEventListener('click', () => selectMember(i));
      el.addEventListener('keydown', e => {
        if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); selectMember(i); }
      });
      track.appendChild(el);
      return el;
    });
  }

  function radius(){
    return (stage.offsetWidth / 2) * 0.8;
  }

  function layout(){
    const R = radius();
    const step = 360 / TEAM.length;
    nodes.forEach((el, i) => {
      const a = (angle + i * step) * Math.PI / 180;
      const x = Math.cos(a) * R;
      const y = Math.sin(a) * R;
      el.style.transform = `translate(${x}px, ${y}px)`;
    });
  }

  function tick(){
    if(!paused) angle = (angle + SPEED) % 360;
    layout();
    requestAnimationFrame(tick);
  }

  /* ── Show a team member's photo + name/role in the center ── */
  function selectMember(i){
    activeIndex = i;
    const member = TEAM[i];

    nodes.forEach((n, idx) => n.classList.toggle('active', idx === i));

    centerImg.onload = () => {};
    centerImg.src = member.img;
    centerImg.alt = member.name;
    tagEl.textContent  = member.role;
    nameEl.textContent = member.name;

    centerWrap.classList.add('show-photo');
    if(hintEl) hintEl.classList.add('hidden');

    paused = true;
    clearTimeout(resumeTimer);
    resumeTimer = setTimeout(returnToVideo, AUTO_RETURN_MS);
  }

  /* ── Return center to the live looping video ── */
  function returnToVideo(){
    centerWrap.classList.remove('show-photo');
    nodes.forEach(n => n.classList.remove('active'));
    activeIndex = null;
    clearTimeout(resumeTimer);
    paused = false;
    if(centerVideo){
      centerVideo.currentTime = centerVideo.currentTime; // keep playing smoothly
      centerVideo.play().catch(()=>{});
    }
  }

  /* Tap the center itself (while showing a photo) to snap back to video */
  frame.addEventListener('click', () => {
    if(centerWrap.classList.contains('show-photo')) returnToVideo();
  });
  if(backBtn){
    backBtn.addEventListener('click', e => { e.stopPropagation(); returnToVideo(); });
  }

  /* Init */
  buildNodes();
  layout();
  requestAnimationFrame(tick);

  window.addEventListener('resize', layout, { passive:true });

  /* Pause rotation while hovering the stage so users can click comfortably */
  stage.addEventListener('mouseenter', () => { paused = true; });
  stage.addEventListener('mouseleave', () => {
    if(activeIndex === null) paused = false;
    else {
      clearTimeout(resumeTimer);
      resumeTimer = setTimeout(returnToVideo, AUTO_RETURN_MS);
    }
  });


  // Init
  buildNodes();
  layout();
  requestAnimationFrame(tick);

  window.addEventListener('resize', layout, { passive:true });

  // Pause orbit rotation while a finger/cursor hovers the stage too,
  // so users can comfortably tap a moving photo.
  stage.addEventListener('mouseenter', () => { paused = true; });
  stage.addEventListener('mouseleave', () => {
    if(activeIndex === null) paused = false;
    else {
      clearTimeout(resumeTimer);
      resumeTimer = setTimeout(() => { paused = false; }, 5000);
    }
  })

})();
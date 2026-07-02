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

/* ══ WHO BENEFITS ══ */
(function initBenSection(){
  document.querySelectorAll('.ben-flip-card').forEach(card=>{
    card.addEventListener('click',function(e){
      if(e.target.classList.contains('ben-read-more-btn'))return;
      this.classList.toggle('flipped');
    });
  });


  function resetFlipInstant(card){
    if(!card)return;
    const inner=card.querySelector('.ben-flip-inner');
    if(!inner){card.classList.remove('flipped');return;}
    inner.style.transition='none';
    card.classList.remove('flipped');
    void inner.offsetWidth; 
    inner.style.transition='';
  }

  document.querySelectorAll('.ben-read-more-btn').forEach(btn=>{
    btn.addEventListener('click',function(e){
      e.stopPropagation();
      const id=this.dataset.card;
      const shutter=document.getElementById('bsh-'+id);
      const card=document.getElementById('bfc-'+id);
      if(!shutter)return;
      const cardH=card.offsetHeight;
      shutter.style.height=Math.max(cardH,360)+'px';
      shutter.classList.add('open');
    });
  });

  document.querySelectorAll('.ben-shutter-close-btn').forEach(btn=>{
    btn.addEventListener('click',function(e){
      e.stopPropagation();
      const id=this.dataset.card;
      const shutter=document.getElementById('bsh-'+id);
      const card=document.getElementById('bfc-'+id);
      if(shutter)shutter.classList.remove('open');
      resetFlipInstant(card);
    });
  });


  document.addEventListener('keydown',e=>{
    if(e.key==='Escape'){
      document.querySelectorAll('.ben-shutter.open').forEach(s=>{
        s.classList.remove('open');
        const id=s.id.replace('bsh-','');
        resetFlipInstant(document.getElementById('bfc-'+id));
      });
    }
  });

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

/*TEAM ORBIT */
(function initTeamOrbit(){

  const TEAM = [
    { name:"S",   role:"CTO",                         img:"./images/cto.jpg"    },
    { name:"S", role:"CEO",                         img:"./images/ceo.jpg"    },
    { name:"R P",          role:"Head – Indian Operations",    img:"./images/HIO.jpg"    },
    { name:"JK",                role:"React JS & .Net Developer",   img:"./images/john.jpg"   },
    { name:"M",           role:"Senior iOS Developer",        img:"./images/Bashil.jpg" },
    { name:" MD",                 role:"Market Research Manager",     img:"./images/Rashmi.jpg" }
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

  function tick(){if(!paused) angle = (angle + SPEED) % 360;layout();requestAnimationFrame(tick);}

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

  
  function returnToVideo(){
    centerWrap.classList.remove('show-photo');
    nodes.forEach(n => n.classList.remove('active'));
    activeIndex = null;
    clearTimeout(resumeTimer);
    paused = false;
    if(centerVideo){
      centerVideo.currentTime = centerVideo.currentTime; 
      centerVideo.play().catch(()=>{});
    }
  }

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

  
  stage.addEventListener('mouseenter', () => { paused = true; });
  stage.addEventListener('mouseleave', () => {
    if(activeIndex === null) paused = false;
    else {
      clearTimeout(resumeTimer);
      resumeTimer = setTimeout(returnToVideo, AUTO_RETURN_MS);
    }
  });


  
  buildNodes();
  layout();
  requestAnimationFrame(tick);

  window.addEventListener('resize', layout, { passive:true });

  
  stage.addEventListener('mouseenter', () => { paused = true; });
  stage.addEventListener('mouseleave', () => {
    if(activeIndex === null) paused = false;
    else {
      clearTimeout(resumeTimer);
      resumeTimer = setTimeout(() => { paused = false; }, 5000);
    }
  })

})();


(function initQACompanion(){
  'use strict';

  
  ['rbd','rbu','drone-wrap','how-robot','scene-canvas'].forEach(function(id){
    var el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });
  document.querySelectorAll('.robot-tip').forEach(function(el){
    el.style.display = 'none';
  });

  var hud = document.getElementById('qa-hud');
  if (!hud) return;

  var robotCanvas = document.getElementById('qa-robot-canvas');
  var humanCanvas = document.getElementById('qa-human-canvas');
  var robotBubble = document.getElementById('qa-bubble-robot');
  var humanBubble = document.getElementById('qa-bubble-human');
  var robotTextEl = document.getElementById('qa-robot-text');
  var humanTextEl = document.getElementById('qa-human-text');

  var rCtx = robotCanvas ? robotCanvas.getContext('2d') : null;
  var hCtx = humanCanvas ? humanCanvas.getContext('2d') : null;

  /* ── 2. Dialogue script — one Q&A pair per major section ── */
  var DIALOGUE = {
    hero:    { q: "What exactly does i-Farmate do?",              a: "I'm an autonomous field robot — I weed, seed, monitor and protect crops around the clock, on my own." },
    about:   { q: "So who actually builds you?",                  a: "AUXWIT Technologies engineered me, fusing edge-AI, multi-spectral vision and precision mechanics into one field companion." },
    cap:     { q: "What can you actually detect out there?",      a: "Weeds, pests, early disease signs, weather shifts — thousands of sensor readings an hour, all analysed on the move." },
    ben:     { q: "Who really benefits from having you around?",  a: "Farmers, crops, consumers, soil and water all gain — chemical-free operation keeps the whole ecosystem healthier." },
    how:     { q: "Walk me through how you actually work a field.", a: "I patrol with GPS and vision, detect issues with AI, act with precision, then log everything to your dashboard." },
    prod:    { q: "Is it just you, or is there more to this?",    a: "There's a whole stack — FarmFair for direct sales, TerraMate for soil IoT, and Thaniyas Organic growing produce with me." },
    explore: { q: "Where has i-Farmate actually been shown off?", a: "From VIT Chennai's labs to United AgriTech 2025 and NAARM's incubation program — real fields, real farmers, real feedback." },
    cta:     { q: "How do I actually get you on my farm?",        a: "Fill out the form below or call us directly — our team will get a demo scheduled on your field within days." }
  };

  var currentSection = null;
  var typeTimerR = null, typeTimerH = null;

  function typeText(el, text, speed, isRobot){
    if (isRobot) { clearInterval(typeTimerR); } else { clearInterval(typeTimerH); }
    el.textContent = '';
    var i = 0;
    var timer = setInterval(function(){
      el.textContent += text.charAt(i);
      i++;
      if (i >= text.length) clearInterval(timer);
    }, speed || 16);
    if (isRobot) { typeTimerR = timer; } else { typeTimerH = timer; }
  }

  function playDialogue(key){
    var d = DIALOGUE[key];
    if (!d || key === currentSection) return;
    currentSection = key;

    if (humanBubble) humanBubble.classList.remove('show');
    if (robotBubble) robotBubble.classList.remove('show');

    setTimeout(function(){
      if (humanBubble) humanBubble.classList.add('show');
      if (humanTextEl) typeText(humanTextEl, d.q, 16, false);
    }, 120);

    setTimeout(function(){
      if (robotBubble) robotBubble.classList.add('show');
      if (robotTextEl) typeText(robotTextEl, d.a, 14, true);
    }, 620);
  }

  
  var sectionIds = Object.keys(DIALOGUE);
  var sections = sectionIds
    .map(function(id){ return document.getElementById(id); })
    .filter(Boolean);

  if ('IntersectionObserver' in window && sections.length) {
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if (entry.isIntersecting && entry.intersectionRatio > 0.35) {
          playDialogue(entry.target.id);
        }
      });
    }, { threshold: [0, 0.35, 0.6, 1], rootMargin: '-10% 0px -10% 0px' });
    sections.forEach(function(sec){ io.observe(sec); });
  }

  
  var footer = document.getElementById('footer-section');
  if (footer && 'IntersectionObserver' in window) {
    var footIO = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        hud.style.opacity = entry.isIntersecting ? '0' : '1';
        hud.style.pointerEvents = entry.isIntersecting ? 'none' : '';
      });
    }, { threshold: 0.1 });
    footIO.observe(footer);
  }

  
  function fitCanvas(canvas){
    if (!canvas || canvas._scaled) return;
    var dpr = window.devicePixelRatio || 1;
    var w = canvas.width, h = canvas.height;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    var ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    canvas._scaled = true;
    canvas._logW = w;
    canvas._logH = h;
  }
  fitCanvas(robotCanvas);
  fitCanvas(humanCanvas);

  function rr(ctx, x, y, w, h, r){
    if (ctx.roundRect) { ctx.roundRect(x, y, w, h, r); }
    else { ctx.rect(x, y, w, h); }
  }


  function drawRobot(ctx, w, h, t){
    ctx.clearRect(0, 0, w, h);
    var bob = Math.sin(t / 650) * 2.2;
    var cx = w / 2;
    ctx.save();
    ctx.translate(0, bob);

    var grad = ctx.createRadialGradient(cx, h - 6, 2, cx, h - 6, 26);
    grad.addColorStop(0, 'rgba(57,255,20,.35)');
    grad.addColorStop(1, 'rgba(57,255,20,0)');
    ctx.fillStyle = grad;
    ctx.beginPath(); ctx.ellipse(cx, h - 6, 24, 6, 0, 0, Math.PI * 2); ctx.fill();

    ctx.strokeStyle = '#39FF14';
    ctx.lineWidth = 2;

    /* legs */
    ctx.beginPath();
    ctx.moveTo(cx - 10, h - 38); ctx.lineTo(cx - 12, h - 8);
    ctx.moveTo(cx + 10, h - 38); ctx.lineTo(cx + 12, h - 8);
    ctx.stroke();
    ctx.fillStyle = 'rgba(57,255,20,.12)';
    ctx.beginPath(); rr(ctx, cx - 16, h - 10, 10, 6, 2); ctx.fill(); ctx.stroke();
    ctx.beginPath(); rr(ctx, cx + 6, h - 10, 10, 6, 2); ctx.fill(); ctx.stroke();

    /* torso */
    ctx.beginPath(); rr(ctx, cx - 15, h - 64, 30, 28, 6); ctx.fill(); ctx.stroke();

    /* chest core light */
    var pulse = 0.5 + 0.5 * Math.sin(t / 300);
    ctx.beginPath();
    ctx.arc(cx, h - 50, 4 + pulse * 1.2, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(57,255,20,' + (0.5 + pulse * 0.5) + ')';
    ctx.fill();
    ctx.fillStyle = 'rgba(57,255,20,.12)';

    /* arms */
    var armSwing = Math.sin(t / 700) * 6;
    ctx.strokeStyle = '#39FF14';
    ctx.beginPath();
    ctx.moveTo(cx - 15, h - 58); ctx.lineTo(cx - 24, h - 42 + armSwing * 0.3);
    ctx.moveTo(cx + 15, h - 58); ctx.lineTo(cx + 24, h - 42 - armSwing * 0.3);
    ctx.stroke();

    /* neck + head */
    ctx.beginPath(); ctx.moveTo(cx, h - 64); ctx.lineTo(cx, h - 70); ctx.stroke();
    ctx.beginPath(); rr(ctx, cx - 12, h - 92, 24, 24, 7); ctx.fill(); ctx.stroke();

    /* antenna */
    ctx.beginPath(); ctx.moveTo(cx, h - 92); ctx.lineTo(cx, h - 100); ctx.stroke();
    ctx.beginPath(); ctx.arc(cx, h - 102, 2.4, 0, Math.PI * 2);
    ctx.fillStyle = '#E8A020'; ctx.fill();

    /* visor / eyes */
    var blink = (Math.sin(t / 1900) > 0.94) ? 0.2 : 1;
    ctx.fillStyle = '#0A0D08';
    ctx.beginPath(); rr(ctx, cx - 9, h - 85, 18, 8 * blink, 3); ctx.fill();
    ctx.fillStyle = '#39FF14';
    ctx.shadowColor = '#39FF14'; ctx.shadowBlur = 6;
    ctx.beginPath(); ctx.arc(cx - 4, h - 81, 1.6 * blink, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(cx + 4, h - 81, 1.6 * blink, 0, Math.PI * 2); ctx.fill();
    ctx.shadowBlur = 0;

    ctx.restore();
  }


  function drawFarmer(ctx, w, h, t){
    ctx.clearRect(0, 0, w, h);
    var bob = Math.sin(t / 700 + 1.2) * 2;
    var cx = w / 2;
    ctx.save();
    ctx.translate(0, bob);

    var grad = ctx.createRadialGradient(cx, h - 6, 2, cx, h - 6, 24);
    grad.addColorStop(0, 'rgba(232,160,32,.3)');
    grad.addColorStop(1, 'rgba(232,160,32,0)');
    ctx.fillStyle = grad;
    ctx.beginPath(); ctx.ellipse(cx, h - 6, 22, 6, 0, 0, Math.PI * 2); ctx.fill();

    ctx.strokeStyle = '#E8A020';
    ctx.lineWidth = 2;

    /* legs */
    var legSwing = Math.sin(t / 900) * 1.5;
    ctx.beginPath();
    ctx.moveTo(cx - 6, h - 40); ctx.lineTo(cx - 9 + legSwing, h - 8);
    ctx.moveTo(cx + 6, h - 40); ctx.lineTo(cx + 9 - legSwing, h - 8);
    ctx.stroke();

    /* shirt */
    ctx.fillStyle = 'rgba(232,160,32,.14)';
    ctx.beginPath(); rr(ctx, cx - 13, h - 66, 26, 30, 8); ctx.fill(); ctx.stroke();

    /* arms */
    var armSwing2 = Math.sin(t / 750 + 1) * 7;
    ctx.beginPath();
    ctx.moveTo(cx - 13, h - 58); ctx.lineTo(cx - 22, h - 40 + armSwing2 * 0.3);
    ctx.moveTo(cx + 13, h - 58); ctx.lineTo(cx + 22, h - 40 - armSwing2 * 0.3);
    ctx.stroke();

    /* neck */
    ctx.beginPath(); ctx.moveTo(cx, h - 66); ctx.lineTo(cx, h - 70); ctx.stroke();

    /* head */
    ctx.fillStyle = '#f0d3a0';
    ctx.beginPath(); ctx.arc(cx, h - 80, 11, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#E8A020'; ctx.stroke();

    /* straw hat */
    ctx.fillStyle = '#c99a3f';
    ctx.beginPath(); ctx.ellipse(cx, h - 90, 15, 4, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(cx, h - 92, 8, Math.PI, 0); ctx.fill();

    /* eyes */
    var blink2 = (Math.sin(t / 2300 + 0.6) > 0.94) ? 0.2 : 1;
    ctx.fillStyle = '#2a1c0a';
    ctx.beginPath(); ctx.ellipse(cx - 4, h - 80, 1.4, 1.6 * blink2, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(cx + 4, h - 80, 1.4, 1.6 * blink2, 0, 0, Math.PI * 2); ctx.fill();

    /* smile */
    ctx.strokeStyle = '#8a5a20';
    ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.arc(cx, h - 77, 3, 0.15 * Math.PI, 0.85 * Math.PI); ctx.stroke();

    ctx.restore();
  }

  /* ── 7. Animation loop ── */
  var raf;
  function loop(t){
    if (rCtx) drawRobot(rCtx, robotCanvas._logW || 72, robotCanvas._logH || 94, t);
    if (hCtx) drawFarmer(hCtx, humanCanvas._logW || 72, humanCanvas._logH || 94, t);
    raf = requestAnimationFrame(loop);
  }
  raf = requestAnimationFrame(loop);

  document.addEventListener('visibilitychange', function(){
    if (document.hidden) { cancelAnimationFrame(raf); }
    else { raf = requestAnimationFrame(loop); }
  });


  window.addEventListener('load', function(){
    setTimeout(function(){ playDialogue('hero'); }, 1800);
  });

})();
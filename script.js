const menu=document.querySelector('.menu-btn'),nav=document.querySelector('.nav');
menu?.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',open)});
document.querySelectorAll('.nav a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));

document.querySelectorAll('.tab').forEach(btn=>{
  btn.addEventListener('click',()=>{
    document.querySelectorAll('.tab').forEach(x=>x.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(x=>x.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(btn.dataset.tab).classList.add('active');
  });
});

const toggle=document.querySelector('.story-toggle'), more=document.querySelector('.story-more');
toggle?.addEventListener('click',()=>{
  const open=more.classList.toggle('open');
  toggle.setAttribute('aria-expanded',open);
  toggle.querySelector('span').textContent=open?'−':'+';
});

const lightbox=document.querySelector('.lightbox'), lightImg=lightbox?.querySelector('img');
document.querySelectorAll('.gallery-card').forEach(card=>card.addEventListener('click',()=>{
  lightImg.src=card.dataset.full; lightImg.alt=card.querySelector('img').alt;
  lightbox.classList.add('open'); lightbox.setAttribute('aria-hidden','false');
}));
function closeLightbox(){lightbox.classList.remove('open');lightbox.setAttribute('aria-hidden','true');lightImg.src=''}
document.querySelector('.close-lightbox')?.addEventListener('click',closeLightbox);
lightbox?.addEventListener('click',e=>{if(e.target===lightbox)closeLightbox()});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeLightbox()});


// Scroll-driven cinematic effects
const progressBar=document.querySelector('.scroll-progress span');
const flyingBird=document.querySelector('.scroll-bird');
const hero=document.querySelector('.hero');
const eagleRig=document.querySelector('.eagle-rig');
const featherTrail=document.querySelector('.feather-trail');
if(featherTrail && !featherTrail.children.length){for(let i=0;i<6;i++){const f=document.createElement('i');f.style.left=(12+i*9)+'%';f.style.top=(38+(i%3)*13)+'%';featherTrail.appendChild(f)}}
const revealItems=document.querySelectorAll('.reveal-on-scroll');
let lastScroll=window.scrollY, lastTime=performance.now(), stopFlapTimer;
let ticking=false;
const clamp=(v,min,max)=>Math.min(max,Math.max(min,v));
function updateScrollEffects(){
  const y=window.scrollY || 0;
  const max=Math.max(1,document.documentElement.scrollHeight-window.innerHeight);
  const p=clamp(y/max,0,1);
  if(progressBar) progressBar.style.transform=`scaleX(${p})`;
  if(flyingBird){
    // Jatayu makes a visible diagonal flight from the lower-left toward the upper-right.
    // The path repeats across the page so the interaction is easy to notice on long pages.
    const cycle=clamp(p,0,1);
    const phase=(cycle*2.1)%1;
    const birdW=flyingBird.getBoundingClientRect().width || 330;
    const x=-birdW-40 + phase*(window.innerWidth+birdW+80);
    const startY=window.innerHeight*.80;
    const endY=window.innerHeight*.08;
    const arc=Math.sin(phase*Math.PI)*-70;
    const yPos=startY + (endY-startY)*phase + arc;
    const rot=-12 + phase*24;
    const scale=.78 + Math.sin(phase*Math.PI)*.16;
    flyingBird.style.transform=`translate3d(${x}px,${yPos}px,0) rotate(${rot}deg) scale(${scale})`;
    flyingBird.classList.add('fly-active');
  }
  ticking=false;
}
function onScroll(){
  const now=performance.now();
  const dy=Math.abs(window.scrollY-lastScroll);
  const dt=Math.max(16,now-lastTime);
  const speed=dy/dt;
  if(flyingBird && speed>.05){
    flyingBird.classList.add('is-flapping');
    clearTimeout(stopFlapTimer);
    stopFlapTimer=setTimeout(()=>flyingBird.classList.remove('is-flapping'),180);
  }
  lastScroll=window.scrollY; lastTime=now;
  if(!ticking){ticking=true;requestAnimationFrame(updateScrollEffects)}
}
window.addEventListener('scroll',onScroll,{passive:true});
window.addEventListener('resize',()=>requestAnimationFrame(updateScrollEffects),{passive:true});
requestAnimationFrame(updateScrollEffects);

if('IntersectionObserver' in window){
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target)}}),{threshold:.14});
  revealItems.forEach(el=>observer.observe(el));
}else revealItems.forEach(el=>el.classList.add('is-visible'));


// Give the realistic eagle a subtle 3D body attitude during flight.
const updateEagle3D=()=>{
  if(!eagleRig) return;
  const max=Math.max(1,document.documentElement.scrollHeight-window.innerHeight);
  const p=Math.min(1,Math.max(0,(window.scrollY||0)/max));
  const yaw=-9 + Math.sin(p*Math.PI*4)*7;
  const pitch=3 + Math.cos(p*Math.PI*3)*3;
  eagleRig.style.transform=`rotateY(${yaw}deg) rotateX(${pitch}deg)`;
};
window.addEventListener('scroll',updateEagle3D,{passive:true});
window.addEventListener('resize',updateEagle3D,{passive:true});
updateEagle3D();

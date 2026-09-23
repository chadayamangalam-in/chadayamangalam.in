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

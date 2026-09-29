const BASE_W=1870, BASE_H=841;
const viewport=document.getElementById('viewport');
const scene=document.getElementById('scene');
const player=document.getElementById('player');
const hint=document.getElementById('hint');
const hintText=hint.querySelector('span');
const modal=document.getElementById('projectModal');
const modalTitle=document.getElementById('modalTitle');
const modalDistrict=document.getElementById('modalDistrict');
const modalDescription=document.getElementById('modalDescription');
const modalTags=document.getElementById('modalTags');
const modalLink=document.getElementById('modalLink');

const projects={
  mana:{name:'Mana News',district:'MEDIA / ENTERTAINMENT',description:'Portal de entretenimento e cultura geek com conteúdo sobre games, séries, filmes e livros.',tags:['Web','CMS','SEO','Frontend','Backend'],url:'https://mananews.com.br/',x:555,y:385},
  yuzo:{name:'Yuzo Style',district:'AI / FASHION TECH',description:'Produto de moda com inteligência artificial para criar looks, conceitos visuais e experiências de styling.',tags:['AI','Fashion Tech','3D','Web','Product'],url:'https://yuzostyle.com/',x:1100,y:355},
  minecraft:{name:'Minecraft Server',district:'JAVA / INFRASTRUCTURE',description:'Servidor Minecraft versionado como projeto técnico com Java, Docker e administração de infraestrutura.',tags:['Java','Docker','Server','Infrastructure'],url:'https://github.com/LuizBuenoSilva/minecraft',x:1560,y:535}
};

let scale=1, px=935, py=530;
let vx=0, vy=0;
const down=new Set();

function fit(){
  scale=Math.min(innerWidth/BASE_W,innerHeight/BASE_H);
  scene.style.transform=`translate(-50%,-50%) scale(${scale})`;
}
addEventListener('resize',fit);fit();

function setPlayer(){player.style.left=`${px}px`;player.style.top=`${py}px`}
setPlayer();

function nearest(){
  let best=null,dist=150;
  for(const [key,p] of Object.entries(projects)){
    const d=Math.hypot(px-p.x,py-p.y);
    if(d<dist){dist=d;best={key,...p}}
  }
  return best;
}

function openProject(p){
  modalDistrict.textContent=p.district;
  modalTitle.textContent=p.name;
  modalDescription.textContent=p.description;
  modalTags.innerHTML=p.tags.map(x=>`<span>${x}</span>`).join('');
  modalLink.href=p.url;
  modalLink.textContent=p.name==='Minecraft Server'?'Ver repositório ↗':'Visitar projeto ↗';
  modal.showModal();
}

document.querySelectorAll('.hotspot').forEach(btn=>btn.addEventListener('click',()=>openProject(projects[btn.dataset.project])));
document.getElementById('closeModal').onclick=()=>modal.close();
document.getElementById('continueBtn').onclick=()=>modal.close();

addEventListener('keydown',e=>{
  const k=e.key.toLowerCase();
  if(['w','a','s','d','arrowup','arrowdown','arrowleft','arrowright'].includes(k)){e.preventDefault();down.add(k)}
  if(k==='e'&&!modal.open){const n=nearest();if(n)openProject(n)}
  if(k==='escape'&&modal.open)modal.close();
});
addEventListener('keyup',e=>down.delete(e.key.toLowerCase()));

let last=performance.now();
function tick(now){
  const dt=Math.min((now-last)/16.667,2);last=now;
  let dx=0,dy=0;
  if(down.has('a')||down.has('arrowleft'))dx--;
  if(down.has('d')||down.has('arrowright'))dx++;
  if(down.has('w')||down.has('arrowup'))dy--;
  if(down.has('s')||down.has('arrowdown'))dy++;
  const hasInput=dx||dy;
  const accel=.5*dt;
  const friction=Math.pow(.82,dt);
  const maxSpeed=4.4;

  if(hasInput&&!modal.open){
    const len=Math.hypot(dx,dy);
    vx+=dx/len*accel;
    vy+=dy/len*accel;
  }

  vx*=friction;
  vy*=friction;

  const currentSpeed=Math.hypot(vx,vy);
  if(currentSpeed>maxSpeed){
    vx=vx/currentSpeed*maxSpeed;
    vy=vy/currentSpeed*maxSpeed;
  }

  if(modal.open){
    vx*=.5;
    vy*=.5;
  }

  px=Math.max(50,Math.min(BASE_W-50,px+vx*dt));
  py=Math.max(80,Math.min(BASE_H-45,py+vy*dt));
  setPlayer();

  const moving=Math.hypot(vx,vy)>.12&&!modal.open;
  player.classList.toggle('walking',moving);
  player.classList.toggle('idle',!moving);
  player.classList.toggle('facing-left',vx<-.18);
  player.classList.toggle('facing-right',vx>.18);
  const n=nearest();hint.hidden=!n;if(n)hintText.textContent=`Abrir ${n.name}`;
  requestAnimationFrame(tick);
}
requestAnimationFrame(tick);

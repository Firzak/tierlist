let pointerDrag=null;
function beginPointerDrag(e,el,id){
  if(pointerDrag)return;
  const r=el.getBoundingClientRect();
  pointerDrag={id,el,pointerId:e.pointerId,startX:e.clientX,startY:e.clientY,offsetX:e.clientX-r.left,offsetY:e.clientY-r.top,active:false,ghost:null,placeholder:null,zone:null,lastX:e.clientX,lastY:e.clientY};
  try{el.setPointerCapture(e.pointerId)}catch(_){ }
  e.preventDefault();window.getSelection?.()?.removeAllRanges();
}
function activatePointerDrag(d){
  d.active=true;
  const ghost=d.el.cloneNode(true);
  ghost.classList.remove('dragging-card');
  ghost.classList.add('drag-ghost');
  ghost.style.width=d.el.offsetWidth+'px';
  ghost.style.height=d.el.offsetHeight+'px';
  ghost.style.visibility='visible';
  ghost.style.display='block';
  document.body.appendChild(ghost);
  d.ghost=ghost;
  d.el.classList.add('dragging-card');
  d.el.style.visibility='hidden';
  d.placeholder=document.createElement('div');
  d.placeholder.className='drop-placeholder';
  document.body.classList.add('pointer-dragging');
  updatePointerDragPosition(d.lastX,d.lastY);
  updatePointerDropTarget(d.lastX,d.lastY);
}
function updatePointerDragPosition(x,y){
  const d=pointerDrag;if(!d?.active||!d.ghost)return;
  d.lastX=x;d.lastY=y;
  d.ghost.style.left=Math.round(x-d.offsetX)+'px';
  d.ghost.style.top=Math.round(y-d.offsetY)+'px';
}
function getPointerZone(x,y){
  const ghost=pointerDrag?.ghost;
  if(ghost)ghost.style.display='none';
  const hit=document.elementFromPoint(x,y);
  if(ghost)ghost.style.display='block';
  return hit?.closest('.zone,.pool-zone')||null;
}
function updatePointerDropTarget(x,y){
  const d=pointerDrag;if(!d?.active)return;
  const z=getPointerZone(x,y);
  document.querySelectorAll('.zone.over,.pool-zone.over').forEach(el=>{if(el!==z)el.classList.remove('over')});
  if(!z){d.zone=null;if(d.placeholder?.parentNode)d.placeholder.remove();return}
  d.zone=z;z.classList.add('over');
  placePointerPlaceholder(z,x,y,d.placeholder,d.id);
}
function placePointerPlaceholder(zone,x,y,ph,id){
  if(ph.parentNode!==zone)zone.appendChild(ph);
  const cards=[...zone.querySelectorAll('.card')].filter(c=>c.dataset.id!==id);
  if(!cards.length){zone.appendChild(ph);return}
  const rows=[];
  for(const c of cards){
    const r=c.getBoundingClientRect();
    let row=rows.find(row=>Math.abs(row.top-r.top)<Math.max(8,r.height*0.18));
    if(!row){row={top:r.top,bottom:r.bottom,cards:[]};rows.push(row)}
    row.top=Math.min(row.top,r.top);row.bottom=Math.max(row.bottom,r.bottom);row.cards.push({el:c,r});
  }
  rows.sort((a,b)=>a.top-b.top);
  let row=rows[0];
  const containing=rows.find(r=>y>=r.top-8&&y<=r.bottom+8);
  if(containing)row=containing;
  else if(y>rows[rows.length-1].bottom)row=rows[rows.length-1];
  else if(y<rows[0].top)row=rows[0];
  else{
    row=rows.reduce((best,r)=>Math.abs(((r.top+r.bottom)/2)-y)<Math.abs(((best.top+best.bottom)/2)-y)?r:best,rows[0]);
  }
  row.cards.sort((a,b)=>a.r.left-b.r.left);
  let before=null;
  for(const item of row.cards){
    const cx=item.r.left+item.r.width/2;
    if(x<cx){before=item.el;break}
  }
  if(before)zone.insertBefore(ph,before);
  else{
    const last=row.cards[row.cards.length-1].el;
    last.after(ph);
  }
}
function onPointerMove(e){
  const d=pointerDrag;if(!d||e.pointerId!==d.pointerId)return;d.lastX=e.clientX;d.lastY=e.clientY;
  if(!d.active&&Math.hypot(e.clientX-d.startX,e.clientY-d.startY)<5)return;
  if(!d.active)activatePointerDrag(d);e.preventDefault();updatePointerDragPosition(e.clientX,e.clientY);updatePointerDropTarget(e.clientX,e.clientY);updateAutoScroll(e.clientY);
}
function finishPointerDrag(cancel=false){
  const d=pointerDrag;if(!d)return;stopAutoScroll();document.body.classList.remove('pointer-dragging');document.querySelectorAll('.zone.over,.pool-zone.over').forEach(el=>el.classList.remove('over'));
  if(d.placeholder?.parentNode)d.placeholder.remove();if(d.ghost?.parentNode)d.ghost.remove();d.el.classList.remove('dragging-card');d.el.style.visibility='';
  if(!cancel&&d.active&&d.zone){
    const z=d.zone;
    const ids=[...z.querySelectorAll('.card')].map(c=>c.dataset.id).filter(id=>id!==d.id);
    const phIndex=d.placeholder?.parentNode===z ? [...z.children].indexOf(d.placeholder) : ids.length;
    const index=Math.max(0,Math.min(phIndex,ids.length));
    removeEverywhere(d.id);
    if(z.id==='pool')state.pool.splice(Math.min(index,state.pool.length),0,d.id);
    else state.tiers[z.dataset.tier].splice(Math.min(index,state.tiers[z.dataset.tier].length),0,d.id);
    save();render();
  }
  pointerDrag=null;
}
function onPointerUp(e){if(pointerDrag&&e.pointerId===pointerDrag.pointerId){try{pointerDrag.el.releasePointerCapture(e.pointerId)}catch(_){ }finishPointerDrag(false)}}
function cancelPointerDrag(){if(pointerDrag)finishPointerDrag(true)}
document.addEventListener('pointermove',onPointerMove,{passive:false});document.addEventListener('pointerup',onPointerUp,{passive:false});document.addEventListener('pointercancel',cancelPointerDrag,{passive:false});window.addEventListener('blur',cancelPointerDrag);

let autoScrollY=0,autoScrollRaf=0;
function autoScrollLoop(){
  if(!autoScrollY){autoScrollRaf=0;return}
  window.scrollBy(0,autoScrollY);
  autoScrollRaf=requestAnimationFrame(autoScrollLoop);
}
function startAutoScroll(){if(!autoScrollRaf)autoScrollRaf=requestAnimationFrame(autoScrollLoop)}
function stopAutoScroll(){autoScrollY=0;if(autoScrollRaf){cancelAnimationFrame(autoScrollRaf);autoScrollRaf=0}}
function updateAutoScroll(y){
  const h=window.innerHeight, edge=Math.min(150,Math.max(90,h*0.18));
  if(y<edge){
    const strength=1-Math.max(0,y)/edge;
    autoScrollY=-Math.round(4+18*strength*strength);
    startAutoScroll();
  }else if(y>h-edge){
    const strength=1-Math.max(0,h-y)/edge;
    autoScrollY=Math.round(4+18*strength*strength);
    startAutoScroll();
  }else stopAutoScroll();
}


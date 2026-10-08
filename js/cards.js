function addMoreCard(){const el=document.createElement('button');el.type='button';el.className='add-more';el.title='Ajouter un élément';el.innerHTML='<span class="plus">＋</span><span class="add-label">AJOUTER</span>'; el.addEventListener('click',openAdd);return el}
function openAdd(){document.getElementById('addModal').classList.add('show');document.getElementById('addName').focus();document.getElementById('addType').value='game';document.getElementById('addUrl').value='';document.getElementById('addFile').value='';setAddPreview(null)}
function closeAdd(){document.getElementById('addModal').classList.remove('show')}
function setAddPreview(src){const box=document.getElementById('addPreview');box.innerHTML=src?`<img src="${esc(src)}" alt="">`:'<span>APERÇU</span>'}
function addGame(){const name=document.getElementById('addName').value.trim();const type=normType(document.getElementById('addType').value);if(!name){toast('Indique le nom du contenu.');document.getElementById('addName').focus();return}if(!type){toast('Choisis un type valide.');document.getElementById('addType').focus();return}const url=document.getElementById('addUrl').value.trim();const file=document.getElementById('addFile').files?.[0];const id=slugId();state.games[id]={id,name,type,genre:'',kind:type,appid:null,steamName:null,cover:null,coverSource:null,failed:false};state.pool.push(id);if(file){if(!file.type.startsWith('image/')){toast('Le fichier doit être une image.');delete state.games[id];removeEverywhere(id);return}fileToDataURL(file).then(data=>{state.games[id].cover=data;state.games[id].coverSource='Import local';save();closeAdd();render();toast(`${name} ajouté`)}).catch(()=>toast('Impossible de lire l’image.'));return}if(url){if(!/^https?:\/\//i.test(url)){toast('L’URL doit commencer par http:// ou https://');delete state.games[id];removeEverywhere(id);return}state.games[id].cover=url;state.games[id].coverSource='URL'}save();closeAdd();render();toast(`${name} ajouté`);if(!url)setTimeout(()=>fetchCover(id).then(()=>{save();render()}),50)}
function card(id){
  const g=state.games[id];const el=document.createElement('div');el.className='card';el.dataset.id=id;
  el.innerHTML=`<div class="cover"><div class="fallback">${esc(initials(g.name))}</div></div><div class="shade"></div><div class="title">${esc(g.name)}</div><button class="trash" title="Supprimer ce jeu" aria-label="Supprimer ce jeu">🗑</button>`;
  const trash=el.querySelector('.trash');
  trash.addEventListener('pointerdown',e=>e.stopPropagation());
  trash.addEventListener('click',e=>{e.stopPropagation();deleteGame(id)});
  if(g.cover && !IN_PREVIEW){
    const img=document.createElement('img');img.alt='';img.loading='lazy';img.draggable=false;img.src=g.cover;
    img.onerror=()=>{g._imgTry=(g._imgTry||0)+1;const urls=g.appid?IMG_URLS(g.appid):[];if(g._imgTry<urls.length)img.src=urls[g._imgTry];else{if(!['URL','Import local'].includes(g.coverSource))cacheDelete(g.name,g.type);g.cover=null;g.coverSource=null;g.failed=true;save();render()}};
    el.querySelector('.cover').innerHTML='';el.querySelector('.cover').appendChild(img);
  } else if(g.failed) el.insertAdjacentHTML('beforeend','<div class="failed">non trouvé</div>');
  else if(!g.cover) el.insertAdjacentHTML('beforeend','<div class="pending">recherche…</div>');
  el.addEventListener('dragstart',e=>e.preventDefault());
  el.addEventListener('pointerdown',e=>{if(e.button!==0||e.target.closest('.trash'))return;beginPointerDrag(e,el,id)});
  return el;
}

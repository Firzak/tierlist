state=load();render();
document.getElementById('search').addEventListener('input',filter);
const modal=document.getElementById('importModal');const fileInput=document.getElementById('fileInput');
document.getElementById('importBtn').addEventListener('click',e=>{e.preventDefault();e.stopPropagation();modal.classList.add('show');});
document.getElementById('closeImport').addEventListener('click',()=>modal.classList.remove('show'));
document.getElementById('chooseCsv').addEventListener('click',()=>fileInput.click());

document.getElementById('closeAdd').addEventListener('click',closeAdd);document.getElementById('cancelAdd').addEventListener('click',closeAdd);document.getElementById('confirmAdd').addEventListener('click',addGame);document.getElementById('addModal').addEventListener('click',e=>{if(e.target.id==='addModal')closeAdd()});const addDrop=document.getElementById('addDrop');const addFile=document.getElementById('addFile');addDrop.addEventListener('click',e=>{if(e.target!==addFile)addFile.click()});addFile.addEventListener('change',e=>{const f=e.target.files?.[0];if(f&&f.type.startsWith('image/'))fileToDataURL(f).then(setAddPreview)});['dragover','dragenter'].forEach(ev=>addDrop.addEventListener(ev,e=>{e.preventDefault();addDrop.classList.add('over')}));['dragleave','drop'].forEach(ev=>addDrop.addEventListener(ev,e=>{e.preventDefault();addDrop.classList.remove('over')}));addDrop.addEventListener('drop',e=>{const f=e.dataTransfer.files?.[0];if(f&&f.type.startsWith('image/')){const dt=new DataTransfer();dt.items.add(f);addFile.files=dt.files;fileToDataURL(f).then(setAddPreview)}});document.getElementById('addUrl').addEventListener('input',e=>{if(e.target.value.trim())setAddPreview(e.target.value.trim())});
document.getElementById('retryCovers').addEventListener('click',()=>runCovers(true));
document.getElementById('missingBtn').addEventListener('click',openMissing);
document.getElementById('closeMissing').addEventListener('click',closeMissing);
document.getElementById('closeMissing2').addEventListener('click',closeMissing);
fileInput.addEventListener('change',async e=>{const f=e.target.files?.[0];if(!f)return;try{if(importCSV(await f.text()))modal.classList.remove('show');fileInput.value=''}catch(err){alert(err.message||'Impossible d’importer ce CSV.');fileInput.value=''}});
modal.addEventListener('click',e=>{if(e.target===modal)modal.classList.remove('show')});
document.getElementById('missingModal').addEventListener('click',e=>{if(e.target.id==='missingModal')closeMissing()});document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeAdd();closeMissing();modal.classList.remove('show')} });
if(IN_PREVIEW){const st=document.getElementById('status');if(st)st.textContent='Preview : recherche de jaquettes désactivée ici.';updateMissingButton()}

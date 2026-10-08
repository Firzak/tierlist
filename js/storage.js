function blankState(){return {games:{},pool:[],tiers:Object.fromEntries(TIER_DEFS.map(x=>[x[0],[]]))}}
function validState(saved){return !!(saved&&saved.games&&Array.isArray(saved.pool)&&saved.tiers&&TIER_DEFS.every(([t])=>Array.isArray(saved.tiers[t])))}
const LEGACY_KEYS=['tierlist_maker_single_v24','tierlist_maker_single_v22','tierlist_maker_single_v21','tierlist_maker_single_v20','tierlist_maker_single_v19','tierlist_maker_single_v18','tierlist_maker_single_v17'];
const CACHE_KEY='tierlist_maker_cover_cache_v1';
const CACHE_VERSION=1;
const CACHE_SUCCESS_TTL=1000*60*60*24*90;
const CACHE_FAILURE_TTL=1000*60*60*6;
function cacheKey(name,type){return norm(name)+'|'+(normType(type)||'other')}
function readCoverCache(){try{const v=JSON.parse(localStorage.getItem(CACHE_KEY)||'null');return v&&v.v===CACHE_VERSION&&v.entries&&typeof v.entries==='object'?v.entries:{}}catch(e){return {}}}
function writeCoverCache(entries){try{const keys=Object.keys(entries);if(keys.length>2500){keys.sort((a,b)=>(entries[a].ts||0)-(entries[b].ts||0));for(const k of keys.slice(0,keys.length-2500))delete entries[k]}localStorage.setItem(CACHE_KEY,JSON.stringify({v:CACHE_VERSION,entries}))}catch(e){}}
function cacheGet(name,type,force=false){const entries=readCoverCache();const item=entries[cacheKey(name,type)];if(!item)return null;const age=Date.now()-(item.ts||0);const ttl=item.found?CACHE_SUCCESS_TTL:CACHE_FAILURE_TTL;if(force&&item.found===false)return null;if(age>ttl){delete entries[cacheKey(name,type)];writeCoverCache(entries);return null}return item}
function cacheSet(name,type,value){const entries=readCoverCache();entries[cacheKey(name,type)]={...value,ts:Date.now()};writeCoverCache(entries)}
function cacheDelete(name,type){const entries=readCoverCache();delete entries[cacheKey(name,type)];writeCoverCache(entries)}
function load(){const keys=[KEY,...LEGACY_KEYS];let fallback=null;for(const k of keys){try{const saved=JSON.parse(localStorage.getItem(k)||'null');if(!validState(saved))continue;if(!fallback)fallback=saved;if(Object.keys(saved.games).length)return saved}catch(e){}}return fallback||blankState()}
function save(){localStorage.setItem(KEY,JSON.stringify(state))}
function esc(s){return String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
function removeEverywhere(id){state.pool=state.pool.filter(x=>x!==id);for(const t of Object.keys(state.tiers))state.tiers[t]=(state.tiers[t]||[]).filter(x=>x!==id)}
function deleteGame(id){const g=state.games[id];if(!g)return;delete state.games[id];removeEverywhere(id);save();render();toast(`${g.name} supprimé de la tier list`)}

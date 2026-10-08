const TIER_DEFS=[['S','#8b5cf6'],['A','#45b85a'],['B','#e1c941'],['C','#f08a24'],['D','#df3f4f']];
const KEY='tierlist_maker_single_v27';
const PUBLIC_READER='https://r.jina.ai/http://';
const STEAM_SEARCH=(q)=>'https://store.steampowered.com/api/storesearch/?term='+encodeURIComponent(q)+'&l=english&cc=US';
const DIRECT_CORS_PREFIXES=['https://openlibrary.org/','https://www.googleapis.com/books/','https://api.tvmaze.com/','https://musicbrainz.org/ws/','https://en.wikipedia.org/','https://commons.wikimedia.org/'];
function isDirectSource(url){return DIRECT_CORS_PREFIXES.some(prefix=>String(url).startsWith(prefix))}
function readerUrl(url){return PUBLIC_READER+String(url).replace(/^https?:\/\//,'https://').replace(/^(?:https?:\/\/)?/,'')}
const IMG_URLS=(id)=>[
  `https://shared.fastly.steamstatic.com/steam/apps/${id}/library_600x900_2x.jpg`,
  `https://shared.fastly.steamstatic.com/steam/apps/${id}/library_600x900.jpg`,
  `https://cdn.cloudflare.steamstatic.com/steam/apps/${id}/library_600x900.jpg`,
  `https://shared.fastly.steamstatic.com/steam/apps/${id}/header.jpg`
];
const SGDB_SEARCH=(q)=>'https://www.steamgriddb.com/search/grids?term='+encodeURIComponent(q);
const WIKI_API=(q)=>'https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch='+encodeURIComponent(q+' video game')+'&gsrnamespace=0&prop=pageimages|info&pithumbsize=500&format=json&origin=*';
let state;
const IN_PREVIEW=window.self!==window.top;

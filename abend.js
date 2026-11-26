// Abend-Rangliste über alle GameMaster-Spiele (MusicBattle-Roadmap «Gemeinsamer Raum über die Spiele», 26.11.2026).
// Eine Quelle für alle Spiele: jedes Spiel lädt <script src="/abend.js"> (gleiche Domain → gleicher localStorage)
// und ruft window.GMAbend.record(...) am Spielende bzw. GMAbend.names() für die Namen auf.
// Alles bleibt auf diesem Gerät. Speicher: localStorage "gm.abend.v1"
//   {v:1, names:[…], started, last, games:[{id, game, at, places:[{name, place}]}]}
// Regeln (Entscheid 26.11.2026): Punkte nach Platz (1. = 3, 2. = 2, 3. = 1, Rest 0; zu zweit Sieger 3, Verlierer 1),
// ein Abend endet nach 6 h ohne neues Spiel oder mit «Neuer Abend». Poker zählt nicht.
(function(root){
  const KEY="gm.abend.v1",GAP=6*60*60*1000,MAX_NAMES=12;
  const GAME_NAMES={"1v1":"Music 1v1",quiz:"Musik-Quiz",tg:"TotalGuesser"};
  const clean=n=>String(n||"").replace(/\s+/g," ").trim().slice(0,30);
  const same=(a,b)=>clean(a).toLocaleLowerCase("de-CH")===clean(b).toLocaleLowerCase("de-CH");

  function empty(now){return{v:1,names:[],started:now,last:0,games:[]}}
  // Gelesenen Stand prüfen; ist der Abend abgelaufen, beginnt ein neuer (Namen bleiben als Vorschlag)
  function normalize(raw,now){
    const s=raw&&raw.v===1&&Array.isArray(raw.games)?raw:empty(now);
    s.names=Array.isArray(s.names)?s.names.map(clean).filter(Boolean).slice(0,MAX_NAMES):[];
    if(s.games.length&&now-Number(s.last||0)>GAP)return{...empty(now),names:s.names};
    return s;
  }
  function points(place,count){
    if(count<2||!(place>=1))return 0;
    if(count===2)return place===1?3:1;
    return Math.max(0,4-place);
  }
  // Rangliste: Punkte, dann Siege, dann Name
  function standings(state){
    const rows=[];
    for(const g of state.games){
      const n=g.places.length;
      for(const p of g.places){
        let r=rows.find(x=>same(x.name,p.name));
        if(!r){r={name:clean(p.name),points:0,wins:0,games:0};rows.push(r)}
        r.points+=points(p.place,n);r.games++;if(p.place===1)r.wins++;
      }
    }
    rows.sort((a,b)=>b.points-a.points||b.wins-a.wins||a.name.localeCompare(b.name,"de-CH"));
    rows.forEach((r,i)=>{r.place=i&&r.points===rows[i-1].points&&r.wins===rows[i-1].wins?rows[i-1].place:i+1});
    return rows;
  }
  // Neue Namen vorne, keine Doppelten (gross/klein egal)
  function mergeNames(list,add){
    const out=[];
    for(const n of [...add,...list]){const c=clean(n);if(c&&!out.some(x=>same(x,c)))out.push(c)}
    return out.slice(0,MAX_NAMES);
  }
  // Ein beendetes Spiel eintragen. id macht es wiederholbar (Neuladen des Endstands zählt nicht doppelt).
  // places: [{name, place}] – Gleichstand = gleicher Platz. Weniger als 2 Personen zählt nicht.
  function addGame(state,game,now){
    const places=(game.places||[]).map(p=>({name:clean(p.name),place:Math.max(1,Math.round(Number(p.place)||1))})).filter(p=>p.name);
    if(!game.id||!GAME_NAMES[game.game]||places.length<2)return state;
    state.names=mergeNames(state.names,places.map(p=>p.name));
    if(state.games.some(g=>g.id===game.id))return state;
    if(!state.games.length)state.started=now;
    state.games.push({id:String(game.id),game:game.game,at:now,places});
    state.last=now;
    return state;
  }

  // ── Speicher (Browser) ──
  function load(){let raw=null;try{raw=JSON.parse(root.localStorage.getItem(KEY)||"null")}catch{}return normalize(raw,Date.now())}
  function save(s){try{root.localStorage.setItem(KEY,JSON.stringify(s))}catch{}}
  const api={
    KEY,GAME_NAMES,points,standings,normalize,addGame,mergeNames,
    load,
    names(){return load().names},
    addNames(list){const s=load();s.names=mergeNames(s.names,list||[]);save(s)},
    record(game){const s=addGame(load(),game,Date.now());save(s);return s},
    reset(){const s=load();save({...empty(Date.now()),names:s.names})},
    // Kurzer Satz fürs Spielende: «Mia +3 · Leo +1»
    summary(places){const n=(places||[]).length;return n<2?"":places.map(p=>`${clean(p.name)} +${points(p.place,n)}`).join(" · ")}
  };
  if(typeof module!=="undefined"&&module.exports)module.exports=api;else root.GMAbend=api;
})(typeof window!=="undefined"?window:globalThis);

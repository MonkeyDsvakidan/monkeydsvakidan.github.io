// node --test (im Repo-Root)
const test=require("node:test"),assert=require("node:assert");
const A=require("../abend.js");
const H=60*60*1000;

test("Punkte nach Platz, zu zweit 3/1",()=>{
  assert.deepStrictEqual([1,2,3,4].map(p=>A.points(p,5)),[3,2,1,0]);
  assert.deepStrictEqual([1,2].map(p=>A.points(p,2)),[3,1]);
  assert.strictEqual(A.points(1,1),0);
});
test("Spiel eintragen, gleiche id zählt nur einmal, Solo zählt nicht",()=>{
  let s=A.normalize(null,0);
  const g={id:"mb:1",game:"1v1",places:[{name:"Mia",place:1},{name:"Leo",place:2}]};
  s=A.addGame(s,g,10);s=A.addGame(s,g,20);
  s=A.addGame(s,{id:"q:1",game:"quiz",places:[{name:"Mia",place:1}]},30);
  assert.strictEqual(s.games.length,1);
  assert.deepStrictEqual(s.names,["Mia","Leo"]);
});
test("Rangliste über Spiele, Namen ohne Gross/Klein",()=>{
  let s=A.normalize(null,0);
  s=A.addGame(s,{id:"a",game:"1v1",places:[{name:"Mia",place:1},{name:"Leo",place:2}]},1);
  s=A.addGame(s,{id:"b",game:"tg",places:[{name:"leo ",place:1},{name:"Mia",place:2},{name:"Ana",place:3}]},2);
  const r=A.standings(s);
  assert.deepStrictEqual(r.map(x=>[x.place,x.name,x.points,x.wins]),[[1,"Mia",5,1],[2,"Leo",4,1],[3,"Ana",1,0]]);
});
test("Gleichstand im Spiel: gleicher Platz, gleiche Punkte",()=>{
  let s=A.addGame(A.normalize(null,0),{id:"x",game:"quiz",places:[{name:"A",place:1},{name:"B",place:1},{name:"C",place:3}]},1);
  assert.deepStrictEqual(A.standings(s).map(x=>[x.place,x.points]),[[1,3],[1,3],[3,1]]);
});
test("Abend endet nach 6 h ohne Spiel, Namen bleiben",()=>{
  let s=A.addGame(A.normalize(null,0),{id:"a",game:"1v1",places:[{name:"Mia",place:1},{name:"Leo",place:2}]},H);
  assert.strictEqual(A.normalize(s,H+5*H).games.length,1);
  const n=A.normalize(s,H+7*H);
  assert.strictEqual(n.games.length,0);assert.deepStrictEqual(n.names,["Mia","Leo"]);
});
test("Unbekanntes Spiel (Poker) wird nicht gezählt",()=>{
  const s=A.addGame(A.normalize(null,0),{id:"p",game:"poker",places:[{name:"A",place:1},{name:"B",place:2}]},1);
  assert.strictEqual(s.games.length,0);
});

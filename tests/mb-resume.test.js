// node --test (im Repo-Root)
const test=require("node:test"),assert=require("node:assert");
const {resumeItem}=require("../mb-resume.js");
const now=Date.parse("2026-11-26T20:00:00Z"),fresh="2026-11-26T19:30:00Z";
const room=(o)=>({code:"ABC123",game:"battle",status:"battle",current_round:3,updated_at:fresh,...o});

test("laufendes Match: Runde und Raumcode",()=>{
  assert.deepStrictEqual(resumeItem(room({}),now),{k:"mb",href:"/MusicBattle/",icon:"#i-glovenote",name:"Music 1v1",detail:"Runde 3 von 5 · Raum ABC123"});
  assert.strictEqual(resumeItem(room({current_round:6}),now).detail,"Sudden Death · Raum ABC123");
  assert.strictEqual(resumeItem(room({status:"draft"}),now).detail,"Draft · Raum ABC123");
  assert.strictEqual(resumeItem(room({status:"lobby"}),now).detail,"Lobby · Raum ABC123");
});
test("Quiz: Frage oder Lobby",()=>{
  const q=resumeItem(room({game:"quiz",status:"quiz",quiz_question_no:4,quiz_length:15}),now);
  assert.strictEqual(q.name,"Musik-Quiz");assert.strictEqual(q.detail,"Frage 4 von 15 · Raum ABC123");
  assert.strictEqual(resumeItem(room({game:"quiz",status:"lobby"}),now).detail,"Lobby · Raum ABC123");
});
test("beendet, geschlossen, zu alt oder nicht gefunden: nichts anbieten",()=>{
  assert.strictEqual(resumeItem(room({status:"finished"}),now),null);
  assert.strictEqual(resumeItem(room({status:"closed"}),now),null);
  assert.strictEqual(resumeItem(room({updated_at:"2026-11-25T18:00:00Z"}),now),null);
  assert.strictEqual(resumeItem(null,now),null);
});

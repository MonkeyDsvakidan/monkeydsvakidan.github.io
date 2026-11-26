// Weiterspielen für Music Battle (MusicBattle-Roadmap U.5, 26.11.2026).
// Music Battle merkt sich den offenen Raum in localStorage "mb_online_room" – ob er noch läuft, weiss nur die Datenbank.
// Die Startseite liest den Raum mit der Anmeldung, die Music Battle auf diesem Gerät schon hat (gleiche Domain →
// gleicher Supabase-Speicher). Sie meldet niemanden neu an: ohne gespeicherte Anmeldung gibt es nichts weiterzuspielen.
// Lesen erlaubt die bestehende RLS-Regel mb_rooms_select_member (nur Räume, in denen man Mitglied ist).
(function(root){
  const SB_URL="https://swgraidbdxpjqnvxacpq.supabase.co";
  const SB_KEY="sb_publishable_FsDT7WlBD5LJs2PPgkW0ww_BotUc0eX"; // öffentlicher Schlüssel (wie in Music Battle)
  const SB_SESSION="sb-swgraidbdxpjqnvxacpq-auth-token";
  const MAX_IDLE=24*60*60*1000; // Räume ohne Änderung seit 24 h nicht mehr anbieten

  // Raumzeile → Eintrag für «Weiterspielen», oder null (beendet, geschlossen, zu alt)
  function resumeItem(room,now){
    if(!room||!["battle","quiz"].includes(room.game))return null;
    if(["finished","closed"].includes(room.status))return null;
    const t=Date.parse(room.updated_at);if(Number.isFinite(t)&&now-t>MAX_IDLE)return null;
    const quiz=room.game==="quiz",r=Number(room.current_round)||0;
    const step=quiz
      ?(room.status==="quiz"&&room.quiz_question_no?`Frage ${room.quiz_question_no} von ${room.quiz_length||10}`:"Lobby")
      :room.status==="lobby"?"Lobby"
      :room.status==="draft"||room.status==="sudden_draft"?"Draft"
      :room.status==="tiebreak"?"Entscheidung"
      :r===6?"Sudden Death":r?`Runde ${r} von 5`:"Battle";
    return{k:quiz?"quiz":"mb",href:"/MusicBattle/",icon:quiz?"#i-buzzernote":"#i-glovenote",
      name:quiz?"Musik-Quiz":"Music 1v1",detail:`${step} · Raum ${room.code}`};
  }

  function loadScript(src){return new Promise((ok,fail)=>{const s=document.createElement("script");s.src=src;s.onload=ok;s.onerror=fail;document.head.append(s)})}

  // Nur wenn ein Raum und eine Anmeldung auf dem Gerät liegen, wird supabase-js geladen
  async function load(){
    let saved=null,hasSession=false;
    try{saved=JSON.parse(localStorage.getItem("mb_online_room")||"null");hasSession=!!localStorage.getItem(SB_SESSION)}catch{return null}
    if(!saved||!saved.room_id||!hasSession)return null;
    try{
      if(!root.supabase)await loadScript("https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"); // gleiche Version wie Music Battle
      const sb=root.supabase.createClient(SB_URL,SB_KEY,{auth:{detectSessionInUrl:false}});
      const {data:{session}}=await sb.auth.getSession();if(!session)return null;
      const {data}=await sb.from("mb_rooms").select("code,game,status,current_round,quiz_length,quiz_question_no,updated_at").eq("id",saved.room_id).maybeSingle();
      return resumeItem(data,Date.now());
    }catch{return null}
  }

  const api={resumeItem,load};
  if(typeof module!=="undefined"&&module.exports)module.exports=api;else root.MBResume=api;
})(typeof window!=="undefined"?window:globalThis);

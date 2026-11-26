# CLAUDE.md – GameMaster (monkeydsvakidan.github.io)

Startseite der Spiel-App **«GameMaster»** auf `https://monkeydsvakidan.github.io/`. Hier liegen nur Startseite, gemeinsames App-Symbol und Manifest. Die Spiele bleiben in eigenen Repos (Entscheidung M, «Weg B»):

| Eintrag | Ziel | Repo |
|---|---|---|
| Music 1v1 | `/MusicBattle/?mode=1v1` (öffnet die 1v1-Startseite, auch wenn zuletzt das Quiz gewählt war) | MusicBattle |
| Musik-Quiz | `/MusicBattle/?mode=quiz` (öffnet direkt die Quiz-Startseite; Parameter seit MusicBattle 8.2) | MusicBattle |
| TotalGuesser | `/TotalGuesser/` | TotalGuesser |
| Poker | `/PokerFriends/` (Spielleiter für Texas Hold'em mit echten Chips, seit 26.11.2026) | PokerFriends |
| Tools | klappt auf: `/MusicBattle/?tool=alben` (Alben-Fix), `/MusicBattle/?tool=rad` (Albumrad); `/#tools` öffnet direkt | MusicBattle |

Planung und Entscheidungen stehen in `ROADMAP.md` (Phase 8) im Repo **MusicBattle** – dort Aufgaben abhaken und neue eintragen. Vorlage für Icons und Farben: `design/gamemaster-muster.html` im Repo MusicBattle.

## Neues Spiel in GameMaster einbauen (Checkliste)
Die «GameMaster-Leiste» ist die Navigation unten in jedem Spiel (`<nav class="gmbar" id="gmBar">`). Sie ist **in jedem Spiel-Repo einzeln** eingebaut (kein gemeinsamer Code). Für ein neues Spiel `X` unter `/X/` diese Stellen anpassen – je Repo ein Pull Request:

| Repo | Datei | Was |
|---|---|---|
| neues Spiel | eigenes Repo **öffentlich** (GitHub Pages gratis nur so), Pages «Deploy from a branch» `main` / root | Ordnername = Repo-Name = Pfad `/X/` (Gross-/Kleinschreibung zählt) |
| neues Spiel | `index.html` | `<link rel="manifest" href="/manifest.webmanifest">`, `apple-mobile-web-app-title` «GameMaster», Icons `/icon.svg` und `/icon-180.png`, Maske oben links als Link auf `/`, Leiste mit allen Einträgen, eigener Eintrag mit `aria-current="page"` (Vorlage: `index.html` und `.gmbar`-CSS im Repo PokerFriends) |
| monkeydsvakidan.github.io | `index.html`, `styles.css` | Kachel mit Vorschau im Stil des Spiels, Icon als `<symbol>`, Spielfarbe als Token (`--pk` usw.), `?v=` erhöhen; Tabelle oben in dieser Datei ergänzen; Beschreibung in `manifest.webmanifest` |
| MusicBattle | `index.html` | `<symbol id="gm-…">` und `<a … data-k="…">` in `#gmBar` |
| MusicBattle | `styles.css` | `.gmbar` Spaltenzahl `repeat(N,…)`, Token `--gm-…`, Zeile `.gmbar [data-k="…"]{--act:…}` |
| MusicBattle | `js/ui-common.js` → `bindGameBar` | neuen Schlüssel in die Liste der **anderen Seiten** aufnehmen (`["tg","poker","tools"]`), sonst behandelt Music Battle den Klick als Wechsel 1v1 ↔ Quiz |
| MusicBattle | `app.js` `BUILD` + `?v=` in `index.html` | erhöhen (Cache) |
| TotalGuesser | `web/src/components/GameBar.tsx` | Eintrag in `ITEMS` (Icon als JSX) |
| TotalGuesser | `web/src/index.css` | `.gmbar` Spaltenzahl `repeat(N,…)` |
| alle bestehenden Spiele mit Leiste | wie oben | auch PokerFriends (`index.html` + `styles.css`) bekommt den neuen Eintrag |

Schnell finden: in allen Repos nach `gmbar` bzw. `gmBar` suchen. Prüfen: Leiste bei 360 px in jedem Spiel ansehen (Platz für alle Einträge, aktiver Eintrag in der Spielfarbe). Ab ca. 6 Einträgen wird es auf dem Handy eng – dann zuerst mit dem Nutzer eine andere Lösung besprechen (z. B. «Mehr»-Eintrag).

Spielfarben bisher: Music 1v1 Pink `#ff3fa4`, Musik-Quiz Gold `#ffd166`, TotalGuesser Orange `#ff8a3d`, Poker Mint `#3ddc97`, Tools neutral `#c9c4d3`.

## Warum das Repo öffentlich ist
GitHub Pages (Gratis-Plan) geht nur mit öffentlichen Repos. Ausdrücklich vom Nutzer erlaubt (Ausnahme von «neue Repos privat»). Deshalb: **nie Geheimnisse hier ablegen** – die Seite braucht keine (kein Spotify; für «Weiterspielen» liest sie mit dem öffentlichen Supabase-Schlüssel nur den eigenen Music-Battle-Raum, siehe unten).

## Manifest und installierte App
- `manifest.webmanifest`: `id` und `scope` = `/` (ganze Domain). Dadurch bleiben `/MusicBattle/` und `/TotalGuesser/` im selben App-Fenster.
- Die Spiele haben noch eigene Manifeste (`scope` = ihr Ordner). Damit «Zum Home-Bildschirm» auch aus einem Spiel heraus GameMaster installiert, müssen sie auf `/manifest.webmanifest` zeigen (MusicBattle-Roadmap 8.3/8.4).
- iPhone: Eine Home-Bildschirm-App hat einen eigenen Speicher (getrennt von Safari und von anderen Home-Bildschirm-Apps). Wer GameMaster neu installiert, meldet sich darin einmal neu bei Spotify an.

## Tech und Regeln
- Statisches HTML/CSS, kein Build-Step, kein Framework. Push auf `main` = live (GitHub Pages, «Deploy from a branch», `main` / root).
- Änderungen als Pull Request, nicht direkt auf `main`.
- Pfade immer absolut (`/styles.css`, `/icon-180.png`), weil `404.html` unter beliebigen Adressen ausgeliefert wird.
- Nach CSS-Änderungen `?v=` in `index.html` und `404.html` erhöhen.
- Es gelten die Skills **webseiten-check** (Teil A Design, Teil C Sicherheit – privates Projekt), **ponytail**, bei Design **unslop**.

## Design-Brief
- Zielgruppe: Aladin und Freunde, vor allem am Handy. Ton: kurz, locker, Deutsch (Schweiz, «ss»).
- Nur dunkel. Tokens oben in `styles.css`: Grund `#121115`, Text `#f3f1f6`, gedämpft `#a9a5b3`, Linien weiss 9 %.
- Aufbau: Hintergrund ist ein blasses Muster aus der Maske (`muster.svg`, gleiche Formen wie `icon.svg`, Deckkraft 5 %), oben gross der Schriftzug «GameMaster», darunter je Eintrag eine Kachel: oben ein **Vorschaufenster** im Stil des Spiels (Ausschnitt mit Beispieldaten, `aria-hidden`; Tools: Screenshot aus dem Albumrad `tools-vorschau.jpg` – enthält echte Album-Cover), unten Icon, Name und ein Satz. Handy eine Spalte, ab 760 px zwei. Auf dem Handy sind die Vorschauen niedriger (112 statt 168 px, Nebenzeilen ausgeblendet), damit mehr Spiele sichtbar sind.
- **Weiterspielen** (MusicBattle-Roadmap U.4): Über den Kacheln erscheint eine kurze Liste, wenn auf diesem Gerät ein Spiel offen ist. Gelesen werden `totalguesser.game` (nicht angezeigt, wenn die Auflösung fertig ist) und `poker-spielleiter-v1` (`game.ended` = fertig). **Music Battle** (MusicBattle-Roadmap U.5, `/mb-resume.js`): liegen `mb_online_room` und die Supabase-Anmeldung von Music Battle (`sb-swgraidbdxpjqnvxacpq-auth-token`, gleiche Domain) auf dem Gerät, lädt die Seite supabase-js und liest den Raum aus `mb_rooms` (bestehende RLS-Regel: nur Mitglieder). Angeboten wird er nur, wenn er weder `finished` noch `closed` ist und sich in den letzten 24 h etwas geändert hat (`updated_at`); er steht dann zuoberst. Die Seite meldet niemanden neu an (keine neuen anonymen Konten). Ändert ein Spiel sein Speicherformat oder Music Battle die Spalten/Status von `mb_rooms`, hier nachziehen; Tests: `tests/mb-resume.test.js`.
- **Abend-Rangliste** (MusicBattle-Roadmap «Gemeinsamer Raum über die Spiele», Entscheid 26.11.2026): Karte «Heute Abend» über den Kacheln, sobald auf diesem Gerät ein Spiel mit 2+ Personen beendet wurde. Gemeinsamer Code für alle Spiele in **`/abend.js`** (`window.GMAbend`, Speicher `localStorage` `gm.abend.v1`): Spiele rufen am Ende `GMAbend.record({id, game, places:[{name, place}]})` auf (`game` = `1v1`, `quiz`, `tg`; gleiche `id` zählt nur einmal; Poker zählt nicht) und holen die Namen der Gruppe (`GMAbend.names()` bzw. `load().games` → Plätze des letzten Spiels; so machen es TotalGuesser und Poker). Punkte nach Platz: 1. = 3, 2. = 2, 3. = 1, Rest 0; zu zweit 3/1. Ein Abend endet nach 6 h ohne beendetes Spiel oder mit «Neuer Abend» (Namen bleiben). Format nur hier ändern und die Spiele nachziehen; Tests: `node --test` im Repo-Root (`tests/abend.test.js`).
- Spielfarben für Icon und Fokus des Eintrags: Music 1v1 Pink `#ff3fa4`, Musik-Quiz Gold `#ffd166`, TotalGuesser Orange `#ff8a3d`, Poker Mint `#3ddc97`, Tools neutral `#c9c4d3`. Die Vorschauen nutzen die Farben und Schriften der Spiele selbst (Music 1v1 «Titelkampf bei Nacht», Quiz «Quizshow-Studio», TotalGuesser «Hallenparkett», Poker «Kartentisch bei Nacht») – bei Änderungen am Look eines Spiels hier nachziehen.
- Schriften: Barlow (Text), Barlow Condensed (Titel); in den Vorschauen zusätzlich Bungee und Sedgwick Ave wie in den Spielen. Icons: eigene Linien-SVGs (Strich 1.75) aus der Musterseite.
- Abstände 4/8/12/16/24/32/48, Radien 8/14.

## App-Symbol
`icon.svg` ist die Vorlage (auch Favicon): eigene Spielleiter-Maske mit Narrenkappe, Zipfel in Pink/Gold/Orange (Spielfarben), Schellen neutral – bewusst keine bestehende Figur nachbilden. Die Maske füllt das Symbol fast ganz (iPhone schneidet nur die Ecken ab). Für Android gibt es `icon-maskable.svg` → `icon-maskable-512.png` mit Rand: dort bleibt alles im inneren 80-%-Kreis, weil Android das Symbol rund oder anders zuschneiden kann. PNGs neu rendern (Playwright vorhanden; für die Android-Variante `icon-maskable.svg` → `icon-maskable-512.png`):
```
node -e 'const {chromium}=require("playwright");(async()=>{const b=await chromium.launch(),s=require("fs").readFileSync("icon.svg","utf8");for(const n of [180,192,512]){const p=await b.newPage({viewport:{width:n,height:n}});await p.setContent(`<style>html,body{margin:0}svg{display:block;width:${n}px;height:${n}px}</style>`+s);await p.screenshot({path:`icon-${n}.png`})}await b.close()})()'
```

## Testen
`node --test` (Abend-Rangliste). Lokal: `python3 -m http.server 8000` im Repo-Root, dann `http://localhost:8000/` bei 375 px und 1280 px ansehen, `/#tools` (Tools offen), `/404.html`. Die Links zu den Spielen funktionieren erst live.

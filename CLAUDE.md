# CLAUDE.md – GameMaster (monkeydsvakidan.github.io)

Startseite der Spiel-App **«GameMaster»** auf `https://monkeydsvakidan.github.io/`. Hier liegen nur Startseite, gemeinsames App-Symbol und Manifest. Die Spiele bleiben in eigenen Repos (Entscheidung M, «Weg B»):

| Eintrag | Ziel | Repo |
|---|---|---|
| Music 1v1 | `/MusicBattle/` | MusicBattle |
| Musik-Quiz | `/MusicBattle/?mode=quiz` (öffnet direkt die Quiz-Startseite; Parameter seit MusicBattle 8.2) | MusicBattle |
| TotalGuesser | `/TotalGuesser/` | TotalGuesser |
| Tools | klappt auf: `/MusicBattle/?tool=alben` (Alben-Fix), `/MusicBattle/?tool=rad` (Albumrad); `/#tools` öffnet direkt | MusicBattle |

Planung und Entscheidungen stehen in `ROADMAP.md` (Phase 8) im Repo **MusicBattle** – dort Aufgaben abhaken und neue eintragen. Vorlage für Icons und Farben: `design/gamemaster-muster.html` im Repo MusicBattle.

## Warum das Repo öffentlich ist
GitHub Pages (Gratis-Plan) geht nur mit öffentlichen Repos. Ausdrücklich vom Nutzer erlaubt (Ausnahme von «neue Repos privat»). Deshalb: **nie Geheimnisse hier ablegen** – die Seite braucht keine (kein Supabase, kein Spotify).

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
- Spielfarben nur für das Icon des Eintrags: Music 1v1 Pink `#ff3fa4`, Musik-Quiz Gold `#ffd166`, TotalGuesser Orange `#ff8a3d`, Tools neutral `#c9c4d3`.
- Schriften: Barlow (Text), Barlow Condensed (Titel). Icons: eigene Linien-SVGs (Strich 1.75) aus der Musterseite.
- Abstände 4/8/12/16/24/32/48, Radien 8/14.

## App-Symbol
`icon.svg` ist die Vorlage (auch Favicon): eigene Spielleiter-Maske mit Narrenkappe, Zipfel in Pink/Gold/Orange (Spielfarben), Schellen neutral – bewusst keine bestehende Figur nachbilden. Inhalt bleibt im inneren 80-%-Kreis (gilt auch als «maskable» für Android). PNGs neu rendern (Playwright vorhanden):
```
node -e 'const {chromium}=require("playwright");(async()=>{const b=await chromium.launch(),s=require("fs").readFileSync("icon.svg","utf8");for(const n of [180,192,512]){const p=await b.newPage({viewport:{width:n,height:n}});await p.setContent(`<style>html,body{margin:0}svg{display:block;width:${n}px;height:${n}px}</style>`+s);await p.screenshot({path:`icon-${n}.png`})}await b.close()})()'
```

## Testen
Lokal: `python3 -m http.server 8000` im Repo-Root, dann `http://localhost:8000/` bei 375 px und 1280 px ansehen, `/#tools` (Tools offen), `/404.html`. Die Links zu den Spielen funktionieren erst live.

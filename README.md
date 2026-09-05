# Kräftskiva 🦞

Ett litet sånghäfte som SPA — byggt med Vite + React + TypeScript. Kan
deployas både som Docker-container med nginx (t.ex. på en NAS) och till
GitHub Pages.

## Lägga till en visa

Skapa en fil i `src/data/songs/` med ett slug-namn — filnamnet blir visans
URL (`min-visa.json` → `/visa/min-visa`):

```json
{
  "title": "Min visa",
  "category": "Snapsvisa",
  "melody": "Mel: Blinka lilla stjärna",
  "author": "Trad.",
  "lyrics": "Första raden\nAndra raden\n\nAndra versen börjar här"
}
```

Bara `title` och `lyrics` krävs. Verser separeras med en tom rad (`\n\n`), och
texten renderas exakt som den står. Appen plockar upp nya filer automatiskt —
ingen kod behöver ändras, bara bygg om.

De fyra visor som ligger i repot nu är platshållare.

## Utveckling

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # typkoll + produktionsbygge till dist/
npm run preview  # servera dist/ lokalt
npm run lint
```

## Köra på GitHub Pages

`.github/workflows/deploy-pages.yml` bygger och publicerar automatiskt vid push
till repots default-branch (och går att köra manuellt via *Actions →
Deploy to GitHub Pages → Run workflow*).

Engångsinställning: **Settings → Pages → Source: GitHub Actions**.

Sajten hamnar på `https://<användare>.github.io/kraftskiva/`. Bygget sätter
`BASE_PATH` från Pages-konfigurationen, så subpathen fungerar utan att något
behöver hårdkodas — och samma kod bygger fortfarande mot `/` för Docker.

Pages saknar rewrite-regler, så workflowet kopierar `index.html` till `404.html`.
Det gör att djuplänkar som `/kraftskiva/visa/helan-gar` renderar rätt visa
(sidan levereras tekniskt med HTTP 404, vilket bara syns i devtools).

## Köra på NAS med Docker

```bash
docker compose up -d --build
```

Appen ligger sedan på `http://<nas-ip>:8080`. Byt port i `docker-compose.yml`
om 8080 är upptagen.

Efter att du lagt till nya visor: kör `docker compose up -d --build` igen.

Vill du hellre bygga imagen någon annanstans och flytta över den:

```bash
docker build -t kraftskiva:latest .
docker save kraftskiva:latest | gzip > kraftskiva.tar.gz
# på NAS:en
gunzip -c kraftskiva.tar.gz | docker load
docker run -d --name kraftskiva -p 8080:80 --restart unless-stopped kraftskiva:latest
```

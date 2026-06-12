# Brain link

Questo repo è documentato in `~/brain/Wiki/Progetti/francoislampasona-it/`
(= `~/Desktop/Second Brain/Wiki/Progetti/francoislampasona-it/`).

## Inizio sessione (SEMPRE, prima di qualsiasi azione)
Leggi in ordine:
1. ~/brain/Wiki/Progetti/francoislampasona-it/index.md (vision)
2. ~/brain/Wiki/Progetti/francoislampasona-it/stato.md (dove siamo ora)
3. ~/brain/Wiki/Progetti/francoislampasona-it/riprendi.md (da dove ripartire)
4. ~/brain/Wiki/Progetti/francoislampasona-it/architettura.md (se il task è non banale)

Poi chiedi all'utente: "Pronto, riprendiamo dal primo task di riprendi.md,
o hai altro in mente?"

## Fine sessione (quando l'utente dice "fine sessione" / "chiudiamo qui" / "handoff")
Esegui in ordine, senza chiedere conferma:
1. Sovrascrivi ~/brain/Wiki/Progetti/francoislampasona-it/stato.md con lo stato attuale
2. Sovrascrivi ~/brain/Wiki/Progetti/francoislampasona-it/riprendi.md con la todo prioritizzata
   (path:riga dove possibile, blockers, domande)
3. Crea ~/brain/Fonti/Giornalieri/YYYY-MM-DD-francoislampasona-it.md con il log narrativo
4. In ~/brain: git add -A && git commit -m "francoislampasona-it: sessione YYYY-MM-DD" && git push
5. In questo repo: git add -A && git commit -m "..." && git push

## ADR opportunistici
Se durante la sessione emerge una decisione architetturale significativa, creala
subito in ~/brain/Wiki/Progetti/francoislampasona-it/Decisioni/YYYY-MM-DD-verbo-al-passato.md
anziché aspettare la fine sessione.

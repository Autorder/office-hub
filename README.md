# Office Hub

Front-end prototype for the AI Engineer Core Track final project: a document
routing and work queue for a small office.

**Live:** https://autorder.github.io/office-hub/

Documents, web-form enquiries and email all enter one pipeline. An AI model
extracts nine business fields and judges its own confidence; a rules table —
not the model — decides which person receives the item; a task is created in
their name and a notification is sent. Anything the model was unsure about is
flagged for review rather than dropped.

## Status

Screens only. Every screen reads mock data shaped exactly like the Supabase
tables that will replace it, so the schema is a transcription of what is on
screen rather than a second design. The `Flow` screen is the build
specification for the n8n workflows.

Nothing here calls a network. There are no keys and no live data.

## Screens

| Screen | What it shows |
|---|---|
| Flow | One item through all eleven stages, each card naming the n8n node |
| Inbox | Every item, any channel, with the extracted fields |
| Needs review | What the model was unsure about, and why |
| Tasks | The `tasks` table DailyTask AI reads, grouped by owner |
| Emails | The urgent and normal templates, rendered with real values |
| People | Roles, departments, absences and backups — this feeds the routing |
| Rules | The routing table, plus a simulator that answers "who would get this?" |
| Dashboard | Counts and per-person load |

## Build

`index.html` is generated and self-contained. Edit the sources in `src/`,
then:

```
python3 build.py           # rebuild index.html
python3 build.py --check   # fail if index.html is stale
```

A single file is deliberate: GitHub Pages, `file://` and embedded viewers all
serve one HTML document reliably, and a sibling script that fails to load
produces a blank page with no error.

## Related

- [dailytask-ai](https://github.com/Autorder/dailytask-ai) — exercise 4; shares the `tasks` table
- [course-enquiry](https://github.com/Autorder/course-enquiry) — the web form that becomes the second intake channel

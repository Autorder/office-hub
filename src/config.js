/* Office Hub — connection settings.
 *
 * Both values below are meant to be public. The publishable key ships to
 * every browser that opens the page; Row Level Security is what protects the
 * data, not secrecy about the key.
 *
 * Never put the service_role key or the database password here. Those belong
 * in n8n, which runs on a server. If one ever appears in this file, rotate it
 * in the Supabase dashboard — it is on GitHub Pages the moment it is pushed.
 *
 * Leave SUPABASE_URL empty to force the demo dataset.
 */

window.OFFICE_HUB_CONFIG = {

  SUPABASE_URL: "https://dljqfccjqtrrhzjdzyhu.supabase.co",

  SUPABASE_PUBLISHABLE_KEY: "sb_publishable_O3XvaR9Nv_t4dwFycPXIyQ_uby6ctCK",

  /* WF-5 in n8n. The Reset button posts here; n8n does the deleting with its
     own service-role credential, so the browser never holds the power to
     erase anything by itself.

     Used when the page is served from autorder.github.io. An https page
     cannot call http, so this has to be the server and not localhost.

     This was an ngrok tunnel until n8n moved onto a VPS. The tunnel's URL
     changed on every restart and it died whenever the laptop slept; the
     duckdns host is fixed and the certificate is Let's Encrypt.

     Leave empty to hide the Reset button entirely. */
  N8N_RESET_WEBHOOK_URL: "https://autorder-n8n.duckdns.org/webhook/office-reset",

  /* Used instead when the page is opened on localhost, so resetting works
     with no tunnel running. */
  N8N_RESET_WEBHOOK_URL_LOCAL: "http://localhost:5678/webhook/office-reset",

  /* WF-6 in n8n. The Scan button posts here. WF-1 only reacts to files that
     arrive after it started polling, so anything already sitting in Office
     Inbox - or dropped while n8n was down - would never be picked up. This
     is the manual sweep: list the folder, process whatever is in it.

     Same host rule as above: the server for the published page, localhost
     for the local one. Leave empty to hide the Scan button entirely. */
  N8N_SCAN_WEBHOOK_URL: "https://autorder-n8n.duckdns.org/webhook/office-scan",

  N8N_SCAN_WEBHOOK_URL_LOCAL: "http://localhost:5678/webhook/office-scan",

  /* WF-7 in n8n. The rules editor posts here - create, update and delete.

     The browser does not write to routing_rules itself, and the reason is the
     key three lines above this one: it is public, so a page that could edit a
     routing rule would let anyone who opens the URL decide where invoices go.
     WF-7 holds the service credential, validates every field, and refuses to
     delete the last catch-all.

     Leave empty to make the Rules screen read-only. */
  N8N_RULES_WEBHOOK_URL: "https://autorder-n8n.duckdns.org/webhook/office-rules",

  N8N_RULES_WEBHOOK_URL_LOCAL: "http://localhost:5678/webhook/office-rules",

  /* WF-8 in n8n. The people editor posts here - add, edit, set leave, remove.

     Same reason as WF-7. Editing `people` is if anything the more dangerous of
     the two: change an email address and the work is still assigned, the task
     is still created, and the notification goes to a stranger.

     Leave empty to make the People screen read-only. */
  N8N_PEOPLE_WEBHOOK_URL: "https://autorder-n8n.duckdns.org/webhook/office-people",

  N8N_PEOPLE_WEBHOOK_URL_LOCAL: "http://localhost:5678/webhook/office-people",

  /* WF-9 in n8n. The departments editor posts here.

     A department is a slot in the dept_name enum plus a row saying what it is
     called. Only the row is editable - adding a slot needs ALTER TYPE, which
     is exactly the thing this indirection exists to stop needing.

     Leave empty to make the Departments table read-only. */
  N8N_DEPTS_WEBHOOK_URL: "https://autorder-n8n.duckdns.org/webhook/office-departments",

  N8N_DEPTS_WEBHOOK_URL_LOCAL: "http://localhost:5678/webhook/office-departments"

};

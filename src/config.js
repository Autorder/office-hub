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
     cannot call http, so this has to be the tunnel and not localhost.
     ngrok free URLs change on every restart - update the host when it does.

     Leave empty to hide the Reset button entirely. */
  N8N_RESET_WEBHOOK_URL: "https://playing-twig-evergreen.ngrok-free.dev/webhook/office-reset",

  /* Used instead when the page is opened on localhost, so resetting works
     with no tunnel running. */
  N8N_RESET_WEBHOOK_URL_LOCAL: "http://localhost:5678/webhook/office-reset",

  /* WF-6 in n8n. The Scan button posts here. WF-1 only reacts to files that
     arrive after it started polling, so anything already sitting in Office
     Inbox - or dropped while n8n was down - would never be picked up. This
     is the manual sweep: list the folder, process whatever is in it.

     Same host rule as above: tunnel for the published page, localhost for
     the local one. Leave empty to hide the Scan button entirely. */
  N8N_SCAN_WEBHOOK_URL: "https://playing-twig-evergreen.ngrok-free.dev/webhook/office-scan",

  N8N_SCAN_WEBHOOK_URL_LOCAL: "http://localhost:5678/webhook/office-scan"

};

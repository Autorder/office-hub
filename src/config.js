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

  SUPABASE_PUBLISHABLE_KEY: "sb_publishable_O3XvaR9Nv_t4dwFycPXIyQ_uby6ctCK"

};

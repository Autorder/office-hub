/* Office Hub - screen renderers. Core logic and i18n live in core.js. */

"use strict";

var SCREENS = [
  { id:"flow",   key:"navFlow",   render:function(){ return renderFlow(); },   count:null },
  { id:"inbox",  key:"navInbox",  render:function(){ return renderInbox(); },
    count:function(){ return db.documents().length; } },
  { id:"review", key:"navReview", render:function(){ return renderReview(); },
    count:function(){ return db.documents().filter(function(d){ return d.status === "needs_review"; }).length; } },
  { id:"tasks",  key:"navTasks",  render:function(){ return renderTasks(); },
    count:function(){ return db.tasks().filter(function(t){ return t.status !== "done"; }).length; } },
  { id:"emails", key:"navEmails", render:function(){ return renderEmails(); },
    count:function(){ return db.notifications().length; } },
  { id:"people", key:"navPeople", render:function(){ return renderPeople(); },
    count:function(){ return db.people().length; } },
  { id:"rules",  key:"navRules",  render:function(){ return renderRules(); },
    count:function(){ return db.routingRules().length; } },
  { id:"dash",   key:"navDash",   render:function(){ return renderDash(); },   count:null }
];

function head(titleKey, subKey, extra){
  return '<div class="head"><h2>' + esc(t(titleKey)) + '</h2>'
       + (extra || "") + '</div><p class="sub">' + esc(t(subKey)) + '</p>';
}
function panel(inner){ return '<div class="panelwrap"><div class="tblwrap">' + inner + '</div></div>'; }

/* Reachable now that a live database may legitimately hold no documents —
 * right after a reset, which is the state the demo starts from. The screens
 * that pick a single document to walk through have nothing to pick. */
function emptyState(){
  return '<div class="card pad"><b>' + esc(t("emptyTitle")) + '</b>'
       + '<div class="dim" style="margin-top:6px">' + esc(t("emptyBody")) + '</div></div>';
}
function docPicker(sel, handler){
  return '<select onchange="' + handler + '(this.value)">' + db.documents().map(function(d){
    return '<option value="' + d.id + '"' + (d.id === sel ? ' selected' : '') + '>'
         + esc(ltr(d.file_name)) + '</option>';
  }).join("") + '</select>';
}

/* ================================================================ flow == */

function stage(n, node, wf, active, inner){
  return '<div class="stage' + (active ? " act" : " skip") + '">'
    + '<div class="stagehd"><span class="stepn">' + n + '</span><b>' + esc(node) + '</b>'
    + '<span class="wf">' + esc(wf) + '</span></div>' + inner + '</div>';
}
function conn(){ return '<div class="conn"></div>'; }

function renderFlow(){
  var d = byId(db.documents(), state.flowDoc) || db.documents()[0];
  if (!d) return head("flowH", "flowSub") + emptyState();
  var rules = db.routingRules();
  var trace = routeTrace(rules, { channel:d.channel, document_type:d.document_type,
    department:d.department, urgency:d.urgency, amount:d.amount });
  var winner = trace[trace.length - 1];
  var res = winner.matched ? resolvePerson(winner.rule.assign_to, today()) : null;
  var task = d.task_id ? byId(db.tasks(), d.task_id) : null;
  var mail = emailFor(d);
  var isDrive = d.channel === "drive";

  var h = head("flowH", "flowSub")
    + '<div class="toolbar" style="border-radius:12px;border:1px solid var(--rule);margin-bottom:16px">'
    + docPicker(d.id, "setFlowDoc")
    + '<span class="pill">' + esc(t(d.channel)) + '</span>' + statusPill(d.status) + '</div>';

  /* A Drive file carries no record of which of the two intakes read it - both
   * use the Drive id as source_ref, which is the point. Naming both is honest;
   * naming one would be a guess. */
  h += stage(1, t("st1" + d.channel), isDrive ? "WF-1 · WF-6" : d.channel === "form" ? "WF-2" : "WF-3", true,
      '<dl class="kv"><dt>' + esc(t("whatFired")) + '</dt><dd>' + esc(t("fired" + d.channel.charAt(0).toUpperCase() + d.channel.slice(1))) + '</dd>'
    + '<dt>' + esc(t("sourceRef")) + '</dt><dd class="mono dim">' + esc(ltr(d.source_ref)) + '</dd>'
    + '<dt>' + esc(t("received")) + '</dt><dd class="num">' + fmtWhen(d.received_at) + '</dd></dl>');

  h += conn() + stage(2, isDrive ? t("st2drive") : t("st2other"), "WF-1..3, WF-6", true,
      '<div class="dim">' + esc(isDrive ? t("st2driveB") : t("st2otherB")) + '</div>');

  h += conn() + stage(3, t("st3"), "WF-1..3, WF-6", true,
      /* dir="ltr" is load-bearing. This is a code listing, and in an RTL
       * paragraph the two latin runs on each line are placed right-to-left
       * relative to one another: "source_ref = 1vav6Bx" reads back as
       * "1vav6Bx = source_ref". Isolating the value made it worse, not better,
       * because an isolate is what turns the value into a reorderable unit. */
      '<div class="mono dim" dir="ltr" style="line-height:1.9;text-align:start">'
    + 'channel = ' + esc(d.channel) + '<br>'
    + 'source_ref = ' + esc(ltr(d.source_ref)) + '<br>'
    + 'file_name = ' + esc(ltr(d.file_name)) + '<br>'
    + 'file_link = ' + (d.file_link ? esc(d.file_link) : '<span class="dim3">' + esc(t("emptyVal")) + '</span>') + '<br>'
    + 'text = <span class="dim3">' + esc(t("theBody")) + '</span></div>'
    + '<div class="dim3" style="font-size:12.5px;margin-top:9px">' + esc(t("st3note")) + '</div>');

  h += conn() + stage(4, t("st4"), "WF-4", true,
      '<dl class="kv">'
    + '<dt>document_type</dt><dd><span class="pill">' + esc(t(d.document_type)) + '</span></dd>'
    + '<dt>sender_or_company</dt><dd>' + nf(d.sender_or_company) + '</dd>'
    + '<dt>summary</dt><dd>' + txt(d.summary) + '</dd>'
    + '<dt>requested_action</dt><dd>' + nf(d.requested_action) + '</dd>'
    + '<dt>deadline</dt><dd>' + nf(d.deadline_text) + '</dd>'
    + '<dt>urgency</dt><dd>' + urgPill(d.urgency) + '</dd>'
    + '<dt>department</dt><dd>' + esc(t(d.department)) + '</dd>'
    + '<dt>amount</dt><dd>' + (d.amount != null ? '<span class="num">' + money(d.amount) + '</span>' : nf(null)) + '</dd>'
    + '<dt>confidence</dt><dd>' + esc(t(d.confidence)) + '</dd></dl>');

  h += conn() + stage(5, t("st5"), "WF-4", true,
      checkDetail(d).map(function(c){
        return '<div class="rulerow' + (c.hit ? " trip" : "") + '">'
          + '<span class="mk">' + (c.hit ? esc(t("tripped")) : "—") + '</span>'
          + '<span>' + esc(c.label) + '</span>'
          + '<span class="why">' + esc(c.got) + '</span></div>';
      }).join("")
    + '<div style="margin-top:11px">' + statusPill(d.status) + '</div>');

  h += conn() + stage(6, t("st6"), "WF-4", true, '<div class="dim">' + esc(t("st6b")) + '</div>');

  h += conn() + stage(7, t("st7"), "WF-4", true,
      trace.map(function(x){
        return '<div class="rulerow' + (x.matched ? " win" : "") + '">'
          + '<span class="mk num">' + x.rule.rank + '</span>'
          + '<span>' + txt(dbt(x.rule.label)) + '</span>'
          + '<span class="why">' + esc(x.matched ? t("match") : x.why) + '</span></div>';
      }).join("")
    + (res
        ? '<div style="margin-top:12px">' + esc(t("goesTo")) + ' <b>' + txt(res.person.full_name) + '</b> '
          + '<span class="dim3">' + txt(dbt(res.person.role_title)) + '</span>'
          + (res.viaBackup ? '<div class="dim" style="font-size:12.5px;margin-top:3px">'
              + esc(t("awayNote", { a:ltr(val(res.viaBackup.full_name)), b:ltr(res.viaBackup.away_until) })) + '</div>' : '')
          + '</div>'
        : '<div class="banner" style="margin-top:11px">' + esc(t("noRule")) + '</div>'));

  h += conn() + stage(8, t("st8"), "WF-4", !!task,
      task
        ? '<dl class="kv"><dt>' + esc(t("cTask")) + '</dt><dd>' + txt(task.title) + '</dd>'
          + '<dt>owner</dt><dd class="mono">' + esc(ltr(task.owner)) + '</dd>'
          + '<dt>' + esc(t("cPriority")) + '</dt><dd>' + priPill(task.priority) + '</dd>'
          + '<dt>' + esc(t("cDue")) + '</dt><dd>' + (task.due_date
              ? '<span class="num">' + esc(task.due_date) + '</span>'
              : '<span class="notfound">' + esc(t("noDate")) + '</span>') + '</dd></dl>'
        : '<div class="dim">' + esc(t("st8skip")) + '</div>');

  h += conn() + stage(9, t("st9"), "WF-4", true, '<div class="dim">' + esc(t("st9b")) + '</div>');

  h += conn() + stage(10, t("st10"), "WF-4", true,
      '<div>' + esc(t("tookBranch", { k:t(mail.kind), u:t(d.urgency) })) + '</div>'
    + '<div class="mono dim" style="margin-top:7px">' + esc(ltr(mail.to)) + '</div>'
    + '<div style="margin-top:11px"><button class="btn btn-sm" onclick="setMailDoc(\'' + d.id + '\');go(\'emails\')">'
    + esc(t("seeEmail")) + '</button></div>');

  h += conn() + stage(11, t("st11"), "WF-1 · WF-6", isDrive,
      '<div class="dim">' + esc(isDrive ? t("st11b") : t("st11skip")) + '</div>');

  return h;
}

/* =============================================================== inbox == */

function renderInbox(){
  var f = state.filters;
  var all = db.documents();
  var rows = all.filter(function(d){
    return (!f.channel  || d.channel     === f.channel)
      && (!f.department || d.department  === f.department)
      && (!f.urgency    || d.urgency     === f.urgency)
      && (!f.status     || d.status      === f.status)
      && (!f.assignee   || d.assigned_to === f.assignee);
  });

  var peopleOpts = '<option value="">' + esc(t("anyone")) + '</option>' + db.people().map(function(p){
    return '<option value="' + p.id + '"' + (p.id === f.assignee ? ' selected' : '') + '>'
         + txt(p.full_name) + '</option>';
  }).join("");

  var body = rows.map(function(d){
    return '<tr class="click" onclick="openDoc(\'' + d.id + '\')">'
      + '<td class="nowrap dim num">' + fmtWhen(d.received_at) + '</td>'
      + '<td><div>' + esc(ltr(d.file_name)) + '</div>'
      +   '<div class="dim3" style="font-size:12px">' + esc(t(d.channel)) + '</div></td>'
      + '<td><span class="pill">' + esc(t(d.document_type)) + '</span></td>'
      + '<td>' + nf(d.sender_or_company) + '</td>'
      + '<td class="nowrap">' + esc(t(d.department)) + '</td>'
      + '<td>' + urgPill(d.urgency) + '</td>'
      + '<td class="nowrap">' + nf(d.deadline_text) + '</td>'
      + '<td class="nowrap">' + esc(personName(d.assigned_to)) + '</td>'
      + '<td>' + statusPill(d.status) + '</td></tr>';
  }).join("");

  return head("navInbox", "inboxSub",
      '<span class="dim3" style="font-size:12.5px">' + esc(t("ofTotal", {a:rows.length, b:all.length})) + '</span>')
    + '<div class="panelwrap"><div class="toolbar">'
    +   '<select onchange="setF(\'channel\',this.value)">'    + opts(D.CHANNELS,    f.channel,    "anyChannel") + '</select>'
    +   '<select onchange="setF(\'department\',this.value)">' + opts(D.DEPARTMENTS, f.department, "anyDept")    + '</select>'
    +   '<select onchange="setF(\'urgency\',this.value)">'    + opts(D.URGENCIES,   f.urgency,    "anyUrgency") + '</select>'
    +   '<select onchange="setF(\'status\',this.value)">'     + opts(D.STATUSES,    f.status,     "anyStatus")  + '</select>'
    +   '<select onchange="setF(\'assignee\',this.value)">'   + peopleOpts + '</select>'
    +   '<button class="btn btn-sm" onclick="state.filters={};render()">' + esc(t("clear")) + '</button>'
    + '</div>'
    + (rows.length
        ? '<div class="tblwrap"><table class="t"><thead><tr>'
          + ['cReceived','cFile','cType','cSender','cDept','cUrgency','cDeadline','cAssigned','cStatus']
              .map(function(k){ return '<th>' + esc(t(k)) + '</th>'; }).join("")
          + '</tr></thead><tbody>' + body + '</tbody></table></div>'
        : '<div class="empty">' + esc(t("noMatch")) + '</div>')
    + '</div>';
}

/* ============================================================== review == */

function renderReview(){
  var rows = db.documents().filter(function(d){ return d.status === "needs_review"; });

  var cards = rows.map(function(d){
    return '<div class="card pad" style="margin-bottom:12px">'
      + '<div style="display:flex;flex-wrap:wrap;gap:10px;align-items:center">'
      +   '<b style="font-size:14.5px">' + esc(ltr(d.file_name)) + '</b>'
      +   '<span class="pill">' + esc(t(d.document_type)) + '</span>' + urgPill(d.urgency)
      +   '<span class="dim3 num nowrap" style="margin-inline-start:auto;font-size:12.5px">' + fmtWhen(d.received_at) + '</span>'
      + '</div>'
      + '<div class="banner" style="margin:12px 0">' + reviewReason(d.review_reason) + '</div>'
      + '<dl class="kv">'
      +   '<dt>' + esc(t("fSender"))     + '</dt><dd>' + nf(d.sender_or_company) + '</dd>'
      +   '<dt>' + esc(t("fAction"))     + '</dt><dd>' + nf(d.requested_action) + '</dd>'
      +   '<dt>' + esc(t("fDeadline"))   + '</dt><dd>' + nf(d.deadline_text) + '</dd>'
      +   '<dt>' + esc(t("fConfidence")) + '</dt><dd>' + esc(t(d.confidence)) + '</dd>'
      +   '<dt>' + esc(t("assignedTo"))  + '</dt><dd>' + esc(personName(d.assigned_to)) + '</dd>'
      + '</dl>'
      + '<div style="display:flex;gap:8px;margin-top:14px">'
      +   '<button class="btn btn-primary btn-sm" onclick="alert(t(\'notWired\'))">' + esc(t("approve")) + '</button>'
      +   '<button class="btn btn-sm" onclick="openDoc(\'' + d.id + '\')">' + esc(t("openFull")) + '</button>'
      + '</div></div>';
  }).join("");

  return head("navReview", "reviewSub")
    + '<div class="card pad" style="margin-bottom:16px">'
    +   '<div class="lbl" style="margin-bottom:9px">' + esc(t("fourRules")) + '</div>'
    +   ['rule1','rule2','rule3','rule4'].map(function(k){
          return '<div class="rulerow"><span class="mk">—</span><span>' + esc(t(k)) + '</span></div>';
        }).join("")
    + '</div>'
    + (rows.length ? cards : '<div class="card empty">' + esc(t("nothingWaiting")) + '</div>');
}

/* =============================================================== tasks == */

function renderTasks(){
  var tasks = db.tasks();
  var blocks = db.people().map(function(p){
    var mine = tasks.filter(function(x){ return x.assigned_to === p.id; });
    if (!mine.length) return "";
    var rows = mine.map(function(x){
      var d = x.document_id ? byId(db.documents(), x.document_id) : null;
      return '<tr' + (d ? ' class="click" onclick="openDoc(\'' + d.id + '\')"' : '') + '>'
        + '<td><div>' + txt(x.title) + '</div>'
        +   '<div class="dim3" style="font-size:12px;margin-top:2px">' + txt(x.ai_summary) + '</div></td>'
        + '<td class="nowrap">' + priPill(x.priority) + '</td>'
        + '<td class="nowrap">' + taskPill(x.status) + '</td>'
        + '<td class="nowrap dim num">' + (x.due_date ? fmtDate(x.due_date)
            : '<span class="notfound">' + esc(t("noDate")) + '</span>') + '</td>'
        + '<td class="nowrap dim">' + (d ? esc(ltr(d.file_name)) : '<span class="dim3">—</span>') + '</td></tr>';
    }).join("");
    return '<div style="margin-bottom:20px">'
      + '<div style="display:flex;align-items:baseline;gap:9px;margin-bottom:8px">'
      +   '<b style="font-size:14.5px">' + txt(p.full_name) + '</b>'
      +   '<span class="dim3" style="font-size:12.5px">' + txt(dbt(p.role_title)) + ' · ' + esc(t(p.department)) + '</span>'
      + '</div>'
      + panel('<table class="t"><thead><tr>'
          + ['cTask','cPriority','cStatus','cDue','cFrom'].map(function(k){ return '<th>' + esc(t(k)) + '</th>'; }).join("")
          + '</tr></thead><tbody>' + rows + '</tbody></table>')
      + '</div>';
  }).join("");

  return head("navTasks", "tasksSub") + blocks;
}

/* ============================================================== emails == */

function renderEmails(){
  var d = byId(db.documents(), state.mailDoc) || db.documents()[0];
  if (!d) return head("navEmails", "emailsSub") + emptyState();
  var m = emailFor(d);

  return head("navEmails", "emailsSub")
    + '<div class="toolbar" style="border-radius:12px;border:1px solid var(--rule);margin-bottom:16px">'
    +   docPicker(d.id, "setMailDoc")
    +   '<span class="pill ' + (m.kind === "urgent" ? "p-hi" : "p-lo") + '">'
    +     esc(t("branch", { k:t(m.kind) })) + '</span></div>'
    + '<div class="mailbox">'
    +   '<div class="mailhd">'
    +     '<div class="row"><span>' + esc(t("to")) + '</span><span class="mono">' + esc(ltr(m.to)) + '</span></div>'
    +     '<div class="row"><span>' + esc(t("subject")) + '</span><span><b>' + esc(m.subject) + '</b></span></div>'
    +   '</div><div class="mailbody">' + esc(m.body) + '</div>'
    + '</div>'
    + '<div class="head" style="margin-top:26px"><h2>' + esc(t("sentSoFar")) + '</h2></div>'
    + '<p class="sub">' + esc(t("sentSub")) + '</p>'
    + panel('<table class="t"><thead><tr>'
        + ['cSent','cBranch','cTo','cSubject'].map(function(k){ return '<th>' + esc(t(k)) + '</th>'; }).join("")
        + '</tr></thead><tbody>'
        + db.notifications().map(function(n){
            var doc = byId(db.documents(), n.document_id);
            return '<tr><td class="nowrap dim num">' + fmtWhen(n.sent_at) + '</td>'
              + '<td><span class="pill ' + (n.kind === "urgent" ? "p-hi" : "p-lo") + '">' + esc(t(n.kind)) + '</span></td>'
              + '<td class="mono dim">' + esc(ltr(n.to_email)) + '</td>'
              + '<td>' + esc(doc ? emailFor(doc).subject : "") + '</td></tr>';
          }).join("")
        + '</tbody></table>');
}

/* ============================================================== people == */

function renderPeople(){
  var tday = today();
  var edit = personEditable();
  var rows = db.people().map(function(p){
    var away = p.away_until && p.away_until >= tday;
    var bk = byId(db.people(), p.backup_person);
    var load = db.tasks().filter(function(x){ return x.assigned_to === p.id && x.status !== "done"; }).length;
    return '<tr' + (edit ? ' class="click" onclick="openPersonEditor(\'' + p.id + '\')"' : '')
      +   (p.is_active === false ? ' style="opacity:.5"' : '') + '>'
      + '<td><div>' + txt(p.full_name) + '</div>'
      +   '<div class="dim3 mono" style="font-size:12px">' + esc(ltr(p.slug)) + '</div></td>'
      + '<td>' + txt(dbt(p.role_title)) + '</td>'
      + '<td class="nowrap">' + esc(t(p.department)) + '</td>'
      + '<td class="mono dim">' + esc(ltr(p.email)) + '</td>'
      /* Inactive outranks a leave date in the pill, because it is the stronger
       * statement: away ends, inactive does not. */
      + '<td class="nowrap">' + (p.is_active === false
          ? '<span class="pill p-lo">' + esc(t("pActive")) + ': —</span>'
          : away
          ? '<span class="pill p-me">' + esc(t("awayUntil", {d:ltr(p.away_until)})) + '</span>'
          : '<span class="pill p-ok">' + esc(t("available")) + '</span>') + '</td>'
      + '<td class="nowrap dim">' + (bk ? txt(bk.full_name) : "—") + '</td>'
      + '<td class="nowrap num">' + load + '</td></tr>';
  }).join("");

  return head("navPeople", "peopleSub",
      edit ? '<button class="btn btn-primary btn-sm" style="margin-inline-start:auto" '
             + 'onclick="openPersonEditor()">' + esc(t("personAdd")) + '</button>' : "")
    + (edit ? '<p class="sub" style="margin-top:-10px">' + esc(t("personEditHint")) + '</p>' : "")
    + panel('<table class="t"><thead><tr>'
        + ['cName','cRole','cDept','cEmail','cAvail','cBackup','cOpen']
            .map(function(k){ return '<th>' + esc(t(k)) + '</th>'; }).join("")
        + '</tr></thead><tbody>' + rows + '</tbody></table>');
}

/* ======================================================= people editor == */

function openPersonEditor(id){
  var p = id ? byId(db.people(), id) : null;
  var W = 'style="width:100%"';

  var h = '<div class="shead"><h3>' + esc(t(p ? "personEdit" : "personNew")) + '</h3>'
    + '<button class="xbtn" onclick="closeSheet()" aria-label="Close">&times;</button></div>'
    + '<div class="ssec">'
    + ruleField("fName", '<input type="text" id="pf_full_name" maxlength="80" ' + W
        + ' value="' + esc(p ? val(p.full_name) : "") + '">')
    + ruleField("fSlug", '<input type="text" id="pf_slug" maxlength="24" dir="ltr" ' + W
        + ' value="' + esc(p ? p.slug : "") + '">', "personSlugHint")
    + ruleField("cEmail", '<input type="email" id="pf_email" dir="ltr" ' + W
        + ' value="' + esc(p ? p.email : "") + '">')
    + ruleField("fRole", '<input type="text" id="pf_role_title" maxlength="60" ' + W
        + ' value="' + esc(p ? val(p.role_title) : "") + '">')
    + ruleField("cDept", '<select id="pf_department" ' + W + '>'
        + D.DEPARTMENTS.map(function(x){
            return '<option value="' + x + '"' + (p && p.department === x ? ' selected' : '') + '>'
                 + esc(t(x)) + '</option>';
          }).join("") + '</select>')
    + '</div><div class="ssec">'
    + '<h4>' + esc(t("cAvail")) + '</h4>'
    + ruleField("fLeave", '<input type="date" id="pf_away_until" dir="ltr" ' + W
        + ' value="' + esc(p && p.away_until ? p.away_until : "") + '" oninput="personLive()">',
        "personLeaveHint")
    + ruleField("fBackup", '<select id="pf_backup_person" ' + W + ' oninput="personLive()">'
        + '<option value="">' + esc(t("none")) + '</option>'
        + db.people().filter(function(x){ return !p || x.id !== p.id; }).map(function(x){
            return '<option value="' + x.id + '"' + (p && p.backup_person === x.id ? ' selected' : '') + '>'
                 + esc(val(x.full_name)) + '</option>';
          }).join("") + '</select>', "personBackupHint")
    + '<label style="display:flex;gap:8px;align-items:center;font-size:13.5px">'
    +   '<input type="checkbox" id="pf_is_active"' + (!p || p.is_active !== false ? ' checked' : '')
    +     ' oninput="personLive()">' + esc(t("pActive")) + '</label>'
    + '<div class="dim3" style="font-size:12px;margin-top:12px">' + esc(t("personInactiveHint")) + '</div>'
    + '</div><div class="ssec">'
    + '<div class="banner" id="pf_preview"></div>'
    + '<div style="display:flex;gap:8px;margin-top:14px;flex-wrap:wrap">'
    +   '<button class="btn btn-primary btn-sm" id="pf_save" onclick="submitPerson('
    +     (p ? "'" + p.id + "'" : "null") + ')">' + esc(t("personSave")) + '</button>'
    +   '<button class="btn btn-sm" onclick="closeSheet()">' + esc(t("personCancel")) + '</button>'
    +   (p ? '<button class="btn btn-sm" style="margin-inline-start:auto;color:var(--stuck-bg)" '
            + 'onclick="removePerson(\'' + p.id + '\')">' + esc(t("personDelete")) + '</button>' : "")
    + '</div></div>';

  state.personId = p ? p.id : null;
  document.getElementById("sheet").innerHTML = h;
  document.getElementById("sheet").classList.add("on");
  document.getElementById("scrim").classList.add("on");
  personLive();
}

function personDraft(id){
  var v = function(x){ var e = document.getElementById("pf_" + x); return e ? e.value : ""; };
  return {
    id: id || null,
    full_name: v("full_name").trim(),
    slug: v("slug").trim().toLowerCase(),
    email: v("email").trim(),
    role_title: v("role_title").trim(),
    department: v("department"),
    away_until: v("away_until") || null,
    backup_person: v("backup_person") || null,
    is_active: document.getElementById("pf_is_active").checked
  };
}

function personLive(){
  var el = document.getElementById("pf_preview");
  if (!el) return;
  var p = personPreview(personDraft(state.personId));
  var lines = [ p.rules ? t("pvRules", { n:p.rules, r:p.ranks.join(", ") }) : t("pvNoRules") ];
  if (p.rules){
    if (!p.backup)        lines.push(t("pvNoBackup"));
    else if (p.backupAway) lines.push(t("pvBackupAway", { b: val(p.backup.full_name) }));
    else                   lines.push(t("pvGoesTo",     { b: val(p.backup.full_name) }));
  }
  el.textContent = lines.join(" ");
}

function submitPerson(id){
  var btn = document.getElementById("pf_save");
  btn.disabled = true;
  btn.textContent = t("personSaving");
  sendPerson({ action: id ? "update" : "create", id: id || undefined, person: personDraft(id) },
    function(){ btn.disabled = false; btn.textContent = t("personSave"); });
}

function removePerson(id){
  var p = byId(db.people(), id);
  if (!p || !confirm(t("personDelAsk", { a: val(p.full_name) }))) return;
  sendPerson({ action: "delete", id: id });
}

/* =============================================================== rules == */

function renderRules(){
  var rules = db.routingRules();
  var anyC = '<span class="dim3">' + esc(t("any")) + '</span>';

  var edit = ruleEditable();

  var rows = rules.map(function(r){
    return '<tr' + (edit ? ' class="click" onclick="openRuleEditor(\'' + r.id + '\')"' : '')
      +   (r.is_active === false ? ' style="opacity:.5"' : '') + '>'
      + '<td class="num nowrap">' + r.rank + '</td>'
      + '<td>' + txt(dbt(r.label)) + '</td>'
      + '<td class="nowrap">' + (r.match_channel ? esc(t(r.match_channel)) : anyC) + '</td>'
      + '<td class="nowrap">' + (r.match_doc_type ? '<span class="pill">' + esc(t(r.match_doc_type)) + '</span>' : anyC) + '</td>'
      + '<td class="nowrap">' + (r.match_department ? esc(t(r.match_department)) : anyC) + '</td>'
      + '<td class="nowrap">' + (r.match_urgency ? urgPill(r.match_urgency) : anyC) + '</td>'
      /* Bidi mirrors ≥ into ≤ in an RTL cell. That is correct typography and a
       * dangerous rule: "≥ 5,000" is the difference between the manager seeing
       * a large invoice and never seeing one. The isolate pins it LTR. */
      + '<td class="nowrap num">' + (r.min_amount != null
          ? esc(ltr("≥ " + money(r.min_amount))) : anyC) + '</td>'
      + '<td class="nowrap">' + esc(personName(r.assign_to)) + '</td></tr>';
  }).join("");

  var s = state.sim;
  var hit = matchRule(rules, { channel:s.channel, document_type:s.document_type,
    department:s.department, urgency:s.urgency, amount: s.amount === "" ? null : Number(s.amount) });

  var res;
  if (!hit){
    res = '<div class="banner">' + esc(t("noRuleWarn")) + '</div>';
  } else {
    var r = resolvePerson(hit.assign_to, today());
    res = '<dl class="kv">'
      + '<dt>' + esc(t("ruleLbl")) + '</dt><dd><span class="num">' + hit.rank + '</span> &nbsp;' + txt(dbt(hit.label)) + '</dd>'
      + '<dt>' + esc(t("goesTo")) + '</dt><dd><b>' + txt(r.person.full_name) + '</b> '
      +   '<span class="dim3">' + txt(dbt(r.person.role_title)) + '</span></dd>'
      + (r.viaBackup ? '<dt>' + esc(t("why")) + '</dt><dd class="dim">'
          + esc(t("awayNote", { a:ltr(val(r.viaBackup.full_name)), b:ltr(r.viaBackup.away_until) })) + '</dd>' : '')
      + '</dl>';
  }

  return head("navRules", "rulesSub",
      edit ? '<button class="btn btn-primary btn-sm" style="margin-inline-start:auto" onclick="openRuleEditor()">'
             + esc(t("ruleAdd")) + '</button>' : "")
    + (edit ? '<p class="sub" style="margin-top:-10px">' + esc(t("ruleEditHint")) + '</p>' : "")
    + panel('<table class="t"><thead><tr>'
        + ['cRank','cRule','cChannel','cType','cDept','cUrgency','cAmount','cAssign']
            .map(function(k){ return '<th>' + esc(t(k)) + '</th>'; }).join("")
        + '</tr></thead><tbody>' + rows + '</tbody></table>')
    + '<div class="head" style="margin-top:26px"><h2>' + esc(t("simulator")) + '</h2></div>'
    + '<p class="sub">' + esc(t("simSub")) + '</p>'
    + '<div class="panelwrap"><div class="toolbar">'
    +   '<select onchange="setSim(\'channel\',this.value)">'       + opts(D.CHANNELS,    s.channel,       "anyChannel") + '</select>'
    +   '<select onchange="setSim(\'document_type\',this.value)">' + opts(D.DOC_TYPES,   s.document_type, "anyType")    + '</select>'
    +   '<select onchange="setSim(\'department\',this.value)">'    + opts(D.DEPARTMENTS, s.department,    "anyDept")    + '</select>'
    +   '<select onchange="setSim(\'urgency\',this.value)">'       + opts(D.URGENCIES,   s.urgency,       "anyUrgency") + '</select>'
    +   '<input type="number" placeholder="' + esc(t("amountPh")) + '" value="' + esc(s.amount)
    +     '" style="width:120px" oninput="setSim(\'amount\',this.value)">'
    + '</div><div style="padding:16px 18px">' + res + '</div></div>';
}

/* ======================================================== rules editor == */
/* Rendered into the same side sheet the document detail uses, so the scrim,
 * the Escape key and the close button already work.
 *
 * The form is read at submit time rather than re-rendered on every keystroke:
 * re-rendering would rebuild the inputs and throw away the caret. Only the
 * preview line updates live, and it updates one span. */

function ruleField(label, inner, hint){
  return '<div style="margin-bottom:14px">'
    + '<div class="lbl" style="margin-bottom:5px">' + esc(t(label)) + '</div>' + inner
    + (hint ? '<div class="dim3" style="font-size:12px;margin-top:5px">' + esc(t(hint)) + '</div>' : '')
    + '</div>';
}

function openRuleEditor(id){
  var r = id ? byId(db.routingRules(), id) : null;
  var W = 'style="width:100%"';

  /* A new rule is offered the next free hundred rather than a duplicate of an
   * existing rank, because a clash is the one error the form cannot fix for
   * you - it has to choose someone's rank to change. */
  var used = db.routingRules().map(function(x){ return x.rank; });
  var nextRank = r ? r.rank : Math.min(999, (used.length ? Math.max.apply(null, used) : 0) + 1);

  var sel = function(name, list, cur, anyKey){
    return '<select id="rf_' + name + '" ' + W + ' oninput="ruleLive()">'
      + opts(list, cur == null ? "" : cur, anyKey) + '</select>';
  };

  var h = '<div class="shead"><h3>' + esc(t(r ? "ruleEdit" : "ruleNew")) + '</h3>'
    + '<button class="xbtn" onclick="closeSheet()" aria-label="Close">&times;</button></div>'
    + '<div class="ssec">'
    + ruleField("fLabel", '<input type="text" id="rf_label" maxlength="80" ' + W
        + ' value="' + esc(r ? val(r.label) : "") + '">', "ruleLabelHint")
    + ruleField("fRank", '<input type="number" id="rf_rank" min="1" max="999" step="1" ' + W
        + ' value="' + nextRank + '" oninput="ruleLive()">', "ruleRankHint")
    + ruleField("fAssign", '<select id="rf_assign" ' + W + '>'
        + db.people().map(function(p){
            return '<option value="' + p.id + '"' + (r && r.assign_to === p.id ? ' selected' : '') + '>'
                 + esc(val(p.full_name)) + ' · ' + esc(dbt(p.role_title)) + '</option>';
          }).join("") + '</select>')
    + '</div><div class="ssec">'
    + '<h4>' + esc(t("ruleConds")) + '</h4>'
    + ruleField("cChannel",  sel("channel",  D.CHANNELS,    r && r.match_channel,    "anyChannel"))
    + ruleField("cType",     sel("type",     D.DOC_TYPES,   r && r.match_doc_type,   "anyType"))
    + ruleField("cDept",     sel("dept",     D.DEPARTMENTS, r && r.match_department, "anyDept"))
    + ruleField("cUrgency",  sel("urgency",  D.URGENCIES,   r && r.match_urgency,    "anyUrgency"))
    + ruleField("cAmount",   '<input type="number" id="rf_amount" min="0" step="0.01" ' + W
        + ' placeholder="' + esc(t("any")) + '" value="'
        + (r && r.min_amount != null ? esc(r.min_amount) : "") + '" oninput="ruleLive()">')
    + '<label style="display:flex;gap:8px;align-items:center;font-size:13.5px">'
    +   '<input type="checkbox" id="rf_active"' + (!r || r.is_active !== false ? ' checked' : '') + '>'
    +   esc(t("fActive")) + '</label>'
    + '<div class="dim3" style="font-size:12px;margin-top:12px">' + esc(t("ruleCondHint")) + '</div>'
    + '</div><div class="ssec">'
    + '<div class="banner" id="rf_preview"></div>'
    + '<div style="display:flex;gap:8px;margin-top:14px;flex-wrap:wrap">'
    +   '<button class="btn btn-primary btn-sm" id="rf_save" onclick="submitRule(' + (r ? "'" + r.id + "'" : "null") + ')">'
    +     esc(t("ruleSave")) + '</button>'
    +   '<button class="btn btn-sm" onclick="closeSheet()">' + esc(t("ruleCancel")) + '</button>'
    +   (r ? '<button class="btn btn-sm" style="margin-inline-start:auto;color:var(--stuck-bg)" '
            + 'onclick="removeRule(\'' + r.id + '\')">' + esc(t("ruleDelete")) + '</button>' : "")
    + '</div></div>';

  state.ruleId = r ? r.id : null;
  document.getElementById("sheet").innerHTML = h;
  document.getElementById("sheet").classList.add("on");
  document.getElementById("scrim").classList.add("on");
  ruleLive();
}

/* Reads the form as it stands. Kept separate so the preview and the submit
 * path can never disagree about what the form says. */
function ruleDraft(id){
  var v = function(x){ var e = document.getElementById("rf_" + x); return e ? e.value : ""; };
  var amt = v("amount").trim();
  return {
    id: id || null,
    rank: Number(v("rank")),
    label: v("label").trim(),
    match_channel:    v("channel")  || null,
    match_doc_type:   v("type")     || null,
    match_department: v("dept")     || null,
    match_urgency:    v("urgency")  || null,
    min_amount: amt === "" ? null : Number(amt),
    assign_to: v("assign"),
    is_active: document.getElementById("rf_active").checked
  };
}

function ruleLive(){
  var el = document.getElementById("rf_preview");
  if (!el) return;
  /* state.ruleId, not null: while editing rule X the draft replaces X in the
   * ranking. Leaving X in would make the rule compete with itself and the
   * count would read 0 for every edit. */
  var p = rulePreview(ruleDraft(state.ruleId));
  el.textContent = p.win
    ? t("ruleHits", { n:p.win, m:p.total })
    : t("ruleHitsNone", { m:p.total });
}

function submitRule(id){
  var draft = ruleDraft(id);
  var btn = document.getElementById("rf_save");
  btn.disabled = true;
  btn.textContent = t("ruleSaving");
  sendRule({ action: id ? "update" : "create", id: id || undefined, rule: draft },
    function(){ btn.disabled = false; btn.textContent = t("ruleSave"); });
}

function removeRule(id){
  var r = byId(db.routingRules(), id);
  if (!r || !confirm(t("ruleDelAsk", { a: dbt(r.label) }))) return;
  sendRule({ action: "delete", id: id });
}

/* =========================================================== dashboard == */

function renderDash(){
  var docs = db.documents(), tasks = db.tasks(), people = db.people();
  var stats = [
    [docs.length, t("mDocs")],
    [docs.filter(function(d){ return d.urgency === "High"; }).length, t("mUrgentB")],
    [docs.filter(function(d){ return d.status === "needs_review"; }).length, t("mWaiting")],
    [tasks.filter(function(x){ return x.status !== "done"; }).length, t("mOpenTasks")]
  ].map(function(x){
    return '<div class="metric"><div class="v num">' + x[0] + '</div><div class="l">' + esc(x[1]) + '</div></div>';
  }).join("");

  function tally(key){
    var m = {}; docs.forEach(function(d){ m[d[key]] = (m[d[key]] || 0) + 1; });
    return Object.keys(m).sort().map(function(k){
      return '<tr><td>' + esc(t(k)) + '</td><td class="nowrap num">' + m[k] + '</td></tr>';
    }).join("");
  }

  var loadRows = people.map(function(p){
    var mine = tasks.filter(function(x){ return x.assigned_to === p.id && x.status !== "done"; });
    var urg = mine.filter(function(x){ return x.priority === "urgent"; }).length;
    return '<tr><td>' + txt(p.full_name) + '</td>'
      + '<td class="nowrap num">' + mine.length + '</td>'
      + '<td class="nowrap">' + (urg ? '<span class="pill p-hi">' + urg + '</span>'
          : '<span class="dim3 num">0</span>') + '</td></tr>';
  }).join("");

  return head("navDash", "dashSub")
    + '<div class="grid g3" style="margin-bottom:20px">' + stats + '</div>'
    + '<div class="grid g2">'
    +   '<div><div class="lbl" style="margin-bottom:8px">' + esc(t("byDept")) + '</div>'
    +     panel('<table class="t"><thead><tr><th>' + esc(t("cDept")) + '</th><th>' + esc(t("cDocs"))
    +       '</th></tr></thead><tbody>' + tally("department") + '</tbody></table>') + '</div>'
    +   '<div><div class="lbl" style="margin-bottom:8px">' + esc(t("byChannel")) + '</div>'
    +     panel('<table class="t"><thead><tr><th>' + esc(t("cChannel")) + '</th><th>' + esc(t("cDocs"))
    +       '</th></tr></thead><tbody>' + tally("channel") + '</tbody></table>') + '</div>'
    + '</div>'
    + '<div class="lbl" style="margin:24px 0 8px">' + esc(t("workload")) + '</div>'
    + panel('<table class="t"><thead><tr><th>' + esc(t("cPerson")) + '</th><th>' + esc(t("cOpen"))
        + '</th><th>' + esc(t("cUrgentN")) + '</th></tr></thead><tbody>' + loadRows + '</tbody></table>');
}

/* =============================================================== sheet == */

function openDoc(id){
  var d = byId(db.documents(), id);
  if (!d) return;
  var rule = d.matched_rule ? byId(db.routingRules(), d.matched_rule) : null;
  var task = d.task_id ? byId(db.tasks(), d.task_id) : null;
  var notes = db.notifications().filter(function(n){ return n.document_id === d.id; });

  var h = '<div class="shead"><h3>' + esc(ltr(d.file_name)) + '</h3>'
    + '<button class="xbtn" onclick="closeSheet()" aria-label="Close">&times;</button></div>';

  h += '<div class="ssec"><h4>' + esc(t("secIntake")) + '</h4><dl class="kv">'
    + '<dt>' + esc(t("cChannel"))   + '</dt><dd>' + esc(t(d.channel)) + '</dd>'
    + '<dt>' + esc(t("received"))   + '</dt><dd class="num">' + fmtWhen(d.received_at) + '</dd>'
    + '<dt>' + esc(t("sourceRef"))  + '</dt><dd class="mono dim">' + esc(ltr(d.source_ref)) + '</dd>'
    + (d.file_link ? '<dt>' + esc(t("cFile")) + '</dt><dd><a href="' + esc(d.file_link)
        + '" target="_blank" rel="noopener">' + esc(t("openDrive")) + '</a></dd>' : '')
    + '</dl></div>';

  h += '<div class="ssec"><h4>' + esc(t("secModel")) + '</h4><dl class="kv">'
    + '<dt>' + esc(t("fType"))     + '</dt><dd><span class="pill">' + esc(t(d.document_type)) + '</span></dd>'
    + '<dt>' + esc(t("fSender"))   + '</dt><dd>' + nf(d.sender_or_company) + '</dd>'
    + '<dt>' + esc(t("fSummary"))  + '</dt><dd>' + txt(d.summary) + '</dd>'
    + '<dt>' + esc(t("fAction"))   + '</dt><dd>' + nf(d.requested_action) + '</dd>'
    + '<dt>' + esc(t("fDeadline")) + '</dt><dd>' + nf(d.deadline_text)
    +   ' <span class="dim3">(' + esc(d.deadline_date ? t("normalised", {d:ltr(d.deadline_date)}) : t("notNormalisable")) + ')</span></dd>'
    + '<dt>' + esc(t("fUrgency"))  + '</dt><dd>' + urgPill(d.urgency) + '</dd>'
    + '<dt>' + esc(t("fDept"))     + '</dt><dd>' + esc(t(d.department)) + '</dd>'
    + '<dt>' + esc(t("fAmount"))   + '</dt><dd>' + (d.amount != null
        ? '<span class="num">' + money(d.amount) + '</span>' : nf(null)) + '</dd>'
    + '<dt>' + esc(t("fConfidence")) + '</dt><dd>' + esc(t(d.confidence)) + '</dd>'
    + '</dl></div>';

  h += '<div class="ssec"><h4>' + esc(t("secStatus")) + '</h4>' + statusPill(d.status)
    + (d.review_reason ? '<div class="banner" style="margin-top:11px">' + reviewReason(d.review_reason) + '</div>' : '')
    + '</div>';

  h += '<div class="ssec"><h4>' + esc(t("secRouting")) + '</h4><dl class="kv">'
    + '<dt>' + esc(t("matchedRule")) + '</dt><dd>' + (rule
        ? '<span class="num">' + rule.rank + '</span> ' + txt(dbt(rule.label))
        : '<span class="dim3">' + esc(t("none")) + '</span>') + '</dd>'
    + '<dt>' + esc(t("assignedTo")) + '</dt><dd>' + esc(personName(d.assigned_to)) + '</dd>'
    + '</dl></div>';

  h += '<div class="ssec"><h4>' + esc(t("secResult")) + '</h4><dl class="kv">'
    + '<dt>' + esc(t("taskW")) + '</dt><dd>' + (task
        ? txt(task.title) + ' ' + taskPill(task.status)
        : '<span class="dim3">' + esc(t("noneCreated")) + '</span>') + '</dd>'
    + '<dt>' + esc(t("notified")) + '</dt><dd>' + (notes.length
        ? notes.map(function(n){
            return '<div><span class="pill ' + (n.kind === "urgent" ? "p-hi" : "p-lo") + '">'
              + esc(t(n.kind)) + '</span> <span class="mono dim">' + esc(ltr(n.to_email)) + '</span></div>';
          }).join("")
        : '<span class="dim3">' + esc(t("nothingSent")) + '</span>') + '</dd>'
    + '</dl></div>';

  document.getElementById("sheet").innerHTML = h;
  document.getElementById("sheet").classList.add("on");
  document.getElementById("scrim").classList.add("on");
}

/* Office Hub - core: language, theme, data layer, business logic.
 * Screen renderers live in screens.js. */

"use strict";

/* ============================================================ i18n ====== */

var T = {
  en: {
    tagline: "Document routing and work queue",
    srcMock: "Mock data", srcLive: "Connected to Supabase",

    navFlow: "Flow", navInbox: "Inbox", navReview: "Needs review", navTasks: "Tasks",
    navEmails: "Emails", navPeople: "People", navRules: "Rules", navDash: "Dashboard",

    /* enum labels */
    drive: "Drive", form: "Form", gmail: "Gmail",
    invoice: "Invoice", request: "Request", report: "Report", complaint: "Complaint",
    contract: "Contract", quote: "Quote", lead: "Lead", other: "Other",
    Low: "Low", Medium: "Medium", High: "High",
    Sales: "Sales", Finance: "Finance", Support: "Support", HR: "HR",
    Management: "Management", General: "General",
    processed: "Processed", needs_review: "Needs review",
    todo: "To do", working: "Working", done: "Done", stuck: "Stuck",
    low: "Low", medium: "Medium", high: "High", urgent: "Urgent",
    notFound: "Not found", noAction: "No action found",

    anyChannel: "Any channel", anyDept: "Any department", anyUrgency: "Any urgency",
    anyStatus: "Any status", anyType: "Any type", anyone: "Anyone", clear: "Clear", any: "any",

    /* flow */
    flowH: "Flow",
    flowSub: "One item, every stage, real values. Each card names the n8n node that performs it. This screen is the build specification for the workflow, and the place to disagree before anything is wired.",
    st1drive: "Google Drive Trigger", st1form: "Webhook", st1gmail: "Gmail Trigger",
    whatFired: "What fired it", sourceRef: "Source ref", received: "Received",
    firedDrive: "A new file appeared in Incoming Documents",
    firedForm: "The website form posted to the webhook URL",
    firedGmail: "A new message matched the Gmail query",
    st2drive: "Download + Extract From File", st2other: "Read the payload",
    st2driveB: "The file is downloaded by id and converted from PDF, DOCX or TXT into plain text.",
    st2otherB: "The incoming fields are joined into one block of plain text.",
    st3: "Set - Normalize",
    st3note: "From here on nothing knows which channel it came from.",
    theBody: "the document body", emptyVal: "empty",
    st4: "Information Extractor + AI Chat Model",
    st5: "Set - Derive status", tripped: "TRIPPED",
    st6: "Supabase - Insert documents",
    st6b: "One row, keyed on (channel, source_ref) so a trigger that fires twice cannot create a duplicate.",
    st7: "Get rules - Filter - Limit 1 - Get person",
    match: "match", goesTo: "Goes to", noRule: "No rule matched.",
    awayNote: "{a} is away until {b}, so the backup receives it",
    st8: "Supabase - Insert tasks",
    st8skip: "Skipped. requested_action is No action found, so there is nothing to open.",
    st9: "Google Sheets - Append Row",
    st9b: "The audit log the brief asks for. Supabase runs the office; the sheet is the evidence.",
    st10: "IF urgency = High - Gmail",
    tookBranch: "Took the {k} branch - urgency is {u}.",
    seeEmail: "See the email",
    st11: "Google Drive - Move File",
    st11b: "Moved to Processed Documents, so the folder empties and nothing is processed twice.",
    st11skip: "Skipped. This item did not arrive as a file, so there is nothing to move.",

    /* inbox */
    inboxSub: "Everything that entered the office, from any channel, with the fields the model returned. Click a row to see the full extraction.",
    cReceived: "Received", cFile: "File", cType: "Type", cSender: "Sender / company",
    cDept: "Dept", cUrgency: "Urgency", cDeadline: "Deadline", cAssigned: "Assigned",
    cStatus: "Status", ofTotal: "{a} of {b}",
    noMatch: "No documents match these filters.",

    /* review */
    reviewSub: "The queue exists so that nothing the model was unsure about disappears quietly. These items were still stored, routed and notified - they are simply flagged.",
    fourRules: "The four rules",
    rule1: "confidence = Low",
    rule2: "three or more fields returned Not found",
    rule3: "document_type = other",
    rule4: "urgency = High but deadline = Not found",
    approve: "Approve as is", openFull: "Open full record",
    nothingWaiting: "Nothing is waiting for review.",
    notWired: "Wired in phase 6: marks the document processed.",
    fieldsMissing: "{n} field(s) missing", confIs: "confidence is {c}", typeIs: "type is {t}",

    /* tasks */
    tasksSub: "The same tasks table that DailyTask AI reads, grouped by owner. Every task here was created by the router from a document - that is the loop closing.",
    cTask: "Task", cPriority: "Priority", cDue: "Due", cFrom: "From document", noDate: "no date",

    /* emails */
    emailsSub: "The two templates the brief requires, rendered with real values. The urgent branch fires when urgency is High; everything else takes the normal branch. Both carry the same business fields so the recipient never has to open the original first.",
    urgent: "urgent", normal: "normal", branch: "{k} branch",
    to: "To", subject: "Subject",
    sentSoFar: "Sent so far",
    sentSub: "One row per notification, so “an email went out” is a fact in the database and not an assumption.",
    cSent: "Sent", cBranch: "Branch", cTo: "To", cSubject: "Subject",

    mUrgentOpen: "A new urgent document was processed and assigned to you.",
    mNormalOpen: "A new document was processed successfully.",
    mFile: "File", mSender: "Sender", mType: "Type", mDept: "Department",
    mUrgency: "Urgency", mDeadline: "Deadline", mAmount: "Amount",
    mSummary: "Summary", mAction: "Requested action", mLink: "File in Drive",
    mReview: "NEEDS REVIEW", mReviewNote: "Please check the original before acting on this summary.",
    mNoAction: "No action is required. This is for information only.",
    subjUrgent: "URGENT: {t} from {s}", subjNormal: "Document processed: {f}",

    /* people */
    peopleSub: "This table is what feeds the routing. The model never picks a person - it classifies, and these rows decide. When someone is away their backup receives the work automatically.",
    cName: "Name", cRole: "Role", cEmail: "Email", cAvail: "Availability",
    cBackup: "Backup", cOpen: "Open tasks",
    available: "Available", awayUntil: "Away until {d}",

    /* rules */
    rulesSub: "Rules are rows, not a prompt. A blank cell means “do not care”. They are evaluated by rank, lowest first, and the first rule that matches wins. Rank 99 is the insurance policy.",
    cRank: "Rank", cRule: "Rule", cChannel: "Channel", cAmount: "Amount", cAssign: "Assign to",
    simulator: "Simulator",
    simSub: "Pick a classification and see who would receive it - no file upload, no waiting. This runs the exact matching logic the n8n nodes will run.",
    amountPh: "amount", ruleLbl: "Rule", why: "Why",
    noRuleWarn: "No rule matched. Add a catch-all rule - without one an item can arrive with no owner.",
    noAmount: "no amount in the document", amountIs: "amount is {a}",
    channelIs: "channel is {c}", deptIs: "department is {d}", urgIs: "urgency is {u}",

    /* dashboard */
    dashSub: "The numbers the minimum success criteria ask for, plus the load each person is actually carrying.",
    mDocs: "documents processed", mUrgentB: "urgent, took the urgent branch",
    mWaiting: "waiting for a person", mOpenTasks: "open tasks created",
    byDept: "By department", byChannel: "By channel", workload: "Workload",
    cDocs: "Documents", cPerson: "Person", cUrgentN: "Urgent",

    /* sheet */
    secIntake: "Intake", secModel: "What the model returned", secStatus: "Status",
    secRouting: "Routing", secResult: "Result",
    fType: "Type", fSender: "Sender", fSummary: "Summary", fAction: "Action",
    fDeadline: "Deadline", fUrgency: "Urgency", fDept: "Department",
    fAmount: "Amount", fConfidence: "Confidence",
    normalised: "normalised {d}", notNormalisable: "not normalisable",
    openDrive: "Open in Drive", matchedRule: "Matched rule", assignedTo: "Assigned to",
    none: "none", noneCreated: "none created", nothingSent: "nothing sent",
    notified: "Notified", taskW: "Task"
  },

  he: {
    tagline: "ניתוב מסמכים ותור עבודה",
    srcMock: "נתוני הדגמה", srcLive: "מחובר ל‑Supabase",

    navFlow: "זרימה", navInbox: "תיבה", navReview: "דורש בדיקה", navTasks: "משימות",
    navEmails: "מיילים", navPeople: "אנשים", navRules: "כללים", navDash: "לוח בקרה",

    drive: "דרייב", form: "טופס", gmail: "ג׳ימייל",
    invoice: "חשבונית", request: "בקשה", report: "דוח", complaint: "תלונה",
    contract: "חוזה", quote: "הצעת מחיר", lead: "ליד", other: "אחר",
    Low: "נמוכה", Medium: "בינונית", High: "גבוהה",
    Sales: "מכירות", Finance: "כספים", Support: "תמיכה", HR: "משאבי אנוש",
    Management: "הנהלה", General: "כללי",
    processed: "עובד", needs_review: "דורש בדיקה",
    todo: "לביצוע", working: "בעבודה", done: "הושלם", stuck: "תקוע",
    low: "נמוכה", medium: "בינונית", high: "גבוהה", urgent: "דחופה",
    notFound: "לא נמצא", noAction: "לא נדרשת פעולה",

    anyChannel: "כל הערוצים", anyDept: "כל המחלקות", anyUrgency: "כל הדחיפויות",
    anyStatus: "כל הסטטוסים", anyType: "כל הסוגים", anyone: "כל אחד", clear: "ניקוי", any: "הכל",

    flowH: "זרימה",
    flowSub: "פריט אחד, כל התחנות, ערכים אמיתיים. כל כרטיס נושא את שם הצומת ב‑n8n שמבצע אותו. המסך הזה הוא מפרט הבנייה של התהליך, והמקום לחלוק עליו לפני שמחווטים משהו.",
    st1drive: "טריגר Google Drive", st1form: "וובהוק", st1gmail: "טריגר Gmail",
    whatFired: "מה הפעיל", sourceRef: "מזהה מקור", received: "התקבל",
    firedDrive: "קובץ חדש הופיע בתיקיית Incoming Documents",
    firedForm: "הטופס באתר שלח POST לכתובת הוובהוק",
    firedGmail: "הודעה חדשה תאמה לשאילתת Gmail",
    st2drive: "הורדה + חילוץ טקסט מהקובץ", st2other: "קריאת התוכן",
    st2driveB: "הקובץ יורד לפי מזהה ומומר מ‑PDF, DOCX או TXT לטקסט פשוט.",
    st2otherB: "השדות הנכנסים מאוחדים לגוש טקסט אחד.",
    st3: "Set ‑ נורמליזציה",
    st3note: "מכאן ואילך שום דבר לא יודע מאיזה ערוץ זה הגיע.",
    theBody: "גוף המסמך", emptyVal: "ריק",
    st4: "Information Extractor + מודל שפה",
    st5: "Set ‑ גזירת סטטוס", tripped: "נדלק",
    st6: "Supabase ‑ הוספת שורה ל‑documents",
    st6b: "שורה אחת, עם מפתח ייחודי על (channel, source_ref), כך שטריגר שיורה פעמיים לא יוצר כפילות.",
    st7: "שליפת כללים ‑ סינון ‑ הראשון ‑ שליפת האדם",
    match: "התאמה", goesTo: "מגיע אל", noRule: "אף כלל לא התאים.",
    awayNote: "{a} בחופשה עד {b}, ולכן המחליף מקבל את זה",
    st8: "Supabase ‑ הוספת שורה ל‑tasks",
    st8skip: "דולג. השדה requested_action הוא ״לא נדרשת פעולה״, אז אין מה לפתוח.",
    st9: "Google Sheets ‑ הוספת שורה",
    st9b: "יומן הביקורת שהבריף דורש. Supabase מנהל את המשרד; הגיליון הוא ההוכחה.",
    st10: "IF דחיפות = גבוהה ‑ Gmail",
    tookBranch: "עבר בענף ה{k} ‑ הדחיפות היא {u}.",
    seeEmail: "לראות את המייל",
    st11: "Google Drive ‑ העברת הקובץ",
    st11b: "הועבר ל‑Processed Documents, כך שהתיקייה מתרוקנת ושום דבר לא מעובד פעמיים.",
    st11skip: "דולג. הפריט הזה לא הגיע כקובץ, אז אין מה להעביר.",

    inboxSub: "כל מה שנכנס למשרד, מכל ערוץ, עם השדות שהמודל החזיר. לחיצה על שורה פותחת את החילוץ המלא.",
    cReceived: "התקבל", cFile: "קובץ", cType: "סוג", cSender: "שולח / חברה",
    cDept: "מחלקה", cUrgency: "דחיפות", cDeadline: "תאריך יעד", cAssigned: "אחראי",
    cStatus: "סטטוס", ofTotal: "{a} מתוך {b}",
    noMatch: "אין מסמכים שתואמים לסינון הזה.",

    reviewSub: "התור הזה קיים כדי ששום דבר שהמודל לא היה בטוח בו לא ייעלם בשקט. הפריטים האלה עדיין נשמרו, נותבו ונשלחה עליהם התראה ‑ הם פשוט מסומנים.",
    fourRules: "ארבעת הכללים",
    rule1: "רמת ביטחון נמוכה",
    rule2: "שלושה שדות או יותר חזרו ריקים",
    rule3: "סוג המסמך הוא ״אחר״",
    rule4: "דחיפות גבוהה אבל אין תאריך יעד",
    approve: "לאשר כמו שזה", openFull: "לפתוח את הרשומה המלאה",
    nothingWaiting: "שום דבר לא ממתין לבדיקה.",
    notWired: "יחווט בשלב 6: מסמן את המסמך כמעובד.",
    fieldsMissing: "{n} שדות חסרים", confIs: "הביטחון {c}", typeIs: "הסוג {t}",

    tasksSub: "אותה טבלת tasks ש‑DailyTask AI קורא, מקובצת לפי אחראי. כל משימה כאן נוצרה על ידי הנתב מתוך מסמך ‑ זהו המעגל שנסגר.",
    cTask: "משימה", cPriority: "עדיפות", cDue: "יעד", cFrom: "מהמסמך", noDate: "ללא תאריך",

    emailsSub: "שתי התבניות שהבריף דורש, מוצגות עם ערכים אמיתיים. הענף הדחוף נדלק כשהדחיפות גבוהה; כל השאר עובר בענף הרגיל. שניהם נושאים את אותם שדות עסקיים, כך שהנמען אף פעם לא צריך לפתוח קודם את המסמך המקורי.",
    urgent: "דחוף", normal: "רגיל", branch: "ענף {k}",
    to: "אל", subject: "נושא",
    sentSoFar: "מה נשלח עד כה",
    sentSub: "שורה אחת לכל התראה, כך ש״נשלח מייל״ הוא עובדה במסד הנתונים ולא הנחה.",
    cSent: "נשלח", cBranch: "ענף", cTo: "אל", cSubject: "נושא",

    mUrgentOpen: "מסמך דחוף חדש עובד והוקצה אליך.",
    mNormalOpen: "מסמך חדש עובד בהצלחה.",
    mFile: "קובץ", mSender: "שולח", mType: "סוג", mDept: "מחלקה",
    mUrgency: "דחיפות", mDeadline: "תאריך יעד", mAmount: "סכום",
    mSummary: "תקציר", mAction: "הפעולה הנדרשת", mLink: "הקובץ בדרייב",
    mReview: "דורש בדיקה", mReviewNote: "נא לבדוק את המסמך המקורי לפני פעולה על סמך התקציר.",
    mNoAction: "לא נדרשת פעולה. זה לידיעה בלבד.",
    subjUrgent: "דחוף: {t} מאת {s}", subjNormal: "מסמך עובד: {f}",

    peopleSub: "הטבלה הזו היא מה שמזין את הניתוב. המודל אף פעם לא בוחר אדם ‑ הוא מסווג, והשורות האלה מחליטות. כשמישהו בחופשה, המחליף מקבל את העבודה אוטומטית.",
    cName: "שם", cRole: "תפקיד", cEmail: "מייל", cAvail: "זמינות",
    cBackup: "מחליף", cOpen: "משימות פתוחות",
    available: "זמין", awayUntil: "בחופשה עד {d}",

    rulesSub: "הכללים הם שורות, לא פרומפט. תא ריק פירושו ״לא אכפת לי״. הם נבדקים לפי דירוג, מהנמוך לגבוה, והכלל הראשון שמתאים מנצח. דירוג 99 הוא פוליסת הביטוח.",
    cRank: "דירוג", cRule: "כלל", cChannel: "ערוץ", cAmount: "סכום", cAssign: "מגיע אל",
    simulator: "סימולטור",
    simSub: "בוחרים סיווג ורואים מי היה מקבל אותו ‑ בלי להעלות קובץ ובלי לחכות. זה מריץ בדיוק את לוגיקת ההתאמה שצמתי ה‑n8n יריצו.",
    amountPh: "סכום", ruleLbl: "כלל", why: "למה",
    noRuleWarn: "אף כלל לא התאים. צריך להוסיף כלל תפס־הכל ‑ בלעדיו פריט יכול להגיע בלי אחראי.",
    noAmount: "אין סכום במסמך", amountIs: "הסכום {a}",
    channelIs: "הערוץ {c}", deptIs: "המחלקה {d}", urgIs: "הדחיפות {u}",

    dashSub: "המספרים שקריטריוני ההצלחה דורשים, ולצידם העומס שכל אדם באמת נושא.",
    mDocs: "מסמכים עובדו", mUrgentB: "דחופים, עברו בענף הדחוף",
    mWaiting: "ממתינים לאדם", mOpenTasks: "משימות פתוחות נוצרו",
    byDept: "לפי מחלקה", byChannel: "לפי ערוץ", workload: "עומס עבודה",
    cDocs: "מסמכים", cPerson: "אדם", cUrgentN: "דחופות",

    secIntake: "קליטה", secModel: "מה המודל החזיר", secStatus: "סטטוס",
    secRouting: "ניתוב", secResult: "תוצאה",
    fType: "סוג", fSender: "שולח", fSummary: "תקציר", fAction: "פעולה",
    fDeadline: "תאריך יעד", fUrgency: "דחיפות", fDept: "מחלקה",
    fAmount: "סכום", fConfidence: "רמת ביטחון",
    normalised: "מנורמל {d}", notNormalisable: "לא ניתן לנרמול",
    openDrive: "לפתוח בדרייב", matchedRule: "הכלל שהתאים", assignedTo: "הוקצה אל",
    none: "אין", noneCreated: "לא נוצרה", nothingSent: "לא נשלח דבר",
    notified: "התראה", taskW: "משימה"
  }
};

var LANG = "en";

function t(k, vars){
  var s = (T[LANG] && T[LANG][k]) || T.en[k] || k;
  if (vars) for (var v in vars) s = s.split("{" + v + "}").join(vars[v]);
  return s;
}
function isRTL(){ return LANG === "he"; }

/* Resolve a possibly-bilingual field to the current language. */
function val(f){
  if (f && typeof f === "object") return f[LANG] || f.en || "";
  return f == null ? "" : f;
}
/* Sentinels the model emits are translated; real quoted text is not. */
function sent(v){
  if (v === "Not found") return t("notFound");
  if (v === "No action found") return t("noAction");
  return val(v);
}

/* ==================================================== storage + chrome == */

var store = {
  get: function(k, d){ try { var v = localStorage.getItem(k); return v === null ? d : v; } catch(e){ return d; } },
  set: function(k, v){ try { localStorage.setItem(k, v); } catch(e){} }
};

function setLang(l){
  LANG = l;
  document.documentElement.lang = l;
  document.documentElement.dir = (l === "he") ? "rtl" : "ltr";
  store.set("oh.lang", l);
  var bs = document.querySelectorAll("#langSeg button");
  for (var i=0;i<bs.length;i++) bs[i].setAttribute("aria-pressed", String(bs[i].dataset.lang === l));
  document.getElementById("tagline").textContent = t("tagline");
  document.getElementById("srcPill").textContent = t(db.kind === "mock" ? "srcMock" : "srcLive");
  closeSheet();
  render();
}

function setTheme(mode){
  if (mode) document.documentElement.setAttribute("data-theme", mode);
  else document.documentElement.removeAttribute("data-theme");
  store.set("oh.theme", mode || "");
  var bs = document.querySelectorAll("#themeSeg button");
  for (var i=0;i<bs.length;i++) bs[i].setAttribute("aria-pressed", String(bs[i].dataset.theme === mode));
}

/* ======================================================== data layer ==== */
/* Everything reads through db.*. A Supabase implementation would expose the
 * same five methods and no screen would change. */

var D = window.OFFICE_HUB_DATA;

var mockDb = {
  kind: "mock",
  people:        function(){ return D.people.slice(); },
  routingRules:  function(){ return D.routing_rules.slice().sort(function(a,b){ return a.rank - b.rank; }); },
  documents:     function(){ return D.documents.slice().sort(function(a,b){ return a.received_at < b.received_at ? 1 : -1; }); },
  tasks:         function(){ return D.tasks.slice(); },
  notifications: function(){ return D.notifications.slice(); }
};

var db = mockDb;

/* ==================================================== business logic ==== */
/* These functions are the specification for what n8n must do. They live here
 * so the behaviour can be seen and tested on screen before a node is wired. */

function matchRule(rules, f){
  for (var i=0;i<rules.length;i++){
    var r = rules[i];
    if (!r.is_active) continue;
    if (r.match_channel    != null && r.match_channel    !== f.channel)       continue;
    if (r.match_doc_type   != null && r.match_doc_type   !== f.document_type) continue;
    if (r.match_department != null && r.match_department !== f.department)    continue;
    if (r.match_urgency    != null && r.match_urgency    !== f.urgency)       continue;
    if (r.min_amount       != null && !(f.amount != null && f.amount >= r.min_amount)) continue;
    return r;
  }
  return null;
}

/* Same evaluation as matchRule, but it records why each earlier rule lost. */
function routeTrace(rules, f){
  var out = [];
  for (var i=0;i<rules.length;i++){
    var r = rules[i], why = null;
    if (!r.is_active) why = "inactive";
    else if (r.match_channel    != null && r.match_channel    !== f.channel)       why = t("channelIs", {c:t(f.channel)});
    else if (r.match_doc_type   != null && r.match_doc_type   !== f.document_type) why = t("typeIs",    {t:t(f.document_type)});
    else if (r.match_department != null && r.match_department !== f.department)    why = t("deptIs",    {d:t(f.department)});
    else if (r.match_urgency    != null && r.match_urgency    !== f.urgency)       why = t("urgIs",     {u:t(f.urgency)});
    else if (r.min_amount       != null && !(f.amount != null && f.amount >= r.min_amount))
      why = (f.amount == null) ? t("noAmount") : t("amountIs", {a:money(f.amount)});
    out.push({ rule:r, matched:!why, why:why });
    if (!why) break;
  }
  return out;
}

/* A person who is away hands the item to their backup. */
function resolvePerson(personId, todayStr){
  var p = byId(db.people(), personId);
  if (!p) return null;
  if (p.away_until && p.away_until >= todayStr){
    var b = byId(db.people(), p.backup_person);
    if (b) return { person:b, viaBackup:p };
  }
  return { person:p, viaBackup:null };
}

/* The four review rules. Any one of them alone is enough. */
function checkDetail(d){
  var missing = 0;
  if (d.sender_or_company === "Not found")       missing++;
  if (d.requested_action  === "No action found") missing++;
  if (d.deadline_text     === "Not found")       missing++;
  if (!d.summary)                                missing++;
  return [
    { label:t("rule1"), hit:d.confidence === "Low",      got:t("confIs", {c:t(d.confidence)}) },
    { label:t("rule2"), hit:missing >= 3,                got:t("fieldsMissing", {n:missing}) },
    { label:t("rule3"), hit:d.document_type === "other", got:t("typeIs", {t:t(d.document_type)}) },
    { label:t("rule4"), hit:d.urgency === "High" && d.deadline_text === "Not found",
      got:t(d.urgency) + " / " + sent(d.deadline_text) }
  ];
}
function deriveStatus(d){
  var c = checkDetail(d);
  for (var i=0;i<c.length;i++) if (c[i].hit) return "needs_review";
  return "processed";
}

function emailFor(d){
  var r = resolvePerson(d.assigned_to, today());
  var isUrgent = d.urgency === "High";
  var subject = isUrgent
    ? t("subjUrgent", { t:t(d.document_type), s:ltr(val(d.sender_or_company)) })
    : t("subjNormal", { f:ltr(d.file_name) });
  var body =
      (isUrgent ? t("mUrgentOpen") : t("mNormalOpen")) + "\n\n"
    + t("mFile")     + ": " + ltr(d.file_name) + "\n"
    + t("mSender")   + ": " + ltr(sent(d.sender_or_company)) + "\n"
    + t("mType")     + ": " + t(d.document_type) + "\n"
    + t("mDept")     + ": " + t(d.department) + "\n"
    + t("mUrgency")  + ": " + t(d.urgency) + "\n"
    + t("mDeadline") + ": " + sent(d.deadline_text) + "\n"
    + (d.amount != null ? t("mAmount") + ": " + money(d.amount) + "\n" : "")
    + "\n" + t("mSummary") + "\n" + val(d.summary) + "\n"
    + "\n" + t("mAction")  + "\n" + sent(d.requested_action) + "\n"
    + (d.file_link ? "\n" + t("mLink") + "\n" + d.file_link + "\n" : "")
    + (d.status === "needs_review"
        ? "\n" + t("mReview") + "\n" + val(d.review_reason) + "\n" + t("mReviewNote") + "\n"
        : (d.requested_action === "No action found" ? "\n" + t("mNoAction") + "\n" : ""));
  return { kind:isUrgent ? "urgent" : "normal", to:r ? r.person.email : "",
           subject:subject, body:body, person:r ? r.person : null };
}

/* ============================================================ helpers === */

function byId(arr, id){ for (var i=0;i<arr.length;i++) if (arr[i].id === id) return arr[i]; return null; }
function esc(s){ return String(s == null ? "" : s).replace(/[&<>"']/g, function(c){
  return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]; }); }
function today(){ return new Date().toISOString().slice(0,10); }
function fmtDate(s){ return s ? s.slice(0,10) : ""; }
function fmtWhen(s){ return s ? s.slice(0,10) + " " + s.slice(11,16) : ""; }
function money(n){ return n == null ? "" :
  Number(n).toLocaleString("en-US", {minimumFractionDigits:2, maximumFractionDigits:2}); }
function personName(id){ var p = byId(db.people(), id); return p ? val(p.full_name) : "—"; }

/* A latin string dropped into a Hebrew sentence gets reordered by the bidi
 * algorithm: "1-invoice.txt" renders as "invoice.txt-1". Wrapping it in an
 * isolate pins its internal direction without affecting the sentence. These
 * are plain characters, so this also works inside <option>, where markup
 * and dir attributes are unreliable. */
function ltr(s){ return isRTL() ? "⁦" + String(s == null ? "" : s) + "⁩" : s; }

function opts(list, sel, anyKey){
  var h = '<option value="">' + esc(t(anyKey)) + '</option>';
  for (var i=0;i<list.length;i++){
    h += '<option value="' + esc(list[i]) + '"' + (list[i] === sel ? ' selected' : '') + '>'
       + esc(t(list[i])) + '</option>';
  }
  return h;
}
function urgPill(u){
  return '<span class="pill ' + (u === "High" ? "p-hi" : u === "Medium" ? "p-me" : "p-lo") + '">'
       + esc(t(u) || "—") + '</span>';
}
function statusPill(s){
  return '<span class="pill ' + (s === "needs_review" ? "p-rev" : "p-ok") + '">' + esc(t(s)) + '</span>';
}
function priPill(p){
  return '<span class="pill ' + (p === "urgent" ? "p-hi" : p === "high" ? "p-me" : "p-lo") + '">'
       + esc(t(p)) + '</span>';
}
function taskPill(s){
  return '<span class="pill p-' + (s === "working" ? "work" : s === "done" ? "done" : s === "stuck" ? "stuck" : "todo")
       + '">' + esc(t(s)) + '</span>';
}
/* Sentinel values render greyed and italic so a missing field looks missing. */
function nf(v){
  var isSent = (v === "Not found" || v === "No action found" || v == null || v === "");
  if (isSent) return '<span class="notfound">' + esc(sent(v) || "—") + '</span>';
  var s = val(v);
  return esc(/[֐-׿]/.test(s) ? s : ltr(s));
}

/* =============================================================== boot === */

var state = {
  screen: "flow", filters: {},
  sim: { channel:"drive", document_type:"invoice", department:"Finance", urgency:"Medium", amount:"" },
  flowDoc: "d1", mailDoc: "d1"
};

function go(id){ state.screen = id; state.filters = {}; closeSheet(); render(); window.scrollTo(0,0); }
function setF(k, v){ state.filters[k] = v; render(); }
function setSim(k, v){ state.sim[k] = v; render(); }
function setFlowDoc(id){ state.flowDoc = id; render(); }
function setMailDoc(id){ state.mailDoc = id; render(); }

function renderTabs(){
  var h = "";
  for (var i=0;i<SCREENS.length;i++){
    var s = SCREENS[i];
    h += '<button onclick="go(\'' + s.id + '\')" class="' + (state.screen === s.id ? "on" : "") + '">'
       + esc(t(s.key)) + (s.count ? '<b>' + s.count() + '</b>' : '') + '</button>';
  }
  document.getElementById("tabs").innerHTML = h;
}

function render(){
  renderTabs();
  for (var i=0;i<SCREENS.length;i++){
    if (SCREENS[i].id === state.screen){
      document.getElementById("view").innerHTML = SCREENS[i].render();
      return;
    }
  }
}

function closeSheet(){
  document.getElementById("sheet").classList.remove("on");
  document.getElementById("scrim").classList.remove("on");
}

function boot(){
  document.getElementById("langSeg").addEventListener("click", function(e){
    var b = e.target.closest("button[data-lang]"); if (b) setLang(b.dataset.lang);
  });
  document.getElementById("themeSeg").addEventListener("click", function(e){
    var b = e.target.closest("button[data-theme]"); if (!b) return;
    var cur = document.documentElement.getAttribute("data-theme");
    setTheme(cur === b.dataset.theme ? null : b.dataset.theme);
  });
  document.addEventListener("keydown", function(e){ if (e.key === "Escape") closeSheet(); });

  setTheme(store.get("oh.theme", "") || null);
  setLang(store.get("oh.lang", "en"));
}

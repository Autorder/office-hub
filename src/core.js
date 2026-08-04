/* Office Hub - core: language, theme, data layer, business logic.
 * Screen renderers live in screens.js. */

"use strict";

/* ============================================================ i18n ====== */

var T = {
  en: {
    tagline: "Document routing and work queue",
    srcMock: "Mock data", srcLive: "Connected to Supabase",

    resetBtn: "Reset demo data",
    resetBusy: "Resetting…",
    resetAsk: "This deletes every processed document, its task and its notification, "
            + "and clears the log spreadsheet.\n\nPeople and routing rules are kept. "
            + "Files in Office Processed move back to Office Inbox.\n\nContinue?",
    resetOk:  "Cleared. Reloading…",
    resetFail: "Reset failed: ",

    scanBtn:  "Scan inbox",
    scanBusy: "Looking…",
    scanRun:  "Processing {n}…",
    scanNone: "Office Inbox is empty. Drop the files in, then scan again.",
    scanFail: "Scan failed: ",

    emptyTitle: "No documents yet",
    emptyBody:  "Drop files into Office Inbox in Google Drive, then press Scan inbox.",

    navFlow: "Flow", navInbox: "Inbox", navReview: "Needs review", navTasks: "Tasks",
    navEmails: "Emails", navPeople: "People", navRules: "Rules", navDash: "Dashboard",

    /* enum labels */
    drive: "Drive", form: "Form", gmail: "Gmail",
    invoice: "Invoice", request: "Request", report: "Report", complaint: "Complaint",
    contract: "Contract", quote: "Quote", lead: "Lead", cv: "CV", other: "Other",
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
    flowSub: "One document, every stage, real values. Each card names the n8n node that performed it and the workflow it lives in. Pick a different document above and the whole chain is redrawn for it.",
    st1drive: "Google Drive Trigger / Scan webhook", st1form: "Webhook", st1gmail: "Gmail Trigger",
    whatFired: "What fired it", sourceRef: "Source ref", received: "Received",
    firedDrive: "A file appeared in Office Inbox - either the Drive trigger caught it, or the Scan inbox button swept the folder",
    firedForm: "The website form posted to the webhook URL",
    firedGmail: "A new message matched the Gmail query",
    st2drive: "Download - Is it a PDF? - Extract from File", st2other: "Read the payload",
    st2driveB: "The file is downloaded by id, then an IF picks the reader: a PDF goes through the pdf extractor, everything else is read as plain text. Word (.docx) is not a format this node can read - it arrives as ZIP bytes, and the review queue is what catches it.",
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
    st11b: "Moved to Office Processed, so the folder empties and the same file is never read twice.",
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
    rule2: "sender, action and deadline all came back empty",
    rule3: "document_type = other",
    rule4: "urgency = High but deadline = Not found",
    approve: "Approve as is", openFull: "Open full record",
    nothingWaiting: "Nothing is waiting for review.",
    notWired: "Not wired. Approving from here would need a write path, and this page is read-only on purpose.",
    fieldsMissing: "{n} of 3 missing", confIs: "confidence is {c}", typeIs: "type is {t}",

    /* The four phrases WF-4 can write into review_reason. */
    rsConf: "Model confidence is {a}", rsFields: "{a} fields returned Not found",
    rsType: "Document type is {a}",
    rsNoDeadline: "Urgency is High but no deadline appears in the document",

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

    resetBtn: "אפס נתוני הדגמה",
    resetBusy: "מאפס…",
    resetAsk: "הפעולה מוחקת כל מסמך שעובד, את המשימה שלו ואת ההתראה שלו, "
            + "ומנקה את גיליון היומן.\n\nהאנשים וכללי הניתוב נשמרים. "
            + "קבצים ב‑Office Processed יחזרו ל‑Office Inbox.\n\nלהמשיך?",
    resetOk:  "אופס. טוען מחדש…",
    resetFail: "האיפוס נכשל: ",

    scanBtn:  "סרוק תיבה",
    scanBusy: "בודק…",
    scanRun:  "מעבד {n}…",
    scanNone: "התיקייה Office Inbox ריקה. הכניסו קבצים ואז סרקו שוב.",
    scanFail: "הסריקה נכשלה: ",

    emptyTitle: "אין עדיין מסמכים",
    emptyBody:  "הכניסו קבצים לתיקייה Office Inbox בגוגל דרייב ואז לחצו על ״סרוק תיבה״.",

    navFlow: "זרימה", navInbox: "תיבה", navReview: "דורש בדיקה", navTasks: "משימות",
    navEmails: "מיילים", navPeople: "אנשים", navRules: "כללים", navDash: "לוח בקרה",

    drive: "דרייב", form: "טופס", gmail: "ג׳ימייל",
    invoice: "חשבונית", request: "בקשה", report: "דוח", complaint: "תלונה",
    contract: "חוזה", quote: "הצעת מחיר", lead: "ליד", cv: "קורות חיים", other: "אחר",
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
    flowSub: "מסמך אחד, כל התחנות, ערכים אמיתיים. כל כרטיס נושא את שם הצומת ב‑n8n שביצע אותו ואת התהליך שהוא יושב בו. בוחרים מסמך אחר למעלה וכל השרשרת מצוירת מחדש עבורו.",
    st1drive: "טריגר Google Drive / וובהוק הסריקה", st1form: "וובהוק", st1gmail: "טריגר Gmail",
    whatFired: "מה הפעיל", sourceRef: "מזהה מקור", received: "התקבל",
    firedDrive: "קובץ הופיע בתיקייה Office Inbox ‑ או שהטריגר של דרייב תפס אותו, או שכפתור ״סרוק תיבה״ סרק את התיקייה",
    firedForm: "הטופס באתר שלח POST לכתובת הוובהוק",
    firedGmail: "הודעה חדשה תאמה לשאילתת Gmail",
    st2drive: "הורדה ‑ האם זה PDF? ‑ חילוץ מהקובץ", st2other: "קריאת התוכן",
    st2driveB: "הקובץ יורד לפי מזהה, ואז צומת IF בוחר את הקורא: PDF עובר במחלץ ה‑PDF, וכל השאר נקרא כטקסט פשוט. וורד (docx) אינו פורמט שהצומת יודע לקרוא ‑ הוא מגיע כבייטים של ZIP, ותור הבדיקה הוא מה שתופס אותו.",
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
    st11b: "הועבר ל‑Office Processed, כך שהתיקייה מתרוקנת ואותו קובץ לא נקרא פעמיים.",
    st11skip: "דולג. הפריט הזה לא הגיע כקובץ, אז אין מה להעביר.",

    inboxSub: "כל מה שנכנס למשרד, מכל ערוץ, עם השדות שהמודל החזיר. לחיצה על שורה פותחת את החילוץ המלא.",
    cReceived: "התקבל", cFile: "קובץ", cType: "סוג", cSender: "שולח / חברה",
    cDept: "מחלקה", cUrgency: "דחיפות", cDeadline: "תאריך יעד", cAssigned: "אחראי",
    cStatus: "סטטוס", ofTotal: "{a} מתוך {b}",
    noMatch: "אין מסמכים שתואמים לסינון הזה.",

    reviewSub: "התור הזה קיים כדי ששום דבר שהמודל לא היה בטוח בו לא ייעלם בשקט. הפריטים האלה עדיין נשמרו, נותבו ונשלחה עליהם התראה ‑ הם פשוט מסומנים.",
    fourRules: "ארבעת הכללים",
    rule1: "רמת ביטחון נמוכה",
    rule2: "השולח, הפעולה ותאריך היעד ‑ שלושתם חזרו ריקים",
    rule3: "סוג המסמך הוא ״אחר״",
    rule4: "דחיפות גבוהה אבל אין תאריך יעד",
    approve: "לאשר כמו שזה", openFull: "לפתוח את הרשומה המלאה",
    nothingWaiting: "שום דבר לא ממתין לבדיקה.",
    notWired: "לא מחווט. אישור מכאן היה דורש הרשאת כתיבה, והדף הזה הוא לקריאה בלבד במכוון.",
    fieldsMissing: "{n} מתוך 3 חסרים", confIs: "רמת הביטחון {c}", typeIs: "הסוג הוא {t}",

    rsConf: "רמת הביטחון של המודל {a}", rsFields: "{a} שדות חזרו ״לא נמצא״",
    rsType: "סוג המסמך הוא {a}",
    rsNoDeadline: "הדחיפות גבוהה אבל לא מופיע תאריך יעד במסמך",

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
    noAmount: "אין סכום במסמך", amountIs: "הסכום הוא {a}",
    channelIs: "הערוץ הוא {c}", deptIs: "המחלקה היא {d}", urgIs: "הדחיפות {u}",

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

/* People and routing rules are seeded in English and stay that way: n8n reads
 * those rows, the SQL file defines them, and the Google Sheet logs them. One
 * source of truth, translated at the point of display.
 *
 * Anything not in the map falls through unchanged, so a rule added in the
 * Supabase dashboard tomorrow still shows up - in English, but visible. A
 * lookup that threw, or returned the key, would hide it. */
var DBT = {
  he: {
    "Office manager": "מנהלת משרד", "Bookkeeper": "מנהלת חשבונות",
    "Support lead": "ראש צוות תמיכה", "Founder": "מייסד", "Operations": "תפעול",

    "Large invoice goes to the manager": "חשבונית גדולה למנהלת המשרד",
    "Ordinary invoices": "חשבוניות רגילות",
    "Quotes to bookkeeping": "הצעות מחיר להנהלת חשבונות",
    "Urgent complaints to the manager": "תלונות דחופות למנהלת המשרד",
    "Complaints to support": "תלונות לתמיכה",
    "CVs and job applications to HR": "קורות חיים ומועמדויות לכוח אדם",
    "Anything the model marks HR": "כל מה שהמודל מסמן ככוח אדם",
    "Leads from the website form": "לידים מהטופס באתר",
    "Requests to sales": "בקשות למכירות",
    "Reports to management": "דוחות להנהלה",
    "Contracts to management": "חוזים להנהלה",
    "Reports and contracts to management": "דוחות וחוזים להנהלה",
    "Catch-all": "תפס־הכל"
  }
};
function dbt(v){ var s = val(v), m = DBT[LANG]; return (m && m[s]) || s; }

/* WF-4 builds review_reason from four fixed phrases joined with "; ". They are
 * translated here rather than stored twice, because the workflow has to write
 * something a Google Sheet reader can also understand. A phrase this list does
 * not recognise is passed through, which is what happens when the workflow's
 * wording changes before this does - visibly English, never blank. */
var REASONS = [
  [/^Model confidence is (\S+)$/,                                "rsConf"],
  [/^(\d+) fields returned Not found$/,                          "rsFields"],
  [/^Document type is (\S+)$/,                                   "rsType"],
  [/^Urgency is High but no deadline appears in the document$/,  "rsNoDeadline"]
];
function reviewReason(v){
  var s = val(v);
  if (!s) return "";
  if (LANG === "en") return esc(s);
  return esc(s.split("; ").map(function(part){
    for (var i = 0; i < REASONS.length; i++){
      var m = part.match(REASONS[i][0]);
      if (m) return t(REASONS[i][1], { a: m[1] ? t(m[1]) : "" });
    }
    return part;
  }).join("; "));
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
  var rb = document.getElementById("resetBtn");
  if (rb && !rb.disabled) rb.textContent = t("resetBtn");
  var sb = document.getElementById("scanBtn");
  if (sb && !sb.disabled) sb.textContent = t("scanBtn");
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

/* The live source reads the same five tables the n8n workflows write to.
 *
 * Every screen calls db.*() synchronously and expects an array back, so the
 * five tables are fetched once into `live` and served from there. Making the
 * screens async instead would have touched every render function to solve a
 * problem that only exists for a few hundred rows.
 *
 * Reads only. Nothing in this app writes: routing decisions belong to n8n,
 * and a browser that could rewrite routing_rules could redirect where money
 * goes. */

var live = { people:[], routing_rules:[], documents:[], tasks:[], notifications:[] };

var supabaseDb = {
  kind: "live",
  people:        function(){ return live.people.slice(); },
  routingRules:  function(){ return live.routing_rules.slice().sort(function(a,b){ return a.rank - b.rank; }); },
  documents:     function(){ return live.documents.slice().sort(function(a,b){ return a.received_at < b.received_at ? 1 : -1; }); },
  tasks:         function(){ return live.tasks.slice(); },
  notifications: function(){ return live.notifications.slice(); }
};

var db = mockDb;

/* --------------------------------------------------- reset and scan ---- */
/* Both buttons only ask n8n to act. Nothing is written or deleted from here:
 * this page carries the publishable key, which is public by design, and a
 * page that could delete rows on its own would let anyone who opens the URL
 * do the same. WF-5 and WF-6 hold the credentials and do the work. */

/* An https page cannot call http://localhost, so the published site needs the
 * tunnel. Opened locally it should not need one, hence the second URL. */
function hookUrl(name){
  var c = window.OFFICE_HUB_CONFIG || {};
  var local = location.hostname === "localhost" || location.hostname === "127.0.0.1";
  return (local && c["N8N_" + name + "_WEBHOOK_URL_LOCAL"]) || c["N8N_" + name + "_WEBHOOK_URL"] || "";
}
function resetUrl(){ return hookUrl("RESET"); }
function scanUrl(){  return hookUrl("SCAN"); }

function postHook(url){
  return fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", "ngrok-skip-browser-warning": "1" },
    body: "{}"
  }).then(function(r){
    return r.json().catch(function(){ return null; }).then(function(d){
      if (!r.ok || !d || d.success !== true)
        throw new Error((d && (d.message || d.error)) || ("HTTP " + r.status));
      return d;
    });
  });
}

function doReset(){
  var url = resetUrl();
  if (!url || !confirm(t("resetAsk"))) return;

  var btn = document.getElementById("resetBtn");
  btn.disabled = true;
  btn.textContent = t("resetBusy");

  postHook(url).then(function(){
    btn.textContent = t("resetOk");
    /* Reload rather than clear the arrays: the page then shows exactly what
     * the database holds, with no chance of the two drifting apart. */
    location.reload();
  }).catch(function(e){
    alert(t("resetFail") + (e && e.message ? e.message : String(e)));
    btn.disabled = false;
    btn.textContent = t("resetBtn");
  });
}

/* WF-1 reacts to files that arrive after it starts polling. Anything already
 * sitting in Office Inbox, or dropped while n8n was stopped, is invisible to
 * it forever. This is the sweep that catches those. */
function doScan(){
  var url = scanUrl();
  if (!url) return;

  var btn = document.getElementById("scanBtn");
  btn.disabled = true;
  btn.textContent = t("scanBusy");

  /* WF-6 answers as soon as it has counted the folder, before it processes
   * anything — a browser should not sit on an open request while a language
   * model reads six documents. The count is what tells us when to stop
   * waiting. */
  postHook(url).then(function(d){
    var found = Number(d.found) || 0;
    if (!found){
      alert(t("scanNone"));
      btn.disabled = false;
      btn.textContent = t("scanBtn");
      return;
    }
    btn.textContent = t("scanRun", { n: found });
    awaitDocuments(countDocuments() + found);
  }).catch(function(e){
    alert(t("scanFail") + (e && e.message ? e.message : String(e)));
    btn.disabled = false;
    btn.textContent = t("scanBtn");
  });
}

function countDocuments(){ return db.kind === "live" ? live.documents.length : 0; }

/* Poll until the expected rows land, then reload. A document can also fail
 * inside WF-4 — an unreadable scan, a duplicate source_ref — so the target is
 * never guaranteed to arrive. The timeout reloads anyway and lets the page
 * show whatever did make it, which is more honest than spinning forever. */
function awaitDocuments(target){
  var tries = 0, MAX = 45;          /* 45 x 4s = three minutes */
  (function poll(){
    setTimeout(function(){
      fetchTable("documents", "select=id").then(function(rows){
        if (rows.length >= target || ++tries >= MAX) location.reload();
        else poll();
      }).catch(function(){
        if (++tries >= MAX) location.reload(); else poll();
      });
    }, 4000);
  })();
}

function liveConfigured(){
  var c = window.OFFICE_HUB_CONFIG || {};
  return !!(c.SUPABASE_URL && c.SUPABASE_PUBLISHABLE_KEY);
}

function fetchTable(name, query){
  var c = window.OFFICE_HUB_CONFIG;
  var url = c.SUPABASE_URL + "/rest/v1/" + name + "?" + (query || "select=*");
  return fetch(url, { headers: {
    apikey: c.SUPABASE_PUBLISHABLE_KEY,
    Authorization: "Bearer " + c.SUPABASE_PUBLISHABLE_KEY
  }}).then(function(r){
    if (!r.ok) throw new Error(name + ": HTTP " + r.status);
    return r.json();
  });
}

/* Switches to live data, or leaves the demo dataset in place and says why.
 *
 * The test is people, not documents. Zero documents used to mean "stay on the
 * demo set", which was right while there was no way to empty the database on
 * purpose. Now that Reset exists it would be wrong: you would clear everything
 * and the page would answer with eight invented rows, which reads as a reset
 * that failed. Zero people, on the other hand, means the schema was never
 * seeded and this is not the real database. */
function loadLive(){
  if (!liveConfigured()) return Promise.resolve(false);

  return Promise.all([
    fetchTable("people"),
    fetchTable("routing_rules", "select=*&order=rank.asc"),
    fetchTable("documents", "select=*&order=received_at.desc"),
    fetchTable("tasks"),
    fetchTable("notifications")
  ]).then(function(r){
    if (!r[0].length) return false;

    live.people = r[0]; live.routing_rules = r[1];
    live.documents = r[2]; live.tasks = r[3]; live.notifications = r[4];

    /* n8n writes tasks.document_id but never documents.task_id, so the link
     * exists in one direction only. The document sheet reads the other, so
     * fill it in here rather than add a node to the workflow for it. */
    live.documents.forEach(function(d){
      if (d.task_id) return;
      for (var i=0;i<live.tasks.length;i++)
        if (live.tasks[i].document_id === d.id) { d.task_id = live.tasks[i].id; return; }
    });

    db = supabaseDb;
    return true;
  }).catch(function(e){
    if (window.console) console.warn("Live data unavailable, showing the demo set:", e.message);
    return false;
  });
}

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

/* The four review rules. Any one of them alone is enough.
 *
 * Exactly three fields are counted, and they are exactly the three WF-4's
 * `Derive status` node counts. An earlier version also counted an empty
 * summary, which made this screen able to report "4 of 3 missing" for a
 * document the workflow had scored 3 - the simulator disagreeing with the
 * router it exists to predict. The workflow is the record; this follows it. */
function checkDetail(d){
  var missing = 0;
  if (d.sender_or_company === "Not found")       missing++;
  if (d.requested_action  === "No action found") missing++;
  if (d.deadline_text     === "Not found")       missing++;
  return [
    { label:t("rule1"), hit:d.confidence === "Low",      got:t("confIs", {c:t(d.confidence)}) },
    { label:t("rule2"), hit:missing >= 3,                got:t("fieldsMissing", {n:missing}) },
    { label:t("rule3"), hit:d.document_type === "other", got:t("typeIs", {t:t(d.document_type)}) },
    { label:t("rule4"), hit:d.urgency === "High" && d.deadline_text === "Not found",
      got:t(d.urgency) + " / " + ltr(sent(d.deadline_text)) }
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
function personName(id){ var p = byId(db.people(), id); return p ? ltr(val(p.full_name)) : "—"; }

/* A latin string dropped into a Hebrew sentence gets reordered by the bidi
 * algorithm: "1-invoice.txt" renders as "invoice.txt-1". Wrapping it in an
 * isolate pins its internal direction without affecting the sentence. These
 * are plain characters, so this also works inside <option>, where markup
 * and dir attributes are unreliable. */
function ltr(s){ return isRTL() ? "⁦" + String(s == null ? "" : s) + "⁩" : s; }

/* Escape a value that came out of the database rather than the dictionary, and
 * isolate it when it is in the other language.
 *
 * A whole English sentence dropped bare into an RTL paragraph loses its
 * trailing punctuation to the far end: "Total due is 15,576.00 ILS." renders
 * with the full stop on the left, and a summary that ends mid-air reads like a
 * truncation bug. Testing for Hebrew letters rather than for LANG is what lets
 * a Hebrew summary and an English one sit in the same table and both be right. */
function txt(v){
  var s = String(val(v));
  return esc(/[֐-׿]/.test(s) ? s : ltr(s));
}

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
  return txt(v);
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

  /* Draw with the demo set first. The page is usable before the network
   * answers, and stays usable if it never does. */
  var rb = document.getElementById("resetBtn");
  rb.textContent = t("resetBtn");
  rb.addEventListener("click", doReset);

  var sb = document.getElementById("scanBtn");
  sb.textContent = t("scanBtn");
  sb.addEventListener("click", doScan);

  loadLive().then(function(switched){
    if (!switched) return;
    document.getElementById("srcPill").textContent = t("srcLive");
    /* Only offered against the real database. On the demo set there is
     * nothing to reset and nothing a scan could add, so both buttons
     * would just mislead. */
    if (resetUrl()) rb.hidden = false;
    if (scanUrl())  sb.hidden = false;
    render();
  });
}

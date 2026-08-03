/* Office Hub - mock data.
 *
 * Every object here mirrors the exact shape of the Supabase table that will
 * replace it. Same field names, same allowed values. When the real database
 * arrives, only the data source changes - no screen is touched.
 *
 * Free-text fields carry both languages, the way the DailyTask AI seed rows
 * do, so the prototype reads naturally in either direction. Enum values stay
 * English because that is what the database stores; the interface translates
 * them for display.
 *
 * Tables mirrored: people, routing_rules, documents, tasks, notifications
 */

window.OFFICE_HUB_DATA = (function () {
  "use strict";

  var DEPARTMENTS = ["Sales", "Finance", "Support", "HR", "Management", "General"];
  var DOC_TYPES = ["invoice", "request", "report", "complaint", "contract", "quote", "lead", "other"];
  var URGENCIES = ["Low", "Medium", "High"];
  var CHANNELS = ["drive", "form", "gmail"];
  var STATUSES = ["processed", "needs_review"];

  /* ---------------------------------------------------------------- people */

  var people = [
    {
      id: "p1", slug: "dana",
      full_name: { en: "Dana Shani", he: "דנה שני" },
      email: "autorderart+dana@gmail.com",
      role_title: { en: "Office manager", he: "מנהלת משרד" },
      department: "Management",
      is_active: true, away_until: null, backup_person: "p2"
    },
    {
      id: "p2", slug: "yael",
      full_name: { en: "Yael Brenner", he: "יעל ברנר" },
      email: "autorderart+yael@gmail.com",
      role_title: { en: "Bookkeeper", he: "מנהלת חשבונות" },
      department: "Finance",
      is_active: true, away_until: null, backup_person: "p1"
    },
    {
      id: "p3", slug: "omer",
      full_name: { en: "Omer Katz", he: "עומר כץ" },
      email: "autorderart+omer@gmail.com",
      role_title: { en: "Support lead", he: "ראש צוות תמיכה" },
      department: "Support",
      is_active: true, away_until: "2026-08-09", backup_person: "p1"
    },
    {
      id: "p4", slug: "avi",
      full_name: { en: "Avi Haviv", he: "אבי חביב" },
      email: "autorderart@gmail.com",
      role_title: { en: "Founder", he: "מייסד" },
      department: "Sales",
      is_active: true, away_until: null, backup_person: "p1"
    },
    {
      id: "p5", slug: "noa",
      full_name: { en: "Noa Ferber", he: "נועה פרבר" },
      email: "autorderart+noa@gmail.com",
      role_title: { en: "Operations", he: "תפעול" },
      department: "General",
      is_active: true, away_until: null, backup_person: "p1"
    }
  ];

  /* --------------------------------------------------------- routing rules */
  /* A null match field means "do not care". Rules are evaluated by rank,
   * lowest first, and the first rule that matches wins. Rank 99 is the
   * catch-all - without it an item can fall through with no owner. */

  var routing_rules = [
    { id: "r1", rank: 10,
      label: { en: "Large invoice goes to the manager", he: "חשבונית גדולה למנהלת" },
      match_channel: null, match_doc_type: "invoice", match_department: null,
      match_urgency: null, min_amount: 5000, assign_to: "p1", is_active: true },

    { id: "r2", rank: 20,
      label: { en: "Ordinary invoices", he: "חשבוניות רגילות" },
      match_channel: null, match_doc_type: "invoice", match_department: null,
      match_urgency: null, min_amount: null, assign_to: "p2", is_active: true },

    { id: "r3", rank: 25,
      label: { en: "Quotes to bookkeeping", he: "הצעות מחיר להנהלת חשבונות" },
      match_channel: null, match_doc_type: "quote", match_department: null,
      match_urgency: null, min_amount: null, assign_to: "p2", is_active: true },

    { id: "r4", rank: 30,
      label: { en: "Urgent complaints to the manager", he: "תלונות דחופות למנהלת" },
      match_channel: null, match_doc_type: "complaint", match_department: null,
      match_urgency: "High", min_amount: null, assign_to: "p1", is_active: true },

    { id: "r5", rank: 40,
      label: { en: "Complaints to support", he: "תלונות לתמיכה" },
      match_channel: null, match_doc_type: "complaint", match_department: null,
      match_urgency: null, min_amount: null, assign_to: "p3", is_active: true },

    { id: "r6", rank: 50,
      label: { en: "Leads from the website form", he: "לידים מהטופס באתר" },
      match_channel: "form", match_doc_type: null, match_department: null,
      match_urgency: null, min_amount: null, assign_to: "p4", is_active: true },

    { id: "r7", rank: 60,
      label: { en: "Requests to sales", he: "בקשות למכירות" },
      match_channel: null, match_doc_type: "request", match_department: "Sales",
      match_urgency: null, min_amount: null, assign_to: "p4", is_active: true },

    { id: "r8", rank: 70,
      label: { en: "Reports and contracts to management", he: "דוחות וחוזים להנהלה" },
      match_channel: null, match_doc_type: "report", match_department: null,
      match_urgency: null, min_amount: null, assign_to: "p1", is_active: true },

    { id: "r9", rank: 99,
      label: { en: "Catch-all", he: "תפס־הכל" },
      match_channel: null, match_doc_type: null, match_department: null,
      match_urgency: null, min_amount: null, assign_to: "p5", is_active: true }
  ];

  /* ------------------------------------------------------------- documents */
  /* These six mirror the six files in smart-doc-assistant/test-documents.
   * deadline_text stays exactly as the document wrote it - that is the whole
   * point of the field - so it is not translated. */

  var documents = [
    {
      id: "d1",
      channel: "drive",
      source_ref: "1aBcD-drive-file-id-001",
      file_name: "1-invoice-nordwind.txt",
      file_link: "https://drive.google.com/file/d/1aBcD-drive-file-id-001/view",
      received_at: "2026-08-03T09:14:00Z",
      document_type: "invoice",
      sender_or_company: "Nordwind Supplies Ltd.",
      summary: {
        en: "Tax invoice NW-2026-0417 for office chairs, monitor arms and assembly. Total due 4,153.60 ILS including VAT. Payment terms are NET 7 from the invoice date.",
        he: "חשבונית מס NW-2026-0417 עבור כסאות משרד, זרועות למסך והרכבה. סך לתשלום 4,153.60 ש\"ח כולל מע\"מ. תנאי תשלום שוטף 7 מיום הוצאת החשבונית."
      },
      requested_action: {
        en: "Transfer payment and send the confirmation to billing@nordwind-supplies.com",
        he: "לבצע העברה ולשלוח אישור ל־ billing@nordwind-supplies.com"
      },
      deadline_text: "2026-08-04",
      deadline_date: "2026-08-04",
      urgency: "High",
      department: "Finance",
      amount: 4153.6,
      confidence: "High",
      status: "processed",
      review_reason: null,
      assigned_to: "p2",
      matched_rule: "r2",
      task_id: "t1"
    },
    {
      id: "d2",
      channel: "form",
      source_ref: "form-sub-2026-07-30-0042",
      file_name: "Enquiry - BrightPath Tech",
      file_link: "",
      received_at: "2026-07-30T13:02:00Z",
      document_type: "lead",
      sender_or_company: "BrightPath Tech",
      summary: {
        en: "Dana Levi wants to enrol six team members in the AI Engineer Core Track. She asks about a group rate, company invoicing and the autumn cohort start date.",
        he: "דנה לוי מעוניינת לרשום שישה עובדים למסלול AI Engineer Core Track. שואלת על מחיר קבוצתי, חשבונית לחברה ומועד פתיחת מחזור הסתיו."
      },
      requested_action: {
        en: "Reply with group pricing, invoicing options and available cohort dates",
        he: "להשיב עם מחיר קבוצתי, אפשרויות חיוב ומועדים פנויים"
      },
      deadline_text: "Not found",
      deadline_date: null,
      urgency: "Medium",
      department: "Sales",
      amount: null,
      confidence: "High",
      status: "processed",
      review_reason: null,
      assigned_to: "p4",
      matched_rule: "r6",
      task_id: "t2"
    },
    {
      id: "d3",
      channel: "gmail",
      source_ref: "gmail-msg-18f3a7c2b1",
      file_name: "Complaint - order ORD-88214",
      file_link: "",
      received_at: "2026-07-31T16:47:00Z",
      document_type: "complaint",
      sender_or_company: "Margolin & Partners, Accounting",
      summary: {
        en: "Two of four printers arrived damaged and one does not power on. Two support calls went unanswered. This is the third consecutive order with a problem.",
        he: "שניים מתוך ארבעה מדפסים הגיעו פגומים ואחד אינו נדלק. שתי פניות לתמיכה לא נענו. זו ההזמנה השלישית ברצף עם תקלה."
      },
      requested_action: {
        en: "Replace the dead printer, confirm warranty coverage for the damaged units and call the customer back",
        he: "להחליף את המדפסת המתה, לאשר כיסוי אחריות לפגומות ולחזור טלפונית ללקוח"
      },
      deadline_text: "Not found",
      deadline_date: null,
      urgency: "High",
      department: "Support",
      amount: null,
      confidence: "Medium",
      status: "needs_review",
      review_reason: {
        en: "Urgency is High but no deadline appears in the document",
        he: "הדחיפות גבוהה אבל אין במסמך תאריך יעד"
      },
      assigned_to: "p1",
      matched_rule: "r4",
      task_id: "t3"
    },
    {
      id: "d4",
      channel: "drive",
      source_ref: "1aBcD-drive-file-id-004",
      file_name: "4-quotation-alonstudio.txt",
      file_link: "https://drive.google.com/file/d/1aBcD-drive-file-id-004/view",
      received_at: "2026-08-01T08:30:00Z",
      document_type: "quote",
      sender_or_company: "Alon Studio Print & Signage",
      summary: {
        en: "Quotation Q-2026-1188 for banners, foam board signs and brochures. Total 6,307.10 ILS including VAT. Lead time is five working days after written approval.",
        he: "הצעת מחיר Q-2026-1188 עבור באנרים, שלטי קפיץ וחוברות. סך הכל 6,307.10 ש\"ח כולל מע\"מ. זמן אספקה חמישה ימי עסקים מהאישור בכתב."
      },
      requested_action: {
        en: "Decide whether to approve the quotation and return a signed approval",
        he: "להחליט אם לאשר את ההצעה ולהחזיר אישור חתום"
      },
      deadline_text: "Valid for 7 days from the date of issue",
      deadline_date: null,
      urgency: "Medium",
      department: "Finance",
      amount: 6307.1,
      confidence: "High",
      status: "processed",
      review_reason: null,
      assigned_to: "p2",
      matched_rule: "r3",
      task_id: "t4"
    },
    {
      id: "d5",
      channel: "drive",
      source_ref: "1aBcD-drive-file-id-005",
      file_name: "5-internal-report-july.txt",
      file_link: "https://drive.google.com/file/d/1aBcD-drive-file-id-005/view",
      received_at: "2026-08-02T07:05:00Z",
      document_type: "report",
      sender_or_company: "Operations",
      summary: {
        en: "July summary: 38 new enrolments against 31 in June, 214 support messages, spending 4% under budget. Circulated for information only.",
        he: "סיכום יולי: 38 נרשמים חדשים מול 31 ביוני, 214 פניות לתמיכה, והוצאות נמוכות ב־4% מהתקציב. מופץ לידיעה בלבד."
      },
      requested_action: "No action found",
      deadline_text: "Not found",
      deadline_date: null,
      urgency: "Low",
      department: "Management",
      amount: null,
      confidence: "High",
      status: "processed",
      review_reason: null,
      assigned_to: "p1",
      matched_rule: "r8",
      task_id: null
    },
    {
      id: "d6",
      channel: "drive",
      source_ref: "1aBcD-drive-file-id-006",
      file_name: "6-unclear-scan-note.txt",
      file_link: "https://drive.google.com/file/d/1aBcD-drive-file-id-006/view",
      received_at: "2026-08-02T11:34:00Z",
      document_type: "other",
      sender_or_company: "Not found",
      summary: {
        en: "A partial scan. Figures are illegible, the list of items is cut off and the page is unsigned. The subject cannot be determined from this page alone.",
        he: "סריקה חלקית. המספרים אינם קריאים, רשימת הפריטים קטועה והדף אינו חתום. לא ניתן לקבוע במה מדובר מהד׳ הזה לבד."
      },
      requested_action: "No action found",
      deadline_text: "Not found",
      deadline_date: null,
      urgency: "Medium",
      department: "General",
      amount: null,
      confidence: "Low",
      status: "needs_review",
      review_reason: {
        en: "Model confidence is Low; document type is other; 3 fields returned Not found",
        he: "רמת הביטחון נמוכה; סוג המסמך אחר; שלושה שדות חזרו ריקים"
      },
      assigned_to: "p5",
      matched_rule: "r9",
      task_id: "t5"
    }
  ];

  /* ----------------------------------------------------------------- tasks */
  /* Same columns as the existing DailyTask AI table, plus the two nullable
   * columns this project adds: document_id and assigned_to. */

  var tasks = [
    {
      id: "t1",
      title: { en: "Pay invoice NW-2026-0417", he: "לשלם את חשבונית NW-2026-0417" },
      description: {
        en: "Nordwind Supplies, 4,153.60 ILS. Send the transfer confirmation to billing@nordwind-supplies.com.",
        he: "Nordwind Supplies, 4,153.60 ש\"ח. לשלוח אישור העברה ל־ billing@nordwind-supplies.com."
      },
      owner: "yael", status: "working", due_date: "2026-08-04", priority: "urgent",
      ai_summary: {
        en: "Payment is due tomorrow and a late fee applies after that.",
        he: "התשלום למחר, ואחריו נוסף קנס פיגורים."
      },
      document_id: "d1", assigned_to: "p2"
    },
    {
      id: "t2",
      title: { en: "Reply to BrightPath Tech enquiry", he: "להשיב לפניית BrightPath Tech" },
      description: {
        en: "Six participants. Send group pricing, company invoicing terms and autumn cohort dates.",
        he: "שישה משתתפים. לשלוח מחיר קבוצתי, תנאי חיוב לחברה ומועדי מחזור הסתיו."
      },
      owner: "avi", status: "todo", due_date: "2026-08-05", priority: "high",
      ai_summary: {
        en: "They are comparing two programmes, so a slow reply loses the deal.",
        he: "הם משווים בין שני מסלולים, אז תשובה איטית מפסידה את העסקה."
      },
      document_id: "d2", assigned_to: "p4"
    },
    {
      id: "t3",
      title: { en: "Resolve the Margolin printer complaint", he: "לטפל בתלונת המדפסות של מרגולין" },
      description: {
        en: "Replace the dead unit, confirm warranty on the two damaged ones, and call the customer back.",
        he: "להחליף את היחידה המתה, לאשר אחריות על השתיים הפגומות, ולחזור ללקוח."
      },
      owner: "dana", status: "stuck", due_date: null, priority: "urgent",
      ai_summary: {
        en: "Third failed order for a six-year customer. No deadline was given.",
        he: "ההזמנה השלישית שנכשלת ללקוח ותיק שש שנים. לא ניתן תאריך יעד."
      },
      document_id: "d3", assigned_to: "p1"
    },
    {
      id: "t4",
      title: { en: "Decide on the Alon Studio quotation", he: "להחליט על הצעת המחיר של סטודיו אלון" },
      description: {
        en: "6,307.10 ILS for banners, signs and brochures. The quote expires seven days after 2026-08-01.",
        he: "6,307.10 ש\"ח עבור באנרים, שלטים וחוברות. ההצעה פגה שבעה ימים אחרי 2026-08-01."
      },
      owner: "yael", status: "todo", due_date: "2026-08-08", priority: "medium",
      ai_summary: {
        en: "The price is only held for a week, so the decision cannot wait.",
        he: "המחיר נשמר שבוע בלבד, אז ההחלטה לא יכולה לחכות."
      },
      document_id: "d4", assigned_to: "p2"
    },
    {
      id: "t5",
      title: { en: "Identify the unreadable scan", he: "לזהות את הסריקה הלא קריאה" },
      description: {
        en: "Partial scan with illegible figures and no signature. Find the original before filing.",
        he: "סריקה חלקית עם מספרים לא קריאים וללא חתימה. למצוא את המקור לפני תיוק."
      },
      owner: "noa", status: "todo", due_date: null, priority: "low",
      ai_summary: {
        en: "Nothing could be extracted reliably. A person has to look at the source.",
        he: "לא היה ניתן לחלץ שום דבר באמינות. צריך שאדם יסתכל על המקור."
      },
      document_id: "d6", assigned_to: "p5"
    }
  ];

  /* --------------------------------------------------------- notifications */

  var notifications = [
    { id: "n1", document_id: "d1", kind: "urgent", to_email: "autorderart+yael@gmail.com", sent_at: "2026-08-03T09:14:22Z", ok: true },
    { id: "n2", document_id: "d2", kind: "normal", to_email: "autorderart@gmail.com",      sent_at: "2026-07-30T13:02:31Z", ok: true },
    { id: "n3", document_id: "d3", kind: "urgent", to_email: "autorderart+dana@gmail.com", sent_at: "2026-07-31T16:47:12Z", ok: true },
    { id: "n4", document_id: "d4", kind: "normal", to_email: "autorderart+yael@gmail.com", sent_at: "2026-08-01T08:30:19Z", ok: true },
    { id: "n5", document_id: "d5", kind: "normal", to_email: "autorderart+dana@gmail.com", sent_at: "2026-08-02T07:05:08Z", ok: true },
    { id: "n6", document_id: "d6", kind: "normal", to_email: "autorderart+noa@gmail.com",  sent_at: "2026-08-02T11:34:44Z", ok: true }
  ];

  return {
    DEPARTMENTS: DEPARTMENTS, DOC_TYPES: DOC_TYPES, URGENCIES: URGENCIES,
    CHANNELS: CHANNELS, STATUSES: STATUSES,
    people: people, routing_rules: routing_rules, documents: documents,
    tasks: tasks, notifications: notifications
  };
})();

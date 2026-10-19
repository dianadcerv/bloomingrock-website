export const CHECKLIST_TITLE = "Pre-quote checklist";

export const CHECKLIST_INTRO =
  "Before anyone opens the quoting sheet, get these details in one place. If a line is blank, ask the customer before you price the job.";

export const CHECKLIST_SECTIONS = [
  {
    title: "Drawings and files",
    items: [
      "Latest drawing or print, saved in the job folder with a clear file name",
      "Revision letter or date, confirmed with the customer (not guessed from the file name)",
      "CAD or native files, if the customer has them",
      "Photos or sketches, if that's how the request started",
    ],
  },
  {
    title: "Job basics",
    items: [
      "What the part or job is, in plain words",
      "Quantity, plus any other quantities they want priced",
      'Material spec or grade, or "customer supplies"',
      "Tolerances or critical dimensions called out on the print or in notes",
      "Finish, coating, heat treat, or other secondary ops",
    ],
  },
  {
    title: "Timing and delivery",
    items: [
      'Due date, and whether it\'s a firm date or "whenever you can"',
      "Ship-to or pickup, plus any access or delivery limits",
    ],
  },
  {
    title: "Contact",
    items: [
      "Who asked for the quote and what their role is",
      "Best email and phone for follow-up questions",
      "PO or reference number, if they gave one",
    ],
  },
] as const;

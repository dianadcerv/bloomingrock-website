/** DRAFT pending Vera — printable pre-quote checklist for custom fab / machine shops */

export const CHECKLIST_TITLE = "Pre-quote checklist";

export const CHECKLIST_INTRO =
  "Before anyone opens the quoting sheet, gather these details in one place. If a line is blank, ask the customer before you price the job.";

export const CHECKLIST_SECTIONS = [
  {
    title: "Drawings and files",
    items: [
      "Latest drawing or print, saved in the job folder with a clear file name",
      "Revision letter or date, confirmed with the customer (not guessed from the file name)",
      "CAD or native files, if the customer has them",
      "Photos or sketches, if that’s how the request started",
    ],
  },
  {
    title: "Job basics",
    items: [
      "Part or job description in plain language",
      "Quantity, plus any alternate quantities they asked you to price",
      "Material spec, grade, or “customer supplies”",
      "Tolerances or critical dimensions called out on the print or in notes",
      "Finish, coating, heat treat, or secondary ops",
    ],
  },
  {
    title: "Timing and delivery",
    items: [
      "Due date — firm need date vs. “whenever you can”",
      "Ship-to or pickup, and any access or delivery constraints",
    ],
  },
  {
    title: "Contact",
    items: [
      "Who requested the quote and their role",
      "Best email and phone for follow-up questions",
      "Purchase order or reference number, if they gave one",
    ],
  },
] as const;

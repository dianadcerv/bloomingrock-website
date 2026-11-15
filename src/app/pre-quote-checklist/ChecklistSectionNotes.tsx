import {
  CHECKLIST_SECTION_NOTES_LABEL,
  CHECKLIST_SECTION_NOTES_LINE_COUNT,
} from "./checklist-content";
import { ChecklistRuleLine } from "./ChecklistRuleLine";

export function ChecklistSectionNotes() {
  return (
    <div className="checklist-doc__notes">
      <span className="checklist-doc__notes-label">
        {CHECKLIST_SECTION_NOTES_LABEL}
      </span>
      <div className="checklist-doc__notes-lines" aria-hidden="true">
        {Array.from({ length: CHECKLIST_SECTION_NOTES_LINE_COUNT }, (_, index) => (
          <div key={index} className="checklist-doc__notes-line">
            <ChecklistRuleLine />
          </div>
        ))}
      </div>
    </div>
  );
}
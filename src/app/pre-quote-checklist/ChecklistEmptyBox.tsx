/** Empty checklist square — inline SVG so borders survive print/PDF. */
export function ChecklistEmptyBox() {
  return (
    <svg
      className="checklist-doc__empty-box"
      viewBox="0 0 20 20"
      aria-hidden="true"
      focusable="false"
    >
      <rect
        x="1"
        y="1"
        width="18"
        height="18"
        rx="2"
        fill="#ffffff"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <polyline
        className="checklist-doc__empty-box-check"
        points="5.5,10.5 8.5,13.5 14.5,7.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
/** Horizontal rule — inline SVG so the stroke survives print/PDF. */
export function ChecklistRuleLine() {
  return (
    <svg
      className="checklist-doc__rule-line"
      viewBox="0 0 400 2"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <line
        x1="0"
        y1="1"
        x2="400"
        y2="1"
        className="checklist-doc__rule-line-stroke"
        fill="none"
        strokeWidth="1"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
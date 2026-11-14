"use client";

const THREAD_REPLY_ROWS = 9;

export function WorkflowChangeThreadReply({
  value,
  onChange,
  onPost,
}: {
  value: string;
  onChange: (next: string) => void;
  onPost: () => void;
}) {
  const trimmed = value.trim();

  return (
    <div className="portal-wf-change__reply">
      <label className="look-field portal-wf-thread-reply__field">
        <span className="look-field__label">Add to thread</span>
        <textarea
          className="look-field__input look-field__input--area portal-wf-thread-reply__input"
          rows={THREAD_REPLY_ROWS}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </label>
      <button
        type="button"
        className="btn btn--primary"
        disabled={!trimmed}
        onClick={onPost}
      >
        Post comment
      </button>
    </div>
  );
}
"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type DemoNote = { id: string; text: string };

type DemoNotesContextValue = {
  register: (id: string, text: string) => void;
  unregister: (id: string) => void;
};

const DemoNotesContext = createContext<DemoNotesContextValue | null>(null);

/** Strip internal ticket IDs from demo copy shown to users. */
export function formatDemoNote(text: string) {
  return text
    .replace(/^(W[\d.]+(?:\s*\/\s*BLO-\d+)?|BLO-\d+)\s*[—–-]\s*/i, "")
    .replace(/\s*\(BLO-\d+[^)]*\)/gi, "")
    .trim();
}

export function DemoNotesProvider({ children }: { children: ReactNode }) {
  const [notes, setNotes] = useState<DemoNote[]>([]);

  const register = useCallback((id: string, text: string) => {
    const formatted = formatDemoNote(text);
    if (!formatted) return;
    setNotes((prev) => {
      const without = prev.filter((n) => n.id !== id);
      return [...without, { id, text: formatted }];
    });
  }, []);

  const unregister = useCallback((id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const value = useMemo(() => ({ register, unregister }), [register, unregister]);

  return (
    <DemoNotesContext.Provider value={value}>
      {children}
      <DemoNotesDrawer notes={notes} />
    </DemoNotesContext.Provider>
  );
}

function useDemoNotes() {
  const ctx = useContext(DemoNotesContext);
  if (!ctx) {
    return {
      register: () => {},
      unregister: () => {},
    };
  }
  return ctx;
}

export function OpenQuestion({ children }: { children: ReactNode }) {
  const reactId = useId();
  const { register, unregister } = useDemoNotes();
  const text = typeof children === "string" ? children : String(children);

  useEffect(() => {
    register(reactId, text);
    return () => unregister(reactId);
  }, [reactId, text, register, unregister]);

  return null;
}

function DemoNotesDrawer({ notes }: { notes: DemoNote[] }) {
  const [open, setOpen] = useState(false);
  if (!notes.length) return null;

  return (
    <div className={`portal-demo-notes${open ? " is-open" : ""}`}>
      <button
        type="button"
        className="portal-demo-notes__toggle"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        Demo notes ({notes.length})
      </button>
      {open ? (
        <div className="portal-demo-notes__panel" role="region" aria-label="Demo notes">
          <p className="look-field__hint">
            Internal product questions for the team — hidden from prospect demos by default.
          </p>
          <ul className="portal-plain">
            {notes.map((note) => (
              <li key={note.id}>{note.text}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

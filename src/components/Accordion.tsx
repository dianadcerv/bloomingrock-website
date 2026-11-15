import type { ReactNode } from "react";

export type AccordionItem = {
  num: string;
  title: string;
  meta?: string;
  body: ReactNode;
  defaultOpen?: boolean;
};

export function Accordion({ items }: { items: AccordionItem[] }) {
  return (
    <div className="acc">
      {items.map((item) => (
        <details key={item.title} open={item.defaultOpen}>
          <summary>
            <span className="n">{item.num}</span>
            <span className="t">{item.title}</span>
            {item.meta ? <span className="meta">{item.meta}</span> : <span className="meta" />}
            <span className="plus" aria-hidden="true">
              +
            </span>
          </summary>
          <div className="body">{item.body}</div>
        </details>
      ))}
    </div>
  );
}

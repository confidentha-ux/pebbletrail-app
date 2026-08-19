import type { ReactNode } from "react";

interface ChoiceListProps<T extends string> {
  items: { id: T; label: string; detail?: ReactNode }[];
  selected?: T;
  onSelect: (id: T) => void;
}

export function ChoiceList<T extends string>({ items, selected, onSelect }: ChoiceListProps<T>) {
  return <div className="choice-list">
    {items.map((item, index) => <button key={item.id} className={selected === item.id ? "choice selected" : "choice"} onClick={() => onSelect(item.id)}>
      <span className="choice-letter">{String.fromCharCode(65 + index)}</span>
      <span className="choice-copy"><strong>{item.label}</strong>{item.detail && <small>{item.detail}</small>}</span>
      <span className="choice-check">{selected === item.id ? "✓" : ""}</span>
    </button>)}
  </div>;
}

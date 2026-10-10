import { useEffect, useState } from "react";

/** Number field that can be cleared while typing; only valid positive numbers reach onValue. */
export function NumberInput({ id, value, onValue, className }: { id?: string; value: number; onValue: (n: number) => void; className?: string }) {
  const [text, setText] = useState(String(value));

  useEffect(() => {
    setText((t) => (Number(t) === value ? t : String(value)));
  }, [value]);

  return (
    <input
      id={id}
      type="number"
      inputMode="decimal"
      min={0}
      step="any"
      value={text}
      onChange={(e) => {
        setText(e.target.value);
        const n = Number(e.target.value);
        if (e.target.value !== "" && Number.isFinite(n) && n > 0) onValue(n);
      }}
      onBlur={() => {
        const n = Number(text);
        if (text === "" || !Number.isFinite(n) || n <= 0) setText(String(value));
      }}
      className={className}
    />
  );
}

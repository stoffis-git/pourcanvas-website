import type { MaterialProCon } from "../../content/types";

interface Props {
  data: MaterialProCon;
}

export const MaterialProConBlock = ({ data }: Props) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
    <div className="rounded-lg border border-green-200 bg-green-50 p-5">
      <h3 className="text-sm font-semibold text-green-800 uppercase tracking-wide mb-3">Pros</h3>
      <ul className="space-y-2">
        {data.pros.map((pro) => (
          <li key={pro} className="flex gap-2 text-sm text-green-900">
            <span className="mt-0.5 shrink-0">+</span>
            <span>{pro}</span>
          </li>
        ))}
      </ul>
    </div>
    <div className="rounded-lg border border-red-200 bg-red-50 p-5">
      <h3 className="text-sm font-semibold text-red-800 uppercase tracking-wide mb-3">Cons</h3>
      <ul className="space-y-2">
        {data.cons.map((con) => (
          <li key={con} className="flex gap-2 text-sm text-red-900">
            <span className="mt-0.5 shrink-0">−</span>
            <span>{con}</span>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

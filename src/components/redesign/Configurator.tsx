import { useRef, useState } from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { Upload, Wand2, Check, Lock, X } from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import Paywall from "./Paywall";

const CDN = "/studio";

const EXAMPLES = [
  { label: "Cracked walkway", url: `${CDN}/example-cracked-walkway.jpg` },
  { label: "Cracked slab", url: `${CDN}/example-cracked-slab.jpg` },
  { label: "Weathered patio", url: `${CDN}/example-weathered-concrete.jpg` },
];

const SURFACES = [
  "Patio",
  "Driveway",
  "Walkway",
  "Pool Deck",
  "Front Entry",
  "Backyard",
  "Courtyard",
  "Garden Path",
  "Steps & Stoop",
];

const MODES = [
  { value: "faithful", label: "Faithful Finish", hint: "Keep the layout, swap the surface" },
  { value: "creative", label: "Creative Concrete", hint: "Reimagine the whole space" },
];

const FINISHES = [
  { id: "stamped", label: "Stamped Concrete", img: "inspiration-grey-stamped-patio.jpg" },
  { id: "exposed", label: "Exposed Aggregate", img: "inspiration-exposed-aggregate-patio-charcoal.jpg" },
  { id: "stained", label: "Acid-Stained", img: "inspiration-acid-stained-concrete-patio.jpg" },
  { id: "ashlar", label: "Ashlar Slate", img: "inspiration-ashlar-slate-patio-charcoal.jpg" },
  { id: "cobble", label: "Cobblestone", img: "inspiration-cobblestone-stamped-patio.jpg" },
  { id: "flagstone", label: "Flagstone", img: "inspiration-flagstone-patio-grey.jpg" },
  { id: "salt", label: "Salt Finish", img: "inspiration-charcoal-salt-finish-patio.jpg" },
  { id: "herringbone", label: "Herringbone Brick", img: "inspiration-herringbone-brick-patio-colonial.jpg" },
  { id: "broom", label: "Smooth Broom", img: "inspiration-concrete-patio-ideas-modern-grey.jpg" },
];

const INTERVENTION = ["Subtle", "Light", "Moderate", "Bold"];

const AMBER = "#e0a45e";

const labelCls = "text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-400";

const Configurator = () => {
  const [source, setSource] = useState<string | null>(null);
  const [surface, setSurface] = useState("Patio");
  const [mode, setMode] = useState("faithful");
  const [finish, setFinish] = useState("stamped");
  const [finishEnabled, setFinishEnabled] = useState(false);
  const [numDesigns, setNumDesigns] = useState(2);
  const [intervention, setIntervention] = useState(1);
  const [customOn, setCustomOn] = useState(false);
  const [customText, setCustomText] = useState("");
  const [paywall, setPaywall] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(f: File) {
    if (!f.type.startsWith("image/")) return;
    setSource(URL.createObjectURL(f));
  }

  function generate() {
    if (!source) {
      toast.error("Choose a source photo first", {
        description: "Pick an example or upload a photo of your space.",
      });
      return;
    }
    setPaywall(true);
  }

  return (
    <div
      id="redesign"
      className="relative rounded-[2rem] p-1.5 shadow-2xl shadow-black/40"
      style={{ background: "linear-gradient(160deg,#2a2a30,#161619)" }}
    >
      <div className="rounded-[1.7rem] bg-[#161619] ring-1 ring-white/[0.06]">
        {/* Top bar */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <span
              className="flex h-7 w-7 items-center justify-center rounded-lg"
              style={{ background: `${AMBER}22` }}
            >
              <Wand2 className="h-4 w-4" style={{ color: AMBER }} />
            </span>
            <span className="font-display text-sm font-semibold tracking-tight text-zinc-100">
              Concrete Studio
            </span>
          </div>
          <span className="text-[11px] font-medium text-zinc-500">AI surface visualizer</span>
        </div>

        <div className="space-y-7 p-6">
          {/* STEP 1 — source image */}
          <section>
            <div className="mb-3 flex items-center gap-2">
              <StepDot n={1} />
              <h3 className="text-sm font-semibold text-zinc-100">Choose your space</h3>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              {EXAMPLES.map((ex) => (
                <button
                  key={ex.url}
                  onClick={() => setSource(ex.url)}
                  className={`group relative aspect-[4/3] overflow-hidden rounded-xl ring-1 transition-all ${
                    source === ex.url ? "ring-2" : "ring-white/10 hover:ring-white/25"
                  }`}
                  style={source === ex.url ? { boxShadow: `0 0 0 2px ${AMBER}` } : undefined}
                >
                  <img src={ex.url} alt={ex.label} loading="lazy" className="h-full w-full object-cover" />
                  <span className="absolute bottom-1 left-1.5 text-[10px] font-medium text-white/90 drop-shadow">
                    {ex.label}
                  </span>
                  {source === ex.url && (
                    <span
                      className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full"
                      style={{ background: AMBER }}
                    >
                      <Check className="h-3 w-3 text-black" />
                    </span>
                  )}
                </button>
              ))}
            </div>

            <div className="my-3 flex items-center gap-3">
              <div className="h-px flex-1 bg-white/[0.07]" />
              <span className="text-[11px] font-medium text-zinc-500">OR</span>
              <div className="h-px flex-1 bg-white/[0.07]" />
            </div>

            <div
              onClick={source ? undefined : () => inputRef.current?.click()}
              onDrop={(e) => {
                e.preventDefault();
                const f = e.dataTransfer.files[0];
                if (f) handleFile(f);
              }}
              onDragOver={(e) => e.preventDefault()}
              className={`relative flex flex-col items-center justify-center rounded-xl border border-dashed border-white/15 bg-white/[0.02] px-4 py-7 text-center transition-colors ${
                source ? "" : "cursor-pointer hover:border-white/30 hover:bg-white/[0.04]"
              }`}
            >
              {source ? (
                <>
                  <img src={source} alt="Selected space" className="max-h-44 rounded-lg object-contain" />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSource(null);
                    }}
                    aria-label="Remove photo"
                    className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-black/80"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      inputRef.current?.click();
                    }}
                    className="mt-3 text-xs text-zinc-400 underline-offset-2 transition-colors hover:text-zinc-200 hover:underline"
                  >
                    Replace with your own photo
                  </button>
                </>
              ) : (
                <>
                  <Upload className="mb-2 h-5 w-5 text-zinc-500" />
                  <p className="text-sm text-zinc-300">Drop a photo, or click to upload</p>
                  <p className="mt-0.5 text-xs text-zinc-500">JPEG, PNG or WebP — your patio, driveway or yard</p>
                </>
              )}
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleFile(f);
                }}
              />
            </div>
          </section>

          {/* STEP 2 — customize */}
          <section>
            <div className="mb-4 flex items-center gap-2">
              <StepDot n={2} />
              <h3 className="text-sm font-semibold text-zinc-100">Customize your design</h3>
            </div>

            <div className="space-y-4">
              <Field label="Surface type">
                <Select value={surface} onValueChange={setSurface}>
                  <SelectTrigger className={triggerCls}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className={contentCls}>
                    {SURFACES.map((s) => (
                      <SelectItem key={s} value={s} className={itemCls}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field label="Mode">
                <Select value={mode} onValueChange={setMode}>
                  <SelectTrigger className={triggerCls}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className={contentCls}>
                    {MODES.map((m) => (
                      <SelectItem key={m.value} value={m.value} className={itemCls}>
                        {m.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="mt-1.5 text-[11px] text-zinc-500">
                  {MODES.find((m) => m.value === mode)?.hint}
                </p>
              </Field>
            </div>

            {/* Finish picker — optional, off by default */}
            <div className="mt-4 rounded-xl bg-white/[0.03] p-3.5 ring-1 ring-white/[0.06]">
              <label className="flex cursor-pointer items-center justify-between">
                <span className="text-sm font-medium text-zinc-200">
                  Pick a specific finish <span className="font-normal text-zinc-500">(optional)</span>
                </span>
                <Switch
                  checked={finishEnabled}
                  onCheckedChange={setFinishEnabled}
                  className="data-[state=checked]:bg-[#e0a45e]"
                />
              </label>

              {!finishEnabled ? (
                <p className="mt-2 text-xs text-zinc-500">
                  Leave this off and the AI matches the best-looking finish to your space.
                </p>
              ) : (
                <div className="mt-3 grid grid-cols-3 gap-2.5">
                  {FINISHES.map((f) => {
                    const active = finish === f.id;
                    return (
                      <button
                        key={f.id}
                        onClick={() => setFinish(f.id)}
                        className={`group relative overflow-hidden rounded-xl ring-1 transition-all ${
                          active ? "ring-2" : "ring-white/10 hover:ring-white/25"
                        }`}
                        style={active ? { boxShadow: `0 0 0 2px ${AMBER}` } : undefined}
                      >
                        <div className="aspect-[5/3] w-full">
                          <img
                            src={`${CDN}/${f.img}`}
                            alt={f.label}
                            loading="lazy"
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                        <span className="absolute bottom-1 left-2 right-2 text-left text-[11px] font-medium leading-tight text-white">
                          {f.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {/* Number of designs */}
              <Field label="Number of designs">
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4].map((n) => (
                    <button
                      key={n}
                      onClick={() => setNumDesigns(n)}
                      className={`flex-1 rounded-lg py-2 text-sm font-medium transition-colors ${
                        numDesigns === n
                          ? "text-black"
                          : "bg-white/[0.04] text-zinc-400 ring-1 ring-white/10 hover:bg-white/[0.08]"
                      }`}
                      style={numDesigns === n ? { background: AMBER } : undefined}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </Field>

              {/* Intervention slider */}
              <Field label="AI intervention">
                <div className="pt-1.5">
                  <SliderPrimitive.Root
                    className="relative flex w-full touch-none select-none items-center"
                    min={0}
                    max={3}
                    step={1}
                    value={[intervention]}
                    onValueChange={(v) => setIntervention(v[0])}
                  >
                    <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-white/10">
                      <SliderPrimitive.Range className="absolute h-full" style={{ background: AMBER }} />
                    </SliderPrimitive.Track>
                    <SliderPrimitive.Thumb
                      className="block h-4 w-4 rounded-full border-2 bg-[#161619] shadow focus-visible:outline-none"
                      style={{ borderColor: AMBER }}
                    />
                  </SliderPrimitive.Root>
                  <div className="mt-2 flex justify-between text-[10px] text-zinc-500">
                    {INTERVENTION.map((l, i) => (
                      <span
                        key={l}
                        className={i === intervention ? "font-semibold" : ""}
                        style={i === intervention ? { color: AMBER } : undefined}
                      >
                        {l}
                      </span>
                    ))}
                  </div>
                </div>
              </Field>
            </div>

            {/* Custom instructions */}
            <div className="mt-4 rounded-xl bg-white/[0.03] p-3.5 ring-1 ring-white/[0.06]">
              <label className="flex cursor-pointer items-center justify-between">
                <span className="text-sm font-medium text-zinc-200">Custom AI instructions</span>
                <Switch
                  checked={customOn}
                  onCheckedChange={setCustomOn}
                  className="data-[state=checked]:bg-[#e0a45e]"
                />
              </label>
              {customOn && (
                <Textarea
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  placeholder="e.g. warm buff tones, a soldier-course border, and a fire-pit seating area"
                  className="mt-3 min-h-[64px] resize-none border-white/10 bg-white/[0.03] text-sm text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-1 focus-visible:ring-[#e0a45e]"
                />
              )}
            </div>
          </section>
        </div>

        {/* Generate */}
        <div className="border-t border-white/[0.06] p-4">
          <button
            onClick={generate}
            className="group flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-base font-semibold text-black transition-transform active:scale-[0.99]"
            style={{ background: `linear-gradient(135deg, ${AMBER}, #e8b87a)` }}
          >
            <Wand2 className="h-5 w-5" />
            Generate my design
          </button>
          <p className="mt-2.5 flex items-center justify-center gap-1.5 text-center text-[11px] text-zinc-500">
            <Lock className="h-3 w-3" />
            No account needed to preview — pay only when you love the result.
          </p>
        </div>
      </div>

      <Paywall open={paywall} onOpenChange={setPaywall} />
    </div>
  );
};

function StepDot({ n }: { n: number }) {
  return (
    <span
      className="flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold text-black"
      style={{ background: AMBER }}
    >
      {n}
    </span>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <span className={labelCls}>{label}</span>
      <div className="mt-2">{children}</div>
    </div>
  );
}

const triggerCls =
  "h-11 w-full rounded-lg border-white/10 bg-white/[0.04] px-3 text-sm text-zinc-100 ring-offset-0 focus:ring-1 focus:ring-[#e0a45e] data-[placeholder]:text-zinc-500";
const contentCls = "border-white/10 bg-[#1f1f23] text-zinc-100";
const itemCls = "text-zinc-200 focus:bg-white/[0.07] focus:text-white";

export default Configurator;

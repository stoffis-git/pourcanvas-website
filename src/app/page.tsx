"use client";

import { useRef, useState } from "react";
import { STYLES } from "../styles/configs";

// v1→v2: removed MaskOverlay, MaskTricolor components and maskUrl state
// Results view is now a clean 2-column grid (input | output)

type State = "idle" | "selected" | "generating" | "done" | "error";

function compressImage(file: File): Promise<{ base64: string; mediaType: string; width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const MAX = 2000;
      let { width, height } = img;
      if (width > MAX || height > MAX) {
        const scale = MAX / Math.max(width, height);
        width = Math.round(width * scale);
        height = Math.round(height * scale);
      }
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      canvas.getContext("2d")!.drawImage(img, 0, 0, width, height);
      const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
      resolve({ base64: dataUrl.split(",")[1], mediaType: "image/jpeg", width, height });
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

export default function Home() {
  const [state, setState] = useState<State>("idle");
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedStyleId, setSelectedStyleId] = useState<string>(STYLES[0].id);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(f: File) {
    if (!f.type.startsWith("image/")) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setOutputUrl(null);
    setError(null);
    setState("selected");
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }

  async function generate() {
    if (!file) return;
    setState("generating");
    setError(null);
    setOutputUrl(null);

    try {
      const { base64, mediaType, width, height } = await compressImage(file);

      const res = await fetch("/api/redesign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64: base64,
          mimeType: mediaType,
          imageWidth: width,
          imageHeight: height,
          styleId: selectedStyleId,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Generation failed");

      setOutputUrl(data.url);
      setState("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setState("error");
    }
  }

  const showUpload = state === "idle" || state === "selected" || state === "error";

  return (
    <main className="max-w-5xl mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight mb-2">PourCanvas</h1>
        <p className="text-gray-400">Upload a photo of your outdoor space and see what it could become.</p>
      </div>

      {showUpload && (
        <div
          className="border-2 border-dashed border-gray-700 rounded-xl p-10 text-center cursor-pointer hover:border-gray-500 transition-colors mb-6"
          onClick={() => inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          {preview ? (
            <img src={preview} alt="Selected" className="max-h-64 mx-auto rounded-lg object-contain" />
          ) : (
            <div className="text-gray-500">
              <p className="text-lg mb-1">Drop a garden or patio photo here</p>
              <p className="text-sm">or click to browse — JPEG, PNG, WebP</p>
            </div>
          )}
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
          />
        </div>
      )}

      {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

      {state === "selected" && (
        <div className="mb-6">
          <p className="text-xs uppercase tracking-widest text-gray-500 mb-3">Style</p>
          <div className="flex gap-3 flex-wrap mb-6">
            {STYLES.map((style) => (
              <button
                key={style.id}
                onClick={() => setSelectedStyleId(style.id)}
                className={`px-4 py-2 rounded-lg text-sm border transition-colors ${
                  selectedStyleId === style.id
                    ? "border-white text-white"
                    : "border-gray-700 text-gray-500 hover:border-gray-500"
                }`}
              >
                {style.label}
              </button>
            ))}
          </div>
          <button
            onClick={generate}
            className="bg-white text-black font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Generate inspiration
          </button>
        </div>
      )}

      {state === "generating" && (
        <div className="text-center py-20">
          <p className="text-gray-300 text-lg animate-pulse">Redesigning your space…</p>
          <p className="text-gray-600 text-sm mt-2">~30s</p>
        </div>
      )}

      {state === "done" && preview && outputUrl && (
        <div>
          <div className="grid grid-cols-2 gap-4 items-start">
            <div>
              <p className="text-xs uppercase tracking-widest text-gray-500 mb-2">Your photo</p>
              <img src={preview} alt="Input" className="w-full rounded-xl object-cover" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-gray-500 mb-2">
                {STYLES.find((s) => s.id === selectedStyleId)?.label}
              </p>
              <img src={outputUrl} alt="Redesign" className="w-full rounded-xl object-cover" />
              <a
                href={outputUrl}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block text-xs text-gray-400 hover:text-white transition-colors"
              >
                Download
              </a>
            </div>
          </div>

          <div className="mt-8 flex gap-3">
            <button
              onClick={generate}
              className="border border-gray-700 text-gray-300 px-5 py-2.5 rounded-lg hover:border-gray-500 transition-colors text-sm"
            >
              Regenerate
            </button>
            <button
              onClick={() => { setFile(null); setPreview(null); setOutputUrl(null); setState("idle"); }}
              className="border border-gray-700 text-gray-500 px-5 py-2.5 rounded-lg hover:border-gray-500 transition-colors text-sm"
            >
              Try another photo
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

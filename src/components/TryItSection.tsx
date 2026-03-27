import { Upload, ImagePlus, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useCallback } from "react";

const TryItSection = () => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    // Future: handle file upload
  }, []);

  return (
    <section id="try-it" className="section-padding">
      <div className="max-w-4xl mx-auto">
        <div className="text-center max-w-xl mx-auto mb-8">
          <p className="text-sm font-display font-medium text-muted-foreground uppercase tracking-widest mb-3">
            Try It Now
          </p>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-3">
            Upload Your Space
          </h2>
          <p className="font-body text-muted-foreground leading-relaxed">
            Drop a photo of your patio, driveway, or walkway and see what's possible.
          </p>
        </div>

        {/* Drop Zone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-2xl p-8 md:p-14 text-center transition-all duration-300 cursor-pointer group ${
            isDragOver
              ? "border-primary bg-primary/5 scale-[1.01]"
              : "border-border hover:border-primary/50 bg-card hover:bg-card/80"
          }`}
        >
          <div className="flex flex-col items-center gap-4">
            <div
              className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-colors ${
                isDragOver ? "bg-primary/20" : "bg-primary/10 group-hover:bg-primary/15"
              }`}
            >
              <Upload className={`w-7 h-7 transition-colors ${isDragOver ? "text-primary" : "text-primary/70"}`} />
            </div>

            <div>
              <p className="font-display font-semibold text-foreground text-lg mb-1">
                Drag & drop your photo here
              </p>
              <p className="font-body text-sm text-muted-foreground">
                or click to browse · JPG, PNG up to 10MB
              </p>
            </div>

            <Button
              variant="outline"
              className="rounded-full font-display text-sm px-6 mt-2 border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground"
            >
              <ImagePlus className="w-4 h-4 mr-2" />
              Choose Photo
            </Button>
          </div>
        </div>

        {/* Quick options */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { icon: Wand2, label: "Stamped Concrete", desc: "Classic patterns" },
            { icon: Wand2, label: "Modern Finish", desc: "Clean & minimal" },
            { icon: Wand2, label: "Natural Stone Look", desc: "Organic textures" },
          ].map((style, i) => (
            <button
              key={i}
              className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border hover:border-primary/40 transition-colors text-left group"
            >
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/15 transition-colors">
                <style.icon className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="font-display text-sm font-medium text-foreground">{style.label}</p>
                <p className="font-body text-xs text-muted-foreground">{style.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TryItSection;

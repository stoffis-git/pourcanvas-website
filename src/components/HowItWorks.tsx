import { Camera, Sparkles, Heart } from "lucide-react";

const steps = [
  {
    icon: Camera,
    title: "Upload Your Photo",
    description: "Snap a pic of your current patio, driveway, or walkway.",
  },
  {
    icon: Sparkles,
    title: "Get AI Inspiration",
    description: "See your space in stamped concrete, exposed aggregate, pavers, and more — generated in seconds.",
  },
  {
    icon: Heart,
    title: "Save & Share",
    description: "Pin your favorites and share them with your contractor.",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="section-padding bg-background">
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-3">
          Simple as 1-2-3
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-12">
          How It Works
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step, i) => (
            <div key={i} className="card-organic p-8 flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                <step.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg text-foreground mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <a
            href="#try-it"
            className="inline-block rounded-full px-8 py-3 font-semibold text-sm border-0 hover:opacity-90 transition-opacity"
            style={{ background: "linear-gradient(135deg, #90d1bf, #9dde90)", color: "#2d2a26" }}
          >
            Try It Yourself →
          </a>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;

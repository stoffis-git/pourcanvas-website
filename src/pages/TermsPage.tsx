import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SeoHead } from "@/components/SeoHead";

const TermsPage = () => (
  <>
    <SeoHead
      title="Terms and Image License | PourCanvas"
      description="PourCanvas images are free to reuse with credit under CC BY 4.0. How to attribute them and where to ask about other uses."
      canonical="/terms"
    />
    <Header />
    <main className="mx-auto max-w-3xl px-5 py-16">
      <h1 className="font-display text-3xl font-semibold text-foreground">Terms</h1>

      <section id="images" className="mt-10">
        <h2 className="font-display text-xl font-semibold text-foreground">Image license</h2>
        <p className="mt-3 text-muted-foreground">
          Images on PourCanvas are licensed under{" "}
          <a
            href="https://creativecommons.org/licenses/by/4.0/"
            rel="license noopener"
            className="underline"
          >
            Creative Commons Attribution 4.0 (CC BY 4.0)
          </a>
          . You may share and adapt them, including commercially, as long as you give credit.
        </p>
        <h3 className="mt-6 font-semibold text-foreground">How to credit</h3>
        <p className="mt-2 text-muted-foreground">
          Link to the page the image appears on, or to pourcanvas.com, with the text "Image: PourCanvas".
        </p>
        <h3 className="mt-6 font-semibold text-foreground">AI-generated images</h3>
        <p className="mt-2 text-muted-foreground">
          Most images are AI-generated concept visuals of concrete finishes. They show possible
          looks, not completed projects.
        </p>
        <h3 className="mt-6 font-semibold text-foreground">Other uses</h3>
        <p className="mt-2 text-muted-foreground">
          Logos and brand marks are not covered by this license. For anything else, contact us via
          the visualizer.
        </p>
      </section>
    </main>
    <Footer />
  </>
);

export default TermsPage;

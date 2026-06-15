export default function TermsPage() {
  return (
    <main className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="font-heading text-3xl font-semibold text-foreground mb-2">Terms of Service</h1>
      <p className="text-muted text-sm mb-8">Last updated: June 2025</p>

      <div className="space-y-6 text-sm text-muted leading-relaxed">
        <section>
          <h2 className="font-heading text-lg font-semibold text-foreground mb-2">Use of the Visualizer</h2>
          <p>
            The Metroplex Metal Roofs Visualizer is provided as a free tool to help homeowners preview
            potential roof styles. Visualizations are AI-generated approximations and are not guaranteed
            to be exact representations of a finished installation.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-lg font-semibold text-foreground mb-2">No Commitment Required</h2>
          <p>
            Submitting your information through the visualizer does not create a contract or obligate
            you to purchase any product or service. Consent to receive communications is not a condition
            of receiving a quote or services.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-lg font-semibold text-foreground mb-2">Accuracy of Visualizations</h2>
          <p>
            The AI-generated roof images are illustrative only. Actual colors, textures, and panel
            profiles may vary based on product availability, lighting conditions, and installation.
            Always request physical samples before making a purchase decision.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-lg font-semibold text-foreground mb-2">Intellectual Property</h2>
          <p>
            Street View and satellite imagery is provided by Google LLC and subject to Google&apos;s
            Terms of Service. AI-generated images are created using OpenAI technology. Metroplex Metal
            Roofs does not claim ownership of underlying street imagery.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-lg font-semibold text-foreground mb-2">Limitation of Liability</h2>
          <p>
            Metroplex Metal Roofs is not liable for any damages arising from reliance on visualizations
            produced by this tool. Use of this tool is at your own discretion.
          </p>
        </section>
      </div>
    </main>
  );
}

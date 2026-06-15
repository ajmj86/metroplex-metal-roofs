export default function PrivacyPage() {
  return (
    <main className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="font-heading text-3xl font-semibold text-foreground mb-2">Privacy Policy</h1>
      <p className="text-muted text-sm mb-8">Last updated: June 2025</p>

      <div className="space-y-6 text-sm text-muted leading-relaxed">
        <section>
          <h2 className="font-heading text-lg font-semibold text-foreground mb-2">Information We Collect</h2>
          <p>
            When you use the Metroplex Metal Roofs Visualizer, we collect the name, phone number, email
            address, and home address you provide in the lead capture form. We also collect the roof style
            and color selections you make, and whether you opted in to SMS or email communications.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-lg font-semibold text-foreground mb-2">How We Use Your Information</h2>
          <p>
            We use your information to deliver your roof visualization, contact you about your estimate
            request, and — if you opted in — send you SMS or email communications about your project.
            We do not sell your personal information to third parties.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-lg font-semibold text-foreground mb-2">SMS Communications</h2>
          <p>
            If you opted in to SMS, you may receive text messages from Metroplex Metal Roofs regarding
            your estimate and project updates. Message and data rates may apply. You can opt out at any
            time by replying STOP. For help, reply HELP or contact us directly.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-lg font-semibold text-foreground mb-2">Third-Party Services</h2>
          <p>
            This application uses Google Maps APIs to retrieve street-view and satellite imagery of
            your address. Images are processed by OpenAI&apos;s image editing API to generate the
            roof visualization. Your address is transmitted to these services for this purpose.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-lg font-semibold text-foreground mb-2">Contact</h2>
          <p>
            For privacy-related questions, contact Metroplex Metal Roofs at the details on our main
            website.
          </p>
        </section>
      </div>
    </main>
  );
}

export default function About() {
  return (
    <div className="min-h-screen bg-base-200 text-base-content px-4 py-10">
      {/* Hero Section */}
      <div className="hero mb-10">
        <div className="hero-content text-center">
          <div className="max-w-2xl">
            <h1 className="text-5xl font-bold">About KaziKYC</h1>
            <p className="py-6 text-lg">
              KaziKYC is a smart identity verification and reputation platform built to empower gig workers in the informal economy. We help build trust between workers and employers through AI-driven KYC, facial recognition, and trust scoring.
            </p>
          </div>
        </div>
      </div>

      {/* Mission, Vision, Impact Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">🚀 Our Mission</h2>
            <p>
              To create a trusted digital identity for every gig worker, enabling safer and smarter informal job hiring across Africa and beyond.
            </p>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">🌍 Our Vision</h2>
            <p>
              A world where informal workers are respected, verified, and easily matched with legitimate opportunities through smart technology.
            </p>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">💡 Our Impact</h2>
            <p>
              We’re building a trusted ecosystem for workers, saccos, and agencies—supporting dignity, transparency, and opportunity in every job match.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center mt-16">
        <h2 className="text-3xl font-bold">Ready to join the KaziKYC movement?</h2>
        <p className="py-4 text-lg">
          Whether you're a worker or an agency, KaziKYC is here to make verification easy and trust effortless.
        </p>
        <a href="/signup" className="btn btn-primary">Get Started</a>
      </div>
    </div>
  );
}

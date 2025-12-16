import { Mail } from 'lucide-react';

export default function Newsletter() {
  return (
    // STRICT: Uses 'bg-brand-red' (#ba2a33) instead of arbitrary red-700
    <section className="bg-brand-red py-12">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <div className="flex justify-center mb-4">
          <Mail size={48} className="text-white" />
        </div>
        
        {/* Typography: Using font-heading for the call-to-action */}
        <h2 className="text-3xl font-heading font-bold text-white mb-3">
          Subscribe to Our Newsletter
        </h2>
        
        <p className="text-white text-lg mb-6 opacity-90">
          Get independent journalism delivered to your inbox
        </p>

        <form className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
          <input
            type="email"
            placeholder="Enter your email address"
            // Input Text: dark grey (neutral-900) for readability
            // Focus Ring: White to contrast against the red background
            className="flex-1 px-4 py-3 rounded-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-white"
          />
          <button
            type="submit"
            // Button: Dark neutral background for high contrast
            className="px-8 py-3 bg-neutral-900 text-white font-heading font-bold tracking-wide rounded-sm hover:bg-neutral-800 transition-colors"
          >
            SUBSCRIBE
          </button>
        </form>

        <p className="text-white text-sm mt-4 opacity-75">
          We respect your privacy. Unsubscribe at any time.
        </p>
      </div>
    </section>
  );
}
import { Mail } from 'lucide-react';

export default function Newsletter() {
  return (
    <section className="bg-red-700 py-12">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <div className="flex justify-center mb-4">
          <Mail size={48} className="text-white" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-3">
          Subscribe to Our Newsletter
        </h2>
        <p className="text-white text-lg mb-6 opacity-90">
          Get independent journalism delivered to your inbox
        </p>

        <form className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
          <input
            type="email"
            placeholder="Enter your email address"
            className="flex-1 px-4 py-3 rounded-sm text-neutral-900 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-white"
          />
          <button
            type="submit"
            className="px-8 py-3 bg-neutral-900 text-white font-semibold rounded-sm hover:bg-neutral-800 transition-colors"
          >
            Subscribe
          </button>
        </form>

        <p className="text-white text-sm mt-4 opacity-75">
          We respect your privacy. Unsubscribe at any time.
        </p>
      </div>
    </section>
  );
}

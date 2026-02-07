import { useState, FormEvent } from 'react';
import { Mail, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

type FormStatus = 'idle' | 'loading' | 'success' | 'error';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<FormStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Validate email
    if (!email.trim()) {
      setStatus('error');
      setErrorMessage('Please enter your email address');
      return;
    }

    if (!validateEmail(email)) {
      setStatus('error');
      setErrorMessage('Please enter a valid email address');
      return;
    }

    // Show loading state
    setStatus('loading');
    setErrorMessage('');

    // Simulate API call (replace with real Ghost/newsletter API)
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Success!
      setStatus('success');
      setEmail('');

      // Reset after 5 seconds
      setTimeout(() => setStatus('idle'), 5000);
    } catch {
      setStatus('error');
      setErrorMessage('Something went wrong. Please try again.');
    }
  };

  return (
    <section className="py-16 bg-brand-newsletter">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <div className="flex justify-center mb-4">
          <Mail size={48} className="text-white" aria-hidden="true" />
        </div>

        <h2 className="text-3xl font-heading font-bold text-white mb-3">
          Subscribe to Our Newsletter
        </h2>

        <p className="text-white text-lg mb-6 opacity-90">
          Get independent journalism delivered to your inbox
        </p>

        {/* Success State */}
        {status === 'success' ? (
          <div className="flex items-center justify-center gap-3 bg-white/10 rounded-sm py-4 px-6 max-w-xl mx-auto" role="status">
            <CheckCircle size={24} className="text-white" aria-hidden="true" />
            <span className="text-white font-semibold">Thank you! You're now subscribed.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto" noValidate>
            <div className="flex-1 flex flex-col">
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (status === 'error') setStatus('idle');
                }}
                placeholder="Enter your email address"
                required
                aria-label="Email address"
                aria-invalid={status === 'error'}
                aria-describedby={status === 'error' ? 'newsletter-error' : undefined}
                className={`w-full px-4 py-3 rounded-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-white ${status === 'error' ? 'ring-2 ring-red-400' : ''
                  }`}
                disabled={status === 'loading'}
              />
              {/* Error Message */}
              {status === 'error' && (
                <div id="newsletter-error" className="flex items-center gap-2 mt-2 text-left" role="alert">
                  <AlertCircle size={16} className="text-red-300" aria-hidden="true" />
                  <span className="text-red-200 text-sm">{errorMessage}</span>
                </div>
              )}
            </div>
            <button
              type="submit"
              disabled={status === 'loading'}
              className="px-8 py-3 bg-neutral-900 text-white font-heading font-bold tracking-wide rounded-sm hover:bg-neutral-800 transition-colors disabled:opacity-70 disabled:cursor-not-allowed min-h-[44px] flex items-center justify-center gap-2"
            >
              {status === 'loading' ? (
                <>
                  <Loader2 size={18} className="animate-spin" aria-hidden="true" />
                  <span>Subscribing...</span>
                </>
              ) : (
                'SUBSCRIBE'
              )}
            </button>
          </form>
        )}

        <p className="text-white text-sm mt-4 opacity-75">
          We respect your privacy. Unsubscribe at any time.
        </p>
      </div>
    </section>
  );
}
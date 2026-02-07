import React from 'react';

export default function About() {
    return (
        <div className="max-w-4xl mx-auto px-4 py-16">
            <header className="mb-12 border-b border-neutral-200 pb-8">
                <h1 className="text-4xl md:text-5xl font-heading font-bold text-neutral-900 mb-4">
                    WHO WE ARE
                </h1>
                <p className="text-xl text-neutral-600 font-sans leading-relaxed">
                    Reimagining the future of independent journalism.
                </p>
            </header>

            <div className="prose prose-lg prose-neutral max-w-none font-serif">
                <p className="lead text-2xl font-normal text-neutral-800 mb-8 border-l-4 border-brand-red pl-6 italic">
                    Voxummah is a digital platform dedicated to rigorous analysis, diverse voices, and the pursuit of truth in an age of noise.
                </p>

                <h3>Our Mission</h3>
                <p>
                    We believe that clear thinking precedes right action. In a media landscape saturated with hot takes and algorithmic rage, we strive to be a signal. Our mission is to provide distinct, high-quality journalism that respects your intelligence and your time.
                </p>

                <h3>What We Stand For</h3>
                <ul className="list-disc pl-6 space-y-2 my-6">
                    <li><strong>Intellectual Integrity:</strong> We follow the facts, even when they lead to uncomfortable places.</li>
                    <li><strong>Structural Analysis:</strong> We look beyond symptoms to understand root causes.</li>
                    <li><strong>Global Perspective:</strong> We refuse to view the world through a single lens.</li>
                </ul>

                <h3>Our Community</h3>
                <p>
                    Voxummah isn't just a publication; it's a gathering place. Through our "Circles," events, and discussions, we are building a network of engaged citizens committed to understanding and shaping the world around them.
                </p>

                <div className="mt-12 p-8 bg-neutral-100 rounded-sm">
                    <h4 className="text-xl font-bold mb-4">Contact Us</h4>
                    <p className="mb-0">
                        For inquiries, pitches, or feedback, please reach out to:<br />
                        <a href="mailto:editor@voxummah.com" className="text-brand-red hover:underline font-bold">editor@voxummah.com</a>
                    </p>
                </div>
            </div>
        </div>
    );
}

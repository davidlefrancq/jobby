'use client';

import JobBoard from './components/JobBoard';

export default function HomePage() {
  return (
    <div className="container mx-auto p-6">
      <section className="space-y-6">
        <div className="overflow-x-auto rounded-lg">
          <JobBoard />
        </div>
      </section>
    </div>
  );
}

import React from 'react';
import { BookOpen, CircleUserRound, Layers3 } from 'lucide-react';

export const Profile = () => (
  <div className="mx-auto max-w-4xl space-y-6">
    <div>
      <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Profile & Project</h1>
      <p className="mt-1 text-sm text-gray-500">
        This page describes the demo account and the SpendWise mini-project.
      </p>
    </div>

    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs">
        <div className="mb-3 flex items-center gap-2 text-teal-700">
          <CircleUserRound size={19} />
          <h2 className="font-bold">Demo Profile</h2>
        </div>
        <p className="text-sm font-semibold text-gray-800">SpendWise Student User</p>
        <p className="mt-1 text-xs leading-relaxed text-gray-500">
          This is a display-only profile. The project does not implement sign-in,
          account management, or authentication.
        </p>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs">
        <div className="mb-3 flex items-center gap-2 text-teal-700">
          <BookOpen size={19} />
          <h2 className="font-bold">Project Objective</h2>
        </div>
        <p className="text-sm leading-relaxed text-gray-600">
          Record income and expenses, search and filter transactions, and review
          a current-month budget and category summary.
        </p>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs md:col-span-2">
        <div className="mb-3 flex items-center gap-2 text-teal-700">
          <Layers3 size={19} />
          <h2 className="font-bold">How the App Is Organized</h2>
        </div>
        <ol className="list-inside list-decimal space-y-2 text-sm leading-relaxed text-gray-600">
          <li>React pages manage view state and call the API service.</li>
          <li>Axios sends requests to the Express routes.</li>
          <li>Controllers validate requests and update the in-memory transaction lists.</li>
          <li>The dashboard controller calculates this month’s totals and category breakdown.</li>
        </ol>
        <p className="mt-3 text-xs text-gray-500">
          Sample data is reset when the backend restarts; no database or user account is used.
        </p>
      </section>
    </div>
  </div>
);

export default Profile;

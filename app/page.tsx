import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 text-center">
      <h1 className="text-4xl font-bold">AgentPilot</h1>
      <p className="max-w-lg text-slate-600">Track leads, follow-ups, and expected commission in one place.</p>
      <div className="flex gap-3">
        <Link href="/login" className="bg-sky-600 text-white hover:bg-sky-500 rounded-md px-4 py-2">
          Log in
        </Link>
        <Link href="/signup" className="bg-slate-200 hover:bg-slate-300 rounded-md px-4 py-2">
          Create account
        </Link>
      </div>
    </main>
  );
}

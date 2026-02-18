'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const supabase = createClient();

    const loadSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.replace(`/login?next=${encodeURIComponent(pathname)}`);
      } else {
        setReady(true);
      }
    };

    void loadSession();
  }, [pathname, router]);

  if (!ready) return <p className="p-8 text-sm text-slate-500">Checking your session...</p>;
  return <>{children}</>;
}

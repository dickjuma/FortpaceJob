import React from 'react';
import { Link } from 'react-router-dom';
import { Globe2, Moon, Sun } from 'lucide-react';

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'sw', label: 'Kiswahili' },
  { code: 'fr', label: 'Francais' },
];

export default function RegisterTopNav() {
  const [theme, setTheme] = React.useState(() => {
    if (typeof window === 'undefined') return 'light';
    return localStorage.getItem('public-theme') || 'light';
  });
  const [language, setLanguage] = React.useState('en');

  React.useEffect(() => {
    if (typeof document === 'undefined') return;

    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    localStorage.setItem('public-theme', theme);
  }, [theme]);

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/95 dark:border-zinc-800 dark:bg-zinc-950/95">
      <div className="mx-auto flex w-full max-w-[88rem] items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#4C1D95] text-base font-black text-white dark:bg-[#4C1D95]">
            F
          </div>
          <div>
            <p className="text-lg font-black tracking-tight text-zinc-950 dark:text-white">
              Forte
            </p>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-400">
              Work marketplace
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          <label className="hidden items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 sm:flex">
            <Globe2 className="h-4 w-4 text-zinc-400" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-transparent outline-none"
              aria-label="Select language"
            >
              {LANGUAGES.map((item) => (
                <option key={item.code} value={item.code} className="text-zinc-900">
                  {item.label}
                </option>
              ))}
            </select>
          </label>

          <button
            type="button"
            onClick={() => setTheme((value) => (value === 'dark' ? 'light' : 'dark'))}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-zinc-200 bg-zinc-50 text-zinc-600 transition-colors hover:bg-white dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          <Link
            to="/auth/login"
            className="inline-flex items-center justify-center rounded-full border border-zinc-200 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
          >
            Log in
          </Link>
        </div>
      </div>
    </header>
  );
}



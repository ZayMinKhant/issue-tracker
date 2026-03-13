'use client';

import { Toaster } from 'sonner';

export function AppToaster() {
  return (
    <Toaster
      closeButton
      position="bottom-center"
      toastOptions={{
        classNames: {
          toast: '!border-[var(--line)] !bg-white !text-[var(--foreground)] !shadow-lg',
          title: '!text-sm !font-medium',
          description: '!text-sm !text-[var(--muted)]',
          closeButton:
            '!border-[var(--line)] !bg-white !text-[var(--muted)] hover:!bg-[var(--accent-soft)] hover:!text-[var(--foreground)]',
        },
      }}
    />
  );
}

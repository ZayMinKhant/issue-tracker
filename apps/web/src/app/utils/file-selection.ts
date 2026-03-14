'use client';

import type { ChangeEvent } from 'react';

export function handleFileSelection(
  event: ChangeEvent<HTMLInputElement>,
  setValue: (name: 'attachmentName', value: string, options?: { shouldDirty?: boolean; shouldValidate?: boolean }) => void,
) {
  const file = event.target.files?.[0];
  setValue('attachmentName', file?.name ?? '', {
    shouldDirty: true,
    shouldValidate: true,
  });
}

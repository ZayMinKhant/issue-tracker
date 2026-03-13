'use client';

import { type ChangeEvent } from 'react';

interface IssueAttachmentSectionProps {
  attachmentName?: string | null;
  isEditing: boolean;
  onFileSelection: (event: ChangeEvent<HTMLInputElement>) => void;
}

export function IssueAttachmentSection({
  attachmentName,
  isEditing,
  onFileSelection,
}: IssueAttachmentSectionProps) {
  return (
    <section className="rounded-2xl border border-[var(--line)] bg-white p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-[var(--foreground)]">Issue Attachment</h2>
          <p className="mt-1 text-sm text-[var(--muted)]">
            The current API stores the attachment file name only.
          </p>
        </div>

        {isEditing ? (
          <label className="inline-flex h-11 cursor-pointer items-center justify-center rounded-md border border-[var(--line)] px-4 text-sm text-[var(--foreground)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]">
            Choose file
            <input type="file" className="hidden" onChange={onFileSelection} />
          </label>
        ) : null}
      </div>

      <div className="mt-4 rounded-md border border-[var(--line)] bg-[#fbfcfe] px-4 py-4 text-sm text-[var(--foreground)]">
        {attachmentName || 'No attachment recorded'}
      </div>
    </section>
  );
}

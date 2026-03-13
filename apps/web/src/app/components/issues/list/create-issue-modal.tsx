'use client';

import { X } from 'lucide-react';
import type { BaseSyntheticEvent, ChangeEvent } from 'react';
import type { FieldErrors, UseFormRegister } from 'react-hook-form';
import { ISSUE_CATEGORIES } from '@/lib/issues';
import { type CreateIssueFormValues, formatEnumLabel } from '@/app/utils/issues-utils';

interface CreateIssueModalProps {
  attachmentName: string | undefined;
  errors: FieldErrors<CreateIssueFormValues>;
  isOpen: boolean;
  isSubmitting: boolean;
  onClose: () => void;
  onFileSelection: (event: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (event?: BaseSyntheticEvent) => void;
  register: UseFormRegister<CreateIssueFormValues>;
}

export function CreateIssueModal({
  attachmentName,
  errors,
  isOpen,
  isSubmitting,
  onClose,
  onFileSelection,
  onSubmit,
  register,
}: CreateIssueModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/35 px-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-[var(--line)] px-5 py-4">
          <div>
            <h2 className="text-xl font-semibold text-[var(--foreground)]">Add New Issue</h2>
            <p className="mt-1 text-sm text-[var(--muted)]">
              Create a new report using the same fields as the API.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-[var(--muted)] transition hover:bg-[#f5f7fb] hover:text-[var(--foreground)]"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="grid gap-4 px-5 py-5">
          <label className="grid gap-2">
            <span className="text-sm font-medium text-[var(--foreground)]">Title</span>
            <input
              {...register('title')}
              placeholder="Broken hallway light"
              className="h-11 rounded-md border border-[var(--line)] bg-[#fbfcfe] px-3 text-sm outline-none transition focus:border-[var(--accent)]"
            />
            {errors.title ? (
              <span className="text-xs text-red-600">{errors.title.message}</span>
            ) : null}
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-medium text-[var(--foreground)]">Description</span>
            <textarea
              {...register('description')}
              rows={4}
              placeholder="Describe the issue"
              className="rounded-md border border-[var(--line)] bg-[#fbfcfe] px-3 py-3 text-sm outline-none transition focus:border-[var(--accent)]"
            />
            {errors.description ? (
              <span className="text-xs text-red-600">{errors.description.message}</span>
            ) : null}
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2">
              <span className="text-sm font-medium text-[var(--foreground)]">Submitter</span>
              <input
                {...register('submitterName')}
                placeholder="Front desk"
                className="h-11 rounded-md border border-[var(--line)] bg-[#fbfcfe] px-3 text-sm outline-none transition focus:border-[var(--accent)]"
              />
              {errors.submitterName ? (
                <span className="text-xs text-red-600">{errors.submitterName.message}</span>
              ) : null}
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-medium text-[var(--foreground)]">Category</span>
              <select
                {...register('category')}
                className="h-11 rounded-md border border-[var(--line)] bg-[#fbfcfe] px-3 text-sm outline-none transition focus:border-[var(--accent)]"
              >
                {ISSUE_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {formatEnumLabel(category)}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="grid gap-2">
            <span className="text-sm font-medium text-[var(--foreground)]">Attachment</span>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <label className="inline-flex h-11 cursor-pointer items-center justify-center rounded-md border border-[var(--line)] px-4 text-sm text-[var(--foreground)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]">
                Choose file
                <input type="file" className="hidden" onChange={onFileSelection} />
              </label>
              <span className="text-sm text-[var(--muted)]">{attachmentName || 'No file selected'}</span>
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-[var(--line)] pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-[var(--line)] px-4 py-2 text-sm text-[var(--foreground)] transition hover:border-[var(--accent)]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-md bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? 'Saving...' : 'Create Issue'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

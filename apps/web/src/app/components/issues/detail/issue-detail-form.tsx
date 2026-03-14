'use client';

import { format } from 'date-fns';
import { type FormEventHandler } from 'react';
import {
  type FieldErrors,
  type UseFormRegister,
} from 'react-hook-form';
import { ISSUE_CATEGORIES, ISSUE_STATUSES, type Issue } from '@issue-tracker/types';
import {
  formatEnumLabel,
  statusLabels,
  type UpdateIssueFormValues,
} from '@issue-tracker/utils';
import { statusClasses } from '@/app/utils/issues-utils';

interface IssueDetailFormProps {
  errors: FieldErrors<UpdateIssueFormValues>;
  isDirty: boolean;
  isEditing: boolean;
  isSaving: boolean;
  issue: Issue;
  onCancelEdit: () => void;
  onStartEdit: () => void;
  onSubmit: FormEventHandler<HTMLFormElement>;
  register: UseFormRegister<UpdateIssueFormValues>;
}

export function IssueDetailForm({
  errors,
  isDirty,
  isEditing,
  isSaving,
  issue,
  onCancelEdit,
  onStartEdit,
  onSubmit,
  register,
}: IssueDetailFormProps) {
  return (
    <section className="rounded-2xl border border-[var(--line)] bg-white p-6">
      <form onSubmit={onSubmit} className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 border-b border-[var(--line)] pb-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm text-[var(--muted)]">Issue ID: {issue.id}</p>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Reported on {format(new Date(issue.createdAt), 'dd/MM/yyyy HH:mm')}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {isEditing ? (
              <>
                <button
                  type="submit"
                  disabled={isSaving || !isDirty}
                  className="rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSaving ? 'Saving...' : 'Submit'}
                </button>
                <button
                  type="button"
                  onClick={onCancelEdit}
                  className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-200"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={onStartEdit}
                className="rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white transition hover:brightness-95"
              >
                Edit
              </button>
            )}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.25fr_0.95fr]">
          <div className="space-y-5">
            <label className="grid gap-2">
              <span className="text-sm font-medium text-[var(--foreground)]">Title</span>
              {isEditing ? (
                <input
                  {...register('title')}
                  className="h-11 rounded-md border border-[var(--line)] bg-[#fbfcfe] px-3 text-sm outline-none transition focus:border-[var(--accent)]"
                />
              ) : (
                <div className="min-h-11 rounded-md border border-[var(--line)] bg-[#fbfcfe] px-3 py-3 text-sm text-[var(--foreground)]">
                  {issue.title}
                </div>
              )}
              {errors.title ? <span className="text-xs text-red-600">{errors.title.message}</span> : null}
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-medium text-[var(--foreground)]">Description</span>
              {isEditing ? (
                <textarea
                  {...register('description')}
                  rows={8}
                  className="rounded-md border border-[var(--line)] bg-[#fbfcfe] px-3 py-3 text-sm outline-none transition focus:border-[var(--accent)]"
                />
              ) : (
                <div className="min-h-48 rounded-md border border-[var(--line)] bg-[#fbfcfe] px-3 py-3 text-sm text-[var(--foreground)]">
                  {issue.description}
                </div>
              )}
              {errors.description ? (
                <span className="text-xs text-red-600">{errors.description.message}</span>
              ) : null}
            </label>
          </div>

          <div className="grid gap-4 border-t border-[var(--line)] pt-6 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
            <div className="grid grid-cols-[130px_1fr] gap-3 text-sm">
              <span className="text-[var(--muted)]">Submitter</span>
              {isEditing ? (
                <div className="grid gap-2">
                  <input
                    {...register('submitterName')}
                    className="h-11 rounded-md border border-[var(--line)] bg-[#fbfcfe] px-3 text-sm outline-none transition focus:border-[var(--accent)]"
                  />
                  {errors.submitterName ? (
                    <span className="text-xs text-red-600">{errors.submitterName.message}</span>
                  ) : null}
                </div>
              ) : (
                <span className="font-medium text-[var(--foreground)]">
                  {issue.submitterName || '-'}
                </span>
              )}
            </div>

            <div className="grid grid-cols-[130px_1fr] gap-3 text-sm">
              <span className="text-[var(--muted)]">Reported On</span>
              <span className="font-medium text-[var(--foreground)]">
                {format(new Date(issue.createdAt), 'dd/MM/yyyy HH:mm')}
              </span>
            </div>

            <div className="grid grid-cols-[130px_1fr] gap-3 text-sm">
              <span className="text-[var(--muted)]">Category</span>
              {isEditing ? (
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
              ) : (
                <span className="font-medium text-[var(--foreground)]">
                  {formatEnumLabel(issue.category)}
                </span>
              )}
            </div>

            <div className="grid grid-cols-[130px_1fr] gap-3 text-sm">
              <span className="text-[var(--muted)]">Status</span>
              {isEditing ? (
                <select
                  {...register('status')}
                  className="h-11 rounded-md border border-[var(--line)] bg-[#fbfcfe] px-3 text-sm outline-none transition focus:border-[var(--accent)]"
                >
                  {ISSUE_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {statusLabels[status]}
                    </option>
                  ))}
                </select>
              ) : (
                <span
                  className={`inline-flex w-fit h-fit rounded-full px-2.5 py-1 text-xs font-medium ${statusClasses[issue.status]}`}
                >
                  {statusLabels[issue.status]}
                </span>
              )}
            </div>

            <div className="grid grid-cols-[130px_1fr] gap-3 text-sm">
              <span className="text-[var(--muted)]">Updated On</span>
              <span className="font-medium text-[var(--foreground)]">
                {format(new Date(issue.updatedAt), 'dd/MM/yyyy HH:mm')}
              </span>
            </div>
          </div>
        </div>
      </form>
    </section>
  );
}

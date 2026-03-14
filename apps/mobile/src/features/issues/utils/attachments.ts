export function getPickedAttachmentName(
  files: ReadonlyArray<{ name?: string | null }> | undefined,
) {
  const name = files?.[0]?.name?.trim();
  return name ? name : '';
}

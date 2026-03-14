export function trimString(value: unknown) {
  return typeof value === 'string' ? value.trim() : value;
}

export function trimNullableString(value: unknown) {
  if (typeof value !== 'string') {
    return value;
  }

  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

const defaultAllowedOrigins = [
  '*'
];

export function getAllowedOrigins() {
  const configuredOrigins = process.env.ALLOWED_ORIGINS?.split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  if (configuredOrigins?.length) {
    return configuredOrigins;
  }

  if (process.env.NODE_ENV === 'production') {
    throw new Error('ALLOWED_ORIGINS must be configured in production.');
  }

  return defaultAllowedOrigins;
}

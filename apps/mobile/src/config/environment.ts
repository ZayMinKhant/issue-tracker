import { NativeModules, Platform } from 'react-native';

function trimTrailingSlash(value: string) {
  return value.replace(/\/+$/, '');
}

function getEnvironmentValue(name: string) {
  const processEnv = (globalThis as { process?: { env?: Record<string, string | undefined> } })
    .process?.env;

  return processEnv?.[name];
}

function getMetroHost() {
  const scriptURL = NativeModules.SourceCode?.scriptURL as string | undefined;

  if (!scriptURL) {
    return undefined;
  }

  const match = scriptURL.match(/^https?:\/\/([^/:]+)/i);

  if (!match?.[1]) {
    return undefined;
  }

  return match[1];
}

function getFallbackHost() {
  const metroHost = getMetroHost();

  if (metroHost) {
    return metroHost === 'localhost' && Platform.OS === 'android'
      ? '10.0.2.2'
      : metroHost;
  }

  return Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
}

export function getApiBaseUrl() {
  const envUrl =
    getEnvironmentValue('REACT_NATIVE_API_URL') ??
    getEnvironmentValue('API_URL');

  if (envUrl) {
    return trimTrailingSlash(envUrl);
  }

  return `http://${getFallbackHost()}:3001`;
}

export function getSocketBaseUrl() {
  const envUrl =
    getEnvironmentValue('REACT_NATIVE_SOCKET_URL') ??
    getEnvironmentValue('SOCKET_URL');

  if (envUrl) {
    return trimTrailingSlash(envUrl);
  }

  return getApiBaseUrl();
}

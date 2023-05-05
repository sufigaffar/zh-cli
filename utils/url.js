export function getWebUrl() {
  return process.env.NODE_ENV === 'dev' ? 'zeroheight.dev' : 'zeroheight.com';
}

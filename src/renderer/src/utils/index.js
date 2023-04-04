export const getPathname = url => {
  if (!url) {
    return ''
  }

  const urlStr = new URL(url.startsWith('https://') ? url : `https://${url}`);

  return urlStr.pathname.replace("/", "");
};

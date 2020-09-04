const {
  createDir,
  createFile,
  readFile,
  dirExists,
  ROOT_DIR
} = require('./ioutils');
const CACHE_DIR_PATH = `${ROOT_DIR}/caches/`;

function getCacheFile(url, path = CACHE_DIR_PATH) {
  try {
    return readFile(`${path}${getFilenameFromUrl(url)}.html`);
  } catch (e) {
    return null;
  }
}

function createCacheFile(url, content, path = CACHE_DIR_PATH) {
  if (!dirExists(path)) {
    createDir(path);
  }

  createFile(`${path}${getFilenameFromUrl(url)}.html`, content);
}

function getFilenameFromUrl(url) {
  const regex = new RegExp('/', 'g');
  return url.replace(regex, '_');
}

module.exports = {
  getCacheFile,
  createCacheFile
}

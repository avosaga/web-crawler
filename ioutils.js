const fs = require('fs');

function createFile(filename, content) {
  fs.writeFileSync(filename, content)
}

function readJSONFile(filePath) {
  return JSON.parse(readFile(filePath));
}

function readFile(filePath) {
  return fs.readFileSync(filePath, 'utf8')
}

function createDir(path) {
  fs.mkdirSync(path, { recursive: true }, err => {
    if (err) {
      console.log('An error occurred while creating directory', err);
      throw err;
    }
  });
}

function readDir(path) {
  return fs.readdirSync(path)
}

function dirExists(path) {
  return fs.existsSync(path)
}

module.exports = {
  createFile,
  readJSONFile,
  createDir,
  readDir,
  dirExists,
  readFile,
  ROOT_DIR: './.web-crawler'
}

const {
  createDir,
  readDir,
  createFile,
  readJSONFile,
  dirExists,
  ROOT_DIR
} = require('./ioutils');
const CONFIG_DIR_PATH = `${ROOT_DIR}/configs/`;

const kolonialConfig = {
  name: 'kolonial',
  baseUrl: 'https://kolonial.no',
  landingPageUrl: '/produkter/',
  productUrlSelectors: [
    '.aggregation-filter-headline',
  ],
  productItemSelector: '.product-list-item',
  productDetailSelectors: {
    name: '.name-main',
    description: '.name-extra',
    price: '.price.label.label-price',
    discountPrice: '.price.label.label-price-discounted',
    unitPrice: '.unit-price',
    available: '.not-for-sale'
  }
}

function getConfigs(path = CONFIG_DIR_PATH) {
  if (!dirExists(path)) {
    createDir(path);
  }

  let files = readDir(path);

  if (!files.length) {
    addConfig('kolonial.json', kolonialConfig);
    files = readDir(path);
  }

  return files.map(file => readJSONFile(`${path}/${file}`));
}

function addConfig(name, jsonConfig, path = CONFIG_DIR_PATH) {
  createFile(`${path}/${name}`, JSON.stringify(jsonConfig));
}

module.exports = {
  getConfigs,
  addConfig,
  CONFIG_DIR_PATH
}

const { createFile } = require('./ioutils');

function exportToFile(args, configContents) {
  const exportFileExtension = getValueFromArgs(args, 'export', false, true)

  if (!exportToFile) {
    return;
  }

  configContents.forEach(configContent => {
    const filename = `./${configContent.config.name}.${exportFileExtension}`;
    switch (exportFileExtension) {
      case 'json': {
        createFile(filename, formatContentToJSON(configContent.content));
        break;
      }
      case 'csv': {
        createFile(filename, formatContentToCSV(configContent.config.productDetailSelectors, configContent.content));
        break;
      }
    }
  });
}

function formatContentToJSON(contents) {
  const formattedContent = reduceContents(contents);
  return JSON.stringify(formattedContent);
}

function formatContentToCSV(properties, contents) {
  const { products } = reduceContents(contents);
  const headers = Object.keys(properties);

  const csvHeader = headers.reduce((str, prop, i) => {
    return str + `${prop}${headers.length - 1 === i ? '' : ','}`
  }, '')

  const csvBody = products.reduce((str, product, i) => {
    let raw = '';

    headers.forEach((header, index) => {
      let value = product[header] || '';

      if (typeof value === 'string' && value.includes(',')) {
        value = `"${value}"`
      }

      raw += value + (headers.length - 1 === index ? '\n' : ',')
    })

    return str + raw;
  }, '')

  return `${csvHeader}\n${csvBody}\n`;
}

function reduceContents(contents) {
  return contents.reduce((obj, content) => {
    const { url, available, total, products, statusCode } = content;
    obj.urls.push({
      url,
      statusCode
    });
    obj.available += available;
    obj.total += total;
    obj.products.push(...products);
    return obj;
  }, {
    urls: [],
    total: 0,
    available: 0,
    products: []
  });
}

function getValueFromArgs(args, param, isRequired = false, isValueRequired = false) {
  const index = args.findIndex(arg => arg.includes(param));

  if (index === -1 && !isRequired) {
    return null;
  }

  if (!isRequired && !isValueRequired) {
    return true;
  }

  const value = index !== -1 && args[index].split('=')[1];

  if (!value) {
    throw new Error(`Param "${param}" requires a value`);
  }

  return value;
}


module.exports = {
  exportToFile
}

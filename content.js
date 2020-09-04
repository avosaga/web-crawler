const axios = require('axios');
const { parse } = require('node-html-parser');
const { getCacheFile, createCacheFile } = require('./cache');

async function readContent({
    baseUrl,
    productUrlSelectors,
    landingPageUrl,
    productItemSelector,
    productDetailSelectors
  },
  useCache = true
) {
  const content = [];
  try {
    const response = await getHTML(`${baseUrl}${landingPageUrl}`, useCache);

    const mainProducts = await findProductsInResponse(
      response,
      productItemSelector,
      productDetailSelectors
    );

    content.push(mainProducts);

    const links = getLinksToOtherProductPages(response.html, productUrlSelectors);

    for (const link of links) {
      const response = await getHTML(`${baseUrl}${link}`, useCache);
      content.push(await findProductsInResponse(response, productItemSelector, productDetailSelectors));
    }
  } catch(e) {
    console.log(e.message)
  }

  return content;
}

async function getHTML(url, useCache) {
  try {
    const content = await getData(url, useCache);
    const html = parse(content.data);
    return {
      html,
      url,
      ...content,
    }
  } catch (e) {
    console.log('Error while requesting data from', url)
    return {
      url,
      data: null,
      html: null,
      status: e.statusCode
    }
  }
}

function findProductsInResponse({ html, status, url }, productItemSelector, productDetailSelectors) {
  if (!html) {
    return {
      url,
      products: [],
      total: 0,
      available: 0,
      statusCode: status,
    }
  }

  const items = html.querySelectorAll(productItemSelector);
  const products = items.map(htmlItem => parseProductHTMLToProductJSON(htmlItem, productDetailSelectors));

  return {
    url,
    products,
    total: products.length,
    available: products.reduce((n, product) => product.available ? n + 1 : n , 0),
    statusCode: status
  }
}

function getLinksToOtherProductPages(html, productUrlSelectors) {
  const links = [];

  productUrlSelectors.forEach(selector => {
    const urlElements = html.querySelectorAll(selector);
    urlElements.forEach(elem => {
      if (elem.tagName !== 'a') {
        elem = elem.querySelector('a');
      }
      links.push(elem.getAttribute('href'))
    })
  });

  return links;
}

function parseProductHTMLToProductJSON(productHtmlElement, productDetailSelectors) {
  const productJSON = {};

  for (const key of Object.keys(productDetailSelectors)) {
    const propertySelector = productDetailSelectors[key];
    const element = productHtmlElement.querySelector(propertySelector);
    productJSON[key] = null;

    if (key === 'available') {
      productJSON[key] = element == null;
      continue;
    }

    if (element) {
      if (element.tagName === 'img') {
        productJSON[key] = element.getAttribute('src');
      } else {
        productJSON[key] = element.text.trim();
      }
    }
  }

  return productJSON;
}

async function getData(url, useCache = true) {
  const data = getCacheFile(url);
  let content;

  if (useCache && data) {
    content = {
      data,
      status: 'Cache'
    };
  }

  if (!content) {
    content = await axios.get(url);
    createCacheFile(url, content.data);
  }

  return content;
}

module.exports = {
  readContent
}

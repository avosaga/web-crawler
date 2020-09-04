const { getConfigs } = require('./configs');
const { readContent } = require('./content');
const { exportToFile } = require('./exports');

async function goCrawl(args) {
  const configs = getConfigs();
  const contents = [];

  for (const config of configs) {
    const content = await readContent(config, true);
    printContent(config, content);
    contents.push({
      config,
      content
    });
  }

  exportToFile(args, contents);
}

function printContent(config, contents) {
  console.log(`>>>>>>>>>>>>>>>>>>>>>>>>>>> ${config.name || config.baseUrl} >>>>>>>>>>>>>>>>>>>>>>>>>>>`);
  contents.forEach(({ url, statusCode, products, total, available }) => {
    console.log(`
       URL            : ${url}
       Status         : ${statusCode}     
       Total Products : ${total}
       Available      : ${available}
    `);
    console.table(products);
  })
}

goCrawl(process.argv.slice(2));

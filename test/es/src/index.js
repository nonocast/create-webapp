const debug = require('debug')('app');
const { Client } = require('@elastic/elasticsearch')

run();

async function run() {
  const client = new Client({ node: 'http://localhost:9200' })

  let response = await client.cat.indices();
  debug(response.body);
}
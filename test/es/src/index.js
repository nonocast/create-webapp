const _ = require('lodash');
const debug = require('debug')('app');
const { Client } = require('@elastic/elasticsearch')

run();

async function run() {
  const client = new Client({ node: 'http://localhost:9200' })

  // let { body } = await client.search({
  //   index: 'logs-create-webapp*',
  //   size: 100
  // });
  // console.log(body);
  // console.log(_.map(body.hits.hits, x => x._source.message));

let { body } = await client.search({
  index: 'logs-create-webapp-access*',
  body: {
    size: 0,
    aggs: {
      routes: {
        terms: {
          field: 'route.keyword'
        }
      }
    }
  }
});

console.log(body.aggregations.routes.buckets);
}
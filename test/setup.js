console.log('requiring ts-node/register...');
require("ts-node")
  .register({project: "./test/tsconfig.json"});

const baseConfig = require("../webpack.config.js");
module.exports = async ({ config }) => {
  config.resolve.alias = {
    ...config.resolve.alias,
    ...baseConfig.resolve.alias
  };

  // get rid of the jpg ruleset in the storybook config
  config.module.rules = config.module.rules.filter(rule => {
    if (!rule.test) return true;
    if (rule.test.test('.jpg')) return false;
    return true;
  });

  config.module.rules = [
    ...config.module.rules,
    ...baseConfig.module.rules
  ];

  console.dir(config, { depth: 10 })

  return config;
};
// module.exports = async ({ config }) =>
//   console.dir(config, { depth: null }) || config;

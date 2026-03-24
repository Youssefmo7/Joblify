const webpack = require("webpack");

module.exports = {
  // Vue CLI config
  configureWebpack: (config) => {
    if (process.env.NODE_ENV === "development") {
      config.plugins = config.plugins || [];
      config.plugins.push(new webpack.HotModuleReplacementPlugin());
    }
  },
  devServer: {
    hot: true,
    liveReload: true,
    historyApiFallback: true,
  },
};

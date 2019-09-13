const HTMLWebpackPlugin = require("html-webpack-plugin");
const Dotenv = require('dotenv-webpack');
const path = require("path");

module.exports = {
  mode: "development",

  entry: path.resolve(__dirname, "src", "app.js"),

  output: {
    filename: "app.js",
    path: path.resolve(__dirname, "dist")
  },

  target: "web",

  devtool: 'inline-source-map',

  module: {
    rules: [
      {
        test: /\.(jpg|png|gif|svg)$/,
        use: 'file-loader'
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      },
      {
        test: /\.(css|styl|stylus)$/,
        use: ['style-loader', 'css-loader', 'stylus-loader']
      }
    ]
  },

  resolve: {
    modules: ["node_modules"],

    alias: {
      "~": path.resolve(__dirname, "src")
    }
  },

  devServer: {
    port: 9001,
    hot: true
  },

  plugins: [
    new HTMLWebpackPlugin({
      template: path.resolve(__dirname, "src", "index.html")
    }),
    new Dotenv()
  ]
};

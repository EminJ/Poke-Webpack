const path = require("path");

module.exports = {
  entry: "./src/javascript/script.js",
  output: {
    path: path.resolve(__dirname, "dist/javascript"),
    filename: "script.js"
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ],
  },
  
};
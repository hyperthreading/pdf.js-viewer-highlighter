const path = require('path');
module.exports = {
  target: "web",
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.module\.css$/i,
        use: [
          { loader: "style-loader" },
          {
            loader: "css-loader",

            options: {
              modules: {
                mode: 'local',
                localIdentName: '[path][name]__[local]--[hash:base64:5]',
                context: path.resolve(__dirname, 'src'),
                hashPrefix: 'css-module',
              },
            }
          }
        ]
      },
      {
        test: /(!\.module)\.css$/i,
        use: [
          { loader: "style-loader" },
          {
            loader: "css-loader",
            options: {
              modules: "global"
            }
          }
        ]
      }
    ]
  }
};

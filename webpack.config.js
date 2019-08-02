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
                localIdentName: '[path]__[local]--[hash:base64:6]',
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
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: "babel-loader"
          },
          {
            loader: "react-svg-loader",
            options: {
              jsx: true // true outputs JSX tags
            }
          }
        ]
      }
    ]
  }
};

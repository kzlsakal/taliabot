const path = require('path');

module.exports = {
  entry: path.join(__dirname, 'client/index.jsx'),
  output: {
    path: path.join(__dirname, 'public'),
    filename: 'talia.bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.m?jsx$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        }
      }
    ]
  }
};

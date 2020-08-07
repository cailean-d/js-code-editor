const path = require('path');

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'lib'),
    filename: 'editor.js',
    library: 'editor',
    libraryTarget:'umd',
    umdNamedDefine: true
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js', '.json' ]
  },
};
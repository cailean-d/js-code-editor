const path = require('path');

const production = process.env.NODE_ENV === 'production';
const obj1 = {
  path: path.resolve(__dirname, 'lib'),
  filename: 'editor.umd.js',
  library: 'editor',
  libraryTarget:'umd',
  umdNamedDefine: true
}
const obj2 = {
  path: path.resolve(__dirname, 'dist'),
  filename: 'dev.js',
}

module.exports = {
  mode: production ? 'production' : 'development',
  entry: production ? './src/index.tsx' : './src/dev.ts',
  output: production ? obj1 : obj2,
  resolve: {
    extensions: [ '.tsx', '.ts', '.js', '.json' ]
  },
  module: {
    rules: [
      {
        test: /\.(m?js|tsx?)$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript'],
          }
        }
      },
      {
        test: /\.module\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              modules: true
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ],
        exclude: /\.module\.css$/
      },
    ]
  }
};
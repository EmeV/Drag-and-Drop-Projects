const path = require("path");

module.exports = {
  mode: 'development',
  entry: './src/app.ts',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'), //constructs an absolute path to dist folder
    publicPath: 'dist',
  },
  devtool: 'inline-source-map', //tell webpack, that there will be already generated source maps
  module: {
    rules: [
      //coulbe be more rules for different types of files, css, an so on
      {
        test: /\.ts$/, //reg .expt select all ts files
        use: "ts-loader", //what to do with the ts files? use the ts-loader
        exclude: /node_modules/
      },
    ],
  },
  resolve: {
    //add extentsions
    extensions: ['.ts', '.js'],
  },
};

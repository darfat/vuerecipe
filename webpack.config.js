var webpack = require("webpack");
var CopyWebpackPlugin = require("copy-webpack-plugin");
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var ManifestPlugin = require("webpack-manifest-plugin");
var PROD = process.env.NODE_ENV || "development";

module.exports = {
  entry: {
    application: [
      "./assets/js/application.js",
      "./node_modules/jquery-ujs/src/rails.js",
      "./assets/css/application.scss"
    ]
  },
  resolve: {
    alias: {
      vue$: `${__dirname}/node_modules/vue/dist/vue.esm.js`,
      router$: `${__dirname}/node_modules/vue-router/dist/vue-router.esm.js`
    }
  },
  output: {
    filename: "[name].[hash].js",
    path: `${__dirname}/public/assets`
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery"
    }),
    new ExtractTextPlugin("[name].[hash].css"),
    new CopyWebpackPlugin(
      [
        {
          from: "./assets",
          to: ""
        }
      ],
      {
        ignore: ["css/**", "js/**"]
      }
    ),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false
    }),
    new ManifestPlugin({
      fileName: "manifest.json"
    })
  ],
  module: {
    rules: [
      {
        test: /\.html$/,
        loader: "raw-loader"
      },
      {
        test: /\.vue/,
        loader: "vue-loader"
      },
      {
        test: /\.jsx?$/,
        loader: "babel-loader",
        exclude: /node_modules/
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: [
            {
              loader: "css-loader",
              options: {sourceMap: true}
            },
            {
              loader: "sass-loader",
              options: {sourceMap: true}
            }
          ]
        })
      },
      {
        test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
        use: "url-loader?limit=10000&mimetype=application/font-woff"
      },
      {
        test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
        use: "url-loader?limit=10000&mimetype=application/font-woff"
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        use: "url-loader?limit=10000&mimetype=application/octet-stream"
      },
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        use: "file-loader"
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        use: "url-loader?limit=10000&mimetype=image/svg+xml"
      },
      {
        test: require.resolve("jquery"),
        use: "expose-loader?jQuery!expose-loader?$"
      }
    ]
  }
};

if (PROD != "development") {
  module.exports.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      beautify: false,
      mangle: {
        screw_ie8: true,
        keep_fnames: true
      },
      compress: {
        screw_ie8: true
      },
      comments: false
    })
  );
}

const { override, addWebpackModuleRule } = require('customize-cra');

module.exports = override(
  addWebpackModuleRule({
    test: /\.(wasm|wasm\.js)$/,
    type: 'javascript/auto',
    use: [
      {
        loader: 'file-loader',
        options: {
          name: '[path][name].[md5:hash:base64:6].[ext]',
        },
      },
    ],
  })
);

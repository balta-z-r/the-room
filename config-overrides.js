const path = require('path')
const {
  removeModuleScopePlugin,
  override,
  babelInclude,
  addWebpackAlias
} = require('customize-cra')

module.exports = override(
  (() => config => {
    config.module.rules.push({
      test: /\.worker\.js$/,
      use: { loader: 'worker-loader', options: { inline: true } }
    })

    config.output.globalObject = 'this'

    return config
  })(),
  removeModuleScopePlugin(),
  babelInclude([
    path.resolve(__dirname, 'src'),
    path.resolve(__dirname, 'config'),
    path.resolve(__dirname, 'core'),
    path.resolve(__dirname, 'assets')
  ]),
  addWebpackAlias({
    ['config']: path.resolve(__dirname, 'config'),
    ['core']: path.resolve(__dirname, 'core'),
    ['assets']: path.resolve(__dirname, 'assets')
  })
)

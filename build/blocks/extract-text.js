/**
 * Extract-text webpack block.
 *
 * @see https://github.com/webpack/extract-text-webpack-plugin
 */

const ExtractTextPlugin = require('extract-text-webpack-plugin')
const common = require('@webpack-blocks/webpack-common')

module.exports = extractText

/**
 * @param {string}    outputFilePattern
 * @param {string}  [fileType]          A MIME type used for file matching. Defaults to `text/css`.
 * @return {Function}
 */
function extractText (outputFilePattern, fileType) {
  outputFilePattern = outputFilePattern || 'css/[name].[contenthash:8].css'
  fileType = fileType || ['text/css', 'text/x-sass']

  const plugin = new ExtractTextPlugin(outputFilePattern)

  return (context, webpackConfig) => {
    return {
      module: {
        loaders: fileType.map(type => {
          const loaderConfig = common.getLoaderConfigByType(
            context,
            webpackConfig,
            type
          )
          const nonStyleLoaders = common.getNonStyleLoaders(loaderConfig, type)
          return {
            test: context.fileType(type),
            exclude: loaderConfig.exclude,
            loader: plugin.extract({
              fallback: 'style-loader',
              use: nonStyleLoaders
            }),
            loaders: undefined
          }
        })
      },
      plugins: [plugin]
    }
  }
}

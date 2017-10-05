const parseNum = require('parse-num')

/* global Intl */

const defaultOptions = {
  nanZero: true,
  locale: 'en-US',
  localeMatcher: 'best fit',
  useGrouping: true, // grouping separator determined by locale
  maximumFractionDigits: 15
}

/**
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NumberFormat
 * @param {number} number Number to format
 * @param {Object} opts Options for formatting
 * @param {boolean} [opts.nanZero=true]
 * @param {string} [opts.locale=en-US]
 * @param {string} [opts.localeMatcher=best fit]
 * @param {boolean} [opts.useGrouping=true]
 * @param {number} [opts.minimumIntegerDigits]
 * @param {number} [opts.minimumFractionDigits]
 * @param {number} [opts.maximumFractionDigits=15]
 * @param {number} [opts.minimumSignificantDigits]
 * @param {number} [opts.maximumSignificantDigits]
 */
const formatNum = (number, opts) => {
  opts = renameKeyShortcuts(Object.assign({}, defaultOptions, opts))
  number = parseNum(number)

  if (isNaN(number)) {
    if (opts.nanZero === false) return 'NaN'
    else number = 0
  }

  const nf = new Intl.NumberFormat([opts.locale], Object.assign({}, opts, { style: 'decimal' }))
  return nf.format(number)
}

/**
 * @param {Object} opts
 */
const renameKeyShortcuts = (opts) => {
  Object.keys(opts).forEach((key) => {
    expandMin(opts, key)
    expandMax(opts, key)
  })

  Object.keys(opts).forEach((key) => addDigits(opts, key))

  return opts
}

/**
 * @param {Object} opts
 * @param {string} key
 */
const expandMin = (opts, key) => expand(opts, key, 'min', 'minimum')

/**
 * @param {Object} opts
 * @param {string} key
 */
const expandMax = (opts, key) => expand(opts, key, 'max', 'maximum')

/**
 * @param {Object} opts
 * @param {string} key
 * @param {string} shorthand
 * @param {string} full
 */
const expand = (opts, key, shorthand, full) => {
  if (!key.includes(full) && key.startsWith(shorthand)) {
    replaceKey(opts, key, key.replace(shorthand, full))
  }
}

/**
 * @param {Object} opts
 * @param {string} key
 */
const addDigits = (opts, key) => {
  if (
    (key.startsWith('minimum') || key.startsWith('maximum')) &&
    !key.endsWith('Digits')
  ) {
    replaceKey(opts, key, key + 'Digits')
  }
}

/**
 * @param {Object} opts
 * @param {string} oldKey
 * @param {string} newKey
 */
const replaceKey = (obj, oldKey, newKey) => {
  obj[newKey] = obj[oldKey]
  delete obj[oldKey]
}

module.exports = formatNum

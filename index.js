const parseNum = require('parse-num')
const memoize = require('lodash/memoize')

/* global Intl */

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NumberFormat
const defaultOptions = {
  nanZero: true,
  locale: 'en-US',
  localeMatcher: 'best fit',
  useGrouping: true, // grouping separator determined by locale
  maximumFractionDigits: 15
  // OTHER
  // minimumIntegerDigits
  // minimumFractionDigits
  // maximumFractionDigits
  // minimumSignificantDigits
  // maximumSignificantDigits
}

const getNumberFormatter = memoize(
  (opts) => new Intl.NumberFormat([opts.locale], opts),
  (opts) => JSON.stringify(opts)
)

const formatNum = (number, opts) => {
  opts = renameKeyShortcuts(Object.assign(Object.create(null), defaultOptions, opts))
  number = parseNum(number)

  if (isNaN(number)) {
    if (opts.nanZero === false) return 'NaN'
    else number = 0
  }

  const nf = getNumberFormatter(Object.assign(Object.create(null), opts, { style: 'decimal' }))
  return nf.format(number)
}

const renameKeyShortcuts = (opts) => {
  Object.keys(opts).forEach((key) => {
    expandMin(opts, key)
    expandMax(opts, key)
  })

  Object.keys(opts).forEach((key) => addDigits(opts, key))

  return opts
}

const expandMin = (opts, key) => expand(opts, key, 'min', 'minimum')
const expandMax = (opts, key) => expand(opts, key, 'max', 'maximum')

const expand = (opts, key, shorthand, full) => {
  if (!key.includes(full) && key.startsWith(shorthand)) {
    replaceKey(opts, key, key.replace(shorthand, full))
  }
}

const addDigits = (opts, key) => {
  if (
    (key.startsWith('minimum') || key.startsWith('maximum')) &&
    !key.endsWith('Digits')
  ) {
    replaceKey(opts, key, key + 'Digits')
  }
}

const replaceKey = (obj, oldKey, newKey) => {
  obj[newKey] = obj[oldKey]
  delete obj[oldKey]
}

module.exports = formatNum

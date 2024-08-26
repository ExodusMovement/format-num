const parseNum = require('parse-num')

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

const formatters = new Map()

const formatNum = (number, opts) => {
  number = parseNum(number)
  if (isNaN(number)) {
    if (opts && opts.nanZero === false) return 'NaN' // default is true, so we can do this without expanding the options
    else number = 0
  }

  const key = JSON.stringify(opts)
  if (!formatters.has(key)) {
    opts = renameKeyShortcuts(Object.assign(Object.create(null), defaultOptions, opts))
    opts = Object.assign(Object.create(null), opts, { style: 'decimal' })
    formatters.set(key, new Intl.NumberFormat([opts.locale], opts))
  }

  return formatters.get(key).format(number)
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

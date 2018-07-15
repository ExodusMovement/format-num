export interface FormatCurrencyOptions extends Intl.NumberFormatOptions {
  nanZero?: boolean;
  locale?: string;
  localeMatcher?: string;
  useGrouping?: boolean;
  minimumIntegerDigits?: number;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
  minimumSignificantDigits?: number;
  maximumSignificantDigits?: number;
}

export default function formatCurrency(number: number | string | null | undefined, opts?: FormatCurrencyOptions): string;

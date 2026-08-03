export function numberToWords(num: number | string): string {
  if (num === 0 || num === '0' || !num) return '';
  const n = typeof num === 'string' ? parseInt(num.replace(/,/g, ''), 10) : num;
  if (isNaN(n) || n === 0) return '';

  const single = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  const double = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', 'Ten', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  const getBelowHundred = (n: number) => {
    if (n < 10) return single[n];
    if (n < 20) return double[n - 10];
    const unit = n % 10;
    return (tens[Math.floor(n / 10)] + (unit ? ' ' + single[unit] : '')).trim();
  };

  let word = '';
  let temp = n;

  if (temp >= 10000000) {
    word += getBelowHundred(Math.floor(temp / 10000000)) + ' Crore ';
    temp %= 10000000;
  }
  if (temp >= 100000) {
    word += getBelowHundred(Math.floor(temp / 100000)) + ' Lakh ';
    temp %= 100000;
  }
  if (temp >= 1000) {
    word += getBelowHundred(Math.floor(temp / 1000)) + ' Thousand ';
    temp %= 1000;
  }
  if (temp >= 100) {
    word += getBelowHundred(Math.floor(temp / 100)) + ' Hundred ';
    temp %= 100;
  }
  if (temp > 0) {
    word += getBelowHundred(temp) + ' ';
  }

  return word.trim() ? `Rupees ${word.trim()} Only` : '';
}

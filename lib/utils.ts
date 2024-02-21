export function html(strings: TemplateStringsArray, ...values: string[]) {
  return strings.reduce((accumulator, string_, i) => {
    accumulator += string_;
    if (i < values.length) {
      accumulator += values[i];
    }

    return accumulator;
  }, '');
}

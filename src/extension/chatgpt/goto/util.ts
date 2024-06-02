export function splitCamelCase(input) {
  return input.split(/(?<=[a-z0-9])(?=[A-Z])/g);
}

export function fillTemplate(
  template: string,
  values: Record<string, string | number>
) {
  let result = template;

  for (const key in values) {
    result = result.replace(
      new RegExp(`{{${key}}}`, 'g'),
      String(values[key])
    );
  }

  return result;
}

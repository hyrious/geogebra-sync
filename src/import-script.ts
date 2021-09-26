export const imported = new Map<string, Promise<unknown>>();

export default function importScript(src: string) {
  const exist = imported.get(src);
  if (exist) return exist;

  const script = document.createElement("script");
  const result = new Promise((resolve, reject) => {
    script.onload = resolve;
    script.onerror = reject;
  });
  imported.set(src, result);

  script.src = src;
  document.head.append(script);
  return result;
}

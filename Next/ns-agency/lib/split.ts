// Replaces the element's text with one <span> per character (<br> is kept).
// The original markup is stored so running this twice (React strict mode) is safe.
export function splitChars(el: HTMLElement) {
  const source = el.dataset.split ?? el.innerHTML;
  el.innerHTML = "";
  const tmp = document.createElement("div");
  tmp.innerHTML = source;
  tmp.childNodes.forEach((node) => {
    if (node.nodeName === "BR") {
      el.appendChild(node.cloneNode());
      return;
    }
    const text = (node.textContent ?? "").replace(/\s+/g, " ").trim();
    [...text].forEach((ch) => {
      const span = document.createElement("span");
      span.textContent = ch === " " ? " " : ch;
      el.appendChild(span);
    });
  });
  el.dataset.split = source;
  return Array.from(el.querySelectorAll<HTMLElement>("span"));
}

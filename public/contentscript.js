const url = new URL(window.location.href);
async function loadScript(src) {
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = chrome.runtime.getURL(src);
    (document.head || document.body).appendChild(s);
    s.onload = () => {
      s.parentNode?.removeChild(s);
      resolve();
    };
    s.onerror = () => reject(new Error(`Failed to load ${src}`));
  });
}

async function main() {
  await loadScript('index.js');
  await loadScript('overrideFetch.js');
}

main();

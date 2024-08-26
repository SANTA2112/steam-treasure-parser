const s = document.createElement('script');
s.src = chrome.runtime.getURL('index.js');
(document.head || document.body).appendChild(s);
s.onload = () => {
  s.parentNode.removeChild(s);
};

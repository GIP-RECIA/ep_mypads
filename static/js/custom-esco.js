  function isIframe() {
    try {
      // 2 ways to test if iframe depending on browser compatibility
      //console.log("Testing iframe context :", window.self == window.top || window.location == window.parent.location);
      return window.self !== window.top || window.location !== window.parent.location;
    } catch (e) {
      //default use: the app is in iframe
      //console.log("Testing iframe context returned exception :", e);
      return true;
    }
  }
document.addEventListener("DOMContentLoaded", function(event) {
  if (isIframe()) {
    document.querySelectorAll("html>body").forEach((el) => {
      el.classList.add('iframe');
    });
  }
  document.querySelectorAll("html>body").forEach((el) => {
    el.classList.add(window.location.hostname.replace(/\./g,'-'));
  });
});

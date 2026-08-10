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

  const portalDomains = {
    'pads.netocentre.fr': 'lycees.netocentre.fr',
    'pads.recia.fr': 'ent.recia.fr',
    'pads-agri.netocentre.fr': 'lycees.netocentre.fr',
    'pads.touraine-eschool.fr': 'www.touraine-eschool.fr',
    'pads.chercan.fr': 'www.chercan.fr',
    'pads.colleges41.fr': 'ent.colleges41.fr',
    'pads.e-college.indre.fr': 'e-college.indre.fr',
    'pads.mon-e-college.loiret.fr': 'mon-e-college.loiret.fr',
    'pads.colleges-eureliens.fr': 'www.colleges-eureliens.fr',
    'pads.entkapreunion.re': 'lycees.entkapreunion.re',
  };
  const domain = portalDomains[window.location.hostname];
  const header = document.querySelector('extended-uportal-header');
  header.setAttribute('domain', domain);
  const footer = document.querySelector('extended-uportal-footer');
  footer.setAttribute('domain', domain);
});

if ('XDomainRequest' in window && window.XDomainRequest !== null) {
  // override default jQuery transport
  jQuery.ajaxSettings.xhr = function() {
      try { return new XDomainRequest(); }
      catch(e) { }
  };

  // also, override the support check
  jQuery.support.cors = true;
}
// include-fragments.js
// Loads header/footer fragments from /components/ into placeholder elements
// Usage: add <div id="site-header-placeholder"></div> and
// <div id="site-footer-placeholder"></div> to a page, then include this
// script with <script src="/js/include-fragments.js" defer></script>

(function(){
  function getBaseDir(){
    var script = document.currentScript || (function(){
      var scripts = document.getElementsByTagName('script');
      return scripts[scripts.length-1];
    })();
    var src = script && script.src ? script.src : window.location.href;
    // derive the script directory then resolve a components/ subpath so it works
    // whether the script was included as '/js/include-fragments.js' or 'js/include-fragments.js'
    try{
      var scriptDir = src.replace(/js\/include-fragments\.js(.*)$/,'');
      var resolved = new URL('components/', scriptDir).href;
      // helpful debug log for troubleshooting in the browser console
      if(window && window.console && window.console.log){
        console.log('[include-fragments] script.src=', src, '-> components base=', resolved);
      }
      return resolved;
    }catch(e){
      return src.replace(/js\/include-fragments\.js(.*)$/,'components/');
    }
  }

  function fetchAndInsert(file, selector){
    var base = getBaseDir();
    var url = base + file;
    fetch(url).then(function(resp){
      if(!resp.ok) throw new Error('Failed to load '+url);
      return resp.text();
    }).then(function(html){
      var container = document.querySelector(selector);
      if(container){
        container.innerHTML = html;
        // If we just inserted the footer, ensure it becomes visible.
        // Some pages load fragments after the main JS runs, so the footer
        // animation observer in main.js may not be attached. Attach a
        // lightweight observer here to toggle the .in-view class so the
        // footer is visible and animates when it enters the viewport.
  if(selector.indexOf('footer') !== -1){
          try{
            var footerEl = container.querySelector('.site-footer');
            if(footerEl){
              var setInView = function(v){
                if(v) footerEl.classList.add('in-view');
                else footerEl.classList.remove('in-view');
              };

              if('IntersectionObserver' in window){
                var obs = new IntersectionObserver(function(entries){
                  entries.forEach(function(entry){
                    setInView(entry.isIntersecting && entry.intersectionRatio > 0.03);
                  });
                }, {root:null, threshold:[0,0.03,0.1]});
                obs.observe(footerEl);
              } else {
                // fallback: make footer visible immediately
                setInView(true);
              }
            }
          }catch(e){ console.warn('Footer reveal attach failed', e); }
        }
        // dispatch a custom event so other scripts can initialize behaviour
        try{
          var ev = new CustomEvent('fragments:inserted', { detail: { selector: selector, file: file } });
          document.dispatchEvent(ev);
        }catch(e){ /* ignore if CustomEvent not supported */ }
        // after inserting header, mark active nav link and initialize header functionality
        if(selector.indexOf('header') !== -1){
          markActiveNav();
          // Call initHeader if it exists (defined in main.js)
          if(typeof window.initHeader === 'function'){
            try{
              window.initHeader();
            }catch(e){
              console.warn('initHeader failed:', e);
            }
          }
        }
      }
    }).catch(function(err){
      // silently fail (developer can check console)
      console.warn(err);
    });
  }

  function markActiveNav(){
    try{
      var path = window.location.pathname.replace(/\/index\.html$/,'/');
      var links = document.querySelectorAll('#main-nav a, .site-nav a');
      links.forEach(function(a){
        // normalize
        var href = a.getAttribute('href');
        if(!href) return;
        var normalized = href.replace(/^\//,'');
        var page = window.location.pathname.split('/').pop() || 'index.html';
        if(normalized === page || normalized === window.location.pathname.replace(/^\//,'')){
          a.classList.add('active');
        }
      });
    }catch(e){/*ignore*/}
  }

  document.addEventListener('DOMContentLoaded', function(){
    // Insert header/footer only where placeholders exist
    if(document.querySelector('#site-header-placeholder')){
      fetchAndInsert('header.html','#site-header-placeholder');
    }
    if(document.querySelector('#site-footer-placeholder')){
      fetchAndInsert('footer.html','#site-footer-placeholder');
    }

    // populate the copyright year if present
    var y = document.getElementById('year');
    if(y) y.textContent = new Date().getFullYear();
  });
})();

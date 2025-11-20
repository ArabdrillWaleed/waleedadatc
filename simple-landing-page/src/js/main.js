// Global runtime error capture — non-invasive helper to surface JS errors
// during debugging. It logs and adds a visible banner so it's easier to
// spot which script/line is throwing in the browser. This does not change
// functional behavior of the page.
window.addEventListener('error', function (evt) {
  try {
    console.error('Runtime error captured:', evt.error || evt.message, evt.filename + ':' + evt.lineno + ':' + evt.colno);
    // show light overlay banner for quick visual feedback (only when DOM is ready)
    if (document && document.body && !document.getElementById('runtime-error-banner')) {
      const b = document.createElement('div');
      b.id = 'runtime-error-banner';
      b.style.position = 'fixed';
      b.style.left = '0';
      b.style.right = '0';
      b.style.top = '0';
      b.style.background = 'rgba(200,40,40,0.95)';
      b.style.color = 'white';
      b.style.padding = '6px 12px';
      b.style.fontSize = '13px';
      b.style.zIndex = '2147483647';
      b.style.fontFamily = 'sans-serif';
      b.textContent = 'JavaScript error: ' + (evt.message || evt.error && evt.error.message || 'see console');
      b.addEventListener('click', () => b.parentNode && b.parentNode.removeChild(b));
      document.body.appendChild(b);
    }
  } catch (e) {
    // ignore errors in the error handler
  }
});

window.addEventListener('unhandledrejection', function (evt) {
  try {
    console.error('Unhandled promise rejection:', evt.reason);
  } catch (e) {}
});

document.addEventListener('DOMContentLoaded', function() {
    // Expose idempotent initializers so they can be called after fragments
    // are dynamically inserted into the page. These functions are safe to
    // call multiple times; they protect against double-registration.
    window.initHeader = function initHeader(){
      try{
        const navToggle = document.getElementById('nav-toggle');
        const mainNav = document.getElementById('main-nav');
        const headerEl = document.querySelector('.site-header');
        
        // Only proceed if elements exist and not already initialized
        if(!navToggle || !mainNav || !headerEl) return;
        if(initHeader._done) return; 
        initHeader._done = true;
        
        navToggle.addEventListener('click', () => {
          headerEl.classList.toggle('nav-open');
          const expanded = headerEl.classList.contains('nav-open');
          navToggle.setAttribute('aria-expanded', String(expanded));
        });

          // Ensure dropdown triggers/toggles work even when header is
          // inserted dynamically (e.g., via fragments). We attach handlers
          // to each .nav-item.has-dropdown so mobile toggles reliably open
          // and close submenus.
          document.querySelectorAll('.nav-item.has-dropdown').forEach(navItem => {
            const trigger = navItem.querySelector('.dropdown-trigger');
            let toggle = navItem.querySelector('.dropdown-toggle');
            const dropdownMenu = navItem.querySelector('.dropdown-menu');

            // If there's no explicit toggle button, create a small one for
            // mobile accessibility so taps have a clear hit-target. This
            // keeps markup stable while ensuring JS can always find a toggle.
            if(!toggle){
              try{
                toggle = document.createElement('button');
                toggle.className = 'dropdown-toggle';
                toggle.setAttribute('aria-expanded', 'false');
                toggle.setAttribute('aria-label', 'Toggle submenu');
                // insert after the trigger if present, else prepend
                if(trigger && trigger.parentNode){
                  trigger.parentNode.insertBefore(toggle, trigger.nextSibling);
                } else if(navItem.firstChild){
                  navItem.insertBefore(toggle, navItem.firstChild);
                } else {
                  navItem.appendChild(toggle);
                }
              }catch(e){/* non-fatal */}
            }

            const setExpanded = (expanded) => {
              if(expanded) navItem.classList.add('expanded'); else navItem.classList.remove('expanded');
              if(trigger) try{ trigger.setAttribute('aria-expanded', String(!!expanded)); }catch(e){}
              if(toggle) try{ toggle.setAttribute('aria-expanded', String(!!expanded)); }catch(e){}
            };

            const toggleDropdown = (e) => {
              if(e && e.preventDefault) e.preventDefault();
              const isExpanded = navItem.classList.contains('expanded');
              setExpanded(!isExpanded);
            };

            if(trigger){
              trigger.addEventListener('click', (e) => { e.preventDefault(); toggleDropdown(e); });
            }

            if(toggle){
              toggle.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); toggleDropdown(e); });
            }

            // Close when clicking outside
            document.addEventListener('click', (e) => {
              if(!navItem.contains(e.target) && navItem.classList.contains('expanded')){
                setExpanded(false);
              }
            });
          });

          // close menu when any link is clicked (mobile)
          mainNav.querySelectorAll('a').forEach(a => {
            a.addEventListener('click', (e) => {
              if(window.innerWidth <= 720 && headerEl.classList.contains('nav-open')){
                if (!e.target.closest('.dropdown-toggle')) {
                  headerEl.classList.remove('nav-open');
                  navToggle.setAttribute('aria-expanded', 'false');
                }
              }
            });
          });
        
        // mark active nav links to match current page
        try{
          const links = document.querySelectorAll('#main-nav a, .site-nav a');
          var page = window.location.pathname.split('/').pop() || 'index.html';
          links.forEach(function(a){
            a.classList.remove('active');
            var href = a.getAttribute('href') || '';
            if(href === page || href === '/' + page || (page === 'index.html' && (href === '' || href === 'index.html'))){
              a.classList.add('active');
            }
          });
        }catch(e){}
      }catch(e){console.error('initHeader failed',e);}    
    };

    window.initFooter = function initFooter(){
      try{
        if(initFooter._done) return; initFooter._done = true;
        const footer = document.querySelector('.site-footer');
        if(!footer) return;
        const setInView = (v) => { if(v) footer.classList.add('in-view'); else footer.classList.remove('in-view'); };
        if('IntersectionObserver' in window){
          const obs = new IntersectionObserver((entries) => {
            entries.forEach(entry => setInView(entry.isIntersecting && entry.intersectionRatio > 0.03));
          }, {root:null, threshold:[0,0.03,0.1]});
          obs.observe(footer);
        } else {
          setInView(true);
        }
      }catch(e){console.error('initFooter failed',e);}    
    };

      // Amenities modal logic
      (function(){
        const modal = document.getElementById('amenities-modal');
        if (!modal) return;
        const modalTitle = document.getElementById('amenities-modal-title');
        const modalDesc = document.getElementById('amenities-modal-description');
        const modalImage = document.getElementById('amenities-modal-image');
        document.querySelectorAll('.amenity-card').forEach(card => {
          card.addEventListener('click', function(e){
            e.preventDefault();
            // Set modal content
            modalTitle.textContent = card.dataset.amenityName || '';
            modalDesc.textContent = card.dataset.amenityDescription || '';
            const imageSrc = card.dataset.amenityImage;
            if(imageSrc){
              modalImage.innerHTML = `<img src="${imageSrc}" alt="${card.dataset.amenityName || ''}" />`;
              modalImage.style.display = 'block';
            } else {
              modalImage.innerHTML = '';
              modalImage.style.display = 'none';
            }
            // Show modal with drop-in animation
            modal.style.display = 'flex';
            setTimeout(() => {
              modal.setAttribute('aria-hidden','false');
            }, 10);
            document.body.classList.add('modal-open');
          });
        });
        // Close modal handlers
        modal.querySelectorAll('[data-action="close"]').forEach(btn => {
          btn.addEventListener('click', function(){
            modal.setAttribute('aria-hidden','true');
            modal.style.display = 'none';
            document.body.classList.remove('modal-open');
          });
        });
      })();

    // When fragments are inserted dynamically, re-run the initializers so
    // nav toggle, active link highlighting and footer reveal work.
    document.addEventListener('fragments:inserted', function(ev){
      try{
        // call both initializers; they are idempotent
        if(window.initHeader) window.initHeader();
        if(window.initFooter) window.initFooter();
      }catch(e){console.warn('fragments:inserted handler failed', e);}    
    });
    // Auto-inject favicons into <head> for any page that includes this script.
    // This ensures favicons are present on all pages without editing each HTML file.
    (function injectFavicons(){
      try {
        const head = document.head || document.getElementsByTagName('head')[0];
        if(!head) return;

        // If a favicon or apple-touch-icon is already present, don't duplicate.
        if(head.querySelector('link[rel="icon"], link[rel="shortcut icon"], link[rel="apple-touch-icon"]')) return;

        const links = [
          { rel: 'icon', href: 'images/favicon.png', type: 'image/png' },
          { rel: 'apple-touch-icon', href: 'images/apple-touch-icon-144.png', sizes: '144x144' }
        ];

        links.forEach(cfg => {
          const l = document.createElement('link');
          l.rel = cfg.rel;
          if(cfg.type) l.type = cfg.type;
          if(cfg.sizes) l.sizes = cfg.sizes;
          l.href = cfg.href;
          head.appendChild(l);
        });

        // Add legacy shortcut icon as well for older browsers
        const sc = document.createElement('link');
        sc.rel = 'shortcut icon';
        sc.href = 'images/favicon.png';
        head.appendChild(sc);

        // Add .ico fallback for maximum compatibility
        const ico = document.createElement('link');
        ico.rel = 'icon';
        ico.href = 'images/favicon.ico';
        ico.type = 'image/x-icon';
        head.appendChild(ico);

        // Useful meta tags for theme color and windows tile
        if(!head.querySelector('meta[name="theme-color"]')){
          const m1 = document.createElement('meta');
          m1.name = 'theme-color';
          m1.content = '#0b1b2b';
          head.appendChild(m1);
        }

        if(!head.querySelector('meta[name="msapplication-TileImage"]')){
          const m2 = document.createElement('meta');
          m2.name = 'msapplication-TileImage';
          m2.content = 'images/apple-touch-icon-144.png';
          head.appendChild(m2);
        }
      } catch (e) {
        // Non-fatal; just log for debugging
        console.error('Favicon injection failed:', e);
      }
    })();

    // Year update
    (function(){ 
      const yr = document.getElementById('year');
      if(yr) yr.textContent = new Date().getFullYear();
    })();

    // Header top-line measurement: set CSS variables so the ::before line
    // starts at COMPANY (not the logo) and spans to the right edge of INSTRUCTORS.
    (function setHeaderTopline(){
      const headerRow = document.querySelector('.header-main-row');
      const navList = document.querySelector('.nav-list');
      if(!headerRow || !navList) return;

      const setVars = () => {
        const items = Array.from(navList.querySelectorAll('a'));
        const company = items.find(a => /company/i.test(a.textContent.trim()));
        let instructors = items.find(a => /instructors/i.test(a.textContent.trim()));
        if(!instructors) instructors = items[items.length - 1];

        const rowRect = headerRow.getBoundingClientRect();
        if(!company || !instructors) return;

        const cRect = company.getBoundingClientRect();
        const iRect = instructors.getBoundingClientRect();

        // start: distance from row left to the left edge of the COMPANY link
        const start = Math.max(0, cRect.left - rowRect.left);
        // width: distance from COMPANY left to INSTRUCTORS right
        const width = Math.max(0, iRect.right - cRect.left);

        headerRow.style.setProperty('--header-topline-start', Math.round(start) + 'px');
        headerRow.style.setProperty('--header-topline-width', Math.round(width) + 'px');
        // Position the Arabic utility link so its RIGHT edge aligns with the
        // right end of the topline (INSTRUCTORS right edge). We measure the
        // INSTRUCTORS right coordinate and offset by the Arabic element width
        // so the Arabic link's right edge sits at the same x position.
        try {
          const topContainer = document.querySelector('.header-top .container');
          const arabicEl = document.querySelector('.header-top .arabic');
          if(topContainer && instructors){
            const topLeft = topContainer.getBoundingClientRect().left;
            const lineRight = iRect.right; // viewport x coord for INSTRUCTORS right edge
            // left position relative to the container where the line's right edge sits
            let targetLeft = Math.round(Math.max(0, lineRight - topLeft));

            // we want the Arabic link's LEFT edge to start exactly at the lineRight
            // coordinate, so do NOT subtract the arabic element width here.

            topContainer.style.setProperty('--arabic-left', targetLeft + 'px');
          }
        } catch(e){ /* ignore measurement errors */ }
      };

      setVars();
      window.addEventListener('resize', setVars);
      window.addEventListener('load', setVars);
    })();

    // Dropdowns removed from nav — no dropdown JS necessary

      // Loader behavior: hide after window load or after 2.5s fallback
      (function(){
        const loader = document.getElementById('site-loader');
        if(!loader) return;

        const hide = () => {
          if(!loader) return;
          loader.classList.add('hidden');
          setTimeout(() => {
            if(loader && loader.parentNode) loader.parentNode.removeChild(loader);
          }, 600);
        };

        if(document.readyState === 'complete'){
          // already loaded
          setTimeout(hide, 120);
        } else {
          window.addEventListener('load', hide, {once:true});
          // fallback in case load doesn't fire quickly
          setTimeout(hide, 2500);
        }
      })();

      // Sticky notes reveal: observe .sticky-note elements and add .visible
      // when they enter the viewport. This was previously handled elsewhere
      // and may be missing in some copies — add a lightweight observer here.
      (function stickyNotesReveal(){
        try {
          const notes = Array.from(document.querySelectorAll('.sticky-note'));
          if(!notes || notes.length === 0) return;

          const reveal = (el) => el.classList.add('visible');
          if('IntersectionObserver' in window){
            const obs = new IntersectionObserver((entries, observer) => {
              entries.forEach(entry => {
                if(entry.isIntersecting){
                  reveal(entry.target);
                  observer.unobserve(entry.target);
                }
              });
            }, {root: null, threshold: 0.08});

            notes.forEach(n => obs.observe(n));
          } else {
            // fallback: reveal all so content is accessible
            notes.forEach(n => reveal(n));
          }
        } catch(e){ /* non-fatal */ }
      })();

        // Header scroll behavior: make header white when scrolled
      (function(){
        // Wrap the behavior so it can run immediately if the header exists
        // or re-run once after fragments are inserted (header injected later).
        // Also create a fallback spacer early so content isn't overlapped while
        // the header fragment is still being fetched/inserted.
        const ensureInitialSpacer = function(){
          if(document.getElementById('header-spacer')) return;
          const spacer = document.createElement('div');
          spacer.id = 'header-spacer';
          // Set initial header height variables and safe default spacer height
          spacer.style.height = '90px'; // Default to expanded header height
          try {
            document.documentElement.style.setProperty('--header-height', '90px');
            document.documentElement.style.setProperty('--header-height-base', '90px');
            document.documentElement.style.setProperty('--header-height-scrolled', '64px');
          } catch(e) {}
          // insert before main content as a conservative fallback
          const main = document.querySelector('main');
          if(main && main.parentNode){
            main.parentNode.insertBefore(spacer, main);
          } else if(document.body.firstChild){
            document.body.insertBefore(spacer, document.body.firstChild);
          } else {
            document.body.appendChild(spacer);
          }
        };

        ensureInitialSpacer();

        const run = function(){
          const header = document.querySelector('.site-header');
          if(!header) return false;

          // If an initial spacer exists in a fallback position, move it to be
          // immediately after the header so measurements are accurate.
          let headerSpacer = document.querySelector('#header-spacer');
          if(!headerSpacer){
            headerSpacer = document.createElement('div');
            headerSpacer.id = 'header-spacer';
            header.parentNode.insertBefore(headerSpacer, header.nextSibling);
          } else {
            // move existing spacer to be just after header
            if(headerSpacer.parentNode !== header.parentNode || headerSpacer.previousSibling !== header){
              try{ headerSpacer.parentNode.removeChild(headerSpacer); }catch(e){}
              header.parentNode.insertBefore(headerSpacer, header.nextSibling);
            }
          }

          const updateSpacer = () => {
            const rect = header.getBoundingClientRect();
            const height = Math.round(rect.height);
            
            // Update both spacer height and CSS variable
            headerSpacer.style.height = height + 'px';
            try {
              // Always keep header height variables in sync
              document.documentElement.style.setProperty('--header-height', height + 'px');
              document.documentElement.style.setProperty('--header-height-base', height + 'px');
              document.documentElement.style.setProperty('--header-height-scrolled', Math.min(height, 64) + 'px');
            } catch(e) {
              console.warn('Failed to update header height variables:', e);
            }
          };

          // Set initial header height values before any measurements
          try {
            document.documentElement.style.setProperty('--header-height', '64px');
            document.documentElement.style.setProperty('--header-height-base', '90px');
            document.documentElement.style.setProperty('--header-height-scrolled', '64px');
          } catch(e) {}

          // Update on resize
          updateSpacer();
          window.addEventListener('resize', updateSpacer);

          // Use ResizeObserver for dynamic header size changes
          if('ResizeObserver' in window) {
            try {
              const ro = new ResizeObserver(entries => {
                // Only update if size actually changed
                if(entries[0].contentRect.height !== header.getBoundingClientRect().height) {
                  updateSpacer();
                }
              });
              ro.observe(header);
            } catch(e) {
              console.warn('ResizeObserver setup failed:', e);
              // Fallback: periodic re-checks
              setTimeout(updateSpacer, 250);
              setTimeout(updateSpacer, 800);
            }
          } else {
            // Legacy fallback: periodic re-checks 
            setTimeout(updateSpacer, 250);
            setTimeout(updateSpacer, 800);
          }

          // Animation helper: when toggling the scrolled state, play a hide-then-drop animation
          // so the header visually disappears (moves up + fades) then returns smaller.
          const playShrinkSequence = (shouldBeScrolled) => {
            // synchronous toggle: immediately add/remove the scrolled state without animations
            const isScrolled = header.classList.contains('scrolled');
            if(shouldBeScrolled === isScrolled){
              updateSpacer();
              return;
            }

            if(shouldBeScrolled && !isScrolled){
              header.classList.add('scrolled');
              // hide utility links (like the Arabic toggle) from assistive tech while shrunk
              const arabic = document.querySelector('.header-top .arabic');
              if(arabic){
                arabic.setAttribute('aria-hidden', 'true');
                arabic.dataset.prevTab = arabic.getAttribute('tabindex') || '';
                arabic.setAttribute('tabindex', '-1');
              }
              updateSpacer();
            } else if(!shouldBeScrolled && isScrolled){
              header.classList.remove('scrolled');
              // restore utility link visibility and tab order for assistive tech
              const arabic = document.querySelector('.header-top .arabic');
              if(arabic){
                arabic.removeAttribute('aria-hidden');
                const prev = arabic.dataset.prevTab || '';
                if(prev) arabic.setAttribute('tabindex', prev);
                else arabic.removeAttribute('tabindex');
                delete arabic.dataset.prevTab;
              }
              // small timeout to allow CSS transition on header-inner to start, then update spacer
              setTimeout(updateSpacer, 40);
            }
          };

          const check = () => {
            const shouldBeScrolled = window.scrollY > 20;
            playShrinkSequence(shouldBeScrolled);
          };

          // initial check and bind
          check();
          window.addEventListener('scroll', check, {passive:true});

          // Anchor link offset: when clicking on same-page anchors, account for sticky header
          const offsetToTarget = (target) => {
            if(!target) return;
            const headerHeight = header.getBoundingClientRect().height;
            const top = target.getBoundingClientRect().top + window.scrollY - headerHeight - 8;
            window.scrollTo({top, behavior: 'smooth'});
          };

          // handle hash-only links (href="#foo")
          document.querySelectorAll('a[href^="#"]').forEach(a => {
            a.addEventListener('click', (e) => {
              const targetId = a.getAttribute('href').slice(1);
              if(!targetId) return;
              const target = document.getElementById(targetId);
              if(!target) return;
              // prevent default jump and perform offset scroll
              e.preventDefault();
              history.pushState(null, '', '#' + targetId);
              offsetToTarget(target);
            });
          });

          // handle links that include the current page + hash (e.g., index.html#courses)
          document.querySelectorAll('a[href*="#"]').forEach(a => {
            const href = a.getAttribute('href') || '';
            try {
              const url = new URL(href, window.location.href);
              if(url.pathname === window.location.pathname && url.hash){
                a.addEventListener('click', (e) => {
                  const id = url.hash.slice(1);
                  const target = document.getElementById(id);
                  if(target){
                    e.preventDefault();
                    history.pushState(null, '', url.pathname + url.hash);
                    offsetToTarget(target);
                  }
                });
              }
            } catch(e){ /* ignore invalid URLs */ }
          });

          // When the hash changes (back/forward or direct link), offset the scroll after the browser jumps
          const onHashChange = () => {
            const id = window.location.hash.slice(1);
            if(!id) return;
            const target = document.getElementById(id);
            if(target) setTimeout(() => offsetToTarget(target), 24);
          };
          window.addEventListener('hashchange', onHashChange);
          // perform one-time adjustment if the page loaded with a hash
          if(window.location.hash){
            setTimeout(onHashChange, 80);
          }

          return true;
        };

        // run now or once fragments are inserted
        if(!run()){
          document.addEventListener('fragments:inserted', function(){ try{ run(); }catch(e){} }, { once: true });
        }
      })();

      // Footer reveal: toggle .in-view when footer enters/exits viewport so the animation
      // plays every time it comes into view.
      (function(){
        const footer = document.querySelector('.site-footer');
        if(!footer) return;

        const setInView = (v) => {
          if(v) footer.classList.add('in-view');
          else footer.classList.remove('in-view');
        };

        if('IntersectionObserver' in window){
          const obs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
              setInView(entry.isIntersecting && entry.intersectionRatio > 0.03);
            });
          }, {root:null, threshold: [0, 0.03, 0.1]});

          obs.observe(footer);
        } else {
          // fallback: check on scroll and toggle
          const onScroll = () => {
            const rect = footer.getBoundingClientRect();
            const inView = rect.top < window.innerHeight - 20 && rect.bottom > 20;
            setInView(inView);
          };
          window.addEventListener('scroll', onScroll, {passive:true});
          onScroll();
        }
      })();

    // Active nav highlighting: ensure the correct tab is highlighted across pages
    (function setActiveNav(){
      try {
        const navLinks = document.querySelectorAll('.site-nav a');
        if(!navLinks || navLinks.length === 0) return;

        const url = new URL(window.location.href);
  // derive the current page basename (e.g. index.html or about.html)
  const segments = url.pathname.split('/').filter(Boolean);
  const path = segments.length ? segments.pop() : 'index.html';
  const hash = url.hash || '';

        // helper to normalize hrefs for comparison
        const normalize = href => {
          // make sure hash-only links reference current page
          if(href.startsWith('#')) return (path || 'index.html') + href;
          return href;
        };

        navLinks.forEach(a => a.classList.remove('active'));

        // Priority: exact pathname (home/about) > hash anchors (courses/instructors)
        // First try exact match
        let matched = Array.from(navLinks).find(a => {
          const nh = normalize(a.getAttribute('href') || '');
          return nh === path || nh === ('/' + path) || nh === (path + '#') || nh === (path + hash);
        });

        // If no exact match, match by hash (e.g., #courses on index)
        if(!matched && hash){
          matched = Array.from(navLinks).find(a => (a.getAttribute('href') || '').endsWith(hash));
        }

        // If still no match, fallback to Home link when on index
        if(!matched && (path === '' || path === 'index.html')){
          matched = Array.from(navLinks).find(a => (a.getAttribute('href') || '').endsWith('index.html') || (a.getAttribute('href') || '') === 'index.html' || (a.getAttribute('href') || '') === '/');
        }

        // Re-introduce persistent "active" class, but only when the header
        // is in its scrolled (compact) state. When the header is expanded we
        // keep the behavior transient (no persistent active state).
        const headerEl = document.querySelector('.site-header');

        const setActive = (link) => {
          navLinks.forEach(n => n.classList.remove('active'));
          if(link) link.classList.add('active');
        };

        // Set the active tab on load based on URL (path/hash) so it's
        // highlighted in both scrolled and unscrolled modes.
        if(matched){
          setActive(matched);
        }

        // Add click handlers that set the active state unconditionally so
        // clicking a tab highlights it regardless of header state.
        navLinks.forEach(a => {
          a.addEventListener('click', (e) => {
            setActive(a);
          });
        });
      } catch (e){
        console.error('Active nav setup failed', e);
      }
    })();
    
    // Try to initialize header/footer immediately if they already exist in DOM
    // (in case fragments loaded before this script)
    try{
      if(window.initHeader) window.initHeader();
      if(window.initFooter) window.initFooter();
    }catch(e){
      console.warn('Initial header/footer init failed', e);
    }
});
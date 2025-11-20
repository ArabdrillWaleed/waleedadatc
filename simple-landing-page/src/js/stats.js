// Interactive Stats: count-up on view, tilt on hover, and animated rings for % values
(function(){
  function animateCount(el, target, opts){
    const duration = (opts && opts.duration) || 1800;
    const decimals = (opts && opts.decimals) || (Number.isInteger(target) ? 0 : 1);
    const start = performance.now();
    function ease(t){ return 1 - Math.pow(1 - t, 3); }
    function fmt(v){ return v.toFixed(decimals); }
    function frame(ts){
      const t = Math.min(1, (ts - start) / duration);
      const val = target * ease(t);
      el.textContent = fmt(val);
      if (t < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  function setupObserver(){
    const cards = document.querySelectorAll('.interactive-stats .stat-card');
    if (!cards.length) return;
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const card = entry.target;
        const numEl = card.querySelector('.stat-number .value');
        const unit = card.dataset.unit || '';
        const target = parseFloat(card.dataset.value);
        if (!numEl || isNaN(target)) { io.unobserve(card); return; }
        animateCount(numEl, target, { duration: 1600 });
        // update ring for percentages
        if (card.classList.contains('is-percent')){
          const ring = card.querySelector('.progress-ring');
          if (ring){
            const end = target; // 0-100
            const duration = 1600;
            const t0 = performance.now();
            function ease(t){ return 1 - Math.pow(1 - t, 3); }
            function ringFrame(now){
              const t = Math.min(1, (now - t0) / duration);
              const eased = ease(t) * end;
              ring.style.setProperty('--p', eased);
              if (t < 1) requestAnimationFrame(ringFrame);
            }
            requestAnimationFrame(ringFrame);
          }
        }
        io.unobserve(card);
      });
    }, { threshold: 0.4 });

    cards.forEach(card => io.observe(card));
  }

  function setupTilt(){
    const cards = document.querySelectorAll('.interactive-stats .stat-card');
    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        const rotY = (x - 0.5) * 10;
        const rotX = (0.5 - y) * 10;
        card.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-2px)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  window.addEventListener('DOMContentLoaded', function(){
    setupObserver();
    setupTilt();
  });
})();

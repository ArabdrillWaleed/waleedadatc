// Simple parallax effect for timeline section background
document.addEventListener('DOMContentLoaded', () => {
  const parallaxSection = document.querySelector('.timeline-hero[data-parallax="true"]');
  
  if (!parallaxSection) {
    console.log('No parallax section found');
    return;
  }
  
  console.log('Parallax initialized');
  
  // Function to update parallax
  const updateParallax = () => {
    const scrolled = window.pageYOffset;
    const sectionTop = parallaxSection.offsetTop;
    const sectionHeight = parallaxSection.offsetHeight;
    const windowHeight = window.innerHeight;
    
    // Check if section is in viewport
    if (scrolled + windowHeight > sectionTop && scrolled < sectionTop + sectionHeight) {
      // Calculate relative scroll position within the section
      const relativeScroll = scrolled - sectionTop + windowHeight;
      const parallaxOffset = relativeScroll * 0.3; // 30% of scroll speed
      
      // Apply transform to the section's background via CSS custom property
      parallaxSection.style.backgroundPosition = `center ${50 - parallaxOffset * 0.05}%`;
    }
  };
  
  // Throttled scroll handler
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateParallax();
        ticking = false;
      });
      ticking = true;
    }
  });
  
  // Initial call
  updateParallax();
});

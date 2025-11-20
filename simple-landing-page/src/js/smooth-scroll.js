// Smooth scroll functionality for the hero scroll button
document.addEventListener('DOMContentLoaded', () => {
  const scrollButton = document.querySelector('.modern-scroll-cta');
  
  if (scrollButton) {
    scrollButton.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Find the first section after the hero
      const hero = document.querySelector('.modern-hero');
      const nextSection = hero?.nextElementSibling;
      
      if (nextSection) {
        nextSection.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  }
});

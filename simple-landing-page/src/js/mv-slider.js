document.addEventListener('DOMContentLoaded', () => {
  // Check if slider exists on this page first
  const sliderContainer = document.querySelector('.mv-slider');
  if (!sliderContainer) return; // Exit early if no slider on this page
  
  const slides = sliderContainer.querySelectorAll('.mv-slide');
  if (!slides || slides.length === 0) return; // Exit if no slides
  
  const prevBtn = sliderContainer.querySelector('.mv-nav.prev');
  const nextBtn = sliderContainer.querySelector('.mv-nav.next');
  let currentSlide = 0;
  let autoRotateTimer;
  const ROTATE_INTERVAL = 5000; // 5 seconds

  function updateSlides() {
    slides.forEach(slide => {
      slide.classList.remove('active');
      slide.style.transform = 'translateX(100px)';
      slide.style.opacity = '0';
      slide.style.visibility = 'hidden';
    });

    slides[currentSlide].classList.add('active');
    slides[currentSlide].style.transform = 'translateX(0)';
    slides[currentSlide].style.opacity = '1';
    slides[currentSlide].style.visibility = 'visible';
  }

  function startAutoRotate() {
    stopAutoRotate(); // Clear any existing timer
    autoRotateTimer = setInterval(nextSlide, ROTATE_INTERVAL);
  }

  function stopAutoRotate() {
    if (autoRotateTimer) {
      clearInterval(autoRotateTimer);
      autoRotateTimer = null;
    }
  }

  function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    updateSlides();
  }

  function prevSlide() {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    updateSlides();
  }

  // Wrap navigation functions to restart timer
  function handlePrevClick() {
    prevSlide();
    startAutoRotate(); // Reset timer when manually navigating
  }

  function handleNextClick() {
    nextSlide();
    startAutoRotate(); // Reset timer when manually navigating
  }

  // Only add navigation if both buttons exist
  const hasNavigation = prevBtn && nextBtn;
  
  if (hasNavigation) {
    nextBtn.addEventListener('click', handleNextClick);
    prevBtn.addEventListener('click', handlePrevClick);

    // Hit zones: clicking left/right halves navigates slides
    const hitLeft = document.createElement('div');
    const hitRight = document.createElement('div');
    hitLeft.className = 'mv-hit-zone mv-hit-left';
    hitRight.className = 'mv-hit-zone mv-hit-right';

    sliderContainer.appendChild(hitLeft);
    sliderContainer.appendChild(hitRight);
    hitLeft.addEventListener('click', handlePrevClick);
    hitRight.addEventListener('click', handleNextClick);

    // Pause auto-rotation when hovering over the slider
    sliderContainer.addEventListener('mouseenter', stopAutoRotate);
    sliderContainer.addEventListener('mouseleave', startAutoRotate);

    // Start auto-rotation when we have navigation
    startAutoRotate();
  } else {
    console.log('Mission & Vision slider: Navigation buttons not found, navigation disabled');
  }

  // Only add keyboard navigation and visibility handlers if we have navigation
  if (hasNavigation) {
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') handlePrevClick();
      if (e.key === 'ArrowRight') handleNextClick();
    });

    // Handle page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        stopAutoRotate();
      } else {
        startAutoRotate();
      }
    });
  }
});

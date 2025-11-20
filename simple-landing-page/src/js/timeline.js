document.addEventListener('DOMContentLoaded', () => {
  const timelineYears = document.querySelectorAll('.timeline-year');
  const prevBtn = document.querySelector('.timeline-nav .prev');
  const nextBtn = document.querySelector('.timeline-nav .next');
  let currentYear = 0;

  function updateTimeline() {
    timelineYears.forEach((year, index) => {
      if (index === currentYear) {
        year.classList.add('active');
      } else {
        year.classList.remove('active');
      }
    });
  }

  function nextYear() {
    currentYear = (currentYear + 1) % timelineYears.length;
    updateTimeline();
  }

  function prevYear() {
    currentYear = (currentYear - 1 + timelineYears.length) % timelineYears.length;
    updateTimeline();
  }

  nextBtn.addEventListener('click', nextYear);
  prevBtn.addEventListener('click', prevYear);

  // Make years clickable
  timelineYears.forEach((year, index) => {
    year.addEventListener('click', () => {
      currentYear = index;
      updateTimeline();
    });
  });
});
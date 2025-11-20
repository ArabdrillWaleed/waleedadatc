// Timeline horizontal scroll feature
const leftBtn = document.querySelector('.timeline-scroll-btn.left');
const rightBtn = document.querySelector('.timeline-scroll-btn.right');
const track = document.querySelector('.timeline-scroll-track');

if (leftBtn && rightBtn && track) {
  leftBtn.addEventListener('click', () => {
    track.scrollBy({ left: -250, behavior: 'smooth' });
  });
  rightBtn.addEventListener('click', () => {
    track.scrollBy({ left: 250, behavior: 'smooth' });
  });
}

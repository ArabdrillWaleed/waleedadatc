// Mission & Vision Toggle Functionality
document.addEventListener('DOMContentLoaded', function() {
  const toggles = document.querySelectorAll('.mv-toggle');
  const contents = document.querySelectorAll('.mv-content');

  toggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      const target = toggle.dataset.target;
      
      // Update toggle buttons
      toggles.forEach(t => t.classList.remove('active'));
      toggle.classList.add('active');
      
      // Update content sections
      contents.forEach(content => {
        if (content.id === target) {
          content.classList.add('active');
        } else {
          content.classList.remove('active');
        }
      });
    });
  });
});
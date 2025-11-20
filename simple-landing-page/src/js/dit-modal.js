// DIT Modal JS (external)
document.addEventListener('DOMContentLoaded', function() {
  const ditImages = [
    {
      src: 'images/Dit1.png',
      caption: 'H2S Train The Trainer'
    },
    {
      src: 'images/Fallprot.png',
      caption: 'Fall Protection Train The Trainer'
    },
    {
      src: 'images/Manualhandling.png',
      caption: 'Manual Handling Train The Trainer'
    }
  ];
  let ditIndex = 0;
  let ditAutoTimer = null;
  const modal = document.getElementById('dit-modal');
  const img = document.getElementById('dit-modal-img');
  const caption = document.getElementById('dit-modal-caption');
  const prevBtn = document.getElementById('dit-prev');
  const nextBtn = document.getElementById('dit-next');
  const closeBtn = document.querySelector('#dit-modal .lightbox-close');
  const trigger = document.getElementById('dit-modal-trigger');

  if (!modal || !img || !caption || !prevBtn || !nextBtn || !closeBtn || !trigger) {
    console.error('DIT modal elements not found');
    return;
  }

  function updateDitModal(idx) {
    ditIndex = idx;
    img.src = ditImages[ditIndex].src;
    caption.textContent = ditImages[ditIndex].caption;
  }
  
  function showDitModal(idx) {
    updateDitModal(idx);
    modal.style.display = 'flex';
    startDitAutoCycle();
  }
  
  function hideDitModal() {
    modal.style.display = 'none';
    stopDitAutoCycle();
  }
  
  function startDitAutoCycle() {
    stopDitAutoCycle();
    ditAutoTimer = setInterval(() => {
      ditIndex = (ditIndex + 1) % ditImages.length;
      updateDitModal(ditIndex);
    }, 3500);
  }
  
  function stopDitAutoCycle() {
    if (ditAutoTimer) clearInterval(ditAutoTimer);
    ditAutoTimer = null;
  }

  trigger.addEventListener('click', function() { showDitModal(0); });
  prevBtn.addEventListener('click', function() {
    ditIndex = (ditIndex - 1 + ditImages.length) % ditImages.length;
    updateDitModal(ditIndex);
    startDitAutoCycle();
  });
  nextBtn.addEventListener('click', function() {
    ditIndex = (ditIndex + 1) % ditImages.length;
    updateDitModal(ditIndex);
    startDitAutoCycle();
  });
  closeBtn.addEventListener('click', hideDitModal);
  
  // Close on background click
  modal.addEventListener('click', function(e) {
    if (e.target === modal) {
      hideDitModal();
    }
  });
});

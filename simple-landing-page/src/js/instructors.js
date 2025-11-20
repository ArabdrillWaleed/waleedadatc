document.addEventListener('DOMContentLoaded', function() {
  const modal = document.getElementById('instructor-modal');
  if(!modal) return;
  
  const modalTitle = document.getElementById('instructor-modal-title');
  const modalSubtitle = document.getElementById('instructor-modal-titleline');
  const modalMedia = document.getElementById('instructor-modal-media');
  const modalSummary = document.getElementById('instructor-modal-summary');
  const modalCompetencies = document.getElementById('instructor-modal-competencies');
  const modalContact = document.getElementById('instructor-modal-contact');
  
  // Search functionality
  const searchInput = document.getElementById('instructor-search-input');
  const searchCount = document.getElementById('instructor-search-count');
  const noResults = document.getElementById('instructor-no-results');
  const instructorCards = document.querySelectorAll('.instructor-card');
  const teamSections = document.querySelectorAll('.team-section');
  
  function filterInstructors(searchTerm) {
    searchTerm = searchTerm.toLowerCase().trim();
    let visibleCount = 0;
    const searchActive = Boolean(searchTerm);
    // add a body-level class so CSS can alter layout during search (e.g., show all cards)
    if (searchActive) {
      document.body.classList.add('instructor-search-active');
    } else {
      document.body.classList.remove('instructor-search-active');
    }

    instructorCards.forEach(card => {
      const name = card.querySelector('.instructor-name')?.textContent || '';
      const title = card.querySelector('h3')?.textContent || '';
      const text = `${name} ${title}`.toLowerCase();
      
      if (!searchTerm || text.includes(searchTerm)) {
        card.style.display = '';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    // Update no results message only
    noResults.style.display = visibleCount === 0 ? 'block' : 'none';
    // Hide any team section that has no visible instructor cards.
    teamSections.forEach(section => {
      const grid = section.querySelector('.instructors-grid');
      if(!grid) return;
      const anyVisible = Array.from(grid.querySelectorAll('.instructor-card')).some(c => {
        if(c.style.display === 'none') return false;
        return window.getComputedStyle(c).display !== 'none';
      });
      // Hide the section if no instructors are visible in it
      section.style.display = anyVisible ? '' : 'none';
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => filterInstructors(e.target.value));
    // Initialize without count
    searchCount.textContent = ``;
    // Initialize sections visibility based on full list
    filterInstructors('');
  }
  
  function openModal(card) {
    // Name and Title
    const nameEl = card.querySelector('.instructor-name');
    const titleEl = card.querySelector('h3');
    const name = (nameEl && nameEl.textContent.trim()) || card.dataset.name || '';
    const title = (titleEl && titleEl.textContent.trim()) || card.dataset.title || '';
    
    modalTitle.textContent = name;
    modalSubtitle.textContent = title;
    
    // Image
    const imgSrc = card.dataset.image || card.querySelector('img')?.getAttribute('src') || '';
    if(imgSrc) {
      modalMedia.style.backgroundImage = `url('${imgSrc}')`;
    }
    
    // Professional Summary
    const profSummary = (card.dataset.professionalSummary && card.dataset.professionalSummary.trim()) || 
                       card.dataset.bio || '';
    modalSummary.textContent = profSummary || 'No professional summary available.';
    
    // Core Competencies
    let competencies = [];
    try {
      const compRaw = card.dataset.coreCompetencies || card.dataset.corecompetencies || '';
      if(compRaw) {
        competencies = JSON.parse(compRaw);
      }
    } catch(e) {
      competencies = (card.dataset.coreCompetencies || '').split(',').map(s => s.trim()).filter(Boolean);
    }
    
    if(competencies.length > 0) {
      const ul = document.createElement('ul');
      competencies.forEach(comp => {
        const li = document.createElement('li');
        li.textContent = comp;
        ul.appendChild(li);
      });
      modalCompetencies.innerHTML = '';
      modalCompetencies.appendChild(ul);
    } else {
      modalCompetencies.textContent = 'No core competencies listed.';
    }
    
    // Contact Information section removed as requested
    // modalContact is no longer used
    
    // Scroll modal content wrapper to top when opening
    const modalContentWrapper = modal.querySelector('.modal-content-wrapper');
    if (modalContentWrapper) {
      modalContentWrapper.scrollTop = 0;
    }
    
    // Trigger animation
    modal.style.display = 'flex';
    document.body.classList.add('modal-open');
    setTimeout(() => {
      modal.setAttribute('aria-hidden', 'false');
      modal.querySelector('.modal-close')?.focus();
    }, 10);
  }
  
  function closeModal() {
    modal.setAttribute('aria-hidden', 'true');
    setTimeout(() => {
      modal.style.display = 'none';
    }, 450);
    document.body.classList.remove('modal-open');
  }
  
  // Event Listeners
  document.addEventListener('click', e => {
    const card = e.target.closest('.instructor-card');
    if(card && !(e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)) {
      e.preventDefault();
      openModal(card);
    }
    
    if(e.target.matches('[data-action="close"]')) {
      closeModal();
    }
  });
  
  document.addEventListener('keydown', e => {
    if(e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') {
      closeModal();
    }
  });
  
  modal.querySelector('.modal-backdrop')?.addEventListener('click', closeModal);
});
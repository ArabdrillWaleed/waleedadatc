document.addEventListener('DOMContentLoaded', function() {
  const modal = document.getElementById('course-modal');
  if(!modal) return;
  
  const courseCards = document.querySelectorAll('.course-card');
  const modalTitle = document.getElementById('course-modal-title');
  const modalDuration = document.getElementById('course-modal-duration');
  const modalBody = document.getElementById('course-modal-body');
  const modalAccreditation = document.getElementById('course-modal-accreditation');
  const registerButton = modal.querySelector('a.btn');
  const searchInput = document.getElementById('course-search-input');
  const searchCount = document.getElementById('course-search-count');
  const noResults = document.getElementById('course-no-results');
  const accreditationFiltersContainer = document.getElementById('accreditation-filters');
  let currentAccreditationFilter = 'all';

  function openModal(card) {
    const summary = card.querySelector('.course-summary');
    if (!summary) return;
    
    const courseTitle = summary.dataset.title || '';
    modalTitle.textContent = courseTitle;
    modalDuration.textContent = summary.dataset.duration || '';
    modalBody.innerHTML = `<p>${summary.dataset.desc || ''}</p>`;
    modalAccreditation.textContent = summary.dataset.accreditation || 'To be added';
    
    // Update Register Now button with course name in URL
    const registerNowBtn = document.getElementById('register-now-btn');
    if (registerNowBtn) {
      const subject = encodeURIComponent(`${courseTitle} Registration Inquiry`);
      registerNowBtn.href = `contact.html?subject=${subject}`;
    }
    
    // Scroll modal body to top when opening
    if (modalBody) {
      modalBody.scrollTop = 0;
    }
    
    // Trigger animation
    modal.style.display = 'flex';
    setTimeout(() => {
      modal.setAttribute('aria-hidden', 'false');
    }, 10);
    document.body.classList.add('modal-open');
  }

  // Build accreditation filter buttons dynamically
  function buildAccreditationFilters() {
    if(!accreditationFiltersContainer) return;
    const accSet = new Set();
    courseCards.forEach(card => {
      const summary = card.querySelector('.course-summary');
      if(!summary) return;
      const raw = (summary.dataset.accreditation || '').trim();
      if(raw === '') return; // skip empty
      // split by common separators if multiple values ever appear
      raw.split(/[,;/]/).map(s => s.trim()).filter(Boolean).forEach(val => accSet.add(val));
    });
    // Clear existing
    accreditationFiltersContainer.innerHTML = '';
    // All button first
    const allBtn = document.createElement('button');
    allBtn.type = 'button';
    allBtn.className = 'accreditation-filter-btn active';
    allBtn.dataset.accreditation = 'all';
    allBtn.textContent = 'All';
    accreditationFiltersContainer.appendChild(allBtn);
    // If there are courses with no accreditation, add Unaccredited button
    const hasUnaccredited = Array.from(courseCards).some(card => {
      const summary = card.querySelector('.course-summary');
      return summary && !(summary.dataset.accreditation || '').trim();
    });
    accSet.forEach(acc => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'accreditation-filter-btn';
      btn.dataset.accreditation = acc;
      btn.textContent = acc;
      accreditationFiltersContainer.appendChild(btn);
    });
    if(hasUnaccredited) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'accreditation-filter-btn';
      btn.dataset.accreditation = '_unaccredited';
      btn.textContent = 'Unaccredited';
      accreditationFiltersContainer.appendChild(btn);
    }
  }

  function applyFilters(searchTerm) {
    searchTerm = (searchTerm || '').toLowerCase().trim();
    let visibleCount = 0;
    courseCards.forEach(card => {
      const summary = card.querySelector('.course-summary');
      if(!summary) return;
      const title = (summary.dataset.title || '').toLowerCase();
      const desc = (summary.dataset.desc || '').toLowerCase();
      const accreditationRaw = (summary.dataset.accreditation || '').trim();
      const accreditationTokens = accreditationRaw.split(/[,;/]/).map(s => s.trim().toLowerCase()).filter(Boolean);
      // Determine accreditation match
      let accreditationMatch = true;
      if(currentAccreditationFilter === '_unaccredited') {
        accreditationMatch = accreditationRaw === '';
      } else if(currentAccreditationFilter !== 'all') {
        accreditationMatch = accreditationTokens.includes(currentAccreditationFilter.toLowerCase());
      }
      // Determine search match
      const searchMatch = !searchTerm || title.includes(searchTerm) || desc.includes(searchTerm);
      const visible = accreditationMatch && searchMatch;
      card.style.display = visible ? '' : 'none';
      if(visible) visibleCount++;
    });
    // Show/hide no results
    if(noResults) {
      noResults.style.display = visibleCount === 0 ? 'block' : 'none';
    }
  }

  if(accreditationFiltersContainer) {
    buildAccreditationFilters();
    accreditationFiltersContainer.addEventListener('click', e => {
      const btn = e.target.closest('.accreditation-filter-btn');
      if(!btn) return;
      currentAccreditationFilter = btn.dataset.accreditation || 'all';
      accreditationFiltersContainer.querySelectorAll('.accreditation-filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      applyFilters(searchInput ? searchInput.value : '');
    });
  }

  function closeModal() {
    modal.setAttribute('aria-hidden', 'true');
    setTimeout(() => {
      modal.style.display = 'none';
    }, 450);
    document.body.classList.remove('modal-open');
  }

    // Make entire card clickable and set up icons
  courseCards.forEach(card => {
    // Set up icon if data-image exists
    const summary = card.querySelector('.course-summary');
    if (summary && summary.dataset.image) {
      const iconDiv = document.createElement('div');
      iconDiv.className = 'course-icon';
      iconDiv.style.backgroundImage = `url('${summary.dataset.image}')`;
      card.appendChild(iconDiv);
    }

    // Clickable functionality
    card.addEventListener('click', () => openModal(card));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModal(card);
      }
    });
  });  // Search functionality
  function filterCourses(query) {
    applyFilters(query);
  }

  // Add search input handler
  if (searchInput) {
    searchInput.addEventListener('input', (e) => filterCourses(e.target.value));
    // If a query param ?q= exists, prefill and filter
    const params = new URLSearchParams(window.location.search);
    const q = params.get('q');
    if (q) {
      searchInput.value = q;
      filterCourses(q);
    }
    // Initialize without count
    searchCount.textContent = ``;
    // Initial filter application
    filterCourses('');
  }

  // Add event listeners for both close button and backdrop
  const closeButton = modal.querySelector('.modal-close');
  const backdrop = modal.querySelector('.modal-backdrop');
  
  if (closeButton) {
    closeButton.addEventListener('click', closeModal);
  }
  if (backdrop) {
    backdrop.addEventListener('click', closeModal);
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') {
      closeModal();
    }
  });
});
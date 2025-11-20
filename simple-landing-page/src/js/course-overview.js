document.addEventListener('DOMContentLoaded', () => {
  const table = document.getElementById('course-overview-table');
  if (!table) return;

  const tbody = table.querySelector('tbody');
  const filtersContainer = document.getElementById('overview-accreditation-filters');
  // Search removed per request
  const countEl = null;

  // Utility: normalize duration like "3 Days", "1 Day", "4 Hours" -> hours number
  function parseDurationToHours(text) {
    if (!text) return Infinity;
    const t = text.trim().toLowerCase();
    const dayMatch = t.match(/(\d+(?:\.\d+)?)\s*day/);
    const hourMatch = t.match(/(\d+(?:\.\d+)?)\s*hour/);
    if (dayMatch) return parseFloat(dayMatch[1]) * 24;
    if (hourMatch) return parseFloat(hourMatch[1]);
    return Infinity;
  }

  function makeRow(course) {
    const tr = document.createElement('tr');
    // Non-clickable: plain table row
    tr.innerHTML = `
      <td class="cell-title" data-label="Course">
        <span class="course-name">${course.title}</span>
      </td>
      <td data-label="Duration"><span class="badge badge-neutral">${course.duration || ''}</span></td>
      <td data-label="Accreditation">${course.accreditation ? `<span class=\"badge\">${course.accreditation}</span>` : '<span class=\"badge badge-muted\">—</span>'}</td>
    `;
    return tr;
  }

  function renderRows(courses) {
    tbody.innerHTML = '';
    courses.forEach(c => tbody.appendChild(makeRow(c)));
  }

  // Filtering removed; always show all courses
  function filterCourses(q, data) { return data; }

  function sortCourses(data, key) {
    const sorted = [...data];
    if (key === 'duration') {
      sorted.sort((a,b) => parseDurationToHours(a.duration) - parseDurationToHours(b.duration));
    } else if (key === 'accreditation') {
      sorted.sort((a,b) => (a.accreditation||'').localeCompare(b.accreditation||''));
    } else {
      sorted.sort((a,b) => a.title.localeCompare(b.title));
    }
    return sorted;
  }

  // Sorting by clicking headers
  let currentSort = 'title';
  let currentAccreditation = 'all';
  table.querySelectorAll('thead th').forEach(th => {
    th.addEventListener('click', () => {
      currentSort = th.dataset.sort || 'title';
      renderRows(getFilteredAndSorted());
    });
  });

  const state = { allCourses: [] };

  function buildFilters() {
    if(!filtersContainer) return;
    
    filtersContainer.innerHTML = '';
    const addBtn = (label, value, isActive=false) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'accreditation-filter-btn' + (isActive ? ' active' : '');
      b.dataset.accreditation = value;
      b.textContent = label;
      filtersContainer.appendChild(b);
    };
    
    // Fixed category buttons
  addBtn('All', 'all', true);
  addBtn('Drilling', 'drilling');
  addBtn('Soft Skills', 'soft-skills');
  addBtn('Mechanical', 'mechanical');
  addBtn('HSE', 'hse');

    filtersContainer.addEventListener('click', e => {
      const btn = e.target.closest('.accreditation-filter-btn');
      if(!btn) return;
      currentAccreditation = btn.dataset.accreditation || 'all';
      filtersContainer.querySelectorAll('.accreditation-filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderRows(getFilteredAndSorted());
    });
  }

  function getFilteredAndSorted() {
    const filtered = state.allCourses.filter(c => {
      const category = (c.category || '').trim().toLowerCase();
      if(currentAccreditation === 'all') return true;
      return category === currentAccreditation.toLowerCase();
    });
    return sortCourses(filtered, currentSort);
  }

  // Fetch courses.html and parse course cards
  fetch('courses.html')
    .then(r => r.text())
    .then(html => {
      const doc = new DOMParser().parseFromString(html, 'text/html');
      const nodes = doc.querySelectorAll('.course-card .course-summary');
      const list = Array.from(nodes).map(n => ({
        title: n.dataset.title || '',
        duration: n.dataset.duration || '',
        accreditation: n.dataset.accreditation || '',
        category: n.dataset.category || ''
      }));
      // Prefer a curated subset at top: show all for now
  state.allCourses = list;
  buildFilters();
  renderRows(getFilteredAndSorted());

      // Deep link support removed (no search field now)
    })
    .catch(() => {
      // Fallback: show message inside table if fetch fails
      tbody.innerHTML = '<tr><td colspan="3">Unable to load course list right now.</td></tr>';
      countEl.textContent = '';
    });

  // Search interaction
  // No search listeners (removed)
});

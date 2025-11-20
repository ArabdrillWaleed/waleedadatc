document.addEventListener('DOMContentLoaded', function() {
    // Initialize timeline categories
    const categories = document.querySelectorAll('.timeline-category');
    categories.forEach(category => {
        category.querySelector('.timeline-category-title').addEventListener('click', () => {
            const wasActive = category.classList.contains('active');
            
            // Close all categories
            categories.forEach(c => c.classList.remove('active'));
            
            // If the clicked category wasn't active, open it
            if (!wasActive) {
                category.classList.add('active');
            }
        });
    });

    // Initialize filters
    const filters = document.querySelectorAll('.timeline-filter');
    const items = document.querySelectorAll('.timeline-item');

    filters.forEach(filter => {
        filter.addEventListener('click', () => {
            // Update active filter
            filters.forEach(f => f.classList.remove('active'));
            filter.classList.add('active');

            const category = filter.dataset.category;
            
            if (category === 'all') {
                items.forEach(item => item.style.display = '');
            } else {
                items.forEach(item => {
                    if (item.dataset.category === category) {
                        item.style.display = '';
                    } else {
                        item.style.display = 'none';
                    }
                });
            }

            // Ensure categories with visible items are expanded
            categories.forEach(category => {
                const hasVisibleItems = Array.from(category.querySelectorAll('.timeline-item'))
                    .some(item => item.style.display !== 'none');
                if (hasVisibleItems) {
                    category.classList.add('active');
                } else {
                    category.classList.remove('active');
                }
            });
        });
    });

    // Open first category by default
    if (categories.length > 0) {
        categories[0].classList.add('active');
    }
});
document.addEventListener('DOMContentLoaded', function() {
    // Get all FAQ cards
    const faqCards = document.querySelectorAll('.faq-card');

    // Add click handler to each card
    faqCards.forEach(card => {
        card.addEventListener('click', function(e) {
            // Toggle the open class for any click on the card
            this.classList.toggle('open');
        });

        // Also handle keyboard interaction
        card.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.classList.toggle('open');
            }
        });
    });
});
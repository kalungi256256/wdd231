// ========================================
// JOIN PAGE JAVASCRIPT
// ========================================

// Set timestamp when form loads
document.addEventListener('DOMContentLoaded', () => {
    const timestampField = document.getElementById('timestamp');
    if (timestampField) {
        timestampField.value = new Date().toISOString();
    }
    
    // Form validation and enhancements
    const form = document.getElementById('joinForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            // Update timestamp on submit
            timestampField.value = new Date().toISOString();
            
            // Form will submit to thankyou.html with GET parameters
            console.log('Form submitted successfully!');
        });
        
        // Add real-time validation feedback
        const inputs = form.querySelectorAll('input[required], select[required]');
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                if (input.validity.valid) {
                    input.style.borderColor = '#28a745';
                } else if (input.value !== '') {
                    input.style.borderColor = '#dc3545';
                }
            });
            
            input.addEventListener('input', () => {
                if (input.validity.valid && input.value !== '') {
                    input.style.borderColor = '#28a745';
                } else if (input.value === '') {
                    input.style.borderColor = '#ddd';
                }
            });
        });
    }
    
    // Add smooth scroll for membership level cards
    const levelCards = document.querySelectorAll('.level-card');
    levelCards.forEach(card => {
        card.addEventListener('click', () => {
            const membershipSelect = document.getElementById('membershipLevel');
            if (membershipSelect) {
                // Scroll to form
                document.querySelector('.application-form').scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Highlight the select dropdown
                setTimeout(() => {
                    membershipSelect.focus();
                }, 800);
            }
        });
    });
});
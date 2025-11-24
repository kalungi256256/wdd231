// ========================================
// THANK YOU PAGE JAVASCRIPT
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    
    // Extract form data from URL
    const firstName = urlParams.get('firstName') || 'N/A';
    const lastName = urlParams.get('lastName') || 'N/A';
    const email = urlParams.get('email') || 'N/A';
    const businessName = urlParams.get('businessName') || 'N/A';
    const membershipLevel = urlParams.get('membershipLevel') || 'N/A';
    const timestamp = urlParams.get('timestamp') || new Date().toISOString();
    
    // Format membership level for display
    const membershipLevels = {
        'np': 'NP Membership (Free)',
        'bronze': 'Bronze Membership',
        'silver': 'Silver Membership',
        'gold': 'Gold Membership'
    };
    
    const formattedMembership = membershipLevels[membershipLevel] || membershipLevel;
    
    // Format timestamp
    const submissionDate = new Date(timestamp);
    const formattedDate = submissionDate.toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    // Display data on the page
    document.getElementById('applicantName').textContent = `${firstName} ${lastName}`;
    document.getElementById('applicantEmail').textContent = email;
    document.getElementById('businessName').textContent = businessName;
    document.getElementById('membershipLevel').textContent = formattedMembership;
    document.getElementById('submissionTime').textContent = formattedDate;
    
    // Add confetti animation effect (optional visual enhancement)
    createConfetti();
});

// Simple confetti effect
function createConfetti() {
    const colors = ['#1a5490', '#f4a261', '#e76f51', '#264653'];
    const confettiCount = 50;
    
    for (let i = 0; i < confettiCount; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.style.position = 'fixed';
            confetti.style.width = '10px';
            confetti.style.height = '10px';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.top = '-10px';
            confetti.style.opacity = '1';
            confetti.style.transform = 'rotate(' + (Math.random() * 360) + 'deg)';
            confetti.style.transition = 'all 3s ease-out';
            confetti.style.pointerEvents = 'none';
            confetti.style.zIndex = '9999';
            
            document.body.appendChild(confetti);
            
            // Animate
            setTimeout(() => {
                confetti.style.top = '100vh';
                confetti.style.opacity = '0';
                confetti.style.transform = 'rotate(' + (Math.random() * 720 + 360) + 'deg)';
            }, 10);
            
            // Remove after animation
            setTimeout(() => {
                confetti.remove();
            }, 3000);
        }, i * 30);
    }
}
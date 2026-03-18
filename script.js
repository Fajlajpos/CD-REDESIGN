
// --- Live Departure Board ---
const board = document.getElementById('departure-board');
const disruptionData = [
    { route: 'Praha - Kolín - Brno', desc: 'Plánovaná údržba trakčního vedení', type: 'warning', label: 'Výluka', status: 'AKTIVNÍ' },
    { route: 'Ostrava - Žilina', desc: 'Mimořádná událost na trati (střet se zvěří)', type: 'emergency', label: 'Mimořádnost', status: 'OMEZENÍ' },
    { route: 'Plzeň - Mnichov', desc: 'Modernizace železničního uzlu', type: 'warning', label: 'Výluka', status: 'PLÁNOVÁNO' },
    { route: 'Praha - Berlin', desc: 'Porucha zabezpečovacího zařízení', type: 'emergency', label: 'Zpoždění', status: 'AKTIVNÍ' }
];

function updateBoard() {
    if (!board) return;
    board.innerHTML = '';
    disruptionData.forEach(item => {
        const row = document.createElement('div');
        row.className = `board-row reveal-up active type-${item.type}`;
        const statusClass = item.status === 'PLÁNOVÁNO' ? 'status-planned' : 'status-active';
        row.innerHTML = `
            <div class="train-time">${item.route}</div>
            <div class="train-dest">${item.desc}</div>
            <div class="train-id">${item.label}</div>
            <div class="train-status ${statusClass}">${item.status}</div>
        `;
        board.appendChild(row);
    });
}

// Initial update and periodic refresh
updateBoard();
setInterval(() => {
    // Subtle "jitter" simulation or update logic could go here
    updateBoard();
}, 60000);

// --- Original Scroll Effects (Enhanced) ---
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// --- Parallax Effect Removed ---


// --- Smooth Reveal for Destination Cards (Optional Enhancement) ---
const destCards = document.querySelectorAll('.destination-card');
if (destCards.length > 0) {
    const destObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-active');
            }
        });
    }, { threshold: 0.1 });
    destCards.forEach(card => {
        destObserver.observe(card);
        
        // Mouse Tracking for Pure Edge Glint
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            
            card.style.setProperty('--mouse-x', `${x}%`);
            card.style.setProperty('--mouse-y', `${y}%`);
        });
    });
}

// --- Date Input Setup ---
const dateInput = document.getElementById('date-input');
if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
    dateInput.value = today;
}

// --- Tab Switching Logic (Decorative) ---
const tabs = document.querySelectorAll('.widget-tabs .tab');
tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
    });
});

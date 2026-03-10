
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


// --- Animated Counters in Trust Bar ---
const counters = document.querySelectorAll('.counter');
let countersStarted = false;

const counterSection = document.querySelector('.trust-section');
if (counterSection) {
    const counterObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !countersStarted) {
            countersStarted = true;
            counters.forEach(counter => {
                const updateCount = () => {
                    const target = +counter.getAttribute('data-target');
                    const currentString = counter.innerText.replace(/[^\d.]/g, '');
                    const current = currentString === '' ? 0 : +currentString;
                    const suffix = counter.getAttribute('data-suffix') || '';

                    let inc = target / 50;
                    if (target < 10) inc = 0.1;

                    if (current < target) {
                        let nextVal = current + inc;
                        if (target % 1 === 0 && target > 10) {
                            counter.innerText = Math.ceil(nextVal) + suffix;
                        } else {
                            counter.innerText = nextVal.toFixed(1) + suffix;
                        }
                        setTimeout(updateCount, 30);
                    } else {
                        counter.innerText = target + suffix;
                    }
                };
                updateCount();
            });
        }
    }, { threshold: 0.2 });
    counterObserver.observe(counterSection);
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

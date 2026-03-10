
// --- Live Departure Board ---
const board = document.getElementById('departure-board');
const trainData = [
    { time: '20:15', dest: 'Berlin Hbf', id: 'EC 178', status: 'ON TIME' },
    { time: '20:22', dest: 'Brno hl.n.', id: 'rj 375', status: 'ON TIME' },
    { time: '20:30', dest: 'Paris Est', id: 'NJ 456', status: '+5 MIN' },
    { time: '20:45', dest: 'Ostrava-Svinov', id: 'IC 511', status: 'ON TIME' },
    { time: '20:58', dest: 'Zürich HB', id: 'EN 404', status: 'ON TIME' }
];

function updateBoard() {
    if (!board) return;
    board.innerHTML = '';
    trainData.forEach(train => {
        const isDelayed = train.status.includes('+');
        const row = document.createElement('div');
        row.className = 'board-row reveal-up active';
        row.innerHTML = `
            <div class="train-time">${train.time}</div>
            <div class="train-dest">${train.dest}</div>
            <div class="train-id">${train.id}</div>
            <div class="train-status ${isDelayed ? 'status-delayed' : 'status-ontime'}">${train.status}</div>
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

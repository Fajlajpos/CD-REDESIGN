
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
    updateBoard();
}, 60000);

// --- PRISTINE APPLE LIQUID GLASS (CODEPEN 1:1) ---
// See: https://codepen.io/jh3y/pen/EajLxJV (Adapted safely for 100vw Header)

document.addEventListener('DOMContentLoaded', () => {

const config = {
  scale: 0, // Starts at 0 (completely transparent, no distortion at top of page)
  border: 0.15, // Map edge pushed safely inwards
  lightness: 60, // Brighter optical core
  alpha: 0.85,
  mapBlur: 30, // Thick liquid lens slope
  
  // Chromatic Aberration RGB split starts at 0
  r: 0,
  g: 0,
  b: 0,
  
  // Dimensions
  width: window.innerWidth,
  height: 105, 
};

const buildDisplacementImage = () => {
    const headerEl = document.getElementById('header');
    if (!headerEl) return;
    
    // Auto-sync map sizing
    const headerRect = headerEl.getBoundingClientRect();
    config.width = headerRect.width;
    config.height = headerRect.height;

    const border = Math.min(config.width, config.height) * config.border;
    
    // Creating the complex lens map (Gradient slopes + Blurred inner core)
    const svgString = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${config.width} ${config.height}">
        <defs>
          <linearGradient id="red" x1="100%" y1="0%" x2="0%" y2="0%">
            <stop offset="0%" stop-color="#000"/>
            <stop offset="100%" stop-color="red"/>
          </linearGradient>
          <linearGradient id="blue" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#000"/>
            <stop offset="100%" stop-color="blue"/>
          </linearGradient>
        </defs>
        <!-- The background is strictly black to prevent bleeding filter artifacts outside the borders -->
        <rect width="100%" height="100%" fill="black" />
        <rect width="100%" height="100%" fill="url(#red)" />
        <rect width="100%" height="100%" fill="url(#blue)" style="mix-blend-mode: screen" />
        <!-- Soft lens core -->
        <rect x="${border}" y="${border}" width="${config.width - border * 2}" height="${config.height - border * 2}" rx="50" fill="hsl(0 0% ${config.lightness}% / ${config.alpha})" style="filter:blur(${config.mapBlur}px)" />
      </svg>`;
  
    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
  
    const feImage = document.querySelector('#feMap');
    if (feImage) {
        const oldUrl = feImage.getAttribute('href');
        if (oldUrl && oldUrl.startsWith('blob:')) {
            URL.revokeObjectURL(oldUrl);
        }
        feImage.setAttribute('href', url);
        // Force browser to re-paint the filter bounding box over the header
        feImage.parentElement.style.display = 'none';
        feImage.parentElement.offsetHeight; // trigger reflow
        feImage.parentElement.style.display = '';
    }
}

// Map updater for filter parameter tuning
const applyFilterParams = () => {
    const setAttr = (id, attr, val) => {
        const el = document.querySelector(id);
        if(el) el.setAttribute(attr, val);
    };

    setAttr('#redchannel', 'scale', config.scale + config.r);
    setAttr('#greenchannel', 'scale', config.scale + config.g);
    setAttr('#bluechannel', 'scale', config.scale + config.b);
}

// Initial Sync
buildDisplacementImage();
applyFilterParams();
window.addEventListener('resize', buildDisplacementImage);

// --- Dynamic Apple Hover & Scroll Glass Engine ---
const header = document.getElementById('header');

header.addEventListener('mousemove', (e) => {
    // Only apply liquid hover effect if the header is active/scrolled
    if (!header.classList.contains('scrolled')) return;

    // Liquid bubble dynamically follows the cursor
    const x = e.clientX / window.innerWidth;
    
    gsap.to(config, {
        scale: -110 - (x * 20), // Massive liquid distortion sweeping with mouse safely
        r: 0 + (x * 4), 
        b: 12 + (x * 10), // Protected limit to avoid blue full-screen haze
        duration: 0.4,
        ease: "power2.out",
        onUpdate: applyFilterParams
    });
});

header.addEventListener('mouseleave', () => {
    if (!header.classList.contains('scrolled')) return;

    // Return to baseline liquid
    gsap.to(config, {
        scale: -80,
        r: 0,
        b: 10,
        duration: 0.8,
        ease: "back.out(1.5)",
        onUpdate: applyFilterParams
    });
});

window.addEventListener('scroll', () => {
    // Classic Apple scroll: Stronger frost & tight lens when scrolled
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
        if (window.gsap) {
            gsap.to(config, {
                scale: -80, // Smooth transition to pronounced refraction
                r: 4,
                b: 12, // Activate RGB split
                duration: 0.5,
                onUpdate: applyFilterParams
            });
        }
    } else {
        header.classList.remove('scrolled');
        if (window.gsap) {
            gsap.to(config, {
                scale: 0, // completely transparent/no lens at top
                r: 0,
                b: 0,
                duration: 0.5,
                onUpdate: applyFilterParams
            });
        }
    }
});

}); // End of DOMContentLoaded

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

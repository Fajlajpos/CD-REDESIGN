
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

// --- Original Liquid Glass Effect Logic (CodePen Tuned for Nav) ---
const config = {
  // Classic CodePen refractions tailored for Apple look on full width
  scale: -40, // Base displacement (kept modest to prevent vertical text pulling glitch)
  radius: 0, // No inner curve to prevent edges looking warped at 100vw
  border: 0.1, // Thinner border for a crisper nav feel
  lightness: 45, // Soft map
  displace: 0.5, // Crisp output without adding extra general blur
  blend: 'screen', // Liquid interaction mode
  x: 'R',
  y: 'G',
  alpha: 0.6, // Transparent mid area
  mapBlur: 30, // Extremely soft gradient transitions for the map
  
  // Chromatic Aberration RGB offsets
  r: 0,
  g: 3,
  b: 6,
  
  // Dimensions
  width: window.innerWidth,
  height: 105, 
}

const buildDisplacementImage = () => {
  const headerEl = document.getElementById('header');
  if (!headerEl) return;
  
  const headerRect = headerEl.getBoundingClientRect();
  config.width = headerRect.width;
  config.height = headerRect.height;

  const border = Math.min(config.width, config.height) * config.border;
  
  const svgString = `
    <svg class="displacement-image" viewBox="0 0 ${config.width} ${config.height}" xmlns="http://www.w3.org/2000/svg">
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
      <rect x="0" y="0" width="${config.width}" height="${config.height}" fill="black"></rect>
      <rect x="0" y="0" width="${config.width}" height="${config.height}" rx="${config.radius}" fill="url(#red)" />
      <rect x="0" y="0" width="${config.width}" height="${config.height}" rx="${config.radius}" fill="url(#blue)" style="mix-blend-mode: ${config.blend}" />
      <rect x="${border}" y="${border}" width="${config.width - border * 2}" height="${config.height - border * 2}" rx="${config.radius}" fill="hsl(0 0% ${config.lightness}% / ${config.alpha})" style="filter:blur(${config.mapBlur}px)" />
    </svg>`

  const blob = new Blob([svgString], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);

  const feImage = document.querySelector('#feMap');
  if (feImage) {
      const oldUrl = feImage.getAttribute('href');
      if (oldUrl && oldUrl.startsWith('blob:')) {
          URL.revokeObjectURL(oldUrl);
      }
      feImage.setAttribute('href', url);
  }
  
  applyFilterParams();
}

const applyFilterParams = () => {
    const setAttr = (id, attr, val) => {
        const el = document.querySelector(id);
        if(el) el.setAttribute(attr, val);
    };

    setAttr('#redchannel', 'scale', config.scale + config.r);
    setAttr('#redchannel', 'xChannelSelector', config.x);
    setAttr('#redchannel', 'yChannelSelector', config.y);

    setAttr('#greenchannel', 'scale', config.scale + config.g);
    setAttr('#greenchannel', 'xChannelSelector', config.x);
    setAttr('#greenchannel', 'yChannelSelector', config.y);

    setAttr('#bluechannel', 'scale', config.scale + config.b);
    setAttr('#bluechannel', 'xChannelSelector', config.x);
    setAttr('#bluechannel', 'yChannelSelector', config.y);

    setAttr('#outputBlur', 'stdDeviation', config.displace);
}

const update = () => {
  buildDisplacementImage();
}

window.addEventListener('resize', update);
setTimeout(update, 100);

// --- Interactive Hover Effect ---
const header = document.getElementById('header');

header.addEventListener('mousemove', (e) => {
    // Original CodePen interactive distortion logic
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / config.height;
    
    // Smooth organic interaction
    const targetScale = -40 - (x * 40); 
    const targetR = 0 + (x * 6);
    const targetB = 6 + (x * 12);

    gsap.to(config, {
        scale: targetScale,
        r: targetR,
        b: targetB,
        duration: 0.4,
        ease: "power2.out",
        onUpdate: applyFilterParams
    });
});

header.addEventListener('mouseleave', () => {
    gsap.to(config, {
        scale: -40,
        r: 0,
        b: 6,
        duration: 0.6,
        ease: "elastic.out(1, 0.5)",
        onUpdate: applyFilterParams
    });
});

// --- Scroll Effect ---
window.addEventListener('scroll', () => {
    const isScrolled = window.scrollY > 50;
    if (isScrolled) {
        header.classList.add('scrolled');
        gsap.to(config, {
            scale: -60, // Stronger refraction
            r: 4,
            b: 10,
            duration: 0.5,
            onUpdate: applyFilterParams
        });
    } else {
        header.classList.remove('scrolled');
        gsap.to(config, {
            scale: -40,
            r: 0,
            b: 6,
            duration: 0.5,
            onUpdate: applyFilterParams
        });
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

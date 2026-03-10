// --- Header Scroll Effect ---
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// --- Parallax Effect ---
const parallaxBg = document.getElementById('parallax-bg');
window.addEventListener('scroll', () => {
    const scroll = window.scrollY;
    if (scroll < window.innerHeight && parallaxBg) {
        parallaxBg.style.transform = `translateY(${scroll * 0.4}px)`;
    }
});

// --- Intersection Observer for Reveals ---
const revealElements = document.querySelectorAll('.reveal-up');
const revealOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
};
const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
        }
    });
}, revealOptions);
revealElements.forEach(el => revealObserver.observe(el));

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
                    // current parsed string without non-digits (excluding dots)
                    const current = +counter.innerText.replace(/[^\d.]/g, '');
                    const suffix = counter.getAttribute('data-suffix') || '';

                    // slow increment
                    let inc = target / 60;
                    if (target < 10) inc = 0.1; // for rating

                    if (current < target) {
                        let nextVal = current + inc;
                        if (target % 1 === 0 && target > 10) {
                            counter.innerText = Math.ceil(nextVal) + suffix;
                        } else {
                            counter.innerText = nextVal.toFixed(1) + suffix; // one decimal precision
                        }
                        setTimeout(updateCount, 40);
                    } else {
                        counter.innerText = target + suffix;
                    }
                };
                updateCount();
            });
        }
    }, { threshold: 0.5 });
    counterObserver.observe(counterSection);
}

// --- Date Input Setup ---
const dateInput = document.getElementById('date-input');
if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
    dateInput.value = today;
}

// --- Button Ripple / Click Effect ---
const submitBtn = document.querySelector('.btn-submit');
if (submitBtn) {
    submitBtn.addEventListener('click', function (e) {
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = 'translateY(-3px)';
        }, 100);
    });
}

// --- Tab Switching Logic (Decorative) ---
const tabs = document.querySelectorAll('.widget-tabs .tab');
tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
    });
});

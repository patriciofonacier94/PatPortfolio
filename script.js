// ============================================
// COPYRIGHT YEAR
// ============================================
document.getElementById('year').textContent = new Date().getFullYear();

/* ============================================
   THEME TOGGLE (DARK/LIGHT MODE)
   ============================================ */
const themeToggleBtn = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');

// SVG paths for sun and moon
const sunIcon = `<circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>`;
const moonIcon = `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>`;

// Check local storage for saved theme
const currentTheme = localStorage.getItem('theme');
if (currentTheme) {
    document.documentElement.setAttribute('data-theme', currentTheme);
    if (currentTheme === 'light') {
        themeIcon.innerHTML = moonIcon;
    }
}

// Toggle function
themeToggleBtn.addEventListener('click', () => {
    let theme = document.documentElement.getAttribute('data-theme');
    
    if (theme === 'light') {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('theme', 'dark');
        themeIcon.innerHTML = sunIcon;
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
        themeIcon.innerHTML = moonIcon;
    }
});

// ============================================
// SCROLL-REVEAL (IntersectionObserver)
// Bidirectional: elements animate IN on enter, OUT on leave
// Supports: .reveal, .reveal-left, .reveal-right, .reveal-scale
// ============================================
const revealElements = document.querySelectorAll(
    '.reveal, .reveal-left, .reveal-right, .reveal-scale'
);

const revealObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            } else {
                entry.target.classList.remove('visible');
            }
        });
    },
    {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px',
    }
);

revealElements.forEach((el) => revealObserver.observe(el));

// ============================================
// SECTION DIVIDER ANIMATION
// Bidirectional: line expands on enter, collapses on leave
// ============================================
const sections = document.querySelectorAll('.section');

const sectionObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('section-visible');
            } else {
                entry.target.classList.remove('section-visible');
            }
        });
    },
    {
        threshold: 0.05,
        rootMargin: '0px 0px -20px 0px',
    }
);

sections.forEach((s) => sectionObserver.observe(s));

// ============================================
// SCROLL PROGRESS BAR
// ============================================
const scrollProgress = document.getElementById('scroll-progress');

function updateScrollProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollProgress.style.width = progress + '%';
}

// ============================================
// HERO PARALLAX EFFECT
// Content drifts up and fades as you scroll past
// ============================================
const heroContent = document.querySelector('.hero-content');
const heroSection = document.querySelector('.hero');

function updateHeroParallax() {
    const scrollTop = window.scrollY;
    const heroHeight = heroSection.offsetHeight;

    if (scrollTop <= heroHeight) {
        const ratio = scrollTop / heroHeight;
        const translateY = scrollTop * 0.35;
        const opacity = 1 - ratio * 1.2;
        heroContent.style.transform = `translateY(${translateY}px)`;
        heroContent.style.opacity = Math.max(opacity, 0);
    }
}

// ============================================
// SCROLL INDICATOR AUTO-HIDE
// ============================================
const scrollIndicator = document.querySelector('.scroll-indicator');

function updateScrollIndicator() {
    if (window.scrollY > 120) {
        scrollIndicator.classList.add('hidden');
    } else {
        scrollIndicator.classList.remove('hidden');
    }
}

// ============================================
// BACK TO TOP BUTTON LOGIC & SMOOTH SCROLL EFFECT
// ============================================
const backToTopBtn = document.getElementById('back-to-top');

function updateBackToTop() {
    if (!backToTopBtn) return;
    const scrollPosition = window.scrollY + window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    
    // Shows when user reaches the bottom part (within 400px of bottom or >= 80% scrolled)
    const isAtBottom = (documentHeight - scrollPosition) < 400 || 
                       (documentHeight - window.innerHeight > 0 && 
                        (window.scrollY / (documentHeight - window.innerHeight)) >= 0.8);

    if (isAtBottom && window.scrollY > 300) {
        backToTopBtn.classList.add('visible');
    } else {
        backToTopBtn.classList.remove('visible');
    }
}

function smoothScrollToTop(duration = 950) {
    const startPosition = window.scrollY || window.pageYOffset;
    if (startPosition <= 0) return;

    // Trigger visual launch and ripple effect
    if (backToTopBtn) {
        backToTopBtn.classList.add('launching');
    }

    // Temporarily set auto to prevent RAF from clashing with CSS scroll-behavior: smooth
    const originalScrollBehavior = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = 'auto';

    const startTime = performance.now();

    // Cinematic cubic easeInOut curve for ultra-smooth gliding
    function easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    let isCancelled = false;
    const cancelScroll = () => {
        isCancelled = true;
    };

    window.addEventListener('wheel', cancelScroll, { passive: true, once: true });
    window.addEventListener('touchmove', cancelScroll, { passive: true, once: true });

    function step(currentTime) {
        if (isCancelled) {
            document.documentElement.style.scrollBehavior = originalScrollBehavior;
            if (backToTopBtn) backToTopBtn.classList.remove('launching');
            return;
        }

        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = easeInOutCubic(progress);

        window.scrollTo(0, Math.round(startPosition * (1 - ease)));

        if (progress < 1) {
            requestAnimationFrame(step);
        } else {
            window.scrollTo(0, 0);
            document.documentElement.style.scrollBehavior = originalScrollBehavior;
            window.removeEventListener('wheel', cancelScroll);
            window.removeEventListener('touchmove', cancelScroll);
            setTimeout(() => {
                if (backToTopBtn) backToTopBtn.classList.remove('launching');
            }, 350);
        }
    }

    requestAnimationFrame(step);
}

if (backToTopBtn) {
    backToTopBtn.addEventListener('click', (e) => {
        e.preventDefault();
        smoothScrollToTop(950);
    });
}

// ============================================
// UNIFIED SCROLL HANDLER (passive for perf)
// ============================================
let ticking = false;

window.addEventListener(
    'scroll',
    () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateScrollProgress();
                updateHeroParallax();
                updateScrollIndicator();
                updateBackToTop();
                ticking = false;
            });
            ticking = true;
        }
    },
    { passive: true }
);

// Initial call
updateScrollProgress();
updateHeroParallax();
updateBackToTop();

// ============================================
// TYPED ROLE ANIMATION
// ============================================
const roles = [
    'Operations Specialist',
    'Quality Analyst',
    'Visual Inspection Analyst',
    'Problem Solver',
];

const typedEl = document.getElementById('typed-role');
let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typeSpeed = 80;
const deleteSpeed = 40;
const pauseAfterType = 2000;
const pauseAfterDelete = 500;

function typeRole() {
    const currentRole = roles[roleIndex];

    if (!isDeleting) {
        typedEl.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;

        if (charIndex === currentRole.length) {
            isDeleting = true;
            setTimeout(typeRole, pauseAfterType);
            return;
        }
        setTimeout(typeRole, typeSpeed);
    } else {
        typedEl.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;

        if (charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            setTimeout(typeRole, pauseAfterDelete);
            return;
        }
        setTimeout(typeRole, deleteSpeed);
    }
}

// Start typing after a brief delay
setTimeout(typeRole, 1000);

// ============================================
// MOBILE NAV TOGGLE
// ============================================
const navToggle = document.getElementById('nav-toggle');
const mobileNav = document.getElementById('mobile-nav');

navToggle.addEventListener('click', () => {
    const isOpen = navToggle.classList.toggle('active');
    mobileNav.classList.toggle('active');
    navToggle.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
});

// Close mobile nav on link click
mobileNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        mobileNav.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    });
});

// ============================================
// SMOOTH ANCHOR SCROLLING (fallback)
// ============================================
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
        const targetId = anchor.getAttribute('href');
        if (targetId === '#') return;

        const target = document.querySelector(targetId);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// ============================================
// EMAIL BUTTON (Copy to Clipboard + Toast Feedback)
// ============================================
const emailBtn = document.getElementById('email-btn');
const copyToast = document.getElementById('copy-toast');
let toastTimeout;

if (emailBtn && copyToast) {
    emailBtn.addEventListener('click', () => {
        const email = 'patriciofonacier94@gmail.com';
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(email).catch(() => {});
        }
        clearTimeout(toastTimeout);
        copyToast.classList.add('visible');
        copyToast.setAttribute('aria-hidden', 'false');
        toastTimeout = setTimeout(() => {
            copyToast.classList.remove('visible');
            copyToast.setAttribute('aria-hidden', 'true');
        }, 2800);
    });
}
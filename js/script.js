const DATA_URL = 'json/data.json';

function el(tag, attrs = {}, children = []) {
    const node = document.createElement(tag);
    Object.entries(attrs).forEach(([key, value]) => {
        if (key === 'class') node.className = value;
        else if (key === 'html') node.innerHTML = value;
        else node.setAttribute(key, value);
    });
    children.forEach(child => node.appendChild(child));
    return node;
}

document.addEventListener('DOMContentLoaded', () => {
    init();
});

async function init() {
    setupNav();
    setupContactForm();
    document.getElementById('year').textContent = new Date().getFullYear();

    try {
        const res = await fetch(DATA_URL);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        renderProfile(data.profile);
        renderSkills(data.skills);
        renderProjects(data.projects);
        renderTimeline(data.timeline);
        renderContact(data.contact);

        setupScrollReveal();
        setupActiveNavHighlight();
    } catch (err) {

        console.error('Could not load data.json:', err);
        const hero = document.querySelector('.hero-tagline');
        if (hero) {
            hero.textContent =
                'Content failed to load — if you opened this file directly, run it through a local server (e.g. Live Server) so fetch() can reach data.json.';
        }
    }
}

function renderProfile(profile) {
    if (!profile) return;
    document.querySelector('[data-name]').textContent = profile.name;
    document.querySelector('[data-role]').textContent = profile.role;
    document.querySelector('[data-tagline]').textContent = profile.tagline;
    document.querySelector('[data-bio]').textContent = profile.bio;
    document.querySelector('[data-location]').textContent = profile.location;
    document.title = `${profile.initials} — ${profile.role}`;

    const photo = document.querySelector('[data-photo]');
    if (photo && profile.photo) {
        photo.src = profile.photo;
        photo.alt = profile.photoAlt || `${profile.name} — profile photo`;
    }
}

function renderSkills(skills) {
    const list = document.querySelector('[data-skill-list]');
    const filterWrap = document.querySelector('[data-skill-filters]');
    if (!list || !skills) return;


    const categories = ['All', ...new Set(skills.map(s => s.category))];

    categories.forEach((cat, i) => {
        const btn = el('button', {
            class: `filter-btn${i === 0 ? ' active' : ''}`,
            role: 'tab',
            'aria-selected': i === 0 ? 'true' : 'false',
            'data-filter': cat,
        }, []);
        btn.textContent = cat;
        btn.addEventListener('click', () => {
            filterWrap.querySelectorAll('.filter-btn').forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-selected', 'false');
            });
            btn.classList.add('active');
            btn.setAttribute('aria-selected', 'true');
            list.querySelectorAll('.skill-item').forEach(item => {
                const match = cat === 'All' || item.dataset.category === cat;
                item.style.display = match ? '' : 'none';
            });
        });
        filterWrap.appendChild(btn);
    });

    skills.forEach(skill => {
        const level = Math.max(0, Math.min(100, Number(skill.level) || 0));

        const levelBar = el('div', {
            class: 'skill-level',
            role: 'progressbar',
            'aria-valuenow': String(level),
            'aria-valuemin': '0',
            'aria-valuemax': '100',
            'aria-label': `${skill.name} proficiency`,
        }, [
            el('div', { class: 'skill-level-fill', style: `width: ${level}%` }),
        ]);

        const item = el('li', { class: 'skill-item', 'data-category': skill.category, 'data-reveal': '' }, [
            el('div', { class: 'skill-item-top' }, [
                el('span', { class: 'skill-name', html: skill.name }),
                el('span', { class: 'skill-level-value', html: `${level}%` }),
            ]),
            levelBar,
        ]);
        list.appendChild(item);
    });
}

function renderProjects(projects) {
    const grid = document.querySelector('[data-project-grid]');
    const filterWrap = document.querySelector('[data-project-filters]');
    if (!grid || !projects) return;

    const categories = ['All', ...new Set(projects.map(p => p.category))];

    categories.forEach((cat, i) => {
        const btn = el('button', {
            class: `filter-btn${i === 0 ? ' active' : ''}`,
            role: 'tab',
            'aria-selected': i === 0 ? 'true' : 'false',
            'data-filter': cat,
        });
        btn.textContent = cat;
        btn.addEventListener('click', () => {
            filterWrap.querySelectorAll('.filter-btn').forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-selected', 'false');
            });
            btn.classList.add('active');
            btn.setAttribute('aria-selected', 'true');
            grid.querySelectorAll('.project-card').forEach(card => {
                const match = cat === 'All' || card.dataset.category === cat;
                card.classList.toggle('hidden', !match);
            });
        });
        filterWrap.appendChild(btn);
    });

    projects.forEach(project => {
        const tags = project.tags.map(tag => el('span', { class: 'project-tag', html: tag }));
        const card = el('article', { class: 'project-card', 'data-category': project.category, 'data-reveal': '' }, [
            el('div', { class: 'project-card-top' }, [
                el('h3', { class: 'project-title', html: project.title }),
                el('span', { class: 'project-category', html: project.category }),
            ]),
            el('p', { class: 'project-desc', html: project.description }),
            el('div', { class: 'project-tags' }, tags),
        ]);
        grid.appendChild(card);
    });
}

function renderTimeline(timeline) {
    const list = document.querySelector('[data-timeline]');
    if (!list || !timeline) return;

    timeline.forEach(entry => {
        const item = el('li', { class: 'timeline-item', 'data-reveal': '' }, [
            el('span', { class: 'timeline-year', html: entry.year }),
            el('h3', { class: 'timeline-title', html: entry.title }),
            el('p', { class: 'timeline-place', html: entry.place }),
            el('p', { class: 'timeline-desc', html: entry.description }),
        ]);
        list.appendChild(item);
    });
}

function renderContact(contact) {
    const list = document.querySelector('[data-contact-links]');
    if (!list || !contact) return;

    const links = [
        { label: contact.email, href: `mailto:${contact.email}` },
        { label: 'GitHub', href: contact.github }
        
    ];

    links.forEach(({ label, href }) => {
        const li = el('li', {}, [
            el('a', { href, html: label, target: href.startsWith('http') ? '_blank' : '_self', rel: 'noopener' }),
        ]);
        list.appendChild(li);
    });
}

function setupNav() {
    const toggle = document.getElementById('navToggle');
    const nav = document.getElementById('primaryNav');
    if (!toggle || !nav) return;

    toggle.addEventListener('click', () => {
        const isOpen = nav.classList.toggle('open');
        toggle.setAttribute('aria-expanded', String(isOpen));
    });

    nav.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('open');
            toggle.setAttribute('aria-expanded', 'false');
        });
    });
}

function setupActiveNavHighlight() {
    const sections = document.querySelectorAll('main section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    const observer = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    navLinks.forEach(link => {
                        link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
                    });
                }
            });
        },
        { rootMargin: '-40% 0px -50% 0px' }
    );

    sections.forEach(section => observer.observe(section));
}
function setupScrollReveal() {
    const targets = document.querySelectorAll('[data-reveal]');

    const observer = new IntersectionObserver(
        (entries, obs) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('is-visible');
                obs.unobserve(entry.target);
            });
        },
        { threshold: 0.15 }
    );

    targets.forEach(target => observer.observe(target));
}

function setupContactForm() {
    const form = document.getElementById('contactForm');
    const status = document.getElementById('formStatus');
    if (!form) return;

    const validators = {
        name: value => value.trim().length > 1 || 'Enter your full name.',
        email: value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || 'Enter a valid email address.',
        message: value => value.trim().length > 9 || 'Message should be at least 10 characters.',
    };

    form.addEventListener('submit', event => {
        event.preventDefault();
        let isValid = true;

        Object.keys(validators).forEach(fieldName => {
            const input = form.elements[fieldName];
            const field = input.closest('.field');
            const errorEl = form.querySelector(`[data-error-for="${fieldName}"]`);
            const result = validators[fieldName](input.value);

            if (result === true) {
                field.classList.remove('invalid');
                errorEl.textContent = '';
            } else {
                field.classList.add('invalid');
                errorEl.textContent = result;
                isValid = false;
            }
        });

        if (isValid) {
            status.textContent = 'Message ready to send — hook this form up to a backend or a service like Formspree to go live.';
            form.reset();
            form.querySelectorAll('.field').forEach(f => f.classList.remove('invalid'));
        } else {
            status.textContent = 'Please fix the highlighted fields.';
        }
    });
}
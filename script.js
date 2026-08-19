document.addEventListener('DOMContentLoaded', () => {
    /* =============================================
       1. MOBILE NAVIGATION (Offcanvas)
    ============================================= */
    const menuToggle = document.querySelector('.mobile-nav-toggle');
    const offcanvasMenu = document.querySelector('#mobile-menu');
    const closeBtn = document.querySelector('.offcanvas-close');
    const backdrop = document.querySelector('.offcanvas-backdrop');
    const mobileNavLinks = document.querySelectorAll('.nav-list-mobile a');

    function openMenu() {
        offcanvasMenu.classList.add('active');
        menuToggle.setAttribute('aria-expanded', 'true');
        offcanvasMenu.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        offcanvasMenu.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        offcanvasMenu.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    if (menuToggle && offcanvasMenu && closeBtn && backdrop) {
        menuToggle.addEventListener('click', openMenu);
        closeBtn.addEventListener('click', closeMenu);
        backdrop.addEventListener('click', closeMenu);
        mobileNavLinks.forEach(link => link.addEventListener('click', closeMenu));
    }

    /* =============================================
       2. STICKY HEADER (Performance: passive true)
    ============================================= */
    const header = document.getElementById('site-header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 60) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }, { passive: true });
    }

    /* =============================================
       3. SMOOTH SCROLL PARA LINKS INTERNOS
    ============================================= */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', e => {
            const targetId = anchor.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const offset = header ? header.offsetHeight : 80;
                const top = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    /* =============================================
       4. TABS DOS SERVIÇOS
    ============================================= */
    const tabs = document.querySelectorAll('.service-tab');
    const panels = document.querySelectorAll('.services-panel');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetId = tab.dataset.target;

            tabs.forEach(t => {
                t.classList.remove('active');
                t.setAttribute('aria-selected', 'false');
            });
            panels.forEach(p => p.classList.remove('active'));

            tab.classList.add('active');
            tab.setAttribute('aria-selected', 'true');

            const targetPanel = document.getElementById(targetId);
            if (targetPanel) targetPanel.classList.add('active');
        });
    });

    /* =============================================
       5. ACCORDION (SANFONAS)
    ============================================= */
    document.querySelectorAll('.accordion-trigger').forEach(trigger => {
        trigger.addEventListener('click', () => {
            const expanded = trigger.getAttribute('aria-expanded') === 'true';
            const body = trigger.nextElementSibling;

            // Fecha todos os outros do mesmo grupo
            const accordion = trigger.closest('.accordion');
            accordion.querySelectorAll('.accordion-trigger').forEach(t => {
                t.setAttribute('aria-expanded', 'false');
                const b = t.nextElementSibling;
                if (b) b.classList.remove('open');
            });

            // Abre o que foi clicado (se estava fechado)
            if (!expanded) {
                trigger.setAttribute('aria-expanded', 'true');
                if (body) body.classList.add('open');
            }
        });
    });

    /* =============================================
       6. CARROSSEL DE DEPOIMENTOS
    ============================================= */
    const track = document.getElementById('testimonials-track');
    const dotsContainer = document.getElementById('carousel-dots');
    const prevBtn = document.getElementById('carousel-prev');
    const nextBtn = document.getElementById('carousel-next');

    if (track && dotsContainer && prevBtn && nextBtn) {
        const cards = Array.from(track.querySelectorAll('.testimonial-card'));
        let currentPage = 0;
        let cardsPerView = getCardsPerView();

        function getCardsPerView() {
            if (window.innerWidth <= 768) return 1;
            if (window.innerWidth <= 992) return 2;
            return 3;
        }

        function buildDots() {
            dotsContainer.innerHTML = '';
            const totalPages = Math.ceil(cards.length / cardsPerView);
            for (let i = 0; i < totalPages; i++) {
                const dot = document.createElement('button');
                dot.className = 'carousel-dot' + (i === currentPage ? ' active' : '');
                dot.setAttribute('aria-label', `Página ${i + 1}`);
                dot.addEventListener('click', () => goToPage(i));
                dotsContainer.appendChild(dot);
            }
        }

        function getDots() {
            return dotsContainer.querySelectorAll('.carousel-dot');
        }

        function goToPage(pageIndex) {
            const totalPages = Math.ceil(cards.length / cardsPerView);
            if (pageIndex < 0) pageIndex = totalPages - 1;
            if (pageIndex >= totalPages) pageIndex = 0;
            currentPage = pageIndex;

            let cardIndex = currentPage * cardsPerView;
            const maxIndex = cards.length - cardsPerView;
            if (cardIndex > maxIndex && maxIndex >= 0) cardIndex = maxIndex;

            const cardWidth = cards[0].offsetWidth;
            const gap = 24;
            const moveAmount = cardIndex * (cardWidth + gap);

            track.style.transform = `translateX(-${moveAmount}px)`;

            getDots().forEach((d, i) => d.classList.toggle('active', i === currentPage));
        }

        window.addEventListener('resize', () => {
            const newCardsPerView = getCardsPerView();
            if (newCardsPerView !== cardsPerView) {
                cardsPerView = newCardsPerView;
                currentPage = 0;
                buildDots();
                goToPage(0);
            } else {
                goToPage(currentPage);
            }
        });

        buildDots();

        prevBtn.addEventListener('click', () => goToPage(currentPage - 1));
        nextBtn.addEventListener('click', () => goToPage(currentPage + 1));

        // Autoplay
        let autoplay = setInterval(() => goToPage(currentPage + 1), 6000);
        [prevBtn, nextBtn, dotsContainer].forEach(el => {
            el.addEventListener('click', () => {
                clearInterval(autoplay);
                autoplay = setInterval(() => goToPage(currentPage + 1), 6000);
            });
        });
    }

    /* =============================================
       7. FORMULÁRIO DE CONTATO (Redirecionamento Inteligente)
    ============================================= */
    const form = document.getElementById('contact-form');
    if (form) {
        form.addEventListener('submit', e => {
            e.preventDefault();
            const name = document.getElementById('name').value.trim();
            const service = document.getElementById('service');
            const serviceLabel = service && service.selectedIndex > 0
                ? service.options[service.selectedIndex].text
                : '';
            const message = document.getElementById('message').value.trim();

            if (!name) {
                alert('Por favor, preencha seu nome para continuar.');
                return;
            }

            let text = `Olá, tudo bem? Vim pelo site do Espaço Estetic Ivy's! ✨\n\n`;
            text += `Meu nome é *${name}*`;
            text += serviceLabel ? ` e tenho interesse em *${serviceLabel}*.\n` : `.\n`;
            if (message) text += `\n${message}\n`;
            text += `\nAguardo o retorno de vocês!`;

            const waUrl = `https://wa.me/5585982024591?text=${encodeURIComponent(text)}`;
            window.open(waUrl, '_blank', 'noopener,noreferrer');
        });
    }

    /* =============================================
       8. BOTÃO SCROLL-TO-TOP (Performance: passive true)
    ============================================= */
    const scrollTopBtn = document.getElementById('scroll-top-btn');
    if (scrollTopBtn) {
        window.addEventListener('scroll', () => {
            scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
        }, { passive: true });

        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /* =============================================
       9. ANO DINÂMICO NO RODAPÉ
    ============================================= */
    const yearEl = document.getElementById('footer-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    /* =============================================
       10. ANIMAÇÕES DE REVELAÇÃO (Intersection Observer SEO-Friendly)
    ============================================= */
    const revealEls = document.querySelectorAll(
        '.mvv-card, .diff-card, .testimonial-card, .accordion-item, .contact-list li, .contact-form-card'
    );

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });

        revealEls.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(28px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }
});
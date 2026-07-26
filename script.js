document.addEventListener('DOMContentLoaded', () => {
    console.log("Espaço Estetic Ivy's site loaded successfully.");

    // Mobile Navigation Drawer Toggle Logic
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
});

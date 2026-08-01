/* ======================================
   CENTRAL TAXI - JavaScript
   Transport Médicalisé Conventionné CPAM
   ====================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ===== HEADER SCROLL EFFECT =====
    const header = document.getElementById('header');
    let lastScroll = 0;

    const handleScroll = () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 50) {
            header.classList.add('header--scrolled');
        } else {
            header.classList.remove('header--scrolled');
        }

        lastScroll = currentScroll;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // ===== HAMBURGER MENU =====
    const hamburger = document.getElementById('hamburger-btn');
    const mobileNav = document.getElementById('mobile-nav');

    if (hamburger && mobileNav) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            mobileNav.classList.toggle('active');
            document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
        });

        // Close mobile nav on link click
        mobileNav.querySelectorAll('.mobile-nav__link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                mobileNav.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // ===== SMART PHONE LINKS (mobile = appel natif, desktop = copie numéro) =====
    const isMobileDevice = () => {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
            || (navigator.maxTouchPoints && navigator.maxTouchPoints > 2);
    };

    document.querySelectorAll('.phone-link').forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const phone = this.getAttribute('data-phone');

            if (isMobileDevice()) {
                // Sur mobile : appel natif
                window.location.href = 'tel:' + phone;
            } else {
                // Sur desktop : copier le numéro dans le presse-papier
                const formattedPhone = '06 38 51 81 37';
                navigator.clipboard.writeText(formattedPhone).then(() => {
                    showPhoneTooltip(this, '✓ Numéro copié !');
                }).catch(() => {
                    // Fallback si clipboard API non disponible
                    const textArea = document.createElement('textarea');
                    textArea.value = formattedPhone;
                    textArea.style.position = 'fixed';
                    textArea.style.left = '-9999px';
                    document.body.appendChild(textArea);
                    textArea.select();
                    document.execCommand('copy');
                    document.body.removeChild(textArea);
                    showPhoneTooltip(this, '✓ Numéro copié !');
                });
            }
        });
    });

    // Tooltip pour confirmation copie
    function showPhoneTooltip(element, message) {
        // Supprimer tooltip existant
        const existing = document.querySelector('.phone-tooltip');
        if (existing) existing.remove();

        const tooltip = document.createElement('div');
        tooltip.className = 'phone-tooltip';
        tooltip.textContent = message;
        tooltip.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0.8);
            background: linear-gradient(135deg, #1e3a5f, #152c4a);
            color: #fff;
            padding: 16px 32px;
            border-radius: 12px;
            font-size: 1.1rem;
            font-weight: 600;
            z-index: 10000;
            opacity: 0;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 20px 40px rgba(0,0,0,0.2);
            pointer-events: none;
        `;

        document.body.appendChild(tooltip);

        // Animate in
        requestAnimationFrame(() => {
            tooltip.style.opacity = '1';
            tooltip.style.transform = 'translate(-50%, -50%) scale(1)';
        });

        // Animate out after 2s
        setTimeout(() => {
            tooltip.style.opacity = '0';
            tooltip.style.transform = 'translate(-50%, -50%) scale(0.8)';
            setTimeout(() => tooltip.remove(), 300);
        }, 2000);
    }

    // ===== ACTIVE NAVIGATION LINK ON SCROLL =====
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.header__nav-link');

    const highlightNav = () => {
        const scrollY = window.pageYOffset + 200;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    };

    window.addEventListener('scroll', highlightNav, { passive: true });

    // ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const headerHeight = header.offsetHeight;
                const targetPosition = target.offsetTop - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ===== SCROLL REVEAL ANIMATIONS =====
    const revealElements = () => {
        // Service cards
        document.querySelectorAll('.service-card').forEach((el, i) => {
            el.classList.add('reveal');
            el.style.transitionDelay = `${i * 0.1}s`;
        });

        // Hospital cards
        document.querySelectorAll('.hospital-card').forEach((el, i) => {
            el.classList.add('reveal');
            el.style.transitionDelay = `${i * 0.08}s`;
        });

        // Why cards
        document.querySelectorAll('.why-card').forEach((el, i) => {
            el.classList.add('reveal');
            el.style.transitionDelay = `${i * 0.1}s`;
        });

        // Other elements to animate
        const animElements = [
            '.zones__map-card',
            '.zones__coverage',
            '.cta-band__container'
        ];

        animElements.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                el.classList.add('reveal');
            });
        });
    };

    revealElements();

    // Intersection Observer for revealing elements
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optionally unobserve after reveal
                // observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('.reveal').forEach(el => {
        observer.observe(el);
    });

    // ===== COUNTER ANIMATION (for future stats section) =====
    const animateCounter = (element, target, duration = 2000) => {
        let start = 0;
        const step = timestamp => {
            if (!start) start = timestamp;
            const progress = Math.min((timestamp - start) / duration, 1);
            element.textContent = Math.floor(progress * target);
            if (progress < 1) {
                requestAnimationFrame(step);
            }
        };
        requestAnimationFrame(step);
    };

    // ===== MOBILE STICKY CTA SHOW/HIDE =====
    const mobileCta = document.getElementById('mobile-cta');

    if (mobileCta) {
        let mobileCtaVisible = false;

        const toggleMobileCta = () => {
            const scrollY = window.pageYOffset;

            if (scrollY > 400 && !mobileCtaVisible) {
                mobileCta.style.transform = 'translateY(0)';
                mobileCtaVisible = true;
            } else if (scrollY <= 400 && mobileCtaVisible) {
                mobileCta.style.transform = 'translateY(100%)';
                mobileCtaVisible = false;
            }
        };

        // Initially hidden
        mobileCta.style.transform = 'translateY(100%)';
        mobileCta.style.transition = 'transform 0.3s ease';

        window.addEventListener('scroll', toggleMobileCta, { passive: true });
    }

    // ===== HOSPITAL CARDS - Interactive Hover =====
    document.querySelectorAll('.hospital-card').forEach(card => {
        card.addEventListener('mouseenter', function () {
            this.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        });
    });

    // ===== SERVICE CARDS TOUCH INTERACTION =====
    if ('ontouchstart' in window) {
        document.querySelectorAll('.service-card').forEach(card => {
            card.addEventListener('touchstart', function () {
                // Remove active from other cards
                document.querySelectorAll('.service-card').forEach(c => {
                    if (c !== this) c.classList.remove('touch-active');
                });
                this.classList.toggle('touch-active');
            }, { passive: true });
        });
    }

    // ===== PARALLAX EFFECT FOR HERO ORBS =====
    const orbs = document.querySelectorAll('.hero__gradient-orb');

    if (orbs.length > 0 && window.innerWidth > 768) {
        window.addEventListener('mousemove', (e) => {
            const mouseX = e.clientX / window.innerWidth;
            const mouseY = e.clientY / window.innerHeight;

            orbs.forEach((orb, i) => {
                const speed = (i + 1) * 15;
                const x = (mouseX - 0.5) * speed;
                const y = (mouseY - 0.5) * speed;
                orb.style.transform = `translate(${x}px, ${y}px)`;
            });
        }, { passive: true });
    }

    // ===== RESERVATION MODAL =====
    const modal = document.getElementById('reservation-modal');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const reservationForm = document.getElementById('reservation-form');
    const reservationSuccess = document.getElementById('reservation-success');
    const destinationSelect = document.getElementById('res-destination');
    const autreDestGroup = document.getElementById('autre-destination-group');

    // Open modal from all reservation buttons
    const openModalBtns = document.querySelectorAll('.open-reservation-btn, #nav-reservation-btn');

    function openModal() {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        // Close mobile nav if open
        const mobileNav = document.getElementById('mobile-nav');
        const hamburger = document.getElementById('hamburger-btn');
        if (mobileNav && mobileNav.classList.contains('active')) {
            mobileNav.classList.remove('active');
            hamburger.classList.remove('active');
        }
    }

    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    openModalBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            openModal();
        });
    });

    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', closeModal);
    }

    // Close on overlay click
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    }

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
            closeModal();
        }
    });

    // Toggle "autre" destination field
    if (destinationSelect) {
        destinationSelect.addEventListener('change', function () {
            if (autreDestGroup) {
                autreDestGroup.style.display = this.value === 'autre' ? 'block' : 'none';
                const autreInput = document.getElementById('res-destination-autre');
                if (autreInput) {
                    autreInput.required = this.value === 'autre';
                }
            }
        });
    }

    // Set minimum date to today
    const dateInput = document.getElementById('res-date');
    if (dateInput) {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        dateInput.min = `${yyyy}-${mm}-${dd}`;
        dateInput.value = `${yyyy}-${mm}-${dd}`;
    }

    // Handle form submission
    if (reservationForm) {
        reservationForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            // Collect form data
            const formData = new FormData(this);
            const submitBtn = document.getElementById('submit-reservation-btn');

            // Loading state
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Envoi en cours...';
            submitBtn.disabled = true;

            try {
                // Send via Web3Forms API
                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    body: formData
                });
                
                const data = await response.json();

                if (response.ok) {
                    // Redirect to thank you page for conversion tracking
                    window.location.href = 'merci.html';
                } else {
                    alert('Erreur: ' + data.message);
                }
            } catch (error) {
                console.error('Erreur Web3Forms:', error);
                // Fallback email in case of total failure (like adblock blocking the fetch)
                const dataObj = Object.fromEntries(formData.entries());
                const subject = `Réservation Transport - ${dataObj.nom}`;
                const body = `Nom: ${dataObj.nom}%0ATéléphone: ${dataObj.telephone}%0AType: ${dataObj.type}%0ADate: ${dataObj.date} ${dataObj.heure}%0ADépart: ${dataObj.depart}%0ADestination: ${dataObj.destination}%0ARetour: ${dataObj.retour}%0ANotes: ${dataObj.notes || 'Aucune'}`;
                window.location.href = `mailto:contact@central-taxi.fr?subject=${encodeURIComponent(subject)}&body=${body}`;
                
                alert("Une erreur de réseau a eu lieu. Vous allez être redirigé vers votre boîte mail pour finaliser l'envoi manuel.");
            } finally {
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }

    // ===== LOG LOADED =====
    console.log('🚕 Central Taxi - Site chargé avec succès');
});

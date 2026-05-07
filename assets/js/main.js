document.addEventListener('DOMContentLoaded', () => {

    // 1. LENIS SMOOTH SCROLL
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // GSAP Sync with Lenis
    gsap.registerPlugin(ScrollTrigger);

    const html = document.documentElement;

    // 3. PRELOADER & HERO REVEAL
    const preloader = document.getElementById('preloader');
    const preloaderText = document.getElementById('preloader-text');

    const tl = gsap.timeline();

    // Type out text
    const textToType = "Xenatrix AI";
    let typeIndex = 0;

    setTimeout(() => {
        const typeInterval = setInterval(() => {
            if (typeIndex < textToType.length) {
                preloaderText.innerHTML += textToType.charAt(typeIndex);
                typeIndex++;
            } else {
                clearInterval(typeInterval);
                finishPreloader();
            }
        }, 80);
    }, 500);

    function finishPreloader() {
        if (!preloader) {
            initHeroAnimations();
            return;
        }
        tl.to(preloader, {
            yPercent: -100,
            duration: 0.8,
            ease: "power4.inOut",
            delay: 0.3,
            onComplete: () => {
                // Initialize Hero GSAP animations after preloader
                initHeroAnimations();
            }
        });
    }

    function initHeroAnimations() {
        // Split text for hero headline
        const headline = document.getElementById('hero-headline');
        if (!headline) return;
        const words = headline.innerText.split(' ');
        headline.innerHTML = '';
        words.forEach(word => {
            headline.innerHTML += `<span class="word"><span>${word}</span></span> `;
        });

        gsap.to('.hero-title .word span', {
            y: 0,
            duration: 0.8,
            stagger: 0.07,
            ease: "power4.out"
        });

        gsap.to('.hero .reveal-up:not(.hero-title)', {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: "power4.out",
            onComplete: () => {
                // Add floating animation to stats after they reveal
                document.querySelectorAll('.stat-item').forEach((item, index) => {
                    setTimeout(() => {
                        item.classList.add('active-float');
                    }, index * 200);
                });
            }
        });
    }


    // 4. CUSTOM CURSOR
    const cursorDot = document.querySelector('.custom-cursor-dot');
    const cursorRing = document.querySelector('.custom-cursor-ring');
    let isDesktop = window.innerWidth > 1024;

    if (isDesktop) {
        let mouseX = 0, mouseY = 0;
        let ringX = 0, ringY = 0;

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            // Dot follows instantly
            cursorDot.style.left = `${mouseX}px`;
            cursorDot.style.top = `${mouseY}px`;
        });

        // Ring follows with slight lag
        function animateCursor() {
            ringX += (mouseX - ringX) * 0.15;
            ringY += (mouseY - ringY) * 0.15;

            cursorRing.style.left = `${ringX}px`;
            cursorRing.style.top = `${ringY}px`;

            requestAnimationFrame(animateCursor);
        }
        animateCursor();

        // Hover states
        const interactiveElements = document.querySelectorAll('a, button, .service-card, .project-card, .contact-item, .fp-tab-btn, input, textarea, select');

        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorRing.classList.add('hover');
            });
            el.addEventListener('mouseleave', () => {
                cursorRing.classList.remove('hover');
            });
        });
    }

    // 5. HERO TYPING EFFECT
    const typingElement = document.getElementById('hero-typing');
    const typingPhrases = [
        "n8n Automation Expert",
        "AI Voice Bot Builder",
        "Full Stack Developer",
        "Business Systems Architect"
    ];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeEffect() {
        const currentPhrase = typingPhrases[phraseIndex];

        if (isDeleting) {
            typingElement.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingElement.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
        }

        let typeSpeed = isDeleting ? 40 : 80;

        if (!isDeleting && charIndex === currentPhrase.length) {
            typeSpeed = 2000; // Pause at end
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % typingPhrases.length;
            typeSpeed = 500; // Pause before next word
        }

        setTimeout(typeEffect, typeSpeed);
    }
    typeEffect();

    const canvas = document.getElementById('hero-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height, particles = [];

        function resizeCanvas() {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.radius = Math.random() * 1.5 + 0.5;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                if (this.x < 0 || this.x > width) this.vx = -this.vx;
                if (this.y < 0 || this.y > height) this.vy = -this.vy;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);

                // Adapt color based on theme
                const isLight = html.getAttribute('data-theme') === 'light';
                ctx.fillStyle = isLight ? 'rgba(15, 164, 175, 0.4)' : 'rgba(15, 164, 175, 0.6)';
                ctx.fill();
            }
        }

        particles = Array.from({ length: window.innerWidth < 768 ? 40 : 80 }, () => new Particle());

        let mouse = { x: -1000, y: -1000 };
        window.addEventListener('mousemove', (e) => { mouse.x = e.clientX; mouse.y = e.clientY; });
        window.addEventListener('mouseleave', () => { mouse.x = -1000; mouse.y = -1000; });

        function animateCanvas() {
            ctx.clearRect(0, 0, width, height);

            const isLight = html.getAttribute('data-theme') === 'light';
            const strokeColor = isLight ? 'rgba(15, 164, 175,' : 'rgba(15, 164, 175,';

            particles.forEach((p, index) => {
                p.update();
                p.draw();

                // Connect to mouse
                const dxMouse = mouse.x - p.x;
                const dyMouse = mouse.y - p.y;
                const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);

                if (distMouse < 120) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.strokeStyle = `${strokeColor}${1 - distMouse / 120})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }

                // Connect to other particles
                for (let j = index + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const dx = p.x - p2.x;
                    const dy = p.y - p2.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 100) {
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.strokeStyle = `${strokeColor}${(1 - dist / 100) * 0.3})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            });
            requestAnimationFrame(animateCanvas);
        }
        animateCanvas();
    }

    // 7. NAVBAR SCROLL & ACTIVE STATE
    const navbar = document.getElementById('navbar');
    const scrollProgress = document.getElementById('scroll-progress');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;

        // Navbar glass effect
        if (currentScrollY > 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Show/Hide navbar on scroll
        if (currentScrollY > lastScrollY && currentScrollY > 500) {
            navbar.classList.add('nav-hidden');
        } else {
            navbar.classList.remove('nav-hidden');
        }
        lastScrollY = currentScrollY;

        // Scroll Progress Bar
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        scrollProgress.style.width = scrolled + "%";

        // Active Nav Spy
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // Mobile Menu
    const menuToggle = document.getElementById('menu-toggle');
    const navLinksContainer = document.getElementById('nav-links');

    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navLinksContainer.classList.toggle('active');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            navLinksContainer.classList.remove('active');
        });
    });

    // 8. TIKKA HOUSE TABS
    const tabBtns = document.querySelectorAll('.fp-tab-btn');
    const tabContents = document.querySelectorAll('.fp-tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.getAttribute('data-tab');

            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            btn.classList.add('active');
            document.getElementById(target).classList.add('active');
        });
    });

    // 9. PORTFOLIO FILTERING
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.style.display = 'flex';
                    setTimeout(() => { card.style.opacity = '1'; card.style.transform = 'scale(1)'; }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.95)';
                    setTimeout(() => { card.style.display = 'none'; }, 300);
                }
            });
            // Re-initialize ScrollTrigger after layout change
        });
    });

    // 10. GSAP SCROLLTRIGGER ANIMATIONS

    // Reveal Up
    const revealElements = document.querySelectorAll('.reveal-up:not(.hero *)');
    revealElements.forEach((el, index) => {
        gsap.to(el, {
            scrollTrigger: {
                trigger: el,
                start: "top 85%",
            },
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power4.out"
        });
    });

    // Stats Counter
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'));
        gsap.to(stat, {
            scrollTrigger: {
                trigger: stat,
                start: "top 90%",
            },
            innerHTML: target,
            duration: 1.2,
            snap: { innerHTML: 1 },
            ease: "power2.out"
        });

    });

    // Scan line image reveals
    const imgWrappers = document.querySelectorAll('.fp-img-wrapper');
    imgWrappers.forEach(wrapper => {
        const scanLine = wrapper.querySelector('.scan-line');
        if (scanLine) {
            gsap.to(scanLine, {
                scrollTrigger: {
                    trigger: wrapper,
                    start: "top 80%",
                },
                y: "100%",
                opacity: 1,
                duration: 1.5,
                ease: "power2.inOut",
                onComplete: () => {
                    gsap.to(scanLine, { opacity: 0, duration: 0.3 });
                }
            });
        }
    });

    // Workflow connector SVG drawing
    const workflowPath = document.querySelector('.workflow-path-anim');
    if (workflowPath) {
        gsap.to(workflowPath, {
            scrollTrigger: {
                trigger: '.workflow-grid',
                start: "top 70%",
                end: "bottom 50%",
                scrub: 1,
            },
            strokeDashoffset: 0,
            ease: "none"
        });
    }

    // 11. VANILLA TILT

    if (window.innerWidth > 768) {
        VanillaTilt.init(document.querySelectorAll(".tilt-element"), {
            max: 8,
            speed: 400,
            glare: false,
            "max-glare": 0.2,
        });
    }

    // 12. CONTACT FORM (FormSubmit + Tabs + Animations)

    // Tab Switching
    const contactTabs = document.querySelectorAll('.contact-tab');
    const contactTabContents = document.querySelectorAll('.contact-tab-content');
    const tabSlider = document.getElementById('tab-slider');

    function updateTabSlider(activeTab) {
        if (!tabSlider || !activeTab) return;
        const tabRect = activeTab.getBoundingClientRect();
        const containerRect = activeTab.parentElement.getBoundingClientRect();
        tabSlider.style.left = (tabRect.left - containerRect.left) + 'px';
        tabSlider.style.width = tabRect.width + 'px';
    }

    contactTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetId = tab.getAttribute('data-tab');

            // Animate out current content
            contactTabContents.forEach(c => {
                if (c.classList.contains('active')) {
                    c.style.animation = 'tabFadeOut 0.3s ease forwards';
                    setTimeout(() => {
                        c.classList.remove('active');
                        c.style.animation = '';
                    }, 300);
                }
            });

            contactTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            updateTabSlider(tab);

            // Animate in new content
            setTimeout(() => {
                const target = document.getElementById(targetId);
                if (target) {
                    target.classList.add('active');
                    target.style.animation = 'tabFadeIn 0.4s ease forwards';
                }
            }, 300);
        });
    });

    // Initialize slider position
    const activeTabBtn = document.querySelector('.contact-tab.active');
    if (activeTabBtn) {
        setTimeout(() => updateTabSlider(activeTabBtn), 100);
    }
    window.addEventListener('resize', () => {
        const active = document.querySelector('.contact-tab.active');
        if (active) updateTabSlider(active);
    });

    // Contact Form — Popup confirm then Gmail
    const contactForm = document.getElementById('contactForm');
    const submitBtn   = document.getElementById('submitBtn');
    const leadPopup   = document.getElementById('leadPopup');
    const popupDetails= document.getElementById('leadPopupDetails');
    const popupSendBtn= document.getElementById('popupSendBtn');
    const popupCloseBtn=document.getElementById('popupCloseBtn');

    let gmailUrl = '';

    function closePopup() {
        if (!leadPopup) return;
        leadPopup.classList.add('closing');
        setTimeout(() => {
            leadPopup.style.display = 'none';
            leadPopup.classList.remove('closing');
        }, 320);
    }

    if (popupCloseBtn) popupCloseBtn.addEventListener('click', closePopup);
    if (leadPopup) leadPopup.addEventListener('click', (e) => {
        if (e.target === leadPopup) closePopup();
    });

    if (popupSendBtn) {
        popupSendBtn.addEventListener('click', () => {
            // Open Gmail
            window.open(gmailUrl, '_blank');

            // Close popup with animation
            closePopup();

            // Show success on the Send button
            const btnText    = submitBtn.querySelector('.btn-text');
            const btnLoading = submitBtn.querySelector('.btn-loading');
            const btnSuccess = submitBtn.querySelector('.btn-success');
            showFormSuccess(btnText, btnLoading, btnSuccess, contactForm, submitBtn);
        });
    }

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name    = document.getElementById('cf-name').value.trim();
            const email   = document.getElementById('cf-email').value.trim();
            const phone   = document.getElementById('cf-phone').value.trim();
            const service = document.getElementById('cf-service').value;
            const budget  = document.getElementById('cf-budget').value;
            const company = document.getElementById('cf-company').value.trim() || 'N/A';
            const message = document.getElementById('cf-message').value.trim();

            // Build Gmail URL
            const subject = encodeURIComponent('New Lead: ' + name + ' | ' + service);
            const body = encodeURIComponent(
                'NAME: ' + name + '\n' +
                'EMAIL: ' + email + '\n' +
                'PHONE: ' + phone + '\n' +
                'SERVICE: ' + service + '\n' +
                'BUDGET: ' + budget + '\n' +
                'COMPANY: ' + company + '\n' +
                'TIME: ' + new Date().toLocaleString('en-IN', {timeZone:'Asia/Kolkata'}) + '\n\n' +
                'MESSAGE:\n' + message
            );
            gmailUrl = 'https://mail.google.com/mail/?view=cm&to=xenatrixai%40gmail.com&su=' + subject + '&body=' + body;

            // Populate popup details
            const rows = [
                ['NAME',    name],
                ['EMAIL',   email],
                ['PHONE',   phone],
                ['SERVICE', service],
                ['BUDGET',  budget],
                ['COMPANY', company],
                ['MSG',     message.length > 80 ? message.substring(0,80)+'…' : message]
            ];
            popupDetails.innerHTML = rows.map(([label, val]) =>
                '<div class="lead-detail-row">' +
                '<span class="lead-detail-label">' + label + '</span>' +
                '<span class="lead-detail-value">' + (val || '—') + '</span>' +
                '</div>'
            ).join('');

            // Show popup
            leadPopup.style.display = 'flex';

            // n8n background sync
            try {
                navigator.sendBeacon(
                    'https://n8n-production-7a00b.up.railway.app/webhook/rynex-demo',
                    new Blob([JSON.stringify({name,email,phone,service,budget,company,message,source:'portfolio'})], {type:'application/json'})
                );
            } catch(_) {}
        });
    }

    function showFormSuccess(btnText, btnLoading, btnSuccess, form, btn) {
        btnLoading.style.display = 'none';
        btnSuccess.style.display = 'inline-flex';
        btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
        btn.style.borderColor = '#10b981';
        form.reset();

        // Confetti burst animation
        createConfettiBurst();

        setTimeout(() => {
            btnSuccess.style.display = 'none';
            btnText.style.display = 'inline-flex';
            btn.style.background = '';
            btn.style.borderColor = '';
            btn.disabled = false;
        }, 4000);
    }

    function createConfettiBurst() {
        const btn = document.getElementById('submitBtn');
        if (!btn) return;
        const rect = btn.getBoundingClientRect();
        const colors = ['#0FA4AF', '#a9fc81', '#06b6d4', '#ec4899', '#f59e0b', '#8b5cf6'];

        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.className = 'confetti-particle';
            particle.style.left = (rect.left + rect.width / 2) + 'px';
            particle.style.top = (rect.top) + 'px';
            particle.style.background = colors[Math.floor(Math.random() * colors.length)];
            particle.style.setProperty('--x', (Math.random() - 0.5) * 300 + 'px');
            particle.style.setProperty('--y', -(Math.random() * 200 + 100) + 'px');
            particle.style.setProperty('--r', Math.random() * 720 + 'deg');
            document.body.appendChild(particle);
            setTimeout(() => particle.remove(), 1200);
        }
    }

    // Contact section particle animation
    function initContactParticles() {
        const container = document.getElementById('contact-particles');
        if (!container) return;

        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.className = 'contact-floating-particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 5 + 's';
            particle.style.animationDuration = (5 + Math.random() * 10) + 's';
            particle.style.width = (3 + Math.random() * 6) + 'px';
            particle.style.height = particle.style.width;
            container.appendChild(particle);
        }
    }
    initContactParticles();

    // Animate contact items on scroll
    const contactAnimItems = document.querySelectorAll('.contact-item-animated');
    contactAnimItems.forEach((item, idx) => {
        gsap.fromTo(item,
            { x: -60, opacity: 0 },
            {
                x: 0, opacity: 1, duration: 0.8, delay: idx * 0.15,
                ease: "power3.out",
                scrollTrigger: { trigger: item, start: "top 85%" }
            }
        );
    });

    // 13. CUSTOM AUDIO UI LOGIC
    const audioBtn = document.getElementById('ai-audio-btn');
    const audioPlayer = document.getElementById('ai-audio-player');
    const audioViz = document.getElementById('ai-audio-viz');
    const audioIcon = document.getElementById('ai-audio-icon');
    const audioProgress = document.getElementById('ai-audio-progress');
    const skipBack = document.getElementById('ai-audio-back');
    const skipForward = document.getElementById('ai-audio-forward');

    if (audioBtn && audioPlayer) {
        // Play/Pause
        audioBtn.addEventListener('click', () => {
            if (audioPlayer.paused) {
                audioPlayer.play();
                if (audioViz) audioViz.classList.remove('paused');
                audioIcon.classList.remove('fa-play');
                audioIcon.classList.add('fa-pause');
            } else {
                audioPlayer.pause();
                if (audioViz) audioViz.classList.add('paused');
                audioIcon.classList.remove('fa-pause');
                audioIcon.classList.add('fa-play');
            }
        });

        // Skip Backward
        if (skipBack) {
            skipBack.addEventListener('click', () => {
                audioPlayer.currentTime = Math.max(0, audioPlayer.currentTime - 10);
            });
        }

        // Skip Forward
        if (skipForward) {
            skipForward.addEventListener('click', () => {
                audioPlayer.currentTime = Math.min(audioPlayer.duration, audioPlayer.currentTime + 10);
            });
        }

        // Progress Update
        audioPlayer.addEventListener('timeupdate', () => {
            const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
            if (audioProgress) audioProgress.style.width = `${progress}%`;
        });

        audioPlayer.addEventListener('ended', () => {
            if (audioViz) audioViz.classList.add('paused');
            audioIcon.classList.remove('fa-pause');
            audioIcon.classList.add('fa-play');
            if (audioProgress) audioProgress.style.width = '0%';
        });
    }


    // 14. LIGHTBOX MODAL
    const lightboxModal = document.getElementById('lightbox-modal');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.querySelector('.lightbox-close');
    const expandableImgs = document.querySelectorAll('.expandable-img');

    if (lightboxModal && expandableImgs.length > 0) {
        expandableImgs.forEach(img => {
            img.addEventListener('click', () => {
                lightboxImg.src = img.src;
                lightboxModal.style.display = 'block';
                // Prevent scrolling behind
                document.body.style.overflow = 'hidden';
            });
        });

        const closeLightbox = () => {
            lightboxModal.style.display = 'none';
            document.body.style.overflow = 'auto';
            lightboxImg.src = '';
        };

        lightboxClose.addEventListener('click', closeLightbox);

        lightboxModal.addEventListener('click', (e) => {
            if (e.target === lightboxModal) {
                closeLightbox();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightboxModal.style.display === 'block') {
                closeLightbox();
            }
        });
    }
    // 15. BENTO MOSAIC ANIMATIONS
    const bentoHeading = document.getElementById('bento-heading');
    if (bentoHeading) {
        // Split text into words for staggered animation
        const words = bentoHeading.innerText.split(' ');
        bentoHeading.innerHTML = '';
        words.forEach((word, index) => {
            if (word.trim() !== '') {
                const span = document.createElement('span');
                span.classList.add('word');
                if (index >= words.length - 2) {
                    span.classList.add('gradient-text');
                }
                span.innerHTML = word + '&nbsp;';
                bentoHeading.appendChild(span);
            }
        });

        if (window.gsap && window.ScrollTrigger) {
            gsap.to('.bento-heading .word', {
                scrollTrigger: {
                    trigger: '.portfolio-header',
                    start: "top 80%",
                },
                y: 0,
                opacity: 1,
                duration: 0.8,
                stagger: 0.1,
                ease: "power4.out"
            });
        } else {
            document.querySelectorAll('.bento-heading .word').forEach(el => {
                el.style.opacity = 1;
                el.style.transform = 'none';
            });
        }
    }

    // Scroll Entrance for Cards
    const bentoCards = document.querySelectorAll('.bento-reveal');
    if (bentoCards.length > 0) {
        const bentoObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const card = entry.target;
                    const index = Array.from(bentoCards).indexOf(card);
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                        card.classList.add('is-visible');
                    }, index * 120);

                    bentoObserver.unobserve(card);
                }
            });
        }, { threshold: 0.1 });

        bentoCards.forEach(card => {
            bentoObserver.observe(card);
        });
    }

    // Video Hover Autoplay
    const bentoVideos = document.querySelectorAll('.bento-video');
    bentoVideos.forEach(video => {
        const card = video.closest('.bento-card-project');
        if (card) {
            card.addEventListener('mouseenter', () => {
                video.play().catch(e => console.log('Autoplay prevented:', e));
            });
            card.addEventListener('mouseleave', () => {
                video.pause();
                video.currentTime = 0;
            });
        }
    });

    // 16. TECH VAULT ANIMATION (3-STAGE SEQUENCE)
    const techKey = document.getElementById('tech-key');
    const techBag = document.getElementById('tech-bag');
    const vaultContainer = document.getElementById('tech-vault-container');
    const techHeading = document.getElementById('tech-heading');

    if (techKey && techBag && vaultContainer) {
        let isUnlocked = false;

        const unlockSequence = () => {
            if (isUnlocked) return;
            isUnlocked = true;

            // Unlock the bag
            techBag.innerHTML = '<i class="fa-solid fa-briefcase"></i><i class="fa-solid fa-circle-check lock-icon-small" style="color: #a9fc81;"></i>';
            if (techHeading) techHeading.innerHTML = 'Tech Vault <span class="gradient-text">Unlocked</span>';

            // Stage 1 -> Stage 2 (Fluid State)
            vaultContainer.classList.add('unlocked'); // Hides interaction area

            setTimeout(() => {
                vaultContainer.classList.add('fluid-active');
                // Scatter fluid nodes around center
                const fluidNodes = document.querySelectorAll('.fluid-node');
                fluidNodes.forEach(node => {
                    const angle = Math.random() * Math.PI * 2;
                    const distance = 80 + Math.random() * 150;
                    const x = Math.cos(angle) * distance;
                    const y = Math.sin(angle) * distance;
                    // Apply random floating animation inside the transform
                    node.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(${0.8 + Math.random() * 0.4})`;
                });

                // Start Typewriter
                const typeText = "My Tech Stack...";
                const typeEl = document.getElementById('typewriter-text');
                let charIdx = 0;

                // Delay typewriter slightly to let nodes float out first
                setTimeout(() => {
                    const typeInterval = setInterval(() => {
                        if (charIdx < typeText.length) {
                            typeEl.textContent += typeText.charAt(charIdx);
                            charIdx++;
                        } else {
                            clearInterval(typeInterval);
                            // Stage 2 -> Stage 3 (Organized Grid)
                            setTimeout(() => {
                                vaultContainer.classList.remove('fluid-active'); // fades out cluster
                                setTimeout(() => {
                                    vaultContainer.classList.add('organized-active'); // fades in grid
                                }, 500);
                            }, 1000); // 1 second after typing finishes
                        }
                    }, 80); // Slightly faster typing for cinematic feel
                }, 800); // Wait 0.8s for nodes to explode out before typing

            }, 400);
        };

        // Mouse Parallax for Fluid Stage
        const fluidWrapper = document.getElementById('fluid-nodes-wrapper');
        vaultContainer.addEventListener('mousemove', (e) => {
            if (!vaultContainer.classList.contains('fluid-active')) return;
            const rect = vaultContainer.getBoundingClientRect();
            const xPos = (e.clientX - rect.left) / rect.width - 0.5;
            const yPos = (e.clientY - rect.top) / rect.height - 0.5;
            fluidWrapper.style.transform = `translate(${xPos * 60}px, ${yPos * 60}px)`;
        });

        // Touch support for parallax
        vaultContainer.addEventListener('touchmove', (e) => {
            if (!vaultContainer.classList.contains('fluid-active')) return;
            const touch = e.touches[0];
            const rect = vaultContainer.getBoundingClientRect();
            const xPos = (touch.clientX - rect.left) / rect.width - 0.5;
            const yPos = (touch.clientY - rect.top) / rect.height - 0.5;
            fluidWrapper.style.transform = `translate(${xPos * 60}px, ${yPos * 60}px)`;
        }, { passive: true });


        // Drag Events for Key
        techKey.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', 'key');
            setTimeout(() => { techKey.style.opacity = '0.5'; }, 0);
            techKey.classList.add('is-dragging');
        });

        techKey.addEventListener('dragend', () => {
            techKey.style.opacity = '1';
            techKey.classList.remove('is-dragging');
        });

        // Drop Events for Bag
        techBag.addEventListener('dragover', (e) => {
            e.preventDefault();
            techBag.classList.add('drag-over');
        });

        techBag.addEventListener('dragleave', () => { techBag.classList.remove('drag-over'); });

        techBag.addEventListener('drop', (e) => {
            e.preventDefault();
            techBag.classList.remove('drag-over');
            if (e.dataTransfer.getData('text/plain') === 'key') {
                unlockSequence();
            }
        });

        techBag.addEventListener('click', unlockSequence);

        techKey.addEventListener('touchstart', () => { techKey.style.opacity = '0.5'; }, { passive: true });
        techKey.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const touchLocation = e.targetTouches[0];
            techKey.style.position = 'absolute';
            techKey.style.left = touchLocation.pageX + 'px';
            techKey.style.top = touchLocation.pageY + 'px';
        });

        techKey.addEventListener('touchend', (e) => {
            techKey.style.opacity = '1';
            techKey.classList.remove('is-dragging');
            techKey.style.position = 'static';
            const changedTouch = e.changedTouches[0];
            const elem = document.elementFromPoint(changedTouch.clientX, changedTouch.clientY);
            if (elem && (elem.id === 'tech-bag' || elem.closest('#tech-bag'))) {
                unlockSequence();
            }
        });
    }

    // 17. SERVICES ACCORDION
    window.activateAccordion = function (index) {
        const panels = document.querySelectorAll('.accordion-panel');
        panels.forEach((panel, i) => {
            if (i === index) {
                panel.classList.add('active');
            } else {
                panel.classList.remove('active');
            }
        });
    }
});


// Hover Expand interaction logic
function activateHe(element) {
    const container = document.getElementById('hover-expand-group');
    if (container) {
        const items = container.querySelectorAll('.he-item');

        // Check if this item is already active to prevent restarting animation
        if (element.classList.contains('active')) return;

        items.forEach(item => {
            item.classList.remove('active');
            // Cleanup previous animations
            const otherWords = item.querySelectorAll('.ml15 .word');
            if (typeof anime !== 'undefined') {
                anime.remove(otherWords);
            }
        });

        element.classList.add('active');

        // Trigger anime.js for the active element's ml15 category words
        const targetWords = element.querySelectorAll('.ml15 .word');

        if (targetWords.length > 0 && typeof anime !== 'undefined') {
            // Remove existing instances
            anime.remove(targetWords);

            // Set initial state for a smoother entrance
            targetWords.forEach(w => {
                w.style.opacity = '0';
                w.style.transform = 'scale(2.5)'; // Reduced from 14 for massive performance boost
            });

            // High-performance smooth animation
            anime({
                targets: targetWords,
                scale: [2.5, 1],
                opacity: [0, 1],
                easing: "easeOutExpo", // Switched to Expo for a snappier, smoother feel
                duration: 600,         // Slightly faster duration for punchier feedback
                delay: anime.stagger(100) // Efficient staggering
            });
        }
    }
}

// Why Choose Us - 3D Perspective Scroll logic
function initPerspectiveScroll() {
    const perspectiveText = document.getElementById('perspective-text');
    const scrollTrack = document.querySelector('.perspective-scroll-track');

    if (perspectiveText && scrollTrack && typeof gsap !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        // Ensure initial visibility
        gsap.set(perspectiveText, { opacity: 1 });

        const mainTl = gsap.timeline({
            scrollTrigger: {
                trigger: ".perspective-scroll-track",
                start: "top top",
                end: "bottom bottom",
                scrub: 1.2,
                invalidateOnRefresh: true
            }
        });

        // 3D Tilt and Vertical movement
        mainTl.fromTo(perspectiveText,
            {
                rotateX: 45,
                y: "30vh",
                z: -100
            },
            {
                rotateX: -15,
                y: "-50vh",
                z: 50,
                ease: "none"
            }
        );

        // Individual line lighting effects
        const lines = perspectiveText.querySelectorAll('.text-line');
        lines.forEach((line) => {
            gsap.to(line, {
                scrollTrigger: {
                    trigger: line,
                    start: "top center+=20%",
                    end: "bottom center-=20%",
                    toggleClass: "is-active",
                    scrub: true
                }
            });
        });

        ScrollTrigger.refresh();
    }
}

// Re-init on load and critical changes
window.addEventListener('load', () => {
    setTimeout(initPerspectiveScroll, 200);
});
window.addEventListener('resize', initPerspectiveScroll);

// 18. MANIFESTO — CLEAN SCROLL + AUDIO
function initManifesto() {
    var lines = document.querySelectorAll('.m-line');
    var section = document.querySelector('.manifesto-section');
    var progressFill = document.getElementById('manifesto-progress');
    var closing = document.getElementById('manifesto-closing');
    var audioEl = document.getElementById('manifesto-audio');

    if (!lines.length || !section || !window.gsap || !window.ScrollTrigger) return;

    // Reset inline styles that might have been added by the sticky version
    section.style.minHeight = '';
    var wrap = document.querySelector('.manifesto-sticky-wrap');
    if (wrap) wrap.style.cssText = '';
    var linesContainer = document.getElementById('manifesto-lines');
    if (linesContainer) linesContainer.style.transform = '';

    var currentAudioLine = null;
    var audioUnlocked = false;
    function unlockAudio() {
        if (audioUnlocked) return;
        audioUnlocked = true;
        if (audioEl) {
            audioEl.play().then(() => { audioEl.pause(); audioEl.currentTime = 0; }).catch(() => { });
        }
        document.removeEventListener('click', unlockAudio);
        document.removeEventListener('scroll', unlockAudio);
    }
    document.addEventListener('click', unlockAudio);
    document.addEventListener('scroll', unlockAudio);


    function playAudio(el) {
        if (!audioEl) return;
        var src = el.getAttribute('data-audio');
        if (!src) return;
        if (currentAudioLine === el && !audioEl.paused) return;

        audioEl.pause();
        audioEl.currentTime = 0;
        audioEl.src = src;
        audioEl.volume = 1.0;
        audioEl.play().catch(function () { });

        document.querySelectorAll('.is-playing').forEach(function (x) { x.classList.remove('is-playing'); });
        el.classList.add('is-playing');
        currentAudioLine = el;
    }

    function stopAudio() {
        if (!audioEl) return;
        audioEl.pause();
        audioEl.currentTime = 0;
        document.querySelectorAll('.is-playing').forEach(function (x) { x.classList.remove('is-playing'); });
        currentAudioLine = null;
    }

    if (audioEl) {
        audioEl.addEventListener('ended', function () {
            document.querySelectorAll('.is-playing').forEach(function (x) { x.classList.remove('is-playing'); });
            currentAudioLine = null;
        });
    }

    // Scroll Progress
    ScrollTrigger.create({
        trigger: section,
        start: "top 20%",
        end: "bottom 80%",
        onUpdate: function (self) {
            if (progressFill) progressFill.style.height = (self.progress * 100) + '%';
        }
    });


    // Stop audio when section is out of view
    ScrollTrigger.create({
        trigger: section,
        start: "top bottom",
        end: "bottom top",
        onLeave: function () { stopAudio(); },
        onLeaveBack: function () { stopAudio(); }
    });

    // Animate each line based on its position in viewport
    lines.forEach(function (line) {
        gsap.fromTo(line,
            { color: "rgba(255, 255, 255, 0.06)", filter: "blur(1.5px)", x: 0 },
            {
                color: "rgba(255, 255, 255, 0.95)", filter: "blur(0px)", x: 10,
                scrollTrigger: {
                    trigger: line,
                    start: "top 65%",
                    end: "top 35%",
                    scrub: 0.3,
                    onToggle: function (self) {
                        if (self.isActive) {
                            line.classList.add('is-reading');
                            line.classList.remove('is-read');
                            playAudio(line);
                        } else {
                            line.classList.remove('is-reading');
                            if (self.progress > 0) line.classList.add('is-read');
                        }
                    }
                }
            }
        );

        // Hover + click audio
        line.addEventListener('mouseenter', function () { playAudio(line); });
        line.addEventListener('click', function () { playAudio(line); });
    });

    // Closing reveal
    if (closing) {
        gsap.fromTo(closing,
            { opacity: 0, y: 30 },
            {
                opacity: 1, y: 0, duration: 1,
                scrollTrigger: {
                    trigger: closing,
                    start: "top 90%",
                    toggleActions: "play none none reverse",
                    onEnter: function () { playAudio(closing); }
                }
            }
        );
        closing.addEventListener('mouseenter', function () { playAudio(closing); });
    }

    // Stop audio on leave
    ScrollTrigger.create({
        trigger: section,
        start: "top bottom",
        end: "bottom top",
        onLeave: stopAudio,
        onLeaveBack: stopAudio
    });
}
window.addEventListener('load', function () { setTimeout(initManifesto, 300); });



// ═══════════════════════════════════════════
// TERMINAL DEMO PANEL
// ═══════════════════════════════════════════
function openTerminalDemo() {
    var overlay = document.getElementById('terminal-overlay');
    var panel = document.getElementById('terminal-panel');
    overlay.classList.add('is-open');
    panel.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    resetTerminal();
    startTypewriter();
}

function closeTerminalDemo() {
    var overlay = document.getElementById('terminal-overlay');
    var panel = document.getElementById('terminal-panel');
    overlay.classList.remove('is-open');
    panel.classList.remove('is-open');
    document.body.style.overflow = '';
    setTimeout(resetTerminal, 500);
}

function resetTerminal() {
    var tw = document.getElementById('terminal-typewriter');
    var form = document.getElementById('terminal-form');
    var success = document.getElementById('terminal-success');
    var submit = document.getElementById('terminal-submit');
    tw.innerHTML = '';
    form.style.display = 'none';
    success.style.display = 'none';
    if (submit) {
        submit.classList.remove('is-loading', 'is-visible');
        submit.querySelector('.tsub-text').style.display = '';
        submit.querySelector('.tsub-loading').style.display = 'none';
    }
    document.querySelectorAll('.tfield').forEach(function (f) {
        f.classList.remove('is-visible');
        var inp = f.querySelector('input');
        if (inp) inp.value = '';
    });
}

function startTypewriter() {
    var lines = [
        '> Initialising Xenatrix AI Automation Demo...',
        '> System ready. Enter your details below.',
        '> This is a live workflow. Not a mockup.'
    ];
    var tw = document.getElementById('terminal-typewriter');
    var lineIdx = 0, charIdx = 0;
    tw.innerHTML = '';

    function typeLine() {
        if (lineIdx >= lines.length) {
            // Remove cursor, show form
            var cursors = tw.querySelectorAll('.tw-cursor');
            cursors.forEach(function (c) { c.remove(); });
            showFormFields();
            return;
        }
        var line = lines[lineIdx];
        if (charIdx === 0) {
            var div = document.createElement('div');
            div.className = 'tw-line';
            tw.appendChild(div);
        }
        var currentDiv = tw.querySelectorAll('.tw-line');
        var el = currentDiv[currentDiv.length - 1];
        // Remove old cursor
        var oldCursor = tw.querySelector('.tw-cursor');
        if (oldCursor) oldCursor.remove();

        if (charIdx < line.length) {
            el.textContent = line.substring(0, charIdx + 1);
            // Add cursor
            var cursor = document.createElement('span');
            cursor.className = 'tw-cursor';
            el.appendChild(cursor);
            charIdx++;
            setTimeout(typeLine, 30);
        } else {
            lineIdx++;
            charIdx = 0;
            setTimeout(typeLine, 400);
        }
    }
    typeLine();
}

function showFormFields() {
    var form = document.getElementById('terminal-form');
    form.style.display = 'block';
    var fields = form.querySelectorAll('.tfield');
    fields.forEach(function (f, i) {
        setTimeout(function () {
            f.classList.add('is-visible');
        }, i * 80);
    });
    // Show submit after fields
    setTimeout(function () {
        var submit = document.getElementById('terminal-submit');
        if (submit) submit.classList.add('is-visible');
    }, fields.length * 80 + 100);
}

function submitTerminalDemo() {
    var name = document.getElementById('tf-name').value.trim();
    var business = document.getElementById('tf-business').value.trim();
    var industry = document.getElementById('tf-industry').value.trim();
    var phone = document.getElementById('tf-phone').value.trim();
    var email = document.getElementById('tf-email').value.trim();

    // Validation
    if (!name || !business || !industry || !phone || !email) {
        var tw = document.getElementById('terminal-typewriter');
        var errDiv = document.createElement('div');
        errDiv.style.color = '#ff5f57';
        errDiv.style.marginTop = '12px';
        errDiv.textContent = '> Error: All fields are required.';
        tw.parentElement.insertBefore(errDiv, document.getElementById('terminal-form'));
        return;
    }

    // Phone validation (basic)
    if (phone.length < 10 || !/^\d+$/.test(phone.replace(/[\s-]/g, ''))) {
        var tw = document.getElementById('terminal-typewriter');
        var errDiv = document.createElement('div');
        errDiv.style.color = '#ff5f57';
        errDiv.style.marginTop = '12px';
        errDiv.textContent = '> Error: Please enter a valid 10-digit phone number.';
        tw.parentElement.insertBefore(errDiv, document.getElementById('terminal-form'));
        return;
    }

    // Email validation
    if (!email.includes('@') || !email.includes('.')) {
        var tw = document.getElementById('terminal-typewriter');
        var errDiv = document.createElement('div');
        errDiv.style.color = '#ff5f57';
        errDiv.style.marginTop = '12px';
        errDiv.textContent = '> Error: Please enter a valid email address.';
        tw.parentElement.insertBefore(errDiv, document.getElementById('terminal-form'));
        return;
    }

    var btn = document.getElementById('terminal-submit');
    btn.classList.add('is-loading');
    btn.querySelector('.tsub-text').style.display = 'none';
    btn.querySelector('.tsub-loading').style.display = 'inline';

    var payload = {
        name: name,
        business: business,
        industry: industry,
        phone: phone,
        email: email,
        timestamp: new Date().toISOString(),
        source: 'portfolio_terminal_demo'
    };

    // Use the correct n8n webhook URL
    var webhookUrl = 'https://n8n-production-7a00b.up.railway.app/webhook/rynex-demo';
    
    console.log('Sending to n8n webhook:', webhookUrl);
    console.log('Payload:', payload);

    fetch(webhookUrl, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'User-Agent': 'Xenatrix-AI-Portfolio/1.0'
        },
        body: JSON.stringify(payload)
    })
        .then(function (res) {
            console.log('Response status:', res.status);
            if (!res.ok) {
                throw new Error('HTTP ' + res.status + ': ' + res.statusText);
            }
            return res.json().catch(function () { 
                console.log('Response received but no JSON body');
                return { success: true }; 
            });
        })
        .then(function (data) {
            console.log('Success response:', data);
            showTerminalSuccess();
        })
        .catch(function (error) {
            console.error('Webhook error:', error);
            showTerminalError(error.message);
        });
}

function showTerminalSuccess() {
    var form = document.getElementById('terminal-form');
    var success = document.getElementById('terminal-success');
    form.style.display = 'none';
    success.style.display = 'block';
    success.innerHTML = '';

    var lines = [
        '> Workflow triggered \u2713',
        '> AI analysing your business...',
        '> WhatsApp message queued \u2713',
        '> Google Sheets logged \u2713',
        '> Pipeline complete.',
        '',
        '> Check your WhatsApp now.',
        '> Automation is already working.'
    ];

    lines.forEach(function (line, i) {
        setTimeout(function () {
            var div = document.createElement('div');
            div.textContent = line;
            success.appendChild(div);

            // After all lines, show checkmark
            if (i === lines.length - 1) {
                setTimeout(function () {
                    var check = document.createElement('div');
                    check.className = 'ts-check';
                    check.innerHTML = '<i class="fa-solid fa-circle-check"></i>';
                    success.appendChild(check);

                    var msg = document.createElement('div');
                    msg.className = 'ts-message';
                    msg.textContent = 'This is automation.';
                    success.appendChild(msg);

                    var sub = document.createElement('div');
                    sub.className = 'ts-sub';
                    sub.innerHTML = "You didn\u2019t wait for a human.<br>You didn\u2019t send an email.<br>The system handled it.";
                    success.appendChild(sub);
                }, 400);

                // Auto-close after 6s
                setTimeout(closeTerminalDemo, 6000);
            }
        }, i * 300);
    });
}

function showTerminalError(errorMessage) {
    var btn = document.getElementById('terminal-submit');
    btn.classList.remove('is-loading');
    btn.querySelector('.tsub-text').style.display = '';
    btn.querySelector('.tsub-loading').style.display = 'none';

    var tw = document.getElementById('terminal-typewriter');
    var errDiv = document.createElement('div');
    errDiv.style.color = '#ff5f57';
    errDiv.style.marginTop = '12px';
    errDiv.textContent = '> Error: ' + (errorMessage || 'Connection failed. Try again.');
    tw.parentElement.insertBefore(errDiv, document.getElementById('terminal-form'));
}

// ESC key closes
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeTerminalDemo();
});

// Final refresh
setTimeout(() => {
    if (window.ScrollTrigger) ScrollTrigger.refresh();
}, 1500);

// EMERGENCY FAILSAFE: If something went wrong and sections are still hidden, reveal them
setTimeout(() => {
    const hiddenElements = document.querySelectorAll('.reveal-up, .bento-reveal, .stat-item');
    hiddenElements.forEach(el => {
        if (window.getComputedStyle(el).opacity === '0') {
            el.style.opacity = '1';
            el.style.transform = 'none';
        }
    });
}, 4000);

/* ── PRICING MODAL DATA ── */
const pricingData = {
    automation: {
        icon: 'fa-robot',
        color: '#0FA4AF',
        title: 'Automation & AI Systems',
        sub: 'n8n workflows · AI voice bots · API integrations · Lead pipelines',
        note: '<strong>Prices vary</strong> based on number of nodes, integrations, and complexity. All projects include documentation and a walkthrough session.',
        tiers: [
            {
                name: 'Basic',
                price: '₹5,000 – ₹10,000',
                desc: 'Simple, focused automation for one process',
                features: ['Up to 20 n8n nodes', 'WhatsApp / Email auto-reply', '1 API integration', 'Basic workflow docs', '15 days support']
            },
            {
                name: 'Standard',
                price: '₹10,000 – ₹25,000',
                desc: 'Multi-step business workflow with integrations',
                features: ['Up to 100 nodes', 'CRM / Lead system', '3–5 API integrations', 'Admin dashboard', 'Google Sheets logging', '30 days support'],
                recommended: true
            },
            {
                name: 'Advanced',
                price: '₹25,000 – ₹60,000+',
                desc: 'Full enterprise-level system like restaurant OS',
                features: ['200+ nodes', 'AI voice bot (Exotel/Milis)', 'Multi-channel automation', 'Custom dashboard', 'Staff/role management', '60 days support']
            }
        ]
    },
    webapps: {
        icon: 'fa-laptop-code',
        color: '#8b5cf6',
        title: 'Custom Web Applications',
        sub: 'Admin panels · Dashboards · Portals · Management systems',
        note: '<strong>Final price</strong> depends on number of modules, user roles, and integrations required. Laravel / Django / Node.js stack.',
        tiers: [
            {
                name: 'Basic',
                price: '₹10,000 – ₹20,000',
                desc: 'Simple admin panel with core features',
                features: ['Single module', 'CRUD operations', 'Basic auth', 'Responsive UI', '15 days support']
            },
            {
                name: 'Standard',
                price: '₹20,000 – ₹40,000',
                desc: 'Full dashboard with multiple modules',
                features: ['Multi-module system', 'Role-based access', 'Reports & exports', 'Charts & analytics', 'API ready', '30 days support'],
                recommended: true
            },
            {
                name: 'Advanced',
                price: '₹40,000 – ₹80,000+',
                desc: 'Complex multi-user portal at scale',
                features: ['Unlimited modules', 'Multi-tenant support', 'Advanced analytics', 'Third-party integrations', 'Scalable architecture', '60 days support']
            }
        ]
    },
    websites: {
        icon: 'fa-globe',
        color: '#f59e0b',
        title: 'Websites & ECommerce',
        sub: 'Business sites · Landing pages · WordPress · PrestaShop · ECommerce',
        note: '<strong>Delivery:</strong> 5–10 days for basic websites, 2–4 weeks for ECommerce stores. All sites are mobile-responsive and SEO-ready.',
        tiers: [
            {
                name: 'Basic',
                price: '₹5,000 – ₹12,000',
                desc: 'Clean, fast business website',
                features: ['3–5 pages', 'WordPress / HTML', 'Mobile responsive', 'Contact form', 'Basic SEO', '15 days support']
            },
            {
                name: 'Standard',
                price: '₹12,000 – ₹25,000',
                desc: 'Professional business or portfolio site',
                features: ['Up to 10 pages', 'Blog / Gallery', 'Custom design', 'SEO optimized', 'Speed optimized', '30 days support'],
                recommended: true
            },
            {
                name: 'ECommerce',
                price: '₹20,000 – ₹50,000',
                desc: 'Full online store with products & payments',
                features: ['PrestaShop / WooCommerce', 'Product catalogue', 'Payment gateway', 'Order management', 'Inventory tracking', '60 days support']
            }
        ]
    },
    branding: {
        icon: 'fa-palette',
        color: '#ec4899',
        title: 'Branding & Design',
        sub: 'Logos · Brand kits · Social media creatives · Posters',
        note: 'Branding is delivered as source files (Canva / PNG / PDF). Turnaround: 1–3 days for basic, up to 1 week for full kits.',
        tiers: [
            {
                name: 'Basic',
                price: '₹500 – ₹2,000',
                desc: 'Single design piece',
                features: ['Logo or poster or banner', '2 revision rounds', 'PNG / PDF delivery', 'Quick turnaround']
            },
            {
                name: 'Standard',
                price: '₹2,000 – ₹5,000',
                desc: 'Logo + brand identity package',
                features: ['Logo design', 'Color palette', 'Font selection', '5 social templates', 'Brand guidelines doc'],
                recommended: true
            },
            {
                name: 'Premium',
                price: '₹8,000 – ₹15,000',
                desc: 'Full branding + design system',
                features: ['Complete brand identity', '20+ social templates', 'Business card design', 'Letterhead', 'Unlimited revisions']
            }
        ]
    }
};

/* ── PRICING LOGIC ── */

// 1. TYPEWRITER EFFECT
function initTypewriter() {
    const triggers = document.querySelectorAll('.typewriter-trigger');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const text = el.getAttribute('data-text');
                if (text && !el.classList.contains('typing-done')) {
                    typeText(el, text);
                    el.classList.add('typing-done');
                }
            }
        });
    }, { threshold: 0.5 });

    triggers.forEach(t => observer.observe(t));
}

function typeText(el, text) {
    let i = 0;
    el.textContent = '';
    const interval = setInterval(() => {
        if (i < text.length) {
            el.textContent += text.charAt(i);
            i++;
        } else {
            clearInterval(interval);
        }
    }, 40);
}
// 2. DYNAMIC ORBITAL PROCESS (USER REQUEST)
function initProcessTimeline() {
    const STEPS = [
        { id: 1, color: '#0FA4AF', icon: 'fa-magnifying-glass', label: 'Discover', num: '01', title: 'See & Connect', desc: 'You find my work through referrals or social media. We align on vision, goals, and fit — before scope or pricing is even discussed.' },
        { id: 2, color: '#8b5cf6', icon: 'fa-phone-volume', label: 'Strategy', num: '02', title: 'Strategy Call', desc: 'A deep-dive into your business pain points, workflows, and automation goals. You walk away with a crystal-clear picture of what gets built.' },
        { id: 3, color: '#06b6d4', icon: 'fa-pen-ruler', label: 'Blueprint', num: '03', title: 'Architecture', desc: 'I design data flows, integration points, and system blueprints before writing a single line of code. No surprises later.' },
        { id: 4, color: '#f59e0b', icon: 'fa-laptop-code', label: 'Build', num: '04', title: 'Build & Code', desc: 'Agile sprints with live demo links after every phase. You see progress constantly and we adapt together in real time.' },
        { id: 5, color: '#22c55e', icon: 'fa-rocket', label: 'Launch', num: '05', title: 'Deploy & Live', desc: 'Full testing, screen-share handover, walkthrough video, and docs. Your system goes live — and I stay on WhatsApp for 30 days.' }
    ];

    const canvas = document.getElementById('orbitCanvas');
    const svg = document.getElementById('orbitSvg');
    const innerCircle = document.getElementById('innerCircle');
    const panel = document.getElementById('detailPanel');
    const hint = document.getElementById('processHint');

    if (!canvas || !svg || !innerCircle) return;

    let SIZE, NODE_R, ORBIT_R;
    let nodeEls = [];
    let autoScrollInterval = null;
    let autoScrollIdx = 0;

    function hexAlpha(hex, a) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r},${g},${b},${a})`;
    }

    function calcSizes() {
        SIZE = canvas.offsetWidth;
        NODE_R = Math.round(SIZE * 0.12); 
        ORBIT_R = Math.round(SIZE * 0.36); 
    }

    function polarToXY(angleDeg, r) {
        const rad = angleDeg * Math.PI / 180;
        return {
            x: SIZE / 2 + r * Math.cos(rad),
            y: SIZE / 2 + r * Math.sin(rad)
        };
    }

    function buildNodes() {
        nodeEls.forEach(el => el.remove());
        nodeEls = [];
        STEPS.forEach(s => {
            const el = document.createElement('div');
            el.className = 'step-node';
            el.id = 'sn' + s.id;
            el.style.cssText = `
                width:${2 * NODE_R}px; height:${2 * NODE_R}px;
                left:0; top:0;
                background:${hexAlpha(s.color, 0.12)};
                border-color:${hexAlpha(s.color, 0.5)};
                color:${s.color};
            `;
            el.innerHTML = `
                <span class="sn-num" style="font-size:${Math.round(NODE_R * 0.3)}px">${s.num}</span>
                <i class="fa-solid ${s.icon} sn-icon" style="font-size:${Math.round(NODE_R * 0.55)}px"></i>
                <span class="sn-label" style="font-size:${Math.round(NODE_R * 0.22)}px">${s.label}</span>
            `;
            el.addEventListener('click', () => selectStep(s.id));
            canvas.appendChild(el);
            nodeEls.push(el);
        });
        placeNodes();
        buildDots();
    }

    function placeNodes() {
        STEPS.forEach((s, i) => {
            const el = document.getElementById('sn' + s.id);
            if (!el) return;
            const angle = -90 + i * 72;
            const { x, y } = polarToXY(angle, ORBIT_R);
            el.style.left = (x - NODE_R) + 'px';
            el.style.top = (y - NODE_R) + 'px';
        });
    }

    function drawConnectors() {
        svg.innerHTML = '';
        // Sync viewBox with actual size for perfect centering
        svg.setAttribute('viewBox', `0 0 ${SIZE} ${SIZE}`);
        
        const cx = SIZE / 2, cy = SIZE / 2;
        STEPS.forEach((s, i) => {
            const angle = -90 + i * 72;
            // Keeping line endpoint at the edge of the node for a clean look
            const lineEndDist = ORBIT_R - (NODE_R * 0.9); 
            const { x: toX, y: toY } = polarToXY(angle, lineEndDist);

            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('d', `M${cx} ${cy} L${toX} ${toY}`);
            path.setAttribute('class', 'svg-line visible');
            path.setAttribute('id', 'line-' + s.id);

            // Arrow markers removed for a "flawless" cleaner look as requested
            svg.appendChild(path);
        });
    }

    function buildDots() {
        const container = document.getElementById('dpDots');
        if (!container) return;
        container.innerHTML = '';
        STEPS.forEach(s => {
            const d = document.createElement('div');
            d.className = 'dp-dot';
            d.addEventListener('click', () => selectStep(s.id));
            container.appendChild(d);
        });
    }

    function selectStep(id) {
        autoScrollIdx = id - 1;
        updateUI();
    }

    function updateUI() {
        const s = STEPS[autoScrollIdx];
        
        // Highlight node
        document.querySelectorAll('.step-node').forEach(n => n.classList.remove('active-node'));
        const activeNode = document.getElementById('sn' + s.id);
        if (activeNode) activeNode.classList.add('active-node');

        // Highlight line
        document.querySelectorAll('.svg-line').forEach(l => l.classList.remove('active'));
        const activeLine = document.getElementById('line-' + s.id);
        if (activeLine) activeLine.classList.add('active');

        // Update Panel
        document.getElementById('dpNum').textContent = s.num;
        document.getElementById('dpNum').style.color = s.color;
        document.getElementById('dpTitle').textContent = s.title;
        document.getElementById('dpTitle').style.color = s.color;
        document.getElementById('dpDesc').textContent = s.desc;

        // Dot highlight
        document.querySelectorAll('.dp-dot').forEach((d, i) => {
            d.classList.toggle('active', i === autoScrollIdx);
        });

        panel.classList.add('show');
    }

    function startAutoScroll() {
        if (autoScrollInterval) clearInterval(autoScrollInterval);
        autoScrollInterval = setInterval(() => {
            autoScrollIdx = (autoScrollIdx + 1) % STEPS.length;
            updateUI();
        }, 1200); // Slightly slower for better readability
    }

    // Hover to pause logic
    panel.addEventListener('mouseenter', () => {
        if (autoScrollInterval) clearInterval(autoScrollInterval);
    });

    panel.addEventListener('mouseleave', () => {
        startAutoScroll();
    });

    innerCircle.addEventListener('click', () => {
        innerCircle.style.display = 'none';
        document.querySelectorAll('.ring').forEach(r => r.classList.add('outer-visible'));
        document.querySelectorAll('.step-node').forEach(n => n.classList.add('visible'));
        if (hint) hint.style.display = 'none';
        
        drawConnectors();
        startAutoScroll();
        updateUI();
    });

    calcSizes();
    buildNodes();
    
    window.addEventListener('resize', () => {
        calcSizes();
        placeNodes();
        if (!innerCircle.style.display || innerCircle.style.display !== 'none') {
            // center circle is still visible
        } else {
            drawConnectors();
        }
    });
}

// 3. CURRENCY SWITCHER
const currToggle = document.getElementById('curr-toggle');
const prAmounts = document.querySelectorAll('.pr-amount');

function updateCurrency() {
    if (!currToggle) return;
    const isUSD = currToggle.checked;
    const rate = 0.012 * 2.5; // Conversion * Multiplier

    prAmounts.forEach(el => {
        const base = parseInt(el.getAttribute('data-base'));
        if (isUSD) {
            const val = Math.round(base * rate);
            el.textContent = `$${(val - 1).toLocaleString()}`; // Using the $X99 style
        } else {
            const val = base.toLocaleString();
            el.textContent = `₹${val}`;
        }
    });
}

if (currToggle) currToggle.addEventListener('change', updateCurrency);

// 3. CENTRIC SPLIT ANIMATION (GSAP)
function initPricingAnimations() {
    if (!window.gsap || !window.ScrollTrigger) return;

    const cards = document.querySelectorAll('.reveal-center-item');
    const grid = document.querySelector('.pricing-grid');
    if (!cards.length || !grid) return;

    window.ScrollTrigger.create({
        trigger: grid,
        start: "top 85%",
        once: true,
        onEnter: () => {
            const gridRect = grid.getBoundingClientRect();
            const gridCenterX = gridRect.left + gridRect.width / 2;
            const gridCenterY = gridRect.top + gridRect.height / 2;

            cards.forEach((card, index) => {
                const cardRect = card.getBoundingClientRect();
                const cardCenterX = cardRect.left + cardRect.width / 2;
                const cardCenterY = cardRect.top + cardRect.height / 2;

                // Offset from center
                const dx = gridCenterX - cardCenterX;
                const dy = gridCenterY - cardCenterY;

                gsap.fromTo(card, 
                    { 
                        x: dx, 
                        y: dy, 
                        opacity: 0, 
                        scale: 0.2,
                        filter: "blur(10px)"
                    },
                    {
                        x: 0,
                        y: 0,
                        opacity: 1,
                        scale: 1,
                        filter: "blur(0px)",
                        duration: 1.4,
                        delay: index * 0.1,
                        ease: "expo.out"
                    }
                );
            });
        }
    });
}

// 4. MODAL LOGIC
function openPricingModal(key) {
    const d = pricingData[key];
    if (!d) return;

    const modal = document.getElementById('pr-modal');
    const overlay = document.getElementById('pr-overlay');
    const inner = document.getElementById('pr-modal-inner');

    const isUSD = document.getElementById('curr-toggle')?.checked;
    const rate = 0.012 * 2.5;

    const tiersHTML = d.tiers.map((t, i) => {
        let displayPrice = t.price;
        if (isUSD) {
            displayPrice = t.price.replace(/[0-9,]+/g, (match) => {
                const num = parseInt(match.replace(/,/g, ''));
                const converted = Math.round(num * rate);
                return (converted - 1).toLocaleString(); // Professional rounding
            }).replace('₹', '$');
        }

        return `
            <div class="pm-tier ${t.recommended ? 'recommended' : ''}" style="--tier-color:${d.color}">
                ${t.recommended ? `<div class="pm-tier-badge" style="background:${d.color}">Best Value</div>` : ''}
                <p class="pm-tier-name" style="color:${d.color}">${t.name}</p>
                <p class="pm-tier-price" style="color:${d.color}">${displayPrice}</p>
                <p class="pm-tier-desc">${t.desc}</p>
                <ul class="pm-tier-features" style="--tier-color:${d.color}">
                    ${t.features.map(f => `<li>${f}</li>`).join('')}
                </ul>
            </div>
        `;
    }).join('');

    inner.innerHTML = `
        <div class="pm-header">
            <div class="pm-icon" style="color:${d.color};background:color-mix(in srgb, ${d.color} 12%, transparent);border:1px solid color-mix(in srgb, ${d.color} 25%, transparent)">
                <i class="fa-solid ${d.icon}"></i>
            </div>
            <div>
                <p class="pm-title">${d.title}</p>
                <p class="pm-sub">${d.sub}</p>
            </div>
        </div>
        <div class="pm-tiers">${tiersHTML}</div>
        <div class="pm-note">ℹ️ ${d.note}</div>
        <div class="pm-cta">
            <a href="#contact" class="pm-btn-primary" onclick="closePricingModal()">Get a Quote for This →</a>
            <a href="https://wa.me/917010233809" target="_blank" class="pm-btn-secondary"><i class="fa-brands fa-whatsapp"></i> Ask on WhatsApp</a>
        </div>
    `;

    overlay.classList.add('active');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Initial calls
initTypewriter();
initPricingAnimations();
initProcessTimeline();

// ── FAQ ACCORDION LOGIC ──
const faqItems = document.querySelectorAll('.faq-item');
let faqTypeIntervals = {};

faqItems.forEach((item, index) => {
    const question = item.querySelector('.faq-q');
    const answerText = item.querySelector('.faq-answer-text');
    const fullText = answerText.getAttribute('data-text');

    question.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        
        // Close all other items and stop their typing
        faqItems.forEach((i, idx) => {
            i.classList.remove('open');
            if (faqTypeIntervals[idx]) {
                clearInterval(faqTypeIntervals[idx]);
                faqTypeIntervals[idx] = null;
            }
        });
        
        // Toggle current item
        if (!isOpen) {
            item.classList.add('open');
            
            // Start Typewriter
            answerText.innerHTML = '';
            let charIndex = 0;
            
            faqTypeIntervals[index] = setInterval(() => {
                if (charIndex < fullText.length) {
                    answerText.innerHTML += fullText.charAt(charIndex);
                    charIndex++;
                } else {
                    clearInterval(faqTypeIntervals[index]);
                    faqTypeIntervals[index] = null;
                }
            }, 15); // Adjust speed here (lower = faster)
        }
    });
});

// Re-add trigger listeners
document.querySelectorAll('.pr-trigger').forEach(btn => {
    btn.addEventListener('click', () => {
        const key = btn.getAttribute('data-modal');
        openPricingModal(key);
    });
});

/* ── MODAL CLOSE ── */
function closePricingModal() {
    const modal = document.getElementById('pr-modal');
    const overlay = document.getElementById('pr-overlay');
    if (modal) modal.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';
}

const modalClose = document.getElementById('pr-modal-close');
const modalOverlay = document.getElementById('pr-overlay');
if (modalClose) modalClose.addEventListener('click', closePricingModal);
if (modalOverlay) modalOverlay.addEventListener('click', closePricingModal);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closePricingModal(); });

// ── SCROLL TO TOP ──
(function () {
    const btn = document.getElementById('scrollTopBtn');
    if (!btn) return;

    window.addEventListener('scroll', () => {
        btn.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });

    btn.addEventListener('click', () => {
        // Use Lenis if available for smooth scroll, else native
        if (typeof lenis !== 'undefined') {
            lenis.scrollTo(0, { duration: 1.2 });
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });
})();

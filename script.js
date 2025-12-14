// === KONFIGURASI EMAILJS ===
(function() {
    emailjs.init("viufed3JmJV21orHS");
})();

// === FUNGSI UTAMA ===
document.addEventListener('DOMContentLoaded', function() {
    // Inisialisasi elemen
    const loader = document.getElementById('loader');
    const backToTop = document.getElementById('backToTop');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');
    const themeButtons = document.querySelectorAll('.theme-btn');
    const contactForm = document.getElementById('contactForm');
    const formFeedback = document.getElementById('formFeedback');
    const sections = document.querySelectorAll('.section');
    const navItems = document.querySelectorAll('.nav-link');

    // === LOADER ===
    setTimeout(() => {
        if (loader) {
            loader.classList.add('hidden');
        }
    }, 1000);

    // === BACK TO TOP ===
    function handleBackToTop() {
        if (window.scrollY > 300) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    }

    window.addEventListener('scroll', handleBackToTop);

    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // === MOBILE MENU ===
    function toggleMobileMenu() {
        mobileMenuBtn.classList.toggle('active');
        navLinks.classList.toggle('active');
    }

    function closeMobileMenu() {
        mobileMenuBtn.classList.remove('active');
        navLinks.classList.remove('active');
    }

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    }

    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    // === SMOOTH SCROLL ===
    function handleSmoothScroll(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const headerHeight = document.querySelector('header').offsetHeight;
            const targetPosition = targetElement.offsetTop - headerHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', handleSmoothScroll);
    });

    // === THEME SWITCHER ===
    function switchTheme(e) {
        const theme = this.getAttribute('data-theme');
        document.body.setAttribute('data-theme', theme);

        // Update active button
        themeButtons.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');

        // Save to localStorage
        localStorage.setItem('theme', theme);
    }

    themeButtons.forEach(button => {
        button.addEventListener('click', switchTheme);
    });

    // Load saved theme
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.body.setAttribute('data-theme', savedTheme);
    themeButtons.forEach(btn => {
        if (btn.getAttribute('data-theme') === savedTheme) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // === SCROLL SPY ===
    function updateActiveNav() {
        let current = '';
        const scrollPos = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${current}`) {
                item.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav);

    // === SCROLL ANIMATIONS ===
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
            }
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));

    // === CONTACT FORM ===
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;

            // Disable button and show loading
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mengirim...';

            // Clear previous feedback
            if (formFeedback) {
                formFeedback.style.display = 'none';
                formFeedback.className = '';
            }

            // Prepare template parameters
            const templateParams = {
                from_name: this.name.value,
                from_email: this.email.value,
                subject: this.subject.value,
                message: this.message.value,
                reply_to: this.email.value
            };

            // Send email using EmailJS
            emailjs.send('service_sgfwfig', 'template_default', templateParams)
                .then(() => {
                    // Success
                    if (formFeedback) {
                        formFeedback.innerHTML = `
                            <i class="fas fa-check-circle"></i> 
                            <strong>Sukses!</strong> Pesan Anda telah dikirim. Saya akan membalas dalam waktu 24 jam.
                        `;
                        formFeedback.className = 'success';
                        formFeedback.style.display = 'block';
                    }

                    // Reset form
                    this.reset();
                })
                .catch((error) => {
                    console.error('EmailJS Error:', error);

                    // Error
                    if (formFeedback) {
                        formFeedback.innerHTML = `
                            <i class="fas fa-exclamation-circle"></i> 
                            <strong>Gagal!</strong> Terjadi kesalahan. Silakan hubungi langsung via Telegram/WhatsApp.
                        `;
                        formFeedback.className = 'error';
                        formFeedback.style.display = 'block';
                    }
                })
                .finally(() => {
                    // Re-enable button
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalText;

                    // Auto-hide feedback after 10 seconds
                    if (formFeedback) {
                        setTimeout(() => {
                            formFeedback.style.display = 'none';
                        }, 10000);
                    }
                });
        });
    }

    // === FLOATING ELEMENTS INTERACTIVITY ===
    document.querySelectorAll('.floating-element').forEach(element => {
        element.addEventListener('mouseenter', () => {
            element.style.transform = 'scale(1.2)';
        });

        element.addEventListener('mouseleave', () => {
            element.style.transform = '';
        });
    });

    // === INITIALIZE ===
    updateActiveNav(); // Set initial active nav
    handleBackToTop(); // Initial check for back to top button
});

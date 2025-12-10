// Funcionalidades JavaScript Optimizadas para Revolución Box

// Debounce function para optimizar eventos
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func(...args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func(...args);
    };
}

// Throttle function para scroll events
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Cache de elementos DOM
const DOMCache = {
    navLinks: null,
    sections: null,
    heroSection: null,
    scrollBtn: null,
    get(selector) {
        return document.querySelector(selector);
    },
    getAll(selector) {
        return document.querySelectorAll(selector);
    },
    init() {
        this.navLinks = this.getAll('.nav-link');
        this.sections = this.getAll('section[id]');
        this.heroSection = this.get('.hero-section');
        this.scrollBtn = this.get('.scroll-btn');
    }
};

// Inicialización optimizada
document.addEventListener('DOMContentLoaded', function() {
    console.log('Revolución Box - Página optimizada cargada');
    
    // Inicializar cache
    DOMCache.init();
    
    // Cargar funcionalidades
    initNavigation();
    initButtons();
    initScrollEffects();
    initGalleryLazyLoad();
    initScrollAnimations();
    initScrollIndicatorFade();
    
    // Preload de imágenes críticas
    preloadCriticalImages();
});

// Navegación suave optimizada
function initNavigation() {
    const { navLinks } = DOMCache;
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href') || '';

        // SOLO interceptar links que apuntan a una sección (#...)
        if (href.startsWith('#')) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                [...navLinks].forEach(l => l.classList.remove('active'));
                this.classList.add('active');
                
                const targetId = href.substring(1);
                scrollToSection(targetId);
            });
        }
        // Si NO empieza con # (por ej. sobre-nosotros.html), dejamos que el navegador abra la página normal
    });
    
    window.addEventListener('scroll', debounce(updateActiveNavLink, 10));
}


// Configurar botones optimizados
function initButtons() {
    // Delegación de eventos para mejor performance
    document.addEventListener('click', function(e) {
        // Botones de planes
        if (e.target.closest('.price-btn')) {
            const card = e.target.closest('.price-card');
            const planTitle = card.querySelector('.price-title').textContent;
            showPlanModal(planTitle);
        }
        
        // Botón hero principal
        if (e.target.closest('.hero-btn.btn-primary')) {
            scrollToSection('precios');
        }
        
        // Botón newsletter
        if (e.target.closest('.newsletter-btn')) {
            const emailInput = document.querySelector('.newsletter-input');
            subscribeNewsletter(emailInput.value);
        }
    });
}

// Efectos de scroll optimizados
function initScrollEffects() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                // Usar requestAnimationFrame para animaciones suaves
                requestAnimationFrame(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                });
            }
        });
    }, observerOptions);
    
    const revealElements = document.querySelectorAll('.service-card, .price-card, .gallery-item');
    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Lazy loading para galería optimizado
function initGalleryLazyLoad() {
    const galleryImages = document.querySelectorAll('.gallery-img');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                const src = img.getAttribute('data-src') || img.src;
                
                // Cargar imagen
                img.src = src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    }, {
        rootMargin: '50px 0px',
        threshold: 0.1
    });
    
    galleryImages.forEach(img => {
        if (img.complete) {
            img.classList.remove('lazy');
        } else {
            img.classList.add('lazy');
            // Mover src a data-src para lazy loading
            if (!img.getAttribute('data-src')) {
                img.setAttribute('data-src', img.src);
                img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PC9zdmc+';
            }
            imageObserver.observe(img);
        }
    });
}

// Scroll to section optimizado
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const offsetTop = section.offsetTop - 80; // Ajuste para navbar
        
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
        
        // Usar history.replaceState en lugar de pushState para mejor UX
        history.replaceState(null, null, `#${sectionId}`);
    }
}

// Actualizar navegación activa optimizada
function updateActiveNavLink() {
    const { navLinks, sections } = DOMCache;
    const scrollPosition = window.scrollY + 100;
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });
    
    // Batch updates para mejor performance
    requestAnimationFrame(() => {
        navLinks.forEach(link => {
            const isActive = link.getAttribute('href') === `#${currentSection}`;
            link.classList.toggle('active', isActive);
        });
    });
}

// Modal optimizado con singleton pattern
const ModalManager = {
    currentModal: null,
    
    showPlanModal(planTitle) {
        // Cerrar modal existente
        if (this.currentModal) {
            this.closeModal();
        }
        
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = this.getModalHTML(planTitle);
        
        document.body.appendChild(modal);
        this.currentModal = modal;
        
        this.bindModalEvents(modal);
    },
    
    getModalHTML(planTitle) {
        return `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>¡Excelente Elección!</h3>
                    <button class="modal-close" aria-label="Cerrar modal">&times;</button>
                </div>
                <div class="modal-body">
                    <p>Has seleccionado el plan: <strong>${this.escapeHTML(planTitle)}</strong></p>
                    <p>Te contactaremos en las próximas 24 horas para completar tu inscripción.</p>
                    <div class="modal-actions">
                        <button class="btn-primary confirm-btn">Confirmar</button>
                        <button class="btn-secondary cancel-btn">Cancelar</button>
                    </div>
                </div>
            </div>
        `;
    },
    
    bindModalEvents(modal) {
        const closeBtn = modal.querySelector('.modal-close');
        const cancelBtn = modal.querySelector('.cancel-btn');
        const confirmBtn = modal.querySelector('.confirm-btn');
        
        const closeModal = () => this.closeModal();
        
        closeBtn.addEventListener('click', closeModal);
        cancelBtn.addEventListener('click', closeModal);
        confirmBtn.addEventListener('click', () => {
            this.showNotification('¡Gracias por tu confirmación! Te contactaremos pronto.', 'success');
            closeModal();
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
        
        // Cerrar con ESC
        this.escHandler = (e) => {
            if (e.key === 'Escape') closeModal();
        };
        document.addEventListener('keydown', this.escHandler);
    },
    
    closeModal() {
        if (this.currentModal) {
            document.removeEventListener('keydown', this.escHandler);
            this.currentModal.remove();
            this.currentModal = null;
        }
    },
    
    escapeHTML(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }
};

function showPlanModal(planTitle) {
    ModalManager.showPlanModal(planTitle);
}

// Newsletter optimizado
function subscribeNewsletter(email) {
    if (!email || !isValidEmail(email)) {
        showNotification('Por favor, ingresa un email válido.', 'error');
        return;
    }
    
    // Simular API call
    simulateAPICall('/api/newsletter', { email })
        .then(() => {
            showNotification('¡Gracias por suscribirte! Te hemos enviado un email de confirmación.', 'success');
            document.querySelector('.newsletter-input').value = '';
        })
        .catch(() => {
            showNotification('Error al suscribirse. Por favor, intenta nuevamente.', 'error');
        });
}

// Simulación de API call
function simulateAPICall(url, data) {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log('API Call:', url, data);
            resolve({ success: true });
        }, 1000);
    });
}

// Validación de email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Sistema de notificaciones optimizado
const NotificationSystem = {
    container: null,
    
    init() {
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.className = 'notifications-container';
            document.body.appendChild(this.container);
        }
    },
    
    show(message, type = 'info') {
        this.init();
        
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.setAttribute('role', 'alert');
        notification.setAttribute('aria-live', 'polite');
        notification.textContent = message;
        
        this.container.appendChild(notification);
        
        // Auto-remove
        setTimeout(() => this.remove(notification), 5000);
        
        return notification;
    },
    
    remove(notification) {
        if (notification.parentNode) {
            notification.style.animation = 'slideInRight 0.3s ease reverse';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }
    }
};

function showNotification(message, type = 'info') {
    return NotificationSystem.show(message, type);
}

// Animaciones de scroll optimizadas
function initScrollAnimations() {
    const sections = document.querySelectorAll('.services-section, .pricing-section, .gallery-section, .contact-section');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '-50px 0px -50px 0px'
    });
    
    sections.forEach(section => {
        observer.observe(section);
    });
}

// Scroll indicator optimizado
function initScrollIndicatorFade() {
    const { scrollBtn, heroSection } = DOMCache;
    
    if (scrollBtn && heroSection) {
        const fadeHandler = throttle(() => {
            const heroBottom = heroSection.getBoundingClientRect().bottom;
            const windowHeight = window.innerHeight;
            
            const shouldShow = heroBottom > windowHeight * 0.3;
            scrollBtn.style.opacity = shouldShow ? '0.8' : '0';
            scrollBtn.style.transform = shouldShow ? 'scale(1)' : 'scale(0.8)';
            scrollBtn.style.pointerEvents = shouldShow ? 'auto' : 'none';
        }, 100);
        
        window.addEventListener('scroll', fadeHandler);
    }
}

// Preload de imágenes críticas
function preloadCriticalImages() {
    const criticalImages = [
        'icons/icono.png',
        'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'
    ];
    
    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// Performance monitoring
if ('performance' in window) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = performance.timing;
            const loadTime = perfData.loadEventEnd - perfData.navigationStart;
            console.log(`Tiempo de carga: ${loadTime}ms`);
            
            if (loadTime > 3000) {
                console.warn('⚠️  La página está cargando lentamente');
            }
        }, 0);
    });
}

// Service Worker registration (opcional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Error handling global
window.addEventListener('error', (e) => {
    console.error('Error global:', e.error);
});

// Cleanup en unload
window.addEventListener('beforeunload', () => {
    // Scroll to top para mejor UX en navegación
    window.scrollTo(0, 0);
});
// Funciones WhatsApp optimizadas
function openWhatsApp() {
    const message = "¡Hola! Me interesa saber más sobre Revolución Box y sus servicios.";
    const url = `wa.link/ffjwx6`;
    window.open(url, '_blank');
}

function openWhatsAppPlan(planName) {
    const message = `¡Hola! Estoy interesado/a en el ${planName}. ¿Podrían darme más información?`;
    const url = `   `;
    window.open(url, '_blank');
}

// Para el newsletter con WhatsApp
function subscribeNewsletterWhatsApp(email) {
    const phoneNumber = "5492612094560";
    const message = `¡Hola! Quiero suscribirme al newsletter con el email: ${email}`;
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
}
function toggleNav() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('open');
}

// DOM Elements
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const budgetForm = document.getElementById('budgetForm');
const calculateBudgetBtn = document.getElementById('calculateBudget');
const budgetResult = document.getElementById('budgetResult');
const sendWhatsAppBtn = document.getElementById('sendWhatsApp');
const contactForm = document.getElementById('contactForm');
const faqItems = document.querySelectorAll('.faq-item');
const portfolioFilters = document.querySelectorAll('.filter-btn');
const portfolioItems = document.querySelectorAll('.portfolio-item');

// Mobile Navigation
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Budget Calculator
const servicesPrices = {
    wedding: { base: 2500, name: 'Casamento' },
    maternity: { base: 450, name: 'Gestante' },
    family: { base: 350, name: 'Família' },
    birthday: { base: 600, name: 'Aniversário' },
    corporate: { base: 1000, name: 'Corporativo' },
    graduation: { base: 800, name: 'Formatura' }
};

const locationPrices = {
    local: { price: 0, name: 'Fortaleza (capital)' },
    metropolitan: { price: 100, name: 'Região metropolitana de Fortaleza' },
    interior: { price: 200, name: 'Outras cidades do Ceará' }
};

calculateBudgetBtn.addEventListener('click', () => {
    const serviceType = document.getElementById('serviceType').value;
    const duration = parseInt(document.getElementById('duration').value);
    const location = document.getElementById('location').value;
    const extraPhotos = parseInt(document.getElementById('extraPhotos').value) || 0;
    const clientName = document.getElementById('clientName').value;
    const clientPhone = document.getElementById('clientPhone').value;
    const clientEmail = document.getElementById('clientEmail').value;

    // Validation
    if (!serviceType || !clientName || !clientPhone || !clientEmail) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
    }

    // Calculate price
    const service = servicesPrices[serviceType];
    const locationInfo = locationPrices[location];
    
    let totalPrice = service.base;
    
    // Duration multiplier (base price is for standard duration)
    const durationMultipliers = {
        wedding: { 8: 1, 12: 1.3 },
        maternity: { 1: 1, 2: 1.5 },
        family: { 1: 1, 2: 1.4 },
        birthday: { 3: 1, 4: 1.2, 6: 1.5 },
        corporate: { 4: 1, 6: 1.3, 8: 1.6 },
        graduation: { 4: 1, 6: 1.2, 8: 1.5 }
    };
    
    if (durationMultipliers[serviceType] && durationMultipliers[serviceType][duration]) {
        totalPrice *= durationMultipliers[serviceType][duration];
    } else {
        // Default duration pricing
        if (duration > 4) {
            totalPrice *= 1.2;
        }
        if (duration > 8) {
            totalPrice *= 1.4;
        }
    }
    
    // Add location fee
    totalPrice += locationInfo.price;
    
    // Add extra photos
    totalPrice += extraPhotos * 5;
    
    // Display result
    document.getElementById('resultService').textContent = service.name;
    document.getElementById('resultDuration').textContent = duration + ' hora' + (duration > 1 ? 's' : '');
    document.getElementById('resultLocation').textContent = locationInfo.name;
    document.getElementById('resultExtraPhotos').textContent = extraPhotos + ' foto' + (extraPhotos !== 1 ? 's' : '');
    document.getElementById('resultTotal').textContent = totalPrice.toLocaleString('pt-BR');
    
    budgetResult.style.display = 'block';
    budgetResult.scrollIntoView({ behavior: 'smooth' });
    
    // Store data for WhatsApp
    window.budgetData = {
        clientName,
        clientPhone,
        clientEmail,
        service: service.name,
        duration: duration + ' hora' + (duration > 1 ? 's' : ''),
        location: locationInfo.name,
        extraPhotos: extraPhotos,
        total: totalPrice
    };
});

// Send to WhatsApp
sendWhatsAppBtn.addEventListener('click', () => {
    if (!window.budgetData) return;
    
    const data = window.budgetData;
    const message = `Olá! Gostaria de solicitar um orçamento:

👤 Nome: ${data.clientName}
📞 Telefone: ${data.clientPhone}
📧 E-mail: ${data.clientEmail}

📸 Serviço: ${data.service}
⏰ Duração: ${data.duration}
📍 Local: ${data.location}
📷 Fotos extras: ${data.extraPhotos}

💰 Total: R$ ${data.total.toLocaleString('pt-BR')}

Aguardo seu contato!`;
    
    const whatsappUrl = `https://wa.me/5511999999999?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
});

// Contact Form
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('contactName').value;
    const email = document.getElementById('contactEmail').value;
    const phone = document.getElementById('contactPhone').value;
    const service = document.getElementById('contactService').value;
    const message = document.getElementById('contactMessage').value;
    
    const whatsappMessage = `Olá! Entrei em contato através do site:

👤 Nome: ${name}
📧 E-mail: ${email}
📞 Telefone: ${phone}
📸 Serviço: ${service || 'Não especificado'}

💬 Mensagem: ${message}`;
    
    const whatsappUrl = `https://wa.me/5511999999999?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(whatsappUrl, '_blank');
    
    // Reset form
    contactForm.reset();
    alert('Mensagem enviada! Você será redirecionado para o WhatsApp.');
});

// FAQ Accordion
faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        // Close all FAQ items
        faqItems.forEach(faqItem => {
            faqItem.classList.remove('active');
        });
        
        // Open clicked item if it wasn't active
        if (!isActive) {
            item.classList.add('active');
        }
    });
});

// Portfolio Filter
portfolioFilters.forEach(filter => {
    filter.addEventListener('click', () => {
        // Remove active class from all filters
        portfolioFilters.forEach(f => f.classList.remove('active'));
        
        // Add active class to clicked filter
        filter.classList.add('active');
        
        const filterValue = filter.getAttribute('data-filter');
        
        // Filter portfolio items
        portfolioItems.forEach(item => {
            if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                item.style.display = 'block';
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'scale(1)';
                }, 100);
            } else {
                item.style.opacity = '0';
                item.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
        });
    });
});

// Add more portfolio items dynamically
function addPortfolioItems() {
    const portfolioGrid = document.querySelector('.portfolio-grid');
    
    const portfolioData = [
        { category: 'maternity', title: 'Ensaio Gestante', location: 'Ibirapuera', image: 'assets/images/hero-image.jpg' },
        { category: 'family', title: 'Família Feliz', location: 'Vila Madalena', image: 'assets/images/about-image.jpg' },
        { category: 'wedding', title: 'Casamento dos Sonhos', location: 'Campos do Jordão', image: 'assets/images/portfolio-1.jpg' },
        { category: 'events', title: 'Aniversário 15 Anos', location: 'Moema', image: 'assets/images/hero-image.jpg' },
        { category: 'wedding', title: 'Cerimônia Íntima', location: 'Centro', image: 'assets/images/about-image.jpg' },
        { category: 'family', title: 'Retrato de Família', location: 'Brooklin', image: 'assets/images/portfolio-1.jpg' },
        { category: 'maternity', title: 'Maternidade Radiante', location: 'Jardins', image: 'assets/images/hero-image.jpg' },
        { category: 'events', title: 'Festa Corporativa', location: 'Faria Lima', image: 'assets/images/about-image.jpg' }
    ];
    
    portfolioData.forEach(item => {
        const portfolioItem = document.createElement('div');
        portfolioItem.className = 'portfolio-item';
        portfolioItem.setAttribute('data-category', item.category);
        
        portfolioItem.innerHTML = `
            <img src="${item.image}" alt="${item.title}">
            <div class="portfolio-overlay">
                <h4>${item.title}</h4>
                <p>${item.location}</p>
            </div>
        `;
        
        portfolioGrid.appendChild(portfolioItem);
    });
}

// Header scroll effect
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
        header.style.boxShadow = '0 2px 30px rgba(0, 0, 0, 0.15)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    }
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.service-card, .testimonial, .portfolio-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Form input animations
document.querySelectorAll('input, select, textarea').forEach(input => {
    input.addEventListener('focus', () => {
        input.parentElement.classList.add('focused');
    });
    
    input.addEventListener('blur', () => {
        if (!input.value) {
            input.parentElement.classList.remove('focused');
        }
    });
});

// Lazy loading for images
const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
        }
    });
});

document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    addPortfolioItems();
    
    // Add loading animation to buttons
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', function() {
            if (this.classList.contains('loading')) return;
            
            const originalText = this.textContent;
            this.innerHTML = '<span class="loading"></span> Carregando...';
            this.classList.add('loading');
            
            setTimeout(() => {
                this.textContent = originalText;
                this.classList.remove('loading');
            }, 2000);
        });
    });
    
    // Animate counters in stats
    const animateCounters = () => {
        document.querySelectorAll('.stat h3').forEach(counter => {
            const target = parseInt(counter.textContent);
            const increment = target / 100;
            let current = 0;
            
            const updateCounter = () => {
                if (current < target) {
                    current += increment;
                    counter.textContent = Math.ceil(current) + (counter.textContent.includes('+') ? '+' : '');
                    setTimeout(updateCounter, 20);
                } else {
                    counter.textContent = target + (counter.textContent.includes('+') ? '+' : '');
                }
            };
            
            updateCounter();
        });
    };
    
    // Trigger counter animation when stats section is visible
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                statsObserver.unobserve(entry.target);
            }
        });
    });
    
    const statsSection = document.querySelector('.experience-stats');
    if (statsSection) {
        statsObserver.observe(statsSection);
    }
});

// Error handling
window.addEventListener('error', (e) => {
    console.error('Erro na aplicação:', e.error);
});

// Service Worker registration (for PWA capabilities)
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

// Performance monitoring
const perfObserver = new PerformanceObserver((list) => {
    list.getEntries().forEach((entry) => {
        if (entry.entryType === 'navigation') {
            console.log('Page load time:', entry.loadEventEnd - entry.loadEventStart);
        }
    });
});

if (PerformanceObserver.supportedEntryTypes.includes('navigation')) {
    perfObserver.observe({ entryTypes: ['navigation'] });
}

// Accessibility improvements
document.addEventListener('keydown', (e) => {
    // ESC key closes mobile menu
    if (e.key === 'Escape') {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
    
    // Enter key on buttons
    if (e.key === 'Enter' && e.target.classList.contains('btn')) {
        e.target.click();
    }
});

// Focus management for mobile menu
const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

hamburger.addEventListener('click', () => {
    if (navMenu.classList.contains('active')) {
        const firstFocusableElement = navMenu.querySelectorAll(focusableElements)[0];
        firstFocusableElement?.focus();
    }
});

// Trap focus in mobile menu
navMenu.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        const focusableContent = navMenu.querySelectorAll(focusableElements);
        const firstFocusableElement = focusableContent[0];
        const lastFocusableElement = focusableContent[focusableContent.length - 1];
        
        if (e.shiftKey) {
            if (document.activeElement === firstFocusableElement) {
                lastFocusableElement.focus();
                e.preventDefault();
            }
        } else {
            if (document.activeElement === lastFocusableElement) {
                firstFocusableElement.focus();
                e.preventDefault();
            }
        }
    }
});

// Analytics tracking (placeholder)
function trackEvent(category, action, label) {
    // Google Analytics or other tracking service
    console.log('Event tracked:', { category, action, label });
}

// Track button clicks
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', () => {
        trackEvent('Button', 'Click', btn.textContent.trim());
    });
});

// Track form submissions
document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', () => {
        trackEvent('Form', 'Submit', form.id || 'Unknown');
    });
});


/**
 * Boranex Website Main JavaScript
 * Handles interactive elements, animations, and responsive behaviors
 */
document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initHeaderScroll();
    initSmoothScrolling();
    initFadeAnimations();
    initFormValidation();
    initBrandCardInteraction();
    // Remove initContactTabs() if it's there
    initEnhancedFormValidation(); // This line should be present
});

/**
 * Mobile Navigation Menu Handler
 * Toggles mobile menu visibility on small screens
 */
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navMenu = document.getElementById('nav-menu');
    
    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenuBtn.classList.toggle('active');
            navMenu.classList.toggle('show');
        });
    }
}

/**
 * Header Scroll Effect
 * Adds a 'scrolled' class to the header when page is scrolled down
 */
function initHeaderScroll() {
    const header = document.querySelector('header');
    
    if (header) {
        // Initial check in case page is loaded scrolled down
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        }
        
        // Set up scroll listener with throttling for performance
        let lastScrollTime = 0;
        window.addEventListener('scroll', () => {
            const now = Date.now();
            if (now - lastScrollTime > 50) { // Throttle to 50ms
                lastScrollTime = now;
                if (window.scrollY > 50) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
            }
        }, { passive: true }); // Use passive to improve scroll performance
    }
}

/**
 * Smooth Scrolling for Anchors
 * Enables smooth scrolling to page sections when clicking navigation links
 */
function initSmoothScrolling() {
    const navMenu = document.getElementById('nav-menu');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Calculate offset based on header height
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (navMenu && navMenu.classList.contains('show')) {
                    navMenu.classList.remove('show');
                    if (mobileMenuBtn) {
                        mobileMenuBtn.classList.remove('active');
                    }
                }
            }
        });
    });
}

/**
 * Scroll Animation
 * Uses Intersection Observer to trigger fade-in animations on scroll
 */
function initFadeAnimations() {
    const fadeElements = document.querySelectorAll('.fade-in');
    
    if (fadeElements.length > 0) {
        const fadeInObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    fadeInObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px' // Trigger slightly before element enters viewport
        });
        
        fadeElements.forEach(element => {
            fadeInObserver.observe(element);
        });
    }
}

/**
 * Contact Form Validation
 * Validates form inputs before submission
 */
function initFormValidation() {
    const contactForm = document.querySelector('.contact-form form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            let isValid = true;
            const formElements = this.elements;
            const errorMessages = [];
            
            // Check required fields
            for (let i = 0; i < formElements.length; i++) {
                const element = formElements[i];
                if (element.hasAttribute('required') && element.value.trim() === '') {
                    isValid = false;
                    errorMessages.push(`Please fill in the ${element.placeholder || 'required'} field`);
                    element.classList.add('error');
                } else {
                    element.classList.remove('error');
                }
            }
            
            // Email validation
            const emailInput = this.querySelector('input[type="email"]');
            if (emailInput && emailInput.value.trim() !== '') {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(emailInput.value)) {
                    isValid = false;
                    errorMessages.push('Please enter a valid email address');
                    emailInput.classList.add('error');
                }
            }
            
            if (!isValid) {
                alert(errorMessages.join('\n'));
                return;
            }
            
            // Show success message - would be replaced with actual form submission
            const successMessage = document.createElement('div');
            successMessage.className = 'form-success-message';
            successMessage.textContent = 'Thank you for your message. We will contact you soon!';
            
            const formParent = contactForm.parentNode;
            formParent.appendChild(successMessage);
            
            // Hide success message after 5 seconds
            setTimeout(() => {
                if (formParent.contains(successMessage)) {
                    formParent.removeChild(successMessage);
                }
            }, 5000);
            
            // Reset form
            this.reset();
        });
    }
}

/**
 * Brand Card Touch Interaction
 * Enhances brand cards with touch support for mobile devices
 */
function initBrandCardInteraction() {
    // Touch device detection
    const isTouchDevice = ('ontouchstart' in window) || 
                          (navigator.maxTouchPoints > 0) || 
                          (navigator.msMaxTouchPoints > 0);
    
    const brandItems = document.querySelectorAll('.brand-item');
    
    if (brandItems.length === 0) {
        return; // Exit if no brand items exist
    }
    
    if (isTouchDevice) {
        // Add touch-specific CSS
        const touchStyle = document.createElement('style');
        touchStyle.textContent = `
            .brand-item.touch-active .brand-overlay {
                opacity: 1;
            }
            .brand-item.touch-active .brand-logo {
                opacity: 0.2;
            }
        `;
        document.head.appendChild(touchStyle);
        
        // Global click handler to close any open items when clicking elsewhere
        document.addEventListener('touchstart', function(e) {
            let clickedOnCard = false;
            let targetItem = null;
            
            // Check if the click was on or inside a brand item
            brandItems.forEach(item => {
                if (item.contains(e.target)) {
                    clickedOnCard = true;
                    targetItem = item;
                }
            });
            
            // If clicked outside any card, close all cards
            if (!clickedOnCard) {
                brandItems.forEach(item => {
                    item.classList.remove('touch-active');
                });
            } else {
                // If clicked on a card, toggle that card and close others
                brandItems.forEach(item => {
                    if (item !== targetItem) {
                        item.classList.remove('touch-active');
                    }
                });
                targetItem.classList.toggle('touch-active');
            }
        });
        
        // Prevent default behavior on brand items to avoid navigation issues
        brandItems.forEach(item => {
            item.addEventListener('touchstart', function(e) {
                // Only prevent default if clicking on the item itself, not on links within
                if (e.target.tagName !== 'A') {
                    e.preventDefault();
                }
            });
        });
    } else {
        // Add hover effect improvement for desktop
        brandItems.forEach(item => {
            // Preload overlay on mouseenter for smoother transition
            item.addEventListener('mouseenter', function() {
                const overlay = this.querySelector('.brand-overlay');
                if (overlay) {
                    overlay.style.visibility = 'visible';
                }
            });
            
            // Hide overlay completely on mouseleave after transition
            item.addEventListener('mouseleave', function() {
                const overlay = this.querySelector('.brand-overlay');
                if (overlay) {
                    setTimeout(() => {
                        if (!this.matches(':hover')) {
                            overlay.style.visibility = '';
                        }
                    }, 300); // Match transition duration
                }
            });
        });
    }
}


function initEnhancedFormValidation() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            let isValid = true;
            const formElements = this.elements;
            
            // Reset all error states
            const errorElements = this.querySelectorAll('.form-error');
            errorElements.forEach(el => {
                el.textContent = '';
                el.classList.remove('visible');
            });
            
            const inputElements = this.querySelectorAll('input, textarea, select');
            inputElements.forEach(el => {
                el.classList.remove('error');
            });
            
            // Check each form element
            for (let i = 0; i < formElements.length; i++) {
                const element = formElements[i];
                
                // Skip buttons and non-input elements
                if (element.type === 'submit' || element.type === 'button') {
                    continue;
                }
                
                // Get the error element for this input
                const errorElement = element.parentNode.querySelector('.form-error');
                
                // Required field validation
                if (element.hasAttribute('required') && element.type !== 'checkbox' && element.value.trim() === '') {
                    isValid = false;
                    element.classList.add('error');
                    if (errorElement) {
                        errorElement.textContent = `This field is required`;
                        errorElement.classList.add('visible');
                    }
                }
                
                // Required checkbox validation
                if (element.type === 'checkbox' && element.hasAttribute('required') && !element.checked) {
                    isValid = false;
                    element.classList.add('error');
                    if (errorElement) {
                        errorElement.textContent = `You must accept this to continue`;
                        errorElement.classList.add('visible');
                    }
                }
                
                // Email validation
                if (element.type === 'email' && element.value.trim() !== '') {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(element.value)) {
                        isValid = false;
                        element.classList.add('error');
                        if (errorElement) {
                            errorElement.textContent = `Please enter a valid email address`;
                            errorElement.classList.add('visible');
                        }
                    }
                }
            }
            
            // If valid, show success message
            if (isValid) {
                // Hide the form
                this.style.display = 'none';
                
                // Show success message
                const formParent = this.parentNode;
                const successMessage = formParent.querySelector('.form-success');
                if (successMessage) {
                    successMessage.classList.add('visible');
                }
                
                // Reset form in background
                this.reset();
                
                // After 5 seconds, reset to form view for demo purposes
                setTimeout(() => {
                    this.style.display = 'block';
                    if (successMessage) {
                        successMessage.classList.remove('visible');
                    }
                }, 5000);
            }
        });
    }
}

/**
 * Safari-specific touch enhancements for brand cards
 * Improves overlay visibility on iPhone devices
 */
function enhanceSafariTouchInteraction() {
    // Check if running on iOS Safari
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    
    if (isIOS) {
        const brandItems = document.querySelectorAll('.brand-item');
        
        brandItems.forEach(item => {
            // Add long press handler for Safari
            let pressTimer;
            
            item.addEventListener('touchstart', function() {
                pressTimer = setTimeout(() => {
                    // Force overlay to be visible
                    const overlay = this.querySelector('.brand-overlay');
                    if (overlay) {
                        overlay.style.opacity = '1';
                        overlay.style.visibility = 'visible';
                    }
                    
                    // Dim the logo
                    const logo = this.querySelector('.brand-logo');
                    if (logo) {
                        logo.style.opacity = '0.05';
                    }
                }, 150);
            });
            
            // Clear timer if touch ends quickly
            item.addEventListener('touchend', function() {
                clearTimeout(pressTimer);
            });
            
            // Clear timer if touch moves too much
            item.addEventListener('touchmove', function() {
                clearTimeout(pressTimer);
            });
        });
    }
}

// Call this function on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    // Other initialization functions...
    
    // Add the Safari enhancement
    enhanceSafariTouchInteraction();
});
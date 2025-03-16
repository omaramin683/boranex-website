/**
 * Boranex Website Main JavaScript
 * Handles interactive elements, animations, responsive behaviors, and UI optimizations
 */
document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initHeaderScroll();
    initSmoothScrolling();
    initFadeAnimations();
    initFormValidation();
    initBrandCardInteraction();
    initEnhancedFormValidation();
    enhanceMobileOverlays(); // Added function to fix mobile overlays and desktop tile sizing
    initDesktopBrandLayouts(); // Added function to fix Konecranes tile size issue
    
    // Handle window resize events
    window.addEventListener('resize', debounce(() => {
        enhanceMobileOverlays();
        initDesktopBrandLayouts();
    }, 250));
});

/**
 * Debounce function to limit execution frequency of expensive operations
 * @param {Function} func - Function to be debounced
 * @param {number} wait - Delay in ms
 * @returns {Function} - Debounced function
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

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
 * Implements performance optimization via throttling
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
 * Handles mobile menu state after navigation
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
 * Implements performance optimization via IntersectionObserver API
 */
function initFadeAnimations() {
    const fadeElements = document.querySelectorAll('.fade-in');
    
    if (fadeElements.length > 0) {
        const fadeInObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    fadeInObserver.unobserve(entry.target); // Stop observing once animated
                }
            });
        }, {
            threshold: 0.1, // Element is 10% visible
            rootMargin: '0px 0px -50px 0px' // Trigger slightly before element enters viewport
        });
        
        fadeElements.forEach(element => {
            fadeInObserver.observe(element);
        });
    }
}

/**
 * Contact Form Validation
 * Basic validation with visual feedback for required fields and email format
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
            
            // Email validation using regex
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
            
            // Show success message - would be replaced with actual form submission in production
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
 * Implements different behavior for touch vs mouse interactions
 */
function initBrandCardInteraction() {
    // Touch device detection using multiple methods for cross-browser compatibility
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
                visibility: visible;
            }
            .brand-item.touch-active .brand-logo {
                opacity: 0.1;
            }
        `;
        document.head.appendChild(touchStyle);
        
        // Global touch handler to close any open items when touching elsewhere
        document.addEventListener('touchstart', function(e) {
            let clickedOnCard = false;
            let targetItem = null;
            
            // Check if the touch was on or inside a brand item
            brandItems.forEach(item => {
                if (item.contains(e.target)) {
                    clickedOnCard = true;
                    targetItem = item;
                }
            });
            
            // If touched outside any card, close all cards
            if (!clickedOnCard) {
                brandItems.forEach(item => {
                    item.classList.remove('touch-active');
                });
            } else {
                // If touched on a card, toggle that card and close others
                brandItems.forEach(item => {
                    if (item !== targetItem) {
                        item.classList.remove('touch-active');
                    }
                });
                targetItem.classList.toggle('touch-active');
                
                // Prevent scroll issues by stopping propagation if overlay clicked
                if (e.target.classList.contains('brand-overlay')) {
                    e.stopPropagation();
                }
            }
        }, { passive: false });
        
        // Prevent default behavior on brand items to avoid navigation issues
        brandItems.forEach(item => {
            item.addEventListener('touchstart', function(e) {
                // Only prevent default if clicking on the item itself, not on links within
                if (e.target.tagName !== 'A') {
                    e.preventDefault();
                }
            }, { passive: false });
            
            // Allow overlay content to be scrolled
            const overlay = item.querySelector('.brand-overlay');
            if (overlay) {
                overlay.addEventListener('touchmove', function(e) {
                    // If overlay has scrollable content
                    if (this.scrollHeight > this.clientHeight) {
                        e.stopPropagation(); // Prevent parent from receiving event
                    }
                }, { passive: true });
            }
        });
    } else {
        // Desktop hover effect improvement
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

/**
 * Enhanced Form Validation
 * More sophisticated form validation with improved visual feedback
 * Handles different input types (text, email, checkbox)
 */
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
                // In production, this would be replaced with an AJAX form submission
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
 * Uses vendor detection and long-press behavior for better UX
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

/**
 * Mobile Overlay Enhancement
 * Improves mobile overlay handling and fixes text overlap issues
 * Dynamically adjusts card heights based on screen size
 */
function enhanceMobileOverlays() {
    const isMobile = window.innerWidth <= 576;
    
    if (isMobile) {
        const brandItems = document.querySelectorAll('.brand-item');
        const overlays = document.querySelectorAll('.brand-overlay');
        
        // Make sure overlays can be scrolled without closing
        overlays.forEach(overlay => {
            // Allow overlay content to be scrolled
            overlay.addEventListener('touchmove', function(e) {
                // If overlay has scrollable content
                if (this.scrollHeight > this.clientHeight) {
                    e.stopPropagation();
                }
            }, { passive: true });
            
            // Fix issue with text selection in overlays
            overlay.addEventListener('touchstart', function(e) {
                e.stopPropagation();
            }, { passive: true });
        });
        
        // Adjust heights based on screen width
        if (window.innerWidth <= 375) {
            brandItems.forEach(item => {
                item.style.height = '270px';
            });
        } else if (window.innerWidth <= 428) {
            brandItems.forEach(item => {
                item.style.height = '260px';
            });
        } else if (window.innerWidth <= 576) {
            brandItems.forEach(item => {
                item.style.height = '250px';
            });
        }
    }
}

/**
 * Desktop Brand Layouts
 * Fixes the Konecranes tile size issue on desktop
 * Ensures consistent sizing across different brand categories
 */
function initDesktopBrandLayouts() {
    // Only run on desktop screens
    if (window.innerWidth >= 768) {
        const brandGrids = document.querySelectorAll('.brands-grid');
        
        brandGrids.forEach(grid => {
            // Check if this is a grid with a single brand item
            if (grid.children.length === 1) {
                // Get the parent category to check what kind of brand it is
                const parentCategory = grid.closest('.brand-category');
                
                if (parentCategory) {
                    const categoryTitle = parentCategory.querySelector('h3')?.textContent.toLowerCase() || '';
                    const isMaterialHandling = categoryTitle.includes('material handling');
                    
                    // Apply desktop styling for single items
                    if (isMaterialHandling) {
                        // Special handling for Konecranes (Material Handling section)
                        grid.style.display = 'flex';
                        grid.style.justifyContent = 'center';
                        
                        const brandItem = grid.children[0];
                        if (brandItem) {
                            brandItem.style.maxWidth = '50%';
                            brandItem.style.width = '100%';
                            brandItem.style.margin = '0 auto';
                        }
                    } else {
                        // General handling for other single brand items
                        grid.style.gridTemplateColumns = "repeat(2, 1fr)";
                        
                        const brandItem = grid.children[0];
                        if (brandItem) {
                            brandItem.style.gridColumn = "1";
                        }
                    }
                }
            }
        });
    }
}

// Initialize Safari-specific enhancements
document.addEventListener('DOMContentLoaded', () => {
    enhanceSafariTouchInteraction();
});
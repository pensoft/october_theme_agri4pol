/**
 * Animations.js - Contains all animation logic for the AGRI4POL site
 */

// Animation functions
function animateHeaderText() {
    const mainTitle = $('.hero h1');
    // Hide H1 initially for reveal animation (can also be done via CSS)
    mainTitle.css('opacity', 0);
    animateHeadingWords(mainTitle); // Use new word animation for H1

    // Animate the subtitle after H1 animation starts
    setTimeout(() => {
        const subtitles = $('.hero .sub-title p');
        subtitles.each(function(index) {
            setTimeout(() => {
                animateSubtitleWords($(this));
            }, index * 300); // Stagger subtitle lines
        });
    }, 1000); // Start subtitle animation ~1s after H1 starts
}

// New animation function for H1 heading: Fade-in + Scale-up word by word
function animateHeadingWords(element) {
    const text = element.text();
    element.empty(); // Clear original content

    const words = text.split(/(\s+)/);
    let wordIndex = 0;

    words.forEach((part) => {
        if (part.match(/\s+/)) {
            element.append(part); // Append spaces directly
        } else if (part.length > 0) {
            // Create a single span for the word
            const wordSpan = $(
                `<span class="heading-word-animation" style="
                    display: inline-block; /* Allows transform */
                    opacity: 0;
                    transform: scale(0.95) translateY(10px);
                    transition: opacity 0.5s ease-out, transform 0.5s ease-out;
                ">${part}</span>`
            );
            element.append(wordSpan);

            // Trigger the animation with a stagger
            setTimeout(() => {
                 wordSpan.css({
                     'opacity': '1',
                     'transform': 'scale(1) translateY(0)'
                 });
            }, wordIndex * 75); // 75ms delay between words

            wordIndex++;
        }
    });
    // Make the H1 visible now that its content is set up for animation
    element.css('opacity', 1);
}

// New animation function for subtitles: Masked slide-up reveal word by word
function animateSubtitleWords(element) {
    const text = element.text();
    element.empty(); // Clear original content

    const words = text.split(/(\s+)/); // Split by spaces, preserving them
    let wordIndex = 0;

    words.forEach((part) => {
        if (part.match(/\s+/)) {
            // Append spaces directly
            element.append(part);
        } else if (part.length > 0) {
            // It's a word - create mask and content structure
            const wordMask = $(
                `<span class="subtitle-word-mask" style="
                    display: inline-block;
                    overflow: hidden;
                    vertical-align: bottom; /* Adjust as needed */
                "></span>`
            );

            const wordContent = $(
                `<span class="subtitle-word-content" style="
                    display: block; /* Important for transform */
                    transform: translateY(100%); /* Start at edge of mask */
                    transition: transform 0.8s ease-out; /* Slower, softer easing */
                ">${part}</span>`
            );

            wordMask.append(wordContent);
            element.append(wordMask);

            // Trigger the animation with a stagger
            setTimeout(() => {
                 wordContent.css({
                    'transform': 'translateY(0%)'
                });
            }, wordIndex * 100); // Slower 100ms delay between words

            wordIndex++;
        }
    });

    // Make the parent <p> element visible now that its content is set up for animation
    element.css('opacity', 1);
}

function animateNumbers() {
    if (window.numbersAnimated) return;

    const numberElements = document.querySelectorAll('.number');
    const finalNumbers = [23, 4, 14, 8];
    const duration = 2000;
    const frameDuration = 1000 / 60;
    const totalFrames = Math.round(duration / frameDuration);
    let frame = 0;

    const countUp = () => {
        frame++;
        const progress = frame / totalFrames;
        const easeProgress = easeOutQuad(progress);

        numberElements.forEach((el, index) => {
            if (index < finalNumbers.length) {
                const currentValue = Math.round(easeProgress * finalNumbers[index]);
                el.textContent = currentValue;
            }
        });

        if (frame < totalFrames) {
            requestAnimationFrame(countUp);
        } else {
            numberElements.forEach((el, index) => {
                if (index < finalNumbers.length) {
                    el.textContent = finalNumbers[index];
                }
            });
            window.numbersAnimated = true;
        }
    };

    requestAnimationFrame(countUp);
}

function easeOutQuad(t) {
    return t * (2 - t);
}

function animateVisionSection() {
    // Add a subtle parallax effect to the vision section on scroll
    const visionSection = document.querySelector('.vision-section');
    const videoBackground = document.querySelector('.video-background');
    const whiteBox = document.querySelector('.vision-section .white-box');
    
    if (visionSection && videoBackground) {
        // Check if vision section is in view to trigger animations
        if (isScrolledIntoView(visionSection)) {
            // Force animation restart by removing and re-adding animation classes
            if (whiteBox) {
                // We don't need to do anything here since animations are now controlled by CSS
                // The animations will start automatically when the element is added to the DOM
            }
        }
        
        window.addEventListener('scroll', function() {
            const scrollPosition = window.scrollY;
            const sectionTop = visionSection.offsetTop;
            const sectionHeight = visionSection.offsetHeight;
            
            // Only apply effect when section is in viewport
            if (scrollPosition > sectionTop - window.innerHeight && 
                scrollPosition < sectionTop + sectionHeight) {
                // Calculate parallax amount (adjust speed as needed)
                const parallaxOffset = (scrollPosition - (sectionTop - window.innerHeight)) * 0.15;
                
                // Apply subtle scale and translate effect
                videoBackground.style.transform = `scale(${1 + parallaxOffset/1000}) translateY(${parallaxOffset/10}px)`;
            }
        });
    }
}

// Add ripple effect to primary and news buttons
function addRippleEffect() {
    const rippleButtons = document.querySelectorAll('.btn-primary, .btn-all-news, .btn-subscribe');
    
    rippleButtons.forEach(button => {
        // Make sure button has position relative
        if (window.getComputedStyle(button).position !== 'relative') {
            button.style.position = 'relative';
        }
        
        button.addEventListener('click', function(e) {
            // Create ripple element
            const ripple = document.createElement('span');
            ripple.classList.add('ripple-effect');
            
            // Set position
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            // Add styles to ripple
            ripple.style.width = ripple.style.height = `${size}px`;
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            
            // Add to button and remove after animation
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600); // Match with CSS animation duration
        });
    });
}

// Ensure buttons have proper z-index structure
function fixButtonIcons() {
    // Fix social button icons
    document.querySelectorAll('.btn-social').forEach(btn => {
        // Get the computed style
        const beforeElement = window.getComputedStyle(btn, '::before');
        if (beforeElement.display === 'none' || beforeElement.opacity === '0') {
            // Force the icon to be visible
            const style = document.createElement('style');
            style.innerHTML = `.btn-social::before { 
                display: block !important; 
                opacity: 1 !important;
                position: static !important;
                z-index: 5 !important;
            }`;
            document.head.appendChild(style);
        }
    });
    
    // Fix subscribe button icon
    document.querySelectorAll('.btn-subscribe').forEach(btn => {
        // Make sure the icon is visible
        const beforeElement = window.getComputedStyle(btn, '::before');
        if (beforeElement.display === 'none' || beforeElement.opacity === '0') {
            const style = document.createElement('style');
            style.innerHTML = `.btn-subscribe::before { 
                display: block !important; 
                opacity: 1 !important;
                position: static !important;
                z-index: 5 !important;
            }`;
            document.head.appendChild(style);
        }
    });
}

// Add simplified bell animation to subscribe button
function addBellAnimation() {
    // We don't need any JavaScript for the bell animation now
    // The CSS hover animation handles it all
    
    // But we should remove any notification dot if it exists
    document.querySelectorAll('.notification-dot').forEach(dot => {
        dot.remove();
    });
}

function setupAnimations() {
    // Initialize AOS library
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            once: false,
            mirror: true,
            offset: 50,
            easing: 'ease-out-cubic'
        });
    }

    // Animate header title and subtitle if on homepage
    if ($('.hero').length > 0) {
        animateHeaderText();
    }

    // Apply parallax effect to vision section
    animateVisionSection();

    // Set up scroll listener for number animation
    window.addEventListener('scroll', function() {
        // Check if numbers section is in view to trigger animation
        const numbersSection = document.querySelector('.numbers');
        if (numbersSection && isScrolledIntoView(numbersSection) && !window.numbersAnimated) {
            animateNumbers();
        }
    });

    // Add smooth accordion-like effects to any collapsible sections
    $('.arrow-toggle').each(function() {
        const toggle = $(this);
        const content = toggle.closest('.work-package-box').find('.wp-content');
        
        toggle.css({
            'transition': 'transform 0.4s ease-out'
        });
        
        content.css({
            'transition': 'max-height 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            'overflow': 'hidden'
        });
    });
    
    // Initialize new button animation effects
    addRippleEffect();
    fixButtonIcons();
    addBellAnimation();
}

// Helper function to check if element is in view
function isScrolledIntoView(elem) {
    var docViewTop = $(window).scrollTop();
    var docViewBottom = docViewTop + $(window).height();

    if($(elem).height()){
        var elemTop = $(elem).offset().top;
        var elemBottom = elemTop + $(elem).height();

        return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
    }
    return;
}

// Initialize animations when document is ready
$(document).ready(function() {
    setupAnimations();
    
    // Apply direct fix for any icon issues that might have occurred
    // This ensures buttons icons are always visible, regardless of animation effects
    fixButtonIconsImmediately();
    
    // Refresh AOS animations on window resize (if AOS exists)
    $(window).on('resize', function() {
        if (typeof AOS !== 'undefined') {
            AOS.refresh();
        }
    });
});

// Direct fix for button icons - run immediately after page load
function fixButtonIconsImmediately() {
    // Add CSS rules directly to guarantee icon visibility
    const style = document.createElement('style');
    style.textContent = `
        .btn-social::before,
        .btn-subscribe::before {
            display: block !important;
            position: static !important;
            opacity: 1 !important;
            transform: none !important;
            z-index: 10 !important;
            background-color: transparent !important;
        }
        
        .btn-social::before {
            width: 23px !important;
            height: 23px !important;
        }
        
        .btn-subscribe::before {
            width: 15px !important;
            height: 15px !important;
        }
        
        /* Fix for arrow buttons */
        .prev-arrow::before, 
        .next-arrow::before {
            display: block !important;
            opacity: 1 !important;
            position: absolute !important;
            top: 50% !important;
            left: 50% !important;
            z-index: 10 !important;
            width: 14px !important;
            height: 14px !important;
            background-color: transparent !important;
        }
        
        .prev-arrow::before {
            transform: translate(-50%, -50%) !important;
        }
        
        .next-arrow::before {
            transform: translate(-50%, -50%) rotate(180deg) !important;
        }
    `;
    document.head.appendChild(style);
}

//Start i middle container
document.addEventListener('DOMContentLoaded', () => {
    // Center image fade-in effect
    const centerImg = document.getElementById("frontImage");
    if (centerImg) {
        centerImg.style.transition = "opacity 1s ease";
        setTimeout(() => { centerImg.style.opacity = 0.3; }, 200);
        setTimeout(() => { centerImg.style.opacity = 0.6; }, 400);
        setTimeout(() => { centerImg.style.opacity = 0.9; }, 600);
        setTimeout(() => { centerImg.style.opacity = 1; }, 800);
    }

    // Paper animation
    const paper = document.getElementById("paper");
    const overlay = document.getElementById("overlay");
    
    if (paper) {
        paper.addEventListener("click", () => {
            paper.classList.add('fly-away');
            console.log("flying away");
        
            setTimeout(() => {
                paper.classList.remove('fly-away');
                paper.classList.add('expanded');
                
                if (overlay) {
                    overlay.style.display = 'block';
                    overlay.addEventListener('click', closePaper);
                }
                
                const closeButton = document.createElement('button');
                closeButton.classList.add('close-btn');
                closeButton.textContent = 'X';
                paper.appendChild(closeButton);
            }, 3000);
        });
    }

    // Close paper function
    function closePaper() {
        if (paper) {
            paper.classList.remove('expanded');
            if (overlay) overlay.style.display = 'none';
            
            const closeButton = paper.querySelector('.close-btn');
            if (closeButton) closeButton.remove();
            
            paper.style.transform = "translateX(-50%) translateY(0) scale(1)";
        }
    }

    // Background lazy loading
    const scrollContainer = document.getElementById('scrollContainer');
    if (scrollContainer) {
        const lazyLoadBackground = (element) => {
            const bgImage = element.getAttribute('data-bg');
            if (bgImage) {
                element.style.backgroundImage = bgImage;
                element.removeAttribute('data-bg');
            }
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    lazyLoadBackground(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        });

        observer.observe(scrollContainer);
    }

    // Section scrolling
    let currentIndex = 0;
    
    const sections = [
        document.getElementById("center"),
        document.getElementById("rightOne"),
        document.getElementById("rightTwo"),
        document.getElementById("rightThree"),
        document.getElementById("rightFour"),
        document.getElementById("rightFive"),
        document.getElementById("rightSix"),
        document.getElementById("rightSeven"),
        document.getElementById("rightEight"),
        document.getElementById("rightNine"),
        document.getElementById("rightTen"),
        document.getElementById("rightEleven"),
        document.getElementById("rightTwelve"),
    ].filter(section => section !== null); // Filter out null sections
    
    function scrollToSection(index) {
        if (sections[index]) {
            const scrollContainer = document.getElementById('scrollContainer');
            if (scrollContainer) {
                currentIndex = index;
                currentTranslateX = -index * 100;
                
                // Increase transition duration from 0.5s to 0.8s for smooth scrolling
                scrollContainer.style.transition = 'transform 1.6s cubic-bezier(0.23, 1, 0.32, 1)';
                scrollContainer.style.transform = `translateX(${currentTranslateX}vw)`;
                
                console.log(`Scrolled to section: ${currentIndex}`);
            }
        } else {
            console.error(`Section at index ${index} is null or undefined`);
        }
    }
    
    // Mouse wheel scrolling with debounce
    let isScrolling = false;
    let scrollTimeout;

    window.addEventListener('wheel', (event) => {
        // Prevent default scrolling behavior
        event.preventDefault();
        
        // If already scrolling, don't respond to additional scroll events
        if (isScrolling) return;
        
        // Set scrolling flag to true
        isScrolling = true;
        
        // Clear any existing timeout
        clearTimeout(scrollTimeout);
        
        // Determine scroll direction
        if (event.deltaY < 0 && currentIndex > 0) {
            scrollToSection(currentIndex - 1);
        } else if (event.deltaY > 0 && currentIndex < sections.length - 1) {
            scrollToSection(currentIndex + 1);
        } else {
            // If no scrolling happened, reset the flag immediately
            isScrolling = false;
            return;
        }
        
        // Set a timeout to reset the scrolling flag
        scrollTimeout = setTimeout(() => {
            isScrolling = false;
        }, 1000); // Adjust this value as needed (1 second cooldown)
    }, { passive: false }); // This allows preventDefault to work
    
    // Mobile touch scrolling with drag effect
    let touchStartX = 0;
    let initialTransform = 0;
    let isTouching = false;
    let currentTranslateX = 0;

    // Initialize the current translate position
    function updateInitialTransform() {
        currentTranslateX = -currentIndex * 100; // 100vw per section
        const scrollContainer = document.getElementById('scrollContainer');
        if (scrollContainer) {
            scrollContainer.style.transform = `translateX(${currentTranslateX}vw)`;
        }
    }

    window.addEventListener('touchstart', (event) => {
        event.preventDefault();
        touchStartX = event.touches[0].clientX;
        isTouching = true;
        
        // Get current transform value
        const scrollContainer = document.getElementById('scrollContainer');
        if (scrollContainer) {
            // Remove transition during touch for immediate response
            scrollContainer.style.transition = 'none';
            initialTransform = currentTranslateX;
        }
    }, { passive: false });

    window.addEventListener('touchmove', (event) => {
        if (!isTouching) return;
        
        const currentX = event.touches[0].clientX;
        const deltaX = currentX - touchStartX; // How far we've moved
        
        // Apply resistance when trying to scroll past the edges
        let newTranslateX = initialTransform;
        
        if ((currentIndex === 0 && deltaX > 0) || 
            (currentIndex === sections.length - 1 && deltaX < 0)) {
            // Add resistance when at the edges
            newTranslateX += deltaX / 3; // Divide by 3 for stronger resistance
        } else {
            // Normal movement - convert pixel movement to vw units
            const movePercentage = (deltaX / window.innerWidth) * 100;
            newTranslateX += movePercentage;
        }
        
        // Apply the transform
        const scrollContainer = document.getElementById('scrollContainer');
        if (scrollContainer) {
            scrollContainer.style.transform = `translateX(${newTranslateX}vw)`;
            currentTranslateX = newTranslateX;
        }
        
    }, { passive: false });

    window.addEventListener('touchend', (event) => {
        if (!isTouching) return;
        isTouching = false;
        
        const touchEndX = event.changedTouches[0].clientX;
        const deltaX = touchEndX - touchStartX;
        const absDeltaX = Math.abs(deltaX);
        
        const scrollContainer = document.getElementById('scrollContainer');
        if (scrollContainer) {
            // Add smooth transition for snapping
            scrollContainer.style.transition = 'transform 0.3s cubic-bezier(0.23, 1, 0.32, 1)';
            
            // Determine if we should snap to next/previous or stay on current
            if (absDeltaX > 50 || absDeltaX > window.innerWidth * 0.15) { // 15% of screen width
                if (deltaX > 0 && currentIndex > 0) {
                    // Swipe right - previous section
                    currentIndex--;
                } else if (deltaX < 0 && currentIndex < sections.length - 1) {
                    // Swipe left - next section
                    currentIndex++;
                }
            }
            
            // Snap to the current section
            currentTranslateX = -currentIndex * 100;
            scrollContainer.style.transform = `translateX(${currentTranslateX}vw)`;
        }
    });

    // Handle touch cancel
    window.addEventListener('touchcancel', () => {
        isTouching = false;
        
        const scrollContainer = document.getElementById('scrollContainer');
        if (scrollContainer) {
            // Add smooth transition for snapping
            scrollContainer.style.transition = 'transform 0.3s cubic-bezier(0.23, 1, 0.32, 1)';
            
            // Snap to current section
            currentTranslateX = -currentIndex * 100;
            scrollContainer.style.transform = `translateX(${currentTranslateX}vw)`;
        }
    });

    // Initialize transform position
    updateInitialTransform();

    // Add resize handler to maintain position
    window.addEventListener('resize', () => {
        const scrollContainer = document.getElementById('scrollContainer');
        if (scrollContainer) {
            scrollContainer.style.transition = 'none';
            currentTranslateX = -currentIndex * 100;
            scrollContainer.style.transform = `translateX(${currentTranslateX}vw)`;
        }
    });
});
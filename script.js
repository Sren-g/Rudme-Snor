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
    
    // Function to scroll to a specific section
    function scrollToSection(index) {
        if (sections[index]) {
            const scrollContainer = document.getElementById('scrollContainer');
            if (scrollContainer) {
                currentIndex = index;
                currentTranslateX = -index * 100;
                initialTransform = currentTranslateX; // Add this line to keep them in sync
                
                // Use smooth animation for transitions
                scrollContainer.style.transition = 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)';
                scrollContainer.style.transform = `translateX(${currentTranslateX}vw)`;
                
                console.log(`Scrolled to section: ${currentIndex}`);
            }
        } else {
            console.error(`Section at index ${index} is null or undefined`);
        }
    }
    
    // Variables for touch handling
    let touchStartX = 0;
    let touchStartY = 0;
    let initialTransform = 0;
    let isTouching = false;
    let currentTranslateX = 0;
    let touchInitialDirection = null;
    let activeScrollContainer = null;
    let initialScrollTop = 0;
    
    // Configure the detection thresholds
    const DIRECTION_THRESHOLD = 10; // Pixels to determine swipe direction
    const SWIPE_THRESHOLD = 40;     // Pixels required for a swipe to count
    
    // Initialize the current translate position
    function updateInitialTransform() {
        currentTranslateX = -currentIndex * 100; // 100vw per section
        initialTransform = currentTranslateX; // Add this line to keep them in sync
        
        const scrollContainer = document.getElementById('scrollContainer');
        if (scrollContainer) {
            scrollContainer.style.transform = `translateX(${currentTranslateX}vw)`;
        }
    }

    // Add event listeners to all scrollable containers
    const scrollableContainers = document.querySelectorAll('.scrollable-container');
    scrollableContainers.forEach(container => {
        // This is a critical fix: prevent container touch events from bubbling
        container.addEventListener('touchstart', (e) => {
            // Just record initial position, don't stop propagation yet
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
            
            // Important: Get the current transform value when touch starts
            initialTransform = currentTranslateX;
            
            // Reset direction detection
            touchInitialDirection = null;
        }, { passive: true });

        // Critical fix: handle touchmove inside container
        container.addEventListener('touchmove', (e) => {
            const touchX = e.touches[0].clientX;
            const touchY = e.touches[0].clientY;
            const deltaX = touchX - touchStartX;
            const deltaY = touchY - touchStartY;
            
            // If movement is significantly horizontal and larger than vertical
            if ((Math.abs(deltaX) > DIRECTION_THRESHOLD) && 
                (Math.abs(deltaX) > Math.abs(deltaY) * 1.2)) {
                // This is a deliberate horizontal swipe inside the container
                
                // Stop container's default scrolling
                e.preventDefault();
                
                // Trigger page swiping instead
                const scrollContainer = document.getElementById('scrollContainer');
                if (scrollContainer) {
                    // Calculate new position with resistance at edges
                    let newTranslateX = initialTransform;
                    
                    if ((currentIndex === 0 && deltaX > 0) || 
                        (currentIndex === sections.length - 1 && deltaX < 0)) {
                        // Add resistance when at the edges
                        newTranslateX += (deltaX / window.innerWidth) * 100 / 3;
                    } else {
                        // Normal movement - convert pixel movement to vw units
                        newTranslateX += (deltaX / window.innerWidth) * 100;
                    }
                    
                    // Apply the transform
                    scrollContainer.style.transition = 'none';
                    scrollContainer.style.transform = `translateX(${newTranslateX}vw)`;
                    currentTranslateX = newTranslateX;
                    
                    // Flag that we're handling a horizontal swipe
                    touchInitialDirection = 'horizontal';
                }
            }
        }, { passive: false }); // Need passive: false to use preventDefault
        
        // Handle touch end inside container
        container.addEventListener('touchend', (e) => {
            // If we were swiping horizontally
            if (touchInitialDirection === 'horizontal') {
                const touchEndX = e.changedTouches[0].clientX;
                const deltaX = touchEndX - touchStartX;
                const absDeltaX = Math.abs(deltaX);
                
                const scrollContainer = document.getElementById('scrollContainer');
                if (scrollContainer) {
                    // Add smooth transition for snapping
                    scrollContainer.style.transition = 'transform 0.3s cubic-bezier(0.23, 1, 0.32, 1)';
                    
                    // If sufficient swipe distance
                    if (absDeltaX > SWIPE_THRESHOLD) {
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
                
                // Prevent the event from bubbling to the document handler
                e.stopPropagation();
                touchInitialDirection = null;
            }
        }, { passive: false });
    });

    // MAIN TOUCH HANDLERS FOR THE DOCUMENT LEVEL
    document.addEventListener('touchstart', (event) => {
        // Skip if we're already handling a container touch
        if (event.target.closest('.scrollable-container')) {
            return;
        }
        
        touchStartX = event.touches[0].clientX;
        touchStartY = event.touches[0].clientY;
        isTouching = true;
        touchInitialDirection = null;
        
        // Get current transform value
        const scrollContainer = document.getElementById('scrollContainer');
        if (scrollContainer) {
            scrollContainer.style.transition = 'none';
            initialTransform = currentTranslateX;
        }
    }, { passive: true });

    document.addEventListener('touchmove', (event) => {
        // Skip if we're already handling a container touch or not touching
        if (event.target.closest('.scrollable-container') || !isTouching) {
            return;
        }
        
        const touchX = event.touches[0].clientX;
        const touchY = event.touches[0].clientY;
        const deltaX = touchX - touchStartX;
        const deltaY = touchY - touchStartY;
        
        // Determine direction if not yet determined
        if (touchInitialDirection === null) {
            // Only determine direction after enough movement
            if (Math.abs(deltaX) > DIRECTION_THRESHOLD || Math.abs(deltaY) > DIRECTION_THRESHOLD) {
                if (Math.abs(deltaX) > Math.abs(deltaY)) {
                    touchInitialDirection = 'horizontal';
                } else {
                    touchInitialDirection = 'vertical';
                }
            }
        }
        
        // Handle horizontal swipes
        if (touchInitialDirection === 'horizontal') {
            event.preventDefault(); // Prevent any default behavior like page scroll
            
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
        }
        // If direction is vertical, do nothing and let the default scroll behavior happen
    }, { passive: false }); // Need passive: false to use preventDefault

    document.addEventListener('touchend', (event) => {
        if (!isTouching) return;
        isTouching = false;
        
        // Only handle horizontal motion for section navigation
        if (touchInitialDirection === 'horizontal') {
            const touchEndX = event.changedTouches[0].clientX;
            const deltaX = touchEndX - touchStartX;
            const absDeltaX = Math.abs(deltaX);
            
            const scrollContainer = document.getElementById('scrollContainer');
            if (scrollContainer) {
                // Add smooth transition for snapping
                scrollContainer.style.transition = 'transform 0.3s cubic-bezier(0.23, 1, 0.32, 1)';
                
                // If sufficient swipe distance
                if (absDeltaX > SWIPE_THRESHOLD) {
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
        }
        
        // Reset the active scroll container
        activeScrollContainer = null;
    }, { passive: true });
    
    // Handle touch cancel
    document.addEventListener('touchcancel', () => {
        if (isTouching) {
            isTouching = false;
            activeScrollContainer = null;
            
            const scrollContainer = document.getElementById('scrollContainer');
            if (scrollContainer) {
                // Add smooth transition for snapping
                scrollContainer.style.transition = 'transform 0.3s cubic-bezier(0.23, 1, 0.32, 1)';
                
                // Snap to current section
                currentTranslateX = -currentIndex * 100;
                scrollContainer.style.transform = `translateX(${currentTranslateX}vw)`;
            }
        }
    }, { passive: true });

    // Mouse wheel scrolling with debounce
    let isScrolling = false;
    let scrollTimeout;

    // Wheel event handler for horizontal scrolling
    window.addEventListener('wheel', (event) => {
        // Check if the event target is inside a scrollable container
        const scrollableContainer = event.target.closest('.scrollable-container');
        
        if (scrollableContainer) {
            // Get container scroll info
            const atTop = scrollableContainer.scrollTop <= 0;
            const atBottom = Math.abs((scrollableContainer.scrollHeight - scrollableContainer.scrollTop - scrollableContainer.clientHeight)) < 2;
            
            // If at top/bottom and trying to scroll past, navigate sections
            if ((event.deltaY < 0 && atTop) || (event.deltaY > 0 && atBottom)) {
                event.preventDefault();
                
                // Debounce the scrolling
                if (isScrolling) return;
                isScrolling = true;
                
                // Navigate based on direction
                if (event.deltaY > 0 && currentIndex < sections.length - 1) {
                    scrollToSection(currentIndex + 1);
                } else if (event.deltaY < 0 && currentIndex > 0) {
                    scrollToSection(currentIndex - 1);
                }
                
                // Reset the scrolling flag after delay
                scrollTimeout = setTimeout(() => {
                    isScrolling = false;
                }, 800);
            }
            // Otherwise let normal scrolling happen within the container
        } else {
            // Not in a scrollable container, scroll horizontally
            event.preventDefault();
            
            if (isScrolling) return;
            isScrolling = true;
            
            if (event.deltaY > 0 && currentIndex < sections.length - 1) {
                scrollToSection(currentIndex + 1);
            } else if (event.deltaY < 0 && currentIndex > 0) {
                scrollToSection(currentIndex - 1);
            }
            
            scrollTimeout = setTimeout(() => {
                isScrolling = false;
            }, 800);
        }
    }, { passive: false });

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

    // Hamburger menu click handler
    const hamburgerMenu = document.getElementById('hamburgerMenu');
  
    if (hamburgerMenu) {
        hamburgerMenu.addEventListener('click', function() {
            // Find the index of rightOne in sections array
            const rightOneIndex = sections.findIndex(section => section.id === "rightOne");
            
            if (rightOneIndex !== -1) {
                scrollToSection(rightOneIndex);
            } else {
                console.error('Could not find rightOne in sections array');
            }
        });
    }
    
    // Optional: Add click handler for the ticket button
    const billetButton = document.getElementById('fixedBilletButton');
    if (billetButton) {
        billetButton.addEventListener('click', function() {
            // Replace with your ticket purchase URL
            window.location.href = 'https://yourticketurl.com';
        });
    }
});
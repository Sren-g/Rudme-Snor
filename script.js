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
            sections[index].scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
            currentIndex = index;
            console.log(currentIndex);
        } else {
            console.error(`Section at index ${index} is null or undefined`);
        }
    }
    
    // Mouse wheel scrolling
    window.addEventListener('wheel', (event) => {
        if (event.deltaY < 0 && currentIndex > 0) {
            scrollToSection(currentIndex - 1);
        } else if (event.deltaY > 0 && currentIndex < sections.length - 1) {
            scrollToSection(currentIndex + 1);
        }
    });
    
    // Mobile touch scrolling
    let touchStartY = 0;
    
    window.addEventListener('touchstart', (event) => {
        touchStartY = event.touches[0].clientY;
    });
    
    window.addEventListener('touchend', (event) => {
        const touchEndY = event.changedTouches[0].clientY;
        if (touchStartY - touchEndY > 50 && currentIndex < sections.length - 1) {
            // Swipe up
            scrollToSection(currentIndex + 1);
        } else if (touchEndY - touchStartY > 50 && currentIndex > 0) {
            // Swipe down
            scrollToSection(currentIndex - 1);
        }
    });
});


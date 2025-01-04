


//Start i middle container
document.addEventListener('DOMContentLoaded', () => {
    
    const centerImg = document.getElementById("frontImage");
    centerImg.style.transition = "opacity 1s ease"; // Fade-in effect

    // Trigger the fade-in effect
    setTimeout(() => {
        centerImg.style.opacity = 0,3;
    }, 200);
    setTimeout(() => {
        centerImg.style.opacity = 0,6;
    }, 400);
    setTimeout(() => {
        centerImg.style.opacity = 0,9;
    }, 600);
    setTimeout(() => {
        centerImg.style.opacity = 1;
    }, 800);

    const paper = document.getElementById("paper");
    const overlay = document.getElementById("overlay");
    
    // Add event listener for the click event
    paper.addEventListener("click", () => {
      // Step 1: Trigger the fly-away animation
      paper.classList.add('fly-away');
      console.log("flying away");
    
      // Step 2: Wait for the animation to complete, then expand
      setTimeout(() => {
        paper.classList.remove('fly-away'); // Remove fly-away class
        paper.classList.add('expanded');   // Add expanded class
    
        // Show overlay for background dimming
        overlay.style.display = 'block';
    
        overlay.addEventListener('click', closePaper);
        paper.appendChild(closeButton);
      }, 3000); // Match the duration of fly-away animation
    });
    
    // Close the expanded view
    function closePaper() {
      // Remove expanded styles and hide overlay
      paper.classList.remove('expanded');
      overlay.style.display = 'none';
    
      // Remove the close button
      const closeButton = paper.querySelector('.close-btn');
      if (closeButton) closeButton.remove();
    
      // Optionally reset paper position (to clothesline)
      paper.style.transform = translateX("-50%"), translateY(0), scale(1);
    }
    
    



}); 


let currentIndex = 0; // Index of the center section


window.addEventListener('wheel', (event) => {

  const sections = [
        document.getElementById("center"),
        document.getElementById("rightOne"),
        document.getElementById("rightTwo"),
        document.getElementById("rightThree"),
        document.getElementById("rightFour"),
        document.getElementById("rightFive"),
        document.getElementById("rightSix"),
        document.getElementById("rightSeven"),
    ];
    // Scroll up to move left
    if (event.deltaY < 0 && currentIndex > 0 )  {
        i = currentIndex - 1;
        sections[i].scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
        currentIndex --; 
        console.log(currentIndex); 
        console.log(screen.width());
    }  // Scroll down to move right
    if (event.deltaY > 0 && currentIndex < sections.length - 1) {
        i = currentIndex + 1;
        sections[i].scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
        currentIndex ++; 
        console.log(currentIndex);
    }
    } 
    );


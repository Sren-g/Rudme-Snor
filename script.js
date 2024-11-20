


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




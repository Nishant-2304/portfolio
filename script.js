/*const smallMascot = document.getElementById("smallMascot");
const bigMascot = document.getElementById("bigMascot");
const welcomeTitle = document.getElementById("welcomeTitle");
const mascotBubble = document.getElementById("mascotBubble");
const themeToggle = document.getElementById("themeToggle");
const params = new URLSearchParams(window.location.search);
const name = params.get("name");
const scroller = document.querySelector(".projectsScroller");
const cards = document.querySelectorAll(".projectCard");
const preloader = document.getElementById("preloader");
const ring = document.querySelector(".progressRing");
let progress = 0;

const loaderInterval = setInterval(() => {
    progress += 4; //it increases by 4 degrees every 30ms
    ring.style.background = `
        conic-gradient(
            var(--accent-yellow) ${progress}deg, 
            var(--bg-secondary) ${progress}deg
        )
    `; //it increases the conic gradient to make a circle
    if (progress >= 360) {
        clearInterval(loaderInterval); 
        preloader.style.opacity = "0"; // fade out
        preloader.style.pointerEvents = "none"; // disable interactions
        setTimeout(() => preloader.remove(), 600); // remove from DOM after fade out
    }
}, 30); // this thing runs every 30ms for smoothness

// ----------- INITIAL ANIMATIONS -----------
document.addEventListener("DOMContentLoaded", () => {
    welcomeTitle.textContent = `Welcome, ${name}!`;
    setTimeout(() => {
        bigMascot.style.opacity = 1;
        bigMascot.style.transform = "translateY(0)"; //css mai transition and transform set kar ke isse yahan change kiya hai
    }, 300);
    setTimeout(() => {
        document.querySelector(".textRow").classList.add("fade-in"); //the welcome text fades in
    }, 650);
});

themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");
    themeToggle.textContent = document.body.classList.contains("light-mode") ? "☀️" : "🌙";
});

window.addEventListener("scroll", () => {
    const rect = bigMascot.getBoundingClientRect();
    if (rect.bottom < 0) {      //jab mascot pura viewport se bahar chala jaye to show small mascot
        smallMascot.style.opacity = 1;
        smallMascot.style.transform = "translateX(0)";
    } else {
        smallMascot.style.opacity = 0;
    }
});

function mascotBubbleScroll() {
    const sections = document.querySelectorAll(".contentSection");
    const SCROLL_BUFFER = 120; // chota sa delay, to allow the mascot to speak
    sections.forEach(section => {
        let entered = false;
        let triggered = false;
        let enterScrollY = 0;

        window.addEventListener("scroll", () => {
            const rect = section.getBoundingClientRect(); //DOM method that returns the size and position of an element relative to the viewport
            const triggerPoint = window.innerHeight * 0.6;
            if (!entered && rect.top < triggerPoint) {
                entered = true;
                enterScrollY = window.scrollY;
            }
            if (!entered || triggered) return;
            const scrolledSinceEnter = window.scrollY - enterScrollY;
            if (scrolledSinceEnter > SCROLL_BUFFER) {
                let msg = "";
                switch (section.id) {
                    case "aboutMe":
                        msg = "This is a bit about me!";
                        break;
                    case "links":
                        msg = "Want to stalk me online?";
                        break;
                    case "achievements":
                        msg = "How can someone be this awesome?";
                        break;
                    case "projects":
                        msg = "Built this with caffeine and bad sleep 😭";
                        break;
                    case "hobbies":
                        msg = "These are the things I do when I am not busy saving the world!!!";
                        break;
                    case "contact":
                        msg = "Don’t be shy, say hi 👋";
                        break;
                    case "thankyou":
                        msg = "Tussi ja rahe ho?";
                        break;
                }
                if (msg) showBubble(msg);
                triggered = true;
            }
        });
    });
}
// ----------- SECTION FADE-IN SCROLL LOGIC -----------
function sectionFadeIn() {
    const sections = document.querySelectorAll(".fade-item");
    sections.forEach(section => {
        let entered = false;
        window.addEventListener("scroll", () => {
            const rect = section.getBoundingClientRect();
            const triggerPoint = window.innerHeight * 0.75;
            if (!entered && rect.top < triggerPoint) {
                section.classList.add("fade-in");
                entered = true;
            }
        });
    });
}

function showBubble(text) {
    mascotBubble.textContent = text;
    mascotBubble.style.opacity = 1;
    setTimeout(() => (mascotBubble.style.opacity = 0), 3000);
}

let lastScrollY = 0;
let lastTime = Date.now();
window.addEventListener("scroll", () => {
    let now = Date.now();
    let timeDiff = now - lastTime;
    let dy = Math.abs(window.scrollY - lastScrollY);
    let speed = dy / timeDiff;
    if (speed > 4) {
        smallMascot.classList.add("spin");
        showBubble("Calm down dude, Go slow!");
        setTimeout(() => smallMascot.classList.remove("spin"), 600);
    }
    lastScrollY = window.scrollY;
    lastTime = now;
});

function updateCylinder() {
    if (!scroller) return;
    const scrollerRect = scroller.getBoundingClientRect();
    const centerX = scrollerRect.left + scrollerRect.width / 2;

    cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const cardCenter = rect.left + rect.width / 2;
        const distance = cardCenter - centerX;
        const normalized = distance / (scrollerRect.width / 2);
        const n = Math.max(-1, Math.min(1, normalized));
        const absN = Math.abs(n);
        const angle = n * 55;                 // stronger wrap
        const radius = 700;                   // depth of cylinder
        const scale = 1 - Math.pow(absN, 1.6) * 0.55;
        const z = (1 - absN) * radius - radius;
        const x = Math.sin(n * Math.PI / 2) * 160;

        card.style.transform = `
            translateX(${x}px)
            translateZ(${z}px)
            rotateY(${angle}deg)
            scale(${scale})
        `;
        card.style.opacity = 1 - absN * 0.65;
        card.style.boxShadow = `
            0 ${20 + absN * 40}px
            ${40 + absN * 80}px
            rgba(0,0,0,${0.3 + absN * 0.4})
        `;
    });
}
if (scroller) {
    scroller.addEventListener("scroll", updateCylinder);
    window.addEventListener("resize", updateCylinder);
    updateCylinder();
}

// card flip thingy
function cardScroll(stackId) {
    const stack = document.getElementById(stackId);
    const SCROLL_BUFFER = 120; // ← controls how long first card stays
    let step = 0;
    let entered = false;
    let enterScrollY = 0;

    window.addEventListener("scroll", () => {
        const rect = stack.getBoundingClientRect();
        const viewportTrigger = window.innerHeight * 0.65;
        // Detect first entry
        if (!entered && rect.top < viewportTrigger) {
            entered = true;
            enterScrollY = window.scrollY;
        }
        if (!entered) return;
        const scrolledSinceEnter = window.scrollY - enterScrollY;
        if (scrolledSinceEnter > SCROLL_BUFFER && step < 1) {
            stack.classList.add("reveal1");
            step = 1;
        }

        if (scrolledSinceEnter > SCROLL_BUFFER * 2 && step < 2) {
            stack.classList.add("reveal2");
            step = 2;
        }

        if (scrolledSinceEnter < SCROLL_BUFFER && step > 0) {
            stack.classList.remove("reveal1", "reveal2");
            step = 0;
        }
    });
}

mascotBubbleScroll();
sectionFadeIn();
cardScroll("hobStack"); */

const smallMascot = document.getElementById("smallMascot");
const bigMascot = document.getElementById("bigMascot");
const welcomeTitle = document.getElementById("welcomeTitle");
const mascotBubble = document.getElementById("mascotBubble");
const themeToggle = document.getElementById("themeToggle");
const params = new URLSearchParams(window.location.search);
const name = params.get("name");
const preloader = document.getElementById("preloader");
const ring = document.querySelector(".progressRing");
let progress = 0;

const loaderInterval = setInterval(() => {
    progress += 4;
    ring.style.background = `
        conic-gradient(
            var(--accent-yellow) ${progress}deg,
            var(--bg-secondary) ${progress}deg
        )
    `;
    if (progress >= 360) {
        clearInterval(loaderInterval);
        preloader.style.opacity = "0";
        preloader.style.pointerEvents = "none";
        setTimeout(() => preloader.remove(), 600);
    }
}, 30);

/* ----------- INITIAL ANIMATIONS ----------- */
document.addEventListener("DOMContentLoaded", () => {
    welcomeTitle.textContent = `Welcome, ${name}!`;
    setTimeout(() => {
        bigMascot.style.opacity = 1;
        bigMascot.style.transform = "translateY(0)";
    }, 300);
    setTimeout(() => {
        document.querySelector(".textRow").classList.add("fade-in");
    }, 650);
});

themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");
    themeToggle.textContent = document.body.classList.contains("light-mode") ? "☀️" : "🌙";
});

window.addEventListener("scroll", () => {
    const rect = bigMascot.getBoundingClientRect();
    if (rect.bottom < 0) {
        smallMascot.style.opacity = 1;
        smallMascot.style.transform = "translateX(0)";
    } else {
        smallMascot.style.opacity = 0;
    }
});

function mascotBubbleScroll() {
    const sections = document.querySelectorAll(".contentSection");
    const SCROLL_BUFFER = 120;

    sections.forEach(section => {
        let entered = false;
        let triggered = false;
        let enterScrollY = 0;

        window.addEventListener("scroll", () => {
            const rect = section.getBoundingClientRect();
            const triggerPoint = window.innerHeight * 0.6;

            if (!entered && rect.top < triggerPoint) {
                entered = true;
                enterScrollY = window.scrollY;
            }

            if (!entered || triggered) return;

            const scrolledSinceEnter = window.scrollY - enterScrollY;

            if (scrolledSinceEnter > SCROLL_BUFFER) {
                let msg = "";
                switch (section.id) {
                    case "aboutMe":
                        msg = "This is a bit about me!";
                        break;
                    case "links":
                        msg = "Want to stalk me online?";
                        break;
                    case "achievements":
                        msg = "How can someone be this awesome?";
                        break;
                    case "projects":
                        msg = "Built this with caffeine and bad sleep 😭";
                        break;
                    case "hobbies":
                        msg = "These are the things I do when I am not busy saving the world!!!";
                        break;
                    case "contact":
                        msg = "Don’t be shy, say hi 👋";
                        break;
                    case "thankyou":
                        msg = "Tussi ja rahe ho?";
                        break;
                }

                if (msg) showBubble(msg);
                triggered = true;
            }
        });
    });
}

/* ----------- SECTION FADE-IN SCROLL LOGIC ----------- */
function sectionFadeIn() {
    const sections = document.querySelectorAll(".fade-item");

    sections.forEach(section => {
        let entered = false;

        window.addEventListener("scroll", () => {
            const rect = section.getBoundingClientRect();
            const triggerPoint = window.innerHeight * 0.75;

            if (!entered && rect.top < triggerPoint) {
                section.classList.add("fade-in");
                entered = true;
            }
        });
    });
}

function showBubble(text) {
    mascotBubble.textContent = text;
    mascotBubble.style.opacity = 1;
    setTimeout(() => (mascotBubble.style.opacity = 0), 3000);
}

let lastScrollY = 0;
let lastTime = Date.now();

window.addEventListener("scroll", () => {
    let now = Date.now();
    let timeDiff = now - lastTime;
    let dy = Math.abs(window.scrollY - lastScrollY);
    let speed = dy / timeDiff;

    if (speed > 4) {
        smallMascot.classList.add("spin");
        showBubble("Calm down dude, Go slow!");
        setTimeout(() => smallMascot.classList.remove("spin"), 600);
    }

    lastScrollY = window.scrollY;
    lastTime = now;
});

/* ----------- CARD STACK SCROLL REVEAL ----------- */
function cardScroll(stackId) {
    const stack = document.getElementById(stackId);
    const SCROLL_BUFFER = 120;
    let step = 0;
    let entered = false;
    let enterScrollY = 0;

    window.addEventListener("scroll", () => {
        const rect = stack.getBoundingClientRect();
        const viewportTrigger = window.innerHeight * 0.65;

        if (!entered && rect.top < viewportTrigger) {
            entered = true;
            enterScrollY = window.scrollY;
        }

        if (!entered) return;

        const scrolledSinceEnter = window.scrollY - enterScrollY;

        if (scrolledSinceEnter > SCROLL_BUFFER && step < 1) {
            stack.classList.add("reveal1");
            step = 1;
        }

        if (scrolledSinceEnter > SCROLL_BUFFER * 2 && step < 2) {
            stack.classList.add("reveal2");
            step = 2;
        }

        if (scrolledSinceEnter < SCROLL_BUFFER && step > 0) {
            stack.classList.remove("reveal1", "reveal2");
            step = 0;
        }
    });
}

mascotBubbleScroll();
sectionFadeIn();
cardScroll("hobStack");
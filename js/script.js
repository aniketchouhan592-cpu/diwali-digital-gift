/* =========================================
   DIWALI DIGITAL GIFT
   SCRIPT - FINAL FIXED VERSION
   ========================================= */

"use strict";


/* =========================================
   ELEMENTS
   ========================================= */

const startButton =
    document.getElementById("startButton");

const giftBox =
    document.getElementById("giftBox");

const fireworksScreen =
    document.getElementById("fireworksScreen");

const mainCanvas =
    document.getElementById("fireworksCanvas");

const ctx =
    mainCanvas.getContext("2d");


/* =========================================
   SCREEN SYSTEM
   ========================================= */

function showScreen(screen) {
    
    document.querySelectorAll(".screen").forEach(function(item) {
        
        item.classList.remove("active");
        
        item.style.display = "none";
        item.style.visibility = "hidden";
        item.style.opacity = "0";
        item.style.pointerEvents = "none";
        
    });
    
    screen.classList.add("active");
    
    screen.style.display = "flex";
    screen.style.visibility = "visible";
    screen.style.opacity = "1";
    screen.style.pointerEvents = "auto";
}

/* =========================================
   INITIAL SCREEN
   ========================================= */

document.querySelectorAll(".screen").forEach(function(screen) {
    
    if (screen.classList.contains("active")) {
        
        screen.style.display = "flex";
        screen.style.visibility = "visible";
        screen.style.opacity = "1";
        screen.style.pointerEvents = "auto";
        
    } else {
        
        screen.style.display = "none";
        screen.style.visibility = "hidden";
        screen.style.opacity = "0";
        screen.style.pointerEvents = "none";
        
    }
    
});

/* =========================================
   MAIN CANVAS
   ========================================= */

function resizeCanvas() {

    mainCanvas.width =
        window.innerWidth;

    mainCanvas.height =
        window.innerHeight;
}

resizeCanvas();

window.addEventListener(
    "resize",
    resizeCanvas
);


/* =========================================
   AUDIO SYSTEM
   ========================================= */

let audioContext = null;

function initAudio() {

    if (!audioContext) {

        const AudioContext =
            window.AudioContext ||
            window.webkitAudioContext;

        if (!AudioContext) {
            return;
        }

        audioContext =
            new AudioContext();
    }

    if (audioContext.state === "suspended") {

        audioContext.resume();
    }
}


/* =========================================
   GIFT OPEN SOUND
   ========================================= */

function giftOpenSound() {

    if (!audioContext) {
        return;
    }

    const now =
        audioContext.currentTime;

    const oscillator =
        audioContext.createOscillator();

    const gain =
        audioContext.createGain();

    oscillator.type =
        "sine";

    oscillator.frequency.setValueAtTime(
        300,
        now
    );

    oscillator.frequency.exponentialRampToValueAtTime(
        900,
        now + 0.5
    );

    gain.gain.setValueAtTime(
        0.001,
        now
    );

    gain.gain.linearRampToValueAtTime(
        0.18,
        now + 0.05
    );

    gain.gain.exponentialRampToValueAtTime(
        0.001,
        now + 0.6
    );

    oscillator.connect(gain);
    gain.connect(audioContext.destination);

    oscillator.start(now);
    oscillator.stop(now + 0.65);
}


/* =========================================
   FIREWORK SOUND
   ========================================= */

function fireworkSound(power = 1) {

    if (!audioContext) {
        return;
    }

    const now =
        audioContext.currentTime;

    const duration =
        0.25 + power * 0.15;

    const bufferSize =
        audioContext.sampleRate * duration;

    const buffer =
        audioContext.createBuffer(
            1,
            bufferSize,
            audioContext.sampleRate
        );

    const data =
        buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {

        data[i] =
            (Math.random() * 2 - 1) *
            Math.pow(
                1 - i / bufferSize,
                2
            );
    }

    const source =
        audioContext.createBufferSource();

    const gain =
        audioContext.createGain();

    const filter =
        audioContext.createBiquadFilter();

    filter.type =
        "lowpass";

    filter.frequency.value =
        1500;

    gain.gain.setValueAtTime(
        0.001,
        now
    );

    gain.gain.exponentialRampToValueAtTime(
        0.20 * power,
        now + 0.015
    );

    gain.gain.exponentialRampToValueAtTime(
        0.001,
        now + duration
    );

    source.buffer =
        buffer;

    source.connect(filter);
    filter.connect(gain);
    gain.connect(audioContext.destination);

    source.start(now);
}


/* =========================================
   FIREWORK PARTICLES
   ========================================= */

let particles = [];


function createExplosion(x, y, power = 1) {

    const total =
        Math.floor(75 * power);

    for (let i = 0; i < total; i++) {

        const angle =
            Math.random() *
            Math.PI * 2;

        const speed =
            1.5 +
            Math.random() * 5 * power;

        particles.push({

            x: x,
            y: y,

            vx:
                Math.cos(angle) * speed,

            vy:
                Math.sin(angle) * speed,

            life: 1,

            decay:
                0.012 +
                Math.random() * 0.018,

            size:
                1 +
                Math.random() * 3
        });
    }

    fireworkSound(
        Math.min(power, 1.5)
    );
}


/* =========================================
   DRAW PARTICLES
   ========================================= */

function drawParticles() {

    for (
        let i = particles.length - 1;
        i >= 0;
        i--
    ) {

        const p =
            particles[i];

        p.x += p.vx;
        p.y += p.vy;

        p.vy += 0.045;

        p.vx *= 0.985;

        p.life -= p.decay;

        if (p.life <= 0) {

            particles.splice(i, 1);

            continue;
        }

        ctx.beginPath();

        ctx.arc(
            p.x,
            p.y,
            p.size,
            0,
            Math.PI * 2
        );

        ctx.fillStyle =
            `hsla(
                ${Math.random() * 360},
                100%,
                65%,
                ${p.life}
            )`;

        ctx.fill();
    }
}


/* =========================================
   MAIN ANIMATION
   ========================================= */

function animationLoop() {

    ctx.clearRect(
        0,
        0,
        mainCanvas.width,
        mainCanvas.height
    );

    drawParticles();

    requestAnimationFrame(
        animationLoop
    );
}

animationLoop();


/* =========================================
   ROCKET
   ========================================= */

function launchRocket(
    targetX,
    targetY
) {

    let x =
        Math.random() *
        mainCanvas.width;

    let y =
        mainCanvas.height + 20;


    function moveRocket() {

        ctx.beginPath();

        ctx.arc(
            x,
            y,
            3,
            0,
            Math.PI * 2
        );

        ctx.fillStyle =
            "#ffffff";

        ctx.shadowBlur =
            15;

        ctx.shadowColor =
            "#ffd45a";

        ctx.fill();

        ctx.shadowBlur =
            0;

        y -= 7;


        if (y <= targetY) {

            createExplosion(
                x,
                y,
                1.3
            );

            return;
        }

        requestAnimationFrame(
            moveRocket
        );
    }

    moveRocket();
}


/* =========================================
   FIREWORK TYPES
   ========================================= */

function ringExplosion(x, y) {

    const total = 90;

    for (let i = 0; i < total; i++) {

        const angle =
            (Math.PI * 2 / total) * i;

        const speed =
            3.2 +
            Math.random() * 1.5;

        particles.push({

            x: x,
            y: y,

            vx:
                Math.cos(angle) *
                speed,

            vy:
                Math.sin(angle) *
                speed,

            life: 1,

            decay:
                0.012 +
                Math.random() * 0.01,

            size:
                1.5 +
                Math.random() * 2
        });
    }

    fireworkSound(1.2);
}


function burstExplosion(x, y) {

    const total = 110;

    for (let i = 0; i < total; i++) {

        const angle =
            Math.random() *
            Math.PI * 2;

        const speed =
            1.5 +
            Math.random() * 6;

        particles.push({

            x: x,
            y: y,

            vx:
                Math.cos(angle) *
                speed,

            vy:
                Math.sin(angle) *
                speed,

            life: 1,

            decay:
                0.009 +
                Math.random() * 0.016,

            size:
                1 +
                Math.random() * 3
        });
    }

    fireworkSound(1.25);
}


/* =========================================
   ANARDANA
   ========================================= */

function anardana(x) {

    const bottom =
        mainCanvas.height - 25;

    const top =
        mainCanvas.height * 0.48;

    let y =
        bottom;

    let sparks = [];


    function animate() {

        y -= 2;


        for (let i = 0; i < 3; i++) {

            sparks.push({

                x:
                    x +
                    (Math.random() - 0.5) *
                    20,

                y: y,

                life: 1,

                size:
                    1 +
                    Math.random() * 2
            });
        }


        for (
            let i = sparks.length - 1;
            i >= 0;
            i--
        ) {

            const s =
                sparks[i];

            s.life -= 0.035;

            ctx.beginPath();

            ctx.arc(
                s.x,
                s.y,
                s.size,
                0,
                Math.PI * 2
            );

            ctx.fillStyle =
                `rgba(
                    255,
                    185,
                    50,
                    ${s.life}
                )`;

            ctx.shadowBlur =
                10;

            ctx.shadowColor =
                "#ff9d00";

            ctx.fill();

            ctx.shadowBlur =
                0;


            if (s.life <= 0) {

                sparks.splice(
                    i,
                    1
                );
            }
        }


        if (y > top) {

            requestAnimationFrame(
                animate
            );

        } else {

            burstExplosion(
                x,
                y
            );
        }
    }

    animate();
}


/* =========================================
   PATKHA LADI
   ========================================= */

function crackerLadi() {

    const startX =
        mainCanvas.width * 0.12;

    const groundY =
        mainCanvas.height * 0.86;

    const gap =
        mainCanvas.width * 0.075;

    let index = 0;


    function nextCracker() {

        if (index >= 11) {
            return;
        }

        const x =
            startX +
            index * gap;


        ctx.beginPath();

        ctx.arc(
            x,
            groundY,
            4,
            0,
            Math.PI * 2
        );

        ctx.fillStyle =
            "#ffd34d";

        ctx.shadowBlur =
            15;

        ctx.shadowColor =
            "#ff8c00";

        ctx.fill();

        ctx.shadowBlur =
            0;


        burstExplosion(
            x,
            groundY - 18
        );


        index++;


        setTimeout(
            nextCracker,
            180
        );
    }

    nextCracker();
}


/* =========================================
   SPECIAL FIREWORK
   ========================================= */

function specialBurst() {

    const x =
        mainCanvas.width *
        (
            0.15 +
            Math.random() * 0.7
        );

    const y =
        mainCanvas.height *
        (
            0.15 +
            Math.random() * 0.35
        );

    ringExplosion(
        x,
        y
    );
}


/* =========================================
   FIREWORKS → FINAL DIWALI MESSAGE
   ========================================= */

function createDiwaliFinalShow() {

    const old =
        document.getElementById(
            "diwaliRocketShow"
        );

    if (old) {
        old.remove();
    }


    const container =
        document.createElement("div");

    container.id =
        "diwaliRocketShow";

    container.innerHTML = `

        <div class="final-rocket rocket-left">
            <span></span>
        </div>

        <div class="final-rocket rocket-right">
            <span></span>
        </div>

        <div class="final-diwali-text">
            शुभ दीपावली
        </div>

    `;

    fireworksScreen.appendChild(
        container
    );


    setTimeout(function() {

        container.classList.add(
            "rockets-active"
        );

        fireworkSound(0.8);

    }, 50);


    setTimeout(function() {

        container.classList.add(
            "rocket-explode"
        );

        createExplosion(
            mainCanvas.width * 0.50,
            mainCanvas.height * 0.40,
            1.8
        );

    }, 1450);


    setTimeout(function() {

        container.classList.add(
            "show-text"
        );

        fireworkSound(1.1);

    }, 1750);
}


/* =========================================
   FIREWORK SHOW
   ========================================= */

let fireworksStarted =
    false;


function startFireworks() {

    if (fireworksStarted) {
        return;
    }

    fireworksStarted =
        true;


    showScreen(
        fireworksScreen
    );


    setTimeout(function() {

        launchRocket(
            mainCanvas.width * 0.25,
            mainCanvas.height * 0.25
        );

    }, 300);


    setTimeout(function() {

        launchRocket(
            mainCanvas.width * 0.75,
            mainCanvas.height * 0.20
        );

    }, 1500);


    setTimeout(function() {

        launchRocket(
            mainCanvas.width * 0.50,
            mainCanvas.height * 0.16
        );

    }, 2700);


    setTimeout(function() {

        anardana(
            mainCanvas.width * 0.50
        );

    }, 4000);


    setTimeout(function() {

        crackerLadi();

    }, 5200);


    setTimeout(function() {

        specialBurst();

    }, 7000);


    setTimeout(function() {

        specialBurst();

    }, 7800);


    setTimeout(function() {

        specialBurst();

    }, 8600);


    setTimeout(function() {

        specialBurst();

    }, 9400);


    setTimeout(function() {

        createDiwaliFinalShow();

    }, 9650);


    setTimeout(function() {

        showLakshmiScreen();

    }, 10800);
}


/* =========================================
   INDIAN FESTIVE MUSIC
   ========================================= */

let musicStarted =
    false;

let musicTimer =
    null;


function startIndianClassicalMusic() {

    if (
        musicStarted ||
        !audioContext
    ) {
        return;
    }

    musicStarted =
        true;


    const musicCtx =
        audioContext;


    const droneNotes = [
        146.83,
        220,
        293.66
    ];


    droneNotes.forEach(function(frequency) {

        const oscillator =
            musicCtx.createOscillator();

        const gain =
            musicCtx.createGain();

        oscillator.type =
            "triangle";

        oscillator.frequency.value =
            frequency;

        gain.gain.value =
            0.025;

        oscillator.connect(gain);

        gain.connect(
            musicCtx.destination
        );

        oscillator.start();

    });


    const notes = [

        293.66,
        329.63,
        392.00,
        440.00,
        392.00,
        329.63,
        293.66,
        261.63

    ];


    let noteIndex = 0;


    function playClassicalNote() {

        if (!audioContext) {
            return;
        }


        const oscillator =
            musicCtx.createOscillator();

        const gain =
            musicCtx.createGain();


        oscillator.type =
            "sine";

        oscillator.frequency.value =
            notes[noteIndex];


        const now =
            musicCtx.currentTime;


        gain.gain.setValueAtTime(
            0.001,
            now
        );

        gain.gain.linearRampToValueAtTime(
            0.065,
            now + 0.12
        );

        gain.gain.exponentialRampToValueAtTime(
            0.001,
            now + 1.2
        );


        oscillator.connect(gain);

        gain.connect(
            musicCtx.destination
        );


        oscillator.start(now);

        oscillator.stop(
            now + 1.3
        );


        noteIndex++;

        if (
            noteIndex >=
            notes.length
        ) {

            noteIndex = 0;
        }


        musicTimer =
            setTimeout(
                playClassicalNote,
                1450
            );
    }


    playClassicalNote();
}


/* =========================================
   BACKGROUND FIREWORK CANVAS
   ========================================= */

let backgroundCanvas =
    null;

let backgroundCtx =
    null;

let backgroundRunning =
    false;

let backgroundTimer =
    null;

let backgroundParticles =
    [];


/* =========================================
   CREATE BACKGROUND CANVAS
   ========================================= */

function createBackgroundCanvas(screen) {

    if (!backgroundCanvas) {

        backgroundCanvas =
            document.createElement("canvas");

        backgroundCanvas.id =
            "backgroundFireworksCanvas";

        backgroundCtx =
            backgroundCanvas.getContext(
                "2d"
            );
    }


    /*
       सबसे जरूरी सुधार:
       Canvas अब BODY में नहीं,
       बल्कि जिस screen में fireworks
       चाहिए उसी screen के अंदर जाएगा।
    */

    if (
        screen &&
        backgroundCanvas.parentElement !== screen
    ) {

        screen.appendChild(
            backgroundCanvas
        );
    }


    backgroundCanvas.style.position =
        "absolute";

    backgroundCanvas.style.top =
        "0";

    backgroundCanvas.style.left =
        "0";

    backgroundCanvas.style.width =
        "100%";

    backgroundCanvas.style.height =
        "100%";

    backgroundCanvas.style.pointerEvents =
        "none";

    /*
       Screen के background में रहेगा।
       Screen की तस्वीर/सामग्री इसके ऊपर रहेगी।
    */

    backgroundCanvas.style.zIndex =
        "1";


    resizeBackgroundCanvas();
}


/* =========================================
   RESIZE BACKGROUND CANVAS
   ========================================= */

function resizeBackgroundCanvas() {

    if (!backgroundCanvas) {
        return;
    }

    backgroundCanvas.width =
        window.innerWidth;

    backgroundCanvas.height =
        window.innerHeight;
}


window.addEventListener(
    "resize",
    resizeBackgroundCanvas
);


/* =========================================
   BACKGROUND EXPLOSION
   ========================================= */

function createBackgroundExplosion(
    x,
    y
) {

    for (let i = 0; i < 70; i++) {

        const angle =
            Math.random() *
            Math.PI * 2;

        const speed =
            1.2 +
            Math.random() * 4;


        backgroundParticles.push({

            x: x,
            y: y,

            vx:
                Math.cos(angle) *
                speed,

            vy:
                Math.sin(angle) *
                speed,

            life: 1,

            decay:
                0.012 +
                Math.random() * 0.018,

            size:
                1.5 +
                Math.random() * 2.5,

            hue:
                Math.random() * 360
        });
    }


    /*
       Sound भी साथ में
    */

    fireworkSound(0.45);
}


/* =========================================
   DRAW BACKGROUND FIREWORKS
   ========================================= */

function drawBackgroundFireworks() {

    if (!backgroundCtx) {
        return;
    }


    backgroundCtx.clearRect(
        0,
        0,
        backgroundCanvas.width,
        backgroundCanvas.height
    );


    for (
        let i =
            backgroundParticles.length - 1;
        i >= 0;
        i--
    ) {

        const p =
            backgroundParticles[i];


        p.x += p.vx;

        p.y += p.vy;

        p.vy += 0.025;

        p.vx *= 0.985;

        p.life -= p.decay;


        if (p.life <= 0) {

            backgroundParticles.splice(
                i,
                1
            );

            continue;
        }


        backgroundCtx.beginPath();

        backgroundCtx.arc(
            p.x,
            p.y,
            p.size,
            0,
            Math.PI * 2
        );


        backgroundCtx.fillStyle =
            `hsla(
                ${p.hue},
                100%,
                70%,
                ${p.life * 0.9}
            )`;


        backgroundCtx.shadowBlur =
            10;

        backgroundCtx.shadowColor =
            `hsl(
                ${p.hue},
                100%,
                65%
            )`;


        backgroundCtx.fill();

        backgroundCtx.shadowBlur =
            0;
    }


    if (backgroundRunning) {

        requestAnimationFrame(
            drawBackgroundFireworks
        );
    }
}


/* =========================================
   START BACKGROUND FIREWORKS
   ========================================= */

function startBackgroundFireworks(screen) {

    /*
       अब screen देना जरूरी है।
       उदाहरण:
       startBackgroundFireworks(diya);
    */

    createBackgroundCanvas(
        screen
    );


    /*
       अगर पहले से चल रहे हैं,
       तो नया timer नहीं बनाएंगे।
    */

    if (backgroundRunning) {
        return;
    }


    backgroundRunning =
        true;


    backgroundTimer =
        setInterval(function() {

            if (!backgroundRunning) {
                return;
            }


            const x =
                backgroundCanvas.width *
                (
                    0.10 +
                    Math.random() * 0.80
                );


            const y =
                backgroundCanvas.height *
                (
                    0.10 +
                    Math.random() * 0.42
                );


            createBackgroundExplosion(
                x,
                y
            );

        }, 1700);


    drawBackgroundFireworks();
}


/* =========================================
   STOP BACKGROUND FIREWORKS
   ========================================= */

function stopBackgroundFireworks() {

    backgroundRunning =
        false;


    if (backgroundTimer) {

        clearInterval(
            backgroundTimer
        );

        backgroundTimer =
            null;
    }


    backgroundParticles =
        [];


    if (backgroundCtx) {

        backgroundCtx.clearRect(
            0,
            0,
            backgroundCanvas.width,
            backgroundCanvas.height
        );
    }
}


/* =========================================
   LAKSHMI SCREEN
   ========================================= */

function showLakshmiScreen() {

    const fireworks =
        document.getElementById(
            "fireworksScreen"
        );

    const diya =
        document.getElementById(
            "diyaScene"
        );

    const mithai =
        document.getElementById(
            "mithaiScene"
        );

    const finalScene =
        document.getElementById(
            "finalScene"
        );


    /*
       Main fireworks बंद
    */

    showScreen(diya);


    /*
       Lakshmi screen
    */

    showScreen(diya);


    startIndianClassicalMusic();


    /*
       सबसे जरूरी:
       Fireworks canvas को
       Lakshmi screen में डालना
    */

    startBackgroundFireworks(
        diya
    );


    /*
       7 सेकंड बाद Mithai
    */

    setTimeout(function() {

 showScreen(mithai);


        /*
           Canvas को Mithai screen में डालना
        */

        startBackgroundFireworks(
            mithai
        );


        /*
           7 सेकंड बाद Final
        */

        setTimeout(function() {

         showScreen(finalScene);


            /*
               Canvas को Final screen में डालना
            */

            startBackgroundFireworks(
                finalScene
            );


        }, 7000);


    }, 7000);
}


/* =========================================
   OPEN GIFT
   ========================================= */

let giftOpened =
    false;


function openGift() {

    if (giftOpened) {
        return;
    }


    giftOpened =
        true;


    startButton.disabled =
        true;


    initAudio();

    giftOpenSound();


    /*
       Music user click के बाद शुरू
       होगी, इसलिए mobile browser में
       audio चलने की संभावना बेहतर है।
    */

    startIndianClassicalMusic();


    giftBox.classList.add(
        "opening"
    );


    setTimeout(function() {

        startFireworks();

    }, 800);
}


/* =========================================
   BUTTON
   ========================================= */

startButton.addEventListener(
    "click",
    openGift
);


/* =========================================
   GIFT BOX CLICK
   ========================================= */

giftBox.addEventListener(
    "click",
    openGift
);


/* =========================================
   OPENING STYLE
   ========================================= */

const openingStyle =
    document.createElement("style");


openingStyle.textContent = `

.gift-box.opening {

    animation:
        giftOpening
        0.8s
        ease-in
        forwards !important;
}


@keyframes giftOpening {

    0% {

        transform:
            scale(1)
            rotate(0deg);

        opacity: 1;
    }


    30% {

        transform:
            scale(1.15)
            rotate(-4deg);

        opacity: 1;
    }


    60% {

        transform:
            scale(1.25)
            rotate(4deg);

        opacity: 0.9;
    }


    100% {

        transform:
            scale(0.1)
            rotate(25deg);

        opacity: 0;
    }

}

`;

document.head.appendChild(
    openingStyle
);

/* =========================================
   STEP 5 — TAP FESTIVE SPARK EFFECT
========================================= */

function createTapSpark(x, y) {
    
    const spark = document.createElement("div");
    
    spark.className = "tap-spark";
    
    spark.style.left = x + "px";
    spark.style.top = y + "px";
    
    document.body.appendChild(spark);
    
    setTimeout(() => {
        spark.remove();
    }, 700);
}


/* Mobile + Desktop Touch */

document.addEventListener("pointerdown", function(event) {
    
    /* Button पर extra spark नहीं */
    if (event.target.closest("button")) {
        return;
    }
    
    createTapSpark(event.clientX, event.clientY);
    
});

/* ================================
   STEP 7 - SHARE SYSTEM
================================ */

const shareButton = document.getElementById("shareButton");

if (shareButton) {

    shareButton.addEventListener("click", async function () {

        const shareData = {
            title: "🎁 A Special Diwali Gift",
            text:
                "🎁 तुम्हारे लिए एक खास Diwali Gift है!\n\n" +
                "Gift खोलो और शानदार Diwali surprise देखो 🪔✨\n\n" +
                "Happy Diwali! 🎆🪔",
            url: window.location.href
        };

        try {

            if (navigator.share) {

                await navigator.share(shareData);

            } else {

                const message =
                    "🎁 तुम्हारे लिए एक खास Diwali Gift है!\n\n" +
                    "Gift खोलो और शानदार Diwali surprise देखो 🪔✨\n\n" +
                    window.location.href;

                await navigator.clipboard.writeText(message);

                alert("🎉 Share message और link copy हो गया!");

            }

        } catch (error) {

            if (error.name !== "AbortError") {
                console.log("Share failed:", error);
            }

        }

    });

}
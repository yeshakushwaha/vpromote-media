/*
    ========================================
    Hero Section
    ========================================
    */

document.addEventListener("DOMContentLoaded", () => {
  const hero = document.querySelector(".hero");
  const content = document.querySelector(".hero-content");

  /*
    ========================================
    MOUSE PARALLAX EFFECT
    ========================================
    */

  if (window.innerWidth > 768) {
    hero.addEventListener("mousemove", (e) => {
      const rect = hero.getBoundingClientRect();

      const x = (e.clientX - rect.left) / rect.width - 0.5;

      const y = (e.clientY - rect.top) / rect.height - 0.5;

      const moveX = x * 12;
      const moveY = y * 8;

      content.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });

    hero.addEventListener("mouseleave", () => {
      content.style.transform = "translate(0, 0)";
    });
  }

  /*
    ========================================
    BUTTON MAGNETIC EFFECT
    ========================================
    */

  const button = document.querySelector(".hero-btn");

  if (button && window.innerWidth > 768) {
    button.addEventListener("mousemove", (e) => {
      const rect = button.getBoundingClientRect();

      const x = e.clientX - rect.left - rect.width / 2;

      const y = e.clientY - rect.top - rect.height / 2;

      button.style.transform = `translate(${x * 0.12}px, ${y * 0.12}px)`;
    });

    button.addEventListener("mouseleave", () => {
      button.style.transform = "translate(0, 0)";
    });
  }

  /*
    ========================================
    SUBTLE BACKGROUND PARALLAX
    ========================================
    */

  if (window.innerWidth > 768) {
    window.addEventListener("scroll", () => {
      const scroll = window.scrollY;

      if (scroll < window.innerHeight) {
        hero.style.backgroundPosition = `center ${50 + scroll * 0.025}%`;
      }
    });
  }
});

/*
    ========================================
    Footer Section
    ========================================
    */

document.addEventListener("DOMContentLoaded", () => {
  loadComponent("navbar", "navbar.html");

  loadComponent("footer", "footer.html");
});

async function loadComponent(elementId, filePath) {
  const element = document.getElementById(elementId);

  if (!element) return;

  try {
    const response = await fetch(filePath);

    if (!response.ok) {
      throw new Error(`Failed to load ${filePath}`);
    }

    const html = await response.text();

    element.innerHTML = html;

    // Initialize navbar after loading
    if (elementId === "navbar") {
      initializeNavbar();
    }
  } catch (error) {
    console.error("Component loading error:", error);
  }
}

/* =========================
   MOBILE NAVIGATION
========================= */

function initializeNavbar() {
  const menuToggle = document.getElementById("menuToggle");

  const mobileNav = document.getElementById("mobileNav");

  if (!menuToggle || !mobileNav) return;

  menuToggle.addEventListener("click", () => {
    menuToggle.classList.toggle("active");

    mobileNav.classList.toggle("active");

    document.body.classList.toggle("menu-open");
  });

  // Close menu after clicking a link

  const mobileLinks = mobileNav.querySelectorAll("a");

  mobileLinks.forEach((link) => {
    link.addEventListener("click", () => {
      menuToggle.classList.remove("active");

      mobileNav.classList.remove("active");

      document.body.classList.remove("menu-open");
    });
  });
}

/*
    ========================================
    Image Zoom Section
    ========================================
    */

document.addEventListener("DOMContentLoaded", () => {
  const section = document.getElementById("videoZoomSection");

  const stage = section.querySelector(".video-zoom-stage");

  const box = section.querySelector(".video-zoom-image");

  const image = box.querySelector("img");

  if (!section || !stage || !box || !image) {
    return;
  }

  /* =====================================================
       SETTINGS
    ===================================================== */

  /*
       Apne actual fixed header ki height yahan do.

       Agar header 80px hai:
       80

       Agar 70px hai:
       70
    */

  const HEADER_HEIGHT = 80;

  /*
       Starting image position
    */

  const START_TOP = 20;

  /*
       Starting width

       RIGHT SIDE 0
    */

  const START_WIDTH = 80;

  /*
       Normal image height
    */

  const NORMAL_HEIGHT = 270;

  /*
       Header touch ke time
       image ki compressed height
    */

  const COMPRESSED_HEIGHT = 82;

  /*
       Final height
    */

  const FINAL_HEIGHT = 600;

  /*
       Animation phases
    */

  const PHASE_1 = 0.34;
  const PHASE_2 = 0.55;

  let current = 0;
  let target = 0;

  let raf = null;

  /* =====================================================
       HELPERS
    ===================================================== */

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  /*
       Smooth cubic easing
    */

  function ease(t) {
    return t * t * (3 - 2 * t);
  }

  /* =====================================================
       GET SCROLL PROGRESS
    ===================================================== */

  function getProgress() {
    const rect = section.getBoundingClientRect();

    const scrollDistance = section.offsetHeight - window.innerHeight;

    return clamp(-rect.top / scrollDistance, 0, 1);
  }

  /* =====================================================
       ANIMATION
    ===================================================== */

  function render() {
    /*
           Smooth interpolation
        */

    current += (target - current) * 0.09;

    const p = clamp(current, 0, 1);

    /* =================================================
           PHASE 1

           Image moves upward.

           RIGHT SIDE remains 0.

           Left gap gradually reduces.

           Image zooms.
        ================================================= */

    if (p < PHASE_1) {
      let t = p / PHASE_1;

      t = ease(t);

      /*
              TOP

              250 → header
            */

      const top = lerp(START_TOP, HEADER_HEIGHT, t);

      /*
              WIDTH

              90 → 94

              Still right aligned.
            */

      const width = lerp(START_WIDTH, 94, t);

      /*
              Height remains normal
            */

      const height = lerp(NORMAL_HEIGHT, NORMAL_HEIGHT, t);

      /*
              Rounded → less rounded
            */

      const radius = lerp(16, 10, t);

      box.style.right = "0px";

      box.style.left = "auto";

      box.style.top = `${top}px`;

      box.style.width = `${width}%`;

      box.style.height = `${height}px`;

      box.style.borderRadius = `${radius}px 0 0 ${radius}px`;

      /*
              IMAGE ZOOM

              Slow zoom while travelling upward
            */

      image.style.transform = `scale(${lerp(1, 1.12, t)})`;
    } else if (p < PHASE_2) {
      /* =================================================
           PHASE 2

           HEADER TOUCH

           THIS IS THE SPECIAL CHANGE.

           Image rapidly becomes:
           100% width

           Height compresses.
        ================================================= */
      let t = (p - PHASE_1) / (PHASE_2 - PHASE_1);

      t = ease(t);

      /*
              RIGHT = 0
            */

      box.style.right = "0px";

      /*
              Width expands LEFTWARD

              94 → 100
            */

      const width = lerp(94, 100, t);

      box.style.width = `${width}%`;

      /*
              TOP LOCKED TO HEADER
            */

      box.style.top = `${HEADER_HEIGHT}px`;

      /*
              THIS IS THE IMPORTANT EFFECT

              270 → 82
            */

      const height = lerp(NORMAL_HEIGHT, COMPRESSED_HEIGHT, t);

      box.style.height = `${height}px`;

      /*
              Corners disappear
            */

      box.style.borderRadius = "0px";

      /*
              Image zoom increases
            */

      image.style.transform = `scale(${lerp(1.12, 1.2, t)})`;
    } else {
      /* =================================================
           PHASE 3

           Image is now FULL WIDTH.

           Top remains attached to header.

           Height slowly grows again.

           This is the second zoom animation.
        ================================================= */
      let t = (p - PHASE_2) / (1 - PHASE_2);

      t = ease(t);

      /*
              EXACT FULL WIDTH
            */

      box.style.left = "0px";

      box.style.right = "0px";

      box.style.width = "100%";

      /*
              TOP NEVER MOVES

              It remains attached to header.
            */

      box.style.top = `${HEADER_HEIGHT}px`;

      /*
              HEIGHT

              compressed → full image
            */

      const height = lerp(COMPRESSED_HEIGHT, FINAL_HEIGHT, t);

      box.style.height = `${height}px`;

      /*
              Completely square
            */

      box.style.borderRadius = "0px";

      /*
              SECOND ZOOM

              Image itself continues zooming.
            */

      image.style.transform = `scale(${lerp(1.2, 1.32, t)})`;
    }

    /* =================================================
           LOOP
        ================================================= */

    if (Math.abs(target - current) > 0.00005) {
      raf = requestAnimationFrame(render);
    } else {
      raf = null;
    }
  }

  /* =====================================================
       SCROLL
    ===================================================== */

  function onScroll() {
    target = getProgress();

    if (!raf) {
      raf = requestAnimationFrame(render);
    }
  }

  window.addEventListener("scroll", onScroll, {
    passive: true,
  });

  /* =====================================================
       RESIZE
    ===================================================== */

  window.addEventListener("resize", () => {
    target = getProgress();

    if (!raf) {
      raf = requestAnimationFrame(render);
    }
  });

  /* =====================================================
       INITIAL
    ===================================================== */

  target = getProgress();

  current = target;

  render();
});

/* =========================
   FOOTER CURRENT YEAR
========================= */

document.addEventListener("DOMContentLoaded", function () {
  const currentYear = document.getElementById("currentYear");

  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }

  /* =========================
       SHOW BUTTON ON SCROLL
    ========================= */

  function checkScroll() {
    if (window.scrollY > 300) {
      scrollToTop.classList.add("show");
    } else {
      scrollToTop.classList.remove("show");
    }
  }

  window.addEventListener("scroll", checkScroll);

  checkScroll();

  /* =========================
       SCROLL TO TOP
    ========================= */

  scrollToTop.addEventListener("click", function () {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
});


/* =======================================================
   SERVICES SECTION
======================================================= */
document.addEventListener("DOMContentLoaded",()=>{
 const section=document.querySelector(".services-section");
 const stage=document.querySelector(".heading-scroll-space");
 const title=document.querySelector(".services-title");
 const cards=[...document.querySelectorAll(".service-card")];
 const viewAll=document.querySelector(".view-all");
 const viewRow=document.querySelector(".view-all-row");
 const reduced=matchMedia("(prefers-reduced-motion: reduce)").matches;
 let pending=false;
 const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
 const ease=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
 function update(){
   if(!section||!stage||!title)return;
   const mobile=innerWidth<=700;
   if(reduced){title.style.transform="scale(1)";title.style.opacity="1";cards.forEach(card=>{card.style.transform="";card.style.filter="";});viewAll?.classList.add("is-visible");return;}
   if(mobile){title.style.transform="scale(1)";title.style.opacity="1";cards.forEach(card=>{card.style.transform="";card.style.filter="";card.classList.remove("is-tilting");});return;}
   // Scroll-controlled title animation completes before the first card reaches its sticky position.
   const stageTop=stage.getBoundingClientRect().top+scrollY;
   const start=stageTop-innerHeight*.22;
   const finish=stageTop+stage.offsetHeight*.30;
   const p=clamp((scrollY-start)/Math.max(1,finish-start),0,1);
   // One continuous zoom-in only. Once the heading reaches its final size,
   // hold it there; do not start a second zoom-out phase or overlap it with cards.
   const q=ease(p);
   const scale=.18+.82*q;
   const opacity=.03+.97*q;
   const y=18*(1-q);
   title.style.transform=`translate3d(0,${y}px,0) scale(${scale})`;
   title.style.opacity=String(opacity);
   // As the next card overlaps, the card beneath gently hinges backward from its top edge.
   const pinTop=61;
   cards.forEach((card,i)=>{
     const rect=card.getBoundingClientRect();const next=cards[i+1];
     if(next){const nr=next.getBoundingClientRect();const overlap=clamp((pinTop+rect.height*.32-nr.top)/(rect.height*.32),0,1);const eased=ease(overlap);
       card.style.transform=`perspective(1400px) rotateX(${-3.2*eased}deg) translate3d(0,${-8*eased}px,0) scale(${1-.025*eased})`;
       card.style.filter=`brightness(${1-.08*eased})`;card.classList.toggle("is-tilting",overlap>.03);
     }else{card.style.transform="";card.style.filter="";card.classList.remove("is-tilting");}
   });
 }
 addEventListener("scroll",()=>{if(!pending){requestAnimationFrame(()=>{update();pending=false});pending=true}},{passive:true});
 addEventListener("resize",update);update();
 // CTA enters when the area after the third card reaches the viewport.
 if(viewRow&&viewAll&&"IntersectionObserver" in window){const ctaObserver=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting)viewAll.classList.add("is-visible");else if(entry.boundingClientRect.top>innerHeight)viewAll.classList.remove("is-visible");});},{threshold:.18,rootMargin:"0px 0px -8% 0px"});ctaObserver.observe(viewRow);}else viewAll?.classList.add("is-visible");
 const menu=document.querySelector(".menu");menu?.addEventListener("click",()=>{const nav=document.querySelector(".nav-links");const open=nav.dataset.open==="1";nav.dataset.open=open?"0":"1";Object.assign(nav.style,open?{display:""}:{display:"flex",position:"absolute",top:"56px",left:"0",right:"0",padding:"18px",background:"#13202d",flexDirection:"column",gap:"18px"});});
});

/* =======================================================
   SHOWREEL SCROLL ANIMATION
======================================================= */
document.addEventListener("DOMContentLoaded", () => {
  const track = document.getElementById("showreelTrack");
  const stage = document.getElementById("showreelStage");
  const content = document.getElementById("showreelContent");
  const placeholder = document.getElementById("showreelPlaceholder");
  const imageLayer = document.getElementById("showreelImageLayer");
  const image = document.getElementById("showreelImage");
  const shade = document.getElementById("showreelShade");
  const overlay = document.getElementById("showreelOverlay");
  const playButton = document.getElementById("showreelPlayBtn");

  const videoModal = document.getElementById("showreelVideoModal");
  const videoPlayer = document.getElementById("showreelVideoPlayer");
  const closeButton = document.getElementById("showreelVideoClose");

  if (
    track && stage && content && placeholder &&
    imageLayer && image && shade && overlay
  ) {
    let ticking = false;

    const clamp = (value, min, max) =>
      Math.min(Math.max(value, min), max);

    const smooth = (t) =>
      t * t * (3 - 2 * t);

    function updateShowreel() {
      ticking = false;

      const trackRect = track.getBoundingClientRect();

      // Scroll progress across the pinned Showreel section
      const scrollDistance = Math.max(
        track.offsetHeight - stage.offsetHeight,
        1
      );

      const progress = clamp(
        -trackRect.top / scrollDistance,
        0,
        1
      );

      const stageRect = stage.getBoundingClientRect();
      const placeholderRect = placeholder.getBoundingClientRect();

      // Thumbnail position relative to the fullscreen stage
      const startLeft = placeholderRect.left - stageRect.left;
      const startTop = placeholderRect.top - stageRect.top;
      const startWidth = placeholderRect.width;
      const startHeight = placeholderRect.height;

      // Zoom completes early, then stays fullscreen
      const zoomEnd = 0.42;
      const zoomProgress = smooth(
        clamp(progress / zoomEnd, 0, 1)
      );

      const left = startLeft * (1 - zoomProgress);
      const top = startTop * (1 - zoomProgress);

      const width =
        startWidth +
        (stage.clientWidth - startWidth) * zoomProgress;

      const height =
        startHeight +
        (stage.clientHeight - startHeight) * zoomProgress;

      Object.assign(imageLayer.style, {
        left: `${left}px`,
        top: `${top}px`,
        width: `${width}px`,
        height: `${height}px`,
        borderRadius: `${15 * (1 - zoomProgress)}px`
      });

      // Fade out the original copyright row
      content.style.opacity = String(
        1 - smooth(clamp(progress / 0.14, 0, 1))
      );

      // Subtle darkening toward the next section
      const darkProgress = smooth(
        clamp((progress - 0.58) / 0.38, 0, 1)
      );

      shade.style.opacity = String(darkProgress * 0.32);

      // Reverse naturally when scrolling upward
      if (zoomProgress >= 0.88) {
        overlay.classList.add("is-visible");
      } else {
        overlay.classList.remove("is-visible");
      }
    }

    function requestUpdate() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(updateShowreel);
      }
    }

    window.addEventListener("scroll", requestUpdate, {
      passive: true
    });

    window.addEventListener("resize", requestUpdate);

    if (image.complete) {
      updateShowreel();
    } else {
      image.addEventListener("load", requestUpdate, { once: true });
      image.addEventListener("error", () => {
        console.error("Showreel image could not be loaded.");
      }, { once: true });
    }
  }

  // =========================================
  // VIDEO MODAL: OPEN AND CLOSE IN SAME TAB
  // =========================================

  function openVideo() {
    if (!videoModal || !videoPlayer) return;

    videoModal.classList.add("is-open");
    videoModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("showreel-video-open");

    const promise = videoPlayer.play();

    if (promise) {
      promise.catch((error) => {
        console.warn(
          "Video could not autoplay. Press play in the video controls.",
          error
        );
      });
    }
  }

  function closeVideo() {
    if (!videoModal || !videoPlayer) return;

    videoPlayer.pause();

    try {
      videoPlayer.currentTime = 0;
    } catch (error) {
      console.warn("Could not reset video position.", error);
    }

    videoModal.classList.remove("is-open");
    videoModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("showreel-video-open");
  }

  playButton?.addEventListener("click", openVideo);
  closeButton?.addEventListener("click", closeVideo);

  // Close with Escape key
  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      videoModal?.classList.contains("is-open")
    ) {
      closeVideo();
    }
  });
});

/* =====================================
   PROJECTS SCROLL REVEAL
===================================== */
document.addEventListener("DOMContentLoaded", () => {
  const projectsSection = document.querySelector("#projects");
  const heading = document.querySelector("#projects .projects-heading h2");
  const projectCards = document.querySelectorAll(
    "#projects .project-card"
  );

  if (!projectsSection || !heading) return;

  const clamp = (value, min, max) =>
    Math.min(Math.max(value, min), max);

  const easeOut = (t) => 1 - Math.pow(1 - t, 3);

  let ticking = false;

  function updateHeadingZoom() {
    ticking = false;

    const rect = projectsSection.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    // Progress from when Projects enters the viewport
    const start = viewportHeight * 0.85;
    const end = viewportHeight * 0.15;

    const distance = rect.height + start - end;

    const progress = clamp(
      (start - rect.top) / Math.max(distance, 1),
      0,
      1
    );

    // Zoom from small to normal size
    const zoomProgress = easeOut(
      clamp(progress / 0.45, 0, 1)
    );

    const scale = 0.45 + (1 - 0.45) * zoomProgress;

    heading.style.transform = `scale(${scale})`;
  }

  function requestHeadingUpdate() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(updateHeadingZoom);
    }
  }

  window.addEventListener("scroll", requestHeadingUpdate, {
    passive: true
  });

  window.addEventListener("resize", requestHeadingUpdate);

  updateHeadingZoom();

  // Reveal project cards on scroll
  if (
    projectCards.length &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    const observer = new IntersectionObserver(
      (entries, observerInstance) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const index = [...projectCards].indexOf(entry.target);

          entry.target.style.transitionDelay =
            `${(index % 2) * 120}ms`;

          entry.target.classList.add("is-revealed");
          observerInstance.unobserve(entry.target);
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px"
      }
    );

    projectCards.forEach((card) => observer.observe(card));
  } else {
    projectCards.forEach((card) => {
      card.classList.add("is-revealed");
    });
  }
});


/* =========================
   AWARDS SCROLL ANIMATION
========================= */

document.addEventListener("DOMContentLoaded", () => {
  const section = document.querySelector("#scroll-awards");

  if (!section) return;

  const headingLines = section.querySelectorAll(".awards-heading span");
  const awardRows = section.querySelectorAll(".awards-row");

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
        } else {
          // Remove this line if animations should play only once.
          entry.target.classList.remove("is-visible");
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: "0px 0px -35px 0px"
    }
  );

  headingLines.forEach((line) => {
    revealObserver.observe(line);
  });

  awardRows.forEach((row, index) => {
    row.style.transitionDelay = `${index * 100}ms`;
    revealObserver.observe(row);
  });
});



/* =========================
   OUR TEAM SECTION
========================= */
document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(
    ".team-section .team-stage .team-card"
  );

  cards.forEach((card) => {
    // Clear any transforms left by the old scroll animation.
    card.style.removeProperty("transform");
    card.style.removeProperty("opacity");

    card.setAttribute("tabindex", "0");

    card.addEventListener("pointerenter", () => {
      card.classList.add("is-hovered");
    });

    card.addEventListener("pointerleave", () => {
      card.classList.remove("is-hovered");
    });

    card.addEventListener("focusin", () => {
      card.classList.add("is-hovered");
    });

    card.addEventListener("focusout", (event) => {
      if (!card.contains(event.relatedTarget)) {
        card.classList.remove("is-hovered");
      }
    });
  });
});

/* =========================
   TESTIMONIALS SECTION
========================= */

const testimonials = [

    {
        title: "I'VE TRIED MANY SIMILAR PRODUCTS, BUT NOTHING COMPARES TO THIS ONE. THE QUALITY IS TOP-NOTCH, AND I'VE SEEN REAL, NOTICEABLE RESULTS!",

        description: "We are a forward-thinking digital agency dedicated to helping brands grow, connect, and succeed in the online world. Since our beginning, we've combined creativity, strategy.",

        name: "Andrew D. Smith",
        role: "Researcher",

        image: "assets/img/testi-1.jpg",

        avatar: "assets/img/testi-1.jpg"
    },

    {
        title: "WORKING WITH THIS TEAM HAS BEEN AN ABSOLUTE GAME CHANGER FOR OUR BUSINESS AND ONLINE PRESENCE!",

        description: "Their creative approach, attention to detail, and strategic thinking helped us achieve incredible results. We couldn't be happier with the experience.",

        name: "Jessica Miller",
        role: "Marketing Director",

        image: "assets/img/testi-2.jpg",

        avatar: "assets/img/testi-2.jpg"
    },

    {
        title: "EXCEPTIONAL SERVICE, INCREDIBLE CREATIVITY, AND A TEAM THAT TRULY UNDERSTANDS WHAT YOUR BRAND NEEDS!",

        description: "From the initial consultation to the final delivery, every step was handled professionally. Their dedication and innovative ideas exceeded our expectations.",

        name: "Michael Johnson",
        role: "Business Owner",

        image: "https://plus.unsplash.com/premium_photo-1661593195372-874ca9d29713?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",

        avatar: "https://plus.unsplash.com/premium_photo-1661593195372-874ca9d29713?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D"
    }

];


/* =========================================
   ELEMENTS
========================================= */

const testimonialSlide =
    document.getElementById("testimonialSlide");

const testimonialImage =
    document.getElementById("testimonialImage");

const testimonialTitle =
    document.getElementById("testimonialTitle");

const testimonialDesc =
    document.getElementById("testimonialDesc");

const authorImage =
    document.getElementById("authorImage");

const authorName =
    document.getElementById("authorName");

const authorRole =
    document.getElementById("authorRole");

const nextButton =
    document.getElementById("nextTestimonial");

const prevButton =
    document.getElementById("prevTestimonial");


/* =========================================
   SETTINGS
========================================= */

let currentIndex = 0;
let isAnimating = false;
let autoSlide = null;

/* Change testimonial every 6 seconds */
const slideInterval = 5000;

/* Fade-out duration */
const exitDuration = 400;

/* Content entrance animation duration */
const entranceDuration = 1100;


/* =========================================
   PRELOAD IMAGES
========================================= */

testimonials.forEach((item) => {

    const mainImg = new Image();
    mainImg.src = item.image;

    const profileImg = new Image();
    profileImg.src = item.avatar;

});


/* =========================================
   CHANGE TESTIMONIAL
========================================= */

function changeTestimonial(index) {

    if (isAnimating) return;

    isAnimating = true;

    /* Remove previous entrance state */
    testimonialSlide.classList.remove("fade-in");

    /* Start smooth exit */
    testimonialSlide.classList.add("fade-out");

    setTimeout(() => {

        /* Calculate next slide */
        currentIndex =
            (index + testimonials.length) % testimonials.length;

        const data = testimonials[currentIndex];

        /* Update text content */
        testimonialTitle.textContent = data.title;

        testimonialDesc.textContent = data.description;

        authorName.textContent = data.name;

        authorRole.textContent = data.role;

        /* Update images */
        testimonialImage.src = data.image;

        authorImage.src = data.avatar;

        /* Remove exit animation */
        testimonialSlide.classList.remove("fade-out");

        /* Restart CSS animations */
        void testimonialSlide.offsetWidth;

        /* Start smooth entrance */
        testimonialSlide.classList.add("fade-in");

        /* Allow interaction after animation */
        setTimeout(() => {

            testimonialSlide.classList.remove("fade-in");

            isAnimating = false;

        }, entranceDuration);

    }, exitDuration);

}


/* =========================================
   NEXT BUTTON
========================================= */

nextButton.addEventListener("click", () => {

    if (isAnimating) return;

    changeTestimonial(currentIndex + 1);

    resetAutoSlide();

});


/* =========================================
   PREVIOUS BUTTON
========================================= */

prevButton.addEventListener("click", () => {

    if (isAnimating) return;

    changeTestimonial(currentIndex - 1);

    resetAutoSlide();

});


/* =========================================
   AUTO SLIDER
========================================= */

function startAutoSlide() {

    clearInterval(autoSlide);

    autoSlide = setInterval(() => {

        if (!isAnimating) {

            changeTestimonial(currentIndex + 1);

        }

    }, slideInterval);

}


/* =========================================
   RESET AUTO SLIDER
========================================= */

function resetAutoSlide() {

    startAutoSlide();

}


/* =========================================
   PAUSE WHEN TAB IS HIDDEN
========================================= */

document.addEventListener("visibilitychange", () => {

    if (document.hidden) {

        clearInterval(autoSlide);

    } else {

        startAutoSlide();

    }

});


/* =========================================
   START SLIDER
========================================= */

startAutoSlide();


/* =========================================
   BLOGS SECTION
========================================= */

document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".blog-card");

  cards.forEach((card) => {
    let returnTimer;

    card.addEventListener("mouseenter", () => {
      clearTimeout(returnTimer);

      // Reset first so the animation can replay every hover.
      card.classList.remove("image-moving");
      void card.offsetWidth;

      // Slide the image to the left.
      card.classList.add("image-moving");

      // Automatically return to the original position.
      returnTimer = setTimeout(() => {
        card.classList.remove("image-moving");
      }, 450);
    });

    card.addEventListener("mouseleave", () => {
      // If the mouse leaves early, return immediately.
      clearTimeout(returnTimer);
      card.classList.remove("image-moving");
    });
  });
});

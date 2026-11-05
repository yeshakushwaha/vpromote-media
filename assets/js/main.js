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

/*========================================
    Image Zoom Section
========================================*/
document.addEventListener("DOMContentLoaded", () => {
  const section = document.getElementById("videoZoomSection");

  if (!section) return;

  const stage = section.querySelector(".video-zoom-stage");
  const box = section.querySelector(".video-zoom-image");
  const image = box?.querySelector("img");

  if (!stage || !box || !image) return;

  /* =========================================
     SETTINGS
  ========================================= */

  const HEADER_HEIGHT = 80;

  const PHASE_1 = 0.34;
  const PHASE_2 = 0.55;

  let current = 0;
  let target = 0;

  let raf = null;

  /* =========================================
     RESPONSIVE SETTINGS
  ========================================= */

  function getSettings() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    const isMobile = width <= 768;
    const isSmallMobile = width <= 480;

    const startTop = isSmallMobile ? 20 : isMobile ? 20 : 20;

    const startWidth = isSmallMobile
      ? 96
      : isMobile
        ? 94
        : width <= 1024
          ? 88
          : 80;

    const normalHeight = isSmallMobile
      ? Math.min(220, height * 0.32)
      : isMobile
        ? Math.min(250, height * 0.35)
        : 270;

    /*
      Header ke neeche available
      complete screen height.
    */

    const finalHeight = Math.max(200, height - HEADER_HEIGHT);

    /*
      Responsive compressed height.
    */

    const compressedHeight = Math.min(82, finalHeight * 0.18);

    return {
      startTop,
      startWidth,
      normalHeight,
      finalHeight,
      compressedHeight,
    };
  }

  /* =========================================
     HELPERS
  ========================================= */

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function ease(t) {
    return t * t * (3 - 2 * t);
  }

  /* =========================================
     SCROLL PROGRESS
  ========================================= */

  function getProgress() {
    const rect = section.getBoundingClientRect();

    const scrollDistance = section.offsetHeight - stage.offsetHeight;

    if (scrollDistance <= 0) return 0;

    return clamp(-rect.top / scrollDistance, 0, 1);
  }

  /* =========================================
     ANIMATION
  ========================================= */

  function render() {
    current += (target - current) * 0.09;

    const p = clamp(current, 0, 1);

    const settings = getSettings();

    const {
      startTop,
      startWidth,
      normalHeight,
      finalHeight,
      compressedHeight,
    } = settings;

    /* =====================================
       PHASE 1
       IMAGE MOVES UPWARD
    ===================================== */

    if (p < PHASE_1) {
      let t = p / PHASE_1;

      t = ease(t);

      const top = lerp(startTop, HEADER_HEIGHT, t);

      const width = lerp(startWidth, 94, t);

      const height = normalHeight;

      const radius = lerp(16, 10, t);

      box.style.left = "auto";
      box.style.right = "0";

      box.style.top = `${top}px`;

      box.style.width = `${width}%`;

      box.style.height = `${height}px`;

      box.style.borderRadius = `${radius}px 0 0 ${radius}px`;

      image.style.transform = `scale(${lerp(1, 1.12, t)})`;
    } else if (p < PHASE_2) {

    /* =====================================
       PHASE 2
       IMAGE EXPANDS TO FULL WIDTH
    ===================================== */
      let t = (p - PHASE_1) / (PHASE_2 - PHASE_1);

      t = ease(t);

      const width = lerp(94, 100, t);

      const height = lerp(normalHeight, compressedHeight, t);

      box.style.left = "auto";
      box.style.right = "0";

      box.style.top = `${HEADER_HEIGHT}px`;

      box.style.width = `${width}%`;

      box.style.height = `${height}px`;

      box.style.borderRadius = "0px";

      image.style.transform = `scale(${lerp(1.12, 1.2, t)})`;
    } else {

    /* =====================================
       PHASE 3
       IMAGE TAKES COMPLETE AVAILABLE HEIGHT
    ===================================== */
      let t = (p - PHASE_2) / (1 - PHASE_2);

      t = ease(t);

      /*
        FULL WIDTH
      */

      box.style.left = "0";
      box.style.right = "0";

      box.style.width = "100%";

      /*
        HEADER KE JUST NEEche
      */

      box.style.top = `${HEADER_HEIGHT}px`;

      /*
        COMPLETE AVAILABLE HEIGHT

        82px -> window.innerHeight - header
      */

      const height = lerp(compressedHeight, finalHeight, t);

      box.style.height = `${height}px`;

      box.style.borderRadius = "0px";

      /*
        SECOND ZOOM
      */

      image.style.transform = `scale(${lerp(1.2, 1.32, t)})`;
    }

    /* =====================================
       CONTINUE ANIMATION
    ===================================== */

    if (Math.abs(target - current) > 0.00005) {
      raf = requestAnimationFrame(render);
    } else {
      raf = null;
    }
  }

  /* =========================================
     SCROLL
  ========================================= */

  function onScroll() {
    target = getProgress();

    if (!raf) {
      raf = requestAnimationFrame(render);
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });

  /* =========================================
     RESIZE
  ========================================= */

  window.addEventListener("resize", () => {
    target = getProgress();

    if (!raf) {
      raf = requestAnimationFrame(render);
    }
  });

  /* =========================================
     INITIAL
  ========================================= */

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
document.addEventListener("DOMContentLoaded", () => {
  const section = document.querySelector(".services-section");
  const stage = document.querySelector(".heading-scroll-space");
  const title = document.querySelector(".services-title");
  const cards = [...document.querySelectorAll(".service-card")];
  const viewAll = document.querySelector(".view-all");
  const viewRow = document.querySelector(".view-all-row");
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let pending = false;
  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
  const ease = (t) =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  function update() {
    if (!section || !stage || !title) return;
    const mobile = innerWidth <= 700;
    if (reduced) {
      title.style.transform = "scale(1)";
      title.style.opacity = "1";
      cards.forEach((card) => {
        card.style.transform = "";
        card.style.filter = "";
      });
      viewAll?.classList.add("is-visible");
      return;
    }
    if (mobile) {
      title.style.transform = "scale(1)";
      title.style.opacity = "1";
      cards.forEach((card) => {
        card.style.transform = "";
        card.style.filter = "";
        card.classList.remove("is-tilting");
      });
      return;
    }
    // Scroll-controlled title animation completes before the first card reaches its sticky position.
    const stageTop = stage.getBoundingClientRect().top + scrollY;
    const start = stageTop - innerHeight * 0.22;
    const finish = stageTop + stage.offsetHeight * 0.3;
    const p = clamp((scrollY - start) / Math.max(1, finish - start), 0, 1);
    // One continuous zoom-in only. Once the heading reaches its final size,
    // hold it there; do not start a second zoom-out phase or overlap it with cards.
    const q = ease(p);
    const scale = 0.18 + 0.82 * q;
    const opacity = 0.03 + 0.97 * q;
    const y = 18 * (1 - q);
    title.style.transform = `translate3d(0,${y}px,0) scale(${scale})`;
    title.style.opacity = String(opacity);
    // As the next card overlaps, the card beneath gently hinges backward from its top edge.
    const pinTop = 61;
    cards.forEach((card, i) => {
      const rect = card.getBoundingClientRect();
      const next = cards[i + 1];
      if (next) {
        const nr = next.getBoundingClientRect();
        const overlap = clamp(
          (pinTop + rect.height * 0.32 - nr.top) / (rect.height * 0.32),
          0,
          1,
        );
        const eased = ease(overlap);
        card.style.transform = `perspective(1400px) rotateX(${-3.2 * eased}deg) translate3d(0,${-8 * eased}px,0) scale(${1 - 0.025 * eased})`;
        card.style.filter = `brightness(${1 - 0.08 * eased})`;
        card.classList.toggle("is-tilting", overlap > 0.03);
      } else {
        card.style.transform = "";
        card.style.filter = "";
        card.classList.remove("is-tilting");
      }
    });
  }
  addEventListener(
    "scroll",
    () => {
      if (!pending) {
        requestAnimationFrame(() => {
          update();
          pending = false;
        });
        pending = true;
      }
    },
    { passive: true },
  );
  addEventListener("resize", update);
  update();
  // CTA enters when the area after the third card reaches the viewport.
  if (viewRow && viewAll && "IntersectionObserver" in window) {
    const ctaObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) viewAll.classList.add("is-visible");
          else if (entry.boundingClientRect.top > innerHeight)
            viewAll.classList.remove("is-visible");
        });
      },
      { threshold: 0.18, rootMargin: "0px 0px -8% 0px" },
    );
    ctaObserver.observe(viewRow);
  } else viewAll?.classList.add("is-visible");
  const menu = document.querySelector(".menu");
  menu?.addEventListener("click", () => {
    const nav = document.querySelector(".nav-links");
    const open = nav.dataset.open === "1";
    nav.dataset.open = open ? "0" : "1";
    Object.assign(
      nav.style,
      open
        ? { display: "" }
        : {
            display: "flex",
            position: "absolute",
            top: "56px",
            left: "0",
            right: "0",
            padding: "18px",
            background: "#13202d",
            flexDirection: "column",
            gap: "18px",
          },
    );
  });
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
    track &&
    stage &&
    content &&
    placeholder &&
    imageLayer &&
    image &&
    shade &&
    overlay
  ) {
    let ticking = false;

    const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

    const smooth = (t) => t * t * (3 - 2 * t);

    function updateShowreel() {
      ticking = false;

      const trackRect = track.getBoundingClientRect();

      // Scroll progress across the pinned Showreel section
      const scrollDistance = Math.max(
        track.offsetHeight - stage.offsetHeight,
        1,
      );

      const progress = clamp(-trackRect.top / scrollDistance, 0, 1);

      const stageRect = stage.getBoundingClientRect();
      const placeholderRect = placeholder.getBoundingClientRect();

      // Thumbnail position relative to the fullscreen stage
      const startLeft = placeholderRect.left - stageRect.left;
      const startTop = placeholderRect.top - stageRect.top;
      const startWidth = placeholderRect.width;
      const startHeight = placeholderRect.height;

      // Zoom completes early, then stays fullscreen
      const zoomEnd = 0.42;
      const zoomProgress = smooth(clamp(progress / zoomEnd, 0, 1));

      const left = startLeft * (1 - zoomProgress);
      const top = startTop * (1 - zoomProgress);

      const width =
        startWidth + (stage.clientWidth - startWidth) * zoomProgress;

      const height =
        startHeight + (stage.clientHeight - startHeight) * zoomProgress;

      Object.assign(imageLayer.style, {
        left: `${left}px`,
        top: `${top}px`,
        width: `${width}px`,
        height: `${height}px`,
        borderRadius: `${15 * (1 - zoomProgress)}px`,
      });

      // Fade out the original copyright row
      content.style.opacity = String(1 - smooth(clamp(progress / 0.14, 0, 1)));

      // Subtle darkening toward the next section
      const darkProgress = smooth(clamp((progress - 0.58) / 0.38, 0, 1));

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
      passive: true,
    });

    window.addEventListener("resize", requestUpdate);

    if (image.complete) {
      updateShowreel();
    } else {
      image.addEventListener("load", requestUpdate, { once: true });
      image.addEventListener(
        "error",
        () => {
          console.error("Showreel image could not be loaded.");
        },
        { once: true },
      );
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
          error,
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
    if (event.key === "Escape" && videoModal?.classList.contains("is-open")) {
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
  const projectCards = document.querySelectorAll("#projects .project-card");

  if (!projectsSection || !heading) return;

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

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

    const progress = clamp((start - rect.top) / Math.max(distance, 1), 0, 1);

    // Zoom from small to normal size
    const zoomProgress = easeOut(clamp(progress / 0.45, 0, 1));

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
    passive: true,
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

          entry.target.style.transitionDelay = `${(index % 2) * 120}ms`;

          entry.target.classList.add("is-revealed");
          observerInstance.unobserve(entry.target);
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px",
      },
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
      rootMargin: "0px 0px -35px 0px",
    },
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
  const heading = document.querySelector(".team-heading");
  const members = document.querySelectorAll(".team-grid .member");

  // Respect accessibility preferences
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  // Show content immediately if animations are disabled
  if (reduceMotion || !("IntersectionObserver" in window)) {
    heading?.classList.add("is-visible");

    members.forEach((member) => {
      member.classList.add("is-visible");
    });

    return;
  }

  // Heading reveal
  if (heading) {
    const headingObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
      },
    );

    headingObserver.observe(heading);
  }

  // Staggered card reveal
  const cardObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const member = entry.target;
          const index = Number(member.dataset.index || 0);

          window.setTimeout(
            () => {
              member.classList.add("is-visible");
            },
            (index % 3) * 130,
          );

          observer.unobserve(member);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -25px 0px",
    },
  );

  members.forEach((member, index) => {
    member.dataset.index = index;
    cardObserver.observe(member);
  });

  // Graceful handling of missing image paths
  document.querySelectorAll(".team-grid .photo img").forEach((img) => {
    img.addEventListener(
      "error",
      () => {
        img.style.display = "none";
        img.parentElement.style.background =
          "linear-gradient(135deg, #deddd5, #aaa99f)";
      },
      { once: true },
    );
  });
});

/* =========================
   TESTIMONIALS SECTION
========================= */

/* =========================================
   TESTIMONIAL SECTION
   Automatic Slider + Navigation
========================================= */

document.addEventListener("DOMContentLoaded", () => {
  const title = document.getElementById("testimonialTitle");
  const name = document.getElementById("testimonialName");
  const role = document.getElementById("testimonialRole");
  const count = document.getElementById("testimonialCount");

  const prev = document.getElementById("testimonialPrev");
  const next = document.getElementById("testimonialNext");

  const glassCard = document.querySelector(".testimonial-glass-card");

  const testimonialSection = document.querySelector(".testimonial-section");

  if (!title || !name || !role || !count || !prev || !next || !glassCard) {
    return;
  }

  /* =====================================
     TESTIMONIAL DATA
  ===================================== */

  const testimonials = [
    {
      title:
        "The team at VPromote Media really listens. They don’t just push templates, they came up with campaigns that felt tailored for our brand.",

      name: "Ritika",

      role: "Brand Manager",
    },

    {
      title:
        "I run a small business and was worried digital marketing would be too expensive or complex. VPromote Media made it simple, affordable, and effective - I actually saw results in just a few weeks.",

      name: "Arjun",

      role: "Entrepreneur",
    },

    {
      title:
        "Whenever I’ve had last-minute requirements, VPromote Media has stepped up. Their flexibility and quick turnaround are something I rely on a lot.",

      name: "Megha",

      role: "Event Coordinator",
    },

    {
      title:
        "VPromote Media has been one of the easiest vendors to work with. They’re quick, professional, and always deliver on time. It saves me so much hassle knowing I can count on them.",

      name: "Sakshi",

      role: "Marketing Executive",
    },

    {
      title:
        "We needed design renders for our projects and the team understood exactly what we were looking for. The designs were creative and practical, which made our work so much easier.",

      name: "Samir",

      role: "Operations Manager",
    },

    {
      title:
        "I had no idea what SEO really meant before working with VPromote Media. They explained everything in simple terms and guided me step by step. Now our content actually ranks!",

      name: "Saloni",

      role: "Content Writer",
    },

    {
      title:
        "It has been a privilege working with VPromote Media Digital Marketing Agency for the past four years. Your professionalism, creativity, and dedication have consistently impressed us at IndiaZakat.",

      name: "Sania Nusrat",

      role: "Communication Manager",
    },

    {
      title:
        "Working with Ashish and Swati have been a breeze. They are responsive, receptive to feedback, and always go the extra mile to ensure client satisfaction. Their expertise in digital marketing and design has been instrumental in enhancing our brand visibility and engagement. Thank you, Ashish and Swati, for your outstanding work and dedication!",

      name: "Farhat Maniyar",

      role: "Operations Manager",
    },
  ];

  /* =====================================
     SLIDER SETTINGS
  ===================================== */

  let currentIndex = 0;

  let autoSlide = null;

  let isAnimating = false;

  const slideDuration = 5000;

  /* =====================================
     UPDATE TESTIMONIAL CONTENT
  ===================================== */

  function updateContent(index) {
    const item = testimonials[index];

    title.textContent = item.title;

    name.textContent = item.name;

    role.textContent = item.role;

    count.textContent =
      `${String(index + 1).padStart(2, "0")} / ` +
      `${String(testimonials.length).padStart(2, "0")}`;
  }

  /* =====================================
     SHOW TESTIMONIAL
  ===================================== */

  function showTestimonial(index) {
    if (isAnimating || index === currentIndex) {
      return;
    }

    isAnimating = true;

    glassCard.classList.add("is-changing");

    setTimeout(() => {
      currentIndex = index;

      updateContent(currentIndex);

      glassCard.classList.remove("is-changing");

      isAnimating = false;
    }, 250);
  }

  /* =====================================
     NEXT TESTIMONIAL
  ===================================== */

  function nextTestimonial() {
    const nextIndex = (currentIndex + 1) % testimonials.length;

    showTestimonial(nextIndex);
  }

  /* =====================================
     PREVIOUS TESTIMONIAL
  ===================================== */

  function previousTestimonial() {
    const prevIndex =
      (currentIndex - 1 + testimonials.length) % testimonials.length;

    showTestimonial(prevIndex);
  }

  /* =====================================
     AUTOMATIC SLIDER
  ===================================== */

  function startAutoSlide() {
    stopAutoSlide();

    autoSlide = setInterval(() => {
      nextTestimonial();
    }, slideDuration);
  }

  function stopAutoSlide() {
    if (autoSlide) {
      clearInterval(autoSlide);

      autoSlide = null;
    }
  }

  /* =====================================
     NAVIGATION EVENTS
  ===================================== */

  next.addEventListener("click", () => {
    nextTestimonial();

    startAutoSlide();
  });

  prev.addEventListener("click", () => {
    previousTestimonial();

    startAutoSlide();
  });

  /* =====================================
     PAUSE ON HOVER
  ===================================== */

  glassCard.addEventListener("mouseenter", () => {
    stopAutoSlide();
  });

  glassCard.addEventListener("mouseleave", () => {
    startAutoSlide();
  });

  /* =====================================
     PAUSE ON KEYBOARD FOCUS
  ===================================== */

  testimonialSection.addEventListener("focusin", () => {
    stopAutoSlide();
  });

  testimonialSection.addEventListener("focusout", (event) => {
    if (!testimonialSection.contains(event.relatedTarget)) {
      startAutoSlide();
    }
  });

  /* =====================================
     INITIALISE SLIDER
  ===================================== */

  updateContent(currentIndex);

  startAutoSlide();
});

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


/* ============================
   NEWSLETTER FORM - WEB3FORMS
============================ */

document.addEventListener("DOMContentLoaded", () => {
  const newsletterForm = document.getElementById("newsletterForm");
  const newsletterEmail = document.getElementById("newsletterEmail");
  const subscribeBtn = document.getElementById("subscribeBtn");
  const ctaMessage = document.getElementById("ctaMessage");

  if (!newsletterForm) return;

  newsletterForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = newsletterEmail.value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      ctaMessage.textContent = "Please enter a valid email address.";
      ctaMessage.className = "cta-message error";
      newsletterEmail.focus();
      return;
    }

    subscribeBtn.disabled = true;
    subscribeBtn.textContent = "Subscribing...";
    ctaMessage.textContent = "";
    ctaMessage.className = "cta-message";

    const controller = new AbortController();

    const timeout = setTimeout(() => {
      controller.abort();
    }, 15000);

    try {
      const formData = new FormData();

      formData.append(
        "access_key",
        "4ec2990e-d7fe-4493-bfc0-197c317964f2"
      );

      formData.append("email", email);
      formData.append(
        "subject",
        "New Newsletter Subscriber - VPromote Media"
      );
      formData.append("from_name", "VPromote Media");

      const response = await fetch(
        "https://api.web3forms.com/submit",
        {
          method: "POST",
          body: formData,
          signal: controller.signal
        }
      );

      const result = await response.json();

      console.log("Web3Forms Response:", result);

      if (!response.ok || result.success !== true) {
        throw new Error(
          result.message || "Unable to submit your email."
        );
      }

      ctaMessage.textContent =
        "Thank you! You have successfully subscribed.";

      ctaMessage.className = "cta-message success";

      newsletterForm.reset();

    } catch (error) {
      console.error("Newsletter Error:", error);

      if (error.name === "AbortError") {
        ctaMessage.textContent =
          "Request timed out. Please check your connection and try again.";
      } else {
        ctaMessage.textContent =
          error.message || "Something went wrong. Please try again.";
      }

      ctaMessage.className = "cta-message error";

    } finally {
      clearTimeout(timeout);

      subscribeBtn.disabled = false;
      subscribeBtn.textContent = "Subscribe";
    }
  });
});


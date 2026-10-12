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
document.addEventListener(
  "DOMContentLoaded",
  () => {

    /* ===================================================
       ELEMENTS
    =================================================== */

    const services =
      document.querySelector(
        ".services"
      );

    const heading =
      document.querySelector(
        ".services-title"
      );

    const cards =
      [
        ...document.querySelectorAll(
          ".service-card"
        )
      ];


    if (!services) return;


    /* ===================================================
       HEADING ENTRANCE
    =================================================== */

    const headingObserver =
      new IntersectionObserver(
        (entries) => {

          entries.forEach(
            (entry) => {

              if (
                entry.isIntersecting
              ) {

                services.classList.add(
                  "is-visible"
                );

                headingObserver.unobserve(
                  entry.target
                );

              }

            }
          );

        },
        {
          threshold: 0.08
        }
      );


    headingObserver.observe(
      services
    );


    /* ===================================================
       SMOOTH SCROLL ENGINE
    =================================================== */

    let currentScroll =
      window.scrollY;

    let targetScroll =
      window.scrollY;

    let ticking =
      false;


    /*
      Lower number =
      slower and smoother.

      0.085 gives a cinematic
      smooth scrolling effect.
    */

    const smoothness =
      0.085;


    /* ===================================================
       STICKY TOP
    =================================================== */

    function getStickyTop() {

      const width =
        window.innerWidth;


      if (width <= 700) {

        return 20;

      }


      if (width <= 1000) {

        return 55;

      }


      return 68;

    }


    /* ===================================================
       UPDATE TARGET SCROLL
    =================================================== */

    function updateTarget() {

      targetScroll =
        window.scrollY;


      if (!ticking) {

        ticking =
          true;

        requestAnimationFrame(
          smoothAnimation
        );

      }

    }


    /* ===================================================
       MAIN SMOOTH ANIMATION
    =================================================== */

    function smoothAnimation() {

      currentScroll +=
        (
          targetScroll -
          currentScroll
        ) *
        smoothness;


      /*
        Finish tiny remaining movement.
      */

      if (
        Math.abs(
          targetScroll -
          currentScroll
        ) < 0.025
      ) {

        currentScroll =
          targetScroll;

      }


      updateHeading();

      updateCards();


      /*
        Continue animation while
        scroll is settling.
      */

      if (
        Math.abs(
          targetScroll -
          currentScroll
        ) > 0.025
      ) {

        requestAnimationFrame(
          smoothAnimation
        );

      } else {

        ticking =
          false;

      }

    }


    /* ===================================================
       HEADING SCROLL ANIMATION
    =================================================== */

    function updateHeading() {

      if (!heading) return;


      const sectionTop =
        services.offsetTop;


      const relativeScroll =
        currentScroll -
        sectionTop;


      /*
        Heading movement area.
      */

      let progress =
        relativeScroll /
        620;


      progress =
        Math.max(
          0,
          Math.min(
            1,
            progress
          )
        );


      /*
        Premium cubic easing.
      */

      const eased =
        1 -
        Math.pow(
          1 - progress,
          3
        );


      /* -----------------------------------------------
         MOVE UP
      ------------------------------------------------ */

      const y =
        eased * -36;


      /* -----------------------------------------------
         HEADING SCALE

         1.00
           ↓
         1.055
           ↓
         1.025
      ------------------------------------------------ */

      let scale;


      if (
        progress < 0.45
      ) {

        const grow =
          progress /
          0.45;


        scale =
          1 +
          grow *
          0.055;

      } else {

        const settle =
          (
            progress -
            0.45
          ) /
          0.55;


        scale =
          1.055 -
          settle *
          0.030;

      }


      /* -----------------------------------------------
         SUBTLE VERTICAL STRETCH
      ------------------------------------------------ */

      const stretch =
        1 +
        Math.sin(
          progress *
          Math.PI
        ) *
        0.014;


      /* -----------------------------------------------
         APPLY
      ------------------------------------------------ */

      if (
        services.classList.contains(
          "is-visible"
        )
      ) {

        heading.style.transform =
          "translate3d(0, " + y + "px, 0) scale(" +
          scale + ", " + (scale * stretch) + ")";

      }

    }


    /* ===================================================
       CARD ANIMATION
    =================================================== */

    function updateCards() {

      const stickyTop =
        getStickyTop();


      cards.forEach(
        (card) => {

          /*
            Original card position.
          */

          const cardTop =
            card.offsetTop;


          /*
            Smooth viewport position.
          */

          const relativeTop =
            cardTop -
            currentScroll;


          /*
            Keep card transform neutral.
            CSS sticky handles stacking.
          */

          card.style.transform =
            "translate3d(0, 0, 0)";


          /* ===========================================
             IMAGE
          =========================================== */

          const image =
            card.querySelector(
              ".service-image img"
            );


          if (!image) return;


          /*
            Image parallax progress.
          */

          let imageProgress =
            (
              relativeTop -
              stickyTop
            ) /
            window.innerHeight;


          imageProgress =
            Math.max(
              -1,
              Math.min(
                1,
                imageProgress
              )
            );


          /*
            Very subtle movement.
          */

          const imageMove =
            imageProgress *
            6;


          /*
            IMPORTANT:

            Do NOT use:

            image.style.transform

            because that would overwrite
            CSS hover zoom.

            We only update the CSS variable.
          */

          image.style.setProperty(
            "--image-y",
            `${imageMove}px`
          );

        }
      );

    }


    /* ===================================================
       SCROLL EVENT
    =================================================== */

    window.addEventListener(
      "scroll",
      updateTarget,
      {
        passive: true
      }
    );


    /* ===================================================
       RESIZE
    =================================================== */

    window.addEventListener(
      "resize",
      () => {

        targetScroll =
          window.scrollY;

        currentScroll =
          window.scrollY;


        updateHeading();

        updateCards();

      }
    );


    /* ===================================================
       TAG HOVER
    =================================================== */

    const tags =
      document.querySelectorAll(
        ".service-tags span"
      );


    tags.forEach(
      (tag) => {

        tag.addEventListener(
          "mouseenter",
          () => {

            tag.style.transform =
              "translateY(-3px) scale(1.03)";

          }
        );


        tag.addEventListener(
          "mouseleave",
          () => {

            tag.style.transform =
              "translateY(0) scale(1)";

          }
        );

      }
    );


    /* ===================================================
       INITIAL
    =================================================== */

    services.classList.add(
      "is-visible"
    );


    updateHeading();

    updateCards();


    /* ===================================================
       REDUCED MOTION
    =================================================== */

    const reducedMotion =
      window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      );


    if (
      reducedMotion.matches
    ) {

      services.classList.add(
        "is-visible"
      );

      currentScroll =
        window.scrollY;

      targetScroll =
        window.scrollY;

    }

  }
);

/* =========================
   WORK RESULTS ANIMATION
========================= */
document.addEventListener("DOMContentLoaded", () => {

  const section = document.querySelector(".work-results");

  if (!section) return;

  const content = section.querySelector(".work-results-content");
  const cards = section.querySelectorAll(".skill-card");

  // Initial state
  content.style.opacity = "0";
  content.style.transform = "translateY(25px)";
  content.style.transition =
    "opacity .8s ease, transform .8s ease";

  cards.forEach((card, index) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(40px)";
    card.style.transition =
      `opacity .7s ease ${index * .12}s,
       transform .7s ease ${index * .12}s`;
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {

          content.style.opacity = "1";
          content.style.transform = "translateY(0)";

          cards.forEach(card => {
            card.style.opacity = "1";
            card.style.transform = "translateY(0)";
          });

          observer.unobserve(section);
        }
      });
    },
    { threshold: 0.15 }
  );

  observer.observe(section);

});













(() => {

  const section = document.querySelector("#showreel");

  if (!section) return;

  const media = section.querySelector(".media-wrap");
  const line = section.querySelector(".showreel-line");
  const copyright = section.querySelector(".copyright");
  const showreel = section.querySelector(".showreel-word");

  let ticking = false;

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function update() {

    ticking = false;

    const rect = section.getBoundingClientRect();
    const viewport = window.innerHeight;

    const start = viewport * 0.88;
    const end = -viewport * 0.18;

    let progress =
      (start - rect.top) /
      (start - end);

    progress = clamp(progress, 0, 1);

    /*
      Smooth ease-out animation
    */
    const eased =
      1 - Math.pow(1 - progress, 3);

    /*
      Initial dimensions
    */
    const smallWidth =
      Math.min(
        190,
        Math.max(110, window.innerWidth * 0.125)
      );

    const smallHeight =
      Math.min(
        72,
        Math.max(46, window.innerWidth * 0.048)
      );

    /*
      Final dimensions
    */
    const finalWidth =
      Math.min(window.innerWidth, 1000);

    const finalHeight =
      Math.min(window.innerHeight * 0.55, 430);

    /*
      Animate image size
    */
    const width =
      smallWidth +
      (finalWidth - smallWidth) * eased;

    const height =
      smallHeight +
      (finalHeight - smallHeight) * eased;

    media.style.width = `${width}px`;
    media.style.height = `${height}px`;

    /*
      Rounded → almost square corners
    */
    const radius =
      13 - (13 * eased);

    media.style.borderRadius =
      `${radius}px`;

    /*
      Text moves slightly upward
    */
    line.style.transform =
      `translateY(${35 - eased * 35}px)`;

    /*
      Text gradually fades behind the image
    */
    let textOpacity = 1;

    if (eased > 0.70) {
      textOpacity =
        1 - ((eased - 0.70) / 0.30);
    }

    copyright.style.opacity =
      Math.max(0, textOpacity);

    showreel.style.opacity =
      Math.max(0, textOpacity);

    /*
      Final image movement
    */
    const y =
      eased > 0.72
        ? -(eased - 0.72) * 34
        : 0;

    media.style.transform =
      `translateY(${y}px) scale(${1 + eased * 0.02})`;
  }

  function requestUpdate() {

    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }

  }

  window.addEventListener(
    "scroll",
    requestUpdate,
    { passive: true }
  );

  window.addEventListener(
    "resize",
    requestUpdate
  );

  update();

})();
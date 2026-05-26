document.addEventListener("DOMContentLoaded", () => {
  ensureStylesheet("header.css");
  loadComponent("header", "header.html");
  loadComponent("footer", "footer.html");
  setupSlideshow();
  setupContactForm();
  setupProductAccordions();
  setupBreadcrumbs();
  setupFaqAccordions();
});

function ensureStylesheet(filePath) {
  const normalizedPath = filePath.replace(/^\.\//, "");
  const alreadyLoaded = Array.from(document.querySelectorAll('link[rel="stylesheet"]'))
    .some((link) => {
      const href = link.getAttribute("href") || "";
      return href.replace(/^\.\//, "") === normalizedPath || link.href.endsWith(normalizedPath);
    });

  if (alreadyLoaded) return;

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = filePath;
  document.head.appendChild(link);
}

function loadComponent(elementId, filePath) {
  const target = document.getElementById(elementId);
  if (!target) return;

  fetch(filePath)
    .then((response) => {
      if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
      return response.text();
    })
    .then((html) => {
      target.innerHTML = html;

      if (elementId === "header") {
        setupMobileMenu();
        setupDropdowns();
      }

      if (elementId === "footer") {
        setupScrollToTop();
      }
    })
    .catch((error) => console.error(`Error loading ${filePath}:`, error));
}

function setupMobileMenu() {
  const mobileMenuBtn = document.getElementById("mobile-menu-btn");
  const mainMenu = document.querySelector(".main-menu");
  if (!mobileMenuBtn || !mainMenu) return;

  mobileMenuBtn.onclick = (event) => {
    event.stopPropagation();
    mainMenu.classList.toggle("show");
  };

  document.addEventListener("click", (event) => {
    if (!mainMenu.contains(event.target) && !mobileMenuBtn.contains(event.target)) {
      mainMenu.classList.remove("show");
    }
  });
}

function setupDropdowns() {
  document.querySelectorAll(".panel-dropdown").forEach((dropdown) => {
    const trigger = dropdown.querySelector(":scope > a");
    const panel = dropdown.querySelector(".dropdown-panel");
    if (!trigger || !panel) return;

    trigger.addEventListener("click", (event) => {
      if (window.innerWidth > 1220) return;

      if (!dropdown.classList.contains("active")) {
        event.preventDefault();
        closeAllDropdowns();
        dropdown.classList.add("active");
      }
    });
  });
}

function closeAllDropdowns() {
  document.querySelectorAll(".panel-dropdown.active").forEach((dropdown) => {
    dropdown.classList.remove("active");
  });
}

function setupScrollToTop() {
  const scrollToTopBtn = document.getElementById("scrollToTop");
  if (!scrollToTopBtn) return;

  scrollToTopBtn.style.display = "none";

  window.addEventListener("scroll", () => {
    scrollToTopBtn.style.display = window.scrollY > 300 ? "flex" : "none";
  });

  scrollToTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

function setupSlideshow() {
  const slides = document.querySelectorAll(".slide");
  const dots = document.querySelectorAll(".dot");
  if (!slides.length || !dots.length) return;

  let slideIndex = 0;

  function showSlides(index) {
    slides.forEach((slide) => (slide.style.display = "none"));
    dots.forEach((dot) => dot.classList.remove("active"));

    slideIndex = typeof index === "number" ? index : (slideIndex + 1) % slides.length;
    slides[slideIndex].style.display = "block";
    dots[slideIndex]?.classList.add("active");
  }

  window.currentSlide = (n) => showSlides(n - 1);
  showSlides(0);
  setInterval(() => showSlides(), 5000);
}

function setupContactForm() {
  const contactForm = document.getElementById("contactForm");
  if (!contactForm) return;

  contactForm.addEventListener("submit", handleFormSubmit);
}

function handleFormSubmit(event) {
  event.preventDefault();

  const name = document.querySelector('input[name="name"]')?.value || "";
  const email = document.querySelector('input[name="email"]')?.value || "";
  const message = document.querySelector('textarea[name="message"]')?.value || "";
  const googleFormURL = "https://docs.google.com/forms/d/e/1FAIpQLSfvgBtlywPrt8U2B-tcWF9XJ6KeaGMcVTIskdfVehGPEJv1RA/formResponse";

  const formData = new FormData();
  formData.append("entry.856552114", name);
  formData.append("entry.416083448", email);
  formData.append("entry.533288431", message);

  fetch(googleFormURL, {
    method: "POST",
    body: formData,
    mode: "no-cors"
  }).then(() => {
    alert("Thank you! Your message has been submitted successfully.");
    event.target.reset();
  }).catch((error) => console.error("Error:", error));
}

function setupProductAccordions() {
  document.querySelectorAll(".accordion-item").forEach((item) => {
    item.classList.add("active");
    const content = item.querySelector(".accordion-content");
    if (content) content.style.display = "block";
  });
}

function setupBreadcrumbs() {
  const breadcrumbContainer = document.querySelector("#dynamic-breadcrumbs");
  if (!breadcrumbContainer) return;

  const page = window.location.pathname.split("/").pop() || "index.html";
  const parentMap = {
    "complete_project.html": { name: "Video Gallery", url: "video-gallery.html" },
    "digital-flex-printing-machines.html": { name: "Digital Printers", url: "digital-printing-machines.html" },
    "eco-solvent-printing-machines.html": { name: "Digital Printers", url: "digital-printing-machines.html" },
    "uv-flatbed-printing-machines.html": { name: "Digital Printers", url: "digital-printing-machines.html" },
    "hybrid-uv-printing-machines.html": { name: "Digital Printers", url: "digital-printing-machines.html" },
    "uv-roll-to-roll-printers.html": { name: "Digital Printers", url: "digital-printing-machines.html" },
    "aethra-512i-a8-flex-printing-machines.html": { name: "Flex Printing Machines", url: "digital-flex-printing-machines.html" },
    "aethra-512i-a8-plus-flex-printing-machines.html": { name: "Flex Printing Machines", url: "digital-flex-printing-machines.html" },
    "aethra-1024i-a8-plus-flex-printing-machines.html": { name: "Flex Printing Machines", url: "digital-flex-printing-machines.html" },
    "aethra-1024i-r8i-flex-printing-machines.html": { name: "Flex Printing Machines", url: "digital-flex-printing-machines.html" },
    "aethra-c8-flex-printing-machines.html": { name: "Flex Printing Machines", url: "digital-flex-printing-machines.html" },
    "aethra-starfire-as4-flex-printing-machines.html": { name: "Flex Printing Machines", url: "digital-flex-printing-machines.html" },
    "allwin-512i-flex-printing-machines.html": { name: "Flex Printing Machines", url: "digital-flex-printing-machines.html" },
    "allwin-1024i-c8-plus-flex-printing-machines.html": { name: "Flex Printing Machines", url: "digital-flex-printing-machines.html" },
    "konica-512-42pl-flex-printing-machines.html": { name: "Flex Printing Machines", url: "digital-flex-printing-machines.html" },
    "konica-512i-30pl-flex-printing-machines.html": { name: "Flex Printing Machines", url: "digital-flex-printing-machines.html" },
    "4x8-cnc-router-machines.html": { name: "CNC Router Machines", url: "cnc-router-machines.html" },
    "5x10-cnc-router-machines.html": { name: "CNC Router Machines", url: "cnc-router-machines.html" },
    "double-spindle-cnc-router-machines.html": { name: "CNC Router Machines", url: "cnc-router-machines.html" },
    "cnc-stone-pattern-making-machines.html": { name: "CNC Router Machines", url: "cnc-router-machines.html" },
    "cnc-laser-cutting-machines-2x3.html": { name: "CNC Laser Cutting Machines", url: "cnc-laser-cutting-machines.html" },
    "cnc-laser-cutting-machines-4x3.html": { name: "CNC Laser Cutting Machines", url: "cnc-laser-cutting-machines.html" },
    "cnc-laser-cutting-machines-4x4.html": { name: "CNC Laser Cutting Machines", url: "cnc-laser-cutting-machines.html" },
    "cnc-laser-cutting-machines-8x4..html": { name: "CNC Laser Cutting Machines", url: "cnc-laser-cutting-machines.html" },
    "ccd-cnc-laser-cutting-machines.html": { name: "CNC Laser Cutting Machines", url: "cnc-laser-cutting-machines.html" },
    "cnc-fiber-laser-cutting-machines.html": { name: "CNC Laser Cutting Machines", url: "cnc-laser-cutting-machines.html" },
    "cnc-aluminium-channel-bending-machines.html": { name: "CNC Channel Bending Machines", url: "cnc-channel-bending-machines.html" },
    "indoor-led-display-screen.html": { name: "LED Displays", url: "led-display-screen.html" },
    "outdoor-led-display-screen.html": { name: "LED Displays", url: "led-display-screen.html" },
    "vehicle-led-display-screen.html": { name: "LED Displays", url: "led-display-screen.html" },
    "led-display-rental-services.html": { name: "LED Displays", url: "led-display-screen.html" },
    "1-8m-uv-hybrid-printers.html": { name: "UV Hybrid Printers", url: "hybrid-uv-printing-machines.html" },
    "3-2m-uv-hybrid-printers.html": { name: "UV Hybrid Printers", url: "hybrid-uv-printing-machines.html" },
    "2x3-uv-flatbed-printers.html": { name: "UV Flatbed Printers", url: "uv-flatbed-printing-machines.html" },
    "3x5-uv-flatbed-printers.html": { name: "UV Flatbed Printers", url: "uv-flatbed-printing-machines.html" },
    "8x4-uv-flatbed-printers.html": { name: "UV Flatbed Printers", url: "uv-flatbed-printing-machines.html" },
    "single-head-uv-roll-to-roll-printers.html": { name: "UV Roll-to-Roll Printers", url: "uv-roll-to-roll-printers.html" },
    "double-head-uv-roll-to-roll-printers.html": { name: "UV Roll-to-Roll Printers", url: "uv-roll-to-roll-printers.html" },
    "four-head-uv-roll-to-roll-printers.html": { name: "UV Roll-to-Roll Printers", url: "uv-roll-to-roll-printers.html" },
    "3-2m-double-head-uv-roll-to-roll-printers.html": { name: "UV Roll-to-Roll Printers", url: "uv-roll-to-roll-printers.html" },
    "3-2m-four-head-uv-roll-to-roll-printers.html": { name: "UV Roll-to-Roll Printers", url: "uv-roll-to-roll-printers.html" },
    "gethray-1-8m-eco-solvent-printers.html": { name: "Eco Solvent Printers", url: "eco-solvent-printing-machines.html" },
    "gethray-3-2m-eco-solvent-printers.html": { name: "Eco Solvent Printers", url: "eco-solvent-printing-machines.html" }
  };

  const current = getPageLabel();
  const parent = parentMap[page];
  let html = '<ul><li><a href="index.html"><i class="fa-solid fa-house"></i> Home</a></li>';

  if (parent) {
    html += `<li class="separator">/</li><li><a href="${parent.url}">${parent.name}</a></li>`;
  }

  if (page !== "index.html") {
    html += `<li class="separator">/</li><li class="active">${current}</li>`;
  }

  html += "</ul>";
  breadcrumbContainer.innerHTML = html;
}

function getPageLabel() {
  const heading = document.querySelector("h1");
  if (heading?.textContent.trim()) return heading.textContent.trim();

  const title = document.title.replace(/\s*\|\s*Admark.*$/i, "").replace(/\s*-\s*Admark.*$/i, "").trim();
  return title || "Admark Digitech";
}

function setupFaqAccordions() {
  document.querySelectorAll(".faq-question").forEach((question) => {
    question.addEventListener("click", () => {
      const currentItem = question.parentElement;
      const answer = currentItem.querySelector(".faq-answer");
      if (!answer) return;

      document.querySelectorAll(".faq-item").forEach((item) => {
        if (item !== currentItem) {
          item.classList.remove("active");
          const otherAnswer = item.querySelector(".faq-answer");
          if (otherAnswer) otherAnswer.style.maxHeight = null;
        }
      });

      currentItem.classList.toggle("active");
      answer.style.maxHeight = currentItem.classList.contains("active") ? `${answer.scrollHeight}px` : null;
    });
  });
}

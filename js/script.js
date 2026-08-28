const whatsappNumber = "5511934992819";
const whatsappMessage = "Olá! Gostaria de solicitar um orçamento para um evento.";

function setupWhatsApp() {
  document.querySelectorAll(".js-whatsapp").forEach(link => {
    link.href = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  });
}

const header = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");

function closeMenu() {
  if (!menuToggle || !mainNav) return;
  menuToggle.classList.remove("active");
  mainNav.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Abrir menu");
  document.body.classList.remove("menu-open");
}

if (menuToggle && mainNav) {
  menuToggle.addEventListener("click", () => {
    const open = mainNav.classList.toggle("open");
    menuToggle.classList.toggle("active", open);
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    document.body.classList.toggle("menu-open", open);
  });
  mainNav.querySelectorAll("a").forEach(link => link.addEventListener("click", closeMenu));
}

function handleHeader() {
  header?.classList.toggle("scrolled", window.scrollY > 15);
}
window.addEventListener("scroll", handleHeader, {passive:true});
handleHeader();

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, {threshold:.12});

document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));

const counters = document.querySelectorAll(".counter");
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = Number(el.dataset.target);
    const duration = 1300;
    const start = performance.now();
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(target * eased);
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = target;
    }
    requestAnimationFrame(tick);
    counterObserver.unobserve(el);
  });
}, {threshold:.7});
counters.forEach(c => counterObserver.observe(c));

const testimonials = [...document.querySelectorAll(".testimonial")];
const dotsContainer = document.querySelector(".slider-dots");
const prev = document.querySelector(".slider-btn.prev");
const next = document.querySelector(".slider-btn.next");
let testimonialIndex = 0;

if (testimonials.length && dotsContainer) {
  testimonials.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.setAttribute("aria-label", `Mostrar depoimento ${i + 1}`);
    dot.addEventListener("click", () => showTestimonial(i));
    dotsContainer.appendChild(dot);
  });

  function showTestimonial(index) {
    testimonialIndex = (index + testimonials.length) % testimonials.length;
    testimonials.forEach((item, i) => item.classList.toggle("active", i === testimonialIndex));
    [...dotsContainer.children].forEach((dot, i) => dot.classList.toggle("active", i === testimonialIndex));
  }
  prev?.addEventListener("click", () => showTestimonial(testimonialIndex - 1));
  next?.addEventListener("click", () => showTestimonial(testimonialIndex + 1));
  showTestimonial(0);

  let sliderTimer = setInterval(() => showTestimonial(testimonialIndex + 1), 6000);
  document.querySelector(".testimonial-slider")?.addEventListener("mouseenter", () => clearInterval(sliderTimer));
}

const filters = document.querySelectorAll(".filter");
const eventCards = document.querySelectorAll(".event-card");

if (filters.length && eventCards.length) {
  filters.forEach(filter => {
    filter.addEventListener("click", () => {
      filters.forEach(btn => btn.classList.remove("active"));
      filter.classList.add("active");
      const category = filter.dataset.filter;
      eventCards.forEach(card => {
        const show = category === "todos" || card.dataset.category === category;
        card.classList.toggle("hidden", !show);
      });
    });
  });
}

const lightbox = document.querySelector(".lightbox");
const lightboxImage = document.querySelector(".lightbox-image");
const lightboxTitle = document.querySelector(".lightbox-title");
const lightboxCategory = document.querySelector(".lightbox-category");
const lightboxDescription = document.querySelector(".lightbox-description");
const lightboxClose = document.querySelector(".lightbox-close");

const lightboxPrev = document.querySelector(".lightbox-prev");
const lightboxNext = document.querySelector(".lightbox-next");

let currentGallery = [];
let currentImageIndex = 0;

function updateLightboxImage() {
  if (!lightboxImage || !currentGallery.length) return;

  const imageName = currentGallery[currentImageIndex];

  lightboxImage.src = `assets/images/${imageName}`;
  lightboxImage.alt = lightboxTitle.textContent;
}

function updateLightboxButtons() {
  if (!lightbox) return;

  if (currentGallery.length <= 1) {
    lightbox.classList.add("single-image");
  } else {
    lightbox.classList.remove("single-image");
  }
}

function showPreviousImage() {
  if (!currentGallery.length) return;

  currentImageIndex--;

  if (currentImageIndex < 0) {
    currentImageIndex = currentGallery.length - 1;
  }

  updateLightboxImage();
}

function showNextImage() {
  if (!currentGallery.length) return;

  currentImageIndex++;

  if (currentImageIndex >= currentGallery.length) {
    currentImageIndex = 0;
  }

  updateLightboxImage();
}

function closeLightbox() {
  if (!lightbox) return;

  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.classList.remove("menu-open");

  currentGallery = [];
  currentImageIndex = 0;
}

document.querySelectorAll(".event-open").forEach(button => {

  button.addEventListener("click", () => {

    if (!lightbox) return;

    const card = button.closest(".event-card");
    const img = button.querySelector("img");

    /*
      Pega as imagens definidas no
      data-images do evento
    */
    const images = card.dataset.images
      ? card.dataset.images
          .split(",")
          .map(image => image.trim())
          .filter(Boolean)
      : [];

    /*
      Caso não tenha data-images,
      utiliza a imagem principal
    */
    currentGallery = images.length
      ? images
      : [img.src.split("/").pop()];

    currentImageIndex = 0;

    lightboxTitle.textContent = card.dataset.title;
    lightboxCategory.textContent =
      card.querySelector("small").textContent;

    lightboxDescription.textContent =
      card.dataset.description;

    updateLightboxImage();
    updateLightboxButtons();

    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");

    document.body.classList.add("menu-open");

    lightboxClose?.focus();
  });

});


/* Botões do carrossel */

lightboxPrev?.addEventListener("click", showPreviousImage);

lightboxNext?.addEventListener("click", showNextImage);


/* Fechar */

lightboxClose?.addEventListener("click", closeLightbox);

lightbox?.querySelector(".lightbox-backdrop")
  ?.addEventListener("click", closeLightbox);


/* Teclado */

document.addEventListener("keydown", e => {

  if (!lightbox?.classList.contains("open")) return;

  if (e.key === "Escape") {
    closeLightbox();
  }

  if (e.key === "ArrowLeft") {
    showPreviousImage();
  }

  if (e.key === "ArrowRight") {
    showNextImage();
  }

});

setupWhatsApp();

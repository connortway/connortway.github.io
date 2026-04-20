console.log("script loaded");

// ===== NAVIGATION =====
const hamburger = document.getElementById('hamburger');
const menu = document.getElementById('menu');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  menu.classList.toggle('active');
});

document.querySelectorAll('.menu a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    menu.classList.remove('active');
  });
});

// ===== SCROLL REVEAL =====
const reveals = document.querySelectorAll('.reveal');

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting) {
      entry.target.classList.add('active');
    }
  });
}, { threshold: 0.15 });

reveals.forEach(reveal => observer.observe(reveal));





//carousel

// Find all carousels on the page so this script works even if there are multiple
const carousels = document.querySelectorAll('.carousel-wrapper');

carousels.forEach(carousel => {
  const slides = carousel.querySelectorAll('.slide');
  const dots = carousel.querySelectorAll('.dot');
  const titleEl = carousel.querySelector('.info-title');
  const textEl = carousel.querySelector('.info-text');

  // Find the index of the slide that has the 'active' class in the HTML, default to 1
  let currentIndex = Array.from(slides).findIndex(slide => slide.classList.contains('active'));
  if (currentIndex === -1) currentIndex = 1;

  let autoScrollTimer; // Variable to store our interval timer

  function updateCarousel(newIndex) {
    // Fade out text first for smooth transition
    titleEl.classList.add('fade-out');
    textEl.classList.add('fade-out');

    setTimeout(() => {
      // Pull the dynamic text directly from the active slide's HTML data attributes
      const activeSlide = slides[newIndex];
      titleEl.innerText = activeSlide.dataset.title || 'Default Title';
      textEl.innerText = activeSlide.dataset.text || 'Default description text.';
      
      // Fade text back in
      titleEl.classList.remove('fade-out');
      textEl.classList.remove('fade-out');
    }, 300);

    // Remove existing state classes
    slides.forEach(slide => {
      slide.classList.remove('active', 'prev', 'next');
    });
    dots.forEach(dot => {
      dot.classList.remove('active');
    });

    // Calculate prev and next indices (with wrapping)
    const totalSlides = slides.length;
    const prevIndex = (newIndex - 1 + totalSlides) % totalSlides;
    const nextIndex = (newIndex + 1) % totalSlides;

    // Apply new state classes
    slides[newIndex].classList.add('active');
    slides[prevIndex].classList.add('prev');
    slides[nextIndex].classList.add('next');
    
    if(dots[newIndex]) {
        dots[newIndex].classList.add('active');
    }

    currentIndex = newIndex;
  }

  // --- Auto-Scroll Functions ---
  function startAutoScroll() {
    autoScrollTimer = setInterval(() => {
      const totalSlides = slides.length;
      const nextIndex = (currentIndex + 1) % totalSlides;
      updateCarousel(nextIndex);
    }, 20000); // 20000 milliseconds = 20 seconds
  }

  function resetAutoScroll() {
    clearInterval(autoScrollTimer); // Stop the current timer
    startAutoScroll(); // Start a fresh 20-second countdown
  }

  // Add click events to dots
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      if (currentIndex !== index) {
        updateCarousel(index);
        resetAutoScroll(); // Reset timer so it doesn't jump immediately after clicking
      }
    });
  });

  // Allow clicking on the blurred side slides to navigate
  slides.forEach((slide, index) => {
    slide.addEventListener('click', () => {
      if (slide.classList.contains('prev') || slide.classList.contains('next')) {
        updateCarousel(index);
        resetAutoScroll(); // Reset timer so it doesn't jump immediately after clicking
      }
    });
  });

  // Initialize the starting state to load the first text block
  updateCarousel(currentIndex);
  
  // Start the auto-scroll timer when the page loads
  startAutoScroll(); 
});

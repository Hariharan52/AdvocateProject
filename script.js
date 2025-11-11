/* script.js - improved interactivity and accessibility */

/* DOM helpers */
const $ = sel => document.querySelector(sel);
const $$ = sel => document.querySelectorAll(sel);

/* Set footer year */
document.getElementById('year').textContent = new Date().getFullYear();

/* Mobile nav toggle */
const navToggle = document.getElementById('navToggle');
const mainNav = document.getElementById('mainNav');
navToggle && navToggle.addEventListener('click', () => {
  const expanded = navToggle.getAttribute('aria-expanded') === 'true';
  navToggle.setAttribute('aria-expanded', String(!expanded));
  navToggle.classList.toggle('open');
  mainNav.classList.toggle('open');
  // toggle visible/hidden for a11y
  if(mainNav.classList.contains('open')) mainNav.style.display = 'flex';
  else mainNav.style.display = '';
});

/* Smooth scroll for internal links */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href.startsWith('#')) {
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // for small screens close nav
        if (mainNav && mainNav.classList.contains('open')) {
          mainNav.classList.remove('open');
          navToggle.classList.remove('open');
          navToggle.setAttribute('aria-expanded', 'false');
        }
      }
    }
  });
});

/* Smooth scroll for hero buttons */
document.querySelectorAll('.hero-actions button').forEach(button => {
  button.addEventListener('click', function () {
    const text = this.textContent.trim();
    let targetId;
    if (text === 'Our Services') {
      targetId = '#services';
    } else if (text === 'Who We Are') {
      targetId = '#about';
    }
    if (targetId) {
      const target = document.querySelector(targetId);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  });
});

/* Hammer emoji on nav click */
const navLinks = document.querySelectorAll('.main-nav a');
navLinks.forEach(link => {
  link.addEventListener('click', function() {
    // Remove clicked class from all links
    navLinks.forEach(l => l.classList.remove('clicked'));
    // Add clicked class to current link
    this.classList.add('clicked');
    // Remove the class after animation completes (0.5s)
    setTimeout(() => {
      this.classList.remove('clicked');
    }, 500);
  });
});

/* Simple testimonial slider */
(function(){
  const testimonials = [...$$('.testimonial')];
  if(testimonials.length === 0) return;
  let idx = 0;
  const show = i => {
    testimonials.forEach((t, j) => t.hidden = (i !== j));
  };
  show(idx);
  const prev = $('#prevTest');
  const next = $('#nextTest');
  prev && prev.addEventListener('click', () => {
    idx = (idx - 1 + testimonials.length) % testimonials.length;
    show(idx);
  });
  next && next.addEventListener('click', () => {
    idx = (idx + 1) % testimonials.length;
    show(idx);
  });

  // auto-rotate every 6s but pause on hover
  let rot = setInterval(()=> {
    idx = (idx + 1) % testimonials.length;
    show(idx);
  }, 6000);

  const wrap = document.querySelector('.testimonials-wrap');
  if (wrap) {
    wrap.addEventListener('mouseenter', () => clearInterval(rot));
    wrap.addEventListener('mouseleave', () => {
      rot = setInterval(()=> {
        idx = (idx + 1) % testimonials.length;
        show(idx);
      }, 6000);
    });
  }
})();

/* EmailJS form submission */
function wireForm(selector){
  const form = document.querySelector(selector);
  if(!form) return;

  // Initialize EmailJS with your public key
  try {
    emailjs.init('SDION0gTw8muOGemr'); // Replace with your actual public key
  } catch (e) {
    // ignore if already initialized
  }

  form.addEventListener('submit', e => {
    e.preventDefault();

    const required = [...form.querySelectorAll('[required]')];
    let ok = true;
    required.forEach(input => {
      if(!input.value.trim()){
        ok = false;
        input.style.outline = '2px solid rgba(201,162,76,0.35)';
      } else {
        input.style.outline = 'none';
      }
    });

    if(!ok){
      alert('Please fill the required fields.');
      return;
    }

    // Get form data
    const formData = new FormData(form);
    const templateParams = {
      from_name: formData.get('name'),
      from_contact: formData.get('contact'),
      message: formData.get('message') || 'No message provided',
      to_email: 'hariharanitskct@gmail.com'
    };

    // Send email using EmailJS
    emailjs.send('service_dqwyq3i', 'template_l77bom3', templateParams)
      .then(function(response) {
        console.log('SUCCESS!', response.status, response.text);
        alert('Thank you! Your consultation request has been sent successfully. We will contact you soon.');
        form.reset();
      }, function(error) {
        console.log('FAILED...', error);
        alert('Sorry, there was an error sending your request. Please try again or contact us directly.');
      });
  });
}
wireForm('#quickContact');

/* Small accessibility: focus styles for keyboard nav */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Tab') {
    document.body.classList.add('user-is-tabbing');
  }
});

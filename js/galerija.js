const smanjiPokrete = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const hero = document.getElementById("hero");

if (hero) {
  const slides = hero.querySelectorAll(".hero-slide");
  const dotsBox = document.getElementById("hero-dots");
  const pauseBtn = document.getElementById("hero-pause");
  const placeEl = document.getElementById("hero-place");
  const creditEl = document.getElementById("hero-credit");

  const INTERVAL = 6000;
  let trenutni = 0;
  let timer = null;
  let pauzirano = smanjiPokrete;

  const dots = Array.from(slides, (slide, i) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "hero-dot";
    dot.setAttribute("aria-label", `Fotografija ${i + 1}: ${slide.dataset.place}`);
    dot.addEventListener("click", () => {
      prikaziSlide(i);
      restartTimer();
    });
    dotsBox.appendChild(dot);
    return dot;
  });

  function prikaziSlide(index) {
    slides[trenutni].classList.remove("is-active");
    dots[trenutni].classList.remove("is-active");
    dots[trenutni].removeAttribute("aria-current");

    trenutni = (index + slides.length) % slides.length;

    const slide = slides[trenutni];
    slide.classList.add("is-active");
    dots[trenutni].classList.add("is-active");
    dots[trenutni].setAttribute("aria-current", "true");

    placeEl.textContent = slide.dataset.place;
    creditEl.textContent = "Foto: " + slide.dataset.credit;
    creditEl.href = slide.dataset.source;
  }

  function startTimer() {
    if (pauzirano || timer) return;
    timer = setInterval(() => prikaziSlide(trenutni + 1), INTERVAL);
  }

  function stopTimer() {
    clearInterval(timer);
    timer = null;
  }

  function restartTimer() {
    stopTimer();
    startTimer();
  }

  function postaviPauzu(stanje) {
    pauzirano = stanje;
    pauseBtn.textContent = pauzirano ? "▶" : "❚❚";
    pauseBtn.setAttribute("aria-label", pauzirano ? "Pokreni izmjenu fotografija" : "Zaustavi izmjenu fotografija");
    pauzirano ? stopTimer() : startTimer();
  }

  pauseBtn.addEventListener("click", () => postaviPauzu(!pauzirano));

  hero.addEventListener("mouseenter", stopTimer);
  hero.addEventListener("mouseleave", startTimer);

  document.addEventListener("visibilitychange", () => {
    document.hidden ? stopTimer() : startTimer();
  });

  prikaziSlide(0);
  postaviPauzu(pauzirano);
}

const gallery = document.getElementById("gallery");
const lightbox = document.getElementById("lightbox");

if (gallery && lightbox) {
  const slike = Array.from(gallery.querySelectorAll("img"));
  const lbImg = document.getElementById("lightbox-img");
  const lbCaption = document.getElementById("lightbox-caption");
  const lbCredit = document.getElementById("lightbox-credit");
  const lbCounter = document.getElementById("lightbox-counter");
  let aktivna = 0;

  function prikaziSliku(index) {
    aktivna = (index + slike.length) % slike.length;
    const slika = slike[aktivna];

    lbImg.src = slika.src;
    lbImg.alt = slika.alt;
    lbImg.style.animation = "none";
    void lbImg.offsetWidth;
    lbImg.style.animation = "";

    lbCaption.textContent = slika.dataset.caption;
    lbCredit.textContent = "Foto: " + slika.dataset.credit;
    lbCredit.href = slika.dataset.source;
    lbCounter.textContent = `${aktivna + 1} / ${slike.length}`;
  }

  function otvori(index) {
    prikaziSliku(index);
    lightbox.showModal();
    document.body.style.overflow = "hidden";
  }

  function zatvori() {
    lightbox.close();
  }

  gallery.addEventListener("click", event => {
    const btn = event.target.closest(".gallery-btn");
    if (!btn) return;
    otvori(slike.indexOf(btn.querySelector("img")));
  });

  document.getElementById("lightbox-prev").addEventListener("click", () => prikaziSliku(aktivna - 1));
  document.getElementById("lightbox-next").addEventListener("click", () => prikaziSliku(aktivna + 1));
  document.getElementById("lightbox-close").addEventListener("click", zatvori);

  lightbox.addEventListener("click", event => {
    if (event.target === lightbox || event.target.tagName === "FIGURE") zatvori();
  });

  lightbox.addEventListener("keydown", event => {
    if (event.key === "ArrowLeft") prikaziSliku(aktivna - 1);
    if (event.key === "ArrowRight") prikaziSliku(aktivna + 1);
  });

  lightbox.addEventListener("close", () => {
    document.body.style.overflow = "";
    slike[aktivna].closest(".gallery-btn").focus();
  });

  let startX = null;
  lightbox.addEventListener("touchstart", event => {
    startX = event.touches[0].clientX;
  }, { passive: true });

  lightbox.addEventListener("touchend", event => {
    if (startX === null) return;
    const pomak = event.changedTouches[0].clientX - startX;
    if (Math.abs(pomak) > 50) prikaziSliku(pomak < 0 ? aktivna + 1 : aktivna - 1);
    startX = null;
  });
}

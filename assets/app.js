(function () {
  const header = document.querySelector("[data-header]");
  const menuToggle = document.querySelector("[data-menu-toggle]");
  const nav = document.querySelector("[data-site-nav]");
  const toTop = document.querySelector("[data-to-top]");
  const phone = "77024444099";

  function closeMenu() {
    if (!header || !menuToggle) return;
    header.classList.remove("is-open");
    document.body.classList.remove("menu-open");
    menuToggle.setAttribute("aria-expanded", "false");
  }

  if (header && menuToggle) {
    menuToggle.addEventListener("click", function () {
      const isOpen = header.classList.toggle("is-open");
      document.body.classList.toggle("menu-open", isOpen);
      menuToggle.setAttribute("aria-expanded", String(isOpen));
    });
  }

  if (nav) {
    nav.addEventListener("click", function (event) {
      if (event.target.closest("a")) closeMenu();
    });
  }

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") closeMenu();
  });

  document.querySelectorAll("[data-slider]").forEach(function (slider) {
    const slides = Array.from(slider.querySelectorAll("[data-slide]"));
    const prev = slider.querySelector("[data-slider-prev]");
    const next = slider.querySelector("[data-slider-next]");
    const dotsRoot = slider.querySelector("[data-slider-dots]");
    let index = Math.max(0, slides.findIndex(function (slide) {
      return slide.classList.contains("is-active");
    }));
    let timer = 0;

    function renderDots() {
      if (!dotsRoot) return;
      dotsRoot.innerHTML = "";
      slides.forEach(function (_, dotIndex) {
        const button = document.createElement("button");
        button.type = "button";
        button.setAttribute("aria-label", "Открыть слайд " + (dotIndex + 1));
        button.classList.toggle("is-active", dotIndex === index);
        button.addEventListener("click", function () {
          goTo(dotIndex);
          restart();
        });
        dotsRoot.appendChild(button);
      });
    }

    function goTo(nextIndex) {
      slides[index].classList.remove("is-active");
      index = (nextIndex + slides.length) % slides.length;
      slides[index].classList.add("is-active");
      renderDots();
    }

    function restart() {
      window.clearInterval(timer);
      timer = window.setInterval(function () {
        goTo(index + 1);
      }, 6500);
    }

    if (prev) {
      prev.addEventListener("click", function () {
        goTo(index - 1);
        restart();
      });
    }

    if (next) {
      next.addEventListener("click", function () {
        goTo(index + 1);
        restart();
      });
    }

    renderDots();
    restart();
  });

  document.querySelectorAll("[data-lead-form]").forEach(function (form) {
    const status = form.querySelector("[data-form-status]");
    form.noValidate = true;

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      const data = new FormData(form);
      const requiredFields = Array.from(form.querySelectorAll("[required]"));
      let hasError = false;

      requiredFields.forEach(function (field) {
        const isCheckbox = field.type === "checkbox";
        const invalid = isCheckbox ? !field.checked : !field.value.trim();
        field.classList.toggle("is-invalid", invalid);
        if (invalid) hasError = true;
      });

      if (hasError) {
        if (status) {
          status.textContent = "Заполните обязательные поля.";
          status.classList.add("is-error");
        }
        return;
      }

      const name = String(data.get("name") || "").trim();
      const clientPhone = String(data.get("phone") || "").trim();
      const service = String(data.get("service") || "Нужна консультация").trim();
      const comment = String(data.get("comment") || "").trim();
      const message = [
        "Здравствуйте! Хочу заказать чистку в TazaLife.",
        "Имя: " + name,
        "Телефон: " + clientPhone,
        "Услуга: " + service,
        comment ? "Комментарий: " + comment : ""
      ].filter(Boolean).join("\n");

      if (status) {
        status.textContent = "Заявка готова. Открываем WhatsApp для отправки.";
        status.classList.remove("is-error");
      }

      window.open("https://wa.me/" + phone + "?text=" + encodeURIComponent(message), "_blank", "noopener");
      form.reset();
    });
  });

  const animatedSections = Array.from(document.querySelectorAll(".section-animate"));
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14 });

    animatedSections.forEach(function (section) {
      observer.observe(section);
    });
  } else {
    animatedSections.forEach(function (section) {
      section.classList.add("is-visible");
    });
  }

  if (toTop) {
    window.addEventListener("scroll", function () {
      toTop.classList.toggle("is-visible", window.scrollY > 520);
    }, { passive: true });

    toTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
})();

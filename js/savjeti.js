const checklist = document.getElementById("checklist");

if (checklist) {
  const checkboxes = checklist.querySelectorAll('input[type="checkbox"]');
  const count = document.getElementById("checklist-count");
  const progress = document.getElementById("checklist-progress");
  const resetButton = document.getElementById("checklist-reset");

  function updateChecklist() {
    const packed = checklist.querySelectorAll('input[type="checkbox"]:checked').length;
    count.textContent = `Spakirano ${packed}/${checkboxes.length}`;
    progress.value = packed;
    progress.textContent = `${packed} od ${checkboxes.length}`;
  }

  checklist.addEventListener("change", (event) => {
    if (event.target.matches('input[type="checkbox"]')) {
      updateChecklist();
    }
  });

  resetButton.addEventListener("click", () => {
    checkboxes.forEach((checkbox) => {
      checkbox.checked = false;
    });
    updateChecklist();
  });
}

const contactForm = document.getElementById("contact-form");

if (contactForm) {
  const fields = Array.from(contactForm.querySelectorAll("input, textarea"));
  const formStatus = document.getElementById("form-status");

  function getFieldError(field) {
    if (!field.value.trim()) {
      return "Ovo polje je obavezno.";
    }

    if (field.type === "email" && !field.validity.valid) {
      return "Unesi ispravnu e-mail adresu.";
    }

    return "";
  }

  function validateField(field) {
    const errorMessage = getFieldError(field);
    const errorElement = document.getElementById(`${field.id}-error`);

    field.setAttribute("aria-invalid", String(Boolean(errorMessage)));
    errorElement.textContent = errorMessage;
    return !errorMessage;
  }

  function setFormStatus(message, state) {
    formStatus.textContent = message;
    formStatus.classList.toggle("is-error", state === "error");
    formStatus.classList.toggle("is-success", state === "success");
  }

  contactForm.addEventListener("input", (event) => {
    const field = event.target;
    if (!fields.includes(field)) {
      return;
    }

    if (field.value.trim() || field.getAttribute("aria-invalid") === "true") {
      validateField(field);
    }
    setFormStatus("", "");
  });

  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const invalidFields = fields.filter((field) => !validateField(field));
    if (invalidFields.length > 0) {
      setFormStatus("Provjeri označena polja i ispravi unos.", "error");
      invalidFields[0].focus();
      return;
    }

    setFormStatus(
      "Unos je ispravan, ali poruka nije poslana jer ova stranica nema poslužiteljski dio.",
      "success"
    );
  });
}
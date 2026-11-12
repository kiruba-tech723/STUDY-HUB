// ===== validation.js : form validation for register / signup / signin =====

// Regular expressions from the checklist
const patterns = {
  fullName: /^[a-zA-Z\s]{2,50}$/,
  empId: /^[A-Z0-9]{6,12}$/i,
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  mobile: /^[6-9]\d{9}$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/
};

const messages = {
  fullName: "Use alphabets and spaces only (2-50 characters).",
  empId: "Enter 6-12 letters or digits.",
  email: "Enter a valid email, e.g. name@example.com.",
  mobile: "Enter a 10-digit number starting with 6-9.",
  dept: "Please select a division.",
  password: "Min 8 chars with uppercase, lowercase, number and symbol (@$!%*?&).",
  confirmPassword: "Passwords do not match.",
  terms: "You must accept the Terms of Service."
};

// Check one field. Returns true if valid.
function checkField(input) {
  const id = input.id;
  const value = input.value;
  let ok = true;

  if (id === "dept") {
    ok = value !== "";
  } else if (id === "confirmPassword") {
    const pw = document.getElementById("password");
    ok = value !== "" && value === pw.value;
  } else if (id === "terms") {
    ok = input.checked;
  } else if (patterns[id]) {
    ok = patterns[id].test(value);
  }

  showResult(input, ok);
  return ok;
}

// Show / hide the red error badge and field colours
function showResult(input, ok) {
  const err = input.closest(".form-group").querySelector(".error-msg");
  input.classList.toggle("valid", ok);
  input.classList.toggle("invalid", !ok);
  if (err) {
    err.textContent = ok ? "" : messages[input.id];
  }
}

// Silent check (no messages) used to enable/disable the button
function isFieldOk(input) {
  const id = input.id;
  if (id === "dept") return input.value !== "";
  if (id === "confirmPassword") {
    return input.value !== "" && input.value === document.getElementById("password").value;
  }
  if (id === "terms") return input.checked;
  return patterns[id].test(input.value);
}

// Attach validation to a form that has data-validate attribute
const form = document.querySelector("form[data-validate]");
if (form) {
  const fields = form.querySelectorAll("[data-check]");
  const submitBtn = form.querySelector("button[type='submit']");

  function updateButton() {
    let all = true;
    fields.forEach(function (f) {
      if (!isFieldOk(f)) all = false;
    });
    submitBtn.disabled = !all;
  }

  fields.forEach(function (f) {
    // validate when the user leaves the field
    f.addEventListener("blur", function () {
      checkField(f);
      updateButton();
    });
    // keep the button state live while typing; re-check once already marked invalid
    f.addEventListener("input", function () {
      if (f.classList.contains("invalid")) checkField(f);
      updateButton();
    });
    f.addEventListener("change", function () {
      checkField(f);
      updateButton();
    });
  });

  // Typing in password changes whether confirm password matches
  const pw = document.getElementById("password");
  const cpw = document.getElementById("confirmPassword");
  if (pw && cpw) {
    pw.addEventListener("input", function () {
      if (cpw.value !== "") checkField(cpw);
      updateButton();
    });
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    let all = true;
    fields.forEach(function (f) {
      if (!checkField(f)) all = false;
    });
    if (all) {
      const ok = document.getElementById("successMsg");
      if (ok) ok.classList.add("show");
      // demo only: send the user to sign in after a moment
      setTimeout(function () {
        window.location.href = "signin.html";
      }, 1200);
    }
  });

  updateButton();
}

// ----- Sign-in page: show/hide password and error banner -----
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  const eye = document.getElementById("eyeBtn");
  const pwInput = document.getElementById("password");
  const banner = document.getElementById("loginAlert");

  eye.addEventListener("click", function () {
    const hidden = pwInput.type === "password";
    pwInput.type = hidden ? "text" : "password";
    eye.textContent = hidden ? "🙈" : "👁️";
  });

  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const emailInput = document.getElementById("email");
    const emailOk = patterns.email.test(emailInput.value);
    const pwOk = pwInput.value.length >= 8;
    if (!emailOk || !pwOk) {
      banner.textContent = !emailOk
        ? "Invalid email format. Please check and try again."
        : "Password must be at least 8 characters.";
      banner.classList.add("show");
      emailInput.classList.toggle("invalid", !emailOk);
      pwInput.classList.toggle("invalid", !pwOk);
    } else {
      banner.classList.remove("show");
      window.location.href = "home.html";
    }
  });
}

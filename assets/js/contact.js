document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");
  const feedback = document.getElementById("formFeedback");
  const submitButton = form.querySelector('button[type="submit"]');

  if (!form) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!form.reportValidity()) return;

    const originalButtonText = submitButton.innerHTML;

    submitButton.disabled = true;
    submitButton.innerHTML = "SENDING...";

    feedback.textContent = "";
    feedback.classList.remove("error");

    try {
      const formData = new FormData(form);

      const response = await fetch(
        "https://api.web3forms.com/submit",
        {
          method: "POST",
          body: formData
        }
      );

      const result = await response.json();

      if (response.ok && result.success) {
        // Redirect after successful email submission
        window.location.href = "thankyou.html";
      } else {
        throw new Error(result.message || "Something went wrong.");
      }

    } catch (error) {
      feedback.textContent =
        "Unable to send your message. Please try again.";
      feedback.classList.add("error");

      submitButton.disabled = false;
      submitButton.innerHTML = originalButtonText;

      console.error("Web3Forms Error:", error);
    }
  });
});
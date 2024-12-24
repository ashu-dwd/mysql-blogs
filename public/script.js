document.addEventListener("DOMContentLoaded", () => {
  const aiSummarizerBtn = document.getElementById("ai-summarizer");
  const aiModal = document.getElementById("ai-modal");
  const closeModal = document.querySelector(".close-modal");
  const aiResponse = document.getElementById("ai-response");

  aiSummarizerBtn.addEventListener("click", () => {
    aiModal.style.display = "block";
    summarizeContent();
  });

  closeModal.addEventListener("click", () => {
    aiModal.style.display = "none";
  });

  window.addEventListener("click", (event) => {
    if (event.target === aiModal) {
      aiModal.style.display = "none";
    }
  });

  function summarizeContent() {
    const content = document.querySelector(".blog-content").innerText;
    aiSummarizerBtn.classList.add("loading");
    aiSummarizerBtn.disabled = true;

    // Simulating API call with setTimeout
    // setTimeout(() => {
    //   const summary =
    //     "This is a simulated AI-generated summary of the blog post. In a real-world scenario, you would make an API call to your backend service to generate the summary using AI.";
    //   aiResponse.innerHTML = `<p>${summary}</p>`;
    //   aiSummarizerBtn.classList.remove("loading");
    //   aiSummarizerBtn.disabled = false;
    // }, 2000);

    // In a real-world scenario, you would use fetch to call your API:

    fetch("/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: content }),
    })
      .then((response) => response.text())
      .then((summary) => {
        aiResponse.innerHTML = `<p>${summary}</p>`;
        aiSummarizerBtn.classList.remove("loading");
        aiSummarizerBtn.disabled = false;
      })
      .catch((error) => {
        console.error("Error:", error);
        aiResponse.innerHTML =
          "<p>An error occurred while generating the summary. Please try again.</p>";
        aiSummarizerBtn.classList.remove("loading");
        aiSummarizerBtn.disabled = false;
      });
  }
});

document.addEventListener("DOMContentLoaded", () => {
  this.addEventListener("click", () => {
    console.log("clicked");
  });
  const navLinks = document.querySelector(".nav-links");
  const bars = document.querySelector(".fa-bars");
  bars.addEventListener("click", () => {
    navLinks.classList.toggle("active");
    console.log(navLinks.classList);
    console.log(navLinks.classList.contains("active"));
  });
});

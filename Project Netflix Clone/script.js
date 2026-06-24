const API_KEY = "f5a403fd3c3151026fbce34bef28af1b"; // paste your TMDB key here
const BASE_URL = "https://api.themoviedb.org/3";
const IMG_URL = "https://image.tmdb.org/t/p/w500";

// Load movies dynamically into a carousel
async function loadMovies(endpoint, containerId, ranked=false) {
  try {
    const res = await fetch(`${BASE_URL}${endpoint}&api_key=${API_KEY}`);
    const data = await res.json();
    const carousel = document.querySelector(`#${containerId} .carousel`);
    carousel.innerHTML = "";
    data.results.slice(0,10).forEach((movie,i) => {
      if (!movie.poster_path) return;
      const poster = document.createElement("div");
      poster.classList.add("poster");
      poster.innerHTML = `
        <img src="${IMG_URL + movie.poster_path}" alt="${movie.title}" data-id="${movie.id}">
        ${ranked ? `<span class="rank">${i+1}</span>` : ""}
      `;
      carousel.appendChild(poster);
    });
    addScrollArrows(carousel);
  } catch (err) {
    console.error("Error loading movies:", err);
  }
}

// Hero background cycle
async function cycleHero() {
  try {
    const res = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}`);
    const data = await res.json();
    let index = 0;
    setInterval(() => {
      const movie = data.results[index];
      if (movie.backdrop_path) {
        document.getElementById("hero").style.backgroundImage = `url(${IMG_URL + movie.backdrop_path})`;
        document.getElementById("hero-title").textContent = movie.title;
        document.getElementById("hero-subtitle").textContent = movie.overview.slice(0,80) + "...";
      }
      index = (index + 1) % data.results.length;
    }, 5000);
  } catch (err) {
    console.error("Error cycling hero:", err);
  }
}

// Add scroll arrows
function addScrollArrows(carousel) {
  const leftArrow = document.createElement("button");
  leftArrow.textContent = "◀";
  leftArrow.className = "arrow left";
  const rightArrow = document.createElement("button");
  rightArrow.textContent = "▶";
  rightArrow.className = "arrow right";

  carousel.parentElement.appendChild(leftArrow);
  carousel.parentElement.appendChild(rightArrow);

  leftArrow.addEventListener("click", () => {
    carousel.scrollBy({ left: -400, behavior: "smooth" });
  });
  rightArrow.addEventListener("click", () => {
    carousel.scrollBy({ left: 400, behavior: "smooth" });
  });
}

// Trailer modal overlay
const modal = document.createElement("div");
modal.id = "trailer-modal";
modal.innerHTML = `
  <div class="modal-content">
    <span id="close-modal">&times;</span>
    <iframe id="trailer-frame" width="100%" height="500" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
  </div>
`;
document.body.appendChild(modal);

document.addEventListener("click", async e => {
  if (e.target.tagName === "IMG" && e.target.dataset.id) {
    const movieId = e.target.dataset.id;
    const res = await fetch(`${BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}`);
    const data = await res.json();
    const trailer = data.results.find(v => v.type === "Trailer" && v.site === "YouTube");
    if (trailer) {
      document.getElementById("trailer-frame").src = `https://www.youtube.com/embed/${trailer.key}?autoplay=1&mute=1`;
      modal.style.display = "flex";
    }
  }
});

document.addEventListener("click", e => {
  if (e.target.id === "close-modal" || e.target.id === "trailer-modal") {
    document.getElementById("trailer-frame").src = "";
    modal.style.display = "none";
  }
});

// Initialize rows
loadMovies("/trending/movie/week?","trending",true);      // Trending Top 10
loadMovies("/movie/now_playing?","new");                  // New Releases
loadMovies("/discover/movie?with_genres=28","action");    // Action Movies
loadMovies("/discover/movie?with_genres=10749","romance");// Romantic Comedies

// Start hero cycle
cycleHero();

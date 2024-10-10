var datos = [];

document.addEventListener("DOMContentLoaded", function () {
  async function obtenerDatos() {
    try {
      const response = await fetch(
        "https://japceibal.github.io/japflix_api/movies-data.json"
      );
      datos = await response.json();
      console.log("Datos obtenidos:", datos);
    } catch (error) {
      console.error("Error al obtener los datos:", error);
      datos = [];
    }
  }

  obtenerDatos();

  var botonBuscar = document.getElementById("btnBuscar");
  botonBuscar.addEventListener("click", filtrar);
});

function filtrar() {
  var input = document.getElementById("inputBuscar");
  var output = document.getElementById("lista");

  const valorBuscar = input.value.toLowerCase();

  console.log("Valor de búsqueda:", valorBuscar);

  const resultados = datos.filter(function (item) {
    const titulo = item.title.toLowerCase();
    const genero = item.genres
      .map((genre) => genre.name.toLowerCase())
      .join(", ");
    const tagline = item.tagline ? item.tagline.toLowerCase() : "";
    const overview = item.overview ? item.overview.toLowerCase() : "";
    const vote = item.vote_average ? item.vote_average.toString() : "";

    return (
      titulo.includes(valorBuscar) ||
      genero.includes(valorBuscar) ||
      tagline.includes(valorBuscar) ||
      overview.includes(valorBuscar) ||
      vote.includes(valorBuscar)
    );
  });

  console.log("Resultados de la búsqueda:", resultados);

  if (resultados.length > 0) {
    resultados.forEach(function (item) {
      var li = document.createElement("li");
      li.classList.add("list-group-item");

      var titulo = document.createElement("h4");
      titulo.classList.add("titulo-pelicula");
      titulo.textContent = item.title;

      var tagline = document.createElement("p");
      tagline.classList.add("tagline-pelicula");
      tagline.textContent = `${item.tagline || "Sin tagline"}`;

      function getStarRating(vote) {
        const maxStars = 5;
        const starRating = vote / 2;
        const fullStars = Math.floor(starRating);
        const emptyStars = maxStars - fullStars;
        let starContainer = document.createElement("div");

        for (let i = 0; i < fullStars; i++) {
          let star = document.createElement("span");
          star.classList.add("fa", "fa-star", "checked");
          starContainer.appendChild(star);
        }

        for (let i = 0; i < emptyStars; i++) {
          let emptyStar = document.createElement("span");
          emptyStar.classList.add("fa", "fa-star");
          starContainer.appendChild(emptyStar);
        }

        return starContainer;
      }

      var vote = document.createElement("div");
      vote.classList.add("vote_average");
      const starRating = getStarRating(item.vote_average);
      vote.appendChild(starRating);

      li.appendChild(titulo);
      li.appendChild(tagline);
      li.appendChild(vote);

      output.appendChild(li);

      function desplegarInfo() {
        var offcanvasBody = document.getElementById("offcanvasBody");
        offcanvasBody.innerHTML = "";

        var releaseYear = new Date(item.release_date).getFullYear();
        var runtime = item.runtime
          ? `${item.runtime} min`
          : "Duración desconocida";
        var revenue = item.revenue
          ? `$${item.revenue.toLocaleString()}`
          : "Sin información de recaudación";
        var budget = item.budget
          ? `$${item.budget.toLocaleString()}`
          : "Sin información de presupuesto";

        var movieDetails = `
      <h4>${item.title}</h4>
      <p><strong>Release Year:</strong> ${releaseYear}</p>
      <p><strong>Runtime:</strong> ${item.runtime} minutes</p>
    <p><strong>Budget:</strong> ${budget}</p><p><strong>Revenue:</strong> ${revenue}</p>`;

        offcanvasBody.innerHTML = movieDetails;
        var offcanvasElement = document.getElementById("offcanvasTop");
        var offcanvas = new bootstrap.Offcanvas(offcanvasElement);
        offcanvas.show();
      }

      li.addEventListener("click", desplegarInfo);
    });
  } else {
    output.innerHTML =
      "<li class='list-group-item'>No se encontraron resultados.</li>";
  }
}

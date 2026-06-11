const IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

const formatCurrency = (value) => {
  if (!value) return "N/A";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
};

const formatRuntime = (minutes) => {
  if (!minutes) return "N/A";

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (!hours) return `${remainingMinutes}m`;
  if (!remainingMinutes) return `${hours}h`;

  return `${hours}h ${remainingMinutes}m`;
};

const formatDate = (date) => {
  if (!date) return "N/A";

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(`${date}T00:00:00`));
};

const detailItems = (movie) => [
  ["Release date", formatDate(movie.release_date)],
  ["Runtime", formatRuntime(movie.runtime)],
  [
    "Rating",
    movie.vote_average ? `${movie.vote_average.toFixed(1)} / 10` : "N/A",
  ],
  ["Votes", movie.vote_count?.toLocaleString("en-US") || "N/A"],
  ["Status", movie.status || "N/A"],
  ["Original language", movie.original_language?.toUpperCase() || "N/A"],
  ["Budget", formatCurrency(movie.budget)],
  ["Revenue", formatCurrency(movie.revenue)],
];

const MovieDetails = ({ movie, onBack }) => {
  const backdrop = movie.backdrop_path
    ? `${IMAGE_BASE_URL}/w1280${movie.backdrop_path}`
    : "/hero-bg.png";
  const poster = movie.poster_path
    ? `${IMAGE_BASE_URL}/w500${movie.poster_path}`
    : "/no-movie.png";
  const genres = movie.genres?.map((genre) => genre.name).join(", ") || "N/A";
  const productionCompanies =
    movie.production_companies?.map((company) => company.name).join(", ") ||
    "N/A";
  const countries =
    movie.production_countries?.map((country) => country.name).join(", ") ||
    "N/A";

  return (
    <section className="movie-details">
      <button type="button" className="back-button" onClick={onBack}>
        Back to movies
      </button>

      <div
        className="details-hero"
        style={{ backgroundImage: `url(${backdrop})` }}
      >
        <div className="details-hero-content">
          <img className="details-poster" src={poster} alt={movie.title} />

          <div className="details-copy">
            <p className="eyebrow">{movie.status || "Movie details"}</p>
            <h1>{movie.title}</h1>
            {movie.tagline && <p className="tagline">{movie.tagline}</p>}
            <p className="overview">
              {movie.overview || "No overview is available for this movie."}
            </p>

            <div className="genre-list">
              {movie.genres?.length ? (
                movie.genres.map((genre) => (
                  <span key={genre.id}>{genre.name}</span>
                ))
              ) : (
                <span>Genre unavailable</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="details-grid">
        <div className="detail-panel">
          <h2>Movie Details</h2>
          <dl>
            {detailItems(movie).map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="detail-panel">
          <h2>Production</h2>
          <dl>
            <div>
              <dt>Genres</dt>
              <dd>{genres}</dd>
            </div>
            <div>
              <dt>Production companies</dt>
              <dd>{productionCompanies}</dd>
            </div>
            <div>
              <dt>Production countries</dt>
              <dd>{countries}</dd>
            </div>
            <div>
              <dt>Homepage</dt>
              <dd>
                {movie.homepage ? (
                  <a href={movie.homepage} target="_blank" rel="noreferrer">
                    Visit official site
                  </a>
                ) : (
                  "N/A"
                )}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
};

export default MovieDetails;

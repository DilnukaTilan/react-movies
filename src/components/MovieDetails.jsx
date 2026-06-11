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
        {/* ── Movie Details panel ── */}
        <div className="detail-panel">
          <div className="panel-header">
            <span className="panel-icon">🎬</span>
            <h2>Movie Details</h2>
          </div>

          {/* Rating highlight card */}
          {movie.vote_average > 0 && (
            <div className="rating-highlight">
              <span className="rating-star">★</span>
              <span className="rating-score">
                {movie.vote_average.toFixed(1)}
              </span>
              <span className="rating-max">/ 10</span>
              {movie.vote_count > 0 && (
                <span className="rating-votes">
                  ({movie.vote_count.toLocaleString("en-US")} votes)
                </span>
              )}
            </div>
          )}

          <dl>
            {detailItems(movie)
              .filter(([label]) => label !== "Rating" && label !== "Votes")
              .map(([label, value]) => (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
          </dl>
        </div>

        {/* ── Production panel ── */}
        <div className="detail-panel">
          <div className="panel-header">
            <span className="panel-icon">🏢</span>
            <h2>Production</h2>
          </div>

          <dl>
            <div className="detail-row">
              <dt>Genres</dt>
              <dd>
                <div className="detail-pills">
                  {movie.genres?.length
                    ? movie.genres.map((g) => (
                        <span key={g.id} className="detail-pill">
                          {g.name}
                        </span>
                      ))
                    : "N/A"}
                </div>
              </dd>
            </div>
            <div className="detail-row">
              <dt>Production companies</dt>
              <dd>{productionCompanies}</dd>
            </div>
            <div className="detail-row">
              <dt>Production countries</dt>
              <dd>{countries}</dd>
            </div>
            <div className="detail-row">
              <dt>Homepage</dt>
              <dd>
                {movie.homepage ? (
                  <a
                    className="homepage-link"
                    href={movie.homepage}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <span>Visit official site</span>
                    <span className="link-arrow">→</span>
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

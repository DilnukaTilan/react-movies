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
  const directors = movie.crew
    ?.filter((member) => member.job === "Director")
    .map((d) => d.name);

  const trailer = movie.videos
    ?.filter((v) => v.site === "YouTube" && v.type === "Trailer")
    .sort((a, b) => (b.official ? 1 : 0) - (a.official ? 1 : 0))[0];
  const trailerUrl = trailer
    ? `https://www.youtube.com/watch?v=${trailer.key}`
    : null;

  return (
    <section className="movie-details">
      <button type="button" className="back-button" onClick={onBack}>
        <span className="back-arrow">←</span>
        <span>Back to Movies</span>
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

            {directors?.length > 0 && (
              <p className="director">
                <span className="director-label">Directed by</span>{" "}
                {directors.join(", ")}
              </p>
            )}

            {trailerUrl && (
              <a
                className="trailer-link"
                href={trailerUrl}
                target="_blank"
                rel="noreferrer"
              >
                <span className="trailer-play-icon">▶</span>
                <span>Play Trailer</span>
              </a>
            )}
          </div>
        </div>
      </div>

      {movie.cast?.length > 0 && (
        <div className="cast-section">
          <div className="panel-header">
            <span className="panel-icon">👥</span>
            <h2>Top Cast</h2>
          </div>

          <div className="cast-scroll">
            {movie.cast
              .filter((member) => member.profile_path)
              .slice(0, 12)
              .map((member) => (
                <div key={member.credit_id} className="cast-card">
                  <div className="cast-img-wrapper">
                    <img
                      src={`${IMAGE_BASE_URL}/w185${member.profile_path}`}
                      alt={member.name}
                      loading="lazy"
                    />
                  </div>
                  <p className="cast-name" title={member.name}>
                    {member.name}
                  </p>
                  <p className="cast-character" title={member.character}>
                    {member.character}
                  </p>
                </div>
              ))}
          </div>
        </div>
      )}

      <div className="details-grid">
        <div className="detail-panel">
          <div className="panel-header">
            <span className="panel-icon">🎬</span>
            <h2>Movie Details</h2>
          </div>

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

        <div className="detail-panel">
          <div className="panel-header">
            <span className="panel-icon">📽️</span>
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
                    <span>Visit Official Site</span>
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

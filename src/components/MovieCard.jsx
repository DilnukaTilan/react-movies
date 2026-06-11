const MovieCard = ({
  movie: {
    id,
    title,
    vote_average,
    poster_path,
    release_date,
    original_language,
  },
  onMovieSelect,
}) => {
  const handleClick = (event) => {
    if (!onMovieSelect) return;

    event.preventDefault();
    onMovieSelect(id);
  };

  return (
    <a className="movie-card" href={`/movie/${id}`} onClick={handleClick}>
      <img
        src={
          poster_path
            ? `https://image.tmdb.org/t/p/w500/${poster_path}`
            : "/no-movie.png"
        }
        alt={title}
      />

      <div className="mt-4">
        <h3>{title}</h3>

        <div className="content">
          <div className="rating">
            <img src="/star.svg" alt="Star Icon" />
            <p>{vote_average ? vote_average.toFixed(1) : "N/A"}</p>
          </div>

          <span>&bull;</span>
          <p className="lang">{original_language}</p>
          <span>&bull;</span>
          <p className="year">
            {release_date ? release_date.split("-")[0] : "N/A"}
          </p>
        </div>
      </div>
    </a>
  );
};

export default MovieCard;

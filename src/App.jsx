import { useState, useEffect, useCallback } from "react";
import Search from "./components/Search";
import Spinner from "./components/Spinner";
import MovieCard from "./components/MovieCard";
import MovieDetails from "./components/MovieDetails";
import { updateSearchCount, getTrendingMovies } from "./appwrite";

const API_BASE_URL = "https://api.themoviedb.org/3";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

const getMovieIdFromPath = () => {
  const match = window.location.pathname.match(/^\/movie\/(\d+)/);
  return match ? match[1] : null;
};

const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [submittedSearchTerm, setSubmittedSearchTerm] = useState("");
  const [selectedMovieId, setSelectedMovieId] = useState(getMovieIdFromPath);

  const [movieList, setMovieList] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [movieDetails, setMovieDetails] = useState(null);

  const [errorMessage, setErrorMessage] = useState("");
  const [trendingErrorMessage, setTrendingErrorMessage] = useState("");
  const [detailsErrorMessage, setDetailsErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDetailsLoading, setIsDetailsLoading] = useState(false);
  const [isTrendingLoading, setIsTrendingLoading] = useState(false);

  const fetchMovies = useCallback(async (query = "", signal) => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const endpoint = query
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
      const response = await fetch(endpoint, { ...API_OPTIONS, signal });

      if (!response.ok) {
        throw new Error("Failed to fetch movies!");
      }

      const data = await response.json();
      const results = data.results || [];

      setMovieList(results);

      if (query && results.length > 0) {
        updateSearchCount(query, results[0]);
      }
    } catch (error) {
      if (error.name === "AbortError") return;
      console.error("Error fetching movies:", error);
      setErrorMessage("Failed to fetch movies. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchTrendingMovies = useCallback(async (signal) => {
    setIsTrendingLoading(true);
    setTrendingErrorMessage("");

    try {
      const movies = await getTrendingMovies();

      if (signal?.aborted) return;

      if (!Array.isArray(movies)) {
        throw new Error("Failed to fetch trending movies.");
      }

      setTrendingMovies(movies || []);
    } catch (error) {
      if (error.name === "AbortError") return;
      console.error("Error fetching trending movies:", error);
      setTrendingErrorMessage(
        "Failed to fetch trending movies. Please try again later.",
      );
      setTrendingMovies([]);
    } finally {
      setIsTrendingLoading(false);
    }
  }, []);

  const fetchMovieDetails = useCallback(async (movieId, signal) => {
    setIsDetailsLoading(true);
    setDetailsErrorMessage("");
    setMovieDetails(null);

    try {
      const [detailsResponse, creditsResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/movie/${movieId}`, {
          ...API_OPTIONS,
          signal,
        }),
        fetch(`${API_BASE_URL}/movie/${movieId}/credits`, {
          ...API_OPTIONS,
          signal,
        }),
      ]);

      if (!detailsResponse.ok) {
        throw new Error("Failed to fetch movie details!");
      }

      const data = await detailsResponse.json();

      if (creditsResponse.ok) {
        const creditsData = await creditsResponse.json();
        data.cast = creditsData.cast || [];
        data.crew = creditsData.crew || [];
      }

      setMovieDetails(data);
    } catch (error) {
      if (error.name === "AbortError") return;
      console.error("Error fetching movie details:", error);
      setDetailsErrorMessage(
        "Failed to fetch movie details. Please try again later.",
      );
    } finally {
      setIsDetailsLoading(false);
    }
  }, []);

  const handleMovieSelect = (movieId) => {
    window.history.pushState(null, "", `/movie/${movieId}`);
    setSelectedMovieId(String(movieId));
  };

  const handleHomeNavigate = () => {
    window.history.pushState(null, "", "/");
    setSelectedMovieId(null);
  };

  const handleSearchSubmit = () => {
    setSubmittedSearchTerm(searchTerm.trim());
  };

  const handleSearchClear = () => {
    setSearchTerm("");
    setSubmittedSearchTerm("");
  };

  useEffect(() => {
    const handlePopState = () => setSelectedMovieId(getMovieIdFromPath());

    window.addEventListener("popstate", handlePopState);

    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    if (selectedMovieId) return;

    const controller = new AbortController();
    fetchMovies(submittedSearchTerm, controller.signal);

    return () => controller.abort();
  }, [submittedSearchTerm, fetchMovies, selectedMovieId]);

  useEffect(() => {
    if (!selectedMovieId) {
      setMovieDetails(null);
      setDetailsErrorMessage("");
      return;
    }

    const controller = new AbortController();
    fetchMovieDetails(selectedMovieId, controller.signal);

    return () => controller.abort();
  }, [fetchMovieDetails, selectedMovieId]);

  useEffect(() => {
    if (selectedMovieId) return;

    const controller = new AbortController();
    fetchTrendingMovies(controller.signal);

    return () => controller.abort();
  }, [selectedMovieId, fetchTrendingMovies]);

  return (
    <main>
      <div className="pattern" />
      <div className="wrapper">
        {selectedMovieId ? (
          isDetailsLoading ? (
            <Spinner />
          ) : detailsErrorMessage ? (
            <div className="details-state">
              <button
                type="button"
                className="back-button"
                onClick={handleHomeNavigate}
              >
                Back to movies
              </button>
              <p className="my-9 text-red-500">{detailsErrorMessage}</p>
            </div>
          ) : (
            movieDetails && (
              <MovieDetails movie={movieDetails} onBack={handleHomeNavigate} />
            )
          )
        ) : (
          <>
            <header>
              <img src="/hero.png" alt="Hero Banner" />
              <h1>
                Find <span className="text-gradient">Movies</span> You'll Enjoy
                Without the Hassle
              </h1>

              <Search
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                onSubmit={handleSearchSubmit}
                onClear={handleSearchClear}
                isSearchActive={
                  submittedSearchTerm.length > 0 &&
                  searchTerm.trim() === submittedSearchTerm
                }
              />
            </header>

            <section className="trending">
              <h2>Trending Movies</h2>

              {isTrendingLoading ? (
                <p className="my-9 text-white">Loading trending movies...</p>
              ) : trendingErrorMessage ? (
                <p className="my-9 text-red-500">{trendingErrorMessage}</p>
              ) : trendingMovies.length > 0 ? (
                <ul>
                  {trendingMovies.map((movie, index) => (
                    <li
                      key={movie.$id}
                      onClick={() => handleMovieSelect(movie.movie_id)}
                      style={{ cursor: "pointer" }}
                    >
                      <p>{index + 1}</p>
                      <img src={movie.poster_url} alt={movie.title} />
                    </li>
                  ))}
                </ul>
              ) : null}
            </section>

            <section className="all-movies">
              <h2>All Movies</h2>

              {isLoading ? (
                <Spinner />
              ) : errorMessage ? (
                <p className="my-9 text-red-500">{errorMessage}</p>
              ) : movieList.length === 0 ? (
                <p className="text-white">No movies found.</p>
              ) : (
                <ul>
                  {movieList.map((movie) => (
                    <MovieCard
                      key={movie.id}
                      movie={movie}
                      onMovieSelect={handleMovieSelect}
                    />
                  ))}
                </ul>
              )}
            </section>
          </>
        )}
      </div>
    </main>
  );
};

export default App;

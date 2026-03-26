import { useState, useEffect, useCallback } from "react";
import Search from "./components/Search";
import Spinner from "./components/Spinner";
import MovieCard from "./components/MovieCard";
import { useDebounce } from "react-use";
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

const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  const [movieList, setMovieList] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);

  const [errorMessage, setErrorMessage] = useState("");
  const [trendingErrorMessage, setTrendingErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useDebounce(() => setDebouncedSearchTerm(searchTerm), 1000, [searchTerm]);

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

      setMovieList(data.results || []);

      if (query && data.results.length > 0) {
        updateSearchCount(query, data.results[0]);
      }
    } catch (error) {
      if (error.name === "AbortError") return;
      console.error("Error fetching movies:", error);
      setErrorMessage("Failed to fetch movies. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchTrendingMovies = async () => {
    setTrendingErrorMessage("");

    try {
      const movies = await getTrendingMovies();

      if (!Array.isArray(movies)) {
        throw new Error("Failed to fetch trending movies.");
      }

      setTrendingMovies(movies || []);
    } catch (error) {
      console.error("Error fetching trending movies:", error);
      setTrendingErrorMessage(
        "Failed to fetch trending movies. Please try again later.",
      );
      setTrendingMovies([]);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    fetchMovies(debouncedSearchTerm, controller.signal);

    return () => controller.abort();
  }, [debouncedSearchTerm, fetchMovies]);

  useEffect(() => {
    fetchTrendingMovies();
  }, []);

  return (
    <main>
      <div className="pattern" />
      <div className="wrapper">
        <header>
          <img src="./hero.png" alt="Hero Banner" />
          <h1>
            Find <span className="text-gradient">Movies</span> You'll Enjoy
            Without the Hassle
          </h1>

          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        <section className="trending">
          <h2>Trending Movies</h2>

          {trendingErrorMessage ? (
            <p className="my-9 text-red-500">{trendingErrorMessage}</p>
          ) : (
            trendingMovies.length > 0 && (
              <ul>
                {trendingMovies.map((movie, index) => (
                  <li key={movie.$id}>
                    <p>{index + 1}</p>
                    <img src={movie.poster_url} alt={movie.title} />
                  </li>
                ))}
              </ul>
            )
          )}
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
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
};

export default App;

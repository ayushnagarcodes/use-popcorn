import { useEffect, useState } from "react";
import NavBar from "./components/NavBar";
import Box from "./components/Box";
import MoviesList from "./components/MoviesList";
import SavedMoviesSummary from "./components/SavedMoviesSummary";
import SavedMoviesList from "./components/SavedMoviesList";
import MovieDetails from "./components/MovieDetails";
import Loader from "./components/Loader";
import ErrorMessage from "./components/ErrorMessage";

export const key = "5efa1949";

export default function App() {
    const [query, setQuery] = useState("");
    const [movies, setMovies] = useState([]);
    const [watched, setWatched] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [selectedId, setSelectedId] = useState(null);

    function handleSelectMovie(id) {
        id === selectedId ? setSelectedId(null) : setSelectedId(id);
    }

    function handleCloseMovie() {
        setSelectedId(null);
    }

    function handleAddWatched(obj) {
        setWatched([...watched, obj]);
    }

    function handleDeleteWatched(id) {
        setWatched((watched) => watched.filter((el) => el.imdbID !== id));
    }

    useEffect(
        function () {
            const controller = new AbortController();

            async function fetchMovies() {
                try {
                    setIsLoading(true);
                    setError("");

                    const response = await fetch(
                        `http://www.omdbapi.com/?apikey=${key}&s=${query}`,
                        { signal: controller.signal }
                    );
                    if (!response.ok) throw new Error("Failed to fetch");

                    const data = await response.json();
                    if (data.Response === "False")
                        throw new Error("Movie not found");

                    setMovies(data.Search);
                    setError("");
                } catch (err) {
                    if (err.name !== "AbortError") setError(err.message);
                } finally {
                    setIsLoading(false);
                }
            }

            if (query.length < 3) {
                setMovies([]);
                setError("");
                return;
            }

            handleCloseMovie();
            fetchMovies();

            return function () {
                controller.abort();
            };
        },
        [query]
    );

    return (
        <>
            <NavBar query={query} setQuery={setQuery} movies={movies} />
            <Main>
                <Box>
                    {isLoading && <Loader />}
                    {error && <ErrorMessage message={error} />}
                    {!isLoading && !error && (
                        <MoviesList
                            movies={movies}
                            onSelectMovie={handleSelectMovie}
                        />
                    )}
                </Box>

                <Box>
                    {selectedId ? (
                        <MovieDetails
                            selectedId={selectedId}
                            onCloseMovie={handleCloseMovie}
                            onAddWatched={handleAddWatched}
                            watched={watched}
                        />
                    ) : (
                        <>
                            <SavedMoviesSummary watched={watched} />
                            <SavedMoviesList
                                watched={watched}
                                onDeleteWatched={handleDeleteWatched}
                            />
                        </>
                    )}
                </Box>
            </Main>
        </>
    );
}

function Main({ children }) {
    return <main className="main">{children}</main>;
}

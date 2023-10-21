import { useEffect, useState } from "react";
import { key } from "../App";
import StarRating from "./StarRating";
import Loader from "./Loader";
import ErrorMessage from "./ErrorMessage";

export default function MovieDetails({
    selectedId,
    onCloseMovie,
    onAddWatched,
    watched,
}) {
    const [movie, setMovie] = useState({});
    const [userRating, setUserRating] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const alreadyWatched = watched.find((el) => el.imdbID === selectedId);

    const {
        Title: title,
        Year: year,
        Poster: poster,
        Runtime: runtime,
        imdbRating,
        Plot: plot,
        Released: released,
        Actors: actors,
        Director: director,
        Genre: genre,
    } = movie;

    function handleAddWatched() {
        const newWatchedMovie = {
            imdbID: selectedId,
            title,
            year,
            poster,
            imdbRating: Number(imdbRating),
            userRating,
            runtime: Number(runtime.split(" ").at(0)),
        };
        onAddWatched(newWatchedMovie);
        onCloseMovie();
    }

    useEffect(
        function () {
            async function fetchDetails() {
                try {
                    setIsLoading(true);
                    setError("");

                    const response = await fetch(
                        `https://www.omdbapi.com/?apikey=${key}&i=${selectedId}`
                    );
                    if (!response.ok) throw new Error("Failed to fetch");

                    const data = await response.json();
                    setMovie(data);
                } catch (err) {
                    setError(err.message);
                } finally {
                    setIsLoading(false);
                }
            }

            fetchDetails();
        },
        [selectedId]
    );

    useEffect(
        function () {
            if (!title) return;
            document.title = `Movie | ${title}`;

            return function () {
                document.title = "usePopcorn";
            };
        },
        [title]
    );

    useEffect(
        function () {
            function handleEscKey(e) {
                if (e.key === "Escape") onCloseMovie();
            }

            document.addEventListener("keydown", handleEscKey);

            return function () {
                document.removeEventListener("keydown", handleEscKey);
            };
        },
        [onCloseMovie]
    );

    return (
        <div className="details">
            {isLoading && <Loader />}
            {error && <ErrorMessage message={error} />}
            {!isLoading && !error && (
                <>
                    <header>
                        <button className="btn-back" onClick={onCloseMovie}>
                            &larr;
                        </button>
                        <img src={poster} alt={`Poster of ${movie} movie`} />
                        <div className="details-overview">
                            <h2>{title}</h2>
                            <p>
                                {released} &bull; {runtime}
                            </p>
                            <p>{genre}</p>
                            <p>
                                <span>⭐️</span>
                                {imdbRating} IMDb rating
                            </p>
                        </div>
                    </header>

                    <section>
                        <div className="rating">
                            {!alreadyWatched ? (
                                <>
                                    <StarRating
                                        numStars={10}
                                        userRating={userRating}
                                        setUserRating={setUserRating}
                                    />

                                    {userRating > 0 && (
                                        <button
                                            className="btn-add"
                                            onClick={handleAddWatched}
                                        >
                                            + Add to list
                                        </button>
                                    )}
                                </>
                            ) : (
                                <p>
                                    You rated this movie{" "}
                                    {alreadyWatched.userRating}⭐️
                                </p>
                            )}
                        </div>
                        <p>
                            <em>{plot}</em>
                        </p>
                        <p>Starring {actors}</p>
                        <p>Directed by {director}</p>
                    </section>
                </>
            )}
        </div>
    );
}

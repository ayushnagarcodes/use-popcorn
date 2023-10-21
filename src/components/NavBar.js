import { useEffect, useRef } from "react";

export default function NavBar({ query, setQuery, movies }) {
    const inputEl = useRef(null);

    useEffect(
        function () {
            function handleEnterKey(e) {
                // if (document.activeElement === inputEl.current) return;

                if (e.key === "Enter" && e.target !== inputEl.current) {
                    inputEl.current.focus();
                    setQuery("");
                }
            }

            document.addEventListener("keydown", handleEnterKey);

            return function () {
                document.removeEventListener("keydown", handleEnterKey);
            };
        },
        [setQuery]
    );

    return (
        <nav className="nav-bar">
            <div className="logo">
                <span role="img">🍿</span>
                <h1>usePopcorn</h1>
            </div>

            <input
                className="search"
                type="text"
                placeholder="Search movies..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                ref={inputEl}
            />

            <p className="num-results">
                Found <strong>{movies.length}</strong> results
            </p>
        </nav>
    );
}

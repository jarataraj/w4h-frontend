import { useGeolocate } from "services/search";
import { MdClear } from "react-icons/md";
import SpinLoader from "components/SpinLoader";

const SearchInput = ({
    searchInput,
    input,
    setInput,
    searchQuery,
    setSearchQuery,
    isLoadingSearchInput,
    onSuccess,
    onError,
}) => {
    useGeolocate(searchQuery, onSuccess, onError);

    const showLoader = searchQuery || isLoadingSearchInput;

    return (
        <form
            className="search-form"
            onSubmit={(e) => {
                e.preventDefault();
                setSearchQuery(input);
            }}
        >
            <input
                className="search-input"
                ref={searchInput}
                type="search"
                value={input}
                name="search"
                autoComplete="off"
                placeholder="Search Locations"
                onChange={({ target }) => setInput(target.value)}
            />
            {input && !showLoader && (
                <button
                    className="clear-search position-in-searchbar"
                    type="button"
                    onClick={() => setInput("")}
                >
                    <MdClear />
                </button>
            )}
            {showLoader && (
                <SpinLoader className="search-loader position-in-searchbar" />
            )}
        </form>
    );
};

export default SearchInput;

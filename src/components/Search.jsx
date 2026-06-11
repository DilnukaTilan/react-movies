const Search = ({
  searchTerm,
  setSearchTerm,
  onSubmit,
  onClear,
  isSearchActive,
}) => {
  const handleSubmit = (event) => {
    event.preventDefault();

    if (isSearchActive) {
      onClear();
      return;
    }

    onSubmit();
  };

  return (
    <form className="search" onSubmit={handleSubmit}>
      <div>
        <img src="/search.svg" alt="search" />
        <input
          type="text"
          placeholder="Search for a movie..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button type="submit">{isSearchActive ? "Clear" : "Search"}</button>
      </div>
    </form>
  );
};

export default Search;

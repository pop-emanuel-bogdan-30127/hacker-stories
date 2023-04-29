import styles from "./App.module.css";
import React from "react";
import axios from "axios";
import List from "./components/List";
import SearchForm from "./components/SearchForm";

const storiesReducer = (state, action) => {
  switch (action.type) {
    case "STORIES_FETCH_INIT":
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case "STORIES_FETCH_SUCCESS":
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload,
      };
    case "STORIES_FETCH_FAILURE":
      return {
        ...state,
        isLoading: false,
        isError: true,
      };
    case "REMOVE_STORY":
      return {
        ...state,
        data: state.data.filter(
          (story) => action.payload.objectID !== story.objectID
        ),
      };

    default:
      throw new Error();
  }
};

const useSemiPersistentState = (key, initialState) => {
  const [value, setValue] = React.useState(
    localStorage.getItem(key) || initialState
  );

  React.useEffect(() => {
    localStorage.setItem(key, value);
  }, [value, key]);
  return [value, setValue];
};

const extractSearchTerm = (url) => url.replace(API_ENDPOINT, "");

const getLastSearches = (urls) => urls.slice(-5).map(extractSearchTerm);

const getUrl = (searchTerm) => `${API_ENDPOINT}${searchTerm}`;

const API_ENDPOINT = "https://hn.algolia.com/api/v1/search?query=";

////////////////////////////////////

const App = () => {
  const [searchTerm, setSearchTerm] = useSemiPersistentState("search", "React");

  const [urls, setUrls] = React.useState([getUrl(searchTerm)]);

  const [stories, dispatchStories] = React.useReducer(storiesReducer, {
    data: [],
    isLoading: false,
    isError: false,
  });

  const handleSearchInput = (event) => {
    setSearchTerm(event.target.value);
  };
  const handleSearchSubmit = (event) => {
    handleSearch(searchTerm);
    event.preventDefault();
  };
  const handleLastSearch = (searchTerm) => {
    handleSearch(searchTerm);
  };
  const handleSearch = (searchTerm) => {
    const url = getUrl(searchTerm);
    setUrls(urls.concat(url));
  };

  const lastSearches = getLastSearches(urls);

  const handleFetchStories = React.useCallback(async () => {
    dispatchStories({ type: "STORIES_FETCH_INIT" });

    try {
      const lastUrl = urls[urls.length - 1];
      const result = await axios.get(lastUrl);

      dispatchStories({
        type: "STORIES_FETCH_SUCCESS",
        payload: result.data.hits,
      });
    } catch {
      dispatchStories({ type: "STORIES_FETCH_FAILURE" });
    }
  }, [urls]);

  React.useEffect(() => {
    handleFetchStories();
  }, [handleFetchStories]);

  const handleRemoveStory = (item) => {
    dispatchStories({
      type: "SET_STORIES",
      payload: item,
    });
  };
  ////////////////////////////////////
  return (
    <div className={styles.container}>
      <div>
        <h1 className={styles.headlinePrimary}>My Hacker Stories</h1>

        <SearchForm
          searchTerm={searchTerm}
          onSearchInput={handleSearchInput}
          onSearchSubmit={handleSearchSubmit}
        />

        {lastSearches.map((searchTerm) => (
          <button
            key={searchTerm}
            type="button"
            onClick={() => handleLastSearch(searchTerm)}
            className={`${styles.button} ${styles.buttonSmall}`}
          >
            {searchTerm}
          </button>
        ))}

        <hr />

        <p>
          Searching for <strong>{searchTerm}</strong>.
        </p>

        <hr />
        {stories.isError && <p>Something went wrong ...</p>}

        {stories.isLoading ? (
          <p>Loading ...</p>
        ) : (
          <List list={stories.data} onRemoveItem={handleRemoveStory} />
        )}

        <hr />
      </div>
    </div>
  );
};

export default App;

import React from "react";
import InputWithLabel from "./InputWithLabel";
import styles from "../App.module.css";

const SearchForm = ({ searchTerm, onSearchInput, onSearchSubmit }) => (
  <form onSubmit={onSearchSubmit}>
    <InputWithLabel
      id="search"
      value={searchTerm}
      onInputChange={onSearchInput}
    >
      <strong>Search:</strong>
    </InputWithLabel>
    <button
      className={`${styles.button} ${styles.buttonLarge}`}
      disabled={!searchTerm}
    >
      Submit
    </button>
  </form>
);

export default SearchForm;

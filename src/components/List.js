import React from "react";
import styles from "../App.module.css";
import { sortBy } from "lodash";

const SORTS = {
  NONE: (list) => list,
  TITLE: (list) => sortBy(list, "title"),
  AUTHOR: (list) => sortBy(list, "author"),
  COMMENT: (list) => sortBy(list, "num_comments").reverse(),
  POINT: (list) => sortBy(list, "points").reverse(),
};

const List = ({ list, onRemoveItem }) => {
  const [sort, setSort] = React.useState({
    sortKey: "NONE",
    isReverse: false,
  });

  const handleSort = (sortKey) => {
    const isReverse = sort.sortKey === sortKey && !sort.isReverse;
    setSort({ sortKey, isReverse });
  };

  const sortFunction = SORTS[sort.sortKey];
  const sortedList = sort.isReverse
    ? sortFunction(list).reverse()
    : sortFunction(list);

  return (
    <div>
      <div style={{ display: "flex" }}>
        <span style={{ width: "38%", textAlign: "center" }}>
          <button
            className={`${styles.button} ${styles.buttonSmall}`}
            onClick={() => handleSort("TITLE")}
          >
            Title
          </button>
        </span>
        <span style={{ width: "15%", textAlign: "center" }}>
          <button
            className={`${styles.button} ${styles.buttonSmall}`}
            onClick={() => handleSort("AUTHOR")}
          >
            Author
          </button>
        </span>
        <span style={{ width: "15%", textAlign: "center" }}>
          <button
            className={`${styles.button} ${styles.buttonSmall}`}
            onClick={() => handleSort("COMMENT")}
          >
            Comments
          </button>
        </span>
        <span style={{ width: "17%", textAlign: "center" }}>
          <button
            className={`${styles.button} ${styles.buttonSmall}`}
            onClick={() => handleSort("POINT")}
          >
            Points
          </button>
        </span>
        <span style={{ width: "15%", textAlign: "center" }}>Actions</span>
      </div>
      {sortedList.map((item) => (
        <Item key={item.objectID} item={item} onRemoveItem={onRemoveItem} />
      ))}
    </div>
  );
};
const Item = ({ item, onRemoveItem }) => (
  <div style={{ display: "flex" }} className={styles.item}>
    <span style={{ width: "40%" }}>
      <a href={item.url}>{item.title}</a>
    </span>
    <span style={{ width: "20%" }}>{item.author}</span>
    <span style={{ width: "15%" }}>{item.num_comments}</span>
    <span style={{ width: "15%" }}>{item.points}</span>
    <span style={{ width: "10%" }}>
      <button
        className={`${styles.button} ${styles.buttonSmall}`}
        onClick={() => onRemoveItem(item)}
      >
        Dismiss
      </button>
    </span>
  </div>
);

export default List;

import React from "react";
import styles from "../App.module.css";

const InputWithLabel = ({
  id,
  value,
  type = "text",
  onInputChange,
  children,
}) => (
  <>
    <label htmlFor={id} className={styles.label}>
      {children}
    </label>
    &nbsp;
    <input
      id={id}
      type={type}
      value={value}
      onChange={onInputChange}
      className={styles.input}
    />
  </>
);
export default InputWithLabel;

//#region imports
import type { FC } from "react";
import { Link } from "react-router";
import { Logo } from "../Logo"
import styles from "./HomeLink.module.scss";
//#endregion

interface Props {
  onClick?: () => void;
}

export const HomeLink:FC<Props> = ({ onClick }) => (
  <Link to='/' className={styles.homeLink} onClick={onClick}>
    <Logo /> Concert Town
  </Link>
);

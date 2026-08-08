//#region imports
import { Link } from "react-router";
import { Logo } from "../Logo";
import styles from "./HomeLink.module.scss";
//#endregion

export const HomeLink = () => (
  <Link to='/' className={styles.homeLink}>
    <Logo /> Concert Town
  </Link>
);

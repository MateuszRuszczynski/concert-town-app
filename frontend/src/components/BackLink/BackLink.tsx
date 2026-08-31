//#region imports
import { Link } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import type { FC } from 'react';
import styles from './BackLink.module.scss';
//#endregion

interface Props {
  to: string;
  label: string;
}

export const BackLink: FC<Props> = ({ to, label }) => (
  <Link to={to} className={styles.backLink}>
    <ArrowLeft size={16} aria-hidden="true" />
    {label}
  </Link>
);

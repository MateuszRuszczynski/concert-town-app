//#region imports
import type { FC } from "react";
import { StatCard } from "../StatCard";
import type { StatItem } from "../../types/statItem";
import styles from './base.module.scss';
//#endregion

interface Props {
  stats: StatItem[];
};

export const StatsGridLayout: FC<Props> = ({ stats }) => (
  <div className={styles.statsGrid}>
    {stats.map((stat) => (
      <StatCard key={stat.label} {...stat} />
    ))}
  </div>
);

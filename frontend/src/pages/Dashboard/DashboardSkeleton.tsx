//#region imports
import { PageHeaderSkeleton } from '../../components/ui/PageHeader/PageHeaderSkeleton';
import { PanelSkeleton } from './components/PanelSkeleton';
import styles from './DashboardSkeleton.module.scss';
//#endregion

export const DashboardSkeleton = () => (
  <div className={styles.dashboard}>
    <PageHeaderSkeleton />

    <PanelSkeleton />
  </div>
)

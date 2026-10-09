//#region imports
import cn from 'classNames';
import { CheckCircle, Clock, XCircle, type LucideIcon } from 'lucide-react';
import type { FC } from 'react';
import type { OrganizerRequestStatus } from '../../../types/organizerRequest';
import styles from './OrganizerRequestStatusBadge.module.scss';
//#endregion

const STATUS_CONFIG: Record<OrganizerRequestStatus, { label: string; icon: LucideIcon; className: string }> = {
  pending: { label: 'Pending', icon: Clock, className: styles.pending },
  approved: { label: 'Approved', icon: CheckCircle, className: styles.approved },
  rejected: { label: 'Rejected', icon: XCircle, className: styles.rejected },
};

export const OrganizerRequestStatusBadge: FC<{ status: OrganizerRequestStatus }> = ({ status }) => {
  const { label, icon: Icon, className } = STATUS_CONFIG[status];
  return (
    <span className={cn(styles.badge, className)}>
      <Icon size={12} aria-hidden="true" />
      {label}
    </span>
  );
};

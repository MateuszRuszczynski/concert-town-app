//#region imports
import type { FC } from 'react';
import type { OrganizerRequest } from '../../../../types/organizerRequest';
import { EmptyBlock } from '../../../../components/ui/EmptyBlock';
import { Check, Mail, X } from 'lucide-react';
import { SkeletonItem } from '../../../../components/ui/SkeletonItem';
import { Button, ButtonSkeleton } from '../../../../components/ui/Button';
import { Table } from '../../../../components/ui/Table';
import { OrganizerRequestStatusBadge } from '../../../../components/organizer/OrganizerRequestStatusBadge';
import styles from './OrganizerRequestsTable.module.scss';
//#endregion

interface Props {
  requests: OrganizerRequest[];
  isLoading: boolean;
  onApprove?: (id: number) => void;
  onReject?: (id: number) => void;
}

export const OrganizerRequestsTable: FC<Props> = ({
  requests,
  isLoading,
  onApprove = () => {},
  onReject = () => {}
}) => {
  if (!isLoading && requests.length === 0) {
    return <EmptyBlock emptyMessage='No requests found.' />;
  }

  return (
    <Table rowHover={false}>
      <thead>
        <tr>
          <th>#</th>
          <th>
            <span>
              <Mail size={14} aria-hidden='true' />
              Email
            </span>
          </th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => (
              <tr key={i}>
                <td>
                  <SkeletonItem additionalClass={styles.numberSkeleton} />
                </td>

                <td>
                  <SkeletonItem additionalClass={styles.emailSkeleton} />
                </td>

                <td>
                  <SkeletonItem additionalClass={styles.statusSkeleton} />
                </td>

                <td>
                  <div className={styles.actionButtons}>
                    <ButtonSkeleton />

                    <ButtonSkeleton />
                  </div>
                </td>
              </tr>
            ))
          : requests.map((request, i) => (
              <tr key={request.id}>
                <td>{i + 1}</td>
                <td>{request.userEmail}</td>
                <td><OrganizerRequestStatusBadge status={request.status} /></td>
                <td>
                  {request.status === 'pending' && (
                    <div className={styles.actionButtons}>
                      <Button
                        onClick={() => onApprove(request.id)}
                        aria-label='Approve request'
                        variant='success'
                      >
                        <span className={styles.buttonLabel}>Approve</span>
                        <Check size={16} aria-hidden='true' />
                      </Button>

                      <Button
                        onClick={() => onReject(request.id)}
                        aria-label='Reject request'
                        variant='danger'
                      >
                        <span className={styles.buttonLabel}>Reject</span>
                        <X size={16} aria-hidden='true' />
                      </Button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
      </tbody>
    </Table>
  );
};

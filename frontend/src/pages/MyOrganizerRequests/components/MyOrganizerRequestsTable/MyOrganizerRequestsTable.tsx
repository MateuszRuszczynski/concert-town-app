//#region imports
import type { FC } from 'react';
import type { OrganizerRequest } from '../../../../types/organizerRequest';
import { EmptyBlock } from '../../../../components/ui/EmptyBlock';
import { Table } from '../../../../components/ui/Table';
import { SkeletonItem } from '../../../../components/ui/SkeletonItem';
import { OrganizerRequestStatusBadge } from '../../../../components/organizer/OrganizerRequestStatusBadge';
import styles from './MyOrganizerRequestsTable.module.scss';
//#endregion

interface Props {
  requests: OrganizerRequest[];
  isLoading: boolean;
}

export const MyOrganizerRequestsTable: FC<Props> = ({
  requests,
  isLoading
}) => {
  if (!isLoading && requests.length === 0) {
    return <EmptyBlock emptyMessage='No requests found.' />;
  }

  return (
    <Table>
      <thead>
        <tr>
          <th>#</th>
          <th>
            <span>Request</span>
          </th>
          <th>Status</th>
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
                  <SkeletonItem additionalClass={styles.requestSkeleton} />
                </td>

                <td>
                  <SkeletonItem additionalClass={styles.statusSkeleton} />
                </td>
              </tr>
            ))
          : requests.map((request, i) => (
              <tr key={request.id}>
                <td>{i + 1}</td>
                <td>Request to become an organizer</td>
                <td>
                  <OrganizerRequestStatusBadge status={request.status} />
                </td>
              </tr>
            ))}
      </tbody>
    </Table>
  );
};

//#region imports
import type { FC } from 'react';
import type { Participant } from '../../../../types/events';
import { Mail, User } from 'lucide-react';
import { EmptyBlock } from '../../../../components/ui/EmptyBlock';
import { SkeletonItem } from '../../../../components/ui/SkeletonItem';
import { Table } from '../../../../components/ui/Table';
import styles from './ParticipantsTable.module.scss';
//#endregion

interface Props {
  participants: Participant[];
  isLoading?: boolean;
}

export const ParticipantsTable: FC<Props> = ({
  participants,
  isLoading = false
}) => {
  if (!isLoading && participants.length === 0) {
    return (
      <EmptyBlock emptyMessage='No one has registered for this event yet.' />
    );
  }

  return (
    <Table>
      <thead>
        <tr>
          <th>#</th>
          <th>
            <span>
              <User
                size={14}
                aria-hidden='true'
                className={styles.headerIcon}
              />
              Name
            </span>
          </th>

          <th>
            <span>
              <Mail size={14} aria-hidden='true' />
              Email
            </span>
          </th>
        </tr>
      </thead>

      <tbody>
        {isLoading
          ? Array.from({ length: 5 }).map((_, i) => (
              <tr key={i}>
                <td>
                  <SkeletonItem additionalClass={styles.numberSkeleton} />
                </td>
                <td>
                  <SkeletonItem additionalClass={styles.nameSkeleton} />
                </td>
                <td>
                  <SkeletonItem additionalClass={styles.emailSkeleton} />
                </td>
              </tr>
            ))
          : participants.map((participant, i) => (
              <tr key={participant.userId}>
                <td>{i + 1}</td>
                <td>{participant.name}</td>
                <td>{participant.email}</td>
              </tr>
            ))}
      </tbody>
    </Table>
  );
};

//#region imports
import type { FC } from 'react';
import type { Participant } from '../../../../types/events';
import { Mail, User } from 'lucide-react';
import { EmptyBlock } from '../../../../components/EmptyBlock';
import { SkeletonItem } from '../../../../components/SkeletonItem';
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
    <table className={styles.table}>
      <thead>
        <tr>
          <th className={styles.headerCell}>#</th>
          <th className={styles.headerCell}>
            <span className={styles.headerContent}>
              <User
                size={14}
                aria-hidden='true'
                className={styles.headerIcon}
              />
              Name
            </span>
          </th>

          <th className={styles.headerCell}>
            <span className={styles.headerContent}>
              <Mail
                size={14}
                aria-hidden='true'
                className={styles.headerIcon}
              />
              Email
            </span>
          </th>
        </tr>
      </thead>

      <tbody>
        {isLoading
          ? Array.from({ length: 5 }).map((_, i) => (
              <tr className={styles.row} key={i}>
                <td className={styles.cell}>
                  <SkeletonItem additionalClass={styles.numberSkeleton} />
                </td>
                <td className={styles.cell}>
                  <SkeletonItem additionalClass={styles.nameSkeleton} />
                </td>
                <td className={styles.cell}>
                  <SkeletonItem additionalClass={styles.emailSkeleton} />
                </td>
              </tr>
            ))
          : participants.map((participant, i) => (
              <tr key={participant.userId} className={styles.row}>
                <td className={styles.cell}>{i + 1}</td>
                <td className={styles.cell}>{participant.name}</td>
                <td className={styles.cell}>{participant.email}</td>
              </tr>
            ))}
      </tbody>
    </table>
  );
};

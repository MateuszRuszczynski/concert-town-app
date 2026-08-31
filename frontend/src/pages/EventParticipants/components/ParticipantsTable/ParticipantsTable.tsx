//#region imports
import type { FC } from 'react';
import type { Participant } from '../../../../types/events';
import styles from './ParticipantsTable.module.scss';
import { Mail, User } from 'lucide-react';
//#endregion

interface Props {
  participants: Participant[];
}

export const ParticipantsTable: FC<Props> = ({ participants }) => {
  if (participants.length === 0) {
    return (
      <p className={styles.emptyState}>
        No one has registered for this event yet.
      </p>
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
        {participants.map((participant, i) => (
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

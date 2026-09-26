//#region imports
import type { FC } from 'react';
import { ParticipantsTable } from './components/ParticipantsTable';
import { BackLink } from '../../components/BackLink';
import { PageHeader } from '../../components/PageHeader';
import { SkeletonItem } from '../../components/SkeletonItem';
import baseStyles from './base.module.scss';
import styles from './EventParticipantsSkeleton.module.scss';
//#endregion

interface Props {
  eventId: string;
}

export const EventParticipantsSkeleton: FC<Props> = ({ eventId }) => {
  return (
    <div className={baseStyles.eventParticipants}>
      <div className={baseStyles.topBar}>
        <BackLink to={`/events/${eventId}`} label='Back to event' />

        <PageHeader
          title='Participants'
          subtitle={<SkeletonItem additionalClass={styles.headerSubtitle} />}
        />
      </div>

      <ParticipantsTable participants={[]} isLoading={true} />
    </div>
  );
};

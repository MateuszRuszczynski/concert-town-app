//#region imports
import { useNavigate } from 'react-router';
import { ClipboardList } from 'lucide-react';
import { useOrganizerRequests } from '../../../contexts/OrganizerContext/useOrganizerRequests';
import { Button } from '../../ui/Button';
import styles from './OrganizerRequestsBadge.module.scss';
//#endregion

export const OrganizerRequestsBadge = () => {
  const { pendingCount } = useOrganizerRequests();
  const navigate = useNavigate();

  return (
    <Button
      variant='secondary'
      fitContent={true}
      onClick={() => navigate('/organizer-requests')}
      aria-label='Organizer requests'
    >
      <ClipboardList size={18} aria-hidden='true' />
      Review requests
      {pendingCount > 0 && (
        <span className={styles.count}>{`(${pendingCount})`}</span>
      )}
    </Button>
  );
};

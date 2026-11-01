//#region imports
import { useNavigate } from 'react-router';
import { ClipboardList } from 'lucide-react';
import { Button } from '../../ui/Button';
import { usePendingRequestsCount } from '../../../api/queries/organizerRequests';
//#endregion

export const OrganizerRequestsBadge = () => {
  const pendingCount = usePendingRequestsCount();
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
        <span>{`(${pendingCount})`}</span>
      )}
    </Button>
  );
};

//#region imports
import { useNavigate } from 'react-router';
import { Plus } from 'lucide-react';
import type { FC } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { Button } from '../../ui/Button';
//#endregion

interface Props {
  fitContent?: boolean;
  onNavigate?: () => void;
}

export const AddEventButton: FC<Props> = ({ onNavigate, fitContent }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleClick = () => {
    navigate('/events/new');
    onNavigate?.();
  };

  return (
    <Button
      fitContent={fitContent}
      onClick={handleClick}
      disabled={user?.role === 'customer'}
    >
      <Plus size={16} />
      Add event
    </Button>
  );
};

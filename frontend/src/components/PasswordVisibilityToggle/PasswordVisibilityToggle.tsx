import { Eye, EyeOff } from "lucide-react";
import styles from "./PasswordVisibilityToggle.module.scss";

interface Props {
  isVisible: boolean;
  onToggle: () => void;
}

export const PasswordVisibilityToggle = ({ isVisible, onToggle }: Props) => (
  <button
    type="button"
    className={styles.toggleButton}
    onClick={onToggle}
    aria-label={isVisible ? 'Hide password' : 'Show password'}
  >
    {isVisible ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
  </button>
);

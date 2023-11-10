import styles from '../styles/MainStyles.css';
import { useNavigate } from '@remix-run/react';

export const links = () => [{ rel: 'stylesheet', href: styles }];

export default function Index() {
  const navigate = useNavigate();
  const navigateToSignup = () => {
    navigate('/signup');
  };

  return (
    <div class='centered-container'>
      <h1>Remix/React Assessment</h1>
      <button onClick={navigateToSignup} class='signup-button'>
        Proceed
      </button>
    </div>
  );
}

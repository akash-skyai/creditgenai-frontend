import { Outlet } from 'react-router-dom';
import styles from './BorrowerLayout.module.scss';

export default function BorrowerLayout() {
  return (
    <div className={styles.layout}>
      {/* 
        This is the minimal shell for the borrower flow.
        No navigation bar, no dark mode toggle.
        Just a full-screen container that will render the nested pages.
      */}
      <Outlet />
    </div>
  );
}

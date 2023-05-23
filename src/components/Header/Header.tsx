import Link from 'next/link';
import { FaGithub } from 'react-icons/fa';

import {Container, LogoContainer} from '@components/Container';

import styles from './Header.module.scss';

const Header = () => {
  return (
    <header className={styles.header}>
        <LogoContainer />
    </header>
  );
};

export default Header;

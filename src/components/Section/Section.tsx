//@ts-nocheck
import { forwardRef } from 'react';

import styles from './Section.module.scss';

const Section = forwardRef(function Section(props, ref) {
  const { children} = props;

  let sectionClassName = styles.section;

  return (
    <section ref={ref}>
      {children}
    </section>
  );
});

export default Section;

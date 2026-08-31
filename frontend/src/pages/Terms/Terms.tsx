//#region imports
import { usePageTitle } from "../../hooks/usePageTitle";
import { TERMS_CLAUSES } from "./termsContent";
import styles from "./Terms.module.scss";
//#endregion

export const Terms = () => {
  usePageTitle('Terms and Conditions');

  return (
    <section className={styles.legalPage}>
      <div className={styles.pageContent}>
        <h1 className={styles.title}>Terms and Conditions</h1>

        <p className={styles.lastUpdated}>Last updated: August 2026</p>

        <ol className={styles.clauseList}>
          {TERMS_CLAUSES.map(clause => (
            <li key={clause.title} className={styles.clauseItem}>
              <h2 className={styles.clauseTitle}>{clause.title}</h2>
              {clause.paragraphs.map((paragraph, pIndex) => (
                <p key={pIndex} className={styles.clauseParagraph}>
                  {paragraph}
                </p>
              ))}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};

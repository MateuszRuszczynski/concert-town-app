//#region imports
import { Link } from "react-router";
import { usePageTitle } from "../../hooks/usePageTitle";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "../../components/PageHeader";
import { EventForm } from "../../components/EventForm";
import styles from "./NewEvent.module.scss";
//#endregion

export const NewEvent = () => {
  usePageTitle('New Event');

  return (
    <section className={styles.newEvent}>
      <div className={styles.topBar}>
        <Link to="/events" className={styles.backButton}>
          <ArrowLeft size={16} />
          Back to events
        </Link>

        <PageHeader
          title='Create a new event'
          subtitle='Fill in the details below to publish or save a draft event.'
        />
      </div>
      
      <EventForm />
    </section>
  );
};

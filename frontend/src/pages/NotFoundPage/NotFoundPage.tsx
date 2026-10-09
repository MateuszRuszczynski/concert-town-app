import { usePageTitle } from "../../hooks/usePageTitle";
import { ErrorPage } from "../ErrorPage";

export const NotFound = () => {
  usePageTitle('Page Not Found');

  return (
    <ErrorPage
      type="not-found"
      title="Page not found"
      subtitle="The page you're looking for doesn't exist or has been moved."
      buttonText="Back to home"
      backTo="/"
    />
  );
};

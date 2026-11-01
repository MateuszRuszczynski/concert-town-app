import { DataPageSkeleton } from "../../components/layout/DataPageLayout";
import { MyOrganizerRequestsTable } from "./components/MyOrganizerRequestsTable";

export const MyOrganizerRequestsSkeleton = () => (
  <DataPageSkeleton>
    <MyOrganizerRequestsTable requests={[]} isLoading={true} />
  </DataPageSkeleton>
);

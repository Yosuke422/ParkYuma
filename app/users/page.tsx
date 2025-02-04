import Users from "@/components/Users"; // Import the Users components created before
import { Suspense } from "react"; // Import the component that show a loader before data are ready
import UsersLoader from "../../components/UsersLoader";
 
export default function UsersList() {
  return (
    <>
      <h1>Liste des utilisateurs :</h1>
      <Suspense fallback={<UsersLoader />}>
        <Users />
      </Suspense>
    </>
  );
}
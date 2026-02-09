/**
 * Example page demonstrating how to use the ResourceNotFound component
 *
 * This shows a typical use case where a page exists (e.g., /users/[id])
 * but the specific user with that ID doesn't exist in the database.
 *
 * @example Copy this pattern to your own pages
 */

import { ResourceNotFound } from "@/components/error/resource-not-found";

interface User {
  id: string;
  name: string;
  email: string;
}

// Simulated database fetch
async function getUser(id: string): Promise<User | null> {
  // This would be your actual database call
  // For this example, it returns null to simulate a not-found scenario
  console.log("Fetching user:", id);
  return null;
}

export default async function UserPage({ params }: { params: { id: string } }) {
  const user = await getUser(params.id);

  // If the user doesn't exist, show the ResourceNotFound component
  if (!user) {
    return <ResourceNotFound resourceName="User" resourceId={params.id} />;
  }

  // Otherwise, render the user details
  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
      {/* Rest of your user page */}
    </div>
  );
}

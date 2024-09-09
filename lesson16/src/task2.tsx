import { useState, useEffect } from "react";
import { Provider, UserProvider } from "./task1";

interface UserData {
  id: number;
  name: string;
}

interface UserCardProps {
  provider: Provider<UserData>;
  request: Record<string, string>;
}

function UserCard({ provider, request }: UserCardProps) {
  const [user, setUser] = useState<UserData>();

  useEffect(() => {
    provider.get(request).then((user) => setUser(user));
  }, []);

  return (
    <div>
      <h1>{user?.name}</h1>
    </div>
  );
}

function App() {
  return (
    <div>
      <UserCard provider={new UserProvider()} request={{ id: "42" }} />
    </div>
  );
}

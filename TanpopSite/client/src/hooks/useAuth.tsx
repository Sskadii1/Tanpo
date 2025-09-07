import { useQuery } from "@tanstack/react-query";

interface User {
  id: string;
  username: string;
  role: "admin" | "manager" | "staff";
  fullName: string;
  email?: string;
}

export function useAuth() {
  const { data: user, isLoading, error } = useQuery({
    queryKey: ["/api/auth/me"],
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Check localStorage for user info as fallback
  const localUser = localStorage.getItem("user");
  let fallbackUser = null;
  try {
    fallbackUser = localUser ? JSON.parse(localUser) : null;
  } catch (e) {
    // Invalid JSON, clear it
    localStorage.removeItem("user");
  }

  const currentUser = user?.user || fallbackUser;

  return {
    user: currentUser as User | null,
    isLoading: isLoading && !fallbackUser,
    isAuthenticated: !!currentUser,
    error,
  };
}
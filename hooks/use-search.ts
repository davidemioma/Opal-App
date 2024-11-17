"use client";

import { useEffect, useState } from "react";
import { SUBSCRIPTION_PLAN } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { getSearchedUsers } from "@/lib/data/users";

type Result = {
  id: string;
  image: string | null;
  firstname: string | null;
  lastname: string | null;
  email: string;
  subscription: {
    plan: SUBSCRIPTION_PLAN;
  } | null;
}[];

const useSearch = () => {
  const [query, setQuery] = useState("");

  const [debounceValue, setDebounceValue] = useState("");

  const [users, setUsers] = useState<Result>([]);

  const onQueryChange = (value: string) => {
    setQuery(value);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounceValue(query);
    }, 1000);

    return () => clearTimeout(timer);
  }, [query]);

  const { isFetching, isLoading, refetch } = useQuery({
    queryKey: ["get-searched-users"],
    queryFn: async () => {
      if (!debounceValue) return;

      const data = await getSearchedUsers(debounceValue);

      setUsers(data);
    },
  });

  useEffect(() => {
    if (debounceValue) {
      refetch();
    } else {
      setUsers([]);
    }
  }, [debounceValue, refetch]);

  return { query, onQueryChange, users, isFetching, isLoading };
};

export default useSearch;

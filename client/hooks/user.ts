import { graphqlClient } from '@/clients/api';
import { getCurrentUserQuery, getUserByidQuery } from '@/graphql/query/user';
import { useQuery } from '@tanstack/react-query';

export const useCurrentUser = () => {
  const query = useQuery({
    queryKey: ['curent-user'],
    queryFn: () => graphqlClient.request(getCurrentUserQuery),
  });

  return { ...query, user: query.data?.getCurrentUser };
};

export const useUserByid = (id: string) => {
  const query = useQuery({
    queryKey: ['user-by-id'],
    queryFn: () => graphqlClient.request(getUserByidQuery, { id }),
  });
  return { ...query, user: query.data?.getUserById };
};

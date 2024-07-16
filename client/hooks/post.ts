import { graphqlClient } from '@/clients/api';
import { CreatePostData } from '@/gql/graphql';
import { createPostMutation } from '@/graphql/mutations/post';
import { getAllPostQueries } from '@/graphql/query/post';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';

export const useCreatePost = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ['create-post'],
    mutationFn: async (payload: CreatePostData) => {
      await graphqlClient.request(createPostMutation, { payload });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-allPosts'] });
      toast.success('Post created successfully!');
    },
    onError: (error) => {
      toast.error(`Failed to create post: ${error.message}`);
    },
  });

  return mutation;
};

export const useGetAllData = () => {
  const query = useQuery({
    queryKey: ['get-allPosts'],
    queryFn: async () => {
      const data = await graphqlClient.request(getAllPostQueries);
      return data;
    },
  });

  return { ...query, posts: query?.data?.getAllPosts };
};

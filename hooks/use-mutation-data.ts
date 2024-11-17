import { toast } from "sonner";
import {
  type MutationFunction,
  type MutationKey,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

export const useMutationData = (
  mutationKey: MutationKey,
  mutationFn: MutationFunction<any, any>,
  queryKey?: string,
  onSuccess?: () => void,
  onError?: () => void
) => {
  const client = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationKey,
    mutationFn,
    onSuccess(data) {
      if (onSuccess) onSuccess();

      return toast.success(data.message || "Successful");
    },
    onError(err) {
      if (onError) onError();

      return toast.success(err.message || "Something went wrong! Try again.");
    },
    onSettled: async () => {
      if (!queryKey) return;

      return await client.invalidateQueries({
        queryKey: [queryKey],
        exact: true,
      });
    },
  });

  return { mutate, isPending };
};

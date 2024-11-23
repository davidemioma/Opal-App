"use client";

import React, { useTransition } from "react";
import Loader from "../loader";
import { toast } from "sonner";
import { Send } from "lucide-react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { sendComment } from "@/lib/actions/comment";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { CommentValidator, CommentSchema } from "@/lib/validators/comment";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

type Props = {
  videoId: string;
  author: string;
  commentId?: string | null | undefined;
  onClose?: () => void;
  queryKey?: string[];
};

const CommentForm = ({
  videoId,
  author,
  commentId,
  onClose,
  queryKey,
}: Props) => {
  const pathname = usePathname();

  const queryClient = useQueryClient();

  const [isPending, startTransition] = useTransition();

  const form = useForm<CommentValidator>({
    resolver: zodResolver(CommentSchema),
    defaultValues: {
      text: "",
    },
  });

  const onSubmit = (values: CommentValidator) => {
    startTransition(async () => {
      await sendComment({ commentId, videoId, ...values, paths: [pathname] })
        .then((data) => {
          if (data.error) {
            toast.error(data.error);

            return;
          }

          toast.success(data.message);

          form.reset();

          queryClient.invalidateQueries({
            queryKey,
          });

          if (onClose) onClose();
        })
        .catch((err) => {
          toast.error(
            err.message || "Something went wrong! internal server error."
          );
        });
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full flex items-start gap-4"
      >
        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  className="flex-1 text-white"
                  placeholder={`Respond to ${author}...`}
                  {...field}
                  disabled={isPending}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="bg-muted hover:bg-muted-foreground text-black"
          disabled={isPending}
        >
          <Loader state={isPending}>
            <Send size={18} />
          </Loader>
        </Button>
      </form>
    </Form>
  );
};

export default CommentForm;

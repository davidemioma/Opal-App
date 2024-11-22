"use client";

import React, { useTransition } from "react";
import Loader from "../loader";
import { Send } from "lucide-react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { CommentValidator, CommentSchema } from "@/lib/validators/comment";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

type Props = {
  videoId: string;
  author: string;
};

const CommentForm = ({ videoId, author }: Props) => {
  const [isPending, startTransition] = useTransition();

  const form = useForm<CommentValidator>({
    resolver: zodResolver(CommentSchema),
    defaultValues: {
      comment: "",
    },
  });

  const onSubmit = (values: CommentValidator) => {};

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Comment</FormLabel>

              <FormControl>
                <Input placeholder={`Respond to ${author}...`} {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full bg-muted font-semibold hover:bg-muted-foreground text-black"
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

"use client";

import React, { useState, useTransition } from "react";
import { toast } from "sonner";
import Loader from "../loader";
import { Edit } from "lucide-react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { editVideoInfo } from "@/lib/actions/video";
import { zodResolver } from "@hookform/resolvers/zod";
import { EditVideoValidator, EditVideoSchema } from "@/lib/validators/video";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
  title: string;
  description: string;
};

const EditVid = ({ videoId, title, description }: Props) => {
  const [open, setOpen] = useState(false);

  const [isPending, startTransition] = useTransition();

  const form = useForm<EditVideoValidator>({
    resolver: zodResolver(EditVideoSchema),
    defaultValues: {
      title,
      description,
    },
  });

  const onSubmit = (values: EditVideoValidator) => {
    startTransition(async () => {
      await editVideoInfo({ videoId, values })
        .then((data) => {
          if (data.error) {
            toast.error(data.error);

            return;
          }

          toast.success(data.message);

          setOpen(false);
        })
        .catch((err) => {
          toast.error(
            err.message || "Something went wrong! internal server error."
          );
        });
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Edit className="text-[#6c6c6c]" />
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit video details</DialogTitle>

          <DialogDescription>
            You can update your video details here!
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>

                  <FormControl>
                    <Input
                      placeholder="Video Title"
                      {...field}
                      disabled={isPending}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>

                  <FormControl>
                    <Textarea
                      placeholder="Tell us a little bit about your video..."
                      className="resize-none"
                      {...field}
                      rows={5}
                      disabled={isPending}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              className="bg-muted hover:bg-muted-foreground text-black w-[100px]"
              type="submit"
              disabled={isPending}
            >
              <Loader state={isPending} color="#000">
                Save
              </Loader>
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditVid;

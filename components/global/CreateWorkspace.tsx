"use client";

import React, { useState, useTransition } from "react";
import Loader from "./loader";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { createWorkspace } from "@/lib/actions/workspace";
import FolderPlusDuotine from "../icons/folder-plus-duotone";
import {
  WorkspaceValidator,
  WorkspaceSchema,
} from "@/lib/validators/workspace";
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

const CreateWorkspace = () => {
  const [open, setOpen] = useState(false);

  const [isPending, startTransition] = useTransition();

  const form = useForm<WorkspaceValidator>({
    resolver: zodResolver(WorkspaceSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = (values: WorkspaceValidator) => {
    startTransition(async () => {
      await createWorkspace(values)
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
      <DialogTrigger className="bg-[#1D1D1D] text-[#707070] flex items-center gap-2 p-3 rounded-2xl">
        <FolderPlusDuotine />
        Create Workspace
      </DialogTrigger>

      <DialogContent className="bg-[#111111] text-white">
        <DialogHeader>
          <DialogTitle>Create a Workspace</DialogTitle>

          <DialogDescription>
            Workspaces helps you collaborate with team members. You are assigned
            a default personal workspace where you can share videos in private
            with yourself.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>

                  <FormControl>
                    <Input placeholder="Workspace Name" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              className="w-full bg-muted text-black hover:bg-muted-foreground text-sm font-bold"
              type="submit"
              disabled={isPending}
            >
              <Loader state={isPending}>Create Workspace</Loader>
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateWorkspace;

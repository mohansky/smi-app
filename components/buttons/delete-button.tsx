import React, { useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { DeleteButtonProps } from "@/types";

export function DeleteButton<T>({
  deleteAction,
  id,
  identifier,
  entityType,
  additionalDescription,
}: DeleteButtonProps<T>) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      const result = await deleteAction(id);

      if ("errors" in result) {
        const errorMessage =
          result.errors?.root?.[0] || `Failed to delete ${entityType}`;
        toast.error(errorMessage);
        return;
      }

      if ("message" in result) {
        const successMessage =
          result.message || `${entityType} deleted successfully`;
        toast.success(successMessage);
        return;
      }

      toast.success(`${entityType} deleted successfully`);
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error(`An error occurred while deleting the ${entityType}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-100"
        >
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Delete {entityType}</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete {entityType}</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete the {entityType} for{" "}
            <strong className="text-primary">{identifier}</strong>?{" "}
            <strong className="text-destructive">
              This action cannot be undone.
            </strong>{" "}
            {additionalDescription}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            {isLoading ? (
              <>
                <span className="loading loading-spinner loading-xs mr-2" />
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

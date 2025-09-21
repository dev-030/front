import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Building2, Book, Users } from "lucide-react"; // example icons
import toast from "react-hot-toast";
import axiosSecure from "@/hooks/useAxiosSecure";

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
  id: string; // orgId/classroomId/classId
  currentName: string;
  currentDescription: string;
  onDeleted?: () => void;
  onUpdated?: (name: string, description: string) => void;
  type: "organization" | "classroom" | "class";
}

const TYPE_CONFIG = {
  organization: {
    icon: <Building2 className="w-5 h-5 text-primary" />,
    title: "Organization Settings",
    updateButton: "Update Organization",
    deleteButton: "Delete Organization",
    apiPath: "organizations/organization",
  },
  classroom: {
    icon: <Book className="w-5 h-5 text-primary" />,
    title: "Classroom Settings",
    updateButton: "Update Classroom",
    deleteButton: "Delete Classroom",
    apiPath: "classrooms",
  },
  class: {
    icon: <Users className="w-5 h-5 text-primary" />,
    title: "Class Settings",
    updateButton: "Update Class",
    deleteButton: "Delete Class",
    apiPath: "classes/class",
  },
};

export function SettingsModal({ open, type, onClose, id, currentName, currentDescription, onDeleted, onUpdated }: SettingsModalProps) {
  const [name, setName] = useState(currentName);
  const [description, setDescription] = useState(currentDescription);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const config = TYPE_CONFIG[type];

  useEffect(() => {
    setName(currentName);
    setDescription(currentDescription);
  }, [currentName, currentDescription, open]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsLoading(true);
    try {
      await axiosSecure.patch(`/${config.apiPath}/${id}/`, { name, description });
      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} updated successfully!`);
      onUpdated?.(name, description);
      onClose();
    } catch (error: any) {
      console.log(error?.response?.data);
      toast.error(`Failed to update ${type}.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete this ${type}? This action cannot be undone.`)) return;

    setIsDeleting(true);
    try {
      await axiosSecure.delete(`/${config.apiPath}/${id}/`);
      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully!`);
      onDeleted?.();
      onClose();
    } catch (error: any) {
      console.log(error?.response?.data);
      toast.error(`Failed to delete ${type}.`);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClose = () => {
    setName(currentName);
    setDescription(currentDescription);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              {config.icon}
            </div>
            <DialogTitle>{config.title}</DialogTitle>
          </div>
          <p className="text-sm text-muted-foreground">
            Update your {type} details or delete it.
          </p>
        </DialogHeader>

        <form onSubmit={handleUpdate} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={`Enter ${type} name`}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              value={description || ""}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={`Describe your ${type}...`}
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={handleClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={!name.trim() || isLoading} className="flex-1 bg-blue-500">
              {isLoading ? "Updating..." : config.updateButton}
            </Button>
          </div>

          <div className="pt-4 border-t mt-4">
            <Button type="button" variant="destructive" onClick={handleDelete} disabled={isDeleting} className="w-full">
              {isDeleting ? "Deleting..." : config.deleteButton}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

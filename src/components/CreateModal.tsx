import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Building2, GraduationCap, BookOpen } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import axiosSecure from "@/hooks/useAxiosSecure";
import { mutate } from "swr";

interface CreateModalProps {
  open: boolean;
  onClose: () => void;
  type: 'organization' | 'classroom' | 'class';
  parentId?: string;
  onCreate?: () => void;
}

const typeConfig = {
  organization: {
    title: "Create Organization",
    icon: Building2,
    description: "Organizations help you manage multiple classrooms and classes under one umbrella."
  },
  classroom: {
    title: "Create Classroom", 
    icon: GraduationCap,
    description: "Classrooms are spaces where you can organize courses and learning materials."
  },
  class: {
    title: "Create Class",
    icon: BookOpen, 
    description: "Classes are individual sessions or study groups within a classroom."
  }
};

export function CreateModal({ open, onClose, type, parentId, onCreate}: CreateModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const config = typeConfig[type];
  const IconComponent = config.icon;

  const submitConfig = {
    organization: {
      url: '/organizations/organization/',
      mutateKey: '/organizations/organization/',
      successName: 'Organization'
    },
    classroom: {
      url: '/classrooms/',
      mutateKey: '/classrooms/',
      successName: 'Classroom'
    },
    class: {
      url: '/classes/',
      mutateKey: '/classes/class/',
      successName: 'Class'
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsLoading(true);

    try {
      const { url, mutateKey, successName } = submitConfig[type];

      const payload: any = { name, description };
      if (type === 'classroom' && parentId) payload.organization = parentId;
      if (type === 'class' && parentId) payload.classroom = parentId;

      console.log(payload)

      const val = await axiosSecure.post(url, payload);
      console.log(val)
      onCreate()
      toast.success(`${successName} "${name}" has been created successfully.`);
    } catch (error) {
      console.log(error?.response?.data);
    } finally {
      setIsLoading(false);
      setName('');
      setDescription('');
      onClose();
    }
  };

  const handleClose = () => {
    setName("");
    setDescription("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">

        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <IconComponent className="w-5 h-5 text-primary" />
            </div>
            <DialogTitle>{config.title}</DialogTitle>
          </div>
          <p className="text-sm text-muted-foreground">
            {config.description}
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
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
              value={description}
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
              {isLoading ? "Creating..." : `Create ${config.title.split(' ')[1]}`}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
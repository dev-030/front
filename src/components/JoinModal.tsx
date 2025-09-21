import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface JoinModalProps {
  open: boolean;
  onClose: () => void;
}

export function JoinModal({ open, onClose }: JoinModalProps) {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock validation
    const mockSuccess = Math.random() > 0.3; // 70% success rate for demo
    
    if (mockSuccess) {
      toast({
        title: "Success!",
        description: "You have successfully joined the organization/classroom/class.",
      });
      setCode("");
      onClose();
    } else {
      toast({
        title: "Invalid Code",
        description: "The invitation code you entered is invalid or has expired.",
        variant: "destructive",
      });
    }
    
    setIsLoading(false);
  };

  const handleClose = () => {
    setCode("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-accent" />
            </div>
            <DialogTitle>Join with Invitation Code</DialogTitle>
          </div>
          <p className="text-sm text-muted-foreground">
            Enter the invitation code you received to join an organization, classroom, or class.
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="code">Invitation Code *</Label>
            <Input
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="Enter invitation code"
              className="font-mono"
              required
            />
            <p className="text-xs text-muted-foreground">
              Codes are usually 6-8 characters long (e.g., ABC123XY)
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={handleClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={!code.trim() || isLoading} className="flex-1">
              {isLoading ? "Joining..." : "Join"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Plus, Users, Settings, LogOut, Calendar, Clock } from "lucide-react";
import { CreateModal } from "@/components/CreateModal";
import { JoinModal } from "@/components/JoinModal";
import { mutate } from "swr";

// Mock data
const classes = [
  {
    id: "1",
    name: "Mobile App Design Sprint",
    role: "admin", 
    memberCount: 15,
    description: "Intensive 2-week sprint on mobile app design best practices",
    classroom: "Mobile App Design",
    status: "active",
    nextSession: "2024-03-18T10:00:00Z",
    createdAt: "2024-03-10"
  },
  {
    id: "2",
    name: "React Hooks Deep Dive",
    role: "student",
    memberCount: 22,
    description: "Advanced exploration of React hooks and custom hook patterns",
    classroom: "Advanced React Development", 
    status: "upcoming",
    nextSession: "2024-03-20T14:00:00Z",
    createdAt: "2024-03-12"
  }
];

export default function Classes() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);

  const hasClasses = classes.length > 0;

  if (!hasClasses) {
    return (
      <div className="p-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-24 h-24 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <BookOpen className="w-12 h-12 text-success" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">No Classes Yet</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Classes are individual sessions or study groups within a classroom.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={() => setShowCreateModal(true)} className="px-8">
              <Plus className="w-4 h-4 mr-2" />
              Create Class
            </Button>
            <Button variant="outline" onClick={() => setShowJoinModal(true)} className="px-8">
              <Plus className="w-4 h-4 mr-2" />
              Join with Code
            </Button>
          </div>
        </div>

        <CreateModal 
          open={showCreateModal} 
          onClose={() => setShowCreateModal(false)} 
          type="class"
        />
        <JoinModal 
          open={showJoinModal} 
          onClose={() => setShowJoinModal(false)} 
        />
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Classes</h1>
            <p className="text-muted-foreground">Manage your class sessions and study groups</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowJoinModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Join with Code
            </Button>
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Class
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((classItem) => (
            <Card key={classItem.id} className="group hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-success" />
                  </div>
                  <div className="flex gap-2">
                    <Badge variant={classItem.status === 'active' ? 'success' : 'warning'}>
                      {classItem.status}
                    </Badge>
                    <Badge variant={classItem.role === 'admin' ? 'admin' : 'student'}>
                      {classItem.role === 'admin' ? 'Admin' : 'Student'}
                    </Badge>
                  </div>
                </div>
                <CardTitle className="text-lg leading-6">{classItem.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{classItem.description}</p>
                <p className="text-xs text-muted-foreground font-medium">{classItem.classroom}</p>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {classItem.memberCount} participants
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    Next: {new Date(classItem.nextSession).toLocaleString()}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Settings className="w-4 h-4 mr-1" />
                    {classItem.role === 'admin' ? 'Manage' : 'View'}
                  </Button>
                  {classItem.role === 'student' && (
                    <Button variant="outline" size="sm">
                      <LogOut className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <CreateModal 
          open={showCreateModal} 
          onClose={() => setShowCreateModal(false)} 
          type="class"
          onCreate={() => {
            mutate(`/classes/`)
          }}
        />

        <JoinModal 
          open={showJoinModal} 
          onClose={() => setShowJoinModal(false)} 
        />
      </div>
    </div>
  );
}
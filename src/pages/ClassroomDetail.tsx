import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  GraduationCap, 
  BookOpen, 
  Plus, 
  Users, 
  Settings, 
  UserPlus, 
  ChevronLeft,
  Calendar,
  Clock,
  Building2
} from "lucide-react";
import { CreateModal } from "@/components/CreateModal";
import useSWR, { mutate } from 'swr'
import axiosSecure from "@/hooks/useAxiosSecure";
import { SettingsModal } from "@/components/OrganizationSettingModal";








const classroomData = {
  "16": {
    id: "16",
    name: "Advanced React Development",
    description: "Learn advanced React patterns, hooks, performance optimization, and modern development practices",
    role: "admin",
    studentCount: 28,
    organizationId: "1",
    organizationName: "Computer Science Department",
    createdAt: "2024-02-20",
    classes: [
      {
        id: "1",
        name: "React Hooks Deep Dive",
        description: "Comprehensive exploration of React hooks and custom hook patterns", 
        status: "active",
        participantCount: 22,
        nextSession: "2024-03-20T14:00:00Z",
        createdAt: "2024-03-12"
      },
      {
        id: "2",
        name: "Performance Optimization", 
        description: "Techniques for optimizing React app performance",
        status: "upcoming",
        participantCount: 18,
        nextSession: "2024-03-25T10:00:00Z",
        createdAt: "2024-03-15"
      },
      {
        id: "3",
        name: "Testing React Components",
        description: "Best practices for testing React applications",
        status: "completed",
        participantCount: 25,
        nextSession: null,
        createdAt: "2024-03-08"
      }
    ]
  }
};





export default function ClassroomDetail() {
  const { id } = useParams();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
    const [showSettingsModal, setShowSettingsModal] = useState(false);
  
  const navigate = useNavigate()
  
  const classroom = classroomData[id as keyof typeof classroomData];


  const { data, isLoading } = useSWR(`/classrooms/${id}`, (url: string) =>
    axiosSecure.get(url).then((res) => res.data)
  );
  



  if (isLoading) {
    return (
      <div className="p-8 flex justify-center items-center">
        <p className="text-lg text-muted-foreground">Loading classroom...</p>
      </div>
    );
  }



  if (!data || data.length === 0) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold text-foreground mb-2">Classroom Not Found</h1>
        <p className="text-muted-foreground mb-4">The classroom you're looking for doesn't exist.</p>
        <Link to="/classrooms">
          <Button variant="outline">Back to Classrooms</Button>
        </Link>
      </div>
    );
  }

  const isAdmin = data?.role === 'admin';

  console.log(data)

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <Button variant="ghost" size="sm" onClick={()=> navigate(-1)}>
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back 
            </Button>
        </div>

        {/* Classroom Info */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-start gap-4">
              <div className="w-16 h-16 bg-accent/10 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-8 h-8 text-accent" />
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <CardTitle className="text-2xl">{data.name}</CardTitle>
                  <Badge variant={isAdmin ? 'admin' : 'student'}>
                    {isAdmin ? 'Admin' : 'Student'}
                  </Badge>
                </div>
                <p className="text-muted-foreground">{data.description}</p>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Building2 className="w-4 h-4" />
                  <Link to={`/organizations/${data.organization}`} className="hover:text-primary">
                    {data.organization_name}
                  </Link>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {data.student_count} students
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Created {new Date(data.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
              {isAdmin && (
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button variant="outline" onClick={() => setShowAddStudentModal(true)}>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Add Students
                  </Button>
                  <Button variant="outline" onClick={()=> setShowSettingsModal(true)}>
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
        </Card>

        <Separator />

        {/* Classes Section */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-foreground">Classes</h2>
              <p className="text-muted-foreground">Manage class sessions within this classroom</p>
            </div>
            {isAdmin && data.classes.length !== 0 && (
              <Button onClick={() => setShowCreateModal(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Class
              </Button>
            )}
          </div>

          {data.classes.length === 0 ? (
            <Card className="p-8">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto">
                  <BookOpen className="w-8 h-8 text-success" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">No Classes Yet</h3>
                  <p className="text-muted-foreground mb-4">
                    {isAdmin 
                      ? "Start by creating your first class in this classroom" 
                      : "No classes have been created in this classroom yet"
                    }
                  </p>
                  {isAdmin && (
                    <Button onClick={() => setShowCreateModal(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Create First Class
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data?.classes.map((classItem) => (
                <Link key={classItem.id} to={`/classes/${classItem.id}`}>
                  <Card className="group hover:shadow-lg transition-all duration-200 hover:scale-[1.02] cursor-pointer h-full">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between mb-3">
                        <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                          <BookOpen className="w-6 h-6 text-success" />
                        </div>
                        <div className="flex gap-2">
                          <Badge variant={classItem.status === 'active' ? 'success' : classItem.status === 'upcoming' ? 'warning' : 'secondary'}>
                            {classItem.status}
                          </Badge>
                          {isAdmin && (
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={(e) => {
                                e.preventDefault();
                                // Handle settings for this class
                              }}
                            >
                              <Settings className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                      <CardTitle className="text-lg leading-6">{classItem.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{classItem.description}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {classItem.participantCount} participants
                        </div>
                        {classItem.nextSession && (
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            Next: {new Date(classItem.nextSession).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>

        <CreateModal 
          open={showCreateModal} 
          onClose={() => setShowCreateModal(false)} 
          type="class"
          parentId={id}
          onCreate={() => {
            mutate(`/classrooms/${id}`)
          }}
        />
        <SettingsModal
          type="classroom"
          open={showSettingsModal}
          onClose={() => setShowSettingsModal(false)}
          id={data.id}
          currentName={data.name}
          currentDescription={data.description}
          onUpdated={() => {
            mutate(`/classrooms/${id}`)
          }}
          onDeleted={() => {
            navigate(-1);
          }}
        />
      </div>
    </div>
  );
}
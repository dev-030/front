import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Building2, 
  GraduationCap, 
  Plus, 
  Users, 
  Settings, 
  UserPlus, 
  ChevronLeft,
  Calendar,
  BookOpen
} from "lucide-react";
import { CreateModal } from "@/components/CreateModal";
import useSWR, { mutate } from 'swr'
import axiosSecure from "@/hooks/useAxiosSecure";
import { SettingsModal } from "@/components/OrganizationSettingModal";
import { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";




// Mock data - in real app this would come from backend
const organizationData = {
  "1": {
    id: "1",
    name: "Computer Science Department",
    description: "Main department for all computer science related activities and courses",
    role: "admin",
    memberCount: 245,
    createdAt: "2024-01-15",
    classrooms: [
      {
        id: "1",
        name: "Advanced React Development",
        description: "Learn advanced React patterns and best practices",
        studentCount: 28,
        classCount: 5,
        createdAt: "2024-02-20"
      },
      {
        id: "2", 
        name: "Data Structures & Algorithms",
        description: "Core computer science fundamentals",
        studentCount: 45,
        classCount: 8,
        createdAt: "2024-01-25"
      },
      {
        id: "3",
        name: "Software Engineering Principles", 
        description: "Best practices for large-scale software development",
        studentCount: 32,
        classCount: 6,
        createdAt: "2024-02-01"
      }
    ]
  }
};

export default function OrganizationDetail() {
  const { id } = useParams();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const navigate = useNavigate()
  
  const organization = organizationData[id as keyof typeof organizationData];

  const { data, isLoading } = useSWR(`/organizations/organization/${id}`, (url: string) =>
    axiosSecure.get(url).then((res) => res.data)
  );

  if (isLoading) {
    return (
      <div className="p-8 flex justify-center items-center">
        <p className="text-lg text-muted-foreground">Loading organization...</p>
      </div>
    );
  }
  
  if (!data || data.length === 0) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold text-foreground mb-2">Organization Not Found</h1>
        <p className="text-muted-foreground mb-4">The organization you're looking for doesn't exist.</p>
        <Link to="/organizations">
          <Button variant="outline">Back to Organizations</Button>
        </Link>
      </div>
    );
  }



  console.log(data)


  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <Toaster position="bottom-right"/>

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <Link to="/organizations">
            <Button variant="ghost" size="sm">
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back to Organizations
            </Button>
          </Link>
        </div>

        {/* Organization Info */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-start gap-4">
              <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
                <Building2 className="w-8 h-8 text-primary" />
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <CardTitle className="text-2xl">{data.name}</CardTitle>
                  <Badge variant={data?.role === 'admin' ? 'admin' : 'student'}>
                    {data?.role === 'admin' ? 'Admin' : 'Student'}
                  </Badge>
                </div>
                <p className="text-muted-foreground">{data.description}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {data.member_count} members
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Created {new Date(data.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
              {data?.role === 'admin' && (
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button variant="outline" onClick={() => setShowAddStudentModal(true)}>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Add Members
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

        {/* Classrooms Section */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-foreground">Classrooms</h2>
              <p className="text-muted-foreground">Manage classrooms within this organization</p>
            </div>
            {data?.role === 'admin' && data.classrooms.length !== 0 && (
              <Button onClick={() => setShowCreateModal(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Classroom
              </Button>
            )}
          </div>

          {data.classrooms.length === 0 ? (
            <Card className="p-8">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto">
                  <GraduationCap className="w-8 h-8 text-accent" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">No Classrooms Yet</h3>
                  <p className="text-muted-foreground mb-4">
                    {data?.role === 'admin' 
                      ? "Start by creating your first classroom in this organization" 
                      : "No classrooms have been created in this organization yet"
                    }
                  </p>
                  {data?.role === 'admin' && (
                    <Button onClick={() => setShowCreateModal(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Create First Classroom
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.classrooms.map((classroom) => (
                <Link key={classroom.id} to={`/classrooms/${classroom.id}`}>
                  <Card className="group hover:shadow-lg transition-all duration-200 hover:scale-[1.02] cursor-pointer h-full">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between mb-3">
                        <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                          <GraduationCap className="w-6 h-6 text-accent" />
                        </div>
                        {/* {data?.role === 'admin' && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={(e) => {
                              e.preventDefault();
                              // Handle settings for this classroom
                            }}
                          >
                            <Settings className="w-4 h-4" />
                          </Button>
                        )} */}
                      </div>
                      <CardTitle className="text-lg leading-6">{classroom.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{classroom.description}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {classroom.student_count} students
                        </div>
                        <div className="flex items-center gap-1">
                          <BookOpen className="w-4 h-4" />
                          {classroom.class_count} classes
                        </div>
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
          type="classroom"
          parentId={id}
          onCreate={() => {
            mutate(`/organizations/organization/${id}`)
          }}
        />
        <SettingsModal
          type = "organization"
          open={showSettingsModal}
          onClose={() => setShowSettingsModal(false)}
          id={data.id}
          currentName={data.name}
          currentDescription={data.description}
          onUpdated={() => {
            mutate(`/organizations/organization/${id}`)
          }}
          onDeleted={() => {
            navigate("/organizations");
          }}
        />
      </div>
    </div>
  );
}
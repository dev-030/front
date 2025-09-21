import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, GraduationCap, BookOpen, Plus, Users, Calendar, AlertCircle, ChevronRight, Clock } from "lucide-react";
import { CreateModal } from "@/components/CreateModal";
import { JoinModal } from "@/components/JoinModal";
import { Link } from "react-router-dom";
import useSWR from 'swr'
import axiosSecure from "@/hooks/useAxiosSecure";
import { Toaster } from "react-hot-toast";



const organizations = [
  {
    id: "1",
    name: "Computer Science Department",
    role: "admin",
    memberCount: 245,
    classroomCount: 12,
    createdAt: "2024-01-15"
  },
  {
    id: "2",
    name: "Data Science Research Group", 
    role: "student",
    memberCount: 67,
    classroomCount: 3,
    createdAt: "2024-02-10"
  }
];

const classrooms = [
  {
    id: "1",
    name: "Advanced React Development",
    role: "student", 
    memberCount: 28,
    organization: "Computer Science Department",
    classCount: 5,
    createdAt: "2024-02-20"
  },
  {
    id: "2",
    name: "Mobile App Design",
    role: "admin",
    memberCount: 15,
    organization: "Design Institute",
    classCount: 3,
    createdAt: "2024-03-05"
  }
];

const classes = [
  {
    id: "1",
    name: "Mobile App Design Sprint",
    role: "admin",
    memberCount: 15,
    classroom: "Mobile App Design",
    status: "active",
    nextSession: "2024-03-18T10:00:00Z",
    createdAt: "2024-03-10"
  }
];

const pendingAssignments = [
  {
    id: "1",
    title: "React Hooks Assignment",
    classroom: "Advanced React Development",
    dueDate: "2024-03-20T23:59:59Z",
    type: "assignment"
  },
  {
    id: "2", 
    title: "UI/UX Design Project",
    classroom: "Mobile App Design",
    dueDate: "2024-03-22T23:59:59Z",
    type: "project"
  }
];

// Helper function to check if user has any entities
const hasAnyEntities = () => organizations.length > 0 || classrooms.length > 0 || classes.length > 0;

export default function Dashboard() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [createType, setCreateType] = useState<'organization' | 'classroom' | 'class'>('organization');


  const { data, isLoading } = useSWR("/organizations/memberships/", (url: string) =>
    axiosSecure.get(url).then((res) => res.data)
  );

  console.log(data)

  const handleCreate = (type: 'organization' | 'classroom' | 'class') => {
    setCreateType(type);
    setShowCreateModal(true);
  };

  if (!hasAnyEntities()) {
    return (
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Welcome to StudyFlow</h1>
            <p className="text-lg text-muted-foreground">Get started by creating or joining an organization, classroom, or class</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Card className="group cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-[1.02]" 
                  onClick={() => handleCreate('organization')}>
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                  <Building2 className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Create Organization</h3>
                <p className="text-muted-foreground text-sm">Start your own organization and manage multiple classrooms</p>
              </CardContent>
            </Card>

            <Card className="group cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-[1.02]" 
                  onClick={() => handleCreate('classroom')}>
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-accent/20 transition-colors">
                  <GraduationCap className="w-8 h-8 text-accent" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Create Classroom</h3>
                <p className="text-muted-foreground text-sm">Set up a classroom for your courses and lessons</p>
              </CardContent>
            </Card>

            <Card className="group cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-[1.02]" 
                  onClick={() => handleCreate('class')}>
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-success/20 transition-colors">
                  <BookOpen className="w-8 h-8 text-success" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Create Class</h3>
                <p className="text-muted-foreground text-sm">Start a new class session or study group</p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <p className="text-muted-foreground mb-4">Already have an invitation code?</p>
            <Button variant="outline" onClick={() => setShowJoinModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Join with Code
            </Button>
          </div>
        </div>

        <CreateModal 
          open={showCreateModal} 
          onClose={() => setShowCreateModal(false)} 
          type={createType}
        />
        <JoinModal 
          open={showJoinModal} 
          onClose={() => setShowJoinModal(false)} 
        />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}

        <Toaster position="bottom-right"/>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground">Overview of your learning activities</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setShowJoinModal(true)} className="w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              Join with Code
            </Button>
            <Button onClick={() => setShowCreateModal(true)} className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600">
              <Plus className="w-4 h-4 mr-2" />
              Create New
            </Button>
          </div>
        </div>

        {/* Pending Assignments */}
        {pendingAssignments.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-foreground flex items-center">
                <AlertCircle className="w-5 h-5 mr-2 text-warning" />
                Pending Assignments
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingAssignments.map((assignment) => (
                <Card key={assignment.id} className="border-l-4 border-l-warning">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-base">{assignment.title}</CardTitle>
                        <p className="text-sm text-muted-foreground">{assignment.classroom}</p>
                      </div>
                      <Badge variant="warning">{assignment.type}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="w-4 h-4 mr-1" />
                      Due: {new Date(assignment.dueDate).toLocaleDateString()}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Organizations Section */}
        {organizations.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-foreground">Organizations</h2>
              <Link to="/organizations" className="text-primary hover:text-primary/80 flex items-center text-sm font-medium">
                View all <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {organizations.slice(0, 3).map((org) => (
                <Link key={org.id} to={`/organizations/${org.id}`}>
                  <Card className="group hover:shadow-lg transition-all duration-200 hover:scale-[1.02] cursor-pointer">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Building2 className="w-6 h-6 text-primary" />
                        </div>
                        <Badge variant={org.role === 'admin' ? 'admin' : 'student'}>
                          {org.role === 'admin' ? 'Admin' : 'Student'}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg leading-6">{org.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {org.memberCount}
                        </div>
                        <div className="flex items-center gap-1">
                          <GraduationCap className="w-4 h-4" />
                          {org.classroomCount} classrooms
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Classrooms Section */}
        {classrooms.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-foreground">Recent Classrooms</h2>
              <Link to="/classrooms" className="text-primary hover:text-primary/80 flex items-center text-sm font-medium">
                View all <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {classrooms.slice(0, 3).map((classroom) => (
                <Link key={classroom.id} to={`/classrooms/${classroom.id}`}>
                  <Card className="group hover:shadow-lg transition-all duration-200 hover:scale-[1.02] cursor-pointer">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                          <GraduationCap className="w-6 h-6 text-accent" />
                        </div>
                        <Badge variant={classroom.role === 'admin' ? 'admin' : 'student'}>
                          {classroom.role === 'admin' ? 'Admin' : 'Student'}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg leading-6">{classroom.name}</CardTitle>
                      <p className="text-xs text-muted-foreground font-medium">{classroom.organization}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {classroom.memberCount}
                        </div>
                        <div className="flex items-center gap-1">
                          <BookOpen className="w-4 h-4" />
                          {classroom.classCount} classes
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Classes Section */}
        {classes.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-foreground">Active Classes</h2>
              <Link to="/classes" className="text-primary hover:text-primary/80 flex items-center text-sm font-medium">
                View all <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {classes.slice(0, 3).map((classItem) => (
                <Link key={classItem.id} to={`/classes/${classItem.id}`}>
                  <Card className="group hover:shadow-lg transition-all duration-200 hover:scale-[1.02] cursor-pointer">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
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
                      <p className="text-xs text-muted-foreground font-medium">{classItem.classroom}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {classItem.memberCount}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          Next: {new Date(classItem.nextSession).toLocaleDateString()}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}

        <CreateModal 
          open={showCreateModal} 
          onClose={() => setShowCreateModal(false)} 
          type={createType}
        />
        <JoinModal 
          open={showJoinModal} 
          onClose={() => setShowJoinModal(false)} 
        />
      </div>
    </div>
  );
}
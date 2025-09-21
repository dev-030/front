import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Plus, Users, Settings, LogOut, Calendar, BookOpen } from "lucide-react";
import { CreateModal } from "@/components/CreateModal";
import { JoinModal } from "@/components/JoinModal";
import useSWR, { mutate } from "swr";
import axiosSecure from "@/hooks/useAxiosSecure";
import { useParams, Link } from "react-router-dom";






export default function Classrooms() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);


  const { data, isLoading } = useSWR("/classrooms/", (url: string) =>
    axiosSecure.get(url).then((res) => res.data)
  );


  if (isLoading) {
    return (
      <div className="p-8 flex justify-center items-center">
        <p className="text-lg text-muted-foreground">Loading organizations...</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="p-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-24 h-24 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <GraduationCap className="w-12 h-12 text-accent" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">No Classrooms Yet</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Classrooms are spaces where you can organize courses and learning materials.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={() => setShowCreateModal(true)} className="px-8">
              <Plus className="w-4 h-4 mr-2" />
              Create Classroom
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
          type="classroom"
        />
        <JoinModal 
          open={showJoinModal} 
          onClose={() => setShowJoinModal(false)} 
        />
      </div>
    );
  }

  console.log(data)

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Classrooms</h1>
            <p className="text-muted-foreground">Manage your classrooms and course materials</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowJoinModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Join with Code
            </Button>
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Classroom
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.map((classroom) => (
            <Link key={classroom.id} to={`/classrooms/${classroom.id}`}>
              <Card className="group hover:shadow-lg transition-all duration-200 hover:scale-[1.02] cursor-pointer h-full">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                      <GraduationCap className="w-6 h-6 text-accent" />
                    </div>
                    <Badge variant={classroom.role === 'admin' ? 'admin' : 'student'}>
                      {classroom.role === 'admin' ? 'Admin' : 'Student'}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg leading-6">{classroom.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{classroom.description}</p>
                  <p className="text-xs text-muted-foreground font-medium text-gray-900">{classroom.organization_name}</p>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center flex-wrap gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {classroom.student_count} students
                    </div>
                    <div className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4" />
                      {classroom.class_count} classes
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(classroom.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </CardContent>              
              </Card>
            </Link>
          ))}
        </div>

        <CreateModal 
          open={showCreateModal} 
          onClose={() => setShowCreateModal(false)} 
          type="classroom"
        />
        <CreateModal 
          open={showCreateModal} 
          onClose={() => setShowCreateModal(false)} 
          type="classroom"
          onCreate={() => {
            mutate(`/classrooms/`)
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
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Plus, Users, GraduationCap } from "lucide-react";
import { CreateModal } from "@/components/CreateModal";
import { JoinModal } from "@/components/JoinModal";
import { Link } from "react-router-dom";
import useSWR from "swr";
import axiosSecure from "@/hooks/useAxiosSecure";

export default function Organizations() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);

  const { data, isLoading } = useSWR("/organizations/organization/", (url: string) =>
    axiosSecure.get(url).then((res) => res.data)
  );

  // Loading state
  if (isLoading) {
    return (
      <div className="p-8 flex justify-center items-center">
        <p className="text-lg text-muted-foreground">Loading organizations...</p>
      </div>
    );
  }

  // No data state
  if (!data || data.length === 0) {
    return (
      <div className="p-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Building2 className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">No Organizations Yet</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Organizations help you manage multiple classrooms and classes under one umbrella.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={() => setShowCreateModal(true)} className="px-8">
              <Plus className="w-4 h-4 mr-2" />
              Create Organization
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
          type="organization"
        />
        <JoinModal open={showJoinModal} onClose={() => setShowJoinModal(false)} />
      </div>
    );
  }

  // Data available state
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Organizations</h1>
            <p className="text-muted-foreground">Manage your organizations and their members</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setShowJoinModal(true)} className="w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              Join with Code
            </Button>
            <Button onClick={() => setShowCreateModal(true)} className="w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              Create Organization
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((org: any) => (
            <Link key={org.id} to={`/organizations/${org?.id}`}>
              <Card className="group hover:shadow-lg transition-all duration-200 hover:scale-[1.02] cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-primary" />
                    </div>
                    <Badge variant={org.role === "admin" ? "admin" : "student"}>
                      {org.role === "admin" ? "Admin" : "Student"}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg leading-6">{org?.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{org.description}</p>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {org.member_count} members
                    </div>
                    <div className="flex items-center gap-1">
                      <GraduationCap className="w-4 h-4" />
                      {org.classroom_count} classrooms
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
          type="organization"
        />
        <JoinModal open={showJoinModal} onClose={() => setShowJoinModal(false)} />
      </div>
    </div>
  );
}

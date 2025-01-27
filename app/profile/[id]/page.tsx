"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import http from "@/lib/utils";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ProfilePage({ params }: { params: { id: string } }) {
  const { id } = params;
  const [profile, setProfile] = useState<any | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await http.get(`/profile/${id}`);
        setProfile(response.data.user);
      } catch (error) {
        console.error("Error fetching profile", error);
      }
    };

    fetchProfile();
  }, [id, router]);

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-[400px] shadow-lg border border-gray-200">
        <CardHeader className="flex flex-col items-center">
          <Avatar className="w-20 h-20 mb-4">
            <AvatarImage src="https://github.com/shadcn.png" />
          </Avatar>
          <CardTitle className="text-2xl font-bold">{profile.name}</CardTitle>
          <CardDescription className="text-gray-500">
            {profile.email}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Button variant="outline" onClick={() => router.push("/dashboard")}>
            Back to Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

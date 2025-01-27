"use client";
import AuthenticatedLayout from "@/components/AuthenticatedLayout";
import Left from "@/components/dashboard/Left";
import Right from "@/components/dashboard/Right";
import http from "@/lib/utils";
import { getUser } from "@/redux/authSlice";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { PostTypes } from "@/schema/types/types.d";
import Post from "@/components/dashboard/Post";

import DashboardAction from "@/components/dashboard/DashboardAction";

export default function Dashboard() {
  const user = useSelector(getUser);
  const [posts, setPosts] = useState<PostTypes[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await http.get("/post");
        setPosts(response.data.posts);
      } catch (error) {
        console.error("Error fetching posts", error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <AuthenticatedLayout>
      <div className="container mt-2">
        <div className="flex">
          <Left />
          <main className="flex-1 dark:bg-neutral-900 overflow-y-auto p-3">
            <div className="rounded-md shadow-lg bg-white dark:bg-neutral-800 dark:border-neutral-700 mb-4 border">
              {user && <DashboardAction user={user} setPosts={setPosts} />}
            </div>
            <div className="space-y-6">
              {posts.map((post) => (
                <Post key={post._id} post={post} />
              ))}
            </div>
          </main>
          <Right />
        </div>
      </div>
    </AuthenticatedLayout>
  );
}


import React from "react";
import ExerciseHub from "@/components/ExerciseHub";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ExerciseLibrary from "@/components/ExerciseLibrary";
import ProgressTracking from "@/components/ProgressTracking";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900">Rehab Pose Assistant</h1>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <Tabs defaultValue="exercise" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="exercise">Exercise Now</TabsTrigger>
            <TabsTrigger value="library">Exercise Library</TabsTrigger>
            <TabsTrigger value="progress">Progress Tracking</TabsTrigger>
          </TabsList>
          <TabsContent value="exercise">
            <ExerciseHub />
          </TabsContent>
          <TabsContent value="library">
            <ExerciseLibrary />
          </TabsContent>
          <TabsContent value="progress">
            <ProgressTracking />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;

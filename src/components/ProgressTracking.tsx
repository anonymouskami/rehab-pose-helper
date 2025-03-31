
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { exerciseData } from "@/data/exercises";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface ExerciseProgress {
  totalReps: number;
  sessions: {
    date: string;
    reps: number;
    accuracy: number;
  }[];
}

interface ProgressData {
  [exerciseId: string]: ExerciseProgress;
}

const ProgressTracking = () => {
  const [progressData, setProgressData] = useState<ProgressData>({});
  
  useEffect(() => {
    // Load progress data from localStorage
    const savedProgress = localStorage.getItem('exerciseProgress');
    if (savedProgress) {
      setProgressData(JSON.parse(savedProgress));
    }
  }, []);
  
  const prepareChartData = (exerciseId: string) => {
    const progress = progressData[exerciseId];
    if (!progress) return [];
    
    // Group by date for the chart
    const sessionsByDate = progress.sessions.reduce((acc, session) => {
      const date = new Date(session.date).toLocaleDateString();
      if (!acc[date]) {
        acc[date] = { date, reps: 0, accuracy: 0, count: 0 };
      }
      acc[date].reps += session.reps;
      acc[date].accuracy += session.accuracy;
      acc[date].count += 1;
      return acc;
    }, {} as Record<string, { date: string; reps: number; accuracy: number; count: number }>);
    
    // Calculate averages and format for the chart
    return Object.values(sessionsByDate).map(day => ({
      date: day.date,
      reps: day.reps,
      accuracy: Math.round(day.accuracy / day.count)
    }));
  };
  
  const getLatestSessions = (exerciseId: string, limit: number = 5) => {
    const progress = progressData[exerciseId];
    if (!progress) return [];
    
    const sortedSessions = [...progress.sessions].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    return sortedSessions.slice(0, limit);
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Progress Tracking</h2>
      
      {Object.keys(progressData).length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              No exercise data available yet. Complete some exercises to track your progress!
            </p>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue={exerciseData[0].id} className="w-full">
          <TabsList className="mb-4">
            {exerciseData.map((exercise) => (
              <TabsTrigger key={exercise.id} value={exercise.id}>
                {exercise.name}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {exerciseData.map((exercise) => (
            <TabsContent key={exercise.id} value={exercise.id}>
              {progressData[exercise.id] ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Progress Chart</CardTitle>
                      <CardDescription>Reps & accuracy over time</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={prepareChartData(exercise.id)} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis yAxisId="left" orientation="left" />
                            <YAxis yAxisId="right" orientation="right" domain={[0, 100]} />
                            <Tooltip />
                            <Bar yAxisId="left" dataKey="reps" name="Reps" fill="#8884d8" />
                            <Bar yAxisId="right" dataKey="accuracy" name="Accuracy %" fill="#82ca9d" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Exercise Summary</CardTitle>
                      <CardDescription>Your performance for {exercise.name}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between">
                          <span className="font-medium">Total Repetitions:</span>
                          <span>{progressData[exercise.id]?.totalReps || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Total Sessions:</span>
                          <span>{progressData[exercise.id]?.sessions.length || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Average Accuracy:</span>
                          <span>
                            {progressData[exercise.id]?.sessions.length ? 
                              Math.round(progressData[exercise.id].sessions.reduce((sum, s) => sum + s.accuracy, 0) / 
                              progressData[exercise.id].sessions.length) + '%' : 'N/A'}
                          </span>
                        </div>
                      </div>
                      
                      <h4 className="font-medium mb-2">Recent Sessions:</h4>
                      <div className="space-y-2">
                        {getLatestSessions(exercise.id).map((session, idx) => (
                          <div key={idx} className="flex justify-between text-sm border-b pb-1">
                            <span>{new Date(session.date).toLocaleDateString()}</span>
                            <span>{session.reps} reps</span>
                            <span>{Math.round(session.accuracy)}% accuracy</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-center text-muted-foreground">
                      No data available for {exercise.name} yet. Complete this exercise to track your progress!
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          ))}
        </Tabs>
      )}
    </div>
  );
};

export default ProgressTracking;

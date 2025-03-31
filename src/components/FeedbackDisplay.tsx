
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface FeedbackDisplayProps {
  feedback: string;
  accuracy: number;
}

const FeedbackDisplay = ({ feedback, accuracy }: FeedbackDisplayProps) => {
  // Determine progress color based on accuracy
  const getProgressColor = () => {
    if (accuracy >= 80) return "bg-green-500";
    if (accuracy >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  // Play audio feedback
  React.useEffect(() => {
    const speakFeedback = () => {
      if (feedback && typeof window !== "undefined" && 'speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(feedback);
        utterance.rate = 1;
        utterance.pitch = 1;
        speechSynthesis.speak(utterance);
      }
    };

    // Limit audio feedback to prevent overwhelming the user
    const feedbackTimeout = setTimeout(speakFeedback, 2000);
    
    return () => {
      clearTimeout(feedbackTimeout);
      if (typeof window !== "undefined" && 'speechSynthesis' in window) {
        speechSynthesis.cancel();
      }
    };
  }, [feedback]);

  return (
    <Card className="mt-4">
      <CardContent className="pt-4">
        <div className="space-y-3">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">Accuracy</span>
              <span className="text-sm font-medium">{Math.round(accuracy)}%</span>
            </div>
            <Progress value={accuracy} className="h-2" />
          </div>
          
          <div className="bg-muted p-3 rounded-md">
            <p className="text-sm">{feedback || "Position yourself and start the exercise"}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FeedbackDisplay;

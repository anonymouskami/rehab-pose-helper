
import React, { useRef, useEffect, useState } from "react";
import * as poseDetection from "@tensorflow-models/pose-detection";
import "@tensorflow/tfjs-backend-webgl";
import "@tensorflow/tfjs-backend-cpu"; // Add CPU backend as fallback
import * as tf from "@tensorflow/tfjs-core";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { exerciseData } from "@/data/exercises";
import FeedbackDisplay from "./FeedbackDisplay";
import { calculateExerciseAccuracy } from "@/utils/poseUtils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

const ExerciseHub = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [detector, setDetector] = useState<poseDetection.PoseDetector | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [currentExercise, setCurrentExercise] = useState(exerciseData[0]);
  const [exerciseActive, setExerciseActive] = useState(false);
  const [feedback, setFeedback] = useState<string>("");
  const [accuracy, setAccuracy] = useState(0);
  const [reps, setReps] = useState(0);
  const [repState, setRepState] = useState<"up" | "down">("up");
  const [modelLoaded, setModelLoaded] = useState(false);
  const [modelError, setModelError] = useState<string | null>(null);
  const { toast } = useToast();

  // Load the pose detection model
  useEffect(() => {
    const loadModel = async () => {
      try {
        // Try WebGL first, fallback to CPU if not available
        try {
          await tf.setBackend('webgl');
          console.log("Using WebGL backend");
        } catch (webglError) {
          console.log("WebGL backend failed, falling back to CPU", webglError);
          await tf.setBackend('cpu');
          console.log("Using CPU backend");
        }
        
        await tf.ready();
        console.log("TensorFlow backend initialized:", tf.getBackend());
        
        const detectorConfig = {
          modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
          enableSmoothing: true,
        };
        
        const detector = await poseDetection.createDetector(
          poseDetection.SupportedModels.MoveNet, 
          detectorConfig
        );
        
        setDetector(detector);
        setModelLoaded(true);
        setModelError(null);
        console.log("Pose detection model loaded successfully");
        
        toast({
          title: "Model Loaded",
          description: "Pose detection model is ready to use",
        });
      } catch (error) {
        console.error("Error loading pose detection model:", error);
        setModelError("Failed to load pose detection model. Your device may not support the required features.");
        setModelLoaded(false);
        toast({
          title: "Model Loading Error",
          description: "Failed to load pose detection model. Please try a different device or browser.",
          variant: "destructive"
        });
      }
    };

    loadModel();
  }, [toast]);

  // Set up webcam when component mounts
  useEffect(() => {
    const setupCamera = async () => {
      if (!videoRef.current) return;
      
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480 },
          audio: false
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.style.opacity = "1";
          
          videoRef.current.onloadedmetadata = () => {
            if (videoRef.current) {
              videoRef.current.play();
              console.log("Webcam stream started successfully");
            }
          };
        }
      } catch (error) {
        console.error("Error accessing webcam:", error);
        toast({
          title: "Camera Access Error",
          description: "Please enable camera access to use the exercise assistant",
          variant: "destructive"
        });
      }
    };

    setupCamera();
    
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, [toast]);

  // Main detection loop
  useEffect(() => {
    let animationFrame: number;
    let lastRepTime = Date.now();
    
    const detectPose = async () => {
      if (!detector || !videoRef.current || !canvasRef.current || videoRef.current.readyState !== 4) {
        animationFrame = requestAnimationFrame(detectPose);
        return;
      }

      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      
      if (!ctx) return;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      try {
        const poses = await detector.estimatePoses(video);
        
        if (poses.length > 0 && exerciseActive) {
          const pose = poses[0];
          
          if (pose.keypoints) {
            drawKeypoints(pose.keypoints, ctx);
            drawSkeleton(pose.keypoints, ctx);
            
            const { accuracy: poseAccuracy, feedback: poseFeedback, isCorrectPosition } = 
              calculateExerciseAccuracy(pose.keypoints, currentExercise);
            
            setAccuracy(poseAccuracy);
            setFeedback(poseFeedback);
            
            const currentTime = Date.now();
            
            if (currentTime - lastRepTime > 1000) {
              if (isCorrectPosition && repState === "up") {
                setRepState("down");
              } else if (!isCorrectPosition && repState === "down") {
                setRepState("up");
                setReps(prev => prev + 1);
                lastRepTime = currentTime;
                
                toast({
                  title: "Rep completed!",
                  description: `You've completed ${reps + 1} reps`,
                  duration: 1000
                });
                
                const savedProgress = JSON.parse(localStorage.getItem('exerciseProgress') || '{}');
                const exerciseProgress = savedProgress[currentExercise.id] || { totalReps: 0, sessions: [] };
                
                exerciseProgress.totalReps += 1;
                exerciseProgress.sessions.push({
                  date: new Date().toISOString(),
                  reps: 1,
                  accuracy: poseAccuracy
                });
                
                savedProgress[currentExercise.id] = exerciseProgress;
                localStorage.setItem('exerciseProgress', JSON.stringify(savedProgress));
              }
            }
          }
        }
      } catch (error) {
        console.error("Error detecting pose:", error);
      }
      
      animationFrame = requestAnimationFrame(detectPose);
    };
    
    if (isDetecting) {
      detectPose();
    }
    
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [detector, isDetecting, currentExercise, exerciseActive, repState, reps, toast]);

  const startDetection = () => {
    setIsDetecting(true);
  };
  
  const stopDetection = () => {
    setIsDetecting(false);
  };
  
  const startExercise = () => {
    setExerciseActive(true);
    setReps(0);
    setAccuracy(0);
    setFeedback("Start the exercise following the guidance");
    
    toast({
      title: `Starting ${currentExercise.name}`,
      description: "Position yourself in the camera view",
    });
    
    if (!isDetecting) {
      startDetection();
    }
  };
  
  const stopExercise = () => {
    setExerciseActive(false);
    setFeedback("");
  };
  
  const selectExercise = (exercise: typeof exerciseData[0]) => {
    setCurrentExercise(exercise);
    setExerciseActive(false);
    setReps(0);
    setAccuracy(0);
    setFeedback("");
  };
  
  const drawKeypoints = (keypoints: poseDetection.Keypoint[], ctx: CanvasRenderingContext2D) => {
    keypoints.forEach((keypoint) => {
      if (keypoint.score && keypoint.score > 0.3) {
        const { x, y } = keypoint;
        
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, 2 * Math.PI);
        ctx.fillStyle = "aqua";
        ctx.fill();
      }
    });
  };
  
  const drawSkeleton = (keypoints: poseDetection.Keypoint[], ctx: CanvasRenderingContext2D) => {
    const connections = [
      ["nose", "left_eye"], ["nose", "right_eye"],
      ["left_eye", "left_ear"], ["right_eye", "right_ear"],
      ["left_shoulder", "right_shoulder"],
      ["left_shoulder", "left_elbow"], ["right_shoulder", "right_elbow"],
      ["left_elbow", "left_wrist"], ["right_elbow", "right_wrist"],
      ["left_shoulder", "left_hip"], ["right_shoulder", "right_hip"],
      ["left_hip", "right_hip"],
      ["left_hip", "left_knee"], ["right_hip", "right_knee"],
      ["left_knee", "left_ankle"], ["right_knee", "right_ankle"]
    ];
    
    const keypointMap = keypoints.reduce((map, keypoint) => {
      map[keypoint.name as string] = keypoint;
      return map;
    }, {} as Record<string, poseDetection.Keypoint>);
    
    connections.forEach(([start, end]) => {
      const startPoint = keypointMap[start];
      const endPoint = keypointMap[end];
      
      if (startPoint && endPoint && 
          startPoint.score && startPoint.score > 0.3 &&
          endPoint.score && endPoint.score > 0.3) {
        ctx.beginPath();
        ctx.moveTo(startPoint.x, startPoint.y);
        ctx.lineTo(endPoint.x, endPoint.y);
        ctx.lineWidth = 2;
        ctx.strokeStyle = "lime";
        ctx.stroke();
      }
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Pose Detection</CardTitle>
          <CardDescription>Follow the exercise and receive real-time feedback</CardDescription>
        </CardHeader>
        <CardContent className="relative">
          {modelError && (
            <Alert variant="destructive" className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Device Compatibility Issue</AlertTitle>
              <AlertDescription>
                {modelError} Try using a device with better WebGL support or a different browser.
              </AlertDescription>
            </Alert>
          )}
          <div className="relative aspect-video rounded-md overflow-hidden bg-black">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="absolute inset-0 w-full h-full object-cover"
              style={{ opacity: 1 }}
            />
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full object-cover"
            />
            {!modelLoaded && !modelError && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
                  <p>Loading pose detection model...</p>
                </div>
              </div>
            )}
          </div>
          <FeedbackDisplay feedback={feedback} accuracy={accuracy} />
        </CardContent>
        <CardFooter className="flex flex-col items-start gap-4">
          <div className="flex items-center gap-2">
            <span className="font-medium">Current Exercise:</span>
            <span>{currentExercise.name}</span>
          </div>
          
          <div className="text-sm text-gray-700">
  <div>Instruction</div>
  {currentExercise.instructions.map((instruction, index) => (
    <div key={index}>{instruction}</div>
  ))}
</div>

          <div className="flex items-center gap-2">
            <span className="font-medium">Reps Completed:</span>
            <span>{reps}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {!isDetecting ? (
              <Button onClick={startDetection}>Start Camera</Button>
            ) : (
              <Button variant="outline" onClick={stopDetection}>Stop Camera</Button>
            )}
            {isDetecting && !exerciseActive ? (
              <Button onClick={startExercise} disabled={!modelLoaded}>Start Exercise</Button>
            ) : isDetecting && exerciseActive ? (
              <Button variant="outline" onClick={stopExercise}>End Exercise</Button>
            ) : null}
          </div>
          {!modelLoaded && !modelError && <p className="text-sm text-amber-600">Loading pose detection model...</p>}
        </CardFooter>
      </Card>

      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Exercise Selection</CardTitle>
          <CardDescription>Choose an exercise to perform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {exerciseData.map((exercise) => (
              <Card 
                key={exercise.id} 
                className={`cursor-pointer transition-all ${currentExercise.id === exercise.id ? 'border-primary shadow-md' : 'border-border'}`}
                onClick={() => selectExercise(exercise)}
              >
                <CardHeader className="p-3">
                  <CardTitle className="text-base">{exercise.name}</CardTitle>
                  <CardDescription className="text-xs">{exercise.targetArea}</CardDescription>
                </CardHeader>
                <CardContent className="p-3 pt-0">
                  <p className="text-sm text-muted-foreground">{exercise.shortDescription}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExerciseHub;

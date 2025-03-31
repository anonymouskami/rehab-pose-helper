
import * as poseDetection from "@tensorflow-models/pose-detection";
import { exerciseData } from "@/data/exercises";

// Calculate the angle between three points (in degrees)
export const calculateAngle = (
  a: { x: number; y: number },
  b: { x: number; y: number },
  c: { x: number; y: number }
) => {
  const radians = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
  let angle = Math.abs(radians * 180 / Math.PI);
  
  // Ensure the angle is always between 0-180
  if (angle > 180) {
    angle = 360 - angle;
  }
  
  return angle;
};

// Get keypoints by name to make angle calculations easier
const getKeypointsByName = (keypoints: poseDetection.Keypoint[]) => {
  return keypoints.reduce((acc, keypoint) => {
    acc[keypoint.name as string] = keypoint;
    return acc;
  }, {} as Record<string, poseDetection.Keypoint>);
};

// Calculate the accuracy of an exercise based on pose keypoints
export const calculateExerciseAccuracy = (
  keypoints: poseDetection.Keypoint[],
  exercise: typeof exerciseData[0]
) => {
  const keypointsByName = getKeypointsByName(keypoints);
  let feedback = "";
  let accuracyScore = 0;
  let isCorrectPosition = false;
  
  // Calculate different metrics depending on the exercise type
  switch (exercise.id) {
    case "knee-extension": {
      // Calculate knee angle (between hip, knee, and ankle)
      if (
        keypointsByName["left_hip"] &&
        keypointsByName["left_knee"] && 
        keypointsByName["left_ankle"] &&
        keypointsByName["left_hip"].score && keypointsByName["left_hip"].score > 0.5 && 
        keypointsByName["left_knee"].score && keypointsByName["left_knee"].score > 0.5 && 
        keypointsByName["left_ankle"].score && keypointsByName["left_ankle"].score > 0.5
      ) {
        const angle = calculateAngle(
          { x: keypointsByName["left_hip"].x, y: keypointsByName["left_hip"].y },
          { x: keypointsByName["left_knee"].x, y: keypointsByName["left_knee"].y },
          { x: keypointsByName["left_ankle"].x, y: keypointsByName["left_ankle"].y }
        );
        
        const targetMin = exercise.keyAngles.knee.min;
        const targetMax = exercise.keyAngles.knee.max;
        
        if (angle >= targetMin && angle <= targetMax) {
          feedback = "Good knee extension!";
          accuracyScore = 90;
          isCorrectPosition = true;
        } else if (angle < targetMin) {
          feedback = "Extend your knee more";
          accuracyScore = Math.max(0, 70 * (angle / targetMin));
          isCorrectPosition = false;
        } else {
          feedback = "Don't hyperextend your knee";
          accuracyScore = Math.max(0, 70 * (2 - (angle / targetMax)));
          isCorrectPosition = false;
        }
      } else if (
        keypointsByName["right_hip"] &&
        keypointsByName["right_knee"] && 
        keypointsByName["right_ankle"] &&
        keypointsByName["right_hip"].score && keypointsByName["right_hip"].score > 0.5 && 
        keypointsByName["right_knee"].score && keypointsByName["right_knee"].score > 0.5 && 
        keypointsByName["right_ankle"].score && keypointsByName["right_ankle"].score > 0.5
      ) {
        const angle = calculateAngle(
          { x: keypointsByName["right_hip"].x, y: keypointsByName["right_hip"].y },
          { x: keypointsByName["right_knee"].x, y: keypointsByName["right_knee"].y },
          { x: keypointsByName["right_ankle"].x, y: keypointsByName["right_ankle"].y }
        );
        
        const targetMin = exercise.keyAngles.knee.min;
        const targetMax = exercise.keyAngles.knee.max;
        
        if (angle >= targetMin && angle <= targetMax) {
          feedback = "Good knee extension!";
          accuracyScore = 90;
          isCorrectPosition = true;
        } else if (angle < targetMin) {
          feedback = "Extend your knee more";
          accuracyScore = Math.max(0, 70 * (angle / targetMin));
          isCorrectPosition = false;
        } else {
          feedback = "Don't hyperextend your knee";
          accuracyScore = Math.max(0, 70 * (2 - (angle / targetMax)));
          isCorrectPosition = false;
        }
      } else {
        feedback = "Position your leg in camera view";
        accuracyScore = 10;
        isCorrectPosition = false;
      }
      break;
    }
    
    case "shoulder-flexion": {
      // Calculate shoulder angle (between hip, shoulder, and elbow)
      if (
        keypointsByName["left_shoulder"] &&
        keypointsByName["left_elbow"] && 
        keypointsByName["left_hip"] &&
        keypointsByName["left_shoulder"].score && keypointsByName["left_shoulder"].score > 0.5 && 
        keypointsByName["left_elbow"].score && keypointsByName["left_elbow"].score > 0.5 && 
        keypointsByName["left_hip"].score && keypointsByName["left_hip"].score > 0.5
      ) {
        const angle = calculateAngle(
          { x: keypointsByName["left_elbow"].x, y: keypointsByName["left_elbow"].y },
          { x: keypointsByName["left_shoulder"].x, y: keypointsByName["left_shoulder"].y },
          { x: keypointsByName["left_hip"].x, y: keypointsByName["left_hip"].y }
        );
        
        const targetMin = exercise.keyAngles.shoulder.min;
        const targetMax = exercise.keyAngles.shoulder.max;
        
        if (angle >= targetMin && angle <= targetMax) {
          feedback = "Great shoulder position!";
          accuracyScore = 90;
          isCorrectPosition = true;
        } else if (angle < targetMin) {
          feedback = "Raise your arm higher";
          accuracyScore = Math.max(0, 70 * (angle / targetMin));
          isCorrectPosition = false;
        } else {
          feedback = "Don't overextend your shoulder";
          accuracyScore = Math.max(0, 70 * (2 - (angle / targetMax)));
          isCorrectPosition = false;
        }
      } else if (
        keypointsByName["right_shoulder"] &&
        keypointsByName["right_elbow"] && 
        keypointsByName["right_hip"] &&
        keypointsByName["right_shoulder"].score && keypointsByName["right_shoulder"].score > 0.5 && 
        keypointsByName["right_elbow"].score && keypointsByName["right_elbow"].score > 0.5 && 
        keypointsByName["right_hip"].score && keypointsByName["right_hip"].score > 0.5
      ) {
        const angle = calculateAngle(
          { x: keypointsByName["right_elbow"].x, y: keypointsByName["right_elbow"].y },
          { x: keypointsByName["right_shoulder"].x, y: keypointsByName["right_shoulder"].y },
          { x: keypointsByName["right_hip"].x, y: keypointsByName["right_hip"].y }
        );
        
        const targetMin = exercise.keyAngles.shoulder.min;
        const targetMax = exercise.keyAngles.shoulder.max;
        
        if (angle >= targetMin && angle <= targetMax) {
          feedback = "Great shoulder position!";
          accuracyScore = 90;
          isCorrectPosition = true;
        } else if (angle < targetMin) {
          feedback = "Raise your arm higher";
          accuracyScore = Math.max(0, 70 * (angle / targetMin));
          isCorrectPosition = false;
        } else {
          feedback = "Don't overextend your shoulder";
          accuracyScore = Math.max(0, 70 * (2 - (angle / targetMax)));
          isCorrectPosition = false;
        }
      } else {
        feedback = "Position your arm in camera view";
        accuracyScore = 10;
        isCorrectPosition = false;
      }
      break;
    }
    
    case "hip-bridge": {
      // Calculate hip angle (between shoulder, hip, and knee)
      if (
        keypointsByName["left_shoulder"] &&
        keypointsByName["left_hip"] && 
        keypointsByName["left_knee"] &&
        keypointsByName["left_shoulder"].score && keypointsByName["left_shoulder"].score > 0.5 && 
        keypointsByName["left_hip"].score && keypointsByName["left_hip"].score > 0.5 && 
        keypointsByName["left_knee"].score && keypointsByName["left_knee"].score > 0.5
      ) {
        const angle = calculateAngle(
          { x: keypointsByName["left_shoulder"].x, y: keypointsByName["left_shoulder"].y },
          { x: keypointsByName["left_hip"].x, y: keypointsByName["left_hip"].y },
          { x: keypointsByName["left_knee"].x, y: keypointsByName["left_knee"].y }
        );
        
        const targetMin = exercise.keyAngles.hip.min;
        const targetMax = exercise.keyAngles.hip.max;
        
        if (angle >= targetMin && angle <= targetMax) {
          feedback = "Perfect hip position!";
          accuracyScore = 90;
          isCorrectPosition = true;
        } else if (angle < targetMin) {
          feedback = "Raise your hips higher";
          accuracyScore = Math.max(0, 70 * (angle / targetMin));
          isCorrectPosition = false;
        } else {
          feedback = "Lower your hips slightly";
          accuracyScore = Math.max(0, 70 * (2 - (angle / targetMax)));
          isCorrectPosition = false;
        }
      } else if (
        keypointsByName["right_shoulder"] &&
        keypointsByName["right_hip"] && 
        keypointsByName["right_knee"] &&
        keypointsByName["right_shoulder"].score && keypointsByName["right_shoulder"].score > 0.5 && 
        keypointsByName["right_hip"].score && keypointsByName["right_hip"].score > 0.5 && 
        keypointsByName["right_knee"].score && keypointsByName["right_knee"].score > 0.5
      ) {
        const angle = calculateAngle(
          { x: keypointsByName["right_shoulder"].x, y: keypointsByName["right_shoulder"].y },
          { x: keypointsByName["right_hip"].x, y: keypointsByName["right_hip"].y },
          { x: keypointsByName["right_knee"].x, y: keypointsByName["right_knee"].y }
        );
        
        const targetMin = exercise.keyAngles.hip.min;
        const targetMax = exercise.keyAngles.hip.max;
        
        if (angle >= targetMin && angle <= targetMax) {
          feedback = "Perfect hip position!";
          accuracyScore = 90;
          isCorrectPosition = true;
        } else if (angle < targetMin) {
          feedback = "Raise your hips higher";
          accuracyScore = Math.max(0, 70 * (angle / targetMin));
          isCorrectPosition = false;
        } else {
          feedback = "Lower your hips slightly";
          accuracyScore = Math.max(0, 70 * (2 - (angle / targetMax)));
          isCorrectPosition = false;
        }
      } else {
        feedback = "Position yourself in camera view";
        accuracyScore = 10;
        isCorrectPosition = false;
      }
      break;
    }
    
    case "ankle-dorsiflexion": {
      // Calculate ankle angle (between knee, ankle, and toe)
      if (
        keypointsByName["left_knee"] &&
        keypointsByName["left_ankle"] && 
        keypointsByName["left_foot_index"] &&
        keypointsByName["left_knee"].score && keypointsByName["left_knee"].score > 0.5 && 
        keypointsByName["left_ankle"].score && keypointsByName["left_ankle"].score > 0.5 && 
        keypointsByName["left_foot_index"].score && keypointsByName["left_foot_index"].score > 0.5
      ) {
        const angle = calculateAngle(
          { x: keypointsByName["left_knee"].x, y: keypointsByName["left_knee"].y },
          { x: keypointsByName["left_ankle"].x, y: keypointsByName["left_ankle"].y },
          { x: keypointsByName["left_foot_index"].x, y: keypointsByName["left_foot_index"].y }
        );
        
        const targetMin = exercise.keyAngles.ankle.min;
        const targetMax = exercise.keyAngles.ankle.max;
        
        if (angle >= targetMin && angle <= targetMax) {
          feedback = "Good ankle flexion!";
          accuracyScore = 90;
          isCorrectPosition = true;
        } else if (angle < targetMin) {
          feedback = "Flex your ankle more";
          accuracyScore = Math.max(0, 70 * (angle / targetMin));
          isCorrectPosition = false;
        } else {
          feedback = "Reduce your ankle flexion slightly";
          accuracyScore = Math.max(0, 70 * (2 - (angle / targetMax)));
          isCorrectPosition = false;
        }
      } else if (
        keypointsByName["right_knee"] &&
        keypointsByName["right_ankle"] && 
        keypointsByName["right_foot_index"] &&
        keypointsByName["right_knee"].score && keypointsByName["right_knee"].score > 0.5 && 
        keypointsByName["right_ankle"].score && keypointsByName["right_ankle"].score > 0.5 && 
        keypointsByName["right_foot_index"].score && keypointsByName["right_foot_index"].score > 0.5
      ) {
        const angle = calculateAngle(
          { x: keypointsByName["right_knee"].x, y: keypointsByName["right_knee"].y },
          { x: keypointsByName["right_ankle"].x, y: keypointsByName["right_ankle"].y },
          { x: keypointsByName["right_foot_index"].x, y: keypointsByName["right_foot_index"].y }
        );
        
        const targetMin = exercise.keyAngles.ankle.min;
        const targetMax = exercise.keyAngles.ankle.max;
        
        if (angle >= targetMin && angle <= targetMax) {
          feedback = "Good ankle flexion!";
          accuracyScore = 90;
          isCorrectPosition = true;
        } else if (angle < targetMin) {
          feedback = "Flex your ankle more";
          accuracyScore = Math.max(0, 70 * (angle / targetMin));
          isCorrectPosition = false;
        } else {
          feedback = "Reduce your ankle flexion slightly";
          accuracyScore = Math.max(0, 70 * (2 - (angle / targetMax)));
          isCorrectPosition = false;
        }
      } else {
        feedback = "Position your foot in camera view";
        accuracyScore = 10;
        isCorrectPosition = false;
      }
      break;
    }
    
    default:
      feedback = "Exercise not recognized";
      accuracyScore = 0;
      isCorrectPosition = false;
  }
  
  return { accuracy: accuracyScore, feedback, isCorrectPosition };
};

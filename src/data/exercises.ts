
export const exerciseData = [
  {
    id: "knee-extension",
    name: "Knee Extension",
    targetArea: "Knee Recovery",
    shortDescription: "Strengthens quadriceps muscles to improve knee stability",
    description: "Knee extensions help strengthen the quadriceps muscles, which are essential for knee stability and function. This exercise is particularly beneficial for recovery after knee injuries or surgery.",
    instructions: [
      "Sit on a chair with your back straight and feet flat on the floor",
      "Slowly extend one leg straight out in front of you until it's parallel to the floor",
      "Hold for 3-5 seconds at full extension",
      "Slowly lower your leg back to the starting position",
      "Complete 10-15 repetitions, then switch to the other leg"
    ],
    keyPoints: [
      "Keep your back straight throughout the exercise",
      "Extend your knee fully but don't lock it",
      "Movement should be slow and controlled",
      "Focus on engaging your quadriceps muscles",
      "Avoid jerky or rapid movements"
    ],
    keyAngles: {
      knee: { min: 160, max: 180 } // Degrees for proper knee extension
    }
  },
  {
    id: "shoulder-flexion",
    name: "Shoulder Flexion",
    targetArea: "Shoulder Mobility",
    shortDescription: "Improves range of motion in the shoulder joint",
    description: "Shoulder flexion exercises help restore and improve the range of motion in the shoulder joint. This is beneficial for recovery after shoulder injuries, frozen shoulder, or surgery.",
    instructions: [
      "Stand or sit with your arm by your side and palm facing inward",
      "Slowly raise your arm forward and upward until it's pointing to the ceiling",
      "Hold the position for 2-3 seconds",
      "Slowly lower your arm back to the starting position",
      "Repeat 10-12 times for each arm"
    ],
    keyPoints: [
      "Keep your elbow straight but not locked",
      "Maintain proper posture with shoulders relaxed",
      "Only raise your arm as far as you can without pain",
      "Don't shrug your shoulder as you lift",
      "Movement should be smooth and controlled"
    ],
    keyAngles: {
      shoulder: { min: 160, max: 180 } // Degrees for proper shoulder flexion
    }
  },
  {
    id: "hip-bridge",
    name: "Hip Bridge",
    targetArea: "Lower Back & Hip",
    shortDescription: "Strengthens core, glutes, and lower back muscles",
    description: "The hip bridge is an excellent exercise for strengthening the core, glutes, and lower back muscles while also improving hip mobility. It's particularly helpful for those recovering from lower back issues or hip injuries.",
    instructions: [
      "Lie on your back with knees bent and feet flat on the floor",
      "Place your arms at your sides with palms down",
      "Squeeze your glutes and lift your hips toward the ceiling",
      "Create a straight line from shoulders to knees",
      "Hold for 3-5 seconds at the top",
      "Lower your hips back to the starting position",
      "Repeat for 10-15 repetitions"
    ],
    keyPoints: [
      "Don't arch your back excessively",
      "Keep your core engaged throughout",
      "Push through your heels to activate glutes properly",
      "Keep your shoulders on the ground",
      "Breathe steadily throughout the exercise"
    ],
    keyAngles: {
      hip: { min: 160, max: 180 } // Degrees for proper hip extension
    }
  },
  {
    id: "ankle-dorsiflexion",
    name: "Ankle Dorsiflexion",
    targetArea: "Ankle Mobility",
    shortDescription: "Improves ankle flexibility and strengthens shin muscles",
    description: "Ankle dorsiflexion exercises improve flexibility and strength in the ankle joint, which is crucial for walking, balance, and preventing future injuries. This exercise is particularly beneficial for those recovering from ankle sprains or surgery.",
    instructions: [
      "Sit on a chair with your feet flat on the floor",
      "Keeping your heel on the ground, lift your forefoot and toes upward",
      "Hold the position for 3-5 seconds",
      "Slowly lower your foot back to the starting position",
      "Repeat 10-15 times for each foot"
    ],
    keyPoints: [
      "Keep your heel in contact with the floor",
      "Focus on the upward pulling motion of the foot",
      "Move through the full available range of motion",
      "Movement should be controlled and deliberate",
      "Stop if you feel pain (mild discomfort is normal)"
    ],
    keyAngles: {
      ankle: { min: 80, max: 100 } // Degrees for proper ankle dorsiflexion
    }
  }
];

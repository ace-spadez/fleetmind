import { ChatData } from "@/types";

export const mockChats: ChatData[] = [
  {
    channelId: "assistant-bot",
    messages: [
      {
        id: "1",
        content: "Hello! I'm ready to help you with your workspace. Would you like me to help you build a project, write code, or answer any questions?",
        sender: "bot",
        timestamp: new Date(new Date().getTime() - 600000),
        botName: "AssistantBot"
      },
      {
        id: "2",
        content: "I need help building a solar system simulator app. Can you help me plan it out?",
        sender: "user",
        timestamp: new Date(new Date().getTime() - 480000),
        userName: "User"
      },
      {
        id: "3",
        content: "I'd be happy to help you build a solar system simulator app! Let's break down the key components:\n\nCore Features:\n- Interactive 3D visualization of planets\n- Realistic orbital mechanics\n- Educational information about each celestial body\n- Time controls to speed up/slow down simulation\n\nTechnologies we could use:\n- Three.js for 3D visualization\n- React for UI components\n- Physics calculations for orbital mechanics\n\nWould you like me to create a project setup with these technologies or would you prefer to focus on a specific aspect first?",
        sender: "bot",
        timestamp: new Date(new Date().getTime() - 420000),
        botName: "AssistantBot"
      },
      {
        id: "4",
        content: "Let's start with setting up the project. I want to focus on education, so let's make sure we have good information about each planet.",
        sender: "user",
        timestamp: new Date(new Date().getTime() - 180000),
        userName: "User"
      },
      {
        id: "5",
        content: "Great! I'll help you set up an educational solar system simulator project. I'll create the initial setup with a focus on educational content.\n\nI've created the initial project setup. You can find the code in the repository. Is there a specific planet or feature you'd like to focus on implementing first?",
        sender: "bot",
        timestamp: new Date(new Date().getTime() - 120000),
        botName: "AssistantBot"
      }
    ]
  },
  {
    channelId: "code-helper",
    messages: [
      {
        id: "1",
        content: "Hello! I'm CodeHelper. I can assist you with coding questions, debugging, and implementation. What would you like help with today?",
        sender: "bot",
        timestamp: new Date(new Date().getTime() - 60000),
        botName: "CodeHelper"
      }
    ]
  }
];

export interface QuestionOption {
  id: string;
  emoji: string;
  label: string;
  description: string;
}

export interface Question {
  id: number;
  text: string;
  subtitle?: string;
  options: QuestionOption[];
  multipleSelection: boolean;
}

export const questions: Question[] = [
  {
    id: 1,
    text: "When you start planning a trip, your first move is to...",
    subtitle: "Tell us about your planning style",
    options: [
      {
        id: "a",
        emoji: "🛒",
        label: "Browse Online Platforms",
        description: "Jump on MakeMyTrip, Yatra, Booking.com, or other travel sites to explore options"
      },
      {
        id: "b", 
        emoji: "🗺️",
        label: "Call My Travel Agent",
        description: "Trust my favorite travel professional to handle the planning"
      },
      {
        id: "c",
        emoji: "💬", 
        label: "Ask Friends & Family",
        description: "Get recommendations and tips from people I trust who've been there"
      },
      {
        id: "d",
        emoji: "🧭",
        label: "Deep Dive Research", 
        description: "Spend hours on blogs, YouTube, Instagram researching destinations"
      },
      {
        id: "e",
        emoji: "🤷",
        label: "Wing It Completely",
        description: "Just go with the flow and figure it out as I travel"
      }
    ],
  multipleSelection: true
  },
  {
    id: 2,
    text: "Which travel challenges have you experienced?",
    subtitle: "Select all that apply to help us understand your pain points",
    options: [
      {
        id: "a",
        emoji: "💸",
        label: "Hidden Costs",
        description: "Surprise fees and costs that weren't mentioned upfront"
      },
      {
        id: "b",
        emoji: "🛑", 
        label: "Poor Coordination",
        description: "Missed pickups, delayed information, or communication issues"
      },
      {
        id: "c",
        emoji: "🏚️",
        label: "Misleading Photos",
        description: "Accommodations that didn't match their online photos"
      },
      {
        id: "d",
        emoji: "🍽️",
        label: "Food Disappointments", 
        description: "Limited food options or poor quality dining experiences"
      },
      {
        id: "e",
        emoji: "✅",
        label: "Smooth Sailing",
        description: "Actually, my travel experiences have been pretty great!"
      }
    ],
    multipleSelection: true
  },
  {
    id: 3,
    text: "What's your relationship with travel packages?",
    subtitle: "Help us understand your booking preferences",
    options: [
      {
        id: "a",
        emoji: "😎",
        label: "DIY Traveler", 
        description: "I prefer planning and booking everything myself for full control"
      },
      {
        id: "b",
        emoji: "📉",
        label: "Price Conscious",
        description: "Packages seem overpriced compared to booking separately"
      },
      {
        id: "c", 
        emoji: "🤔",
        label: "Quality Concerns",
        description: "I'm worried about the quality and don't fully trust package deals"
      },
      {
        id: "d",
        emoji: "📍",
        label: "Unaware of Options",
        description: "I didn't know there were good package options available"
      },
      {
        id: "e",
        emoji: "🕒",
        label: "Haven't Needed One",
        description: "Just haven't had the need for a travel package yet"
      }
    ],
  multipleSelection: true
  },
  {
    id: 4,
    text: "What's the most frustrating part of trip planning?",
    subtitle: "We want to solve your biggest travel planning headache",
    options: [
      {
        id: "a",
        emoji: "🧩",
        label: "Coordination Chaos",
        description: "Piecing together flights, hotels, activities, and transportation"
      },
      {
        id: "b",
        emoji: "📑",
        label: "Option Overload", 
        description: "Comparing endless options, prices, and reviews gets overwhelming"
      },
      {
        id: "c",
        emoji: "🔍",
        label: "Decision Paralysis",
        description: "Not knowing what's actually worth doing at the destination"
      },
      {
        id: "d",
        emoji: "📞",
        label: "Support Issues",
        description: "Poor customer service when things go wrong during travel"
      },
      {
        id: "e",
        emoji: "💭",
        label: "Time Consuming",
        description: "The whole process just takes way too much time and energy"
      }
    ],
  multipleSelection: true
  },
  {
    id: 5,
    text: "If we created a platform for you to create your perfect trip...",
    subtitle: "Your budget, style, interests, and travel personality - would you try it?",
    options: [
      {
        id: "a", 
        emoji: "🔥",
        label: "Sign Me Up Now!",
        description: "Yes! I'd try it right away - sounds like exactly what I need"
      },
      {
        id: "b",
        emoji: "🤔",
        label: "Maybe... Depends",
        description: "I'm interested but it would depend on the price and details"
      },
      {
        id: "c",
        emoji: "🙅",
        label: "Thanks, But No",
        description: "I prefer my current way of planning"
      }
    ],
  multipleSelection: false
  }
];
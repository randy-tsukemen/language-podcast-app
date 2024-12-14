# Language Podcast App with Text-to-Speech

A Next.js application that converts text to speech with real-time word highlighting, built using Next.js 14 and ElevenLabs TTS API.

## Features

- Text-to-Speech conversion with ElevenLabs API
- Real-time word highlighting during playback
- Text editing capabilities
- Audio caching to reduce API calls
- Responsive design with dark mode support
![image](https://github.com/user-attachments/assets/253f4dda-3478-47c2-afff-70a724914da3)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- ElevenLabs API key

### Environment Setup

1. Create a `.env.local` file in the root directory:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

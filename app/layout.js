import './globals.css';

export const metadata = {
  title: 'Voyara — AI Travel Planner',
  description: 'Tell us where you want to go. AI builds your perfect itinerary instantly.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
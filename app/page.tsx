import Navbar from "@/components/Navbar";
import "@/styles/onboarding.css";

export default function HomePage() {
  return (
    <div className="hero">
      <Navbar />

      <div className="hero-content">
        <h1>Explore Discover <br /> & Wanderlust</h1>
        <p>
          Your all-in-one travel platform for seamless planning and smarter exploration.
        </p>
      </div>
    </div>
  );
}

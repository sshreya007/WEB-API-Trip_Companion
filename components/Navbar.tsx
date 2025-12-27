import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">TRIP</div>

      <ul className="nav-links">
        <li>Home</li>
        <li>Packages</li>
        <li>Explore</li>
        <li>About</li>
        <li>Contact us</li>
      </ul>

      
      <Link href="/login" className="login-btn">
        Login / Sign Up
      </Link>
    </nav>
  );
}

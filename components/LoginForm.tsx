"use client";

export default function LoginForm() {
  return (
    <form>
      <input type="email" placeholder="Email" />
      <input type="password" placeholder="Enter your password" />

      <button type="submit">Login</button>

      <p className="tagline">Capturing Moments, Creating Memories</p>
    </form>
  );
}

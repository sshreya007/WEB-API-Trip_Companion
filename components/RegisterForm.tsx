"use client";

export default function RegisterForm() {
  return (
    <form>
      <div className="row">
        <input placeholder="First Name" />
        <input placeholder="Last Name" />
      </div>

      <input placeholder="Email" />
      <input type="password" placeholder="Enter your password" />

      <label className="checkbox">
        <input type="checkbox" /> I agree to the Terms & Conditions
      </label>

      <button type="submit">Create Account</button>
    </form>
  );
}

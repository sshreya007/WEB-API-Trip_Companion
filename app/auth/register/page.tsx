import RegisterForm from "@/components/RegisterForm";
import "@/styles/auth.css";

export default function RegisterPage() {
  return (
    <div className="auth-container">
      <div className="auth-card">
        <img src="/images/register.jpg" className="auth-image" />

        <div className="auth-form">
          <h2>Create an Account</h2>
          <p>Already have an account? <a href="/login">Login</a></p>
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}

"use client"; 

import LoginForm from "@/components/LoginForm"; 
import Link from "next/link";
import "@/styles/auth.css";

export default function LoginPage() {
  return (
    <div className="auth-container">
      <div className="auth-card">
        <img src="/images/login.jpg" alt="Login" className="auth-image" />

        <div className="auth-form">
          <h2>Welcome</h2>
          <p>
            Don’t have an account?{" "}
            <Link href="/auth/register" className="signup-link">
              Sign Up
            </Link>
          </p>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
// "use client";

// import LoginForm from "@/components/LoginForm";
// import Link from "next/link";
// import "@/styles/auth.css";

// export default function LoginPage() {
//   return (
//     <div className="auth-container">
//       <div className="auth-card">
//         <img src="/images/login.jpg" alt="Login" className="auth-image" />

//         <div className="auth-form">
//           <h2>Welcome</h2>
//           <p>
//             Don't have an account?{" "}
//             <Link href="/auth/register" className="signup-link">
//               Sign Up
//             </Link>
//           </p>
//           <LoginForm />
//         </div>
//       </div>
//     </div>
//   );
// }
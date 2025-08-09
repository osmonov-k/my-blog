import { SignUp } from "@clerk/clerk-react";
import React from "react";

const Register = () => {
  return (
    <div>
      <div className="flex items-center justify-center h-[cal(100vh-80px)]">
        <SignUp signInUrl="/login" />
      </div>
    </div>
  );
};

export default Register;

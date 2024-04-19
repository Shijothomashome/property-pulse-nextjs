'use client';
import { SessionProvider } from "next-auth/react";

const AuthProvider = ({ children }) => {
  return <SessionProvider>{children}</SessionProvider>;
};

export default AuthProvider;

// If we do not make this as client component then it will show error
// Inorder to wrap the whole layout with the session provider we need to use it in the layout component. 
// So for that we would need to make the layout into a client component. So to avoid making layout completely into client component, we do this
// We make the session provider as client component and then export the session provider into the layout component and use it.
// So by doing this we didn't have to make the layout client side
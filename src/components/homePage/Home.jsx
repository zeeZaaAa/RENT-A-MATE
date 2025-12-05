// Home.jsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "@fontsource/poppins";
import Login from "../auth/Login";
import SignUp from "../auth/SignUp";

export default function Home() {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

  return (
    <div className="relative min-h-screen bg-gradient-to-tr from-blue-400 via-purple-500 to-pink-400 overflow-hidden flex items-center justify-center font-poppins">
      <motion.div
        className="absolute w-72 h-72 bg-white/10 rounded-full top-10 left-10"
        animate={{ y: [0, 20, 0], x: [0, 20, 0] }}
        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-56 h-56 bg-white/20 rounded-full bottom-20 right-20"
        animate={{ y: [0, -20, 0], x: [0, -20, 0] }}
        transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-96 h-96 bg-white/5 rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        animate={{ rotate: [0, 360] }}
        transition={{ repeat: Infinity, duration: 60, ease: "linear" }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center justify-center bg-white/10 backdrop-blur-xl border border-white/30 rounded-3xl p-10 sm:p-16 text-center max-w-lg w-full mx-4 shadow-lg hover:shadow-2xl transition-all"
      >
        <h1 className="text-5xl sm:text-6xl font-extrabold text-white mb-6 drop-shadow-xl tracking-tight">
          Rent a Mate
        </h1>
        <p className="text-white/90 text-lg sm:text-xl mb-10">
          Connect with amazing mates and book your perfect companion anytime, anywhere.
        </p>

        <div className="flex gap-4">
          <button
            onClick={() => setShowSignUp(true)}
            className="px-8 py-4 bg-white/30 text-white font-semibold rounded-xl shadow-lg hover:bg-white/50 hover:scale-105 transition-transform duration-300"
          >
            Sign Up
          </button>
          <button
            onClick={() => setShowLogin(true)}
            className="px-8 py-4 bg-white/30 text-white font-semibold rounded-xl shadow-lg hover:bg-white/50 hover:scale-105 transition-transform duration-300"
          >
            Log In
          </button>
        </div>
      </motion.div>

      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full opacity-70"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{ y: [0, -15, 0], x: [0, 15, 0], opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 4 + i, delay: i }}
          />
        ))}
      </div>

      <AnimatePresence>
        {showLogin && (
          <>
            <motion.div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm z-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLogin(false)}
            />
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-y-1/2 w-full sm:w-96 bg-white/30 backdrop-blur-[1px] z-30 shadow-2xl rounded-2xl p-6"
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: "-50%", opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ type: "spring", stiffness: 120, damping: 20 }}
            >
              <Login compact onClose={() => setShowLogin(false)} />
            </motion.div>
          </>
        )}

        {showSignUp && (
          <>
            <motion.div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm z-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSignUp(false)}
            />
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-y-1/2 w-full sm:w-96 bg-white/30 backdrop-blur-[1px] z-30 shadow-2xl rounded-2xl p-6"
              initial={{ x: "-100%", opacity: 0 }}
              animate={{ x: "-50%", opacity: 1 }}
              exit={{ x: "-100%", opacity: 0 }}
              transition={{ type: "spring", stiffness: 120, damping: 20 }}
            >
              <SignUp compact onClose={() => setShowSignUp(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

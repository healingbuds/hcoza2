import { useState } from "react";
import { ArrowRight, Loader2, Check, Sprout } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const WaitlistCTA = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes("@")) {
      setStatus("error");
      setErrorMessage("Please enter a valid email address");
      return;
    }

    setStatus("loading");
    
    // Simulate API call - replace with actual waitlist API
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    setStatus("success");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (status === "error") {
      setStatus("idle");
      setErrorMessage("");
    }
  };

  return (
    <section className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-lg mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="rounded-3xl border p-6 sm:p-8 md:p-10"
          style={{
            backgroundColor: "#11302C",
            borderColor: "#1F4D47",
          }}
        >
          <AnimatePresence mode="wait">
            {status === "success" ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex flex-col items-center justify-center py-4 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center mb-4">
                  <Sprout className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold text-white mb-2">
                  You're planted! 🌱
                </h3>
                <p className="text-white/60 text-sm">
                  We'll notify you when we launch.
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <h3 className="text-xl sm:text-2xl font-semibold text-white text-center mb-2">
                  Join the Healing Buds Pre-launch
                </h3>
                <p className="text-white/60 text-sm text-center mb-6">
                  Be the first to know when we open registrations.
                </p>

                <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-0 sm:flex sm:gap-3">
                  <div className="flex-1 relative">
                    <input
                      type="email"
                      value={email}
                      onChange={handleInputChange}
                      placeholder="Enter your email"
                      required
                      aria-label="Email address"
                      aria-invalid={status === "error"}
                      className={cn(
                        "w-full px-5 py-4 rounded-full text-white placeholder:text-white/40",
                        "focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all duration-300",
                        status === "error"
                          ? "border-red-500/50 ring-1 ring-red-500/30"
                          : "border-[#1F4D47]"
                      )}
                      style={{
                        backgroundColor: "#0F3935",
                        borderWidth: "1px",
                        borderColor: status === "error" ? undefined : "#1F4D47",
                      }}
                    />
                    {status === "error" && errorMessage && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-400 text-xs mt-2 ml-4 absolute"
                      >
                        {errorMessage}
                      </motion.p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={status === "loading"}
                    aria-busy={status === "loading"}
                    className={cn(
                      "w-full sm:w-auto sm:min-w-[160px] px-6 py-4 rounded-full font-semibold text-white",
                      "bg-gradient-to-r from-emerald-400 to-teal-500",
                      "hover:from-emerald-500 hover:to-teal-600",
                      "shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30",
                      "transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]",
                      "disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100",
                      "flex items-center justify-center gap-2"
                    )}
                  >
                    {status === "loading" ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Joining...</span>
                      </>
                    ) : (
                      <>
                        <span>Join Waitlist</span>
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </form>

                <p className="text-white/40 text-xs text-center mt-4 flex items-center justify-center gap-1">
                  <Check className="w-3 h-3" />
                  We respect your privacy. No spam, ever.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

export default WaitlistCTA;

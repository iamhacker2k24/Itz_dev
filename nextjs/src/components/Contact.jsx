"use client";

import React, { useState } from "react";
import emailjs from "@emailjs/browser";
import {
  Mail,
  Send,
  User,
  MessageSquare,
  Loader2,
  CheckCircle2,
  XCircle,
} from "lucide-react";

/* ENV with Next.js and fallback support */
const tempOne = process.env.NEXT_PUBLIC_TEMP_ONE || "template_v7eqpcy";
const tempTwo = process.env.NEXT_PUBLIC_TEMP_TWO || "template_wu2xe9n";
const serviceOne = process.env.NEXT_PUBLIC_SERVCES_ONE || "service_jd4ktpq";
const serviceTwo = process.env.NEXT_PUBLIC_SERVCES_TWO || "service_jd4ktpq";

function Contact() {
  const [loading, setLoading] = useState(false);

  const [toast, setToast] = useState({
    show: false,
    type: "",
    message: "",
  });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  /* INPUT */
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  /* SHOW TOAST */
  const showToast = (type, message) => {
    setToast({
      show: true,
      type,
      message,
    });

    setTimeout(() => {
      setToast({
        show: false,
        type: "",
        message: "",
      });
    }, 3000);
  };

  /* SUBMIT */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      /* SEND TO YOU */
      await emailjs.send(
        serviceOne,
        tempOne,
        {
          from_name: formData.name,
          from_email: formData.email,
          message: formData.message,
        },
        "wkJCuBsMxji_ZiOwQ"
      );

      /* AUTO REPLY */
      await emailjs.send(
        serviceTwo,
        tempTwo,
        {
          from_name: formData.name,
          from_email: formData.email,
          message: formData.message,
        },
        "wkJCuBsMxji_ZiOwQ"
      );

      /* SUCCESS */
      showToast("success", "Message Sent Successfully!");

      /* RESET */
      setFormData({
        name: "",
        email: "",
        message: "",
      });
    } catch (error) {
      console.error(error);
      /* ERROR */
      showToast("error", "Failed To Send Message");
    }

    setLoading(false);
  };

  return (
    <section
      id="contact"
      className="relative overflow-hidden px-4 sm:px-6 lg:px-8 py-14 sm:py-24 bg-white dark:bg-[#0a0a0a] transition-colors duration-400"
    >
      {/* TOAST */}
      {toast.show && (
        <div
          className={`fixed top-4 inset-x-4 sm:inset-x-auto sm:right-6 sm:top-6 z-[9999] sm:max-w-md flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl backdrop-blur-xl border animate-[slideIn_0.4s_ease] ${
            toast.type === "success"
              ? "bg-green-500/10 border-green-500/20 text-green-500"
              : "bg-red-500/10 border-red-500/20 text-red-500"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle2 size={22} className="shrink-0" />
          ) : (
            <XCircle size={22} className="shrink-0" />
          )}
          <p className="font-medium text-sm sm:text-base">{toast.message}</p>
        </div>
      )}

      {/* BACKGROUND GLOW */}
      <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-72 h-72 sm:w-96 sm:h-96 bg-orange-500/15 blur-[100px] rounded-full"></div>
        <div className="absolute bottom-0 right-0 w-72 h-72 sm:w-96 sm:h-96 bg-orange-400/10 blur-[100px] rounded-full"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* HEADING */}
        <div className="text-center mb-10 sm:mb-14">
          <p className="text-orange-500 font-semibold tracking-[0.25em] text-xs sm:text-sm uppercase mb-3">
            Get In Touch
          </p>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white">
            Let’s Connect
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-4 sm:mt-5 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            Let’s collaborate to build modern websites, AI projects and IoT solutions together.
          </p>
        </div>

        {/* GRID */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* LEFT DECORATION (DESKTOP) */}
          <div className="hidden lg:flex justify-center items-center">
            <div className="relative w-80 h-80">
              <div className="absolute inset-0 rounded-full border-4 border-orange-500/20 animate-pulse"></div>
              <div className="absolute inset-8 rounded-full border-2 border-orange-500/40 flex items-center justify-center bg-white dark:bg-[#121214] shadow-2xl">
                <div className="text-center p-6">
                  <div className="w-20 h-20 rounded-3xl bg-orange-500/10 text-orange-500 flex items-center justify-center mx-auto mb-4 shadow-sm">
                    <Mail size={40} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                    Say Hello!
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Always open to exciting opportunities & ideas
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* FORM */}
          <form
            onSubmit={handleSubmit}
            className="bg-[#fafafa] dark:bg-[#121214] border border-black/10 dark:border-white/10 rounded-3xl p-5 sm:p-8 lg:p-10 shadow-xl space-y-5"
          >
            {/* NAME */}
            <div>
              <label className="block mb-2 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                Your Name
              </label>
              <div className="flex items-center bg-white dark:bg-[#1a1a1c] border border-black/10 dark:border-white/10 rounded-xl px-4 focus-within:ring-2 focus-within:ring-orange-500 transition-all">
                <User size={18} className="text-orange-500 shrink-0" />
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full bg-transparent outline-none px-3 py-3.5 sm:py-4 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-sm"
                />
              </div>
            </div>

            {/* EMAIL */}
            <div>
              <label className="block mb-2 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                Email Address
              </label>
              <div className="flex items-center bg-white dark:bg-[#1a1a1c] border border-black/10 dark:border-white/10 rounded-xl px-4 focus-within:ring-2 focus-within:ring-orange-500 transition-all">
                <Mail size={18} className="text-orange-500 shrink-0" />
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-transparent outline-none px-3 py-3.5 sm:py-4 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-sm"
                />
              </div>
            </div>

            {/* MESSAGE */}
            <div>
              <label className="block mb-2 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                Message
              </label>
              <div className="flex bg-white dark:bg-[#1a1a1c] border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-orange-500 transition-all">
                <MessageSquare size={18} className="text-orange-500 mt-1 shrink-0" />
                <textarea
                  name="message"
                  rows="4"
                  placeholder="Write your message..."
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="w-full bg-transparent outline-none px-3 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-sm resize-none"
                ></textarea>
              </div>
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:opacity-95 disabled:opacity-70 transition-all duration-300 py-3.5 sm:py-4 rounded-xl font-semibold flex items-center justify-center gap-2 text-white shadow-lg shadow-orange-500/20 active:scale-[0.99] cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  <span>Sending Message...</span>
                </>
              ) : (
                <>
                  <Send size={18} />
                  <span>Send Message</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Contact;

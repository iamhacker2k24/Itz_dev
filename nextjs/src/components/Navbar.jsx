"use client";

import React, { useEffect, useState, useRef } from "react";
import { Moon, Sun, Home, User, Wrench, FolderGit2, Mail, ChevronRight, Sparkles } from "lucide-react";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const themeBtnRef = useRef(null);

  const [darkMode, setDarkMode] = useState(false);

  // Initialize theme on client mount to match localStorage / system preference without hydration mismatch
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme) {
        setDarkMode(savedTheme === "dark");
      } else {
        setDarkMode(window.matchMedia("(prefers-color-scheme: dark)").matches);
      }
    }
  }, []);

  // Sync state with DOM and localStorage
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  // Sync with OS theme changes if user hasn't explicitly set a preference
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e) => {
      const savedTheme = localStorage.getItem("theme");
      if (!savedTheme) {
        setDarkMode(e.matches);
      }
    };
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Close mobile menu on Escape key or window resize
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    const handleResize = () => {
      if (window.innerWidth >= 1024) setMenuOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Corner-to-corner circular ripple theme toggle
  const toggleTheme = (e) => {
    const nextMode = !darkMode;

    // Check if View Transition API is supported
    if (!document.startViewTransition) {
      setDarkMode(nextMode);
      return;
    }

    // Get origin coordinates from button or mouse click
    const rect = themeBtnRef.current?.getBoundingClientRect();
    const x = rect ? rect.left + rect.width / 2 : (e?.clientX ?? window.innerWidth);
    const y = rect ? rect.top + rect.height / 2 : (e?.clientY ?? 0);

    // Calculate maximum distance to the furthest screen corner
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    const transition = document.startViewTransition(() => {
      setDarkMode(nextMode);
      const root = document.documentElement;
      if (nextMode) {
        root.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        root.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
    });

    transition.ready.then(() => {
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${endRadius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: 550,
          easing: "cubic-bezier(0.4, 0, 0.2, 1)",
          pseudoElement: "::view-transition-new(root)",
        }
      );
    });
  };

  const navLinks = [
    { name: "Home", id: "#home", icon: Home },
    { name: "About", id: "#about", icon: User },
    { name: "Services", id: "#services", icon: Wrench },
    { name: "Projects", id: "#projects", icon: FolderGit2 },
    { name: "Contact", id: "#contact", icon: Mail },
  ];

  return (
    <>
      <nav className="sticky top-0 z-50 w-full backdrop-blur-xl bg-white/80 dark:bg-[#0a0a0a]/80 border-b border-black/10 dark:border-white/10 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-[68px] flex items-center justify-between">
          {/* LOGO */}
          <a
            href="#home"
            className="text-2xl sm:text-2xl font-extrabold tracking-tight bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 bg-clip-text text-transparent hover:opacity-90 transition cursor-pointer"
          >
            Debabrata<span className="text-orange-500">.</span>
          </a>

          {/* DESKTOP MENU */}
          <ul className="hidden lg:flex items-center gap-8">
            {navLinks.map((item, index) => (
              <li key={index}>
                <a
                  href={item.id}
                  className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-orange-500 dark:hover:text-orange-400 transition-colors py-1.5"
                >
                  {item.name}
                </a>
              </li>
            ))}
          </ul>

          {/* RIGHT SIDE ACTIONS */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* THEME TOGGLE BUTTON */}
            <button
              ref={themeBtnRef}
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-gray-100 dark:bg-zinc-800/90 text-gray-700 dark:text-yellow-400 hover:bg-orange-50 dark:hover:bg-zinc-700/80 active:scale-95 transition-all duration-300 shadow-sm border border-black/5 dark:border-white/10 relative overflow-hidden cursor-pointer"
              aria-label={darkMode ? "Switch to day mode" : "Switch to night mode"}
              title={darkMode ? "Switch to day mode" : "Switch to night mode"}
            >
              <div className="relative w-5 h-5 flex items-center justify-center">
                <Sun
                  className={`w-5 h-5 absolute inset-0 transition-all duration-500 text-yellow-400 ${
                    darkMode ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"
                  }`}
                />
                <Moon
                  className={`w-5 h-5 absolute inset-0 transition-all duration-500 text-orange-500 ${
                    darkMode ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"
                  }`}
                />
              </div>
            </button>

            {/* ANIMATED HAMBURGER MENU BUTTON */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden w-10 h-10 rounded-xl bg-orange-500 hover:bg-orange-600 text-white active:scale-95 transition-all duration-300 shadow-md shadow-orange-500/20 flex flex-col items-center justify-center gap-1.25 cursor-pointer relative focus:outline-none"
              aria-label="Toggle navigation menu"
              aria-expanded={menuOpen}
            >
              <span
                className={`w-5 h-0.5 bg-white rounded-full transition-all duration-300 transform origin-center ${
                  menuOpen ? "rotate-45 translate-y-[7px]" : ""
                }`}
              />
              <span
                className={`w-5 h-0.5 bg-white rounded-full transition-all duration-200 ${
                  menuOpen ? "opacity-0 scale-x-0" : "opacity-100"
                }`}
              />
              <span
                className={`w-5 h-0.5 bg-white rounded-full transition-all duration-300 transform origin-center ${
                  menuOpen ? "-rotate-45 -translate-y-[7px]" : ""
                }`}
              />
            </button>
          </div>
        </div>

        {/* MOBILE MENU DROPDOWN (Premium Floating Island Layout) */}
        <div
          className={`lg:hidden absolute top-full left-0 right-0 w-full transition-all duration-300 ease-out origin-top z-50 px-4 pt-3 pb-6 ${
            menuOpen
              ? "opacity-100 translate-y-0 pointer-events-auto visible"
              : "opacity-0 -translate-y-2 pointer-events-none invisible"
          }`}
        >
          <div className="max-w-md mx-auto bg-white/95 dark:bg-[#121215]/95 backdrop-blur-2xl rounded-3xl border border-black/10 dark:border-white/10 shadow-2xl p-3 sm:p-4 space-y-1">
            {navLinks.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <a
                  key={index}
                  href={item.id}
                  onClick={() => setMenuOpen(false)}
                  className="group flex items-center justify-between w-full px-3.5 py-3 rounded-2xl text-base font-semibold text-gray-800 dark:text-gray-200 hover:text-orange-500 dark:hover:text-orange-400 hover:bg-orange-500/10 dark:hover:bg-orange-500/10 active:scale-[0.99] transition-all"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center shrink-0 group-hover:bg-orange-500 group-hover:text-white transition-all duration-300 shadow-sm">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <span className="tracking-wide text-gray-800 dark:text-gray-100 group-hover:text-orange-500 dark:group-hover:text-orange-400 transition-colors">
                      {item.name}
                    </span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-orange-500 group-hover:translate-x-1 transition-all duration-200" />
                </a>
              );
            })}

            {/* QUICK ACTION BUTTON */}
            <div className="pt-2 border-t border-black/5 dark:border-white/10 mt-1">
              <a
                href="#contact"
                onClick={() => setMenuOpen(false)}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25 active:scale-[0.98] transition-all text-sm tracking-wide"
              >
                <Sparkles className="w-4 h-4" />
                <span>Get In Touch</span>
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* MOBILE MENU BACKDROP */}
      <div
        onClick={() => setMenuOpen(false)}
        className={`lg:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-xs transition-opacity duration-300 ${
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />
    </>
  );
};

export default Navbar;

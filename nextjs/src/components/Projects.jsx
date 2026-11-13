"use client";

import React, { useEffect, useMemo, useState } from "react";
import projects from "../data/projects.json";

import {
  Globe,
  Smartphone,
  Cpu,
  Palette,
  Bot,
  ExternalLink,
  Play,
} from "lucide-react";
import { FaGithub } from "react-icons/fa";

const categoryIcons = {
  website: <Globe size={18} />,
  app: <Smartphone size={18} />,
  iot: <Cpu size={18} />,
  uiux: <Palette size={18} />,
  genai: <Bot size={18} />,
};

const filterTabs = [
  { label: "All", value: "ALL" },
  { label: "Websites", value: "website" },
  { label: "Mobile Apps", value: "app" },
  { label: "IoT Systems", value: "iot" },
  { label: "UI / UX", value: "uiux" },
  { label: "Gen AI", value: "genai" },
];

const Projects = () => {
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [visibleCount, setVisibleCount] = useState(4);
  const [isExpanded, setIsExpanded] = useState(false);

  /* RESPONSIVE INITIAL COUNT */
  useEffect(() => {
    const updateCount = () => {
      if (!isExpanded) {
        if (window.innerWidth < 640) {
          setVisibleCount(2);
        } else if (window.innerWidth < 1280) {
          setVisibleCount(4);
        } else {
          setVisibleCount(projects.length);
        }
      }
    };

    updateCount();
    window.addEventListener("resize", updateCount);
    return () => window.removeEventListener("resize", updateCount);
  }, [isExpanded]);

  /* FILTERED PROJECTS */
  const filteredProjects = useMemo(() => {
    if (activeFilter === "ALL") {
      return projects;
    }
    return projects.filter(
      (project) => project.type.toLowerCase() === activeFilter.toLowerCase()
    );
  }, [activeFilter]);

  /* RESET FILTER */
  useEffect(() => {
    setIsExpanded(false);
    if (typeof window !== "undefined") {
      if (window.innerWidth < 640) {
        setVisibleCount(2);
      } else if (window.innerWidth < 1280) {
        setVisibleCount(4);
      } else {
        setVisibleCount(projects.length);
      }
    }
  }, [activeFilter]);

  return (
    <section
      id="projects"
      className="relative overflow-hidden py-14 sm:py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-[#0a0a0a] transition-colors duration-400"
    >
      {/* BACKGROUND GLOW */}
      <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-72 h-72 sm:w-96 sm:h-96 md:w-[500px] md:h-[500px] bg-orange-400/10 blur-[100px] rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 sm:w-80 sm:h-80 bg-amber-300/10 blur-[90px] rounded-full"></div>
        <div className="absolute top-40 right-0 w-64 h-64 sm:w-80 sm:h-80 bg-yellow-300/10 blur-[90px] rounded-full"></div>
      </div>

      <div className="max-w-[1700px] mx-auto">
        {/* HEADING */}
        <div className="text-center max-w-3xl mx-auto">
          <p className="text-orange-500 font-semibold tracking-[0.25em] text-xs sm:text-sm uppercase mb-3">
            My Projects
          </p>

          <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white">
            Featured Works & Creations
          </h2>

          <p className="text-gray-600 dark:text-gray-400 mt-4 sm:mt-6 text-sm sm:text-base leading-relaxed">
            Modern websites, AI tools, IoT systems, mobile apps and UI/UX experiences.
          </p>
        </div>

        {/* FILTERS */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mt-8 sm:mt-10 mb-10 sm:mb-14">
          {filterTabs.map((item, index) => (
            <button
              key={index}
              onClick={() => setActiveFilter(item.value)}
              className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-2xl text-xs sm:text-sm font-medium border transition-all duration-300 active:scale-95 cursor-pointer ${
                activeFilter === item.value
                  ? "bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-500/20"
                  : "border-black/10 dark:border-white/10 bg-[#fafafa] dark:bg-[#121214] text-gray-700 dark:text-gray-300 hover:border-orange-500/40"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* PROJECT GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-6 sm:gap-7">
          {filteredProjects
            .slice(0, visibleCount)
            .map((project, index) => (
              <div
                key={index}
                className="relative overflow-hidden rounded-[26px] border border-black/10 dark:border-white/10 bg-white dark:bg-[#121214] shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:border-orange-500/40 flex flex-col group"
              >
                {/* VIDEO / IMAGE */}
                <div className="relative overflow-hidden bg-gray-100 dark:bg-zinc-800">
                  {project.video ? (
                    <iframe
                      src={`${project.video}?autoplay=1&mute=1&loop=1`}
                      title={project.title}
                      loading="lazy"
                      allow="autoplay"
                      className="w-full h-[200px] sm:h-[220px] border-0"
                    ></iframe>
                  ) : (
                    <img
                      src={project.image}
                      alt={project.title}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-[200px] sm:h-[220px] object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  )}

                  {/* CATEGORY BADGE */}
                  <div className="absolute top-3.5 left-3.5 flex items-center gap-1.5 bg-black/70 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-xs font-medium">
                    {categoryIcons[project.type]}
                    <span className="capitalize">{project.type}</span>
                  </div>

                  {/* PLAY ICON */}
                  {project.video && (
                    <div className="absolute bottom-3.5 right-3.5 w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white shadow-lg">
                      <Play size={16} />
                    </div>
                  )}
                </div>

                {/* CONTENT */}
                <div className="p-5 sm:p-6 flex flex-col flex-1">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2.5">
                    {project.title}
                  </h3>

                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed flex-1">
                    {project.description}
                  </p>

                  {/* ACTION BUTTONS */}
                  <div className="flex items-center gap-3 mt-6 pt-4 border-t border-black/5 dark:border-white/5">
                    {/* GITHUB */}
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`View GitHub repository for ${project.title}`}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 sm:py-3 rounded-xl border border-black/10 dark:border-white/10 bg-gray-50 dark:bg-zinc-800/80 text-gray-800 dark:text-white hover:bg-orange-500 hover:text-white dark:hover:bg-orange-500 hover:border-orange-500 transition-all duration-300 text-xs sm:text-sm font-semibold active:scale-95"
                    >
                      <FaGithub size={16} />
                      <span>Code</span>
                    </a>

                    {/* DEMO */}
                    <a
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`View live demo for ${project.title}`}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:opacity-95 shadow-md shadow-orange-500/20 transition-all duration-300 text-xs sm:text-sm font-semibold active:scale-95"
                    >
                      <ExternalLink size={16} />
                      <span>Demo</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
        </div>

        {/* LOAD MORE */}
        {!isExpanded && visibleCount < filteredProjects.length && (
          <div className="flex justify-center mt-12 sm:mt-16">
            <button
              onClick={() => {
                setVisibleCount(filteredProjects.length);
                setIsExpanded(true);
              }}
              className="px-8 py-3.5 sm:py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold shadow-lg shadow-orange-500/20 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
            >
              Load More Projects ({filteredProjects.length - visibleCount} more)
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Projects;

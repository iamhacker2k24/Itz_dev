import React, { useEffect, useState } from "react";
import daraData from "../data/data.json";

import { Globe, MonitorSmartphone, Cpu, Bot } from "lucide-react";

const iconMap = {
  Globe: <Globe size={28} />,
  MonitorSmartphone: <MonitorSmartphone size={28} />,
  Cpu: <Cpu size={28} />,
  Bot: <Bot size={28} />,
};

const About = () => {
  const skills = daraData.skills || [
    { name: "MERN Stack", percent: 90, icon: "Globe" },
    { name: "UI / UX", percent: 85, icon: "MonitorSmartphone" },
    { name: "IoT", percent: 80, icon: "Cpu" },
    { name: "Gen AI", percent: 75, icon: "Bot" },
  ];

  const [progress, setProgress] = useState(skills.map(() => 0));

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) =>
        prev.map((value, index) => {
          if (value < skills[index].percent) {
            return value + 1;
          }
          return value;
        }),
      );
    }, 20);

    return () => clearInterval(interval);
  }, [skills]);

  return (
    <section
      id="about"
      className="relative overflow-hidden py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-[#0a0a0a] transition-colors duration-400"
    >
      {/* BACKGROUND GLOW */}
      <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-72 sm:w-96 sm:h-96 md:w-[500px] md:h-[500px] bg-orange-400/10 blur-[100px] rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 sm:w-80 sm:h-80 bg-amber-300/10 blur-[90px] rounded-full"></div>
        <div className="absolute top-40 right-0 w-64 h-64 sm:w-80 sm:h-80 bg-yellow-300/10 blur-[90px] rounded-full"></div>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* CENTERED HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <p className="text-orange-500 font-semibold tracking-[0.25em] text-xs sm:text-sm uppercase mb-3">
            About Me
          </p>

          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold leading-tight text-gray-900 dark:text-white mb-4 sm:mb-6">
            Skills And Tools <br className="hidden sm:inline" />
            <span className="text-orange-500">That I Master</span>
          </h2>

          <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base lg:text-lg leading-relaxed max-w-2xl mx-auto">
            Passionate about building modern web applications, intelligent AI
            systems, responsive UI/UX designs, and innovative IoT-based
            solutions.
            <br />I enjoy creating scalable digital experiences with modern
            technologies and user-focused design principles.
          </p>
        </div>

        {/* CENTERED SKILLS GRID */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 sm:gap-8 max-w-5xl mx-auto place-items-center">
          {skills.map((skill, index) => {
            const Icon = iconMap[skill.icon] || <Globe size={28} />;
            return (
              <div
                key={index}
                className="relative w-36 h-36 sm:w-44 sm:h-44 lg:w-48 lg:h-48 flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-300 group"
              >
                {/* PROGRESS RING */}
                <div
                  className="absolute inset-0 rounded-full transition-all duration-500 shadow-md"
                  style={{
                    background: `conic-gradient(
                      #f97316 ${progress[index] * 3.6}deg,
                      rgba(160, 160, 160, 0.15) 0deg
                    )`,
                  }}
                ></div>

                {/* GLOW */}
                <div className="absolute w-full h-full rounded-full bg-orange-500/10 blur-xl group-hover:bg-orange-500/20 transition-all"></div>

                {/* INNER CIRCLE */}
                <div className="relative z-10 w-28 h-28 sm:w-34 sm:h-34 lg:w-38 lg:h-38 rounded-full bg-white dark:bg-[#121214] border border-black/10 dark:border-white/10 flex flex-col items-center justify-center shadow-lg transition-colors p-2">
                  {/* ICON */}
                  <div className="text-orange-500 mb-1 transform group-hover:scale-110 transition-transform">
                    {Icon}
                  </div>

                  {/* TITLE */}
                  <h3 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white text-center leading-tight">
                    {skill.name}
                  </h3>

                  {/* PERCENT */}
                  <span className="text-orange-500 text-xs sm:text-sm font-extrabold mt-0.5">
                    {progress[index]}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default About;

import React from "react";
import daraData from "../data/data.json";

import { Globe, Smartphone, Cpu, Palette } from "lucide-react";

const iconMap = {
  Globe: <Globe size={28} />,
  Smartphone: <Smartphone size={28} />,
  Cpu: <Cpu size={28} />,
  Palette: <Palette size={28} />,
};

const Services = () => {
  const services = daraData.services || [];
  return (
    <section
      id="services"
      className="relative overflow-hidden py-14 sm:py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-[#0a0a0a] transition-colors duration-400"
    >
      {/* BACKGROUND */}
      <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-72 sm:w-96 sm:h-96 md:w-[500px] md:h-[500px] bg-orange-400/10 blur-[100px] rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 sm:w-80 sm:h-80 bg-amber-300/10 blur-[90px] rounded-full"></div>
        <div className="absolute top-40 right-0 w-64 h-64 sm:w-80 sm:h-80 bg-yellow-300/10 blur-[90px] rounded-full"></div>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* HEADING */}
        <div className="text-center max-w-3xl mx-auto">
          <p className="text-orange-500 font-semibold tracking-[0.25em] text-xs sm:text-sm uppercase mb-3">
            My Services
          </p>

          <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white">
            What I Can Build
          </h2>

          <p className="text-gray-600 dark:text-gray-400 mt-4 sm:mt-6 text-sm sm:text-base leading-relaxed">
            Modern websites, mobile apps, IoT systems, and UI/UX experiences
            with clean and responsive designs.
          </p>
        </div>

        {/* SERVICES GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-7 mt-10 sm:mt-14">
          {services.map((service, index) => (
            <div
              key={index}
              className="relative overflow-hidden rounded-3xl border border-black/10 dark:border-white/10 bg-[#fafafa] dark:bg-[#121214] p-6 sm:p-6 lg:p-8 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 hover:border-orange-500/40 active:scale-[0.99] group"
            >
              {/* HOVER GLOW */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-orange-400/10 via-amber-400/5 to-transparent pointer-events-none"></div>

              {/* TOP GLOW */}
              <div className="absolute -top-10 -right-10 w-28 h-28 bg-orange-500/10 blur-2xl rounded-full pointer-events-none"></div>

              {/* CONTENT */}
              <div className="relative z-10 flex flex-col items-center sm:items-start text-center sm:text-left">
                {/* ICON */}
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center text-white mb-4 sm:mb-5 shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform duration-300">
                  {iconMap[service.icon] || <Globe size={28} />}
                </div>

                {/* TITLE */}
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {service.title}
                </h3>

                {/* DESCRIPTION */}
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  {service.description}
                </p>
              </div>

              {/* BOTTOM ACCENT LINE */}
              <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-orange-500 via-amber-400 to-yellow-400 group-hover:w-full transition-all duration-500"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;

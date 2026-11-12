function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="border-t border-black/10 dark:border-white/10 py-8 px-4 sm:px-6 lg:px-8 text-center text-xs sm:text-sm text-gray-500 dark:text-gray-400 bg-white dark:bg-[#0a0a0a] transition-colors duration-400">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <p>
          &copy; {currentYear} <span className="text-orange-500 font-semibold">Debabrata Paul</span>. All rights reserved.
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500">
          Built with React & Tailwind CSS
        </p>
      </div>
    </footer>
  );
}

export default Footer;
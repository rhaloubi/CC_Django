import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import DarkLogo from "@/assets/svg/MORATEL11.svg"
import LightLogo from "@/assets/svg/MORATEL1.svg";
import { useTheme } from "@/components/theme-provider"; // Assuming you have a theme provider

export const Navbar = () => {
  const { theme } = useTheme(); // Get the current theme

  return (
    <nav className="w-full backdrop-blur fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Name */}
          <div className="flex-shrink-0">
            <Link to="/">
              <img
                src={theme === "dark" ? DarkLogo : LightLogo}
                alt="Moratel Logo"
                className="h-[200px] w-auto"
              />
            </Link>
          </div>

          

          {/* Right side buttons */}
          <div className="hidden md:flex items-center bg-white dark:bg-gray-950 text-xs font-medium backdrop-blur-3xl space-x-4">
            <Link
              variant="ghost"
              to="/login"
              className="inline-flex rounded-full text-center group items-center w-full justify-center bg-gradient-to-tr from-zinc-300/20 via-purple-400/30 to-transparent dark:from-zinc-300/5 dark:via-purple-400/20 text-gray-900 dark:text-white border-input border-[1px] hover:bg-gradient-to-tr hover:from-zinc-300/30 hover:via-purple-400/40 hover:to-transparent dark:hover:from-zinc-300/10 dark:hover:via-purple-400/30 transition-all sm:w-auto py-4 px-10"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" className="text-foreground">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
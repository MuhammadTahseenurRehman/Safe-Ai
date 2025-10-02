import { useState } from 'react';
import { User, Settings, LogOut, CreditCard } from 'lucide-react';
import { Button } from './ui/button';
import { Typography } from './ui/typography';
import { useTheme } from '../hooks/useTheme';
import DarkLightSwitch from './ui/dark-light-switch';

export default function Navbar() {
  const [showUserMenu, setShowUserMenu] = useState<boolean>(false);
  const { theme } = useTheme();

  return (
    <header className="flex items-center justify-between gap-2 md:gap-0 md:grid md:grid-cols-3 bg-background px-4 md:px-8 py-4 border-b border-border">
      {/* Left Section - Logo */}
      <div className="flex items-center space-x-3">
        <div className="relative">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
            <div className="w-6 h-6 bg-white rounded-sm"></div>
          </div>
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></div>
        </div>
        <div>
          <Typography variant="h4" weight="semibold" className="text-foreground">
            SAFEST AI
          </Typography>
          <Typography variant="p3" className="text-muted-foreground">
            Privacy-first AI assistant
          </Typography>
        </div>
      </div>

      {/* Middle Section - Guest Mode */}
      <div className="flex items-center justify-center">
        <div className="border-[#5C39E3] border-2 bg-transparent rounded-[10px] px-4 py-2">
          <Typography variant="h4" weight="semibold" className="text-sm md:text-xl text-primary">
            Guest Mode
          </Typography>
        </div>
      </div>

      {/* Right Section - Controls */}
      <div className="flex items-center gap-2 md:gap-4 justify-end">
        {/* Dark Mode Toggle */}
        <div className="flex items-center gap-2">
              <Typography variant="p3" className="hidden sm:block text-[10px] text-muted-foreground">
                {theme === "dark" ? "Dark Mode" : "Light Mode"}
              </Typography>
          <DarkLightSwitch />
        </div>

        {/* User Avatar with Dropdown */}
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="w-[50px] h-[50px] rounded-full border border-[#5C39E3] hover:opacity-80 transition-opacity"
          >
            <div className="w-full h-full bg-gradient-to-r dark:from-[#ffffff31] dark:to-[#FFFFFF29] from-[#5b39e325] to-[#b43fbf40] rounded-full flex items-center justify-center">
              <Typography
                variant="h3"
                weight="semibold"
                className="dark:text-white text-black"
              >
                G
              </Typography>
            </div>
          </Button>

          {/* User Menu Dropdown */}
          {showUserMenu && (
            <div className="absolute right-0 top-full mt-2 w-64 bg-gradient-to-r from-[#5C39E3]/40 to-[#B53FBF]/40 rounded-[23px] p-[3px] z-50">
              <div className="dark:bg-[#3f4041] bg-[#ffffff] border border-purple-500/20 rounded-[20px] px-2">
                {/* User Info Section */}
                <div className="p-2 border-b border-[#8692A6] mt-1">
                  <div className="flex items-center gap-3">
                    <User className="shrink-0 w-4 h-4 dark:text-white text-black" />
                    <Typography variant="p3" className="font-medium break-all">
                      Guest User
                    </Typography>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="py-2">
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 p-2 text-white hover:!bg-[#f0eded] dark:hover:!bg-[#585858] dark:focus:!bg-[#585858] focus:!bg-[#f0eded] cursor-pointer"
                    onClick={() => console.log("View Plan clicked")}
                  >
                    <CreditCard className="w-4 h-4 dark:text-white text-black" />
                    <Typography variant="p3">View Plan</Typography>
                  </Button>

                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 p-2 text-white hover:!bg-[#f0eded] dark:hover:!bg-[#585858] dark:focus:!bg-[#585858] focus:!bg-[#f0eded] cursor-pointer"
                    onClick={() => console.log("Manage Billing clicked")}
                  >
                    <CreditCard className="w-4 h-4 dark:text-white text-black" />
                    <div className="flex flex-col">
                      <Typography variant="p3">Manage Subscription</Typography>
                    </div>
                  </Button>

                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 p-2 text-white hover:!bg-[#f0eded] dark:hover:!bg-[#585858] dark:focus:!bg-[#585858] focus:!bg-[#f0eded] cursor-pointer"
                    onClick={() => console.log("Settings clicked")}
                  >
                    <Settings className="w-4 h-4 dark:text-white text-black" />
                    <Typography variant="p3">Settings</Typography>
                  </Button>

                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 p-2 text-white hover:!bg-[#f0eded] dark:hover:!bg-[#585858] dark:focus:!bg-[#585858] focus:!bg-[#f0eded] cursor-pointer"
                    onClick={() => console.log("Logout clicked")}
                  >
                    <LogOut className="w-4 h-4 dark:text-white text-black" />
                    <Typography variant="p3">Log Out</Typography>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

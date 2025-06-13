"use client";

import * as React from "react";
import { Smartphone, Download, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function MobileGreeting() {
  const [isVisible, setIsVisible] = React.useState(false);
  const [isDismissed, setIsDismissed] = React.useState(false);

  React.useEffect(() => {
    // Check if user is on mobile
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isSmallScreen = window.innerWidth < 768;

    // Check if greeting has been dismissed before
    const dismissedKey = 'mobile-greeting-dismissed';
    const wasDismissed = localStorage.getItem(dismissedKey) === 'true';

    if ((isMobile || isSmallScreen) && !wasDismissed) {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsDismissed(true);
    setIsVisible(false);
    localStorage.setItem('mobile-greeting-dismissed', 'true');
  };

  const handleInstallPWA = () => {
    // This will be handled by the browser's native PWA install prompt
    // The actual PWA install logic would be implemented in a separate hook
    alert('To install this app:\n\n1. Tap the share button in your browser\n2. Select "Add to Home Screen"\n3. Enjoy the native app experience!');
  };

  if (!isVisible || isDismissed) {
    return null;
  }

  return (
    <div className="mx-4 mb-6 md:hidden">
      <div className="bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-200 rounded-lg p-4 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <Smartphone className="h-6 w-6 text-rose-600 mt-0.5" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-rose-800 mb-2">
              Welcome to Period Tracker! 👋
            </h3>
            <p className="text-sm text-rose-700 mb-3 leading-relaxed">
              Get the best experience by installing this app on your device.
              Your data stays private and secure - everything is stored locally on your phone.
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                onClick={handleInstallPWA}
                size="sm"
                className="bg-rose-600 hover:bg-rose-700 text-white flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Install App
              </Button>
              <Button
                onClick={handleDismiss}
                variant="outline"
                size="sm"
                className="border-rose-300 text-rose-700 hover:bg-rose-50"
              >
                Maybe Later
              </Button>
            </div>
          </div>
          <Button
            onClick={handleDismiss}
            variant="ghost"
            size="sm"
            className="flex-shrink-0 h-8 w-8 p-0 text-rose-500 hover:text-rose-700 hover:bg-rose-100"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Dismiss</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

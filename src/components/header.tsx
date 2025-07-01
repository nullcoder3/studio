
"use client";

import * as React from 'react';
import Link from 'next/link';
import { Menu, Settings, TrainTrack, HardHat, BarChart2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

export function Header() {
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);

  const handleLinkClick = () => {
    setIsSheetOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 shadow-sm backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex items-center">
          <Link href="/" className="flex items-center space-x-2.5">
            <TrainTrack className="h-7 w-7 text-primary" />
            <span className="text-lg font-bold">CoachTrack</span>
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden flex-1 items-center space-x-1 justify-end md:flex">
          <Button variant="ghost" asChild>
            <Link href="/reports" className="flex items-center gap-2">
              <BarChart2 className="h-5 w-5" />
              Reports
            </Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/materials" className="flex items-center gap-2">
              <HardHat className="h-5 w-5" />
              Materials
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <Link href="/settings">
              <Settings className="h-5 w-5" />
              <span className="sr-only">Settings</span>
            </Link>
          </Button>
        </nav>

        {/* Mobile Navigation */}
        <div className="flex flex-1 justify-end md:hidden">
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader className="text-left border-b pb-4">
                <SheetTitle>
                  <Link href="/" onClick={handleLinkClick} className="flex items-center space-x-2">
                    <TrainTrack className="h-6 w-6 text-primary" />
                    <span className="font-bold">CoachTrack</span>
                  </Link>
                </SheetTitle>
                <SheetDescription className="sr-only">
                  Main navigation menu.
                </SheetDescription>
              </SheetHeader>
              <nav className="grid gap-4 py-6">
                 <Link
                  href="/reports"
                  onClick={handleLinkClick}
                  className="flex items-center gap-3 text-base font-medium text-muted-foreground hover:text-foreground"
                >
                  <BarChart2 className="h-5 w-5" />
                  Monthly Reports
                </Link>
                <Link
                  href="/materials"
                  onClick={handleLinkClick}
                  className="flex items-center gap-3 text-base font-medium text-muted-foreground hover:text-foreground"
                >
                  <HardHat className="h-5 w-5" />
                  Manage Materials
                </Link>
                <Link
                  href="/settings"
                  onClick={handleLinkClick}
                  className="flex items-center gap-3 text-base font-medium text-muted-foreground hover:text-foreground"
                >
                  <Settings className="h-5 w-5" />
                  Settings
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

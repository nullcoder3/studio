import Link from 'next/link';
import { Menu, Plus, Settings, TrainTrack, Wrench } from 'lucide-react';

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
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <TrainTrack className="h-6 w-6 text-primary" />
            <span className="font-bold font-headline">CoachTrack</span>
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden flex-1 items-center space-x-1 justify-end md:flex">
           <Button variant="ghost" asChild>
            <Link href="/add-coach">
              <Plus className="mr-2 h-4 w-4" />
              Add Coach
            </Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/add-material">
              <Wrench className="mr-2 h-4 w-4" />
              Add Material
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
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader className="text-left">
                <SheetTitle>
                  <Link href="/" className="flex items-center space-x-2">
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
                  href="/add-coach"
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
                >
                  <Plus className="h-5 w-5" />
                  Add Coach
                </Link>
                <Link
                  href="/add-material"
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
                >
                  <Wrench className="h-5 w-5" />
                  Add Material
                </Link>
                <Link
                  href="/settings"
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
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

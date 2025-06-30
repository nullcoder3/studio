import Link from 'next/link';
import { TrainTrack, Plus, Wrench, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
        <nav className="flex flex-1 items-center space-x-1 justify-end">
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
      </div>
    </header>
  );
}

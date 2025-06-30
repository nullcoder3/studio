import Link from 'next/link';
import { coaches } from '@/lib/data';
import { Card, CardContent } from '@/components/ui/card';

export default function Home() {
  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8 animate-fade-in-down">
        <h1 className="text-4xl font-bold tracking-tight text-primary font-headline">Active Coaches</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          A list of all coaches currently in service or under maintenance.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {coaches.map((coach, index) => (
          <Link href={`/coach/${coach.id}`} key={coach.id} className="group">
            <div
              className="animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <Card className="h-40 flex items-center justify-center transition-all duration-300 ease-in-out hover:shadow-lg hover:border-primary/50 hover:-translate-y-1">
                <CardContent className="p-0">
                  <span className="text-4xl font-extrabold tracking-wider text-foreground group-hover:text-primary transition-colors">
                    {coach.coachNumber}
                  </span>
                </CardContent>
              </Card>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

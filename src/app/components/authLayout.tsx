import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import {Button} from "@/app/components/ui/button";

interface AuthLayoutProps {
    children: React.ReactNode;
    title: string;
    subtitle: string;
    image: string;
}

export function AuthLayout({ children, title, subtitle, image }: AuthLayoutProps) {
    return (
        <div style={{maxHeight:'100vh'}} className="min-h-screen w-full lg:grid lg:grid-cols-2">
            {/* Visual Side (Hidden on Mobile) */}
            <div className="hidden bg-muted lg:block relative overflow-hidden">
                <div className="absolute inset-0 bg-primary/20 mix-blend-overlay z-10" />
                <img
                    src={image}
                    alt="Anime Event"
                    style={{maxHeight:'100vh'}}
                    className="h-full w-full object-cover grayscale transition-all duration-1000 hover:grayscale-0"
                />
                <div className="absolute bottom-10 left-10 z-20 text-white max-w-lg">
                    <blockquote className="space-y-2">
                        <p className="text-lg font-medium leading-relaxed">
                            &ldquo;The community here is unlike anything else. It's not just about watching anime; it's about belonging.&rdquo;
                        </p>
                        <footer className="text-sm opacity-80">— Anime.lk Volunteer</footer>
                    </blockquote>
                </div>
            </div>

            {/* Form Side */}
            <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-background relative">
                <div className="absolute top-8 left-8">
                    <Link href="/">
                        <Button variant="ghost" className="gap-2 pl-0 hover:bg-transparent hover:text-primary">
                            <ArrowLeft className="size-4" /> Back to Home
                        </Button>
                    </Link>
                </div>

                <div className="mx-auto grid w-full max-w-[350px] gap-6">
                    <div className="grid gap-2 text-center">
                        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
                        <p className="text-balance text-muted-foreground">
                            {subtitle}
                        </p>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
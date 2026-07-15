"use client";

import {
  ArrowRight,
  Building,
  Globe,
  Loader2,
  Lock,
  Mail,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { createDealerProfile } from "@/actions/dealer-actions";
import MinimalHeader from "@/components/MinimalHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUp } from "@/lib/auth-client";

export default function SignUp() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [website, setWebsite] = useState("");

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 1. Sign up the user via Better-Auth
      await signUp.email(
        {
          email,
          password,
          name,
          callbackURL: "/dealer-dashboard",
        },
        {
          onSuccess: async (ctx) => {
            const userId = ctx.data.user.id;
            // 2. Create the associated dealer profile
            const profileRes = await createDealerProfile({
              userId,
              companyName,
              website: website || undefined,
            });

            if (profileRes.success) {
              toast.success("Dealer account registered successfully!");
              router.push("/dealer-dashboard");
            } else {
              toast.error(
                profileRes.message || "Failed to create dealer profile",
              );
              setIsSubmitting(false);
            }
          },
          onError: (ctx) => {
            toast.error(ctx.error.message || "Sign up failed");
            setIsSubmitting(false);
          },
        },
      );
    } catch (_error) {
      toast.error("An unexpected error occurred");
      setIsSubmitting(false);
    }
  };

  const glassInputClasses =
    "bg-black/40 border-white/10 text-white placeholder:text-gray-600 focus-visible:ring-white/20 focus-visible:border-white/30 transition-all h-12";

  return (
    <main className="min-h-screen bg-black text-white flex flex-col relative overflow-hidden justify-center items-center py-12">
      {/* Dark background glow */}
      <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-blue-900/10 to-black z-0 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(30,30,30,0.5)_0%,rgba(0,0,0,1)_100%)] z-0 pointer-events-none" />

      <MinimalHeader />

      <div className="relative z-10 w-full max-w-md px-4 mt-8">
        <div className="text-center mb-6">
          <h2 className="font-sans text-3xl font-bold tracking-tight text-white mb-2">
            Partner Sign Up
          </h2>
          <p className="text-gray-400">
            Create your account to obtain your embed widget
          </p>
        </div>

        <Card className="bg-white/5 backdrop-blur-xl border-white/10 shadow-2xl rounded-[2rem] overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="sr-only">Dealer Registration</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="companyName" className="text-gray-400 text-xs">
                  Company Name
                </Label>
                <div className="relative">
                  <Building className="absolute left-4 top-3.5 h-5 w-5 text-gray-500" />
                  <Input
                    id="companyName"
                    required
                    placeholder="Elite Motors LLC"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className={`${glassInputClasses} pl-12`}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-400 text-xs">
                  Contact Name
                </Label>
                <div className="relative">
                  <User className="absolute left-4 top-3.5 h-5 w-5 text-gray-500" />
                  <Input
                    id="name"
                    required
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`${glassInputClasses} pl-12`}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-400 text-xs">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-3.5 h-5 w-5 text-gray-500" />
                  <Input
                    id="email"
                    type="email"
                    required
                    placeholder="dealer@showroom.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`${glassInputClasses} pl-12`}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="website" className="text-gray-400 text-xs">
                  Website URL (Optional)
                </Label>
                <div className="relative">
                  <Globe className="absolute left-4 top-3.5 h-5 w-5 text-gray-500" />
                  <Input
                    id="website"
                    placeholder="https://elitemotors.com"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    className={`${glassInputClasses} pl-12`}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-400 text-xs">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 h-5 w-5 text-gray-500" />
                  <Input
                    id="password"
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`${glassInputClasses} pl-12`}
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 mt-4 text-md font-bold bg-white text-black hover:bg-gray-200 shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] transition-all rounded-full flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    Sign Up <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

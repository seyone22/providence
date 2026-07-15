import { Suspense } from "react";
import RequestForm from "@/components/requestForm";

export default function EmbedRequestPage() {
  return (
    <main className="min-h-screen w-full bg-transparent flex flex-col items-center justify-center py-4 px-2 overflow-hidden">
      <div className="w-full max-w-3xl">
        <Suspense
          fallback={
            <div className="w-full max-w-3xl mx-auto h-[500px] flex items-center justify-center bg-white/80 backdrop-blur-xl rounded-[2rem] border border-black/5 shadow-lg text-zinc-500">
              Loading request form...
            </div>
          }
        >
          <RequestForm />
        </Suspense>
      </div>
    </main>
  );
}

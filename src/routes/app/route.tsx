import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, Sparkles } from "lucide-react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { BrandMark, SidebarNav } from "@/components/AppSidebar";
import { useAppState } from "@/lib/store";

export const Route = createFileRoute("/app")({
  component: AppLayout,
});

function AppLayout() {
  const [open, setOpen] = useState(false);
  const { state } = useAppState();

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r bg-sidebar px-4 py-5 lg:flex">
        <div className="px-2">
          <BrandMark />
        </div>
        <div className="mt-8 flex-1 overflow-y-auto">
          <SidebarNav />
        </div>
        <div className="rounded-2xl bg-primary/8 p-3 text-xs leading-relaxed text-muted-foreground">
          <p className="flex items-center gap-1.5 font-medium text-foreground">
            <Sparkles className="size-3.5 text-primary" /> {state.grade}
          </p>
          <p className="mt-1">
            AI can make mistakes. Always check important facts against your CAPS materials.
          </p>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex items-center gap-3 border-b bg-background/85 px-4 py-3 backdrop-blur lg:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open navigation">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 bg-sidebar px-4 py-5">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <BrandMark />
              <div className="mt-8">
                <SidebarNav onNavigate={() => setOpen(false)} />
              </div>
            </SheetContent>
          </Sheet>
          <BrandMark />
        </header>

        <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:py-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

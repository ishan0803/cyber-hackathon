import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import { Bell, LogOut, MoonStar, Settings, SunMedium } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Overview" },
  { to: "/campaigns", label: "Coordinated Campaigns" },
  { to: "/classifier", label: "Classifier" },
  { to: "/normalizer", label: "Normalizer" },
  { to: "/graph", label: "Graph Explorer" },
  { to: "/heatmap", label: "Heatmap" },
  { to: "/topk", label: "Top-K" },
  { to: "/alerts", label: "Alerts" },
  { to: "/audit", label: "Audit" },
  { to: "/settings", label: "Settings" },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const loc = useLocation();
  const { user, logout } = useAuth();
  const { mode, highContrast, toggleMode, toggleHighContrast } = useTheme();

  return (
    <SidebarProvider>
      <Sidebar variant="inset">
        <SidebarHeader className="px-3 py-4">
          <div className="flex items-center gap-2 px-2">
            <div className="size-7 rounded-md bg-cyan-500/20 ring-1 ring-cyan-400/30 grid place-items-center font-bold text-cyan-300">
              D
            </div>
            <span className="font-semibold text-sm tracking-wide">
              Digital Campaign Intelligence
            </span>
          </div>
        </SidebarHeader>
        <SidebarSeparator />
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {NAV.map((item) => (
                  <SidebarMenuItem key={item.to}>
                    <SidebarMenuButton
                      asChild
                      isActive={loc.pathname === item.to}
                    >
                      <Link to={item.to}>
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="mt-auto">
          <div className="px-2 pb-2 text-xs text-muted-foreground">
            {user?.role?.toUpperCase()}
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-20 border-b border-slate-800/60 bg-slate-950/70 backdrop-blur">
          <div className="flex h-14 items-center gap-2 px-3">
            <SidebarTrigger />
            <div className="flex-1" />
            <div className="hidden md:flex items-center gap-2">
              <div className="hidden lg:block w-72">
                <Input
                  placeholder="Search accounts, hashtags, posts..."
                  className="bg-slate-900 border-slate-800 placeholder:text-slate-500"
                  aria-label="Search"
                />
              </div>
              <Button
                variant="ghost"
                size="icon"
                aria-pressed={mode === "dark"}
                onClick={toggleMode}
              >
                {mode === "dark" ? (
                  <SunMedium className="text-amber-300" />
                ) : (
                  <MoonStar />
                )}
                <span className="sr-only">Toggle dark mode</span>
              </Button>
              <Button
                variant={highContrast ? "secondary" : "ghost"}
                size="sm"
                onClick={toggleHighContrast}
                aria-pressed={highContrast}
              >
                HC
              </Button>
              <Button variant="ghost" size="icon" aria-label="Notifications">
                <Bell />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                    <Avatar className="size-8">
                      <AvatarImage src={user?.avatarUrl} alt={user?.name} />
                      <AvatarFallback>{user?.name?.[0] || "U"}</AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>
                    <div className="text-sm font-medium">
                      {user?.name || "User"}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {user?.email}
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <Link to="/settings" className="block">
                    <DropdownMenuItem className={cn("gap-2")}>
                      {" "}
                      <Settings className="size-4" /> Settings
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuItem
                    onClick={logout}
                    className="gap-2 text-red-400"
                  >
                    <LogOut className="size-4" /> Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>
        <main className="p-3 md:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}

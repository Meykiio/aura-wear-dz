import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  LogOut,
  LayoutDashboard,
  Package,
  Box,
  Star,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Menu,
  Eye
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { OrderList } from "@/components/admin/OrderList";
import { ProductManager } from "@/components/admin/ProductManager";
import { PackManager } from "@/components/admin/PackManager";
import { ReviewManager } from "@/components/admin/ReviewManager";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarGroup,
  SidebarGroupLabel,
  useSidebar
} from "@/components/ui/sidebar";
import logoWhite from "@/assets/aura-logo-white.png";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard")({
  component: DashboardWrapper,
  validateSearch: (search: Record<string, unknown>): { tab?: string } => ({
    tab: typeof search.tab === "string" ? search.tab : undefined,
  }),
});

type Tab = "orders" | "products" | "packs" | "reviews";

function DashboardWrapper() {
  return (
    <SidebarProvider>
      <Dashboard />
    </SidebarProvider>
  );
}

function Dashboard() {
  const { session, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const { tab } = Route.useSearch();
  const activeTab = (tab as Tab) || "orders";
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  useEffect(() => {
    if (!loading && (!session || !isAdmin)) {
      navigate({ to: "/admin" });
    }
  }, [session, isAdmin, loading, navigate]);

  const setActiveTab = (t: Tab) => {
    navigate({ to: "/dashboard", search: { tab: t } });
  };

  if (loading || !session || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-aura-black">
        <p className="body-md text-aura-text-muted animate-pulse">Authenticating...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-aura-black flex w-full">
      <Sidebar collapsible="icon" className="border-r border-aura-border bg-aura-void">
        <SidebarHeader className="p-4 border-b border-aura-border flex flex-row items-center justify-between">
          {!isCollapsed && (
            <div className="flex flex-col">
              <img src={logoWhite} alt="AURA WEAR" className="h-6 w-auto object-contain" />
              <p className="utility-xs text-aura-text-muted mt-1 uppercase tracking-widest">Admin Control</p>
            </div>
          )}
          <SidebarTrigger />
        </SidebarHeader>

        <SidebarContent className="p-2">
          <SidebarGroup>
            <SidebarGroupLabel className="text-aura-text-faint">Management</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeTab === "orders"}
                  onClick={() => setActiveTab("orders")}
                  tooltip="Orders"
                  className={cn(
                    activeTab === "orders" && "bg-aura-violet/10 border-l-2 border-aura-violet text-aura-violet-text"
                  )}
                >
                  <LayoutDashboard className="size-5" />
                  <span>Orders</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeTab === "products"}
                  onClick={() => setActiveTab("products")}
                  tooltip="Products"
                  className={cn(
                    activeTab === "products" && "bg-aura-violet/10 border-l-2 border-aura-violet text-aura-violet-text"
                  )}
                >
                  <Box className="size-5" />
                  <span>Products</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeTab === "packs"}
                  onClick={() => setActiveTab("packs")}
                  tooltip="Packs"
                  className={cn(
                    activeTab === "packs" && "bg-aura-violet/10 border-l-2 border-aura-violet text-aura-violet-text"
                  )}
                >
                  <Package className="size-5" />
                  <span>Packs</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeTab === "reviews"}
                  onClick={() => setActiveTab("reviews")}
                  tooltip="Reviews"
                  className={cn(
                    activeTab === "reviews" && "bg-aura-violet/10 border-l-2 border-aura-violet text-aura-violet-text"
                  )}
                >
                  <Star className="size-5" />
                  <span>Reviews</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel className="text-aura-text-faint">Store Links</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Landing Page">
                  <Link to="/">
                    <Eye className="size-5" />
                    <span>View Landing</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Review Page">
                  <Link to="/review">
                    <Star className="size-5" />
                    <span>View Review Page</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="p-2 border-t border-aura-border">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={async () => {
                  await signOut();
                  navigate({ to: "/admin" });
                }}
                tooltip="Sign out"
                className="text-aura-error hover:bg-red-500/10 hover:text-aura-error"
              >
                <LogOut className="size-5" />
                <span>Sign out</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="mx-auto max-w-6xl">
          <header className="mb-8 flex items-center justify-between">
            <h1 className="heading-xl text-aura-text capitalize">{activeTab}</h1>
            <div className="md:hidden">
              <SidebarTrigger />
            </div>
          </header>

          {activeTab === "orders" && <OrderList />}
          {activeTab === "products" && <ProductManager />}
          {activeTab === "packs" && <PackManager />}
          {activeTab === "reviews" && <ReviewManager />}
        </div>
      </main>
    </div>
  );
}

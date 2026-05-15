import * as React from "react";
import { PanelLeft } from "lucide-react";
import { cn } from "../../lib/utils";
import { Button } from "./button";

type SidebarContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  state: "expanded" | "collapsed";
};

const SidebarContext = React.createContext<SidebarContextValue | null>(null);

function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.");
  }
  return context;
}

function SidebarProvider({
  defaultOpen = true,
  children,
}: {
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(defaultOpen);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const toggleSidebar = React.useCallback(() => {
    if (window.matchMedia("(min-width: 768px)").matches) {
      setOpen((value) => !value);
    } else {
      setMobileOpen((value) => !value);
    }
  }, []);

  const value = React.useMemo<SidebarContextValue>(
    () => ({
      open,
      setOpen,
      mobileOpen,
      setMobileOpen,
      toggleSidebar,
      state: open ? "expanded" : "collapsed",
    }),
    [mobileOpen, open, toggleSidebar]
  );

  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>;
}

function Sidebar({
  className,
  children,
}: React.ComponentProps<"aside">) {
  const { open, mobileOpen, setMobileOpen, state } = useSidebar();

  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          className="fixed inset-0 z-40 bg-background/75 backdrop-blur-sm md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        data-state={state}
        className={cn(
          "group/sidebar fixed inset-y-0 left-0 z-50 flex h-screen w-72 flex-col overflow-hidden border-r border-border bg-card/94 text-card-foreground shadow-xl backdrop-blur-xl transition-[transform,width,border-color] duration-300 md:sticky md:top-0 md:z-20 md:translate-x-0 md:shadow-none",
          open ? "md:w-72" : "md:w-0 md:border-transparent",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
          className
        )}
      >
        {children}
      </aside>
    </>
  );
}

function SidebarHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("p-3", className)} {...props} />;
}

function SidebarContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("min-h-0 flex-1 overflow-y-auto px-3", className)} {...props} />;
}

function SidebarFooter({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("p-3", className)} {...props} />;
}

function SidebarGroup({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("space-y-1", className)} {...props} />;
}

function SidebarGroupLabel({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      className={cn(
        "px-3 pb-2 text-xs font-medium uppercase text-muted-foreground transition-opacity group-data-[state=collapsed]/sidebar:opacity-0",
        className
      )}
      {...props}
    />
  );
}

function SidebarMenu({ className, ...props }: React.ComponentProps<"nav">) {
  return <nav className={cn("space-y-1", className)} {...props} />;
}

function SidebarSeparator({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("my-3 h-px bg-border", className)} {...props} />;
}

function SidebarTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof Button>) {
  const { toggleSidebar } = useSidebar();

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      onClick={toggleSidebar}
      className={cn("bg-card/90 backdrop-blur", className)}
      {...props}
    >
      {children ?? <PanelLeft className="h-4 w-4" />}
      <span className="sr-only">Toggle sidebar</span>
    </Button>
  );
}

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarProvider,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
};

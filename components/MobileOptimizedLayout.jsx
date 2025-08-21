"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Badge } from "@/components/ui/badge";
import {
  Menu,
  Search,
  Filter,
  Download,
  Share2,
  Bookmark,
  Bell,
  Settings,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  X,
  Check,
  AlertTriangle,
  Info,
} from "lucide-react";

export function MobileHeader({ onMenuOpen, onSearch, hasResults }) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuOpen}
            className="md:hidden"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded bg-primary" />
            <span className="font-semibold text-lg">RDAP</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {hasResults && (
            <>
              <Button variant="ghost" size="sm">
                <Share2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Download className="h-4 w-4" />
              </Button>
            </>
          )}
          <Button variant="ghost" size="sm">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}

export function MobileBottomBar({ activeTab, onTabChange, tabs }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden">
      <div className="grid grid-cols-4 gap-1 p-2">
        {tabs.slice(0, 4).map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.value;
          return (
            <Button
              key={tab.value}
              variant={isActive ? "default" : "ghost"}
              size="sm"
              className="h-12 flex-col gap-1 p-1 text-xs"
              onClick={() => onTabChange(tab.value)}
            >
              <Icon className="h-4 w-4" />
              <span className="truncate">{tab.label}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}

export function CollapsibleSection({ title, children, defaultOpen = false, icon: Icon, badge }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <Button
          variant="ghost"
          className="flex items-center justify-between w-full p-0 h-auto"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="flex items-center gap-2">
            {Icon && <Icon className="h-4 w-4" />}
            <span className="font-semibold text-left">{title}</span>
            {badge && <Badge variant="outline" className="ml-auto mr-2">{badge}</Badge>}
          </div>
          {isOpen ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
      </CardHeader>
      {isOpen && <CardContent className="pt-0">{children}</CardContent>}
    </Card>
  );
}

export function MobileDataCard({ title, value, icon: Icon, subtitle, status, onClick }) {
  const getStatusColor = (status) => {
    switch (status) {
      case "success": return "text-green-600 dark:text-green-400";
      case "warning": return "text-yellow-600 dark:text-yellow-400";
      case "error": return "text-red-600 dark:text-red-400";
      default: return "text-muted-foreground";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "success": return Check;
      case "warning": return AlertTriangle;
      case "error": return X;
      default: return Info;
    }
  };

  const StatusIcon = status ? getStatusIcon(status) : null;

  return (
    <Card className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={onClick}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              {Icon && <Icon className="h-4 w-4 text-muted-foreground flex-shrink-0" />}
              <span className="text-xs text-muted-foreground truncate">{title}</span>
              {StatusIcon && (
                <StatusIcon className={`h-3 w-3 flex-shrink-0 ${getStatusColor(status)}`} />
              )}
            </div>
            <p className="text-sm font-medium truncate">{value}</p>
            {subtitle && (
              <p className="text-xs text-muted-foreground mt-1 truncate">{subtitle}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function MobileGrid({ children, columns = 2 }) {
  return (
    <div className={`grid gap-3 ${columns === 1 ? 'grid-cols-1' : columns === 3 ? 'grid-cols-1 sm:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2'}`}>
      {children}
    </div>
  );
}

export function QuickActionBar({ actions }) {
  return (
    <div className="sticky top-14 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b p-2">
      <div className="flex gap-2 overflow-x-auto scrollbar-hide">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <Button
              key={index}
              variant="outline"
              size="sm"
              className="flex-shrink-0 gap-2"
              onClick={action.onClick}
            >
              <Icon className="h-4 w-4" />
              {action.label}
            </Button>
          );
        })}
      </div>
    </div>
  );
}

export function SwipeableCard({ children, onSwipeLeft, onSwipeRight }) {
  return (
    <div className="relative overflow-hidden">
      {children}
    </div>
  );
}

export function PullToRefresh({ onRefresh, children, isRefreshing }) {
  return (
    <div className="relative">
      {isRefreshing && (
        <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-center p-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
        </div>
      )}
      <div className={isRefreshing ? "opacity-50" : ""}>{children}</div>
    </div>
  );
}

export function MobileSearchBar({ value, onChange, onSubmit, placeholder }) {
  return (
    <div className="sticky top-14 z-30 bg-background p-4 border-b">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && onSubmit()}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
      </div>
    </div>
  );
}

export function FloatingActionButton({ onClick, icon: Icon, label }) {
  return (
    <Button
      onClick={onClick}
      className="fixed bottom-20 right-4 z-30 rounded-full w-14 h-14 shadow-lg md:hidden"
      size="lg"
    >
      <Icon className="h-6 w-6" />
      <span className="sr-only">{label}</span>
    </Button>
  );
}

export function MobileSheet({ isOpen, onClose, title, children }) {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="bottom" className="max-h-[90vh] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
        </SheetHeader>
        <div className="py-4">{children}</div>
      </SheetContent>
    </Sheet>
  );
}

export function MobileDrawer({ isOpen, onClose, title, description, children }) {
  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>{title}</DrawerTitle>
          {description && <DrawerDescription>{description}</DrawerDescription>}
        </DrawerHeader>
        <div className="p-4 pb-0 max-h-[60vh] overflow-y-auto">{children}</div>
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
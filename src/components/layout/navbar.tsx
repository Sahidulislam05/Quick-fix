"use client";

import { LayoutDashboard, LogOut, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Logo } from "@/components/layout/logo";
import { Container } from "@/components/shared/container";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { PUBLIC_NAV_LINKS, ROLE_HOME } from "@/constants/navigation";
import { useLogout } from "@/hooks/use-auth";
import { useCurrentUser } from "@/hooks/use-current-user";
import { cn } from "@/lib/utils";

function initials(name: string) {
  if (!name) return "?";
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: user } = useCurrentUser();
  const logout = useLogout();

  function handleLogout() {
    logout();
    router.push("/");
  }

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <Container className="flex h-16 items-center justify-between">
        <Logo />

        <nav className="hidden items-center gap-6 md:flex">
          {PUBLIC_NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
                pathname === link.href && "text-foreground",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* ডেস্কটপ অ্যাকশন */}
        <div className="hidden items-center gap-2 md:flex">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <button
                    type="button"
                    className="flex items-center gap-2 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
                  />
                }
              >
                <Avatar className="size-8">
                  <AvatarFallback>{initials(user.name)}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem render={<Link href={ROLE_HOME[user.role]} />}>
                  <LayoutDashboard data-icon="inline-start" />
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut data-icon="inline-start" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button
                variant="ghost"
                size="lg"
                render={<Link href="/auth/login" />}
              >
                Log in
              </Button>
              <Button size="lg" render={<Link href="/auth/register" />}>
                Sign up
              </Button>
            </>
          )}
        </div>

        {/* মোবাইল মেনু */}
        <Sheet>
          <SheetTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                aria-label="Open menu"
              />
            }
          >
            <Menu />
          </SheetTrigger>
          <SheetContent side="right" className="w-72">
            <SheetHeader>
              <SheetTitle>
                <Logo />
              </SheetTitle>
            </SheetHeader>

            <nav className="mt-2 flex flex-col gap-1 px-4">
              {PUBLIC_NAV_LINKS.map((link) => (
                <SheetClose
                  key={link.href}
                  render={
                    <Link
                      href={link.href}
                      className={cn(
                        "rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                        pathname === link.href &&
                          "bg-accent text-accent-foreground",
                      )}
                    />
                  }
                >
                  {link.label}
                </SheetClose>
              ))}
            </nav>

            <div className="mt-4 flex flex-col gap-2 px-4">
              {user ? (
                <>
                  <SheetClose
                    render={
                      <Link
                        href={ROLE_HOME[user.role]}
                        className={buttonVariants({ size: "lg" })}
                      />
                    }
                  >
                    Dashboard
                  </SheetClose>
                  <SheetClose
                    render={
                      <button
                        type="button"
                        className={buttonVariants({
                          variant: "outline",
                          size: "lg",
                        })}
                      />
                    }
                    onClick={handleLogout}
                  >
                    Log out
                  </SheetClose>
                </>
              ) : (
                <>
                  <SheetClose
                    render={
                      <Link
                        href="/auth/login"
                        className={buttonVariants({
                          variant: "outline",
                          size: "lg",
                        })}
                      />
                    }
                  >
                    Log in
                  </SheetClose>
                  <SheetClose
                    render={
                      <Link
                        href="/auth/register"
                        className={buttonVariants({ size: "lg" })}
                      />
                    }
                  >
                    Sign up
                  </SheetClose>
                </>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </Container>
    </header>
  );
}

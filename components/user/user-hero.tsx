'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Menu, X, User, Bell, LogOut, Settings } from 'lucide-react'
import Image from 'next/image'

const menuItems = [
  { name: 'Reservations', href: '#' },
  { name: 'Account', href: '#' },
]

export default function UserDashboardHeader() {
  const [menuOpen, setMenuOpen] = useState(false)

  
  const userData = {
    name: 'Jiansie Cruz',
    email: 'jiansie@example.com',
    avatar: '/images/avatar-placeholder.png',
    initials: 'AJ'
  }

  return (
    <>
      <header>
        <nav className="fixed z-20 w-full border-b border-dashed bg-white backdrop-blur md:relative dark:bg-zinc-950/50 lg:dark:bg-transparent">
          <div className="m-auto max-w-5xl px-6">
            <div className="flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
              <div className="flex w-full items-center justify-between lg:w-auto">
                <Link
                  href="/dashboard"
                  aria-label="dashboard"
                  className="flex items-center space-x-2"
                >
                  <div className="font-bold text-primary">SWEET and SAVORY</div>
                </Link>

                {/* Mobile menu button */}
                <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
                  <SheetTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="lg:hidden"
                      aria-label="Open menu"
                    >
                      <Menu className="h-6 w-6" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                    <SheetHeader>
                      <SheetTitle>Menu</SheetTitle>
                    </SheetHeader>
                    <div className="flex flex-col space-y-4 mt-6">
                      {menuItems.map((item, index) => (
                        <Link
                          key={index}
                          href={item.href}
                          className="text-lg py-2 px-4 rounded-md hover:bg-accent"
                          onClick={() => setMenuOpen(false)}
                        >
                          {item.name}
                        </Link>
                      ))}
                      
                      <div className="pt-4 border-t">
                        <div className="flex items-center gap-3 px-4 py-2">
                          <Avatar>
                            <AvatarImage src={userData.avatar} />
                            <AvatarFallback>{userData.initials}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{userData.name}</p>
                            <p className="text-sm text-muted-foreground">{userData.email}</p>
                          </div>
                        </div>
                        
                        <Link
                          href="/profile"
                          className="flex items-center gap-2 text-lg py-2 px-4 rounded-md hover:bg-accent"
                          onClick={() => setMenuOpen(false)}
                        >
                          <User className="h-5 w-5" />
                          Profile
                        </Link>
                        
                        <Link
                          href="/settings"
                          className="flex items-center gap-2 text-lg py-2 px-4 rounded-md hover:bg-accent"
                          onClick={() => setMenuOpen(false)}
                        >
                          <Settings className="h-5 w-5" />
                          Settings
                        </Link>
                        
                        <button
                          className="flex items-center gap-2 text-lg py-2 px-4 rounded-md text-red-600 hover:bg-accent w-full text-left"
                          onClick={() => {
                            // Handle sign out
                            setMenuOpen(false)
                          }}
                        >
                          <LogOut className="h-5 w-5" />
                          Sign out
                        </button>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>

              {/* Desktop navigation */}
              <div className="hidden lg:flex items-center gap-6">
                <div className="flex items-center gap-6">
                  {menuItems.map((item, index) => (
                    <Link
                      key={index}
                      href={item.href}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>

                <div className="flex items-center gap-4 border-l pl-6">
                  {/* User profile dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={userData.avatar} />
                          <AvatarFallback>{userData.initials}</AvatarFallback>
                        </Avatar>
                        <span className="hidden md:block">{userData.name}</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel>
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium">{userData.name}</p>
                          <p className="text-xs text-muted-foreground">{userData.email}</p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/profile" className="cursor-pointer">
                          <User className="mr-2 h-4 w-4" />
                          Profile
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/settings" className="cursor-pointer">
                          <Settings className="mr-2 h-4 w-4" />
                          Settings
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="text-red-600 cursor-pointer focus:text-red-600"
                        onClick={() => {
                          // Handle sign out
                        }}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>

      <main>
        <div
          aria-hidden
          className="z-2 absolute inset-0 isolate hidden opacity-50 contain-strict lg:block"
        >
          <div className="w-140 h-320 -translate-y-87.5 absolute left-0 top-0 -rotate-45 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,hsla(0,0%,85%,.08)_0,hsla(0,0%,55%,.02)_50%,hsla(0,0%,45%,0)_80%)]" />
          <div className="h-320 absolute left-0 top-0 w-60 -rotate-45 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.06)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)] [translate:5%_-50%]" />
          <div className="h-320 -translate-y-87.5 absolute left-0 top-0 w-60 -rotate-45 bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.04)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)]" />
        </div>

        <section className="overflow-hidden bg-white dark:bg-transparent">
          <div className="relative mx-auto max-w-5xl px-6 py-28 lg:py-24">
            <div className="relative z-10 mx-auto max-w-2xl text-center">
              <h1 className="text-balance text-4xl font-semibold md:text-5xl lg:text-6xl">
                Welcome back, {userData.name}!
              </h1>
              <p className="mx-auto my-8 max-w-2xl text-xl">
                Ready to plan your next celebration? Browse our latest offerings or check your upcoming orders.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg">
                  <Link href="/order">
                    <span className="btn-label">Place New Order</span>
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/reservations">
                    <span className="btn-label">View Reservations</span>
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          <div className="mx-auto -mt-16 max-w-7xl">
            <div className="perspective-distant -mr-16 pl-16 lg:-mr-56 lg:pl-56">
              <div className="[transform:rotateX(20deg);]">
                <div className="lg:h-176 relative skew-x-[.36rad]">
                  <div
                    aria-hidden
                    className="bg-linear-to-b from-background to-background z-1 absolute -inset-16 via-transparent sm:-inset-32"
                  />
                  <div
                    aria-hidden
                    className="bg-linear-to-r from-background to-background z-1 absolute -inset-16 bg-white/50 via-transparent sm:-inset-32 dark:bg-transparent"
                  />

                  <div
                    aria-hidden
                    className="absolute -inset-16 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-[size:24px_24px] [--color-border:var(--color-zinc-400)] sm:-inset-32 dark:[--color-border:color-mix(in_oklab,var(--color-white)_20%,transparent)]"
                  />
                  <div
                    aria-hidden
                    className="from-background z-11 absolute inset-0 bg-gradient-to-l"
                  />
                  <div
                    aria-hidden
                    className="z-2 absolute inset-0 size-full items-center px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%,transparent_40%,var(--color-background)_100%)]"
                  />
                  <div
                    aria-hidden
                    className="z-2 absolute inset-0 size-full items-center px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%,transparent_40%,var(--color-background)_100%)]"
                  />

                  <Image
                    className="rounded-(--radius) z-1 relative border dark:hidden"
                    src="/images/sv1.jpg"
                    alt="Sweet and Savory party tray"
                    width={2880}
                    height={2074}
                  />
                  <Image
                    className="rounded-(--radius) z-1 relative hidden border dark:block"
                    src="/images/sv1.jpg"
                    alt="Sweet and Savory party tray"
                    width={2880}
                    height={2074}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
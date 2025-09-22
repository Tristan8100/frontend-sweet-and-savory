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
import { useAuth } from '@/contexts/AuthContext'

const menuItems = [
  { name: 'Reservations', href: '/user/reservations' },
  { name: 'Account', href: '/user/settings' },
]

export default function UserDashboardHeader() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false)

  // Function to get user initials
  const getInitials = (name: string | undefined) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  return (
    <>
      <header>
        <nav className="fixed z-20 w-full border-b border-dashed bg-white backdrop-blur md:relative dark:bg-zinc-950/50 lg:dark:bg-transparent">
          <div className="m-auto max-w-5xl px-6">
            <div className="flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
              <div className="flex w-full items-center justify-between lg:w-auto">
                <Link
                  href="/user/dashboard"
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
                            <AvatarFallback>{getInitials(user?.name)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{user?.name || 'User'}</p>
                            <p className="text-sm text-muted-foreground">{user?.email || ''}</p>
                          </div>
                        </div>
                        
                        <Link
                          href="/user/profile"
                          className="flex items-center gap-2 text-lg py-2 px-4 rounded-md hover:bg-accent"
                          onClick={() => setMenuOpen(false)}
                        >
                          <User className="h-5 w-5" />
                          Profile
                        </Link>
                        
                        <button
                          className="flex items-center gap-2 text-lg py-2 px-4 rounded-md text-red-600 hover:bg-accent w-full text-left"
                          onClick={() => {
                            logout();
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
                          <AvatarFallback>{getInitials(user?.name)}</AvatarFallback>
                        </Avatar>
                        <span className="hidden md:block">{user?.name || 'User'}</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel>
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium">{user?.name || 'User'}</p>
                          <p className="text-xs text-muted-foreground">{user?.email || ''}</p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/user/settings" className="cursor-pointer">
                          <User className="mr-2 h-4 w-4" />
                          Profile
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="text-red-600 cursor-pointer focus:text-red-600"
                        onClick={() => {
                          logout();
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

      
    </>
  )
}
'use client'

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { api2 } from "@/lib/api";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

type ReservationCounts = {
  pending: number;
  cancelled: number;
  completed: number;
  confirmed: number;
  total: number;
};

export default function SettingsPage() {
  const { user } = useAuth();

  // User info state
  const [name, setName] = useState("");

  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");

  // Reservation counts
  const [reservationCounts, setReservationCounts] = useState<ReservationCounts | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Populate initial name
  useEffect(() => {
    if (user) setName(user.name);
  }, [user]);

  // Fetch reservation counts
  useEffect(() => {
    async function fetchReservations() {
      try {
        const { data } = await api2.get("/api/all-my-reservation");
        setReservationCounts(data);
      } catch (err) {
        console.error("Failed to fetch reservations:", err);
        toast.error("Failed to load reservation data");
      }
    }

    fetchReservations();
  }, []);

  // Update name
  const handleUpdateName = async () => {
    setIsLoading(true);
    try {
      const { data } = await api2.patch("/api/update-name", { name });
      toast.success(data.message || "Name updated successfully");
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to update name.");
    } finally {
      setIsLoading(false);
    }
  };

  // Change password
  const handleChangePassword = async () => {
    if (newPassword !== newPasswordConfirm) {
      toast.error("New passwords do not match.");
      return;
    }

    setIsLoading(true);
    try {
      const { data } = await api2.patch("/api/change-password", {
        current_password: currentPassword,
        new_password: newPassword,
        new_password_confirmation: newPasswordConfirm,
      });
      toast.success(data.message || "Password changed successfully");

      // Clear password fields
      setCurrentPassword("");
      setNewPassword("");
      setNewPasswordConfirm("");
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to change password.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  );

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">Manage your account settings and preferences</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="reservations">Reservations</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Update Profile</CardTitle>
                <CardDescription>Update your name and personal information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                  />
                </div>
                <Button 
                  onClick={handleUpdateName} 
                  disabled={isLoading}
                >
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Update Name
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>Update your password to keep your account secure</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input
                    id="current-password"
                    type="password"
                    placeholder="Enter current password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="Confirm new password"
                    value={newPasswordConfirm}
                    onChange={(e) => setNewPasswordConfirm(e.target.value)}
                  />
                </div>
                <Button 
                  onClick={handleChangePassword} 
                  variant="destructive"
                  disabled={isLoading}
                >
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Change Password
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reservations">
            <Card>
              <CardHeader>
                <CardTitle>Reservation Summary</CardTitle>
                <CardDescription>Overview of your reservation history</CardDescription>
              </CardHeader>
              <CardContent>
                {reservationCounts ? (
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <Badge variant="secondary" className="mb-2">Pending</Badge>
                      <p className="text-2xl font-bold">{reservationCounts.pending}</p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <Badge variant="destructive" className="mb-2">Cancelled</Badge>
                      <p className="text-2xl font-bold">{reservationCounts.cancelled}</p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <Badge variant="default" className="mb-2">Completed</Badge>
                      <p className="text-2xl font-bold">{reservationCounts.completed}</p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <Badge variant="default" className="mb-2">Confirmed</Badge>
                      <p className="text-2xl font-bold">{reservationCounts.confirmed}</p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <Badge variant="outline" className="mb-2">Total</Badge>
                      <p className="text-2xl font-bold">{reservationCounts.total}</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin mr-2" />
                    <span>Loading reservation data...</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
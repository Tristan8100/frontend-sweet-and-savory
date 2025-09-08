import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
        <h2 className="text-2xl lg:text-3xl font-bold">Users</h2>
        <Input placeholder="Search users..." className="w-full sm:w-64" />
      </div>

      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground">
            User management interface would be implemented here with user list, roles, and permissions.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

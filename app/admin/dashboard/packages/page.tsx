'use client'
import { useEffect, useState } from 'react'
import { api2 } from '@/lib/api'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogTitle, AlertDialogAction, AlertDialogCancel } from "@/components/ui/alert-dialog"
import AddPackageDialog from '@/components/admin/add-package'

export default function AdminPackages() {
  const [packages, setPackages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchPackages = async () => {
    try {
      const res = await api2.get('/api/admin-packages')
      if (res.data.success) setPackages(res.data.data)
    } catch (err) {
      console.error('Error fetching packages:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchPackages() }, [])

  const handleDelete = async (pkgId: number) => {
    try {
      await api2.delete(`/api/admin-packages/${pkgId}`)
      setPackages(prev => prev.filter(p => p.id !== pkgId))
    } catch (err) {
      console.error('Delete failed:', err)
    }
  }

  // EDIT DIALOG
  function EditPackageDialog({ pkg, onUpdated }: { pkg: any, onUpdated: (p: any) => void }) {
    const [open, setOpen] = useState(false)
    const [name, setName] = useState(pkg.name)
    const [description, setDescription] = useState(pkg.description)
    const [file, setFile] = useState<File | null>(null)
    const [loading, setLoading] = useState(false)

    const handleSubmit = async () => {
      setLoading(true)
      try {
        const formData = new FormData()
        formData.append('name', name)
        formData.append('description', description)
        if (file) formData.append('picture', file)

        const res = await api2.post(`/api/admin-packages-update/${pkg.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })

        if (res.data.success) {
          onUpdated(res.data.data)
          setOpen(false)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">Edit</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-lg space-y-4">
          <DialogTitle>Edit Package</DialogTitle>
          <input
            type="text" value={name} onChange={e => setName(e.target.value)}
            placeholder="Package Name" className="w-full border p-2 rounded"
          />
          <textarea
            value={description} onChange={e => setDescription(e.target.value)}
            placeholder="Description" className="w-full border p-2 rounded"
          />
          <input
            type="file"
            accept="image/*"
            onChange={e => setFile(e.target.files ? e.target.files[0] : null)}
            className="w-full border p-2 rounded"
          />
          <Button onClick={handleSubmit} className="w-full" disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogContent>
      </Dialog>
    )
  }

  // DELETE ALERT DIALOG
    function DeletePackageAlert({ pkgId, onDelete }: { pkgId: number, onDelete: (id: number) => void }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm">Delete</Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogTitle>Are you sure you want to delete this package?</AlertDialogTitle>
        <div className="flex justify-end gap-2 mt-4">
          <AlertDialogCancel asChild>
            <Button variant="outline">Cancel</Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button variant="destructive" onClick={() => onDelete(pkgId)}>Yes, Delete</Button>
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}

  const handleUpdate = (updatedPackage: any) => {
    setPackages(prev => prev.map(p => p.id === updatedPackage.id ? updatedPackage : p))
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading packages...</div>

  return (
    <div className="min-h-screen p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Packages:</h1>
        <AddPackageDialog onAdded={fetchPackages} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.map(pkg => (
          <Card key={pkg.id} className="overflow-hidden shadow hover:shadow-lg transition-shadow bg-white rounded-lg flex flex-col">
            <div className="aspect-video w-full relative overflow-hidden">
              <Image
                src={`${api2.defaults.baseURL}${pkg.picture_url}`}
                alt={pkg.name}
                fill
                className="object-cover transition-transform hover:scale-105"
              />
            </div>
            <CardHeader>
              <CardTitle className="text-xl font-semibold">{pkg.name}</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">{pkg.description}</CardDescription>
            </CardHeader>
            <CardContent className="max-h-48 overflow-y-auto space-y-2 pr-2">
              {pkg.options?.map((option: any, idx: number) => (
                <div key={idx} className="border rounded-lg p-2 hover:bg-gray-50 flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">{option.name}</h4>
                    <p className="text-xs text-muted-foreground">{option.description}</p>
                  </div>
                  <Badge variant="secondary" className="bg-gray-200 text-gray-800">₱{Number(option.price).toLocaleString()}</Badge>
                </div>
              ))}
            </CardContent>
            <CardFooter className="flex gap-2 flex-wrap">
              <Button asChild variant="outline" size="sm">
                <Link href={`/admin/dashboard/packages/${pkg.id}`}>View</Link>
              </Button>
              <EditPackageDialog pkg={pkg} onUpdated={handleUpdate} />
              <DeletePackageAlert pkgId={pkg.id} onDelete={handleDelete} />
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

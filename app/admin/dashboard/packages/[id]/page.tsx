'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { api2 } from '@/lib/api';
import Image from 'next/image';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog';
import Link from 'next/link';

interface PackageOption {
  id: number;
  package_id: number;
  name: string;
  description: string;
  price: string;
  picture_url?: string;
  analysis?: string;
  recommendation?: string;
  created_at: string;
  updated_at: string;
}

interface PackageData {
  id: number;
  name: string;
  description: string;
  picture_url?: string;
  analysis?: string;
  recommendation?: string;
  created_at: string;
  updated_at: string;
  options: PackageOption[];
}

export default function PackageDetails() {
  const params = useParams();
  const [pkg, setPkg] = useState<PackageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<PackageOption | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    picture: null as File | null,
  });

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const res = await api2.get(`/api/admin-packages/${params.id}`);
        if (res.data.success) setPkg(res.data.data);
      } catch (err) {
        console.error('Error fetching package:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPackage();
  }, [params.id]);

  // --- AI Analysis Toggle ---
  const handleAiAnalysis = async () => {
    if (!params.id) return;
    setAiLoading(true);
    try {
      const res = await api2.get(`/api/admin-packages-AI/${params.id}`);
      if (res.data.success) {
        toast.success('AI analysis generated successfully!');
        setPkg((prev) => ({ ...prev, ...res.data.data }));
      }
    } catch (err: any) {
      console.error(err);
      toast.error('AI analysis failed: ' + err?.message);
    } finally {
      setAiLoading(false);
    }
  };

  // --- Dialog Handlers ---
  const openEditDialog = (option: PackageOption) => {
    setSelectedOption(option);
    setFormData({
      name: option.name,
      description: option.description,
      price: option.price,
      picture: null,
    });
    setEditDialogOpen(true);
  };

  const openCreateDialog = () => {
    setFormData({ name: '', description: '', price: '', picture: null });
    setCreateDialogOpen(true);
  };

  const openDeleteDialog = (option: PackageOption) => {
    setSelectedOption(option);
    setDeleteDialogOpen(true);
  };

  // --- Create Package Option ---
  const handleCreate = async () => {
    if (!formData.name || !formData.description || !formData.price || !formData.picture) {
      toast.error('All fields are required.');
      return;
    }

    const data = new FormData();
    data.append('package_id', params.id as string);
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('price', formData.price);
    data.append('picture', formData.picture);

    try {
      const res = await api2.post(`/api/package-options`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.data.success) {
        toast.success('Package option created!');
        setCreateDialogOpen(false);
        setPkg((prev) => prev ? { ...prev, options: [...prev.options, res.data.data] } : prev);
      }
    } catch (err: any) {
      console.error(err);
      toast.error('Creation failed: ' + err?.message);
    }
  };

  // --- Update Package Option ---
  const handleUpdate = async () => {
    if (!selectedOption) return;
    if (!formData.name || !formData.description || !formData.price) {
      toast.error('Name, description, and price are required.');
      return;
    }

    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('price', formData.price);
    if (formData.picture) data.append('picture', formData.picture);

    try {
      const res = await api2.post(`/api/package-options-update/${selectedOption.id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.data.success) {
        toast.success('Package option updated!');
        setEditDialogOpen(false);
        setPkg((prev) => {
          if (!prev) return prev;
          const updatedOptions = prev.options.map((opt) =>
            opt.id === selectedOption.id ? { ...opt, ...res.data.data } : opt
          );
          return { ...prev, options: updatedOptions };
        });
      }
    } catch (err: any) {
      console.error(err);
      toast.error('Update failed: ' + err?.message);
    }
  };

  // --- Delete Package Option ---
  const handleDelete = async () => {
    if (!selectedOption) return;
    try {
      const res = await api2.delete(`/api/package-options/${selectedOption.id}`);
      if (res.data.success) {
        toast.success('Package option deleted!');
        setDeleteDialogOpen(false);
        setPkg((prev) => {
          if (!prev) return prev;
          return { ...prev, options: prev.options.filter((opt) => opt.id !== selectedOption.id) };
        });
      }
    } catch (err: any) {
      console.error(err);
      toast.error('Deletion failed: ' + err?.message);
    }
  };

  if (loading) return <p className="text-center mt-20">Loading package details...</p>;
  if (!pkg) return <p className="text-center mt-20 text-red-500">Package not found.</p>;

  return (
    <div className="min-h-screen p-4 md:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-4 md:gap-6">
        {pkg.picture_url && (
          <div className="w-full md:w-1/3 rounded-lg overflow-hidden shadow-lg">
            <Image
              src={`${api2.defaults.baseURL}${pkg.picture_url}`}
              alt={pkg.name}
              width={500}
              height={300}
              className="w-full h-full object-cover rounded"
            />
          </div>
        )}
        <div className="flex-1 space-y-2">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">{pkg.name}</h1>
          <p className="text-sm sm:text-base text-muted-foreground">{pkg.description}</p>
          <p className="text-xs sm:text-sm text-muted-foreground">
            <strong>Created:</strong> {new Date(pkg.created_at).toLocaleDateString()} |{' '}
            <strong>Updated:</strong> {new Date(pkg.updated_at).toLocaleDateString()}
          </p>
          <div className="flex flex-wrap gap-2 mt-2">
            <Button className="flex-1 sm:flex-none" onClick={openCreateDialog}>
              Add Package Option
            </Button>
            <Button className="flex-1 sm:flex-none" onClick={handleAiAnalysis} disabled={aiLoading}>
              {aiLoading ? 'Generating AI...' : 'Toggle AI Analysis'}
            </Button>
          </div>
        </div>
      </div>

      {/* AI Analysis & Recommendation */}
      {pkg.analysis && pkg.recommendation && (
        <Card className="p-4 shadow-lg">
          <CardHeader>
            <CardTitle>AI Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-semibold">Analysis:</p>
            <p className="text-sm sm:text-base text-muted-foreground mb-2">{pkg.analysis}</p>
            <p className="font-semibold">Recommendation:</p>
            <p className="text-sm sm:text-base text-muted-foreground">{pkg.recommendation}</p>
          </CardContent>
        </Card>
      )}

      {/* Package Options */}
      <div className="space-y-6">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">Package Options</h2>
        {pkg.options.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {pkg.options.map((opt) => (
              <Card key={opt.id} className="overflow-hidden shadow-sm p-4 flex flex-col">
                {opt.picture_url && (
                  <div className="relative h-40 sm:h-48 w-full mb-2 rounded">
                    <Image
                      src={`${api2.defaults.baseURL}${opt.picture_url}`}
                      alt={opt.name}
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">{opt.name}</CardTitle>
                  <CardDescription className="text-sm sm:text-base">{opt.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-bold">₱{Number(opt.price).toLocaleString()}</p>
                  {opt.analysis && (
                    <>
                      <Separator className="my-2" />
                      <p className="text-sm font-semibold">Analysis:</p>
                      <p className="text-xs sm:text-sm text-muted-foreground">{opt.analysis}</p>
                    </>
                  )}
                  {opt.recommendation && (
                    <>
                      <Separator className="my-2" />
                      <p className="text-sm font-semibold">Recommendation:</p>
                      <p className="text-xs sm:text-sm text-muted-foreground">{opt.recommendation}</p>
                    </>
                  )}
                </CardContent>
                <CardFooter className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                  <span className="text-xs sm:text-sm text-muted-foreground">
                    Created: {new Date(opt.created_at).toLocaleDateString()} | Updated:{' '}
                    {new Date(opt.updated_at).toLocaleDateString()}
                  </span>
                  <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
                    <Button size="sm" className="flex-1 sm:flex-none" onClick={() => openEditDialog(opt)}>
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="flex-1 sm:flex-none"
                      onClick={() => openDeleteDialog(opt)}
                    >
                      Delete
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1 sm:flex-none">
                      <Link href={`/admin/dashboard/packages/package-option/${opt.id}`}>View</Link>
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-sm sm:text-base text-muted-foreground">No options available for this package.</p>
        )}
      </div>

      {/* Create Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Package Option</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Input
              placeholder="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <Input
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            <Input
              placeholder="Price"
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            />
            <Input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setFormData({ ...formData, picture: e.target.files?.[0] || null })
              }
            />
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-4">
            <Button onClick={handleCreate} className="flex-1 sm:flex-none">
              Create
            </Button>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)} className="flex-1 sm:flex-none">
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Package Option</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Input
              placeholder="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <Input
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            <Input
              placeholder="Price"
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            />
            <Input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setFormData({ ...formData, picture: e.target.files?.[0] || null })
              }
            />
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-4">
            <Button onClick={handleUpdate} className="flex-1 sm:flex-none">
              Save
            </Button>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)} className="flex-1 sm:flex-none">
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Alert Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this package option?</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex flex-col sm:flex-row gap-2 mt-4">
            <AlertDialogCancel className="flex-1 sm:flex-none">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="flex-1 sm:flex-none bg-red-600 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { api2 } from '@/lib/api';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

export default function AddPackageDialog({ onAdded }: { onAdded?: () => void }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [picture, setPicture] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description || !picture) {
      toast.error('Please fill all fields');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('picture', picture);

    try {
      setLoading(true);
      const res = await api2.post('/api/admin-packages', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.success) {
        toast.success('Package added successfully!');
        setName('');
        setDescription('');
        setPicture(null);
        onAdded?.();
      }
    } catch (err: any) {
      console.error(err);
      toast.error('Error adding package: ' + err?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Add New Package</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        {/* Make DialogTitle a direct child of DialogContent */}
        <DialogTitle>Add New Package</DialogTitle>

        <form className="space-y-4 mt-2" onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="name">Package Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter package name"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter package description"
              required
            />
          </div>

          <div>
            <Label htmlFor="picture">Picture</Label>
            <Input
              id="picture"
              type="file"
              accept="image/*"
              onChange={(e) => setPicture(e.target.files?.[0] || null)}
              required
            />
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <DialogClose asChild>
              <Button variant="outline" type="button">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={loading}>
              {loading ? 'Adding...' : 'Add Package'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

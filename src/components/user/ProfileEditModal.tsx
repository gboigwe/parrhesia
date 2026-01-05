"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar } from "@/components/ui/avatar";

interface ProfileData {
  basename: string;
  bio?: string;
  avatar?: string;
  twitter?: string;
  github?: string;
  website?: string;
}

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: ProfileData;
  onSave: (data: ProfileData) => Promise<void>;
}

export function ProfileEditModal({
  isOpen,
  onClose,
  initialData,
  onSave,
}: ProfileEditModalProps) {
  const [formData, setFormData] = useState<ProfileData>(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    field: keyof ProfileData,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await onSave(formData);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData(initialData);
    setError(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar Preview */}
          <div className="flex items-center gap-4">
            <Avatar
              src={formData.avatar}
              alt={formData.basename}
              fallback={formData.basename[0]?.toUpperCase()}
              size="xl"
            />
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Avatar URL
              </label>
              <Input
                type="url"
                placeholder="https://example.com/avatar.jpg"
                value={formData.avatar || ""}
                onChange={(e) => handleChange("avatar", e.target.value)}
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Enter a URL to your profile image
              </p>
            </div>
          </div>

          {/* Basename (Read-only) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Basename
            </label>
            <Input
              type="text"
              value={formData.basename}
              disabled
              className="bg-gray-100 dark:bg-gray-800 cursor-not-allowed"
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Basename cannot be changed
            </p>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Bio
            </label>
            <Textarea
              placeholder="Tell us about yourself..."
              value={formData.bio || ""}
              onChange={(e) => handleChange("bio", e.target.value)}
              maxLength={500}
              rows={4}
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {formData.bio?.length || 0} / 500 characters
            </p>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Social Links
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Twitter
              </label>
              <div className="flex items-center gap-2">
                <span className="text-gray-500 dark:text-gray-400">@</span>
                <Input
                  type="text"
                  placeholder="username"
                  value={formData.twitter || ""}
                  onChange={(e) => handleChange("twitter", e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                GitHub
              </label>
              <div className="flex items-center gap-2">
                <span className="text-gray-500 dark:text-gray-400">
                  github.com/
                </span>
                <Input
                  type="text"
                  placeholder="username"
                  value={formData.github || ""}
                  onChange={(e) => handleChange("github", e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Website
              </label>
              <Input
                type="url"
                placeholder="https://yourwebsite.com"
                value={formData.website || ""}
                onChange={(e) => handleChange("website", e.target.value)}
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isLoading}>
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

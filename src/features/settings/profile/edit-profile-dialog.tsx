"use client";

import { useState, type FormEvent } from "react";
import { Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { UserAvatar } from "@/components/ui/user-avatar";
import type { ProfileData } from "./profile-header";

type EditProfileDialogProps = {
  open: boolean;
  profile: ProfileData;
  onClose: () => void;
  onSave: (profile: ProfileData) => void;
};

export function EditProfileDialog({ open, profile, onClose, onSave }: EditProfileDialogProps) {
  const [draft, setDraft] = useState(profile);
  const [error, setError] = useState("");
  const update = (key: keyof ProfileData, value: string) =>
    setDraft((current) => ({ ...current, [key]: value }));
  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!draft.name.trim() || !draft.title.trim()) {
      setError("Name and job title are required.");
      return;
    }
    onSave({ ...draft, name: draft.name.trim(), title: draft.title.trim() });
  };

  return (
    <Dialog open={open} title="Edit profile" onClose={onClose}>
      <form onSubmit={submit} className="grid gap-4">
        <div className="flex items-center gap-3 rounded-lg border border-border bg-surface-alt p-3">
          <span className="relative">
            <UserAvatar name={profile.name} size={52} />
            <span className="absolute -bottom-1 -right-1 grid size-6 place-items-center rounded-full border-2 border-surface bg-accent text-white">
              <Camera size={11} />
            </span>
          </span>
          <div>
            <b className="block text-[12px]">Profile photo</b>
            <p className="mt-1 text-[10px] text-muted">Current workspace portrait</p>
          </div>
        </div>
        {error && (
          <p
            role="alert"
            className="rounded-lg border border-danger/20 bg-danger/10 px-3 py-2 text-[10px] text-danger"
          >
            {error}
          </p>
        )}
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Full name" htmlFor="profile-name">
            <Input
              id="profile-name"
              value={draft.name}
              onChange={(event) => {
                update("name", event.target.value);
                setError("");
              }}
              required
              className="w-full"
            />
          </FormField>
          <FormField label="Job title" htmlFor="profile-title">
            <Input
              id="profile-title"
              value={draft.title}
              onChange={(event) => {
                update("title", event.target.value);
                setError("");
              }}
              required
              className="w-full"
            />
          </FormField>
          <FormField label="Location" htmlFor="profile-location">
            <Input
              id="profile-location"
              value={draft.location}
              onChange={(event) => update("location", event.target.value)}
              className="w-full"
            />
          </FormField>
          <FormField label="Phone" htmlFor="profile-phone">
            <Input
              id="profile-phone"
              type="tel"
              value={draft.phone}
              onChange={(event) => update("phone", event.target.value)}
              className="w-full"
            />
          </FormField>
          <FormField label="Website" htmlFor="profile-website">
            <Input
              id="profile-website"
              value={draft.website}
              onChange={(event) => update("website", event.target.value)}
              className="w-full"
            />
          </FormField>
        </div>
        <FormField label="Biography" htmlFor="profile-bio">
          <textarea
            id="profile-bio"
            value={draft.bio}
            onChange={(event) => update("bio", event.target.value)}
            maxLength={320}
            className="ui-input min-h-24 w-full resize-y py-2.5"
          />
        </FormField>
        <div className="flex justify-end gap-2 border-t border-border pt-4">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Save changes
          </Button>
        </div>
      </form>
    </Dialog>
  );
}

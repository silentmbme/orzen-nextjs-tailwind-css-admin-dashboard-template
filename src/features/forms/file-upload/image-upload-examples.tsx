"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { Camera, ImagePlus, Package, Plus, Trash2, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/showcase-card";

function formatSize(bytes: number) {
  return bytes < 1024 * 1024
    ? `${Math.ceil(bytes / 1024)} KB`
    : `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
function usePreviews(files: File[]) {
  const urls = useMemo(() => files.map((file) => URL.createObjectURL(file)), [files]);
  useEffect(() => () => urls.forEach((url) => URL.revokeObjectURL(url)), [urls]);
  return urls;
}

export function ImageUploadExamples() {
  const [avatar, setAvatar] = useState<File[]>([]),
    [cover, setCover] = useState<File[]>([]),
    [single, setSingle] = useState<File[]>([]),
    [gallery, setGallery] = useState<File[]>([]),
    [media, setMedia] = useState<File[]>([]),
    [product, setProduct] = useState<File[]>([]);
  const avatarUrl = usePreviews(avatar)[0],
    coverUrl = usePreviews(cover)[0],
    singleUrl = usePreviews(single)[0],
    galleryUrls = usePreviews(gallery),
    mediaUrls = usePreviews(media),
    productUrls = usePreviews(product);
  const add = (
    setter: React.Dispatch<React.SetStateAction<File[]>>,
    list: FileList | null,
    multiple = false,
  ) =>
    list &&
    setter((current) => (multiple ? [...current, ...Array.from(list)] : [list[0]].filter(Boolean)));
  return (
    <div className="grid gap-3">
      <div className="grid gap-3 lg:grid-cols-[.7fr_1.3fr]">
        <Card title="Avatar upload">
          <div className="grid place-items-center py-3">
            <div className="group relative size-24 overflow-hidden rounded-full border border-border bg-accent/10">
              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt="Selected avatar preview"
                  fill
                  unoptimized
                  className="object-cover"
                />
              ) : (
                <span className="grid size-full place-items-center text-[24px] font-semibold text-accent">
                  SG
                </span>
              )}
              <label className="absolute inset-0 grid cursor-pointer place-items-center bg-black/0 text-transparent transition group-hover:bg-black/45 group-hover:text-white">
                <Camera size={18} />
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={(event) => add(setAvatar, event.target.files)}
                />
              </label>
            </div>
            <b className="mt-3 text-[10px]">Sofia Garcia</b>
            <span className="text-[8px] text-muted">Workspace administrator</span>
            <div className="mt-3 flex gap-2">
              <label className="ui-button ui-button--sm ui-button--outline cursor-pointer">
                {avatarUrl ? "Replace photo" : "Choose photo"}
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={(event) => add(setAvatar, event.target.files)}
                />
              </label>
              <Button size="sm" variant="ghost" disabled={!avatarUrl} onClick={() => setAvatar([])}>
                Remove
              </Button>
            </div>
          </div>
        </Card>

        <Card title="Cover photo upload">
          <div className="relative h-48 overflow-hidden rounded-xl border border-border bg-[linear-gradient(135deg,var(--surface-alt),color-mix(in_srgb,var(--accent)_14%,var(--surface)))]">
            {coverUrl ? (
              <Image
                src={coverUrl}
                alt="Selected cover preview"
                fill
                unoptimized
                className="object-cover"
              />
            ) : (
              <div className="grid h-full place-items-center text-center">
                <ImagePlus size={22} className="text-accent" />
                <b className="mt-2 text-[9px]">Add a workspace cover</b>
                <span className="text-[8px] text-muted">Recommended 1600 × 480</span>
              </div>
            )}
            <div className="absolute bottom-3 right-3 flex gap-2">
              <label className="ui-button ui-button--sm cursor-pointer bg-surface! text-foreground!">
                {coverUrl ? "Replace cover" : "Upload cover"}
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={(event) => add(setCover, event.target.files)}
                />
              </label>
              {coverUrl && (
                <Button size="sm" variant="destructive" onClick={() => setCover([])}>
                  <Trash2 size={11} />
                  Remove
                </Button>
              )}
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <Card title="Single image upload">
          <div className="grid gap-4 sm:grid-cols-[150px_1fr]">
            <div className="relative aspect-square overflow-hidden rounded-xl border border-dashed border-border bg-surface-alt">
              {singleUrl ? (
                <Image
                  src={singleUrl}
                  alt="Selected image preview"
                  fill
                  unoptimized
                  className="object-cover"
                />
              ) : (
                <label className="grid size-full cursor-pointer place-items-center text-center">
                  <span>
                    <ImagePlus size={20} className="mx-auto text-accent" />
                    <b className="mt-2 block text-[8px]">Choose image</b>
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={(event) => add(setSingle, event.target.files)}
                  />
                </label>
              )}
            </div>
            <div className="min-w-0">
              {single[0] ? (
                <>
                  <b className="block truncate text-[9px]">{single[0].name}</b>
                  <span className="mt-1 block text-[8px] text-muted">
                    {formatSize(single[0].size)} · {single[0].type || "Image"}
                  </span>
                  <div className="mt-4 flex gap-2">
                    <label className="ui-button ui-button--sm ui-button--outline cursor-pointer">
                      Replace
                      <input
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={(event) => add(setSingle, event.target.files)}
                      />
                    </label>
                    <Button size="sm" variant="ghost" onClick={() => setSingle([])}>
                      Remove
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <b className="text-[9px]">Product thumbnail</b>
                  <p className="mt-1 text-[8px] leading-4 text-muted">
                    Select one local image to preview its filename, type, and size.
                  </p>
                </>
              )}
            </div>
          </div>
        </Card>

        <Card title="Multiple image gallery" action={<Badge>{gallery.length} selected</Badge>}>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {galleryUrls.map((url, index) => (
              <div
                key={url}
                className="group relative aspect-square overflow-hidden rounded-lg border border-border"
              >
                <Image
                  src={url}
                  alt={`Selected gallery image ${index + 1}`}
                  fill
                  unoptimized
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() =>
                    setGallery((items) => items.filter((_, itemIndex) => itemIndex !== index))
                  }
                  aria-label={`Remove ${gallery[index].name}`}
                  className="absolute right-1.5 top-1.5 grid size-6 place-items-center rounded-full bg-black/60 text-white opacity-0 transition group-hover:opacity-100 focus:opacity-100"
                >
                  <X size={11} />
                </button>
                <span className="absolute inset-x-0 bottom-0 truncate bg-black/55 px-2 py-1 text-[7px] text-white">
                  {formatSize(gallery[index].size)}
                </span>
              </div>
            ))}
            <label className="grid aspect-square cursor-pointer place-items-center rounded-lg border border-dashed border-border bg-surface-alt text-center hover:border-accent">
              <span>
                <Plus size={17} className="mx-auto text-accent" />
                <b className="mt-1 block text-[7px]">Add images</b>
              </span>
              <input
                type="file"
                multiple
                accept="image/*"
                className="sr-only"
                onChange={(event) => add(setGallery, event.target.files, true)}
              />
            </label>
          </div>
          {gallery.length > 0 && (
            <button className="mt-3 text-[8px] text-danger" onClick={() => setGallery([])}>
              Clear all images
            </button>
          )}
        </Card>
      </div>

      <Card
        title="Media library uploader"
        action={<Badge>{media.length ? `${media.length} local` : "Demo library"}</Badge>}
      >
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {["Campaign", "Workspace", "Product"].map((name, index) => (
            <button
              type="button"
              key={name}
              className={`relative aspect-[4/3] overflow-hidden rounded-lg border p-2 text-left ${index === 0 ? "border-accent ring-1 ring-accent" : "border-border"}`}
            >
              <span
                className={`absolute inset-0 ${index === 0 ? "bg-accent/15" : index === 1 ? "bg-blue-500/10" : "bg-rose-500/10"}`}
              />
              <span className="absolute bottom-2 left-2 text-[7px] font-medium">{name} media</span>
              {index === 0 && <CheckBadge />}
            </button>
          ))}
          {mediaUrls.map((url, index) => (
            <div
              key={url}
              className="relative aspect-[4/3] overflow-hidden rounded-lg border border-border"
            >
              <Image
                src={url}
                alt={`Local media ${index + 1}`}
                fill
                unoptimized
                className="object-cover"
              />
            </div>
          ))}
          <label className="grid aspect-[4/3] cursor-pointer place-items-center rounded-lg border border-dashed border-border bg-surface-alt">
            <span className="text-center">
              <Plus size={15} className="mx-auto text-accent" />
              <b className="mt-1 block text-[7px]">Add media</b>
            </span>
            <input
              type="file"
              multiple
              accept="image/*"
              className="sr-only"
              onChange={(event) => add(setMedia, event.target.files, true)}
            />
          </label>
        </div>
      </Card>

      <Card title="Product image uploader">
        <div className="grid gap-3 lg:grid-cols-[1.2fr_.8fr]">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {productUrls.map((url, index) => (
              <div
                key={url}
                className={`relative aspect-square overflow-hidden rounded-lg border ${index === 0 ? "border-accent ring-1 ring-accent" : "border-border"}`}
              >
                <Image
                  src={url}
                  alt={`Product image ${index + 1}`}
                  fill
                  unoptimized
                  className="object-cover"
                />
                {index === 0 && (
                  <span className="absolute left-2 top-2 rounded bg-accent px-2 py-1 text-[7px] text-white">
                    Featured
                  </span>
                )}
              </div>
            ))}
            <label className="grid aspect-square cursor-pointer place-items-center rounded-lg border border-dashed border-border bg-surface-alt">
              <span className="text-center">
                <Package size={17} className="mx-auto text-accent" />
                <b className="mt-2 block text-[7px]">Add product image</b>
              </span>
              <input
                type="file"
                multiple
                accept="image/*"
                className="sr-only"
                onChange={(event) => add(setProduct, event.target.files, true)}
              />
            </label>
          </div>
          <aside className="rounded-xl border border-border bg-surface-alt p-4">
            <b className="text-[9px]">Image guidance</b>
            <ul className="mt-3 grid gap-2 text-[8px] text-muted">
              <li>• First image becomes featured</li>
              <li>• Use a square aspect ratio</li>
              <li>• Keep backgrounds consistent</li>
              <li>• Local previews only</li>
            </ul>
            {product.length > 0 && (
              <Button size="sm" variant="outline" className="mt-4" onClick={() => setProduct([])}>
                Clear images
              </Button>
            )}
          </aside>
        </div>
      </Card>
    </div>
  );
}

function CheckBadge() {
  return (
    <span className="absolute right-2 top-2 grid size-5 place-items-center rounded-full bg-accent text-[8px] text-white">
      ✓
    </span>
  );
}

"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { Button } from "@/components/ui/button";

import Image from "next/image";
import Link from "next/link";
import { amenityOptions } from "@/lib/amenities";
import type { ShopView } from "@/types";
import { Icon } from "@/components/ui/icon";
import { useJournal } from "@/components/providers/journal-provider";

export function BookmarkButton({
  shop,
  showLabel = false,
}: {
  shop: ShopView;
  showLabel?: boolean;
}) {
  const { saved, toggleSaved } = useJournal();
  const isSaved = saved.includes(shop.slug);
  return (
    <Button
      variant="secondary"
      type="button"
      className={showLabel ? "button button-soft" : "bookmark-button"}
      aria-label={`${isSaved ? "Unsave" : "Save"} ${shop.name}`}
      aria-pressed={isSaved}
      onClick={() => toggleSaved(shop.slug)}
    >
      <Icon name="bookmark" size={17} fill={isSaved} />
      {showLabel && (isSaved ? "Saved to list" : "Save to list")}
    </Button>
  );
}

export function AmenityTags({
  shop,
  limit = 3,
}: {
  shop: ShopView;
  limit?: number;
}) {
  return (
    <div className="amenity-tags">
      {shop.amenities.slice(0, limit).map((id) => {
        const option = amenityOptions.find((item) => item.id === id)!;
        const label =
          id === "wifi"
            ? `${shop.wifi} Mbps`
            : id === "outlets"
              ? shop.outlets
              : option.label;
        return (
          <Badge
            variant="secondary"
            className="h-auto whitespace-normal"
            key={id}
          >
            <Icon name={option.icon} size={13} />
            {label}
          </Badge>
        );
      })}
    </div>
  );
}

export function ShopCard({
  shop,
  featured = false,
  grid = false,
}: {
  shop: ShopView;
  featured?: boolean;
  grid?: boolean;
}) {
  return (
    <Card
      role="article"
      className={`shop-card gap-4 p-3 shadow-sm ${grid ? "shop-card-grid flex-col" : "flex-col sm:flex-row"}`}
    >
      <div className="shop-card-image">
        <Link href={`/shops/${shop.slug}`} tabIndex={-1} aria-hidden="true">
          <Image
            src={shop.image}
            alt=""
            fill
            sizes={
              grid
                ? "(max-width: 640px) 92vw, (max-width: 1024px) 45vw, 30vw"
                : "(max-width: 639px) 92vw, 220px"
            }
            preload={featured}
            className="object-cover"
          />
        </Link>
        <Badge className="image-category">{shop.category}</Badge>
        <BookmarkButton shop={shop} />
      </div>
      <div className="shop-card-content">
        <div className="flex items-center justify-between gap-2">
          <span className="eyebrow text-muted-foreground">
            {shop.neighborhood}
          </span>
          <span className="rating">
            <Icon name="star" size={14} fill />
            <strong>{shop.rating.toFixed(1)}</strong>
            <span className="rating-count">({shop.reviews})</span>
          </span>
        </div>
        <h2>
          <Link href={`/shops/${shop.slug}`}>{shop.name}</Link>
        </h2>
        <p className="shop-description">{shop.description}</p>
        <AmenityTags shop={shop} />
        <div className="shop-card-meta">
          <span className="flex items-center gap-1.5">
            <span className="status-dot" />
            {shop.noise}
          </span>
          <span>
            {"$".repeat(shop.price)}
            <span className="mx-2 opacity-40">·</span>
            {shop.distance} mi away
          </span>
        </div>
      </div>
    </Card>
  );
}

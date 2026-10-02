"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { Toggle } from "@/components/ui/toggle";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import { Button } from "@/components/ui/button";
import { LinkButton } from "@/components/ui/link-button";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import mascot from "@public/brand/cuptrail-mascot.png";
import { useShopLookup } from "@/hooks/use-shop-lookup";
import { formatVisitDate } from "@/lib/format";
import type { ShopView, Visit } from "@/types";
import { useJournal } from "@/components/providers/journal-provider";
import { Icon } from "@/components/ui/icon";
import { ShopCard } from "./shop-card";

export function MyShops() {
  const { visits, saved, startJournal, showExamples, notify } = useJournal();
  const {
    shops: shopsBySlug,
    loading,
    failed,
  } = useShopLookup([...visits.map((visit) => visit.shopId), ...saved]);
  const [tab, setTab] = useState<"all" | "favorites" | "work" | "saved">("all");
  const [sort, setSort] = useState("recent");
  const [layout, setLayout] = useState<"grid" | "list">("grid");
  const [query, setQuery] = useState("");
  const isExample = visits.some((visit) => visit.example);
  const uniqueShops = new Set(visits.map((visit) => visit.shopId)).size;
  const average = visits.length
    ? (
        visits.reduce((sum, visit) => sum + visit.stars, 0) / visits.length
      ).toFixed(1)
    : "—";
  const hours = visits.reduce((sum, visit) => sum + visit.duration, 0);
  const filtered = visits
    .flatMap((visit) => {
      const shop = shopsBySlug.get(visit.shopId);
      return shop ? [{ visit, shop }] : [];
    })
    .filter(({ visit, shop }) => {
      return (
        (tab !== "favorites" || visit.stars === 5) &&
        (tab !== "work" || visit.amenities.includes("wifi")) &&
        `${shop.name} ${shop.neighborhood} ${visit.note}`
          .toLowerCase()
          .includes(query.toLowerCase())
      );
    })
    .sort(({ visit: a }, { visit: b }) =>
      sort === "rating"
        ? b.stars - a.stars
        : sort === "frequent"
          ? visits.filter((visit) => visit.shopId === b.shopId).length -
            visits.filter((visit) => visit.shopId === a.shopId).length
          : new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
  const allSavedShops = saved.flatMap((slug) => shopsBySlug.get(slug) ?? []);
  const savedShops = allSavedShops.filter((shop) =>
    `${shop.name} ${shop.neighborhood}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );
  function exportJournal() {
    const blob = new Blob(
      [
        JSON.stringify(
          {
            exportedAt: new Date().toISOString(),
            visits,
            savedShops: allSavedShops,
          },
          null,
          2,
        ),
      ],
      { type: "application/json" },
    );
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "cuptrail-journal.json";
    anchor.click();
    URL.revokeObjectURL(url);
    notify("Your journal export is ready.");
  }

  return (
    <main id="main-content" className="page-width journal-main">
      <div className="journal-heading">
        <div>
          <p className="eyebrow mb-2 text-primary">
            Your personal coffee trail
          </p>
          <h1>My shops</h1>
          <p className="journal-description">
            Your visits, favorite corners, and places to try next.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            className="button button-white"
            onClick={exportJournal}
          >
            <Icon name="download" size={16} />
            Export journal
          </Button>
          <LinkButton
            variant="default"
            href="/log-visit"
            className="button button-dark"
          >
            <Icon name="plus" size={17} />
            Log new visit
          </LinkButton>
        </div>
      </div>
      <div className="journal-info">
        <span className="flex items-center gap-2">
          <Icon name={isExample ? "book" : "lock"} size={15} />
          {isExample
            ? "A peek at your future journal · example entries"
            : "Your journal is private and saved on this device."}
        </span>
        {isExample && (
          <Button variant="ghost" onClick={startJournal}>
            Start my own journal
            <Icon name="arrow" size={14} />
          </Button>
        )}
      </div>
      <div className="journal-stats">
        {[
          {
            label: "Shops explored",
            value: uniqueShops,
            detail: "Little places, good memories",
            icon: "coffee" as const,
          },
          {
            label: "Average rating",
            value: average,
            detail: "Your personal taste",
            icon: "star" as const,
          },
          {
            label: "Visits logged",
            value: visits.length,
            detail: "Every stop has a story",
            icon: "book" as const,
          },
          {
            label: "Time well spent",
            value: `${hours}h`,
            detail: "A little slower, a little better",
            icon: "clock" as const,
          },
        ].map((stat) => (
          <div key={stat.label}>
            <span className="eyebrow flex items-center justify-between">
              {stat.label}
              <Icon name={stat.icon} size={16} className="text-primary" />
            </span>
            <strong>{stat.value}</strong>
            <span className="stat-description">{stat.detail}</span>
          </div>
        ))}
      </div>
      <div className="journal-controls">
        <label className="journal-search">
          <Icon name="search" size={17} />
          <span className="journal-search-label">
            <span className="eyebrow">Search your journal</span>
            <Input
              className="h-auto border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
              type="search"
              aria-label="Search your journal"
              placeholder="Shop name or notes…"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </span>
        </label>
        <div className="flex items-center gap-3">
          <label className="sort-control">
            <span>Sort:</span>
            <NativeSelect
              value={sort}
              onChange={(event) => setSort(event.target.value)}
              aria-label="Sort journal"
            >
              <option value="recent">Recently visited</option>
              <option value="rating">Highest rated</option>
              <option value="frequent">Most frequent</option>
            </NativeSelect>
          </label>
          <div className="view-toggle journal-layout-toggle">
            <Toggle
              className="text-foreground"
              variant="default"
              onPressedChange={() => setLayout("grid")}
              aria-label="Grid layout"
              pressed={layout === "grid"}
            >
              <Icon name="grid" size={16} />
            </Toggle>
            <Toggle
              className="text-foreground"
              variant="default"
              onPressedChange={() => setLayout("list")}
              aria-label="List layout"
              pressed={layout === "list"}
            >
              <Icon name="list" size={16} />
            </Toggle>
          </div>
        </div>
      </div>
      <Tabs value={tab} onValueChange={(value) => setTab(value as typeof tab)}>
        <TabsList
          className="journal-tabs max-w-full justify-start overflow-x-auto group-data-horizontal/tabs:h-auto group-data-horizontal/tabs:min-h-13"
          aria-label="Journal filters"
        >
          {(
            [
              { id: "all", label: "All visits", count: visits.length },
              {
                id: "favorites",
                label: "Favorites",
                count: visits.filter((visit) => visit.stars === 5).length,
              },
              {
                id: "work",
                label: "Work-friendly",
                count: visits.filter((visit) =>
                  visit.amenities.includes("wifi"),
                ).length,
              },
              { id: "saved", label: "Saved for later", count: saved.length },
            ] as const
          ).map((item) => (
            <TabsTrigger key={item.id} value={item.id} className="min-h-11">
              {item.id === "saved" && <Icon name="bookmark" size={13} />}{" "}
              {item.label}
              <Badge variant="secondary">{item.count}</Badge>
            </TabsTrigger>
          ))}
        </TabsList>
        {(["all", "favorites", "work", "saved"] as const).map((panel) => (
          <TabsContent key={panel} value={panel}>
            {tab === panel &&
              (loading ? (
                <div className="empty-state" role="status">
                  <Icon name="coffee" size={30} />
                  <p>Opening your journal…</p>
                </div>
              ) : (
                <>
                  {failed && (
                    <p role="alert" className="form-error">
                      Some shop details could not load. Refresh to try again.
                    </p>
                  )}
                  {tab === "saved" ? (
                    <div className="saved-grid">
                      {savedShops.map((shop) => (
                        <ShopCard key={shop.slug} shop={shop} grid />
                      ))}
                    </div>
                  ) : (
                    <div
                      className={`journal-grid ${layout === "list" ? "journal-list" : ""}`}
                    >
                      {filtered.map(({ visit, shop }) => (
                        <VisitCard
                          key={visit.id}
                          visit={visit}
                          shop={shop}
                          count={
                            visits.filter(
                              (item) => item.shopId === visit.shopId,
                            ).length
                          }
                        />
                      ))}
                      {filtered.length > 0 && (
                        <Link href="/log-visit" className="new-visit-card">
                          <span>
                            <Icon name="plus" size={26} />
                          </span>
                          <h2>Another coffee, another chapter.</h2>
                          <p>Keep a little note from your next discovery.</p>
                          <span className="eyebrow text-primary">
                            Log a new visit <Icon name="arrow" size={14} />
                          </span>
                        </Link>
                      )}
                    </div>
                  )}
                  {(tab === "saved"
                    ? savedShops.length === 0
                    : filtered.length === 0) && (
                    <div className="empty-state">
                      <Image
                        src={mascot}
                        alt=""
                        width={128}
                        height={128}
                        sizes="128px"
                        className="empty-mascot"
                      />
                      <h2>
                        {query
                          ? "No matches in your journal."
                          : tab === "saved"
                            ? "No saved shops yet."
                            : tab === "favorites"
                              ? "No five-star visits yet."
                              : tab === "work"
                                ? "No work-friendly visits yet."
                                : "Your first visit starts here."}
                      </h2>
                      <p>
                        {query
                          ? "Try a different search or filter."
                          : tab === "saved"
                            ? "Tap the bookmark on a shop to keep it for another day."
                            : tab === "favorites"
                              ? "Visits you rate five stars will appear here."
                              : tab === "work"
                                ? "Visits you log with Wi-Fi will appear here."
                                : "Discover a spot you love, then log your first visit."}
                      </p>
                      <LinkButton
                        variant="default"
                        href="/shops"
                        className="button button-dark"
                      >
                        Discover coffee shops
                        <Icon name="arrow" size={16} />
                      </LinkButton>
                    </div>
                  )}
                </>
              ))}
          </TabsContent>
        ))}
      </Tabs>
      {visits.length === 0 && tab !== "saved" && (
        <div className="flex justify-center">
          <Button variant="ghost" className="text-link" onClick={showExamples}>
            Take a peek at an example journal
            <Icon name="book" size={15} />
          </Button>
        </div>
      )}
      <div className="journal-bottom-note">
        <Icon name="lock" size={14} />
        <span>
          {isExample
            ? "Example notes are replaced when you save your first visit."
            : "Your notes and photos stay in this browser. Export your journal to keep a copy."}
        </span>
      </div>
    </main>
  );
}

function VisitCard({
  visit,
  shop,
  count,
}: {
  visit: Visit;
  shop: ShopView;
  count: number;
}) {
  const { removeVisit } = useJournal();
  return (
    <Card
      role="article"
      className="visit-card group gap-0 p-0 [.journal-list_&]:sm:flex-row"
    >
      <div className="visit-card-image">
        <Link
          href={`/shops/${shop.slug}`}
          className="absolute inset-0"
          tabIndex={-1}
          aria-hidden="true"
        >
          <Image
            src={visit.photos[0] ?? shop.journalImage}
            alt=""
            fill
            sizes="(max-width: 639px) 100px, (max-width: 1023px) 45vw, 30vw"
            unoptimized={Boolean(visit.photos[0])}
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </Link>
        <span className="visit-date">{formatVisitDate(visit.date)}</span>
        <span
          className="visit-rating"
          aria-label={`Rated ${visit.stars} out of 5`}
        >
          <Icon name="star" fill size={13} />
          {visit.stars}.0
        </span>
      </div>
      <div className="visit-card-content">
        <div className="flex items-center justify-between gap-2">
          <span className="eyebrow text-primary">{shop.neighborhood}</span>
          <span className="text-[11px] text-muted-foreground">
            {count} {count === 1 ? "visit" : "visits"}
          </span>
        </div>
        <h2>
          <Link href={`/shops/${shop.slug}`}>{shop.name}</Link>
        </h2>
        <p className="visit-note">
          {visit.note ? `“${visit.note}”` : "A coffee stop worth remembering."}
        </p>
        <div className="visit-atmosphere">
          <span className="eyebrow">Atmosphere</span>
          <span>
            <span className="status-dot" />
            {shop.noise}
          </span>
        </div>
        <div className="amenity-tags">
          {visit.orders.slice(0, 2).map((order) => (
            <Badge
              variant="secondary"
              className="h-auto whitespace-normal"
              key={order}
            >
              {order}
            </Badge>
          ))}
          <Badge variant="secondary" className="h-auto">
            <Icon name="clock" size={12} />
            {visit.duration}h
          </Badge>
        </div>
        {!visit.example && (
          <Button
            variant="destructive"
            className="visit-delete"
            aria-label={`Remove visit to ${shop.name} on ${formatVisitDate(visit.date)}`}
            onClick={() => removeVisit(visit.id)}
          >
            <Icon name="close" size={12} />
            Remove visit
          </Button>
        )}
      </div>
    </Card>
  );
}

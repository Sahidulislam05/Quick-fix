"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { cn } from "@/lib/utils";
import type { Category } from "@/types/category";

export type ServiceFilterValues = {
  search: string;
  categoryId: string;
  location: string;
  minRating: string;
  minPrice: string;
  maxPrice: string;
};

type ServiceFilterPanelProps = {
  categories: Category[];
  values: ServiceFilterValues;
  onChange: (next: Partial<ServiceFilterValues>) => void;
  className?: string;
};

const RATING_OPTIONS = [
  { value: "any", label: "Any rating" },
  { value: "3", label: "3+ stars" },
  { value: "4", label: "4+ stars" },
  { value: "4.5", label: "4.5+ stars" },
];

export function ServiceFilterPanel({
  categories,
  values,
  onChange,
  className,
}: ServiceFilterPanelProps) {
  // সার্চ/লোকেশন/দাম টাইপ করার সময় সাথে সাথে URL আপডেট না করে ৪০০ms পর করছি
  const [searchInput, setSearchInput] = useState(values.search);
  const [locationInput, setLocationInput] = useState(values.location);
  const [minPriceInput, setMinPriceInput] = useState(values.minPrice);
  const [maxPriceInput, setMaxPriceInput] = useState(values.maxPrice);

  const debouncedSearch = useDebouncedValue(searchInput);
  const debouncedLocation = useDebouncedValue(locationInput);
  const debouncedMinPrice = useDebouncedValue(minPriceInput);
  const debouncedMaxPrice = useDebouncedValue(maxPriceInput);

  useEffect(() => {
    if (debouncedSearch !== values.search)
      onChange({ search: debouncedSearch });
    // biome-ignore lint/correctness/useExhaustiveDependencies: শুধু debouncedSearch বদলালেই চালাতে চাই
  }, [debouncedSearch]);

  useEffect(() => {
    if (debouncedLocation !== values.location)
      onChange({ location: debouncedLocation });
    // biome-ignore lint/correctness/useExhaustiveDependencies: শুধু debouncedLocation বদলালেই চালাতে চাই
  }, [debouncedLocation]);

  useEffect(() => {
    if (debouncedMinPrice !== values.minPrice)
      onChange({ minPrice: debouncedMinPrice });
    // biome-ignore lint/correctness/useExhaustiveDependencies: শুধু debouncedMinPrice বদলালেই চালাতে চাই
  }, [debouncedMinPrice]);

  useEffect(() => {
    if (debouncedMaxPrice !== values.maxPrice)
      onChange({ maxPrice: debouncedMaxPrice });
    // biome-ignore lint/correctness/useExhaustiveDependencies: শুধু debouncedMaxPrice বদলালেই চালাতে চাই
  }, [debouncedMaxPrice]);

  function reset() {
    setSearchInput("");
    setLocationInput("");
    setMinPriceInput("");
    setMaxPriceInput("");
    onChange({
      search: "",
      categoryId: "",
      location: "",
      minRating: "",
      minPrice: "",
      maxPrice: "",
    });
  }

  return (
    <div className={cn("space-y-5", className)}>
      <div className="space-y-1.5">
        <Label htmlFor="filter-search">Search</Label>
        <Input
          id="filter-search"
          placeholder="e.g. pipe leak, AC repair"
          className="h-10"
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="filter-category">Category</Label>
        <Select
          value={values.categoryId || "all"}
          onValueChange={(value) =>
            onChange({ categoryId: value === "all" ? "" : (value ?? "") })
          }
        >
          <SelectTrigger id="filter-category" className="h-10 w-full">
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.icon} {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="filter-location">Location</Label>
        <Input
          id="filter-location"
          placeholder="e.g. Dhaka"
          className="h-10"
          value={locationInput}
          onChange={(event) => setLocationInput(event.target.value)}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="filter-rating">Minimum rating</Label>
        <Select
          value={values.minRating || "any"}
          onValueChange={(value) =>
            onChange({ minRating: value === "any" ? "" : (value ?? "") })
          }
        >
          <SelectTrigger id="filter-rating" className="h-10 w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {RATING_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label>Price range (৳)</Label>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            placeholder="Min"
            className="h-10"
            value={minPriceInput}
            onChange={(event) => setMinPriceInput(event.target.value)}
          />
          <span className="text-muted-foreground">–</span>
          <Input
            type="number"
            placeholder="Max"
            className="h-10"
            value={maxPriceInput}
            onChange={(event) => setMaxPriceInput(event.target.value)}
          />
        </div>
      </div>

      <Button variant="ghost" size="sm" className="w-full" onClick={reset}>
        Clear all filters
      </Button>
    </div>
  );
}

import Link from "next/link";
import type { Category } from "@/types/category";

export function CategoryCard({ category }: { category: Category }) {
  return (
    <Link
      href={`/services?categoryId=${category.id}`}
      className="group flex flex-col items-center gap-2 rounded-xl border bg-card p-5 text-center transition-shadow hover:shadow-md"
    >
      <span className="text-3xl">{category.icon}</span>
      <span className="text-sm font-medium group-hover:text-primary">
        {category.name}
      </span>
      {category._count && (
        <span className="text-xs text-muted-foreground">
          {category._count.services} services
        </span>
      )}
    </Link>
  );
}

import { apiClient } from "@/lib/api-client";
import type { Category } from "@/types/category";

export async function getCategories() {
  const res = await apiClient<{ data: { categories: Category[] } }>(
    "/categories",
  );
  return res.data.categories;
}

export async function getCategoryById(id: string) {
  const res = await apiClient<{ data: { category: Category } }>(
    `/categories/${id}`,
  );
  return res.data.category;
}

export type CategoryPayload = {
  name: string;
  description: string;
  icon: string;
};

// ✅ যাচাই করা: data.category
export async function createCategory(payload: CategoryPayload) {
  const res = await apiClient<{ data: { category: Category } }>("/categories", {
    method: "POST",
    body: payload,
  });
  return res.data.category;
}

export async function updateCategory(
  id: string,
  payload: Partial<CategoryPayload>,
) {
  const res = await apiClient<{ data: Category }>(`/categories/${id}`, {
    method: "PATCH",
    body: payload,
  });
  return res.data;
}

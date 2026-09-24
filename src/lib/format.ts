const numberFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 2,
});

export function formatPrice(amount: number | string) {
  const value = typeof amount === "string" ? Number(amount) : amount;
  return `৳${numberFormatter.format(value)}`;
}

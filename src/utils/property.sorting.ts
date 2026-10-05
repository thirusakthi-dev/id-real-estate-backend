export type PropertySort = "price_asc" | "price_desc" | "latest";

export function getPropertySort(sort?: PropertySort) {
  switch (sort) {
    case "price_asc":
      return {
        price: "asc" as const,
      };

    case "price_desc":
      return {
        price: "desc" as const,
      };

    case "latest":
    default:
      return {
        createdAt: "desc" as const,
      };
  }
}

import { Dictionary } from "../types/Dictionary";

export function groupby<T>(list: T[], sel: (item: T) => string): Dictionary<T> {
  return list.reduce((acc: Dictionary<T>, item: T) => {
    const key = sel(item);
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(item);
    return acc;
  }, {});
}

import { listPathElement } from "./listPathElement";

const generateTranslationKey = (path: string): string => {
  if (path === "/") {
    return "breadcrumbs.home";
  }

  const formattedPath = path.slice(1).replace(/-/g, "_");

  return `breadcrumbs.${formattedPath}`;
};

export const breadcrumbMapping: Record<string, string> = listPathElement.reduce(
  (acc, { path }) => {
    acc[path] = generateTranslationKey(path);
    return acc;
  },
  {} as Record<string, string>
);
import { useRoutes } from "react-router-dom";
import type { RouteObject } from "react-router-dom";
import RootLayout from "./components/RootLayout";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import BlogHub from "./pages/blog/BlogHub";
import PillarPage from "./pages/blog/PillarPage";
import ArticlePage from "./pages/blog/ArticlePage";
import InspirationPage from "./pages/InspirationPage";
import BeforeAfterPage from "./pages/BeforeAfterPage";
import PalettePage from "./pages/PalettePage";
import PillarLandingPage from "./pages/PillarLandingPage";
import MaterialsHub from "./pages/materials/MaterialsHub";
import MaterialPage from "./pages/materials/MaterialPage";
import ConcreteDrivewayGuide from "./pages/guides/ConcreteDrivewayGuide";
import { allArticles, inspirationPages, beforeAfterPages, palettePages, allMaterialPages } from "./content";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <Index /> },
      { path: "patio", element: <PillarLandingPage pillar="patio" /> },
      { path: "driveway", element: <PillarLandingPage pillar="driveway" /> },
      { path: "walkway", element: <PillarLandingPage pillar="walkway" /> },
      { path: "blog", element: <BlogHub /> },
      { path: "blog/:pillar", element: <PillarPage /> },
      { path: "blog/:pillar/:slug", element: <ArticlePage /> },
      { path: "inspiration/:slug", element: <InspirationPage /> },
      { path: "before-after/:slug", element: <BeforeAfterPage /> },
      { path: "palette/:slug", element: <PalettePage /> },
      { path: "guides/concrete-driveway", element: <ConcreteDrivewayGuide /> },
      { path: "materials", element: <MaterialsHub /> },
      { path: "materials/:slug", element: <MaterialPage /> },
      { path: "*", element: <NotFound /> },
    ],
  },
];

export const staticPaths = [
  "/",
  "/patio",
  "/driveway",
  "/walkway",
  "/blog",
  "/blog/patio",
  "/blog/driveway",
  "/blog/walkway",
  "/guides/concrete-driveway",
  "/materials",
];

export const dynamicPaths = [
  ...allArticles.map((a) => `/blog/${a.pillar}/${a.slug}`),
  ...inspirationPages.map((p) => `/inspiration/${p.slug}`),
  ...beforeAfterPages.map((p) => `/before-after/${p.slug}`),
  ...palettePages.map((p) => `/palette/${p.slug}`),
  ...allMaterialPages.map((m) => `/materials/${m.slug}`),
];

export default function App() {
  return useRoutes(routes);
}

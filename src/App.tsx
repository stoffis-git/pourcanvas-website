import type { RouteRecord } from "vite-react-ssg";
import RootLayout from "./components/RootLayout";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import BlogHub from "./pages/blog/BlogHub";
import PillarPage from "./pages/blog/PillarPage";
import ArticlePage from "./pages/blog/ArticlePage";
import InspirationPage from "./pages/InspirationPage";
import MaterialsHub from "./pages/materials/MaterialsHub";
import MaterialPage from "./pages/materials/MaterialPage";
import ConcreteDrivewayGuide from "./pages/guides/ConcreteDrivewayGuide";
import { allArticles, inspirationPages, allMaterialPages } from "./content";

export const routes: RouteRecord[] = [
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <Index /> },
      { path: "blog", element: <BlogHub /> },
      {
        path: "blog/:pillar",
        element: <PillarPage />,
        getStaticPaths: () => ["blog/patio", "blog/driveway", "blog/walkway"],
      },
      {
        path: "blog/:pillar/:slug",
        element: <ArticlePage />,
        getStaticPaths: () => allArticles.map((a) => `blog/${a.pillar}/${a.slug}`),
      },
      {
        path: "inspiration/:slug",
        element: <InspirationPage />,
        getStaticPaths: () => inspirationPages.map((p) => `inspiration/${p.slug}`),
      },
      { path: "guides/concrete-driveway", element: <ConcreteDrivewayGuide /> },
      { path: "materials", element: <MaterialsHub /> },
      {
        path: "materials/:slug",
        element: <MaterialPage />,
        getStaticPaths: () => allMaterialPages.map((m) => `materials/${m.slug}`),
      },
      { path: "*", element: <NotFound /> },
    ],
  },
];

export default routes;

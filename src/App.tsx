import type { RouteRecord } from "vite-react-ssg";
import RootLayout from "./components/RootLayout";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import BlogHub from "./pages/blog/BlogHub";
import PillarPage from "./pages/blog/PillarPage";
import ArticlePage from "./pages/blog/ArticlePage";
import InspirationPage from "./pages/InspirationPage";
import { allArticles, inspirationPages } from "./content";

export const routes: RouteRecord[] = [
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <Index /> },
      { path: "blog", element: <BlogHub /> },
      { path: "blog/patio", element: <PillarPage /> },
      { path: "blog/driveway", element: <PillarPage /> },
      { path: "blog/walkway", element: <PillarPage /> },
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
      { path: "*", element: <NotFound /> },
    ],
  },
];

export default routes;

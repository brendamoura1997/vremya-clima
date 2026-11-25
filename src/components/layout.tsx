import type { PropsWithChildren } from "react";
import { useLocation } from "react-router-dom";
import Header from "./header";
import IntroLandscape from "./intro-landscape";

const Layout = ({ children }: PropsWithChildren) => {
  const { pathname } = useLocation();

  return (
    <div className="bg-gradient-to-br from-background to-muted">
      <Header />
      {pathname === "/" && <IntroLandscape />}
      <main className="min-h-screen container mx-auto px-4 py-8">
        {children}
      </main>
      <footer
        className="border-t backdrop-blur py-12 supports-[backdrop-filter]
      :bg-background/60"
      >
        <div className="container mx-auto px-4 text-center text-gray-400">
          <p>Website by Brenda Moura</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
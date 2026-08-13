//#region imports
import { useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";
import { Outlet } from "react-router";
import styles from "./MainLayout.module.scss";
//#endregion

export const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className={styles.layout}>
      <div className={styles.sidebarArea}>
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
      </div>

      <div className={styles.headerArea}>
        <Header onMenuToggle={() => setIsSidebarOpen(prev => !prev)} />
      </div>

      <main className={styles.content}>
        <Outlet />
      </main>
    </div>
  );
};

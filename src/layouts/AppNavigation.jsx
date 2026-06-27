import {
  ChartNoAxesCombined,
  History,
  House,
  NotebookTabs,
} from "lucide-react";

const AppNavigation = () => {
  return (
    <div
      className="
    fixed bottom-0 w-full bg-accent
    lg:left-0 lg:top-0 lg:h-screen lg:w-64
  "
    >
      <div className="flex flex-col h-full">
        <div className="flex-1">
          <nav className="flex justify-between pb-3 pt-2 px-1">
            <a
              href="/dashboard"
              className="px-4 hover:bg-gray-100 flex flex-col items-center justify-center text-[12px]"
            >
              <House />
              Asosiy
            </a>
            <a
              href="/firms"
              className="px-4 hover:bg-gray-100 flex flex-col items-center justify-center text-[12px]"
            >
              <NotebookTabs />
              Firmalar
            </a>
            <a
              href="/transactions"
              className="px-4 hover:bg-gray-100 flex flex-col items-center justify-center text-[12px]"
            >
              <History />
              Arxiv
            </a>
            <a
              href="/calendar"
              className="px-4 hover:bg-gray-100 flex flex-col items-center justify-center text-[12px]"
            >
              <ChartNoAxesCombined />
              Statistika
            </a>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default AppNavigation;

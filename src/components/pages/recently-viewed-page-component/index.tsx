import useResetAllBreadcrumbItems from "@/features/breadcrumb/hooks/use-reset-all-breadcrumb-items";
import useMobileHeaderTitle from "@/hooks/use-mobile-header-title";
import MainLayout from "@components/layout/main-layout";

const RecentlyViewedComponent: React.FC = () => {
  useMobileHeaderTitle("recently viewed");

  useResetAllBreadcrumbItems({
    shouldReset: true,
    addFirstBreadcrumbItem: {
      label: "recently viewed",
      path: "/storage/recently-viewed",
      key: "recently viewed",
      icon: "recent",
    },
  });

  return (
    <MainLayout showAddButton>
      <div>
        {Array.from({ length: 30 }).map((_, index) => (
          <div className="w-full py-52 text-center" key={index}>
            <h1>----------------recently viewed [{index + 1}]----------------</h1>
          </div>
        ))}
      </div>
    </MainLayout>
  );
};

export default RecentlyViewedComponent;

import { getFiles, getTotalSpaceUsed } from "@/lib/actions/file.actions";
import { getUsageSummary, constructFileUrl } from "@/lib/utils";
import Link from "next/link";
import { Models } from "node-appwrite";
import FormattedDateTime from "@/components/FormattedDateTime";
import ActionDropdown from "@/components/ActionDropdown";
import Thumbnail from "@/components/Thumbnail";
import Image from "next/image";
import StorageChart from "@/components/StorageChart";
import ActivityChart from "@/components/ActivityChart";

// Mock data for activity chart - In a real app, this would come from your backend
const activityData = [
  { date: '01/03', uploads: 4, downloads: 2 },
  { date: '02/03', uploads: 3, downloads: 4 },
  { date: '03/03', uploads: 5, downloads: 3 },
  { date: '04/03', uploads: 2, downloads: 6 },
  { date: '05/03', uploads: 6, downloads: 4 },
  { date: '06/03', uploads: 4, downloads: 3 },
  { date: '07/03', uploads: 3, downloads: 5 },
];

const Dashboard = async () => {
  const files = await getFiles({ types: [], searchText: "", sort: "$createdAt-desc" });
  const totalSpace = await getTotalSpaceUsed();
  
  if (!totalSpace) {
    return (
      <main className="dashboard-container">
        <p className="text-center text-gray-500">Carregando informações...</p>
      </main>
    );
  }

  const summary = getUsageSummary(totalSpace);
  
  // Prepare data for the storage chart
  const storageChartData = summary.map(item => ({
    name: item.title,
    size: parseInt(item.size),
    color: item.title === 'Documents' ? '#FF9B9D' :
           item.title === 'Images' ? '#3B82F6' :
           item.title === 'Media' ? '#10B981' :
           '#8B5CF6'
  }));

  return (
    <main className="dashboard-container">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Storage Usage Section */}
        <section className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
          <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
            Uso do Armazenamento
          </h2>
          <StorageChart data={storageChartData} totalSpace={2147483648} />
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {summary.map((item) => (
              <Link
                href={item.url}
                key={item.title}
                className="flex flex-col items-center rounded-lg p-3 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <div className={`card-icon ${item.title.toLowerCase()}-icon mb-2`}>
                  <Image
                    src={item.icon}
                    alt={item.title}
                    width={24}
                    height={24}
                    className="size-6"
                  />
                </div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {item.title}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {item.size}
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* Activity Chart Section */}
        <section className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
          <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
            Atividade Recente
          </h2>
          <ActivityChart data={activityData} />
          <div className="mt-4 flex items-center justify-center gap-6">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-brand" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Uploads</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-[#10B981]" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Downloads</span>
            </div>
          </div>
        </section>
      </div>

      {/* Recent Files Section */}
      <section className="mt-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Arquivos Recentes
          </h2>
          <Link
            href="/documents"
            className="text-sm text-brand transition-colors hover:text-brand/80 dark:text-brand-dark dark:hover:text-brand-dark/80"
          >
            Ver todos
          </Link>
        </div>

        {!files?.documents ? (
          <div className="space-y-4">
            <div className="h-16 animate-pulse rounded-lg bg-gray-100 dark:bg-gray-800" />
            <div className="h-16 animate-pulse rounded-lg bg-gray-100 dark:bg-gray-800" />
            <div className="h-16 animate-pulse rounded-lg bg-gray-100 dark:bg-gray-800" />
          </div>
        ) : files.documents.length > 0 ? (
          <div className="grid gap-4">
            {files.documents.slice(0, 5).map((file: Models.Document) => (
              <Link
                href={constructFileUrl(file.bucketFileId)}
                target="_blank"
                className="group flex items-center justify-between rounded-lg bg-white p-4 shadow-sm transition-all hover:shadow-md dark:bg-gray-800"
                key={file.$id}
              >
                <div className="flex items-center gap-4">
                  <Thumbnail
                    type={file.type}
                    extension={file.extension}
                    url={constructFileUrl(file.bucketFileId)}
                    className="size-12"
                  />
                  <div>
                    <p className="font-medium text-gray-900 group-hover:text-brand dark:text-white dark:group-hover:text-brand-dark">
                      {file.name}
                    </p>
                    <FormattedDateTime
                      date={file.$createdAt}
                      className="text-sm text-gray-500 dark:text-gray-400"
                    />
                  </div>
                </div>
                <ActionDropdown file={file} />
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400">
            Nenhum arquivo encontrado
          </p>
        )}
      </section>
    </main>
  );
};

export default Dashboard;


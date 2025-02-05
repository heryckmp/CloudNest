import { getFiles, getTotalSpaceUsed } from "@/lib/actions/file.actions";
import { getUsageSummary, constructFileUrl, calculatePercentage, formatStorageSize } from "@/lib/utils";
import Link from "next/link";
import { Models } from "node-appwrite";
import FormattedDateTime from "@/components/FormattedDateTime";
import ActionDropdown from "@/components/ActionDropdown";
import Thumbnail from "@/components/Thumbnail";
import Image from "next/image";

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
  const usedPercentage = calculatePercentage(totalSpace.used);
  const strokeDasharray = 2 * Math.PI * 90; // Circunferência do círculo
  const strokeDashoffset = strokeDasharray * ((100 - usedPercentage) / 100);
  const formattedUsed = formatStorageSize(totalSpace.used);
  const formattedTotal = formatStorageSize(2147483648); // 2GB fixo

  return (
    <main className="dashboard-container">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Storage Chart */}
        <section className="storage-section lg:col-span-1">
          <div className="relative flex flex-col items-center justify-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
            <div className="relative w-48 h-48">
              {/* Círculo de fundo */}
              <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 200 200">
                <circle
                  cx="100"
                  cy="100"
                  r="90"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-gray-200 dark:text-gray-700"
                />
                {/* Círculo de progresso animado */}
                <circle
                  cx="100"
                  cy="100"
                  r="90"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeLinecap="round"
                  className="text-brand dark:text-brand-dark transition-all duration-1000 ease-in-out"
                  style={{
                    strokeDasharray: `${strokeDasharray}px`,
                    strokeDashoffset: `${strokeDashoffset}px`,
                  }}
                />
              </svg>
              {/* Texto central */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold text-gray-900 dark:text-white">
                  {usedPercentage}%
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Usado
                </span>
              </div>
            </div>
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Armazenamento Total
              </p>
              <p className="text-lg font-medium text-gray-900 dark:text-white">
                {formattedUsed} / {formattedTotal}
              </p>
            </div>
          </div>
        </section>

        {/* File Type Cards */}
        <section className="lg:col-span-2">
          <div className="bg-[#FFE4E1] dark:bg-[#FF9A8B]/20 p-6 rounded-2xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {summary.map((item) => (
                <Link 
                  href={item.url} 
                  key={item.title}
                  className="group relative overflow-hidden rounded-xl bg-white p-6 shadow-sm transition-all hover:shadow-md dark:bg-gray-800"
                >
                  <div className="flex items-center gap-4">
                    <div className={`card-icon ${item.title.toLowerCase()}-icon`}>
                      <Image
                        src={item.icon}
                        alt={item.title}
                        width={24}
                        height={24}
                        className="size-6 group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <div className="flex flex-col">
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {item.size}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${
                          item.title === "Documents" ? "bg-gray-100 text-gray-800 dark:bg-gray-800/60 dark:text-gray-200" :
                          item.title === "Images" ? "bg-gray-100 text-gray-800 dark:bg-gray-800/60 dark:text-gray-200" :
                          item.title === "Media" ? "bg-gray-100 text-gray-800 dark:bg-gray-800/60 dark:text-gray-200" :
                          "bg-gray-100 text-gray-800 dark:bg-gray-800/60 dark:text-gray-200"
                        } transition-colors group-hover:bg-opacity-90 font-semibold`}>
                          {item.title}
                        </span>
                        <div className={`w-2 h-2 rounded-full ${
                          item.title === "Documents" ? "bg-gray-600 dark:bg-gray-300" :
                          item.title === "Images" ? "bg-gray-600 dark:bg-gray-300" :
                          item.title === "Media" ? "bg-gray-600 dark:bg-gray-300" :
                          "bg-gray-600 dark:bg-gray-300"
                        }`} />
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Última atualização
                    </p>
                    <p className="text-xs font-medium text-gray-900 dark:text-white">
                      {item.latestDate}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Recent Files */}
      <section className="mt-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Arquivos Recentes
          </h2>
          <Link 
            href="/documents" 
            className="text-sm text-brand hover:text-brand/80 dark:text-brand-dark dark:hover:text-brand-dark/80 transition-colors"
          >
            Ver todos
          </Link>
        </div>

        {!files?.documents ? (
          <div className="space-y-4">
            <div className="h-16 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />
            <div className="h-16 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />
            <div className="h-16 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />
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
                    <p className="font-medium text-gray-900 dark:text-white group-hover:text-brand dark:group-hover:text-brand-dark">
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


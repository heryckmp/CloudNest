import { getFiles, getTotalSpaceUsed } from "@/lib/actions/file.actions";
import { getUsageSummary, constructFileUrl, calculatePercentage } from "@/lib/utils";
import Link from "next/link";
import { Models } from "node-appwrite";
import FormattedDateTime from "@/components/FormattedDateTime";
import ActionDropdown from "@/components/ActionDropdown";
import Thumbnail from "@/components/Thumbnail";

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

  return (
    <main className="dashboard-container">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Storage Chart */}
        <section className="storage-section lg:col-span-1">
          <div className="storage-info">
            <div>
              <p className="storage-percentage">{usedPercentage}%</p>
              <p className="storage-text">Space used</p>
            </div>
            <div className="text-right">
              <p className="storage-text">Available Storage</p>
              <p className="storage-text">{totalSpace.used} / {totalSpace.all}</p>
            </div>
          </div>
        </section>

        {/* Files Grid */}
        <div className="files-grid lg:col-span-2">
          {summary.map((item) => (
            <div key={item.title} className="file-type-card">
              <div className={`file-type-icon ${item.title.toLowerCase()}-bg`}>
                <Thumbnail
                  type={item.title.toLowerCase()}
                  extension=""
                  url={item.icon}
                  className="w-8 h-8"
                  imageClassName="w-full h-full"
                />
              </div>
              <div className="file-type-info">
                <p className="file-type-size">{item.size}</p>
                <p className="file-type-update">Last update: {item.latestDate}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Files */}
      <section className="recent-files-section mt-6">
        <h2 className="text-xl font-bold mb-4 text-black dark:text-white">Recent files uploaded</h2>
        {!files?.documents ? (
          <div className="space-y-4">
            <div className="h-16 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />
            <div className="h-16 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />
            <div className="h-16 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />
          </div>
        ) : files.documents.length > 0 ? (
          <div className="space-y-1">
            {files.documents.map((file: Models.Document) => (
              <Link
                href={constructFileUrl(file.bucketFileId)}
                target="_blank"
                className="recent-file-item"
                key={file.$id}
              >
                <Thumbnail
                  type={file.type}
                  extension={file.extension}
                  url={constructFileUrl(file.bucketFileId)}
                  className="w-8 h-8"
                  imageClassName="w-full h-full"
                />
                <div className="file-details">
                  <p className="file-name">{file.name}</p>
                  <FormattedDateTime
                    date={file.$createdAt}
                    className="file-date"
                  />
                </div>
                <ActionDropdown file={file} />
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No files uploaded</p>
        )}
      </section>
    </main>
  );
};

export default Dashboard;

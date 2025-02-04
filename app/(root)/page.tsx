import { getFiles, getTotalSpaceUsed } from "@/lib/actions/file.actions";
import { getUsageSummary } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { Models } from "node-appwrite";
import Thumbnail from "@/components/Thumbnail";
import FormattedDateTime from "@/components/FormattedDateTime";
import ActionDropdown from "@/components/ActionDropdown";
import { Chart } from "@/components/Chart";

const Dashboard = async () => {
  const files = await getFiles({ types: [], searchText: "", sort: "$createdAt-desc" });

  // Parallel requests
  const [totalSpace] = await Promise.all([
    getTotalSpaceUsed(),
  ]);

  const summary = getUsageSummary(totalSpace);

  return (
    <main className="dashboard-container">
      <div className="flex justify-between items-center w-full">
        <h1 className="h2 text-black dark:text-white">Dashboard</h1>
      </div>
      <section>
        <Chart used={totalSpace.used} />

        <ul className="dashboard-summary-list">
          {summary.map((item) => (
            <li key={item.title} className="dashboard-summary-card">
              <Image
                src={item.icon}
                alt={item.title}
                width={190}
                height={100}
                className="summary-type-icon"
              />
              <p className="summary-type-size">{item.size}</p>
              <p className="summary-type-title">{item.title}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* Recent files uploaded */}
      <section className="dashboard-recent-files">
        <h2 className="h3 xl:h2 text-light-100">Recent files uploaded</h2>
        {files?.documents && files.documents.length > 0 ? (
          <ul className="mt-5 flex flex-col gap-5">
            {files.documents.map((file: Models.Document) => (
              <Link
                href={file.url}
                target="_blank"
                className="flex items-center gap-3"
                key={file.$id}
              >
                <Thumbnail
                  type={file.type}
                  extension={file.extension}
                  url={file.url}
                />

                <div className="recent-file-details">
                  <div className="flex flex-col gap-1">
                    <p className="recent-file-name">{file.name}</p>
                    <FormattedDateTime
                      date={file.$createdAt}
                      className="caption"
                    />
                  </div>
                  <ActionDropdown file={file} />
                </div>
              </Link>
            ))}
          </ul>
        ) : (
          <p className="empty-list">No files uploaded</p>
        )}
      </section>
    </main>
  );
};

export default Dashboard;

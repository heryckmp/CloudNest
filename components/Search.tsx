"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { getFiles } from "@/lib/actions/file.actions";
import { Models } from "node-appwrite";
import Thumbnail from "@/components/Thumbnail";
import FormattedDateTime from "@/components/FormattedDateTime";
import { useDebounce } from "use-debounce";

const Search = () => {
  const [query, setQuery] = useState("");
  const searchParams = useSearchParams();
  const searchQuery = searchParams?.get("query") || "";
  const [results, setResults] = useState<Models.Document[]>([]);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const path = usePathname();
  const [debouncedQuery] = useDebounce(query, 300);

  useEffect(() => {
    const fetchFiles = async () => {
      if (debouncedQuery.length === 0) {
        setResults([]);
        setOpen(false);
        return;
      }

      const files = await getFiles({ types: [], searchText: debouncedQuery });
      if (files?.documents) {
        setResults(files.documents);
        setOpen(true);
      }
    };

    fetchFiles();
  }, [debouncedQuery, path]);

  useEffect(() => {
    if (!searchQuery) {
      setQuery("");
    }
  }, [searchQuery]);

  const handleClickItem = (file: Models.Document) => {
    setOpen(false);
    setResults([]);
    setQuery("");

    router.push(
      `/${file.type === "video" || file.type === "audio" ? "media" : file.type + "s"}?query=${query}`
    );
  };

  return (
    <div className="relative w-full max-w-md">
      <Input
        type="text"
        placeholder="Pesquisar arquivos..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full rounded-lg border bg-white px-4 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:bg-gray-800"
      />

      {open && results.length > 0 && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-96 overflow-y-auto rounded-lg border bg-white p-2 shadow-lg dark:bg-gray-800">
          {results.map((file) => (
            <button
              key={file.$id}
              className="flex w-full items-center gap-3 rounded-md p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => handleClickItem(file)}
            >
              <Thumbnail
                type={file.type}
                extension={file.extension}
                url={file.url}
                className="size-10"
              />
              <div className="flex flex-1 flex-col items-start text-left">
                <p className="line-clamp-1 text-sm font-medium text-gray-900 dark:text-white">{file.name}</p>
                <FormattedDateTime
                  date={file.$createdAt}
                  className="text-xs text-gray-500 dark:text-gray-400"
                />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;

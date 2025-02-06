import React from "react";
import Sort from "@/components/Sort";
import { getFiles, getTotalSpaceUsed } from "@/lib/actions/file.actions";
import { Models } from "node-appwrite";
import Card from "@/components/Card";
import { getFileTypesParams, formatStorageSize } from "@/lib/utils";
import { CardSkeleton } from "@/components/CardSkeleton";

const Page = async ({ searchParams, params }: SearchParamProps) => {
  const type = ((await params)?.type as string) || "";
  const searchText = ((await searchParams)?.query as string) || "";
  const sort = ((await searchParams)?.sort as string) || "";

  const types = getFileTypesParams(type) as FileType[];
  const totalSpace = await getTotalSpaceUsed();
  const files = await getFiles({ types, searchText, sort });

  // Calcula o total de armazenamento usado para o tipo atual
  const calculateTotalSize = () => {
    if (!totalSpace) return 0;
    
    switch (type) {
      case "documents":
        return totalSpace.document.size;
      case "images":
        return totalSpace.image.size;
      case "media":
        return totalSpace.video.size + totalSpace.audio.size;
      case "others":
        return totalSpace.other.size;
      default:
        return 0;
    }
  };

  return (
    <div className="container mx-auto p-6">
      <section className="w-full">
        <h1 className="mb-6 text-3xl font-bold capitalize text-gray-900 dark:text-white">
          {type === "documents" ? "Documentos" :
           type === "images" ? "Imagens" :
           type === "media" ? "Mídia" :
           "Outros"}
        </h1>

        <div className="mb-8 flex items-center justify-between">
          <p className="text-base font-medium text-gray-700 dark:text-gray-300">
            Total: <span className="text-xl font-bold">{formatStorageSize(calculateTotalSize())}</span>
          </p>

          <div className="flex items-center gap-4">
            <p className="hidden text-base text-gray-500 sm:block">Ordenar por:</p>
            <Sort />
          </div>
        </div>
      </section>

      {/* Renderiza os arquivos */}
      {!files?.documents ? (
        <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </section>
      ) : files.total > 0 ? (
        <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {files.documents.map((file: Models.Document) => (
            <Card key={file.$id} file={file} />
          ))}
        </section>
      ) : (
        <p className="mt-8 text-center text-lg text-gray-500 dark:text-gray-400">
          Nenhum arquivo encontrado
        </p>
      )}
    </div>
  );
};

export default Page;

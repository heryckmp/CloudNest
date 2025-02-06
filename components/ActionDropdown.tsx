"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import Image from "next/image";
import { Models } from "node-appwrite";
import { constructDownloadUrl } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  deleteFile,
  renameFile,
  updateFileUsers,
  incrementDownloadCount,
} from "@/lib/actions/file.actions";
import { usePathname } from "next/navigation";
import { FileDetails, ShareInput } from "@/components/ActionsModalContent";
import { useToast } from "@/components/ui/use-toast";

const ActionDropdown = ({ file }: { file: Models.Document }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [action, setAction] = useState<"rename" | "share" | "delete" | "details" | null>(null);
  const [name, setName] = useState(file.name);
  const [isLoading, setIsLoading] = useState(false);
  const [emails, setEmails] = useState<string[]>([]);
  const { toast } = useToast();
  const path = usePathname() || "/";

  const closeAllModals = () => {
    setIsModalOpen(false);
    setIsDropdownOpen(false);
    setAction(null);
    setName(file.name);
  };

  const handleAction = async () => {
    if (!action || action === "details") return;
    setIsLoading(true);
    let success = false;

    const actions = {
      rename: () =>
        renameFile({ fileId: file.$id, name, extension: file.extension, path }),
      share: () => updateFileUsers({ fileId: file.$id, emails, path }),
      delete: () =>
        deleteFile({ fileId: file.$id, bucketFileId: file.bucketFileId, path }),
    };

    success = await actions[action]();

    if (success) closeAllModals();

    setIsLoading(false);
  };

  const handleRemoveUser = async (email: string) => {
    const updatedEmails = emails.filter((e) => e !== email);

    const success = await updateFileUsers({
      fileId: file.$id,
      emails: updatedEmails,
      path,
    });

    if (success) setEmails(updatedEmails);
    closeAllModals();
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(constructDownloadUrl(file.bucketFileId));
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      // Incrementa o contador de downloads
      await incrementDownloadCount(file.$id);
    } catch (error) {
      console.error('Erro ao baixar arquivo:', error);
      toast({
        title: "Erro ao baixar arquivo",
        description: "Ocorreu um erro ao tentar baixar o arquivo. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const renderDialogContent = () => {
    if (!action) return null;

    return (
      <DialogContent className="shad-dialog button">
        <DialogHeader className="flex flex-col gap-3">
          <DialogTitle className="text-center text-light-100">
            {action === "rename" && "Renomear"}
            {action === "share" && "Compartilhar"}
            {action === "delete" && "Excluir"}
            {action === "details" && "Detalhes"}
          </DialogTitle>
          {action === "rename" && (
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}
          {action === "details" && <FileDetails file={file} />}
          {action === "share" && (
            <ShareInput
              file={file}
              onInputChange={setEmails}
              onRemove={handleRemoveUser}
            />
          )}
          {action === "delete" && (
            <p className="delete-confirmation">
              Tem certeza que deseja excluir{` `}
              <span className="delete-file-name">{file.name}</span>?
            </p>
          )}
        </DialogHeader>
        {["rename", "delete", "share"].includes(action) && (
          <DialogFooter className="flex flex-col gap-3 md:flex-row">
            <Button onClick={closeAllModals} className="modal-cancel-button">
              Cancelar
            </Button>
            <Button onClick={handleAction} className="modal-submit-button">
              <p className="capitalize">{action}</p>
              {isLoading && (
                <Image
                  src="/assets/icons/loader.svg"
                  alt="carregando"
                  width={24}
                  height={24}
                  className="animate-spin"
                />
              )}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    );
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <div className="flex items-center justify-center p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full cursor-pointer">
            <Image
              src="/assets/icons/more.svg"
              alt="mais ações"
              width={24}
              height={24}
              className="size-6"
            />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => {
              setAction("rename");
              setIsModalOpen(true);
            }}
            className="flex cursor-pointer items-center gap-2 px-3 py-2"
          >
            <Image
              src="/assets/icons/edit.svg"
              alt="renomear"
              width={20}
              height={20}
              className="size-5"
            />
            Renomear
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setAction("details");
              setIsModalOpen(true);
            }}
            className="flex cursor-pointer items-center gap-2 px-3 py-2"
          >
            <Image
              src="/assets/icons/info.svg"
              alt="detalhes"
              width={20}
              height={20}
              className="size-5"
            />
            Detalhes
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setAction("share");
              setIsModalOpen(true);
            }}
            className="flex cursor-pointer items-center gap-2 px-3 py-2"
          >
            <Image
              src="/assets/icons/share.svg"
              alt="compartilhar"
              width={20}
              height={20}
              className="size-5"
            />
            Compartilhar
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleDownload}
            className="flex cursor-pointer items-center gap-2 px-3 py-2"
          >
            <Image
              src="/assets/icons/download.svg"
              alt="baixar"
              width={20}
              height={20}
              className="size-5"
            />
            Baixar
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setAction("delete");
              setIsModalOpen(true);
            }}
            className="flex cursor-pointer items-center gap-2 px-3 py-2 text-red-500 focus:text-red-500"
          >
            <Image
              src="/assets/icons/delete.svg"
              alt="excluir"
              width={20}
              height={20}
              className="size-5"
            />
            Excluir
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {renderDialogContent()}
    </Dialog>
  );
};

export default ActionDropdown;

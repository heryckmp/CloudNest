"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Models } from "node-appwrite";
import Image from "next/image";
import { useState } from "react";
import { actionsDropdownItems } from "@/constants";
import { FileDetails, ShareInput } from "@/components/ActionsModalContent";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { renameFile, updateFileUsers, deleteFile } from "@/lib/actions/file.actions";
import { useToast } from "@/components/ui/use-toast";
import { constructDownloadUrl } from "@/lib/utils";
import { usePathname } from "next/navigation";

type ActionType = "rename" | "share" | "delete" | "details" | "download";

const ActionDropdown = ({ file }: { file: Models.Document }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [action, setAction] = useState<ActionType | null>(null);
  const [newName, setNewName] = useState(file.name);
  const [emails, setEmails] = useState<string[]>(file.users || []);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const path = usePathname() || "/";

  const closeAllModals = () => {
    setIsModalOpen(false);
    setAction(null);
    setNewName(file.name);
    setEmails(file.users || []);
  };

  const handleAction = async (value: ActionType) => {
    if (value === "download") {
      window.open(constructDownloadUrl(file.bucketFileId), "_blank");
      return;
    }

    if (value === "details") {
      setAction(value);
      setIsModalOpen(true);
      return;
    }

    if (!value) return;
    setIsLoading(true);

    try {
      let success = false;

      switch (value) {
        case "rename":
          success = await renameFile({ 
            fileId: file.$id, 
            name: newName, 
            extension: file.extension, 
            path 
          });
          break;
        case "share":
          success = await updateFileUsers({ 
            fileId: file.$id, 
            emails, 
            path 
          });
          break;
        case "delete":
          success = await deleteFile({ 
            fileId: file.$id, 
            bucketFileId: file.bucketFileId, 
            path 
          });
          break;
      }

      if (success) {
        closeAllModals();
        toast({
          description: (
            <p className="text-sm font-normal text-white">
              {value === "rename" ? "Arquivo renomeado com sucesso" :
               value === "share" ? "Compartilhamento atualizado" :
               value === "delete" ? "Arquivo excluído com sucesso" : ""}
            </p>
          ),
        });
      }
    } catch (error) {
      console.error(`Error on ${value}:`, error);
      toast({
        variant: "destructive",
        description: (
          <p className="text-sm font-normal text-white">
            Falha ao executar ação. Por favor, tente novamente.
          </p>
        ),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderDialogContent = () => {
    if (!isModalOpen) return null;

    return (
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          {action === "details" && <FileDetails file={file} />}
          {action === "share" && (
            <ShareInput
              file={file}
              onInputChange={setEmails}
              onRemove={(email) => setEmails(emails.filter((e) => e !== email))}
            />
          )}
          {action === "rename" && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Renomear arquivo</h3>
              <Input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full"
              />
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={closeAllModals}>
                  Cancelar
                </Button>
                <Button onClick={() => handleAction("rename")} disabled={isLoading}>
                  {isLoading ? "Renomeando..." : "Renomear"}
                </Button>
              </div>
            </div>
          )}
          {action === "delete" && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-red-500">Excluir arquivo</h3>
              <p>Tem certeza que deseja excluir este arquivo?</p>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={closeAllModals}>
                  Cancelar
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={() => handleAction("delete")}
                  disabled={isLoading}
                >
                  {isLoading ? "Excluindo..." : "Excluir"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="outline-none">
          <div className="rounded-full p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700">
            <Image
              src="/assets/icons/more-vertical.svg"
              alt="opções"
              width={20}
              height={20}
              className="opacity-50 transition-opacity hover:opacity-100"
            />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          {actionsDropdownItems.map(({ label, icon, value }) => (
            <DropdownMenuItem
              key={value}
              onClick={() => handleAction(value as ActionType)}
              className="flex cursor-pointer items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              <Image src={icon} alt={label} width={16} height={16} />
              {label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {renderDialogContent()}
    </>
  );
};

export default ActionDropdown;

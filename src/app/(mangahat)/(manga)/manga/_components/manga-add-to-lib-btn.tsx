import { useLocalLibraryV2 } from "@/hooks/use-local-library-v2";
import { useLocalNotification } from "@/hooks/use-local-notification";
import { getMangaCategory } from "@/lib/mangahat/db";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LibraryType } from "@/types/types";
import {
  Album,
  BellOff,
  BellRing,
  BookmarkCheck,
  ChevronDown,
  CircleUser,
  ListCheck,
  ListPlus,
  NotebookPen,
  Smartphone,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Spinner } from "@/components/ui/spinner";
import { useTranslation } from "@/lib/i18n";

type StorageMode = "local" | "account";

interface MangaAddToLibBtnProps {
  mangaId: string;
  title: string;
  coverId: string | null;
}

const categoryOptions = [
  {
    value: "none",
    label: "none",
    icon: <ListPlus />,
    btnLabelKey: "addToLibrary",
  },
  {
    value: "following",
    label: "following",
    icon: <BookmarkCheck />,
    btnLabelKey: "following",
  },
  {
    value: "reading",
    label: "reading",
    icon: <Album />,
    btnLabelKey: "reading",
  },
  {
    value: "plan",
    label: "readLater",
    icon: <NotebookPen />,
    btnLabelKey: "readLater",
  },
  {
    value: "completed",
    label: "doneReading",
    icon: <ListCheck />,
    btnLabelKey: "doneReading",
  },
];

const storageModeOptions = [
  {
    value: "local" as StorageMode,
    label: "device",
    icon: <Smartphone />,
  },
  {
    value: "account" as StorageMode,
    label: "account",
    icon: <CircleUser />,
  },
];

export function MangaAddToLibBtn({
  mangaId,
  title,
  coverId,
}: MangaAddToLibBtnProps) {
  const t = useTranslation();
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [storageMode, setStorageMode] = useState<StorageMode>("local");
  const [isNotificationEnabled, setIsNotificationEnabled] = useState(false);
  const [accountValue, setAccountValue] = useState<LibraryType | "none">(
    "none",
  );
  const [isFetchingAccount, setIsFetchingAccount] = useState(false);
  const [hasFetchedAccount, setHasFetchedAccount] = useState(false);

  const { library, addToLibrary, removeFromLibrary, getCategoryOfId } =
    useLocalLibraryV2();

  const {
    localNotification,
    addToLocalNotification,
    removeFromLocalNotification,
    isInLocalNotification,
  } = useLocalNotification();

  const [localValue, setLocalValue] = useState<LibraryType | "none">(
    getCategoryOfId(mangaId) || "none",
  );

  // Sync local value when library changes
  useEffect(() => {
    setLocalValue(getCategoryOfId(mangaId) || "none");
  }, [mangaId, library]);

  useEffect(() => {
    setIsNotificationEnabled(isInLocalNotification(mangaId));
  }, [mangaId, localNotification]);

  const value = storageMode === "local" ? localValue : accountValue;

  const fetchAccountCategory = async () => {
    if (!session?.user?.id) return;
    setIsFetchingAccount(true);
    try {
      const cat = await getMangaCategory(session.user.id, mangaId);
      setAccountValue((cat.toLowerCase() as LibraryType | "none") ?? "none");
      setHasFetchedAccount(true);
    } catch {
      setAccountValue("none");
    } finally {
      setIsFetchingAccount(false);
    }
  };

  const handleLocalNotificationToggle = (
    v: LibraryType | "none",
    enabled: boolean,
  ) => {
    if (v === "none" || !enabled) {
      return removeFromLocalNotification(mangaId);
    }
    addToLocalNotification(mangaId);
  };

  const handleLocalLibraryAdd = (v: LibraryType | "none") => {
    if (v === "none") {
      removeFromLibrary(mangaId);
      return toast.success(t.manga.removedFromLibrary);
    }
    addToLibrary(mangaId, v, { title, coverId });
    return toast.success(
      t.manga.addedTo.replace("{0}", (t.manga as any)[categoryOptions.find((opt) => opt.value === v)?.label ?? ""] || ""),
    );
  };

  const handleLibraryAdd = async (v: LibraryType | "none") => {
    if (!session || !session.user || !session.user.id) {
      toast.info(t.manga.loginRequired);
      return;
    }
    return toast.warning(t.manga.underMaintenance, {
      description: t.manga.useDeviceForNow,
    });
    // setIsLoading(true);
    // try {
    //   const res = await updateMangaCategory(
    //     session.user.id,
    //     mangaId,
    //     v.toUpperCase() as any,
    //     "none", // dont remember why I coded like this 😳
    //   );
    //   if (res.status === 200 || res.status === 201) {
    //     toast.success(res.message);
    //   } else {
    //     toast.error(res.message);
    //   }
    // } catch (error) {
    //   console.error(error);
    //   toast.error("An error occurred, please try again later!");
    // } finally {
    //   setIsLoading(false);
    // }
  };

  const handleCategoryChange = async (v: string) => {
    const newValue = v as LibraryType | "none";
    if (storageMode === "local") {
      setLocalValue(newValue);
      handleLocalLibraryAdd(newValue);
    } else {
      toast.warning(t.manga.underMaintenance, {
        description: t.manga.useDeviceForNow,
      });
      // setAccountValue(newValue);
      // await handleLibraryAdd(newValue);
    }
  };

  const handleStorageModeChange = async (mode: StorageMode) => {
    if (mode === "account" && !session?.user?.id) {
      toast.info("You need to log in to use this feature!");
      return;
    }
    setStorageMode(mode);
    if (mode === "account" && !hasFetchedAccount) {
      await fetchAccountCategory();
    }
  };

  const handleBellToggle = () => {
    return toast.warning(t.manga.underMaintenance);
    // const newState = !isNotificationEnabled;
    // setIsNotificationEnabled(newState);
    // handleLocalNotificationToggle(value, newState);
    // if (newState) {
    //   toast.success("Notifications enabled!");
    // } else {
    //   toast.info("Notifications disabled!");
    // }
  };

  const currentCategory = categoryOptions.find((opt) => opt.value === value);
  const currentStorage = storageModeOptions.find(
    (opt) => opt.value === storageMode,
  );

  return (
    <ButtonGroup>
      <DropdownMenu>
        <DropdownMenuTrigger asChild disabled={isLoading}>
          <Button className="w-9 md:w-auto">
            {currentCategory?.icon}
            <span className="hidden md:inline">
              {(t.manga as any)[currentCategory?.btnLabelKey ?? ""] || currentCategory?.btnLabelKey}
            </span>
            <ChevronDown className="size-3.5 hidden md:inline" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="space-y-1">
          {categoryOptions.map((option) => (
            <DropdownMenuItem
              key={option.value}
              onClick={() => handleCategoryChange(option.value)}
              className={value === option.value ? "bg-accent" : ""}
            >
              {option.icon}
              {(t.manga as any)[option.label] || option.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {value !== "none" && (
        <Button
          variant={isNotificationEnabled ? "default" : "secondary"}
          size="icon"
          onClick={handleBellToggle}
          disabled={isLoading}
        >
          {isNotificationEnabled ? (
            <BellRing className=" animate-bell-shake" />
          ) : (
            <BellOff />
          )}
        </Button>
      )}

      <DropdownMenu>
        <DropdownMenuTrigger asChild disabled={isLoading || isFetchingAccount}>
          <Button variant="secondary" size="icon">
            {isFetchingAccount ? <Spinner /> : <>{currentStorage?.icon}</>}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="space-y-1">
          {storageModeOptions.map((option) => (
            <DropdownMenuItem
              key={option.value}
              onClick={() => handleStorageModeChange(option.value)}
              className={storageMode === option.value ? "bg-accent" : ""}
            >
              {option.icon}
              {(t.manga as any)[option.label] || option.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </ButtonGroup>
  );
}

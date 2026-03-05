"use server";

import { auth } from "@/auth";
import { prisma } from "../prisma";
import { Category } from "../../../prisma/generated/enums";

async function checkAuth(userID: string): Promise<boolean> {
  const session = await auth();
  return session?.user?.id === userID || false;
}

export async function getMangaCategory(
  userId: string,
  mangaId: string,
): Promise<string> {
  try {
    // Check authentication
    if (!(await checkAuth(userId))) return "NONE";

    // Fast query with select fetching only required data
    const result = await prisma.libraryManga.findFirst({
      where: {
        mangaId,
        library: { userId }, // Connect via user library
      },
      select: { category: true },
    });

    return result?.category ?? "NONE";
  } catch (error) {
    console.error("Error fetching manga category:", error);
    throw new Error("Failed to fetch manga category.");
  }
}

export async function updateMangaCategory(
  userId: string,
  mangaId: string,
  category: Category | "NONE",
  latestChapterId: string,
): Promise<{ message: string; status: number }> {
  try {
    // Check authentication
    if (!(await checkAuth(userId))) {
      return { message: "Please log in again!", status: 401 };
    }

    // Find or create user library with upsert to reduce queries
    const library = await prisma.library.upsert({
      where: { userId },
      update: {}, // No need to update if already exists
      create: { userId }, // Create new if not exists
    });

    const libraryId = library.id;

    if (category === "NONE") {
      // Delete Manga from library if category is "NONE"
      const deleteResult = await prisma.libraryManga.deleteMany({
        where: { libraryId, mangaId },
      });

      return deleteResult.count
        ? { message: "Updated successfully!", status: 200 }
        : { message: "Manga not found in library.", status: 404 };
    } else {
      // Find or create Manga
      await prisma.manga.upsert({
        where: { mangadexId: mangaId },
        update: { latestChapterId }, // Update if already exists
        create: { mangadexId: mangaId, latestChapterId }, // Create new if not exists
      });

      // Add or update Manga in library
      const existingEntry = await prisma.libraryManga.findFirst({
        where: { libraryId, mangaId },
      });

      if (existingEntry) {
        // Update category if already exists
        await prisma.libraryManga.update({
          where: { id: existingEntry.id },
          data: { category },
        });
      } else {
        // Create new if not exists
        await prisma.libraryManga.create({
          data: { libraryId, mangaId, category },
        });
      }

      return { message: "Updated successfully!", status: 200 };
    }
  } catch (error) {
    console.error("Error updating manga category:", error);
    return { message: "An error occurred, please try again later!", status: 500 };
  }
}

export async function getUserLibrary(userId: string): Promise<{
  FOLLOWING: string[];
  READING: string[];
  PLAN: string[];
  COMPLETED: string[];
  DROPPED: string[];
  RE_READING: string[];
}> {
  try {
    // Check authentication
    if (!(await checkAuth(userId))) {
      return {
        FOLLOWING: [],
        READING: [],
        PLAN: [],
        COMPLETED: [],
        DROPPED: [],
        RE_READING: [],
      };
    }

    // Find user library ID
    const library = await prisma.library.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!library)
      return {
        FOLLOWING: [],
        READING: [],
        PLAN: [],
        COMPLETED: [],
        DROPPED: [],
        RE_READING: [],
      };

    // Get all library Manga and categorize
    const libraryMangas = await prisma.libraryManga.findMany({
      where: { libraryId: library.id },
      select: { mangaId: true, category: true },
    });

    // Use reduce to categorize Manga
    const result = libraryMangas.reduce(
      (acc: Record<Category, string[]>, { mangaId, category }) => {
        acc[category].push(mangaId);
        return acc;
      },
      {
        FOLLOWING: [],
        READING: [],
        PLAN: [],
        COMPLETED: [],
        DROPPED: [],
        RE_READING: [],
      } as Record<Category, string[]>,
    );

    return result;
  } catch (error) {
    console.error("Error fetching user library:", error);
    throw new Error("Failed to fetch user library.");
  }
}

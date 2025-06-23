/*
  Warnings:

  - You are about to drop the column `publisher` on the `Book` table. All the data in the column will be lost.
  - Added the required column `avatar` to the `Author` table without a default value. This is not possible if the table is not empty.
  - Made the column `bio` on table `Author` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `description` to the `Book` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `Book` table without a default value. This is not possible if the table is not empty.
  - Added the required column `recommend` to the `Review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user` to the `Review` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Author" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "avatar" TEXT NOT NULL,
    "bio" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "sex" TEXT NOT NULL DEFAULT 'MALE',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Author" ("age", "bio", "createdAt", "id", "name", "sex", "updatedAt") SELECT "age", "bio", "createdAt", "id", "name", "sex", "updatedAt" FROM "Author";
DROP TABLE "Author";
ALTER TABLE "new_Author" RENAME TO "Author";
CREATE UNIQUE INDEX "Author_name_key" ON "Author"("name");
CREATE TABLE "new_Book" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "isbn" TEXT NOT NULL,
    "genre" TEXT NOT NULL,
    "price" DECIMAL NOT NULL,
    "authorId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Book_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Author" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Book" ("authorId", "createdAt", "genre", "id", "isbn", "title", "updatedAt") SELECT "authorId", "createdAt", "genre", "id", "isbn", "title", "updatedAt" FROM "Book";
DROP TABLE "Book";
ALTER TABLE "new_Book" RENAME TO "Book";
CREATE UNIQUE INDEX "Book_isbn_key" ON "Book"("isbn");
CREATE TABLE "new_Review" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "recommend" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "bookId" INTEGER NOT NULL,
    "authorId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Review_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Review_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Author" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Review" ("authorId", "bookId", "content", "createdAt", "id", "rating", "updatedAt") SELECT "authorId", "bookId", "content", "createdAt", "id", "rating", "updatedAt" FROM "Review";
DROP TABLE "Review";
ALTER TABLE "new_Review" RENAME TO "Review";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

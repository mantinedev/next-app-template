-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Product" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "categoryId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "descrip" TEXT,
    "image1" TEXT,
    "image2" TEXT,
    "image3" TEXT
);
INSERT INTO "new_Product" ("categoryId", "descrip", "id", "image1", "image2", "image3", "name", "price") SELECT "categoryId", "descrip", "id", "image1", "image2", "image3", "name", "price" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

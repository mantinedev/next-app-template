-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Product" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "categoryId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" TEXT NOT NULL,
    "descrip" TEXT,
    "stock" TEXT NOT NULL,
    "image1" TEXT
);
INSERT INTO "new_Product" ("categoryId", "descrip", "id", "image1", "name", "price", "stock") SELECT "categoryId", "descrip", "id", "image1", "name", "price", "stock" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- creates a user with admin privileges for the project

INSERT INTO User (`id`, `email`, `username`, `firstName`, `lastName`, `password`, `isAdmin`, `createdAt`, `updatedAt`)
VALUES (1, 'brucewayne@justice.league', 'Batman', 'Bruce', 'Wayne', 'password123', 1, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP());

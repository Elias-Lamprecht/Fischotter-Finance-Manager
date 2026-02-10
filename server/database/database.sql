CREATE TABLE IF NOT EXISTS "users" (
	"id" UUID NOT NULL UNIQUE,
	"email" VARCHAR(32) NOT NULL UNIQUE,
	"username" VARCHAR(32) NOT NULL UNIQUE,
	"displayname" VARCHAR(32) NOT NULL,
	"password" VARCHAR(64) NOT NULL,
	"created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
	PRIMARY KEY("id")
);

CREATE TABLE IF NOT EXISTS "accounts" (
	"id" UUID NOT NULL UNIQUE,
	"owner_id" UUID NOT NULL,
	"title" VARCHAR(32) NOT NULL,
	"description" VARCHAR(128),
     "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
	PRIMARY KEY("id")
);

CREATE TABLE IF NOT EXISTS "transactions" (
	"id" UUID NOT NULL UNIQUE,
	"owner_id" UUID NOT NULL,
	"account_id" UUID NOT NULL,
	"title" VARCHAR(32) NOT NULL,
	"description" VARCHAR(128),
	"type" VARCHAR(16) NOT NULL,
	"value" NUMERIC(12, 2) NOT NULL,
     "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
	PRIMARY KEY("id")
);


ALTER TABLE "accounts"
ADD CONSTRAINT fk_accounts_owner_id_users
FOREIGN KEY (owner_id)
REFERENCES users(id)
ON DELETE CASCADE;

ALTER TABLE "transactions"
ADD CONSTRAINT fk_transactions_owner_id_users
FOREIGN KEY (owner_id)
REFERENCES users(id)
ON DELETE CASCADE;

ALTER TABLE "transactions"
ADD CONSTRAINT fk_transactions_account_id_accounts
FOREIGN KEY (account_id)
REFERENCES accounts(id)
ON DELETE CASCADE;

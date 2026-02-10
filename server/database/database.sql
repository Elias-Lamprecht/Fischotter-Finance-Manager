-- ----------------------------
-- Users Table
-- ----------------------------
CREATE TABLE IF NOT EXISTS "users" (
    "id" UUID PRIMARY KEY,
    "email" VARCHAR(32) NOT NULL UNIQUE,
    "username" VARCHAR(32) NOT NULL UNIQUE,
    "displayname" VARCHAR(32) NOT NULL,
    "password" VARCHAR(64) NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ----------------------------
-- Accounts Table
-- ----------------------------
CREATE TABLE IF NOT EXISTS "accounts" (
    "id" UUID PRIMARY KEY,
    "owner_id" UUID NOT NULL,
    "title" VARCHAR(32) NOT NULL,
    "description" VARCHAR(128),
    "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_accounts_owner_id_users
        FOREIGN KEY ("owner_id")
        REFERENCES "users"("id")
        ON DELETE CASCADE
);

-- ----------------------------
-- Subscriptions Table
-- ----------------------------
CREATE TABLE IF NOT EXISTS "subscriptions" (
    "id" UUID PRIMARY KEY,
    "owner_id" UUID NOT NULL,
    "title" VARCHAR(32) NOT NULL,
    "description" VARCHAR(128),
    "type" VARCHAR(16) NOT NULL,
    "value" NUMERIC(12,2) NOT NULL,
    "repetition_count" INTEGER NOT NULL,
    "last_transaction" DATE NOT NULL,
    "days" INTEGER NOT NULL,
    "months" INTEGER NOT NULL,
    "years" INTEGER NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_subscriptions_owner_id_users
        FOREIGN KEY ("owner_id")
        REFERENCES "users"("id")
        ON DELETE CASCADE
);

-- ----------------------------
-- Transactions Table
-- ----------------------------
CREATE TABLE IF NOT EXISTS "transactions" (
    "id" UUID PRIMARY KEY,
    "owner_id" UUID NOT NULL,
    "account_id" UUID NOT NULL,
    "subscription_id" UUID NOT NULL,
    "title" VARCHAR(32) NOT NULL,
    "description" VARCHAR(128),
    "type" VARCHAR(16) NOT NULL,
    "value" NUMERIC(12,2) NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_transactions_owner_id_users
        FOREIGN KEY ("owner_id")
        REFERENCES "users"("id")
        ON DELETE CASCADE,
    CONSTRAINT fk_transactions_account_id_accounts
        FOREIGN KEY ("account_id")
        REFERENCES "accounts"("id")
        ON DELETE CASCADE,
    CONSTRAINT fk_transactions_subscription_id_subscriptions
        FOREIGN KEY ("subscription_id")
        REFERENCES "subscriptions"("id")
        ON DELETE CASCADE
);

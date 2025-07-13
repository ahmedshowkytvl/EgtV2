import postgres from 'postgres';

async function addLanguageColumn() {
  const sql = postgres(process.env.DATABASE_URL || 'postgresql://egsite:Pass2020@74.179.85.9:5432/egsite_db?sslmode=disable');
  
  try {
    await sql`
      DO $$ 
      BEGIN 
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'packages' AND column_name = 'language') THEN 
          ALTER TABLE packages ADD COLUMN language TEXT DEFAULT 'en';
          RAISE NOTICE 'Added language column to packages table';
        END IF;
      END $$;
    `;
    console.log('✅ Added language column to packages table');
  } finally {
    await sql.end();
  }
}

addLanguageColumn();
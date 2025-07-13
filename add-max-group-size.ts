import postgres from 'postgres';

async function addMaxGroupSize() {
  const sql = postgres(process.env.DATABASE_URL || 'postgresql://egsite:Pass2020@74.179.85.9:5432/egsite_db?sslmode=disable');
  
  try {
    await sql`
      DO $$ 
      BEGIN 
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'packages' AND column_name = 'max_group_size') THEN 
          ALTER TABLE packages ADD COLUMN max_group_size INTEGER;
          RAISE NOTICE 'Added max_group_size column to packages table';
        END IF;
      END $$;
    `;
    console.log('✅ Added missing max_group_size column to packages table');
  } finally {
    await sql.end();
  }
}

addMaxGroupSize();
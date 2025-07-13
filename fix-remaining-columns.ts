/**
 * Fix Remaining Missing Columns
 * Adds the last few missing columns causing errors
 */

import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

const connectionString = process.env.DATABASE_URL || 'postgresql://egsite:Pass2020@74.179.85.9:5432/egsite_db?sslmode=disable';
const sql = postgres(connectionString);

async function fixRemainingColumns() {
  try {
    console.log('🔧 Fixing remaining missing columns...');

    // Fix packages table - add transportation column
    await sql`
      DO $$ 
      BEGIN 
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'packages' AND column_name = 'transportation') THEN 
          ALTER TABLE packages ADD COLUMN transportation TEXT;
          RAISE NOTICE 'Added transportation column to packages table';
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'packages' AND column_name = 'transportation_price') THEN 
          ALTER TABLE packages ADD COLUMN transportation_price INTEGER;
          RAISE NOTICE 'Added transportation_price column to packages table';
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'packages' AND column_name = 'selected_hotels') THEN 
          ALTER TABLE packages ADD COLUMN selected_hotels JSONB DEFAULT '[]';
          RAISE NOTICE 'Added selected_hotels column to packages table';
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'packages' AND column_name = 'rooms') THEN 
          ALTER TABLE packages ADD COLUMN rooms JSONB DEFAULT '[]';
          RAISE NOTICE 'Added rooms column to packages table';
        END IF;
        
        -- Add other missing package columns
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'packages' AND column_name = 'selected_tour_id') THEN 
          ALTER TABLE packages ADD COLUMN selected_tour_id INTEGER REFERENCES tours(id);
          RAISE NOTICE 'Added selected_tour_id column to packages table';
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'packages' AND column_name = 'markup') THEN 
          ALTER TABLE packages ADD COLUMN markup DOUBLE PRECISION;
          RAISE NOTICE 'Added markup column to packages table';
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'packages' AND column_name = 'markup_type') THEN 
          ALTER TABLE packages ADD COLUMN markup_type TEXT DEFAULT 'percentage';
          RAISE NOTICE 'Added markup_type column to packages table';
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'packages' AND column_name = 'discount_type') THEN 
          ALTER TABLE packages ADD COLUMN discount_type TEXT;
          RAISE NOTICE 'Added discount_type column to packages table';
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'packages' AND column_name = 'discount_value') THEN 
          ALTER TABLE packages ADD COLUMN discount_value DOUBLE PRECISION;
          RAISE NOTICE 'Added discount_value column to packages table';
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'packages' AND column_name = 'cancellation_policy') THEN 
          ALTER TABLE packages ADD COLUMN cancellation_policy TEXT;
          RAISE NOTICE 'Added cancellation_policy column to packages table';
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'packages' AND column_name = 'children_policy') THEN 
          ALTER TABLE packages ADD COLUMN children_policy TEXT;
          RAISE NOTICE 'Added children_policy column to packages table';
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'packages' AND column_name = 'terms_and_conditions') THEN 
          ALTER TABLE packages ADD COLUMN terms_and_conditions TEXT;
          RAISE NOTICE 'Added terms_and_conditions column to packages table';
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'packages' AND column_name = 'excluded_items') THEN 
          ALTER TABLE packages ADD COLUMN excluded_items JSONB DEFAULT '[]';
          RAISE NOTICE 'Added excluded_items column to packages table';
        END IF;
        
      END $$;
    `;

    // Fix cart_items table - add missing timestamp columns
    await sql`
      DO $$ 
      BEGIN 
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'cart_items' AND column_name = 'created_at') THEN 
          ALTER TABLE cart_items ADD COLUMN created_at TIMESTAMP NOT NULL DEFAULT NOW();
          RAISE NOTICE 'Added created_at column to cart_items table';
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'cart_items' AND column_name = 'updated_at') THEN 
          ALTER TABLE cart_items ADD COLUMN updated_at TIMESTAMP DEFAULT NOW();
          RAISE NOTICE 'Added updated_at column to cart_items table';
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'cart_items' AND column_name = 'created_by') THEN 
          ALTER TABLE cart_items ADD COLUMN created_by INTEGER REFERENCES users(id);
          RAISE NOTICE 'Added created_by column to cart_items table';
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'cart_items' AND column_name = 'updated_by') THEN 
          ALTER TABLE cart_items ADD COLUMN updated_by INTEGER REFERENCES users(id);
          RAISE NOTICE 'Added updated_by column to cart_items table';
        END IF;
        
      END $$;
    `;

    // Add missing columns to tours table
    await sql`
      DO $$ 
      BEGIN 
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tours' AND column_name = 'created_at') THEN 
          ALTER TABLE tours ADD COLUMN created_at TIMESTAMP NOT NULL DEFAULT NOW();
          RAISE NOTICE 'Added created_at column to tours table';
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tours' AND column_name = 'updated_at') THEN 
          ALTER TABLE tours ADD COLUMN updated_at TIMESTAMP DEFAULT NOW();
          RAISE NOTICE 'Added updated_at column to tours table';
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tours' AND column_name = 'created_by') THEN 
          ALTER TABLE tours ADD COLUMN created_by INTEGER REFERENCES users(id);
          RAISE NOTICE 'Added created_by column to tours table';
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tours' AND column_name = 'updated_by') THEN 
          ALTER TABLE tours ADD COLUMN updated_by INTEGER REFERENCES users(id);
          RAISE NOTICE 'Added updated_by column to tours table';
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tours' AND column_name = 'cancellation_policy') THEN 
          ALTER TABLE tours ADD COLUMN cancellation_policy TEXT;
          RAISE NOTICE 'Added cancellation_policy column to tours table';
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tours' AND column_name = 'terms_and_conditions') THEN 
          ALTER TABLE tours ADD COLUMN terms_and_conditions TEXT;
          RAISE NOTICE 'Added terms_and_conditions column to tours table';
        END IF;
        
      END $$;
    `;

    // Add missing columns to packages table for timestamps
    await sql`
      DO $$ 
      BEGIN 
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'packages' AND column_name = 'created_by') THEN 
          ALTER TABLE packages ADD COLUMN created_by INTEGER REFERENCES users(id);
          RAISE NOTICE 'Added created_by column to packages table';
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'packages' AND column_name = 'updated_by') THEN 
          ALTER TABLE packages ADD COLUMN updated_by INTEGER REFERENCES users(id);
          RAISE NOTICE 'Added updated_by column to packages table';
        END IF;
        
      END $$;
    `;

    console.log('✅ All remaining missing columns fixed!');

    // Test the final fixes
    try {
      await sql`SELECT transportation FROM packages LIMIT 1`;
      console.log('✅ packages.transportation column working');
    } catch (error) {
      console.error('❌ packages.transportation still failing:', error.message);
    }

    try {
      await sql`SELECT updated_at FROM cart_items LIMIT 1`;
      console.log('✅ cart_items.updated_at column working');
    } catch (error) {
      console.error('❌ cart_items.updated_at still failing:', error.message);
    }

  } catch (error) {
    console.error('❌ Fix remaining columns failed:', error);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

fixRemainingColumns();
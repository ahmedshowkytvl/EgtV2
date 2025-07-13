/**
 * Critical Database Schema Fix Script
 * Fixes all missing columns causing API failures
 * January 12, 2025
 */

import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

const connectionString = process.env.DATABASE_URL || 'postgresql://egsite:Pass2020@74.179.85.9:5432/egsite_db?sslmode=disable';
const sql = postgres(connectionString);
const db = drizzle(sql);

async function fixCriticalDatabaseSchema() {
  try {
    console.log('🔧 Starting critical database schema fixes...');

    // 1. Fix packages table - add missing inclusions column
    console.log('📝 Fixing packages table - adding inclusions column...');
    await sql`
      DO $$ 
      BEGIN 
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'packages' AND column_name = 'inclusions'
        ) THEN 
          ALTER TABLE packages ADD COLUMN inclusions JSONB DEFAULT '[]';
          RAISE NOTICE 'Added inclusions column to packages table';
        ELSE
          RAISE NOTICE 'inclusions column already exists in packages table';
        END IF; 
      END $$;
    `;

    // 2. Fix tours table - add missing featured column
    console.log('📝 Fixing tours table - adding featured column...');
    await sql`
      DO $$ 
      BEGIN 
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'tours' AND column_name = 'featured'
        ) THEN 
          ALTER TABLE tours ADD COLUMN featured BOOLEAN DEFAULT FALSE;
          RAISE NOTICE 'Added featured column to tours table';
        ELSE
          RAISE NOTICE 'featured column already exists in tours table';
        END IF; 
      END $$;
    `;

    // 3. Fix cart_items table - add missing item_type column
    console.log('📝 Fixing cart_items table - adding item_type column...');
    await sql`
      DO $$ 
      BEGIN 
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'cart_items' AND column_name = 'item_type'
        ) THEN 
          ALTER TABLE cart_items ADD COLUMN item_type TEXT NOT NULL DEFAULT 'package';
          RAISE NOTICE 'Added item_type column to cart_items table';
        ELSE
          RAISE NOTICE 'item_type column already exists in cart_items table';
        END IF; 
      END $$;
    `;

    // 4. Fix hotels table - add missing service_charge_included column
    console.log('📝 Fixing hotels table - adding service_charge_included column...');
    await sql`
      DO $$ 
      BEGIN 
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'hotels' AND column_name = 'service_charge_included'
        ) THEN 
          ALTER TABLE hotels ADD COLUMN service_charge_included BOOLEAN DEFAULT FALSE;
          RAISE NOTICE 'Added service_charge_included column to hotels table';
        ELSE
          RAISE NOTICE 'service_charge_included column already exists in hotels table';
        END IF; 
      END $$;
    `;

    // 5. Fix hotel_facilities table - add missing description column
    console.log('📝 Fixing hotel_facilities table - adding description column...');
    await sql`
      DO $$ 
      BEGIN 
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'hotel_facilities' AND column_name = 'description'
        ) THEN 
          ALTER TABLE hotel_facilities ADD COLUMN description TEXT;
          RAISE NOTICE 'Added description column to hotel_facilities table';
        ELSE
          RAISE NOTICE 'description column already exists in hotel_facilities table';
        END IF; 
      END $$;
    `;

    // 6. Fix hotel_highlights table - add missing description column
    console.log('📝 Fixing hotel_highlights table - adding description column...');
    await sql`
      DO $$ 
      BEGIN 
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'hotel_highlights' AND column_name = 'description'
        ) THEN 
          ALTER TABLE hotel_highlights ADD COLUMN description TEXT;
          RAISE NOTICE 'Added description column to hotel_highlights table';
        ELSE
          RAISE NOTICE 'description column already exists in hotel_highlights table';
        END IF; 
      END $$;
    `;

    // 7. Fix cleanliness_features table - add missing created_by column
    console.log('📝 Fixing cleanliness_features table - adding created_by column...');
    await sql`
      DO $$ 
      BEGIN 
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'cleanliness_features' AND column_name = 'created_by'
        ) THEN 
          ALTER TABLE cleanliness_features ADD COLUMN created_by INTEGER REFERENCES users(id);
          RAISE NOTICE 'Added created_by column to cleanliness_features table';
        ELSE
          RAISE NOTICE 'created_by column already exists in cleanliness_features table';
        END IF; 
      END $$;
    `;

    // 8. Add any other missing essential columns
    console.log('📝 Adding other essential missing columns...');
    
    // Fix tours table - ensure all required columns exist
    await sql`
      DO $$ 
      BEGIN 
        -- Add category_id to tours if missing
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'tours' AND column_name = 'category_id'
        ) THEN 
          ALTER TABLE tours ADD COLUMN category_id INTEGER REFERENCES tour_categories(id);
          RAISE NOTICE 'Added category_id column to tours table';
        END IF;
        
        -- Add destination_id to tours if missing
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'tours' AND column_name = 'destination_id'
        ) THEN 
          ALTER TABLE tours ADD COLUMN destination_id INTEGER REFERENCES destinations(id);
          RAISE NOTICE 'Added destination_id column to tours table';
        END IF;
        
        -- Add duration to tours if missing
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'tours' AND column_name = 'duration'
        ) THEN 
          ALTER TABLE tours ADD COLUMN duration INTEGER DEFAULT 1;
          RAISE NOTICE 'Added duration column to tours table';
        END IF;
        
        -- Add price to tours if missing
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'tours' AND column_name = 'price'
        ) THEN 
          ALTER TABLE tours ADD COLUMN price INTEGER DEFAULT 0;
          RAISE NOTICE 'Added price column to tours table';
        END IF;
        
        -- Add currency to tours if missing
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'tours' AND column_name = 'currency'
        ) THEN 
          ALTER TABLE tours ADD COLUMN currency TEXT DEFAULT 'EGP';
          RAISE NOTICE 'Added currency column to tours table';
        END IF;
        
        -- Add active to tours if missing
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'tours' AND column_name = 'active'
        ) THEN 
          ALTER TABLE tours ADD COLUMN active BOOLEAN DEFAULT TRUE;
          RAISE NOTICE 'Added active column to tours table';
        END IF;
      END $$;
    `;

    // 9. Verify all critical columns are now present
    console.log('🔍 Verifying all critical columns are present...');
    
    const missingColumns = [];
    
    // Check packages.inclusions
    const packagesInclusions = await sql`
      SELECT column_name FROM information_schema.columns 
      WHERE table_name = 'packages' AND column_name = 'inclusions'
    `;
    if (packagesInclusions.length === 0) missingColumns.push('packages.inclusions');
    
    // Check tours.featured
    const toursFeatured = await sql`
      SELECT column_name FROM information_schema.columns 
      WHERE table_name = 'tours' AND column_name = 'featured'
    `;
    if (toursFeatured.length === 0) missingColumns.push('tours.featured');
    
    // Check cart_items.item_type
    const cartItemType = await sql`
      SELECT column_name FROM information_schema.columns 
      WHERE table_name = 'cart_items' AND column_name = 'item_type'
    `;
    if (cartItemType.length === 0) missingColumns.push('cart_items.item_type');
    
    // Check hotels.service_charge_included
    const hotelsServiceCharge = await sql`
      SELECT column_name FROM information_schema.columns 
      WHERE table_name = 'hotels' AND column_name = 'service_charge_included'
    `;
    if (hotelsServiceCharge.length === 0) missingColumns.push('hotels.service_charge_included');
    
    if (missingColumns.length > 0) {
      console.error('❌ Some columns are still missing:', missingColumns);
      throw new Error(`Missing critical columns: ${missingColumns.join(', ')}`);
    }

    console.log('✅ All critical database schema fixes completed successfully!');
    console.log('🚀 The following APIs should now work:');
    console.log('   - GET /api/packages (packages listing)');
    console.log('   - GET /api/tours (tours listing)');
    console.log('   - GET /api/cart (cart functionality)');
    console.log('   - POST /api/admin/hotels (hotel creation)');
    console.log('   - GET /api/admin/hotel-facilities');
    console.log('   - GET /api/admin/hotel-highlights');
    console.log('   - GET /api/admin/cleanliness-features');

  } catch (error) {
    console.error('❌ Critical database schema fix failed:', error);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

// Run the critical fixes
fixCriticalDatabaseSchema();

export { fixCriticalDatabaseSchema };
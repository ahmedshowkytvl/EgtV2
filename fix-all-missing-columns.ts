/**
 * Complete Database Column Fix Script
 * Adds ALL missing columns needed by the schema
 * January 12, 2025
 */

import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

const connectionString = process.env.DATABASE_URL || 'postgresql://egsite:Pass2020@74.179.85.9:5432/egsite_db?sslmode=disable';
const sql = postgres(connectionString);
const db = drizzle(sql);

async function fixAllMissingColumns() {
  try {
    console.log('🔧 Starting comprehensive database column fixes...');

    // 1. Fix packages table - add all missing columns
    console.log('📝 Fixing packages table - adding all missing columns...');
    await sql`
      DO $$ 
      BEGIN 
        -- route column
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'packages' AND column_name = 'route') THEN 
          ALTER TABLE packages ADD COLUMN route TEXT;
          RAISE NOTICE 'Added route column to packages table';
        END IF;
        
        -- ideal_for column
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'packages' AND column_name = 'ideal_for') THEN 
          ALTER TABLE packages ADD COLUMN ideal_for JSONB DEFAULT '[]';
          RAISE NOTICE 'Added ideal_for column to packages table';
        END IF;
        
        -- tour_selection column
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'packages' AND column_name = 'tour_selection') THEN 
          ALTER TABLE packages ADD COLUMN tour_selection JSONB DEFAULT '[]';
          RAISE NOTICE 'Added tour_selection column to packages table';
        END IF;
        
        -- included_features column
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'packages' AND column_name = 'included_features') THEN 
          ALTER TABLE packages ADD COLUMN included_features JSONB DEFAULT '[]';
          RAISE NOTICE 'Added included_features column to packages table';
        END IF;
        
        -- optional_excursions column
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'packages' AND column_name = 'optional_excursions') THEN 
          ALTER TABLE packages ADD COLUMN optional_excursions JSONB DEFAULT '[]';
          RAISE NOTICE 'Added optional_excursions column to packages table';
        END IF;
        
        -- excluded_features column
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'packages' AND column_name = 'excluded_features') THEN 
          ALTER TABLE packages ADD COLUMN excluded_features JSONB DEFAULT '[]';
          RAISE NOTICE 'Added excluded_features column to packages table';
        END IF;
        
        -- itinerary column
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'packages' AND column_name = 'itinerary') THEN 
          ALTER TABLE packages ADD COLUMN itinerary JSONB DEFAULT '[]';
          RAISE NOTICE 'Added itinerary column to packages table';
        END IF;
        
        -- what_to_pack column
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'packages' AND column_name = 'what_to_pack') THEN 
          ALTER TABLE packages ADD COLUMN what_to_pack JSONB DEFAULT '[]';
          RAISE NOTICE 'Added what_to_pack column to packages table';
        END IF;
        
        -- travel_route column
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'packages' AND column_name = 'travel_route') THEN 
          ALTER TABLE packages ADD COLUMN travel_route JSONB DEFAULT '[]';
          RAISE NOTICE 'Added travel_route column to packages table';
        END IF;
        
        -- accommodation_highlights column
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'packages' AND column_name = 'accommodation_highlights') THEN 
          ALTER TABLE packages ADD COLUMN accommodation_highlights JSONB DEFAULT '[]';
          RAISE NOTICE 'Added accommodation_highlights column to packages table';
        END IF;
        
        -- transportation_details column
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'packages' AND column_name = 'transportation_details') THEN 
          ALTER TABLE packages ADD COLUMN transportation_details JSONB DEFAULT '[]';
          RAISE NOTICE 'Added transportation_details column to packages table';
        END IF;
        
        -- pricing_mode column
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'packages' AND column_name = 'pricing_mode') THEN 
          ALTER TABLE packages ADD COLUMN pricing_mode TEXT DEFAULT 'per_booking';
          RAISE NOTICE 'Added pricing_mode column to packages table';
        END IF;
        
        -- start_date column
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'packages' AND column_name = 'start_date') THEN 
          ALTER TABLE packages ADD COLUMN start_date TIMESTAMP;
          RAISE NOTICE 'Added start_date column to packages table';
        END IF;
        
        -- end_date column
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'packages' AND column_name = 'end_date') THEN 
          ALTER TABLE packages ADD COLUMN end_date TIMESTAMP;
          RAISE NOTICE 'Added end_date column to packages table';
        END IF;
        
        -- valid_until column
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'packages' AND column_name = 'valid_until') THEN 
          ALTER TABLE packages ADD COLUMN valid_until TIMESTAMP;
          RAISE NOTICE 'Added valid_until column to packages table';
        END IF;
        
        -- adult_count column
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'packages' AND column_name = 'adult_count') THEN 
          ALTER TABLE packages ADD COLUMN adult_count INTEGER DEFAULT 2;
          RAISE NOTICE 'Added adult_count column to packages table';
        END IF;
        
        -- children_count column
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'packages' AND column_name = 'children_count') THEN 
          ALTER TABLE packages ADD COLUMN children_count INTEGER DEFAULT 0;
          RAISE NOTICE 'Added children_count column to packages table';
        END IF;
        
        -- infant_count column
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'packages' AND column_name = 'infant_count') THEN 
          ALTER TABLE packages ADD COLUMN infant_count INTEGER DEFAULT 0;
          RAISE NOTICE 'Added infant_count column to packages table';
        END IF;
        
      END $$;
    `;

    // 2. Fix tours table - add all missing columns
    console.log('📝 Fixing tours table - adding all missing columns...');
    await sql`
      DO $$ 
      BEGIN 
        -- start_date column
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tours' AND column_name = 'start_date') THEN 
          ALTER TABLE tours ADD COLUMN start_date TIMESTAMP;
          RAISE NOTICE 'Added start_date column to tours table';
        END IF;
        
        -- end_date column
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tours' AND column_name = 'end_date') THEN 
          ALTER TABLE tours ADD COLUMN end_date TIMESTAMP;
          RAISE NOTICE 'Added end_date column to tours table';
        END IF;
        
        -- trip_type column
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tours' AND column_name = 'trip_type') THEN 
          ALTER TABLE tours ADD COLUMN trip_type TEXT;
          RAISE NOTICE 'Added trip_type column to tours table';
        END IF;
        
        -- num_passengers column
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tours' AND column_name = 'num_passengers') THEN 
          ALTER TABLE tours ADD COLUMN num_passengers INTEGER;
          RAISE NOTICE 'Added num_passengers column to tours table';
        END IF;
        
        -- discounted_price column
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tours' AND column_name = 'discounted_price') THEN 
          ALTER TABLE tours ADD COLUMN discounted_price INTEGER;
          RAISE NOTICE 'Added discounted_price column to tours table';
        END IF;
        
        -- included column
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tours' AND column_name = 'included') THEN 
          ALTER TABLE tours ADD COLUMN included JSONB DEFAULT '[]';
          RAISE NOTICE 'Added included column to tours table';
        END IF;
        
        -- excluded column
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tours' AND column_name = 'excluded') THEN 
          ALTER TABLE tours ADD COLUMN excluded JSONB DEFAULT '[]';
          RAISE NOTICE 'Added excluded column to tours table';
        END IF;
        
        -- itinerary column
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tours' AND column_name = 'itinerary') THEN 
          ALTER TABLE tours ADD COLUMN itinerary JSONB DEFAULT '[]';
          RAISE NOTICE 'Added itinerary column to tours table';
        END IF;
        
        -- max_group_size column
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tours' AND column_name = 'max_group_size') THEN 
          ALTER TABLE tours ADD COLUMN max_group_size INTEGER;
          RAISE NOTICE 'Added max_group_size column to tours table';
        END IF;
        
        -- rating column
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tours' AND column_name = 'rating') THEN 
          ALTER TABLE tours ADD COLUMN rating DOUBLE PRECISION;
          RAISE NOTICE 'Added rating column to tours table';
        END IF;
        
        -- review_count column
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tours' AND column_name = 'review_count') THEN 
          ALTER TABLE tours ADD COLUMN review_count INTEGER DEFAULT 0;
          RAISE NOTICE 'Added review_count column to tours table';
        END IF;
        
        -- status column
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tours' AND column_name = 'status') THEN 
          ALTER TABLE tours ADD COLUMN status TEXT DEFAULT 'active';
          RAISE NOTICE 'Added status column to tours table';
        END IF;
        
        -- name_ar column
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tours' AND column_name = 'name_ar') THEN 
          ALTER TABLE tours ADD COLUMN name_ar TEXT;
          RAISE NOTICE 'Added name_ar column to tours table';
        END IF;
        
        -- description_ar column
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tours' AND column_name = 'description_ar') THEN 
          ALTER TABLE tours ADD COLUMN description_ar TEXT;
          RAISE NOTICE 'Added description_ar column to tours table';
        END IF;
        
        -- itinerary_ar column
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tours' AND column_name = 'itinerary_ar') THEN 
          ALTER TABLE tours ADD COLUMN itinerary_ar JSONB DEFAULT '[]';
          RAISE NOTICE 'Added itinerary_ar column to tours table';
        END IF;
        
        -- included_ar column
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tours' AND column_name = 'included_ar') THEN 
          ALTER TABLE tours ADD COLUMN included_ar JSONB DEFAULT '[]';
          RAISE NOTICE 'Added included_ar column to tours table';
        END IF;
        
        -- excluded_ar column
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tours' AND column_name = 'excluded_ar') THEN 
          ALTER TABLE tours ADD COLUMN excluded_ar JSONB DEFAULT '[]';
          RAISE NOTICE 'Added excluded_ar column to tours table';
        END IF;
        
        -- has_arabic_version column
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tours' AND column_name = 'has_arabic_version') THEN 
          ALTER TABLE tours ADD COLUMN has_arabic_version BOOLEAN DEFAULT FALSE;
          RAISE NOTICE 'Added has_arabic_version column to tours table';
        END IF;
        
        -- duration_type column
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tours' AND column_name = 'duration_type') THEN 
          ALTER TABLE tours ADD COLUMN duration_type TEXT DEFAULT 'days';
          RAISE NOTICE 'Added duration_type column to tours table';
        END IF;
        
        -- date column
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tours' AND column_name = 'date') THEN 
          ALTER TABLE tours ADD COLUMN date TIMESTAMP;
          RAISE NOTICE 'Added date column to tours table';
        END IF;
        
      END $$;
    `;

    // 3. Fix cart_items table - add all missing columns
    console.log('📝 Fixing cart_items table - adding all missing columns...');
    await sql`
      DO $$ 
      BEGIN 
        -- item_id column
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'cart_items' AND column_name = 'item_id') THEN 
          ALTER TABLE cart_items ADD COLUMN item_id INTEGER NOT NULL DEFAULT 0;
          RAISE NOTICE 'Added item_id column to cart_items table';
        END IF;
        
        -- quantity column
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'cart_items' AND column_name = 'quantity') THEN 
          ALTER TABLE cart_items ADD COLUMN quantity INTEGER NOT NULL DEFAULT 1;
          RAISE NOTICE 'Added quantity column to cart_items table';
        END IF;
        
        -- adults column
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'cart_items' AND column_name = 'adults') THEN 
          ALTER TABLE cart_items ADD COLUMN adults INTEGER DEFAULT 1;
          RAISE NOTICE 'Added adults column to cart_items table';
        END IF;
        
        -- children column
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'cart_items' AND column_name = 'children') THEN 
          ALTER TABLE cart_items ADD COLUMN children INTEGER DEFAULT 0;
          RAISE NOTICE 'Added children column to cart_items table';
        END IF;
        
        -- infants column
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'cart_items' AND column_name = 'infants') THEN 
          ALTER TABLE cart_items ADD COLUMN infants INTEGER DEFAULT 0;
          RAISE NOTICE 'Added infants column to cart_items table';
        END IF;
        
        -- check_in_date column
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'cart_items' AND column_name = 'check_in_date') THEN 
          ALTER TABLE cart_items ADD COLUMN check_in_date TIMESTAMP;
          RAISE NOTICE 'Added check_in_date column to cart_items table';
        END IF;
        
        -- check_out_date column
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'cart_items' AND column_name = 'check_out_date') THEN 
          ALTER TABLE cart_items ADD COLUMN check_out_date TIMESTAMP;
          RAISE NOTICE 'Added check_out_date column to cart_items table';
        END IF;
        
        -- travel_date column
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'cart_items' AND column_name = 'travel_date') THEN 
          ALTER TABLE cart_items ADD COLUMN travel_date TIMESTAMP;
          RAISE NOTICE 'Added travel_date column to cart_items table';
        END IF;
        
        -- configuration column
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'cart_items' AND column_name = 'configuration') THEN 
          ALTER TABLE cart_items ADD COLUMN configuration JSONB;
          RAISE NOTICE 'Added configuration column to cart_items table';
        END IF;
        
        -- price_at_add column
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'cart_items' AND column_name = 'price_at_add') THEN 
          ALTER TABLE cart_items ADD COLUMN price_at_add INTEGER NOT NULL DEFAULT 0;
          RAISE NOTICE 'Added price_at_add column to cart_items table';
        END IF;
        
        -- discounted_price_at_add column
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'cart_items' AND column_name = 'discounted_price_at_add') THEN 
          ALTER TABLE cart_items ADD COLUMN discounted_price_at_add INTEGER;
          RAISE NOTICE 'Added discounted_price_at_add column to cart_items table';
        END IF;
        
        -- notes column
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'cart_items' AND column_name = 'notes') THEN 
          ALTER TABLE cart_items ADD COLUMN notes TEXT;
          RAISE NOTICE 'Added notes column to cart_items table';
        END IF;
        
      END $$;
    `;

    // 4. Fix hotels table - add all missing columns
    console.log('📝 Fixing hotels table - adding all missing columns...');
    await sql`
      DO $$ 
      BEGIN 
        -- established_year column
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'hotels' AND column_name = 'established_year') THEN 
          ALTER TABLE hotels ADD COLUMN established_year INTEGER;
          RAISE NOTICE 'Added established_year column to hotels table';
        END IF;
        
        -- last_renovated_year column
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'hotels' AND column_name = 'last_renovated_year') THEN 
          ALTER TABLE hotels ADD COLUMN last_renovated_year INTEGER;
          RAISE NOTICE 'Added last_renovated_year column to hotels table';
        END IF;
        
        -- total_rooms column
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'hotels' AND column_name = 'total_rooms') THEN 
          ALTER TABLE hotels ADD COLUMN total_rooms INTEGER;
          RAISE NOTICE 'Added total_rooms column to hotels table';
        END IF;
        
        -- total_floors column
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'hotels' AND column_name = 'total_floors') THEN 
          ALTER TABLE hotels ADD COLUMN total_floors INTEGER;
          RAISE NOTICE 'Added total_floors column to hotels table';
        END IF;
        
        -- review_count column
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'hotels' AND column_name = 'review_count') THEN 
          ALTER TABLE hotels ADD COLUMN review_count INTEGER DEFAULT 0;
          RAISE NOTICE 'Added review_count column to hotels table';
        END IF;
        
        -- min_stay column
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'hotels' AND column_name = 'min_stay') THEN 
          ALTER TABLE hotels ADD COLUMN min_stay INTEGER DEFAULT 1;
          RAISE NOTICE 'Added min_stay column to hotels table';
        END IF;
        
        -- max_stay column
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'hotels' AND column_name = 'max_stay') THEN 
          ALTER TABLE hotels ADD COLUMN max_stay INTEGER;
          RAISE NOTICE 'Added max_stay column to hotels table';
        END IF;
        
        -- booking_lead_time column
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'hotels' AND column_name = 'booking_lead_time') THEN 
          ALTER TABLE hotels ADD COLUMN booking_lead_time INTEGER DEFAULT 0;
          RAISE NOTICE 'Added booking_lead_time column to hotels table';
        END IF;
        
        -- cancellation_policy column
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'hotels' AND column_name = 'cancellation_policy') THEN 
          ALTER TABLE hotels ADD COLUMN cancellation_policy TEXT;
          RAISE NOTICE 'Added cancellation_policy column to hotels table';
        END IF;
        
        -- languages column
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'hotels' AND column_name = 'languages') THEN 
          ALTER TABLE hotels ADD COLUMN languages JSONB DEFAULT '["en"]';
          RAISE NOTICE 'Added languages column to hotels table';
        END IF;
        
      END $$;
    `;

    console.log('✅ All missing database columns have been added successfully!');
    
    // Test the fixes
    console.log('🧪 Testing if the fixes resolved the issues...');
    
    // Quick test of each problematic query
    try {
      await sql`SELECT inclusions FROM packages LIMIT 1`;
      console.log('✅ packages.inclusions column working');
    } catch (error) {
      console.error('❌ packages.inclusions still failing:', error.message);
    }
    
    try {
      await sql`SELECT featured FROM tours LIMIT 1`;
      console.log('✅ tours.featured column working');
    } catch (error) {
      console.error('❌ tours.featured still failing:', error.message);
    }
    
    try {
      await sql`SELECT item_type FROM cart_items LIMIT 1`;
      console.log('✅ cart_items.item_type column working');
    } catch (error) {
      console.error('❌ cart_items.item_type still failing:', error.message);
    }
    
    try {
      await sql`SELECT service_charge_included FROM hotels LIMIT 1`;
      console.log('✅ hotels.service_charge_included column working');
    } catch (error) {
      console.error('❌ hotels.service_charge_included still failing:', error.message);
    }

  } catch (error) {
    console.error('❌ Comprehensive database fix failed:', error);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

// Run the comprehensive fixes
fixAllMissingColumns();
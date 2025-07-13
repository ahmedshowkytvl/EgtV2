import postgres from 'postgres';

async function addArabicPackagesColumns() {
  const sql = postgres(process.env.DATABASE_URL || 'postgresql://egsite:Pass2020@74.179.85.9:5432/egsite_db?sslmode=disable');
  
  try {
    await sql`
      DO $$ 
      BEGIN 
        -- Add all Arabic translation columns for packages
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'packages' AND column_name = 'ideal_for_ar') THEN 
          ALTER TABLE packages ADD COLUMN ideal_for_ar JSONB DEFAULT '[]';
          RAISE NOTICE 'Added ideal_for_ar column to packages table';
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'packages' AND column_name = 'what_to_pack_ar') THEN 
          ALTER TABLE packages ADD COLUMN what_to_pack_ar JSONB DEFAULT '[]';
          RAISE NOTICE 'Added what_to_pack_ar column to packages table';
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'packages' AND column_name = 'accommodation_highlights_ar') THEN 
          ALTER TABLE packages ADD COLUMN accommodation_highlights_ar JSONB DEFAULT '[]';
          RAISE NOTICE 'Added accommodation_highlights_ar column to packages table';
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'packages' AND column_name = 'transportation_details_ar') THEN 
          ALTER TABLE packages ADD COLUMN transportation_details_ar JSONB DEFAULT '[]';
          RAISE NOTICE 'Added transportation_details_ar column to packages table';
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'packages' AND column_name = 'excluded_items_ar') THEN 
          ALTER TABLE packages ADD COLUMN excluded_items_ar JSONB DEFAULT '[]';
          RAISE NOTICE 'Added excluded_items_ar column to packages table';
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'packages' AND column_name = 'optional_excursions_ar') THEN 
          ALTER TABLE packages ADD COLUMN optional_excursions_ar JSONB DEFAULT '[]';
          RAISE NOTICE 'Added optional_excursions_ar column to packages table';
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'packages' AND column_name = 'itinerary_ar') THEN 
          ALTER TABLE packages ADD COLUMN itinerary_ar JSONB DEFAULT '[]';
          RAISE NOTICE 'Added itinerary_ar column to packages table';
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'packages' AND column_name = 'travel_route_ar') THEN 
          ALTER TABLE packages ADD COLUMN travel_route_ar JSONB DEFAULT '[]';
          RAISE NOTICE 'Added travel_route_ar column to packages table';
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'packages' AND column_name = 'cancellation_policy_ar') THEN 
          ALTER TABLE packages ADD COLUMN cancellation_policy_ar TEXT;
          RAISE NOTICE 'Added cancellation_policy_ar column to packages table';
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'packages' AND column_name = 'children_policy_ar') THEN 
          ALTER TABLE packages ADD COLUMN children_policy_ar TEXT;
          RAISE NOTICE 'Added children_policy_ar column to packages table';
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'packages' AND column_name = 'terms_and_conditions_ar') THEN 
          ALTER TABLE packages ADD COLUMN terms_and_conditions_ar TEXT;
          RAISE NOTICE 'Added terms_and_conditions_ar column to packages table';
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'packages' AND column_name = 'custom_text_ar') THEN 
          ALTER TABLE packages ADD COLUMN custom_text_ar TEXT;
          RAISE NOTICE 'Added custom_text_ar column to packages table';
        END IF;
        
      END $$;
    `;
    console.log('✅ Added all Arabic translation columns to packages table');
  } finally {
    await sql.end();
  }
}

addArabicPackagesColumns();
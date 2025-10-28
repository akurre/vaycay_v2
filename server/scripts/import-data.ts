import { PrismaClient } from '@prisma/client';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const prisma = new PrismaClient();

interface WeatherDataRecord {
  city: string;
  country: string;
  lat: number;
  long: number;
  population?: number;
  date: string;
  name: string;
  PRCP?: number | null;
  SNWD?: number | null;
  TAVG?: number | null;
  TMAX?: number | null;
  TMIN?: number | null;
  state?: string;
  suburb?: string;
  submitter_id?: string;
}

interface ImportStats {
  total: number;
  imported: number;
  skipped: number;
  errors: number;
}

async function importData(filePath: string) {
  console.log('🚀 Starting data import...');
  console.log(`📁 Reading file: ${filePath}`);

  const stats: ImportStats = {
    total: 0,
    imported: 0,
    skipped: 0,
    errors: 0,
  };

  try {
    // Read and parse the JSON file
    const fileContent = readFileSync(filePath, 'utf-8');
    const data: WeatherDataRecord[] = JSON.parse(fileContent);
    
    stats.total = data.length;
    console.log(`📊 Total records to import: ${stats.total}`);

    // Process in batches of 1000 records
    const batchSize = 1000;
    const batches = Math.ceil(data.length / batchSize);

    for (let i = 0; i < batches; i++) {
      const start = i * batchSize;
      const end = Math.min(start + batchSize, data.length);
      const batch = data.slice(start, end);

      console.log(`\n📦 Processing batch ${i + 1}/${batches} (records ${start + 1}-${end})`);

      try {
        // Transform the data to match Prisma schema
        const transformedBatch = batch.map((record) => ({
          city: record.city,
          country: record.country || null,
          state: record.state || null,
          suburb: record.suburb || null,
          lat: record.lat?.toString() || null,
          long: record.long?.toString() || null,
          population: record.population || null,
          date: record.date,
          name: record.name,
          PRCP: record.PRCP || null,
          SNWD: record.SNWD || null,
          TAVG: record.TAVG || null,
          TMAX: record.TMAX || null,
          TMIN: record.TMIN || null,
          submitter_id: record.submitter_id || null,
        }));

        // Insert batch with skipDuplicates to handle existing records
        const result = await prisma.weatherData.createMany({
          data: transformedBatch,
          skipDuplicates: true,
        });

        stats.imported += result.count;
        stats.skipped += batch.length - result.count;

        console.log(`✅ Imported: ${result.count}, Skipped: ${batch.length - result.count}`);
      } catch (error) {
        console.error(`❌ Error processing batch ${i + 1}:`, error);
        stats.errors += batch.length;
      }

      // Progress update every 10 batches
      if ((i + 1) % 10 === 0) {
        const progress = ((end / data.length) * 100).toFixed(1);
        console.log(`\n📈 Progress: ${progress}% (${end}/${data.length} records)`);
      }
    }

    // Final statistics
    console.log('\n' + '='.repeat(60));
    console.log('📊 Import Complete!');
    console.log('='.repeat(60));
    console.log(`Total records:    ${stats.total}`);
    console.log(`✅ Imported:      ${stats.imported}`);
    console.log(`⏭️  Skipped:       ${stats.skipped} (duplicates)`);
    console.log(`❌ Errors:        ${stats.errors}`);
    console.log('='.repeat(60));

    // Verify import
    const count = await prisma.weatherData.count();
    console.log(`\n🗄️  Total records in database: ${count}`);

  } catch (error) {
    console.error('❌ Fatal error during import:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Main execution
async function main() {
  // Get file path from command line args or use default
  const args = process.argv.slice(2);
  let filePath = 'vaycay/weather_data/16April2024/cleaned_weather-data_10000population_Italy.json';

  // Parse command line arguments
  for (const arg of args) {
    if (arg.startsWith('--file=')) {
      filePath = arg.split('=')[1];
    }
  }

  // Resolve to absolute path from project root
  const absolutePath = resolve(process.cwd(), '..', filePath);

  console.log('🌍 Vaycay Weather Data Import Tool');
  console.log('='.repeat(60));
  console.log(`📂 File: ${filePath}`);
  console.log(`📍 Absolute path: ${absolutePath}`);
  console.log('='.repeat(60));

  await importData(absolutePath);
}

main()
  .catch((error) => {
    console.error('💥 Import failed:', error);
    process.exit(1);
  });

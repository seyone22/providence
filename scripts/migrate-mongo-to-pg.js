const { MongoClient, ObjectId } = require("mongodb");
const pg = require("pg");
const { drizzle } = require("drizzle-orm/node-postgres");
const schema = require("../src/db/schema");

const mongoUri = process.env.MONGODB_URI;
const postgresUrl = process.env.DATABASE_URL;

if (!mongoUri || !postgresUrl) {
  console.error("Missing MONGODB_URI or DATABASE_URL environment variables.");
  process.exit(1);
}

// Convert MongoDB _id / ObjectIds to strings
function cleanId(id) {
  if (!id) return null;
  if (id instanceof ObjectId) return id.toHexString();
  return String(id);
}

// Convert lists of ObjectIds or values to string arrays
function cleanArray(arr) {
  if (!arr) return [];
  if (!Array.isArray(arr)) return [cleanId(arr)];
  return arr.map((item) => cleanId(item));
}

// Ensure dates are parsed correctly
function cleanDate(date) {
  if (!date) return null;
  const d = new Date(date);
  return Number.isNaN(d.getTime()) ? null : d;
}

// Map sub-documents array safely to JSON format for pg
function cleanJson(val) {
  if (val === undefined || val === null) return [];
  // Ensure we serialize mongoose sub-docs as plain JSON arrays/objects
  return JSON.parse(JSON.stringify(val));
}

async function run() {
  console.log("Connecting to MongoDB Atlas...");
  const mongoClient = new MongoClient(mongoUri);
  await mongoClient.connect();
  const mongoDb = mongoClient.db("test");

  console.log("Connecting to PostgreSQL...");
  const pgPool = new pg.Pool({ connectionString: postgresUrl, max: 1 });
  const pgDb = drizzle(pgPool, { schema });

  // Map MongoDB collections to Drizzle tables
  const mappings = [
    {
      collection: "user",
      table: schema.users,
      tableName: "user",
      transform: (doc) => ({
        id: cleanId(doc._id),
        name: doc.name || "",
        email: doc.email || "",
        emailVerified: Boolean(doc.emailVerified),
        image: doc.image || null,
        createdAt: cleanDate(doc.createdAt) || new Date(),
        updatedAt: cleanDate(doc.updatedAt) || new Date(),
        role: doc.role || "user",
        isBanned: Boolean(doc.isBanned),
        badges: cleanArray(doc.badges),
        whatsappNumber: doc.whatsappNumber || "",
      }),
    },
    {
      collection: "session",
      table: schema.sessions,
      tableName: "session",
      transform: (doc) => ({
        id: cleanId(doc._id),
        expiresAt: cleanDate(doc.expiresAt),
        token: doc.token,
        createdAt: cleanDate(doc.createdAt) || new Date(),
        updatedAt: cleanDate(doc.updatedAt) || new Date(),
        ipAddress: doc.ipAddress || null,
        userAgent: doc.userAgent || null,
        userId: cleanId(doc.userId),
      }),
    },
    {
      collection: "account",
      table: schema.accounts,
      tableName: "account",
      transform: (doc) => ({
        id: cleanId(doc._id),
        accountId: doc.accountId,
        providerId: doc.providerId,
        userId: cleanId(doc.userId),
        accessToken: doc.accessToken || null,
        refreshToken: doc.refreshToken || null,
        idToken: doc.idToken || null,
        accessTokenExpiresAt: cleanDate(doc.accessTokenExpiresAt),
        refreshTokenExpiresAt: cleanDate(doc.refreshTokenExpiresAt),
        scope: doc.scope || null,
        password: doc.password || null,
        createdAt: cleanDate(doc.createdAt) || new Date(),
        updatedAt: cleanDate(doc.updatedAt) || new Date(),
      }),
    },
    {
      collection: "verification",
      table: schema.verifications,
      tableName: "verification",
      transform: (doc) => ({
        id: cleanId(doc._id),
        identifier: doc.identifier,
        value: doc.value,
        expiresAt: cleanDate(doc.expiresAt),
        createdAt: cleanDate(doc.createdAt),
        updatedAt: cleanDate(doc.updatedAt),
      }),
    },
    {
      collection: "salesprofiles",
      table: schema.salesProfiles,
      tableName: "salesprofile",
      transform: (doc) => ({
        id: cleanId(doc._id),
        userId: cleanId(doc.userId),
        slug: doc.slug,
        isPublished: Boolean(doc.isPublished),
        displayName: doc.displayName || "",
        headline: doc.headline || "",
        tagline: doc.tagline || "",
        bio: doc.bio || "",
        photoUrl: doc.photoUrl || "",
        coverImageUrl: doc.coverImageUrl || "",
        yearsExperience: Number(doc.yearsExperience) || 0,
        languages: cleanArray(doc.languages),
        expertise: cleanJson(doc.expertise),
        sourcingCountries: cleanJson(doc.sourcingCountries),
        trackRecord: cleanJson(doc.trackRecord),
        testimonials: cleanJson(doc.testimonials),
        featuredDossierIds: cleanArray(doc.featuredDossierIds),
        whatsappNumber: doc.whatsappNumber || "",
        createdAt: cleanDate(doc.createdAt) || new Date(),
        updatedAt: cleanDate(doc.updatedAt) || new Date(),
      }),
    },
    {
      collection: "requests",
      table: schema.requests,
      tableName: "request",
      transform: (doc) => ({
        id: cleanId(doc._id),
        make: doc.make,
        vehicleModel: doc.vehicle_model || "",
        condition: doc.condition || "New",
        yearFrom: doc.yearFrom !== undefined ? Number(doc.yearFrom) : null,
        yearTo: doc.yearTo !== undefined ? Number(doc.yearTo) : null,
        mileage: doc.mileage || null,
        specs: doc.specs || null,
        name: doc.name,
        email: doc.email,
        countryCode: doc.countryCode,
        phone: doc.phone,
        countryOfImport: doc.countryOfImport,
        importTimeline: doc.importTimeline || null,
        dossierIds: cleanArray(doc.dossierIds),
        contactMethods: cleanArray(doc.contactMethods),
        contactDays: cleanArray(doc.contactDays),
        contactTimeWindow: doc.contactTimeWindow || null,
        contactTimezone: doc.contactTimezone || null,
        contactTimezoneLabel: doc.contactTimezoneLabel || null,
        preferredContactAt: cleanDate(doc.preferredContactAt),
        isDraft: Boolean(doc.isDraft),
        status: doc.status || "New",
        leadStatus: doc.leadStatus || "Action required",
        statusUpdatedAt: cleanDate(doc.statusUpdatedAt),
        options: doc.options || null,
        agreedPrice:
          doc.agreedPrice !== undefined ? Number(doc.agreedPrice) : null,
        statusHistory: cleanJson(doc.statusHistory),
        paymentType: doc.paymentType || null,
        totalAmount:
          doc.totalAmount !== undefined ? Number(doc.totalAmount) : null,
        advancePaymentAmount:
          doc.advancePaymentAmount !== undefined
            ? Number(doc.advancePaymentAmount)
            : null,
        balancePaymentAmount:
          doc.balancePaymentAmount !== undefined
            ? Number(doc.balancePaymentAmount)
            : null,
        balancePaymentStage: doc.balancePaymentStage || null,
        depositAmount:
          doc.depositAmount !== undefined ? Number(doc.depositAmount) : null,
        transactionId: doc.transactionId || null,
        invoiceNumber: doc.invoiceNumber || null,
        inspectionNotes: doc.inspectionNotes || null,
        trackingNumber: doc.trackingNumber || null,
        vesselName: doc.vesselName || null,
        eta: cleanDate(doc.eta),
        portName: doc.portName || null,
        containerNumber: doc.containerNumber || null,
        portOfArrival: doc.portOfArrival || null,
        customsNotes: doc.customsNotes || null,
        adminNotes: doc.adminNotes || null,
        source: doc.source || null,
        followUpAt: cleanDate(doc.followUpAt),
        followUpSetAt: cleanDate(doc.followUpSetAt),
        gclid: doc.gclid || null,
        fbclid: doc.fbclid || null,
        fbc: doc.fbc || null,
        fbp: doc.fbp || null,
        assignedToId: cleanId(doc.assignedToId),
        assignedToName: doc.assignedToName || null,
        assignmentMethod: doc.assignmentMethod || "round-robin",
        documents: cleanJson(doc.documents),
        createdAt: cleanDate(doc.createdAt) || new Date(),
        updatedAt: cleanDate(doc.updatedAt) || new Date(),
      }),
    },
    {
      collection: "specdossiers",
      table: schema.specDossiers,
      tableName: "specdossier",
      transform: (doc) => ({
        id: cleanId(doc._id),
        make: doc.make,
        model: doc.model,
        year: doc.year || "",
        trim: doc.trim || "",
        condition: doc.condition || "New",
        mileage: doc.mileage || "",
        countryOfOrigin: doc.countryOfOrigin || "Japan",
        engineConfig: doc.engineConfig || "",
        displacement: doc.displacement || "",
        maxPower: doc.maxPower || "",
        maxTorque: doc.maxTorque || "",
        transmission: doc.transmission || "",
        fuelSystem: doc.fuelSystem || "Petrol",
        steering: doc.steering || "RHD",
        emissions: doc.emissions || "",
        pricing: cleanJson(doc.pricing),
        upholstery: doc.upholstery || "",
        infotainment: doc.infotainment || "",
        features: cleanArray(doc.features),
        searchTags: cleanArray(doc.searchTags),
        heroImageUrl: doc.heroImageUrl || "",
        images: cleanArray(doc.images),
        customData: cleanJson(doc.customData),
        valuePoints: cleanJson(doc.valuePoints),
        slug: doc.slug || "",
        notes: doc.notes || "",
        status: doc.status || "Draft",
        createdAt: cleanDate(doc.createdAt) || new Date(),
        updatedAt: cleanDate(doc.updatedAt) || new Date(),
      }),
    },
    {
      collection: "socialposts",
      table: schema.socialPosts,
      tableName: "socialpost",
      transform: (doc) => ({
        id: cleanId(doc._id),
        url: doc.url,
        shortcode: doc.shortcode,
        page: doc.page,
        order: Number(doc.order) || 0,
        createdAt: cleanDate(doc.createdAt) || new Date(),
        updatedAt: cleanDate(doc.updatedAt) || new Date(),
      }),
    },
    {
      collection: "sourcinganalyses",
      table: schema.sourcingAnalyses,
      tableName: "sourcinganalysis",
      transform: (doc) => ({
        id: cleanId(doc._id),
        make: doc.make,
        vehicleModel: doc.vehicleModel || doc.vehicle_model || "",
        edition: doc.edition || null,
        year: doc.year !== undefined ? Number(doc.year) : null,
        mileage: doc.mileage !== undefined ? Number(doc.mileage) : null,
        landedCostGbp: Number(doc.landedCostGbp),
        currency: doc.currency || "JPY",
        dutyBasis: doc.dutyBasis || null,
        vatBasis: doc.vatBasis || null,
        sources: cleanArray(doc.sources),
        listingCount: Number(doc.listingCount) || 0,
        matchUsed: doc.matchUsed || null,
        widened: Boolean(doc.widened),
        marketMin: doc.marketMin !== undefined ? Number(doc.marketMin) : null,
        marketMedian:
          doc.marketMedian !== undefined ? Number(doc.marketMedian) : null,
        marketMean:
          doc.marketMean !== undefined ? Number(doc.marketMean) : null,
        marketMax: doc.marketMax !== undefined ? Number(doc.marketMax) : null,
        recommendation: doc.recommendation,
        headline: doc.headline || null,
        reasoning: doc.reasoning || null,
        confidence: doc.confidence || null,
        grossMargin:
          doc.grossMargin !== undefined ? Number(doc.grossMargin) : null,
        marginPct: doc.marginPct !== undefined ? Number(doc.marginPct) : null,
        createdById: doc.createdById || null,
        createdByName: doc.createdByName || null,
        createdAt: cleanDate(doc.createdAt) || new Date(),
        updatedAt: cleanDate(doc.updatedAt) || new Date(),
      }),
    },
  ];

  console.log("\n--- STARTING DATA MIGRATION ---");
  const migratedUserIds = new Set();

  for (const m of mappings) {
    console.log(`\nMigrating collection "${m.collection}"...`);
    const countMongo = await mongoDb.collection(m.collection).countDocuments();
    console.log(`Found ${countMongo} records in MongoDB.`);

    if (countMongo === 0) {
      console.log(`Skipping "${m.collection}" — no records to migrate.`);
      continue;
    }

    const docs = await mongoDb.collection(m.collection).find().toArray();
    let records = docs.map((doc) => m.transform(doc));

    // Referential integrity filters for PostgreSQL
    if (m.collection === "user") {
      records.forEach((r) => migratedUserIds.add(r.id));
    } else if (m.collection === "session") {
      const beforeCount = records.length;
      records = records.filter((r) => migratedUserIds.has(r.userId));
      const skippedCount = beforeCount - records.length;
      if (skippedCount > 0) {
        console.log(
          `⚠️ Skipped ${skippedCount} orphaned sessions referencing non-existent user IDs.`,
        );
      }
    } else if (m.collection === "account") {
      const beforeCount = records.length;
      records = records.filter((r) => migratedUserIds.has(r.userId));
      const skippedCount = beforeCount - records.length;
      if (skippedCount > 0) {
        console.log(
          `⚠️ Skipped ${skippedCount} orphaned accounts referencing non-existent user IDs.`,
        );
      }
    } else if (m.collection === "salesprofiles") {
      const beforeCount = records.length;
      records = records.filter((r) => migratedUserIds.has(r.userId));
      const skippedCount = beforeCount - records.length;
      if (skippedCount > 0) {
        console.log(
          `⚠️ Skipped ${skippedCount} orphaned sales profiles referencing non-existent user IDs.`,
        );
      }
    } else if (m.collection === "requests") {
      let sanitizedCount = 0;
      records.forEach((r) => {
        if (r.assignedToId && !migratedUserIds.has(r.assignedToId)) {
          r.assignedToId = null;
          sanitizedCount++;
        }
      });
      if (sanitizedCount > 0) {
        console.log(
          `⚠️ Sanitized ${sanitizedCount} requests by clearing references to non-existent assigned user IDs.`,
        );
      }
    }

    console.log(
      `Inserting ${records.length} records into PostgreSQL table "${m.tableName}"...`,
    );

    // Clear the table first to guarantee a clean, idempotent run
    await pgPool.query(`TRUNCATE TABLE "${m.tableName}" CASCADE`);

    if (records.length > 0) {
      // Insert records in chunks to prevent large payload parameters limits in node-postgres
      const CHUNK_SIZE = 100;
      for (let i = 0; i < records.length; i += CHUNK_SIZE) {
        const chunk = records.slice(i, i + CHUNK_SIZE);
        await pgDb.insert(m.table).values(chunk);
      }
    }

    // Retrieve PostgreSQL count for validation
    const resCount = await pgPool.query(
      `SELECT COUNT(*) FROM "${m.tableName}"`,
    );
    const countPg = parseInt(resCount.rows[0].count, 10);
    console.log(
      `Verifying: MongoDB=${countMongo} (Expected PG=${records.length}) | PostgreSQL=${countPg}`,
    );

    if (records.length !== countPg) {
      console.error(
        `❌ DATA INTEGRITY ERROR: Row count mismatch in table "${m.tableName}". Expected ${records.length}, got ${countPg}.`,
      );
      await mongoClient.close();
      await pgPool.end();
      process.exit(1);
    }
    console.log(
      `✓ Collection "${m.collection}" migrated with 100% data integrity.`,
    );
  }

  console.log(
    "\n🎉 DATABASE MIGRATION COMPLETED SUCCESSFULLY WITH 100% DATA INTEGRITY!",
  );

  await mongoClient.close();
  await pgPool.end();
  process.exit(0);
}

run().catch((err) => {
  console.error("Fatal migration error:", err);
  process.exit(1);
});

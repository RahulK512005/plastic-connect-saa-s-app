/**
 * MongoDB Import Script for PlasticConnect Database
 * Usage: mongosh mongodb://localhost:27017/plastic_connect < mongodb-import.js
 * 
 * This script creates collections, sets up indexes, and inserts sample data
 */

// Switch to the plastic_connect database
db = db.getSiblingDB('plastic_connect');

console.log('Starting MongoDB database setup...');

// Drop existing collections
db.dropCollection('users').catch(() => {});
db.dropCollection('listings').catch(() => {});
db.dropCollection('bids').catch(() => {});
db.dropCollection('transactions').catch(() => {});
db.dropCollection('ai_grading_results').catch(() => {});

console.log('Dropped existing collections');

// ==================== USERS COLLECTION ====================
db.createCollection('users', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['id', 'email', 'password', 'name', 'role', 'createdAt'],
      properties: {
        _id: { bsonType: 'objectId' },
        id: { bsonType: 'string' },
        name: { bsonType: 'string' },
        email: { bsonType: 'string' },
        password: { bsonType: 'string' },
        role: { enum: ['COLLECTOR', 'BRAND'] },
        company: { bsonType: 'string' },
        phone: { bsonType: 'string' },
        createdAt: { bsonType: 'date' }
      }
    }
  }
});

db.users.createIndex({ id: 1 }, { unique: true });
db.users.createIndex({ email: 1 }, { unique: true });

db.users.insertMany([
  {
    id: 'user-001',
    name: 'Rajesh Kumar',
    email: 'collector@example.com',
    password: '$2b$10$7N/WqZE8QFG3l7g4k8Z9X.8F9G9Y8Z0A1B2C3D4E5F6G7H8I9J0K',
    role: 'COLLECTOR',
    company: 'Kumar Waste Solutions',
    phone: '+91 98765 43210',
    createdAt: new Date('2025-01-15T10:00:00Z')
  },
  {
    id: 'user-002',
    name: 'GreenCycle Industries',
    email: 'brand@example.com',
    password: '$2b$10$7N/WqZE8QFG3l7g4k8Z9X.8F9G9Y8Z0A1B2C3D4E5F6G7H8I9J0K',
    role: 'BRAND',
    company: 'GreenCycle Industries',
    phone: '+91 98765 43211',
    createdAt: new Date('2025-01-15T10:00:00Z')
  },
  {
    id: 'user-003',
    name: 'Priya Sharma',
    email: 'collector2@example.com',
    password: '$2b$10$7N/WqZE8QFG3l7g4k8Z9X.8F9G9Y8Z0A1B2C3D4E5F6G7H8I9J0K',
    role: 'COLLECTOR',
    company: 'Sharma Recycling',
    phone: '+91 98765 43212',
    createdAt: new Date('2025-01-20T10:00:00Z')
  },
  {
    id: 'user-004',
    name: 'EcoPlast Ltd',
    email: 'brand2@example.com',
    password: '$2b$10$7N/WqZE8QFG3l7g4k8Z9X.8F9G9Y8Z0A1B2C3D4E5F6G7H8I9J0K',
    role: 'BRAND',
    company: 'EcoPlast Ltd',
    phone: '+91 98765 43213',
    createdAt: new Date('2025-01-20T10:00:00Z')
  }
]);

console.log('✓ Created users collection with 4 sample users');

// ==================== LISTINGS COLLECTION ====================
db.createCollection('listings', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['id', 'collectorId', 'collectorName', 'materialType', 'weightKg', 'purityPercent', 'contaminationPercent', 'grade', 'pricePerKg', 'location', 'status', 'createdAt'],
      properties: {
        _id: { bsonType: 'objectId' },
        id: { bsonType: 'string' },
        collectorId: { bsonType: 'string' },
        collectorName: { bsonType: 'string' },
        materialType: { enum: ['PET', 'HDPE', 'LDPE', 'Mixed', 'PP', 'PS'] },
        weightKg: { bsonType: 'number' },
        purityPercent: { bsonType: 'number' },
        contaminationPercent: { bsonType: 'number' },
        grade: { enum: ['A', 'B', 'C'] },
        pricePerKg: { bsonType: 'number' },
        location: { bsonType: 'string' },
        description: { bsonType: 'string' },
        imageUrl: { bsonType: 'string' },
        status: { enum: ['ACTIVE', 'SOLD', 'CANCELLED'] },
        highestBidAmount: { bsonType: 'number' },
        createdAt: { bsonType: 'date' }
      }
    }
  }
});

db.listings.createIndex({ id: 1 }, { unique: true });
db.listings.createIndex({ collectorId: 1 });
db.listings.createIndex({ status: 1 });
db.listings.createIndex({ materialType: 1 });
db.listings.createIndex({ grade: 1 });

db.listings.insertMany([
  {
    id: 'lst-001',
    collectorId: 'user-001',
    collectorName: 'Rajesh Kumar',
    materialType: 'PET',
    weightKg: 500,
    purityPercent: 96,
    contaminationPercent: 4,
    grade: 'A',
    pricePerKg: 42,
    location: 'Mumbai, Maharashtra',
    description: 'Clean PET bottles, sorted and baled',
    imageUrl: '/images/pet-bottles.jpg',
    status: 'ACTIVE',
    highestBidAmount: 44,
    createdAt: new Date('2025-12-01T10:00:00Z')
  },
  {
    id: 'lst-002',
    collectorId: 'user-001',
    collectorName: 'Rajesh Kumar',
    materialType: 'HDPE',
    weightKg: 300,
    purityPercent: 92,
    contaminationPercent: 8,
    grade: 'A',
    pricePerKg: 55,
    location: 'Delhi, NCR',
    description: 'HDPE containers and drums',
    imageUrl: '/images/hdpe-containers.jpg',
    status: 'ACTIVE',
    createdAt: new Date('2025-12-05T14:30:00Z')
  },
  {
    id: 'lst-003',
    collectorId: 'user-003',
    collectorName: 'Priya Sharma',
    materialType: 'PET',
    weightKg: 250,
    purityPercent: 88,
    contaminationPercent: 12,
    grade: 'B',
    pricePerKg: 38,
    location: 'Bangalore, Karnataka',
    description: 'Used PET bottles mixed colors',
    imageUrl: '/images/pet-mixed.jpg',
    status: 'ACTIVE',
    highestBidAmount: 40,
    createdAt: new Date('2025-12-10T09:15:00Z')
  },
  {
    id: 'lst-004',
    collectorId: 'user-001',
    collectorName: 'Rajesh Kumar',
    materialType: 'Mixed',
    weightKg: 1000,
    purityPercent: 75,
    contaminationPercent: 25,
    grade: 'C',
    pricePerKg: 25,
    location: 'Mumbai, Maharashtra',
    description: 'Mixed plastic waste assortment',
    imageUrl: '/images/mixed-plastic.jpg',
    status: 'SOLD',
    createdAt: new Date('2025-11-15T08:00:00Z')
  }
]);

console.log('✓ Created listings collection with 4 sample listings');

// ==================== BIDS COLLECTION ====================
db.createCollection('bids', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['id', 'listingId', 'brandId', 'brandName', 'pricePerKg', 'totalCost', 'status', 'createdAt'],
      properties: {
        _id: { bsonType: 'objectId' },
        id: { bsonType: 'string' },
        listingId: { bsonType: 'string' },
        brandId: { bsonType: 'string' },
        brandName: { bsonType: 'string' },
        pricePerKg: { bsonType: 'number' },
        totalCost: { bsonType: 'number' },
        status: { enum: ['PENDING', 'ACCEPTED', 'REJECTED'] },
        createdAt: { bsonType: 'date' }
      }
    }
  }
});

db.bids.createIndex({ id: 1 }, { unique: true });
db.bids.createIndex({ listingId: 1 });
db.bids.createIndex({ brandId: 1 });

db.bids.insertMany([
  {
    id: 'bid-001',
    listingId: 'lst-001',
    brandId: 'user-002',
    brandName: 'GreenCycle Industries',
    pricePerKg: 44,
    totalCost: 22000,
    status: 'PENDING',
    createdAt: new Date('2025-12-02T11:00:00Z')
  },
  {
    id: 'bid-002',
    listingId: 'lst-001',
    brandId: 'user-004',
    brandName: 'EcoPlast Ltd',
    pricePerKg: 43,
    totalCost: 21500,
    status: 'PENDING',
    createdAt: new Date('2025-12-02T12:30:00Z')
  },
  {
    id: 'bid-003',
    listingId: 'lst-003',
    brandId: 'user-002',
    brandName: 'GreenCycle Industries',
    pricePerKg: 40,
    totalCost: 10000,
    status: 'ACCEPTED',
    createdAt: new Date('2025-12-11T10:00:00Z')
  }
]);

console.log('✓ Created bids collection with 3 sample bids');

// ==================== TRANSACTIONS COLLECTION ====================
db.createCollection('transactions', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['id', 'listingId', 'collectorId', 'brandId', 'materialType', 'weightKg', 'pricePerKg', 'totalAmount', 'status', 'buyerName', 'sellerName', 'createdAt'],
      properties: {
        _id: { bsonType: 'objectId' },
        id: { bsonType: 'string' },
        listingId: { bsonType: 'string' },
        collectorId: { bsonType: 'string' },
        brandId: { bsonType: 'string' },
        materialType: { bsonType: 'string' },
        weightKg: { bsonType: 'number' },
        pricePerKg: { bsonType: 'number' },
        totalAmount: { bsonType: 'number' },
        status: { enum: ['PENDING', 'PAYMENT_PENDING', 'IN_PROGRESS', 'COMPLETED'] },
        buyerName: { bsonType: 'string' },
        sellerName: { bsonType: 'string' },
        createdAt: { bsonType: 'date' }
      }
    }
  }
});

db.transactions.createIndex({ id: 1 }, { unique: true });
db.transactions.createIndex({ collectorId: 1 });
db.transactions.createIndex({ brandId: 1 });
db.transactions.createIndex({ status: 1 });

db.transactions.insertMany([
  {
    id: 'txn-001',
    listingId: 'lst-004',
    collectorId: 'user-001',
    brandId: 'user-002',
    materialType: 'Mixed',
    weightKg: 1000,
    pricePerKg: 25,
    totalAmount: 25000,
    status: 'COMPLETED',
    buyerName: 'GreenCycle Industries',
    sellerName: 'Rajesh Kumar',
    createdAt: new Date('2025-11-20T10:00:00Z')
  },
  {
    id: 'txn-002',
    listingId: 'lst-001',
    collectorId: 'user-001',
    brandId: 'user-002',
    materialType: 'PET',
    weightKg: 500,
    pricePerKg: 42,
    totalAmount: 21000,
    status: 'IN_PROGRESS',
    buyerName: 'GreenCycle Industries',
    sellerName: 'Rajesh Kumar',
    createdAt: new Date('2025-12-02T11:00:00Z')
  },
  {
    id: 'txn-003',
    listingId: 'lst-003',
    collectorId: 'user-003',
    brandId: 'user-002',
    materialType: 'PET',
    weightKg: 250,
    pricePerKg: 40,
    totalAmount: 10000,
    status: 'PENDING',
    buyerName: 'GreenCycle Industries',
    sellerName: 'Priya Sharma',
    createdAt: new Date('2025-12-11T10:00:00Z')
  }
]);

console.log('✓ Created transactions collection with 3 sample transactions');

// ==================== AI GRADING RESULTS COLLECTION ====================
db.createCollection('ai_grading_results', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['id', 'userId', 'materialType', 'purityPercent', 'contaminationPercent', 'weightKg', 'grade', 'confidence', 'createdAt'],
      properties: {
        _id: { bsonType: 'objectId' },
        id: { bsonType: 'string' },
        userId: { bsonType: 'string' },
        materialType: { bsonType: 'string' },
        purityPercent: { bsonType: 'number' },
        contaminationPercent: { bsonType: 'number' },
        weightKg: { bsonType: 'number' },
        grade: { enum: ['A', 'B', 'C'] },
        confidence: { bsonType: 'number' },
        verified: { bsonType: 'bool' },
        imageUrl: { bsonType: 'string' },
        createdAt: { bsonType: 'date' }
      }
    }
  }
});

db.ai_grading_results.createIndex({ id: 1 }, { unique: true });
db.ai_grading_results.createIndex({ userId: 1 });

db.ai_grading_results.insertMany([
  {
    id: 'grade-001',
    userId: 'user-001',
    materialType: 'PET',
    purityPercent: 96,
    contaminationPercent: 4,
    weightKg: 500,
    grade: 'A',
    confidence: 94,
    verified: true,
    imageUrl: '/images/grade-scan-001.jpg',
    createdAt: new Date('2025-12-01T09:30:00Z')
  },
  {
    id: 'grade-002',
    userId: 'user-001',
    materialType: 'HDPE',
    purityPercent: 92,
    contaminationPercent: 8,
    weightKg: 300,
    grade: 'A',
    confidence: 91,
    verified: true,
    imageUrl: '/images/grade-scan-002.jpg',
    createdAt: new Date('2025-12-05T14:00:00Z')
  },
  {
    id: 'grade-003',
    userId: 'user-003',
    materialType: 'PET',
    purityPercent: 88,
    contaminationPercent: 12,
    weightKg: 250,
    grade: 'B',
    confidence: 87,
    verified: true,
    imageUrl: '/images/grade-scan-003.jpg',
    createdAt: new Date('2025-12-10T09:00:00Z')
  }
]);

console.log('✓ Created ai_grading_results collection with 3 sample records');

// Summary
console.log('\n========================================');
console.log('MongoDB Setup Complete!');
console.log('========================================');
console.log('Database: plastic_connect');
console.log('Collections created: 5');
console.log('Total sample records inserted: 23');
console.log('');
console.log('Collections:');
console.log('  - users (4 records)');
console.log('  - listings (4 records)');
console.log('  - bids (3 records)');
console.log('  - transactions (3 records)');
console.log('  - ai_grading_results (3 records)');
console.log('========================================\n');

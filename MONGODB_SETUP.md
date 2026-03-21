# MongoDB Setup Guide for PlasticConnect

This guide will help you set up a separate MongoDB database for the PlasticConnect application.

## Files Included

1. **mongodb-schema.json** - Complete database schema with sample data in JSON format
2. **mongodb-import.js** - Script to import all collections and data into MongoDB
3. **MONGODB_SETUP.md** - This setup guide

## Prerequisites

- MongoDB installed locally or access to MongoDB Atlas
- MongoDB Compass (for visual management)
- Node.js and npm (for running scripts)

## Option 1: Using MongoDB Compass (Recommended for Beginners)

### Step 1: Start MongoDB
If running locally:
```bash
# macOS (with Homebrew)
brew services start mongodb-community

# Windows
# Start MongoDB from Services or run: mongod

# Linux
sudo systemctl start mongod
```

### Step 2: Connect to MongoDB Compass
1. Open MongoDB Compass
2. Click "New Connection"
3. Enter connection string: `mongodb://localhost:27017`
4. Click "Connect"

### Step 3: Create Database
1. In the left sidebar, right-click and select "Create Database"
2. Database Name: `plastic_connect`
3. Collection Name: `users`
4. Click "Create Database"

### Step 4: Create Collections
Create the following collections in MongoDB Compass by clicking the + button next to the database:
- `users`
- `listings`
- `bids`
- `transactions`
- `ai_grading_results`

### Step 5: Import Sample Data
1. For each collection, click the collection name
2. Click "ADD DATA" → "Import JSON"
3. Copy the relevant documents from `mongodb-schema.json` for that collection
4. Paste and confirm

## Option 2: Using MongoDB Shell (mongosh)

### Step 1: Start MongoDB
```bash
# Make sure MongoDB service is running
mongod
```

### Step 2: Run Import Script
```bash
# Navigate to project directory
cd path/to/plastic-connect-project

# Connect to MongoDB and run import script
mongosh mongodb://localhost:27017/plastic_connect < mongodb-import.js
```

The script will:
- Create the database `plastic_connect`
- Create all 5 collections
- Set up all indexes
- Insert sample data
- Provide a summary of created collections

## Option 3: Using MongoDB Atlas (Cloud)

### Step 1: Create MongoDB Atlas Account
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for free account
3. Create a new project

### Step 2: Create a Cluster
1. Click "Create" to build a new cluster
2. Choose Free tier (M0)
3. Select your region
4. Create cluster (takes ~3 minutes)

### Step 3: Get Connection String
1. Click "Connect" on your cluster
2. Choose "Drivers" → "Node.js"
3. Copy the connection string
4. Example: `mongodb+srv://username:password@cluster.mongodb.net/plastic_connect?retryWrites=true`

### Step 4: Import Data
Option A - Using MongoDB Compass:
1. In Compass, click "New Connection"
2. Paste the Atlas connection string
3. Follow steps from Option 1, starting from Step 3

Option B - Using Node.js script:
```bash
npm install mongodb

# Create import script with connection string
node import-mongodb.js
```

## Database Schema Overview

### Users Collection
Stores collector and brand user information.

**Fields:**
- `id` (string, unique) - UUID
- `name` (string) - User's name
- `email` (string, unique) - Email address
- `password` (string) - Bcrypt hashed password
- `role` (string) - "COLLECTOR" or "BRAND"
- `company` (string) - Company name
- `phone` (string) - Phone number
- `createdAt` (date) - Account creation timestamp

**Indexes:**
- `id` (unique)
- `email` (unique)

### Listings Collection
Material listings created by collectors.

**Fields:**
- `id` (string, unique) - UUID
- `collectorId` (string) - Reference to user
- `collectorName` (string) - Collector's name
- `materialType` (string) - PET, HDPE, LDPE, Mixed, PP, PS
- `weightKg` (number) - Weight of material
- `purityPercent` (number) - Purity percentage (0-100)
- `contaminationPercent` (number) - Contamination percentage
- `grade` (string) - A, B, or C
- `pricePerKg` (number) - Price per kilogram
- `location` (string) - Location of material
- `description` (string) - Material description
- `imageUrl` (string) - Image URL
- `status` (string) - ACTIVE, SOLD, CANCELLED
- `highestBidAmount` (number) - Highest bid received
- `createdAt` (date) - Creation timestamp

**Indexes:**
- `id` (unique)
- `collectorId`
- `status`
- `materialType`
- `grade`

### Bids Collection
Bids placed by brands on listings.

**Fields:**
- `id` (string, unique) - UUID
- `listingId` (string) - Reference to listing
- `brandId` (string) - Reference to brand user
- `brandName` (string) - Brand name
- `pricePerKg` (number) - Bid price per kg
- `totalCost` (number) - Total bid cost
- `status` (string) - PENDING, ACCEPTED, REJECTED
- `createdAt` (date) - Bid timestamp

**Indexes:**
- `id` (unique)
- `listingId`
- `brandId`

### Transactions Collection
Completed transactions between collectors and brands.

**Fields:**
- `id` (string, unique) - UUID
- `listingId` (string) - Reference to listing
- `collectorId` (string) - Collector user ID
- `brandId` (string) - Brand user ID
- `materialType` (string) - Type of material
- `weightKg` (number) - Weight transacted
- `pricePerKg` (number) - Price per kg
- `totalAmount` (number) - Total transaction amount
- `status` (string) - PENDING, PAYMENT_PENDING, IN_PROGRESS, COMPLETED
- `buyerName` (string) - Buyer (brand) name
- `sellerName` (string) - Seller (collector) name
- `createdAt` (date) - Transaction timestamp

**Indexes:**
- `id` (unique)
- `collectorId`
- `brandId`
- `status`

### AI Grading Results Collection
Results from AI-based material grading.

**Fields:**
- `id` (string, unique) - UUID
- `userId` (string) - User who submitted material
- `materialType` (string) - Type of plastic
- `purityPercent` (number) - Detected purity
- `contaminationPercent` (number) - Detected contamination
- `weightKg` (number) - Weight of material
- `grade` (string) - Assigned grade (A, B, C)
- `confidence` (number) - AI confidence score (50-100)
- `verified` (boolean) - Whether manually verified
- `imageUrl` (string) - Image analyzed
- `createdAt` (date) - Analysis timestamp

**Indexes:**
- `id` (unique)
- `userId`

## Sample Test Data

### Login Credentials
```
Collector:
Email: collector@example.com
Password: demo123456 (plain text, stored as bcrypt hash)
Role: COLLECTOR

Brand:
Email: brand@example.com
Password: demo123456
Role: BRAND
```

### Sample Listings
- 500kg PET plastic, Grade A, ₹42/kg (Active)
- 300kg HDPE containers, Grade A, ₹55/kg (Active)
- 250kg Mixed PET, Grade B, ₹38/kg (Active)
- 1000kg Mixed plastic, Grade C, ₹25/kg (Sold)

### Sample Transactions
- 1000kg Mixed → Completed for ₹25,000
- 500kg PET → In Progress for ₹21,000
- 250kg PET → Pending for ₹10,000

## Troubleshooting

### Connection Issues
- Verify MongoDB is running: `mongosh` from terminal
- Check connection string syntax
- Ensure port 27017 is not blocked by firewall

### Import Failed
- Run script with verbose output: `mongosh --verbose < mongodb-import.js`
- Check that database doesn't already exist
- Verify JSON formatting in mongodb-schema.json

### Slow Performance
- Ensure all indexes are created
- Check disk space availability
- Monitor with MongoDB Compass performance tools

## Next Steps

1. Connect your application to MongoDB using a MongoDB driver
2. Update environment variables with MongoDB connection string
3. Replace Supabase queries with MongoDB queries using appropriate driver

## Useful MongoDB Commands

```javascript
// View all databases
show databases

// Use specific database
use plastic_connect

// View all collections
show collections

// Count documents in collection
db.users.countDocuments()

// Find all users
db.users.find().pretty()

// Find specific user
db.users.findOne({ email: 'collector@example.com' })

// Update a document
db.listings.updateOne(
  { id: 'lst-001' },
  { $set: { status: 'SOLD' } }
)

// Delete a document
db.bids.deleteOne({ id: 'bid-001' })

// Create index
db.listings.createIndex({ status: 1 })

// View indexes
db.listings.getIndexes()

// Drop collection
db.listings.drop()

// Drop database
db.dropDatabase()
```

## Support

For more information:
- MongoDB Documentation: https://docs.mongodb.com/
- MongoDB Compass Guide: https://www.mongodb.com/products/compass
- MongoDB Atlas: https://www.mongodb.com/cloud/atlas

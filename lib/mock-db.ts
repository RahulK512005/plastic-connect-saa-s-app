// Mock Database - Simulates backend storage with localStorage persistence

export interface User {
  id: string
  name: string
  email: string
  password: string
  role: 'COLLECTOR' | 'BRAND'
  company?: string
  phone?: string
  createdAt: string
}

export interface Listing {
  id: string
  collectorId: string
  collectorName: string
  materialType: 'PET' | 'HDPE' | 'LDPE' | 'Mixed' | 'PP' | 'PS'
  weightKg: number
  purityPercent: number
  contaminationPercent: number
  grade: 'A' | 'B' | 'C'
  pricePerKg: number
  location: string
  description: string
  imageUrl: string
  status: 'ACTIVE' | 'SOLD' | 'CANCELLED'
  highestBidAmount?: number
  createdAt: string
}

export interface Transaction {
  id: string
  listingId: string
  collectorId: string
  brandId: string
  materialType: string
  weightKg: number
  pricePerKg: number
  totalAmount: number
  status: 'PENDING' | 'PAYMENT_PENDING' | 'IN_PROGRESS' | 'COMPLETED'
  buyerName: string
  sellerName: string
  createdAt: string
}

export interface AIGradingResult {
  id: string
  userId: string
  materialType: string
  purityPercent: number
  contaminationPercent: number
  weightKg: number
  grade: 'A' | 'B' | 'C'
  confidence: number
  verified: boolean
  imageUrl?: string
  createdAt: string
}

export interface Bid {
  id: string
  listingId: string
  brandId: string
  brandName: string
  pricePerKg: number
  totalCost: number
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED'
  createdAt: string
}

// Indian Rupee formatter
export function formatINR(amount: number): string {
  const formatted = amount.toLocaleString('en-IN', {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  })
  return `\u20B9${formatted}`
}

// Format per kg price
export function formatPricePerKg(amount: number): string {
  return `\u20B9${amount.toLocaleString('en-IN', { maximumFractionDigits: 2, minimumFractionDigits: 0 })}`
}

// Generate unique IDs
function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

// Seed marketplace data
const SEED_LISTINGS: Listing[] = [
  {
    id: 'lst-001',
    collectorId: 'seed-collector-1',
    collectorName: 'Rajesh Kumar',
    materialType: 'PET',
    weightKg: 500,
    purityPercent: 96,
    contaminationPercent: 4,
    grade: 'A',
    pricePerKg: 42,
    location: 'Mumbai, Maharashtra',
    description: 'Clean PET bottles, sorted and baled. Sourced from residential collection.',
    imageUrl: '/placeholder.svg',
    status: 'ACTIVE',
    highestBidAmount: 44,
    createdAt: '2025-12-01T10:00:00Z',
  },
  {
    id: 'lst-002',
    collectorId: 'seed-collector-2',
    collectorName: 'Priya Sharma',
    materialType: 'HDPE',
    weightKg: 300,
    purityPercent: 92,
    contaminationPercent: 8,
    grade: 'A',
    pricePerKg: 55,
    location: 'Delhi, NCR',
    description: 'HDPE containers and drums, industrial grade, cleaned and crushed.',
    imageUrl: '/placeholder.svg',
    status: 'ACTIVE',
    createdAt: '2025-12-05T14:30:00Z',
  },
  {
    id: 'lst-003',
    collectorId: 'seed-collector-1',
    collectorName: 'Rajesh Kumar',
    materialType: 'LDPE',
    weightKg: 200,
    purityPercent: 88,
    contaminationPercent: 12,
    grade: 'B',
    pricePerKg: 30,
    location: 'Pune, Maharashtra',
    description: 'LDPE film and bags, post-consumer collection, lightly contaminated.',
    imageUrl: '/placeholder.svg',
    status: 'ACTIVE',
    highestBidAmount: 32,
    createdAt: '2025-12-08T09:15:00Z',
  },
  {
    id: 'lst-004',
    collectorId: 'seed-collector-3',
    collectorName: 'Amit Patel',
    materialType: 'PET',
    weightKg: 1000,
    purityPercent: 98,
    contaminationPercent: 2,
    grade: 'A',
    pricePerKg: 48,
    location: 'Ahmedabad, Gujarat',
    description: 'Premium PET flakes, washed and dried. Ready for recycling.',
    imageUrl: '/placeholder.svg',
    status: 'ACTIVE',
    highestBidAmount: 50,
    createdAt: '2025-12-10T11:00:00Z',
  },
  {
    id: 'lst-005',
    collectorId: 'seed-collector-4',
    collectorName: 'Sunita Devi',
    materialType: 'Mixed',
    weightKg: 750,
    purityPercent: 72,
    contaminationPercent: 28,
    grade: 'C',
    pricePerKg: 18,
    location: 'Chennai, Tamil Nadu',
    description: 'Mixed plastic waste from municipal collection. Unsorted.',
    imageUrl: '/placeholder.svg',
    status: 'ACTIVE',
    createdAt: '2025-12-12T16:45:00Z',
  },
  {
    id: 'lst-006',
    collectorId: 'seed-collector-5',
    collectorName: 'Vikram Singh',
    materialType: 'HDPE',
    weightKg: 450,
    purityPercent: 94,
    contaminationPercent: 6,
    grade: 'A',
    pricePerKg: 52,
    location: 'Bangalore, Karnataka',
    description: 'HDPE pipes and fittings, industrial scrap, high purity.',
    imageUrl: '/placeholder.svg',
    status: 'ACTIVE',
    highestBidAmount: 54,
    createdAt: '2025-12-14T08:30:00Z',
  },
  {
    id: 'lst-007',
    collectorId: 'seed-collector-2',
    collectorName: 'Priya Sharma',
    materialType: 'PP',
    weightKg: 600,
    purityPercent: 90,
    contaminationPercent: 10,
    grade: 'B',
    pricePerKg: 38,
    location: 'Hyderabad, Telangana',
    description: 'Polypropylene packaging materials, sorted and compressed.',
    imageUrl: '/placeholder.svg',
    status: 'ACTIVE',
    createdAt: '2025-12-15T13:00:00Z',
  },
  {
    id: 'lst-008',
    collectorId: 'seed-collector-6',
    collectorName: 'Meena Kumari',
    materialType: 'LDPE',
    weightKg: 350,
    purityPercent: 85,
    contaminationPercent: 15,
    grade: 'B',
    pricePerKg: 28,
    location: 'Kolkata, West Bengal',
    description: 'LDPE stretch film from warehouses, baled and clean.',
    imageUrl: '/placeholder.svg',
    status: 'ACTIVE',
    highestBidAmount: 30,
    createdAt: '2025-12-16T10:20:00Z',
  },
  {
    id: 'lst-009',
    collectorId: 'seed-collector-3',
    collectorName: 'Amit Patel',
    materialType: 'PET',
    weightKg: 800,
    purityPercent: 93,
    contaminationPercent: 7,
    grade: 'A',
    pricePerKg: 45,
    location: 'Surat, Gujarat',
    description: 'PET bottles and preforms, collected from beverage units.',
    imageUrl: '/placeholder.svg',
    status: 'ACTIVE',
    createdAt: '2025-12-18T15:30:00Z',
  },
  {
    id: 'lst-010',
    collectorId: 'seed-collector-7',
    collectorName: 'Ravi Verma',
    materialType: 'Mixed',
    weightKg: 1200,
    purityPercent: 68,
    contaminationPercent: 32,
    grade: 'C',
    pricePerKg: 15,
    location: 'Jaipur, Rajasthan',
    description: 'Mixed household plastics, loose and unsorted bulk lot.',
    imageUrl: '/placeholder.svg',
    status: 'ACTIVE',
    createdAt: '2025-12-20T09:00:00Z',
  },
  {
    id: 'lst-011',
    collectorId: 'seed-collector-5',
    collectorName: 'Vikram Singh',
    materialType: 'HDPE',
    weightKg: 250,
    purityPercent: 89,
    contaminationPercent: 11,
    grade: 'B',
    pricePerKg: 46,
    location: 'Lucknow, Uttar Pradesh',
    description: 'HDPE jerry cans and containers from chemical industry.',
    imageUrl: '/placeholder.svg',
    status: 'ACTIVE',
    createdAt: '2025-12-22T12:00:00Z',
  },
  {
    id: 'lst-012',
    collectorId: 'seed-collector-8',
    collectorName: 'Anita Joshi',
    materialType: 'PP',
    weightKg: 400,
    purityPercent: 95,
    contaminationPercent: 5,
    grade: 'A',
    pricePerKg: 40,
    location: 'Nagpur, Maharashtra',
    description: 'High-quality PP granules, reprocessed and ready for use.',
    imageUrl: '/placeholder.svg',
    status: 'ACTIVE',
    highestBidAmount: 43,
    createdAt: '2025-12-24T14:00:00Z',
  },
]

const SEED_TRANSACTIONS: Transaction[] = [
  {
    id: 'txn-001',
    listingId: 'lst-old-001',
    collectorId: 'seed-collector-1',
    brandId: 'seed-brand-1',
    materialType: 'PET',
    weightKg: 500,
    pricePerKg: 40,
    totalAmount: 20000,
    status: 'COMPLETED',
    buyerName: 'GreenCycle Industries',
    sellerName: 'Rajesh Kumar',
    createdAt: '2025-11-15T10:00:00Z',
  },
  {
    id: 'txn-002',
    listingId: 'lst-old-002',
    collectorId: 'seed-collector-2',
    brandId: 'seed-brand-2',
    materialType: 'HDPE',
    weightKg: 300,
    pricePerKg: 50,
    totalAmount: 15000,
    status: 'COMPLETED',
    buyerName: 'RePlast Corp',
    sellerName: 'Priya Sharma',
    createdAt: '2025-11-20T14:00:00Z',
  },
  {
    id: 'txn-003',
    listingId: 'lst-old-003',
    collectorId: 'seed-collector-1',
    brandId: 'seed-brand-1',
    materialType: 'LDPE',
    weightKg: 200,
    pricePerKg: 28,
    totalAmount: 5600,
    status: 'IN_PROGRESS',
    buyerName: 'GreenCycle Industries',
    sellerName: 'Rajesh Kumar',
    createdAt: '2025-12-01T09:00:00Z',
  },
  {
    id: 'txn-004',
    listingId: 'lst-old-004',
    collectorId: 'seed-collector-3',
    brandId: 'seed-brand-2',
    materialType: 'PET',
    weightKg: 1000,
    pricePerKg: 45,
    totalAmount: 45000,
    status: 'PAYMENT_PENDING',
    buyerName: 'RePlast Corp',
    sellerName: 'Amit Patel',
    createdAt: '2025-12-10T11:30:00Z',
  },
  {
    id: 'txn-005',
    listingId: 'lst-old-005',
    collectorId: 'seed-collector-4',
    brandId: 'seed-brand-3',
    materialType: 'Mixed',
    weightKg: 750,
    pricePerKg: 16,
    totalAmount: 12000,
    status: 'PENDING',
    buyerName: 'EcoReclaim Pvt Ltd',
    sellerName: 'Sunita Devi',
    createdAt: '2025-12-15T16:00:00Z',
  },
]

const SEED_BIDS: Bid[] = [
  {
    id: 'bid-001',
    listingId: 'lst-001',
    brandId: 'seed-brand-1',
    brandName: 'GreenCycle Industries',
    pricePerKg: 44,
    totalCost: 22000,
    status: 'PENDING',
    createdAt: '2025-12-02T11:00:00Z',
  },
  {
    id: 'bid-002',
    listingId: 'lst-003',
    brandId: 'seed-brand-2',
    brandName: 'RePlast Corp',
    pricePerKg: 32,
    totalCost: 6400,
    status: 'PENDING',
    createdAt: '2025-12-09T10:00:00Z',
  },
  {
    id: 'bid-003',
    listingId: 'lst-004',
    brandId: 'seed-brand-1',
    brandName: 'GreenCycle Industries',
    pricePerKg: 50,
    totalCost: 50000,
    status: 'ACCEPTED',
    createdAt: '2025-12-11T14:00:00Z',
  },
  {
    id: 'bid-004',
    listingId: 'lst-006',
    brandId: 'seed-brand-3',
    brandName: 'EcoReclaim Pvt Ltd',
    pricePerKg: 54,
    totalCost: 24300,
    status: 'PENDING',
    createdAt: '2025-12-15T09:00:00Z',
  },
  {
    id: 'bid-005',
    listingId: 'lst-008',
    brandId: 'seed-brand-2',
    brandName: 'RePlast Corp',
    pricePerKg: 30,
    totalCost: 10500,
    status: 'PENDING',
    createdAt: '2025-12-17T11:30:00Z',
  },
  {
    id: 'bid-006',
    listingId: 'lst-012',
    brandId: 'seed-brand-1',
    brandName: 'GreenCycle Industries',
    pricePerKg: 43,
    totalCost: 17200,
    status: 'PENDING',
    createdAt: '2025-12-25T10:00:00Z',
  },
]

// Demo users
const DEMO_USERS: User[] = [
  {
    id: 'demo-collector',
    name: 'Rajesh Kumar',
    email: 'collector@demo.com',
    password: 'demo123456',
    role: 'COLLECTOR',
    company: 'Kumar Waste Solutions',
    phone: '+91 98765 43210',
    createdAt: '2025-01-15T10:00:00Z',
  },
  {
    id: 'demo-brand',
    name: 'GreenCycle Industries',
    email: 'brand@demo.com',
    password: 'demo123456',
    role: 'BRAND',
    company: 'GreenCycle Industries',
    phone: '+91 98765 43211',
    createdAt: '2025-01-15T10:00:00Z',
  },
]

// =================== DATABASE OPERATIONS ===================

function getDB(key: string): any[] {
  if (typeof window === 'undefined') return []
  try {
    const data = localStorage.getItem(`pc_${key}`)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

function setDB(key: string, data: any[]): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(`pc_${key}`, JSON.stringify(data))
}

function initializeDB(): void {
  if (typeof window === 'undefined') return
  // Initialize seed data only if not already present
  if (!localStorage.getItem('pc_initialized')) {
    setDB('users', DEMO_USERS)
    setDB('listings', SEED_LISTINGS)
    setDB('transactions', SEED_TRANSACTIONS)
    setDB('bids', SEED_BIDS)
    setDB('grading_results', [])
    localStorage.setItem('pc_initialized', 'true')
  }
}

// =================== USER OPERATIONS ===================

export function dbInit(): void {
  initializeDB()
}

export function dbGetUsers(): User[] {
  initializeDB()
  return getDB('users')
}

export function dbGetUserByEmail(email: string): User | undefined {
  initializeDB()
  return getDB('users').find((u: User) => u.email === email)
}

export function dbGetUserById(id: string): User | undefined {
  initializeDB()
  return getDB('users').find((u: User) => u.id === id)
}

export function dbCreateUser(data: { name: string; email: string; password: string; role: 'COLLECTOR' | 'BRAND' }): User {
  initializeDB()
  const users = getDB('users')
  const existing = users.find((u: User) => u.email === data.email)
  if (existing) throw new Error('Email already registered')

  const newUser: User = {
    id: generateId(),
    name: data.name,
    email: data.email,
    password: data.password,
    role: data.role,
    createdAt: new Date().toISOString(),
  }
  users.push(newUser)
  setDB('users', users)
  return newUser
}

export function dbUpdateUser(id: string, updates: Partial<User>): User | undefined {
  initializeDB()
  const users = getDB('users')
  const index = users.findIndex((u: User) => u.id === id)
  if (index === -1) return undefined
  users[index] = { ...users[index], ...updates }
  setDB('users', users)
  return users[index]
}

// =================== LISTING OPERATIONS ===================

export function dbGetListings(): Listing[] {
  initializeDB()
  return getDB('listings')
}

export function dbGetActiveListings(): Listing[] {
  return dbGetListings().filter((l) => l.status === 'ACTIVE')
}

export function dbGetListingById(id: string): Listing | undefined {
  return dbGetListings().find((l) => l.id === id)
}

export function dbGetListingsByCollector(collectorId: string): Listing[] {
  return dbGetListings().filter((l) => l.collectorId === collectorId)
}

export function dbCreateListing(data: Omit<Listing, 'id' | 'createdAt' | 'status'>): Listing {
  initializeDB()
  const listings = getDB('listings')
  const newListing: Listing = {
    ...data,
    id: generateId(),
    status: 'ACTIVE',
    createdAt: new Date().toISOString(),
  }
  listings.push(newListing)
  setDB('listings', listings)
  return newListing
}

// =================== TRANSACTION OPERATIONS ===================

export function dbGetTransactions(): Transaction[] {
  initializeDB()
  return getDB('transactions')
}

export function dbGetTransactionsByUser(userId: string): Transaction[] {
  return dbGetTransactions().filter(
    (t) => t.collectorId === userId || t.brandId === userId
  )
}

// =================== BID OPERATIONS ===================

export function dbGetBids(): Bid[] {
  initializeDB()
  return getDB('bids')
}

export function dbGetBidsByBrand(brandId: string): Bid[] {
  return dbGetBids().filter((b) => b.brandId === brandId)
}

export function dbGetBidsByListing(listingId: string): Bid[] {
  return dbGetBids().filter((b) => b.listingId === listingId)
}

export function dbGetBidsForCollectorListings(collectorId: string): Bid[] {
  const listings = dbGetListingsByCollector(collectorId)
  const listingIds = listings.map((l) => l.id)
  return dbGetBids().filter((b) => listingIds.includes(b.listingId))
}

// =================== AI GRADING OPERATIONS ===================

export function dbGetGradingResults(): AIGradingResult[] {
  initializeDB()
  return getDB('grading_results')
}

export function dbGetGradingResultsByUser(userId: string): AIGradingResult[] {
  return dbGetGradingResults().filter((r) => r.userId === userId)
}

export function dbSaveGradingResult(data: Omit<AIGradingResult, 'id' | 'createdAt'>): AIGradingResult {
  initializeDB()
  const results = getDB('grading_results')
  const newResult: AIGradingResult = {
    ...data,
    id: generateId(),
    createdAt: new Date().toISOString(),
  }
  results.push(newResult)
  setDB('grading_results', results)
  return newResult
}

// =================== SESSION OPERATIONS ===================

export function dbGetCurrentSession(): User | null {
  if (typeof window === 'undefined') return null
  try {
    const session = localStorage.getItem('pc_session')
    return session ? JSON.parse(session) : null
  } catch {
    return null
  }
}

export function dbSetSession(user: User): void {
  if (typeof window === 'undefined') return
  localStorage.setItem('pc_session', JSON.stringify(user))
}

export function dbClearSession(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem('pc_session')
}

# ♻️ PlasticConnect — AI-Powered Plastic Recycling Marketplace

PlasticConnect is a modern SaaS platform that connects **plastic waste collectors, recyclers, and brands** to enable transparent, efficient, and sustainable plastic trading.

The platform helps users upload materials, grade plastic purity, and manage transactions in a digital recycling marketplace.

This project is built as an **MVP (Minimum Viable Product)** with premium UI/UX and simulated backend logic.

---

## 🚀 Features

### 👤 User System

* Instant account creation
* No email verification required
* Automatic login after signup
* Role-based dashboards (Collector / Brand)
* Local session management

---

### 🛒 Marketplace

* View plastic material listings
* Realistic mock marketplace data
* Filters:

  * Material type
  * Grade (A / B / C)
  * Location
  * Price range
* Prices displayed in Indian Rupees (₹)

---

### 📷 Material Upload + Camera Capture

Collectors can:

* Enter material details manually
* Capture image using device camera
* Upload image from device
* Preview image before analysis
* Submit material for grading

Works on:

* Mobile devices
* Desktop laptops

---

### 🤖 AI Grading System

After manual grading input, AI verifies material quality.

AI returns:

* Grade A — High purity
* Grade B — Medium purity
* Grade C — Low purity
* Confidence score

Grading results are saved per user.

---

### 📊 Dashboard

* Marketplace activity overview
* Transaction summaries
* Uploaded materials
* User-specific data only

---

### 💰 Transactions

* Track completed trades
* View material history
* Currency formatted in ₹

---

### 🎨 Premium UI / UX

* Clean SaaS dashboard design
* Mobile-first responsive layout
* Glassmorphism cards
* Smooth animations
* Role-based sidebar
* Loading skeletons
* Empty states

---

## 🧑‍💼 User Roles

### Collector

* Upload materials
* Capture images
* AI grading
* Manage listings
* View transactions

### Brand / Recycler

* Browse marketplace
* Purchase materials
* View transactions

---

## 🧱 Tech Stack

Frontend:

* React
* TypeScript
* Tailwind CSS
* shadcn/ui

Browser APIs:

* Camera access (getUserMedia)

State Management:

* Local mock database simulation

Deployment:

* Vercel

---

## 🗂 Project Structure

```
src/
 ├─ app/
 ├─ components/
 ├─ pages/
 ├─ marketplace/
 ├─ auth/
 ├─ grading/
 ├─ dashboard/
 └─ mock-db/
```

---

## ⚙️ Installation

Clone repository:

```
git clone https://github.com/yourusername/plasticconnect.git
cd plasticconnect
```

Install dependencies:

```
npm install
```

Run development server:

```
npm run dev
```

Open browser:

```
http://localhost:3000
```

---

## 🔐 Authentication Behavior

* Signup instantly creates active account
* No email confirmation required
* No OTP verification
* Auto login after registration
* User data stored in simulated database

---

## 📦 Mock Database

The app uses a local mock data layer that simulates:

* Users
* Marketplace listings
* Transactions
* Uploaded materials
* AI grading results

All data is connected logically to UI pages.

---

## 🌍 Currency Format

All monetary values displayed in:

```
Indian Rupees (₹)
```

Example:

```
₹2,10,000
```

---

## 📱 Device Support

* Mobile browsers
* Desktop browsers
* Camera-enabled devices

---

## 🧪 MVP Scope

This project is a functional frontend simulation.

Not included:

* Real backend server
* Payment gateway
* Production AI model
* Real authentication provider

---

## 🔮 Future Roadmap

* Real AI material detection
* Payment integration
* Logistics tracking
* Smart pricing analytics
* Blockchain recycling certificates
* Real database (Supabase / MongoDB)
* Admin dashboard
* Notifications system

---

## 🤝 Contributing

Pull requests are welcome.

For major changes, please open an issue first to discuss what you would like to change.

---

## 📄 License

MIT License

---

## 💚 Mission

Build a transparent digital ecosystem that makes plastic recycling profitable, traceable, and scalable.

---

## 👨‍💻 Author

Built as an MVP for sustainable recycling innovation.

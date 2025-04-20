# I am Available App

This project is developed as part of the **Multiplatform Development** course (Computer Engineering Degree) at IPB - 2024/2025.  
It consists of a mobile application that allows users to signal their availability for specific roles, times, locations, and user groups.

## 📱 About the App

**I am Available** is an availability management tool. A user can declare availability (physical or virtual) and associate it with a role (e.g., teacher, tutor) and a group (e.g., students, mentees).  
Secondary users can check these availabilities, request to join groups, and get notifications.

---

## 👥 User Roles

- **Main Actor**: The user who declares availability.
- **Secondary Actor**: The user who receives availability info or interacts with the main actor.
- A single user can play both roles.

---

## ✅ Functional Requirements (RF)

### 🔐 Authentication
- RF01: Registration with name, photo, password, and unique hashtag.
- RF02: Login required for all features.

### 👤 User Profile & Groups
- RF03: Main actors define roles and hashtags.
- RF04: Main actors manage groups.
    - RF04.1–RF04.6: Group settings (hashtag, description, public/private, auto-admission, etc.)

### 📅 Availability System
- RF06: Declare availability with:
    - Day, time, location (link or map), role, group.
    - Optional recurrence (daily/weekly).
    - Optional geolocation with map and radius.

### 🔍 Search & Notifications
- RF07–RF08: Search by hashtags (user/group).
- RF09–RF10: Group admission requests and management.
- RF11–RF14: View availability, enable notifications, send messages.

### 💬 Messaging
- RF15–RF17: Bi-directional messaging between actors.

---

## 🌍 Bonus Features (Extra 5% Score)
- RF06.3.1: Geolocation (map-based radius).
- RF12.1: Push notifications when availability is detected.

---

## 🧪 Evaluation Criteria

- UI/UX design and feature completeness
- Multiple navigation strategies
- Real-time data sync between views/users
- Clean code structure and good practices
- Bonus: Geolocation and push notifications

---

## 🚀 How to Run

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the app with Expo or your preferred emulator:
   ```bash
   npm start
   ```

---

## 👨‍💻 Contributors

- **Alberto**: Group Management, Register, Login
- **Giulia**: Settings, Main, Messages
- **Juan Fran**: Profile, Search, Availabilities
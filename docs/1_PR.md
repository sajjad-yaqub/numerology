# Product Requirements (`1_PR.md`)

## 1. Overview
**AstraNumerics** is a progressive, high-precision, offline-first Numerology PWA designed for numerology enthusiasts, spiritual practitioners, and everyday users seeking cosmic self-knowledge.

## 2. Core Workflows & Micro-Modules

### Module 1: Core Reading Engine & Calculator
- **Inputs**: Full Birth Name, Current Name/Alias, Date of Birth.
- **Systems**: 
  - **Pythagorean System** (A=1...I=9)
  - **Chaldean System** (Ancient Babylonian 1-8 system)
- **Calculated Attributes**:
  - **Life Path Number** (DOB reduction with Master Number preservation: 11, 22, 33).
  - **Expression / Destiny Number** (Full birth name letter sum).
  - **Soul Urge / Heart's Desire Number** (Vowels sum: A, E, I, O, U, Y).
  - **Personality Number** (Consonants sum).
  - **Attitude / Sun Number** (Day + Month sum).
  - **Maturity / Power Number** (Life Path + Expression sum).
  - **Karmic Lessons**: Missing single-digit numbers in the birth name.
  - **Karmic Debts**: Highlight numbers derived from 13/4, 14/5, 16/7, 19/1.

### Module 2: Lo Shu Sacred Grid
- 3x3 Magic Square mapping DOB digits:
  ```
  [4] [9] [2]  (Mental Plane)
  [3] [5] [7]  (Emotional Plane)
  [8] [1] [6]  (Physical Plane)
  ```
- Dynamic calculation of **Arrows of Strength** (e.g., 1-2-3, 3-5-7, 3-6-9) and **Arrows of Weakness**.

### Module 3: Synastry & Compatibility Matcher
- Dual input interface (User Profile vs. Partner/Friend/Colleague Profile).
- Overall Compatibility Index (0 - 100%), Life Path Synergy, Expression Synergy, and Relationship Guidance.

### Module 4: Name Optimization Lab
- Real-time interactive playground allowing users to modify spellings, business titles, or pen names and watch Expression and Soul Urge numbers update in real time.

### Module 5: Daily Personal Forecast
- Calculates **Personal Year**, **Personal Month**, and **Personal Day** synced to system date.
- Delivers daily focus theme, affirmation, gemstones, and peak hours.

### Module 6: Address, Phone & Vehicle Numerology
- Calculates energetic reduction for street addresses, phone numbers, and license plates.

### Module 7: PWA Offline & Storage Infrastructure
- Web App Manifest for native home-screen installation.
- Service Worker caching for 100% offline functionality.
- Profile Vault allowing users to save, load, and manage unlimited profiles in LocalStorage.

---
*Assigned Lead Persona: 📋 Product Manager (PM)*

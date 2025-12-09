# Cardroots MVP Specification Document

## 1. Overview

Cardroots is a digital group-card platform where teams, families, classrooms, and organisations can create a shared greeting card that plants real trees. Each signer adds a message, and optionally each signature plants a tree.

The MVP focuses on delivering a simple, elegant, eco-friendly group card experience with minimal backend complexity.

## 2. Core Value Proposition

Cardroots provides:

- A single shareable group card for birthdays, farewells, congratulations, and milestones.
- A message board where multiple people can sign.
- An option where each signature plants a tree, tying the product into environmental impact.
- A final polished card page that can be viewed, shared, or downloaded.

## 3. MVP Features

### 3.1 Create Group Card (Owner Flow)

Owner chooses:

- Card title (e.g., "Happy Birthday Sarah")
- Occasion type (optional)
- Optional AI-generated card cover (later phase)

System generates a unique card ID + share URL.

Owner gets two links:

- Invite Link → share with signers
- Admin Link → manage signatures + pay + send

### 3.2 Add Signatures (Signer Flow)

Signers should be able to:

- View the card cover/title
- Add:
  - Their name
  - A written message
  - Optional emoji
- Submit without needing an account

Signatures are saved instantly to the database.

### 3.3 Review & Pay (Owner Flow)

Once signatures are collected:

- Owner previews final card layout
- Owner proceeds to payment:
  - Fixed card fee (£10–£20)
  - Optional per-signature tree planting (£0.50–£1 each)
- Stripe Checkout handles payment
- On success → card becomes unlocked

### 3.4 Final Card View (Recipients)

Public, read-only view

Displays:

- Card cover
- Occasion title
- List/grid of signatures/messages
- Total trees planted

Option to:

- Share link
- Download PDF/PNG (later phase)
- View Tree Certificate (if integrated)

## 4. User Roles

### Owner

- Creates the card
- Manages signatures
- Pays for the final card
- Sends the final link to the recipient

### Signers

- Access via invite link
- Submit messages
- No account required

### Recipient

- Reads the completed card
- Does not edit or sign

## 5. Database Schema (MVP)

### cards
- id (uuid)
- title (string)
- cover_image_url (string|null)
- admin_token (string) // private link secret
- created_at (timestamp)
- paid (boolean)
- total_signatures (int)
- trees_planted (int)

### signatures
- id (uuid)
- card_id (uuid)
- name (string)
- message (text)
- created_at (timestamp)

### payments
- id (uuid)
- card_id (uuid)
- stripe_session_id (string)
- amount (int)
- signatures_count (int)
- trees (int)
- created_at (timestamp)

## 6. Stripe Configuration

### Products Needed

- Group Card Base Fee (£10–£20)
- Tree Add-On Fee (£0.50–£1 per signature)

### Checkout Behaviour

Owner pays for:

- Base product (1 qty)
- Tree product (signatures count qty)

### Success Page Logic

- Mark card as paid
- Record signatures_count
- Calculate trees_planted = signatures_count

## 7. Tree Integration (Manual First)

For MVP:

- After payment, Cardroots shows: "Your trees will be planted shortly."
- Tree planting done manually in Tree-Nation dashboard.

Later phase:

- Automate via Zapier/API

## 8. UI Screens (MVP)

1. **Create Card Page**
   - Title input
   - Optional cover selection
   - Create button

2. **Admin Dashboard**
   - Invite link display
   - List of signatures
   - Preview final card
   - Pay button

3. **Sign Page**
   - Card header
   - Input form (name + message)
   - Add Message button

4. **Payment Success Page**
   - Confirmation
   - Link to final card
   - Trees planted count

5. **Final Card Page**
   - Title + Cover
   - Signatures grid
   - Trees planted

## 9. Non-MVP / Later Phase Features

- AI-generated card designs
- PDF export
- Email delivery system
- Real-time updates via websockets
- Custom fonts/colors for signatures
- Scheduled sending
- Multi-card subscriptions (B2B)
- Corporate branding

## 10. Technical Stack

- Next.js 15
- Supabase for DB + API
- Stripe for payments
- Vercel for hosting
- React Server Components
- TailwindCSS

## 11. Success Metrics (MVP)

- Card creation conversion rate
- Number of signatures per card
- Payment conversion rate
- Average order value (AOV)
- Trees planted per card
- Virality coefficient (signers → new card creators)

## 12. MVP Launch Plan

- Deploy landing page
- Add "Create Free Card" CTA
- Encourage early testers
- Share on social media
- Pitch to small businesses
- Collect first 10 paid group cards
- Iterate based on feedback

## 13. Summary

The Cardroots MVP focuses on one clear flow: Create → Collect Signatures → Pay → Deliver Eco-Friendly Group Card.

It is simple to build, high-impact, easy to scale, and fits perfectly into your eco-gifting ecosystem.


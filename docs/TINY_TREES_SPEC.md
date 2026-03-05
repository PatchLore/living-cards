# Cardroots Document: TINY_TREES_SPEC.md
Project: Cardroots Integration
Date: 2026-02-14
Status: Weekend MVP Ready

## 1. Concept Overview

Tiny Trees is a Tamagotchi-style "Tree Guardian" app where users adopt a virtual sapling and nurture it to maturity over 30 days. The hook: purchasing care items plants real trees via your API partnership, and the virtual tree becomes a "digital twin" of the real one.

**Core Loop:**
- Adopt free sapling (Oak, Pine, or Maple)
- Daily care actions (Water, Sunlight, Nutrients) - limited to 3x/day per action
- Tree grows through stages (Sprout → Sapling → Young Tree → Mature)
- Purchase "Care Kits" to accelerate growth and trigger real tree planting
- At maturity, receive certificate with GPS coordinates of the real twin tree

## 2. Cardroots Integration ("The Living Card")

**Synergy:** Digital greeting cards become the "seed packet" for the game.

### 2.1 Sender Flow
- User buys card on Cardroots (£3.50)
- Upsell Modal: "Plant a real tree with this message? (+£1.99)"
- On purchase:
  - Tree planted immediately via API (TheGoodAPI)
  - Recipient gets "Golden Sapling" (rare skin) unlocked in Tiny Trees
  - Certificate pre-generated with sender/recipient names

### 2.2 Recipient Flow
- Opens Cardroots email/card
- CTA: "Adopt Your Tree" → Deep link to Tiny Trees app
- Lands on pre-unlocked sapling named after occasion (e.g., "Mum's Birthday Oak")
- Retention hook: Tree requires daily care (push notifications) for 30 days

### 2.3 Technical Bridge

```typescript
// Cardroots checkout webhook
if (upsell.treePlanting) {
  const realTree = await theGoodAPI.plant({
    type: 'standard',
    occasion: card.occasion,
    recipientEmail: card.recipientEmail,
    senderName: card.senderName
  });
  
  // Create pending virtual tree
  await supabase.from('trees').insert({
    user_id: recipientId,
    card_id: card.id,
    real_tree_id: realTree.id,
    twin_status: 'linked', // Virtual mirrors real
    species: getSpeciesForOccasion(card.occasion), // Birthday=Cherry, Sympathy=Willow
    growth_stage: 0,
    planted_at: new Date()
  });
  
  // Attach certificate to card delivery
  card.attachments.push({
    type: 'tree_certificate',
    url: generateCertificateUrl(realTree.id)
  });
}
```

## 3. Technical Architecture

### 3.1 Database Schema (Supabase)

```sql
-- Table: trees
id: uuid (pk)
user_id: uuid (fk)
card_id: uuid (fk) -- nullable, links to Cardroots
real_tree_id: varchar(255) -- TheGoodAPI reference
species: enum('oak', 'pine', 'maple', 'cherry', 'willow')
nickname: varchar(50)
growth_stage: int (0-100) -- percentage
health: int (0-100) -- dies if 0 for 48hrs
twin_status: 'pending' | 'linked' | 'mature'
planted_at: timestamp
last_cared_at: timestamp
certificate_url: text

-- Table: care_actions
id: uuid (pk)
tree_id: uuid (fk)
action_type: enum('water', 'sunlight', 'nutrients')
created_at: timestamp
boosted: boolean -- true if purchased

-- Table: purchases
id: uuid (pk)
user_id: uuid (fk)
tree_id: uuid (fk)
product_type: enum('quick_care', 'greenhouse', 'rescue', 'instant_mature')
price_paid: decimal
trees_planted: int -- API quantity
stripe_session_id: varchar(255)
created_at: timestamp
```

### 3.2 Game Mechanics API

```
POST /api/trees/adopt
  Body: { species, nickname, cardRedemptionCode? }
  Response: { treeId, growthStage, nextCareTime }

POST /api/trees/care
  Body: { treeId, actionType }
  Response: { newGrowthStage, health, twinUpdate? }

POST /api/trees/purchase-care
  Body: { treeId, productType }
  Response: { stripeCheckoutUrl, meta: { growthBoost, treesPlanted } }

GET /api/trees/grove/:userId
  Response: Array of trees with maturity status

GET /api/trees/certificate/:treeId
  Response: PDF (generated via Puppeteer from HTML template)
```

### 3.3 TheGoodAPI Integration

```typescript
// services/treeApi.ts
const plantRealTree = async (purchase: Purchase) => {
  const response = await fetch('https://api.thegoodapi.com/plant', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.THEGOOD_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      quantity: purchase.treesPlanted,
      project_id: 'standard', // or specific reforestation project
      metadata: {
        customer_email: purchase.userEmail,
        occasion: purchase.occasion
      }
    })
  });
  
  return {
    id: response.tree_id,
    coordinates: response.gps_coordinates, // [lat, lng]
    certificate_url: response.certificate_url,
    planted_at: response.planted_at
  };
};
```

## 4. Weekend Build Scope (48-72 Hours)

### Saturday - Core Game Loop
- [ ] Tree entity component (SVG/CSS stages: seed → sprout → sapling → tree)
- [ ] Care action buttons (3 actions, cooldown timers)
- [ ] Growth engine (stage calculation based on care count + time)
- [ ] Health decay system (-10 health per missed day)
- [ ] LocalStorage fallback for offline care (sync on reconnect)

### Sunday - Payments & API
- [ ] Stripe Checkout integration (£1.99 Quick Care, £4.99 Greenhouse)
- [ ] TheGoodAPI webhook handler (confirm real tree planted)
- [ ] Certificate PDF generator (HTML template → Puppeteer)
- [ ] Cardroots webhook receiver (auto-create trees from card purchases)

### Monday - Polish & Retention
- [ ] Push notification setup (OneSignal or Supabase Realtime)
  - "Your tree is thirsty! 💧"
  - "Your twin tree in Kenya has sprouted! 🌱"
- [ ] "Grove" view (collection of all user's trees)
- [ ] Social share cards (PNG generation of tree + stats)

## 5. Revenue Model & Unit Economics

**Critical Fix:** Pricing must cover TheGoodAPI cost (~£0.30/tree) + Stripe fees.

| Product | Price | Stripe Fee | Tree Cost | Profit | Margin |
|---------|-------|------------|-----------|--------|--------|
| Quick Care | £1.99 | £0.36 | £0.30 | £1.33 | 67% |
| Greenhouse | £4.99 | £0.55 | £0.90 (3 trees) | £3.54 | 71% |
| Rescue Pack | £1.49 | £0.40 | £0.30 | £0.79 | 53% |
| Instant Mature | £6.99 | £0.81 | £1.50 (5 trees) | £4.68 | 67% |

**Hybrid Model (Recommended):**
- Free Care: Virtual growth only (no real tree)
- £1.99 Quick Care: 1 real tree + instant growth boost
- £4.99 Greenhouse: 3 real trees + permanent 2x growth speed

**Cardroots Upsell:**
- Tree add-on: £1.99 (covers 1 tree + £1.33 profit)
- Premium Tree (Cherry/Willow): £2.99 (rare skins)

## 6. The "Twin Tree" Mechanic

**Emotional Hook:** The virtual tree mirrors the real one's journey.

**Implementation:**
- API Sync: Weekly cron job fetches growth updates from TheGoodAPI (if available) or simulates based on planting date
- Visual Parity: When real tree photo arrives from API, virtual tree updates to match (e.g., "Summer foliage" skin)
- Milestone Emails:
  - Day 1: "Your twin tree has been planted in [Location]!"
  - Day 30: "Your virtual tree is mature! Your real tree is 2ft tall."
  - Month 6: Photo update of real tree growth

**Technical:**

```typescript
// Weekly sync job
const syncTwins = async () => {
  const maturingTrees = await db.trees.find({
    twin_status: 'linked',
    planted_at: { $gt: sixMonthsAgo }
  });
  
  for (const tree of maturingTrees) {
    const realStatus = await theGoodAPI.getTreeStatus(tree.real_tree_id);
    await db.trees.update(tree.id, {
      twin_photo_url: realStatus.latest_photo,
      twin_height: realStatus.height_cm
    });
    
    // Send email update
    await sendUpdateEmail(tree.user_id, tree);
  }
};
```

## 7. Viral & Growth Strategy

**Built-in Virality:**
- Share to Unlock: Share grove screenshot → unlock rare "Rainbow Eucalyptus" species
- Gift Trees: "Send a tree to a friend" → Creates Cardroots integration reverse flow
- Leaderboard: "Top Guardians This Week" (by real trees planted)

**Obituary Mode:** Bereavement trees can be "visited" by multiple family members (shared grove view)

**Cardroots Synergy:**
- Every physical card sent plants a tree → marketing angle: "Cardroots is now carbon negative"
- Recipient becomes user → Zero CAC acquisition
- Occasion-based species (Valentine = Cherry Blossom, Funeral = Oak) creates content diversity

## 8. Risk Assessment & Mitigation

| Risk | Mitigation |
|------|------------|
| Tree death = negative UX | "Rescue Pack" (£1.49) revives tree; or free revive if user watches ad (optional) |
| API latency | Async planting: Virtual tree available immediately, real tree planted within 24hrs (queue system) |
| Chargebacks | Digital goods + charitable component = lower dispute rate; clear T&Cs |
| API downtime | Queue failed requests in Supabase pending_plantings table, retry with exponential backoff |
| Cannibalizing Cardroots | Position as "add-on" not replacement; 80% of tree revenue goes to Cardroots P&L |

## 9. Success Metrics (Month 1)

| Metric | Target |
|--------|--------|
| Card Attach Rate | >15% of cards include tree upsell |
| App Adoption | >40% of card recipients click through to adopt tree |
| D1 Retention | >60% return next day to care for tree |
| D30 Retention | >20% still engaging (maturity point) |
| ARPU | >£2.50 per active user |
| Real Trees | 500+ planted in first month |

**Next Action:** Create feature/tiny-trees branch. Start with the virtual tree component (can test growth mechanics without API integration). TheGoodAPI integration can be stubbed until Monday.
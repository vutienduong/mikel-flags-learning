Dưới đây là **UI wireframe ở mức “Figma-level”** — đủ chi tiết để bạn (hoặc designer/dev) có thể **build ngay**, đặc biệt phù hợp với stack bạn đã chọn (React / Next / iPad PWA).

Tôi sẽ thiết kế theo:

* iPad-first (landscape ưu tiên)
* touch-first (target ≥ 48px)
* minimal text, high visual

---

# 1. DESIGN SYSTEM (áp dụng xuyên suốt)

## 1.1. Grid & spacing

* Base: 8px system
* Safe padding: 24px
* Card radius: 16px
* Button height: 56–72px

---

## 1.2. Color system

* Primary: 🌍 Blue (#3B82F6)
* Success: 🟢 Green (#22C55E)
* Warning: 🟡 Yellow (#FACC15)
* Background: #F8FAFC
* Card: #FFFFFF

---

## 1.3. Typography

* Title: 28–32px bold
* Body: 18–20px
* Caption: 14px

👉 tránh text nhỏ (trẻ em)

---

# 2. SCREEN 1 — HOME (Dashboard)

## Layout (top → bottom)

```
[ Header ]
👤 Avatar      🔥 Day 3

[ Main Card ]
🌍 Southeast Asia
Progress: █████░░░░ 3/10

[ CTA Button ]
▶ Continue Journey

[ Secondary Row ]
[ Quick Play ]   [ Explore ]

[ Bottom Nav (optional) ]
Home | Journey | Progress
```

---

## Component breakdown

### Header

* Left: avatar (circle 48px)
* Right: streak badge (🔥 Day 3)

---

### Main Progress Card

* Card (radius 16px)
* Title: region name
* Progress bar (height 12px)
* Subtext: “3 / 10 countries”

---

### Primary CTA

* Full width
* Height: 72px
* Label: “Continue Journey”

---

### Secondary buttons

* 2 buttons side by side
* Height: 56px

---

# 3. SCREEN 2 — JOURNEY MAP

## Layout

```
[ Header ]
← Back      Southeast Asia

[ Map Area ]

   🇻🇳 — 🇹🇭 — 🇲🇾 — 🇸🇬
    ✓     ●      🔒      🔒

[ Bottom ]
Progress bar + % completion
```

---

## Node design

### States:

* Completed: ⭐ + green glow
* Available: pulsing blue
* Locked: grey + lock icon

---

## Interaction

* Tap node → open level
* Auto-scroll to current node

---

# 4. SCREEN 3 — PRE-LEVEL (Country Intro)

## Layout

```
[ Header ]
← Back

[ Flag (center) ]
(large flag, ~200–300px width)

[ Country Name ]
Vietnam

[ Fun Fact Card ]
"This country has over 3,000 km of coastline."

[ CTA ]
▶ Start Challenge
```

---

## Notes

* Flag must dominate visual
* Fun fact = 1 sentence only

---

# 5. SCREEN 4 — GAME (Spot the Odd Flag)

## Layout

```
[ Header ]
⏱ 10s        Score: 0

[ Grid 3x3 ]

[ FLAG ][ FLAG ][ FLAG ]
[ FLAG ][ FLAG ][ FLAG ]
[ FLAG ][ FLAG ][ FLAG ]

[ Footer ]
(Timer bar)
```

---

## Interaction

* Tap flag
* Immediate feedback

---

## Feedback states

### Correct:

* selected flag → green border
* confetti animation

### Wrong:

* red shake animation
* highlight correct answer

---

# 6. SCREEN 5 — RESULT

## Layout

```
🎉 Correct!

⭐ ⭐ ⭐

+10 XP

[ Buttons ]
▶ Next Country
↺ Replay
```

---

## Animation

* stars appear sequentially
* XP counter increments

---

# 7. SCREEN 6 — UNLOCK

## Layout

```
🎉 New Country Unlocked!

[ Big Flag ]

THAILAND

[ CTA ]
▶ Continue
```

---

## Optional

* add “sticker collected” visual

---

# 8. SCREEN 7 — FUN FACT

## Layout

```
[ Flag ]

Did you know?

"This country has more temples than any other in the region."

[ CTA ]
▶ Continue Journey
```

---

## Notes

* learning moment, keep simple
* optional audio button 🔊

---

# 9. SCREEN 8 — PROGRESS

## Layout

```
🌍 Your Progress

Countries learned:
25 / 195

🔥 Streak: 3 days

🏆 Badges:
[ Asia Explorer ]
[ Flag Master ]

[ CTA ]
▶ Continue Journey
```

---

## Badge UI

* small cards
* icon + label

---

# 10. SCREEN 9 — QUICK PLAY

## Layout

```
⚡ Quick Play

[ Game Cards ]

[ Spot the Flag ]
[ Match Game ]
[ Speed Quiz ]
```

---

## Interaction

* tap → start instantly
* no intro screen

---

# 11. SCREEN 10 — EXPLORE (reuse existing)

Bạn đã có ():

* flag grid
* filter
* search

👉 chỉ cần refine UI:

### Improvements:

* larger cards
* remove dense data
* add “Tap to play” CTA

---

# 12. NAVIGATION STRUCTURE

## Simple version (recommended)

* Home (default)
* Journey
* Progress

👉 Quick Play = shortcut trong Home

---

# 13. COMPONENT ARCHITECTURE (React)

Bạn có thể structure như này:

```id="smztp6"
<Layout>
  <Header />
  <Content>
    {screen}
  </Content>
</Layout>
```

---

## Key components

```id="r3qhcc"
<FlagCard />
<ProgressBar />
<GameGrid />
<RewardModal />
<CountryNode />
```

---

# 14. UX PRINCIPLES bạn phải giữ

## 1. 1 screen = 1 action

* không overload
* không nhiều CTA

---

## 2. Time-to-fun < 3s

* mở app → bấm → chơi ngay

---

## 3. Feedback ngay lập tức

* tap → phản hồi trong 100ms

---

## 4. Loop cực ngắn

* 1 level ≤ 20s

---

# 15. Opinion (thẳng)

Nếu bạn build đúng wireframe này:

* UX của bạn sẽ giống:

  * Duolingo (loop)
  * Kahoot Kids (energy)
  * casual mobile games

Không còn là:

* “flashcard app”
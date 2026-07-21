# Smart Alias Autocomplete Examples

## ðŸŽ¨ How Aliases Work

The autocomplete system now understands **natural language aliases** for values. Instead of remembering exact syntax, just type what you mean!

---

## ðŸŽ¨ **@color** Examples

### Type Natural Color Names:

```
{{// @color red
```
â†’ **Autocompletes to:** `#FF6B6B`

```
{{// @color blue
```
â†’ **Autocompletes to:** `#45B7D1`

```
{{// @color green
```
â†’ **Autocompletes to:** `#98D8C8` (Mint green)

```
{{// @color purple
```
â†’ **Autocompletes to:** `#A78BFA`

```
{{// @color orange
```
â†’ **Autocompletes to:** `#FFA07A`

```
{{// @color yellow
```
â†’ **Autocompletes to:** `#FFD93D`

```
{{// @color pink
```
â†’ **Autocompletes to:** `#FB6F92`

```
{{// @color gray
```
â†’ **Autocompletes to:** `#6C757D`

```
{{// @color grey
```
â†’ **Also works!** â†’ `#6C757D`

### Alternative Names:

```
{{// @color cyan
```
â†’ `#4ECDC4`

```
{{// @color mint
```
â†’ `#98D8C8`

```
{{// @color violet
```
â†’ `#A78BFA`

```
{{// @color electric
```
â†’ `#00D9FF` (Electric Blue)

---

## ðŸŽ­ **@icon** Examples

### Type Descriptive Words:

```
{{// @icon fire
```
â†’ **Autocompletes to:** `ðŸ”¥`

```
{{// @icon warning
```
â†’ `âš ï¸`

```
{{// @icon sword
```
â†’ `âš”ï¸`

```
{{// @icon heart
```
â†’ `â¤ï¸`

```
{{// @icon star
```
â†’ Could match `âœ¨` (sparkles) OR `â­` (star)

```
{{// @icon skull
```
â†’ `ðŸ’€`

```
{{// @icon shield
```
â†’ `ðŸ›¡ï¸`

```
{{// @icon brain
```
â†’ `ðŸ§ `

### Type Concepts:

```
{{// @icon combat
```
â†’ `âš”ï¸` (Swords)

```
{{// @icon battle
```
â†’ `âš”ï¸` (Swords)

```
{{// @icon love
```
â†’ `â¤ï¸` (Heart)

```
{{// @icon romance
```
â†’ `â¤ï¸` (Heart)

```
{{// @icon death
```
â†’ `ðŸ’€` (Skull)

```
{{// @icon horror
```
â†’ `ðŸ’€` (Skull)

```
{{// @icon night
```
â†’ `ðŸŒ™` (Moon)

```
{{// @icon dark
```
â†’ `ðŸŒ™` (Moon)

```
{{// @icon day
```
â†’ `â˜€ï¸` (Sun)

```
{{// @icon bright
```
â†’ `â˜€ï¸` (Sun)

```
{{// @icon talk
```
â†’ `ðŸ’¬` (Speech)

```
{{// @icon dialogue
```
â†’ `ðŸ’¬` (Speech)

```
{{// @icon chat
```
â†’ `ðŸ’¬` (Speech)

```
{{// @icon rp
```
â†’ `ðŸŽ­` (Theater mask)

```
{{// @icon roleplay
```
â†’ `ðŸŽ­` (Theater mask)

```
{{// @icon book
```
â†’ `ðŸ“š` (Books)

```
{{// @icon docs
```
â†’ `ðŸ“š` (Books)

```
{{// @icon knowledge
```
â†’ `ðŸ“š` (Books)

```
{{// @icon fast
```
â†’ `ðŸš€` (Rocket)

```
{{// @icon speed
```
â†’ `ðŸš€` (Rocket)

```
{{// @icon protect
```
â†’ `ðŸ›¡ï¸` (Shield)

```
{{// @icon defense
```
â†’ `ðŸ›¡ï¸` (Shield)

---

## ðŸ§  Smart Sorting

The autocomplete system uses **intelligent scoring** to show the best matches first:

### Priority Levels:

1. **Exact alias match** (Score: 1000)
   - Type: `red` â†’ Shows `#FF6B6B` FIRST

2. **Exact value match** (Score: 900)
   - Type: `#FF6B6B` â†’ Shows `#FF6B6B` FIRST

3. **Alias starts with** (Score: 500)
   - Type: `fi` â†’ Shows ðŸ”¥ (fire) high in list

4. **Value starts with** (Score: 400)
   - Type: `#FF` â†’ Shows colors starting with #FF

5. **Alias contains** (Score: 100)
   - Type: `hot` â†’ Shows ðŸ”¥ (fire - hot, intense)

6. **Value contains** (Score: 50)
   - Type: `6B` â†’ Shows `#FF6B6B`

7. **Description contains** (Score: 10)
   - Type: `danger` â†’ Shows `#FF6B6B` (Red - Danger)

---

## ðŸ’¡ Real-World Workflow

### Before (Hard):
```
{{// @color
```
User thinks: *"What was the hex code for red again? #FF... 6B6B? Or was it FF6B6C?"*

### After (Easy):
```
{{// @color red
```
â†’ Tab â†’ `#FF6B6B` âœ“

---

### Before (Hard):
```
{{// @icon
```
User thinks: *"How do I type the sword emoji? Do I copy-paste it?"*

### After (Easy):
```
{{// @icon sword
```
â†’ Tab â†’ `âš”ï¸` âœ“

---

## ðŸŽ¯ Multiple Aliases

Some values have multiple aliases so you can type what feels natural:

### Colors:
- **Green**: `green`, `mint`
- **Purple**: `purple`, `violet`
- **Gray**: `gray`, `grey`

### Icons:
- **Sparkles (âœ¨)**: `sparkles`, `new`, `shine`, `star`
- **Swords (âš”ï¸)**: `sword`, `swords`, `combat`, `battle`
- **Theater (ðŸŽ­)**: `theater`, `mask`, `roleplay`, `rp`
- **Speech (ðŸ’¬)**: `speech`, `talk`, `dialogue`, `chat`
- **Books (ðŸ“š)**: `book`, `books`, `docs`, `knowledge`
- **Fire (ðŸ”¥)**: `fire`, `hot`, `flame`
- **Warning (âš ï¸)**: `warning`, `caution`, `alert`
- **Heart (â¤ï¸)**: `heart`, `love`, `romance`
- **Skull (ðŸ’€)**: `skull`, `death`, `horror`, `spooky`

---

## ðŸš€ Pro Tips

### 1. **Type and Tab**
Don't overthink it - just type what you mean and press Tab:
```
{{// @color red [TAB] â†’ #FF6B6B
{{// @icon fire [TAB] â†’ ðŸ”¥
```

### 2. **Partial Matches Work**
You don't need to type the full word:
```
{{// @color bl â†’ Shows blue
{{// @icon sk â†’ Shows skull
```

### 3. **Comma-Separated Lists**
Works in lists too:
```
{{// @tags combat, [type here]
```

### 4. **Case Insensitive**
Capitalization doesn't matter:
```
{{// @color RED â†’ Works!
{{// @color Red â†’ Works!
{{// @color red â†’ Works!
```

---

## ðŸ“Š Complete Alias List

### Colors (10):
- `red` â†’ #FF6B6B
- `cyan` â†’ #4ECDC4
- `blue` â†’ #45B7D1
- `orange` â†’ #FFA07A
- `mint`, `green` â†’ #98D8C8
- `yellow` â†’ #FFD93D
- `purple`, `violet` â†’ #A78BFA
- `pink` â†’ #FB6F92
- `gray`, `grey` â†’ #6C757D
- `electric`, `bright-blue` â†’ #00D9FF

### Icons (20 emojis, 60+ aliases):
See examples above for full list!

---

## âœ¨ The Magic

**Before:** Memorize hex codes and emoji unicode
**After:** Type what you mean

**Before:** Copy-paste from references
**After:** Just type and tab

**Before:** Look up documentation
**After:** Autocomplete teaches you

---

**This is how autocomplete should work everywhere!** ðŸŽ‰

# Vaani Premium UI/UX Integration Guide

## 🎨 Overview

This guide provides comprehensive instructions for integrating the new premium glassmorphic UI components into your Vaani AI assistant. All components are built with **Framer Motion**, **Tailwind CSS**, and follow **WCAG 2.2 accessibility standards**.

---

## 📁 Component Structure

```
client/components/Premium/
├── GlassCard.tsx              # Reusable glass card component
├── FloatingInput.tsx          # Floating command bar with mic button
├── AIOrb.tsx                  # Animated AI visualization orb
├── FloatingSidebar.tsx        # Collapsible floating sidebar
├── InteractiveTile.tsx        # 3D tilt interactive tiles
├── GlassChatBubble.tsx        # Glass chat message bubbles
├── PremiumLayout.tsx          # Main layout orchestrator
├── MicroInteractions.tsx      # Reusable micro-interaction effects
├── HeroSection.tsx            # Hero section with AI orb
├── ResponsiveLayout.tsx       # Responsive layout utilities
└── index.ts                   # Barrel exports
```

---

## 🚀 Quick Start

### 1. Import Components

```typescript
import {
  GlassCard,
  FloatingInput,
  AIOrb,
  FloatingSidebar,
  InteractiveTile,
  GlassChatBubble,
  PremiumLayout,
  HeroSection,
} from '@/components/Premium';

import {
  RippleContainer,
  SuccessAnimation,
  LoadingSpinner,
  Skeleton,
  FloatingElement,
  GlowPulse,
} from '@/components/Premium/MicroInteractions';
```

### 2. Tailwind Config Already Updated

The `tailwind.config.ts` has been updated with:
- Premium color system
- New animations and keyframes
- Box shadows and glow effects
- Backdrop blur utilities

### 3. Global CSS

Dark gradient background and glassmorphic effects are automatically applied via `global.css`.

---

## 🧩 Component Usage Examples

### Glass Card

```typescript
import { GlassCard } from '@/components/Premium';

export default function Example() {
  return (
    <GlassCard
      variant="interactive"
      glow="cyan"
      hover={true}
      className="p-6 space-y-4"
    >
      <h3 className="text-lg font-bold text-white">Card Title</h3>
      <p className="text-white/70">Card content goes here</p>
    </GlassCard>
  );
}
```

**Props:**
- `variant`: `'default' | 'interactive' | 'subtle'`
- `glow`: `'blue' | 'cyan' | 'purple' | 'none'`
- `hover`: `boolean` - Enable hover animations
- `className`: Custom Tailwind classes

---

### Floating Input

```typescript
import { FloatingInput } from '@/components/Premium';
import { useState } from 'react';

export default function Example() {
  const [input, setInput] = useState('');

  return (
    <FloatingInput
      value={input}
      onChange={setInput}
      onSubmit={() => console.log(input)}
      onVoiceClick={() => console.log('Start listening')}
      isListening={false}
      isLoading={false}
      placeholder="Ask Vaani..."
    />
  );
}
```

**Props:**
- `value`: Current input text
- `onChange`: Text change callback
- `onSubmit`: Send message callback
- `onVoiceClick`: Voice button callback
- `isListening`: Show listening state
- `isLoading`: Show loading state
- `placeholder`: Input placeholder text

---

### AI Orb

```typescript
import { AIOrb } from '@/components/Premium';

export default function Example() {
  return (
    <div className="flex items-center justify-center">
      <AIOrb
        state="listening" // 'idle' | 'listening' | 'processing' | 'speaking'
        size="lg" // 'sm' | 'md' | 'lg'
      />
    </div>
  );
}
```

**Props:**
- `state`: AI state for visualization
- `size`: Orb size

**States:**
- `idle`: Subtle pulsing orb
- `listening`: Red glow with rings
- `processing`: Purple rotation
- `speaking`: Indigo waveform

---

### Floating Sidebar

```typescript
import { FloatingSidebar } from '@/components/Premium';

export default function Example() {
  const navItems = [
    {
      id: 'chat',
      label: 'New Chat',
      icon: <MessageSquare size={20} />,
      onClick: () => console.log('New chat'),
      active: true,
    },
    // ... more items
  ];

  return (
    <FloatingSidebar
      items={navItems}
      onToggle={(isOpen) => console.log('Sidebar toggled')}
    />
  );
}
```

---

### Interactive Tile

```typescript
import { InteractiveTile } from '@/components/Premium';
import { Brain } from 'lucide-react';

export default function Example() {
  return (
    <InteractiveTile
      icon={<Brain size={32} />}
      title="Analyze"
      description="Get insights on any topic"
      onClick={() => console.log('Tile clicked')}
    />
  );
}
```

---

### Glass Chat Bubble

```typescript
import { GlassChatBubble } from '@/components/Premium';

export default function Example() {
  return (
    <GlassChatBubble
      message="Hello! How can I help you?"
      role="assistant"
      timestamp={new Date()}
      onVoicePlay={() => console.log('Play voice')}
      onCopy={() => console.log('Copy')}
      onDelete={() => console.log('Delete')}
      showActions={true}
      isLoading={false}
    />
  );
}
```

---

### Premium Layout

```typescript
import { PremiumLayout } from '@/components/Premium';

export default function Example() {
  return (
    <PremiumLayout
      onInput={(text) => console.log('User input:', text)}
      onVoiceClick={() => console.log('Voice clicked')}
      onSettingsClick={() => console.log('Settings')}
      isListening={false}
      isLoading={false}
    >
      {/* Your content here */}
    </PremiumLayout>
  );
}
```

---

### Hero Section

```typescript
import { HeroSection } from '@/components/Premium';

export default function Example() {
  return (
    <HeroSection
      aiState="idle"
      userName="John"
      onQuickAction={(action) => console.log('Action:', action)}
    />
  );
}
```

---

## ✨ Micro-Interactions

### Ripple Effect

```typescript
import { RippleContainer } from '@/components/Premium/MicroInteractions';

export default function Example() {
  return (
    <RippleContainer
      onRipple={(x, y) => console.log('Ripple at', x, y)}
    >
      <button className="px-4 py-2 rounded-lg bg-blue-500">
        Click me
      </button>
    </RippleContainer>
  );
}
```

### Loading Spinner

```typescript
import { LoadingSpinner } from '@/components/Premium/MicroInteractions';

export default function Example() {
  return (
    <div className="flex items-center justify-center">
      <LoadingSpinner size="lg" />
    </div>
  );
}
```

### Success Animation

```typescript
import { SuccessAnimation } from '@/components/Premium/MicroInteractions';
import { useState } from 'react';

export default function Example() {
  const [showSuccess, setShowSuccess] = useState(false);

  return (
    <>
      <button onClick={() => setShowSuccess(true)}>
        Complete Action
      </button>
      <SuccessAnimation show={showSuccess} />
    </>
  );
}
```

### Skeleton Loading

```typescript
import { Skeleton } from '@/components/Premium/MicroInteractions';

export default function Example() {
  return (
    <Skeleton
      count={3}
      width="w-full"
      height="h-4"
    />
  );
}
```

### Floating Element

```typescript
import { FloatingElement } from '@/components/Premium/MicroInteractions';

export default function Example() {
  return (
    <FloatingElement duration={4} distance={30}>
      <div className="w-12 h-12 rounded-lg bg-cyan-500" />
    </FloatingElement>
  );
}
```

### Glow Pulse

```typescript
import { GlowPulse } from '@/components/Premium/MicroInteractions';

export default function Example() {
  return (
    <GlowPulse color="cyan" intensity={2}>
      <button className="px-6 py-2 rounded-lg bg-blue-500">
        Hover me
      </button>
    </GlowPulse>
  );
}
```

---

## 📱 Responsive Layouts

### Responsive Grid

```typescript
import { ResponsiveGrid } from '@/components/Premium/ResponsiveLayout';

export default function Example() {
  return (
    <ResponsiveGrid
      columns={{ mobile: 1, tablet: 2, desktop: 3 }}
      gap={4}
    >
      {/* Grid items */}
    </ResponsiveGrid>
  );
}
```

### Responsive Drawer

```typescript
import { ResponsiveDrawer } from '@/components/Premium/ResponsiveLayout';
import { useState } from 'react';

export default function Example() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Open Drawer</button>
      <ResponsiveDrawer
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        position="left"
      >
        <div className="p-6">Drawer content</div>
      </ResponsiveDrawer>
    </>
  );
}
```

### Adaptive Container

```typescript
import { AdaptiveContainer } from '@/components/Premium/ResponsiveLayout';

export default function Example() {
  return (
    <AdaptiveContainer
      mobile={<MobileView />}
      tablet={<TabletView />}
      desktop={<DesktopView />}
    />
  );
}
```

---

## 🎨 Color System

### Premium Colors

```css
/* Available in Tailwind */
from-premium-dark: #0a0e27
from-premium-darker: #06081a
from-premium-blue: #3b82f6
from-premium-indigo: #6366f1
from-premium-cyan: #06b6d4
from-premium-purple: #a855f7
from-premium-pink: #ec4899
```

### Glow Effects

```typescript
// Use these shadow utilities
<div className="shadow-glass">
<div className="shadow-glass-lg">
<div className="shadow-glow-sm">
<div className="shadow-glow-md">
<div className="shadow-glow-lg">
<div className="shadow-glow-purple">
<div className="shadow-glow-blue">
<div className="shadow-inner-glow">
```

---

## 🎬 Available Animations

```typescript
// Use in motion components
animate={{ /* ... */ }}

// Built-in animations via Tailwind
animate-pulse-glow
animate-float
animate-shimmer
animate-ripple
animate-slide-in-top
animate-slide-in-bottom
animate-slide-in-left
animate-slide-in-right
animate-scale-in
animate-fade-in
animate-spin-slow
animate-bounce-soft
```

---

## ♿ Accessibility Features

All components follow **WCAG 2.2 AA** standards:

- ✅ Proper ARIA labels
- ✅ Keyboard navigation support
- ✅ Focus indicators
- ✅ High contrast mode support
- ✅ Screen reader optimized
- ✅ Touch target sizes (48px minimum)

### Example: Accessible Button

```typescript
<motion.button
  className="px-4 py-2 rounded-lg bg-blue-500 focus:ring-2 focus:ring-offset-2 focus:ring-blue-400"
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  aria-label="Send message"
  role="button"
>
  Send
</motion.button>
```

---

## 🔧 Integration with Existing App

### 1. Replace MainLayout

```typescript
// Before
import MainLayout from './components/MainLayout';

// After
import { PremiumLayout } from '@/components/Premium';

// In App.tsx
<PremiumLayout
  onInput={handleInput}
  onVoiceClick={handleVoice}
  isListening={isListening}
>
  <Routes>
    {/* Your routes */}
  </Routes>
</PremiumLayout>
```

### 2. Update Chat Interface

```typescript
// Replace chat bubbles
import { GlassChatBubble } from '@/components/Premium';

export function ChatMessage({ message, role }) {
  return (
    <GlassChatBubble
      message={message}
      role={role}
      showActions={true}
    />
  );
}
```

### 3. Use Premium Input

```typescript
// Replace input area
import { FloatingInput } from '@/components/Premium';

// Use in your page component
<FloatingInput
  value={input}
  onChange={setInput}
  onSubmit={handleSend}
  isListening={isListening}
/>
```

---

## 🎯 Best Practices

### 1. Performance

- Use `memo` for frequently rendered components
- Lazy load heavy animations on low-end devices
- Use `will-change` CSS for animated elements

```typescript
import { memo } from 'react';

const OptimizedCard = memo(({ data }) => (
  <GlassCard>{data}</GlassCard>
));
```

### 2. Accessibility

- Always provide alt text for icons
- Use semantic HTML
- Test with screen readers

```typescript
<GlassCard aria-label="User profile card">
  {/* Content */}
</GlassCard>
```

### 3. Animations

- Prefer `opacity` and `transform` over `width`/`height`
- Use `will-change` sparingly
- Respect `prefers-reduced-motion`

```typescript
<motion.div
  animate={{ scale: 1, opacity: 1 }}
  transition={{ duration: 0.3 }}
  style={{ willChange: 'transform' }}
>
  {/* Content */}
</motion.div>
```

### 4. Responsive Design

- Mobile first approach
- Test on actual devices
- Use responsive utilities

```typescript
<div className="p-4 md:p-6 lg:p-8">
  {/* Responsive padding */}
</div>
```

---

## 🧪 Testing

### Visual Testing

```bash
# Run dev server
npm run dev

# Test different breakpoints
# Mobile: 375px width
# Tablet: 768px width
# Desktop: 1440px width
```

### Accessibility Testing

```bash
# Run accessibility checks
npm run test

# Test with screen reader
# NVDA (Windows), JAWS, VoiceOver (Mac), TalkBack (Android)
```

### Performance Testing

```bash
# Check animation performance
# DevTools > Performance > Record
# Look for 60 FPS
```

---

## 📚 Additional Resources

- **Framer Motion Docs**: https://www.framer.com/motion
- **Tailwind CSS**: https://tailwindcss.com
- **WCAG 2.2**: https://www.w3.org/WAI/WCAG22/quickref

---

## 🤝 Contributing

When creating new premium components:

1. Follow the existing component structure
2. Add Framer Motion animations
3. Include accessibility attributes
4. Test on mobile/tablet/desktop
5. Document usage in this guide

---

## 💬 Support

For issues or questions:

1. Check this integration guide
2. Review component source code
3. Test in isolation before integration
4. Create detailed bug reports

---

**Last Updated**: 2024
**Version**: 2.0
**Status**: Production Ready ✅

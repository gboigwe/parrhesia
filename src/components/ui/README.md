# UI Component Library

A comprehensive UI component library built with React, TypeScript, and Tailwind CSS, designed for the Parrhesia debate platform on Base L2.

## Components

### Button

Versatile button component with multiple variants and sizes.

```tsx
import { Button } from "@/components/ui/button";

<Button variant="primary" size="lg">
  Create Debate
</Button>

<Button variant="outline" isLoading>
  Loading...
</Button>
```

**Props:**
- `variant`: "default" | "primary" | "secondary" | "outline" | "ghost" | "destructive" | "link"
- `size`: "default" | "sm" | "lg" | "icon"
- `isLoading`: boolean

---

### Card

Container component with header, content, and footer sections.

```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";

<Card variant="elevated">
  <CardHeader>
    <CardTitle>Debate Title</CardTitle>
    <CardDescription>Debate description</CardDescription>
  </CardHeader>
  <CardContent>
    Main content
  </CardContent>
  <CardFooter>
    Footer actions
  </CardFooter>
</Card>
```

**Props:**
- `variant`: "default" | "bordered" | "elevated" | "ghost"

---

### Input

Form input with label, validation, and icons.

```tsx
import { Input } from "@/components/ui/input";

<Input
  label="Email"
  type="email"
  placeholder="Enter your email"
  error="Invalid email"
  helperText="We'll never share your email"
  leftIcon={<MailIcon />}
/>
```

**Props:**
- `label`: string
- `error`: string
- `helperText`: string
- `leftIcon`: ReactNode
- `rightIcon`: ReactNode

---

### Textarea

Multi-line text input with character counter.

```tsx
import { Textarea } from "@/components/ui/textarea";

<Textarea
  label="Argument"
  placeholder="Enter your argument"
  maxLength={500}
  characterCount
/>
```

**Props:**
- `label`: string
- `error`: string
- `helperText`: string
- `characterCount`: boolean
- `maxLength`: number

---

### Badge

Small status or label indicator.

```tsx
import { Badge } from "@/components/ui/badge";

<Badge variant="success" size="sm">
  Active
</Badge>
```

**Props:**
- `variant`: "default" | "primary" | "secondary" | "success" | "warning" | "danger" | "outline"
- `size`: "sm" | "default" | "lg"

---

### Avatar

User avatar with fallback support.

```tsx
import { Avatar, AvatarGroup } from "@/components/ui/avatar";

<Avatar
  src="/avatar.jpg"
  alt="User"
  fallback="JD"
  size="lg"
/>

<AvatarGroup max={3}>
  <Avatar src="/user1.jpg" />
  <Avatar src="/user2.jpg" />
  <Avatar src="/user3.jpg" />
  <Avatar src="/user4.jpg" />
</AvatarGroup>
```

**Props:**
- `src`: string
- `alt`: string
- `fallback`: string
- `size`: "sm" | "default" | "lg" | "xl"

---

### Dialog

Modal dialog with overlay.

```tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

const [open, setOpen] = useState(false);

<Dialog open={open} onOpenChange={setOpen}>
  <DialogContent onClose={() => setOpen(false)}>
    <DialogHeader>
      <DialogTitle>Confirm Action</DialogTitle>
      <DialogDescription>
        Are you sure you want to proceed?
      </DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <Button onClick={() => setOpen(false)}>Cancel</Button>
      <Button variant="primary">Confirm</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

---

### DropdownMenu

Dropdown menu with items and separators.

```tsx
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";

<DropdownMenu>
  <DropdownMenuTrigger>
    <Button>Options</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end">
    <DropdownMenuItem>Edit</DropdownMenuItem>
    <DropdownMenuItem>Share</DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem>Delete</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

---

### Tabs

Tab navigation component.

```tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

<Tabs defaultValue="arguments">
  <TabsList>
    <TabsTrigger value="arguments">Arguments</TabsTrigger>
    <TabsTrigger value="votes">Votes</TabsTrigger>
    <TabsTrigger value="stats">Stats</TabsTrigger>
  </TabsList>
  <TabsContent value="arguments">
    Arguments content
  </TabsContent>
  <TabsContent value="votes">
    Votes content
  </TabsContent>
</Tabs>
```

---

### Toast

Notification system.

```tsx
import { toast, useToast, ToastProvider } from "@/components/ui/toast";

// In your app root
<ToastProvider>
  <App />
</ToastProvider>

// In your components
const { toast } = useToast();

toast({
  title: "Success!",
  description: "Your debate has been created",
  variant: "success",
  duration: 3000,
});
```

**Props:**
- `title`: string
- `description`: string
- `variant`: "default" | "success" | "error" | "warning"
- `duration`: number (milliseconds)

---

### Skeleton

Loading placeholder components.

```tsx
import { Skeleton, SkeletonText, SkeletonCard, SkeletonAvatar } from "@/components/ui/skeleton";

// Basic skeleton
<Skeleton className="h-10 w-full" />

// Text skeleton
<SkeletonText lines={3} />

// Card skeleton
<SkeletonCard />

// Avatar skeleton
<SkeletonAvatar size="lg" />
```

**Props:**
- `variant`: "default" | "text" | "circular" | "rectangular"
- `animation`: "pulse" | "wave" | "none"

---

## Design System

### Colors

Import color constants from the design system:

```tsx
import { BASE_COLORS, SEMANTIC_COLORS, DEBATE_COLORS, STATUS_COLORS } from "@/lib/design/colors";
```

### Responsive Utilities

Use responsive helpers for breakpoints and patterns:

```tsx
import { BREAKPOINTS, RESPONSIVE_PATTERNS, mediaQuery } from "@/lib/design/responsive";
```

---

## Accessibility

All components follow ARIA best practices:

- Keyboard navigation support
- Screen reader friendly
- Focus management
- Semantic HTML

---

## Theming

Components support both light and dark mode through Tailwind CSS dark mode utilities.

```tsx
// Automatically adapts to system preference
<Button className="bg-white dark:bg-gray-800">
  Click me
</Button>
```

---

## Best Practices

1. **Type Safety**: All components are fully typed with TypeScript
2. **Composition**: Build complex UIs by composing smaller components
3. **Consistency**: Use design tokens for colors, spacing, and typography
4. **Performance**: Components use React.forwardRef and proper memoization
5. **Accessibility**: Always provide labels, alt text, and ARIA attributes

---

## Contributing

When adding new components:

1. Follow existing patterns and naming conventions
2. Export component and its sub-components
3. Add TypeScript types for all props
4. Support dark mode with Tailwind utilities
5. Document usage in this README

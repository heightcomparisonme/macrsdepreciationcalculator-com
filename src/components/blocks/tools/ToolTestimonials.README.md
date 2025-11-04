# ToolTestimonials Component

A beautiful testimonials carousel component inspired by modelfy.art, designed for tool pages with stats display and auto-scrolling testimonial cards.

## Features

- 📊 **Stats Display**: Shows key metrics (models created, rating, success rate, countries)
- 🎠 **Auto-scroll Carousel**: Smooth auto-scrolling testimonials with pause on hover
- ⭐ **Star Ratings**: Visual 5-star rating system
- 🌐 **i18n Support**: Fully internationalized with next-intl
- 📱 **Responsive**: Works beautifully on all screen sizes
- 🎨 **Customizable**: Custom stats and styling options

## Usage

### Basic Implementation

```tsx
import ToolTestimonials from "@/components/blocks/tools/ToolTestimonials";

export default function YourToolPage() {
  return (
    <div>
      {/* Your other content */}
      <ToolTestimonials toolKey="example" />
    </div>
  );
}
```

### With Custom Stats

```tsx
<ToolTestimonials 
  toolKey="example"
  stats={{
    modelsCreated: "50,000+",
    averageRating: "4.8/5",
    successRate: "98%",
    countriesServed: "120+"
  }}
/>
```

### Integrated in ToolPageLayout

```tsx
import { ToolPageLayout } from "@/components/blocks/tools/ToolPageLayout";

export default function YourToolPage() {
  return (
    <ToolPageLayout
      toolKey="example"
      calculator={<YourCalculator />}
      features={features}
      features2={features2}
      showTestimonials={true} // Enable testimonials
      testimonialStats={{
        modelsCreated: "25,000+",
        averageRating: "4.9/5",
        successRate: "99%",
        countriesServed: "80+"
      }}
    />
  );
}
```

## Translation Structure

Add the following structure to your tool's translation file at `src/i18n/pages/tools/[your-tool]/en.json`:

```json
{
  "testimonials": {
    "title": "Testimonials",
    "description": "What users say about our tool",
    "stats": {
      "modelsCreated": "Models Created",
      "averageRating": "Average Rating",
      "successRate": "Success Rate",
      "countriesServed": "Countries Served"
    },
    "items": [
      {
        "name": "Sarah Chen",
        "role": "Game Developer",
        "avatar": "https://randomuser.me/api/portraits/women/1.jpg",
        "quote": "This tool has revolutionized our workflow!",
        "rating": "5"
      },
      {
        "name": "John Doe",
        "role": "3D Artist",
        "avatar": "https://randomuser.me/api/portraits/men/1.jpg",
        "quote": "Amazing results in minutes!",
        "rating": "5"
      }
    ]
  }
}
```

## Props

### ToolTestimonialsProps

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `toolKey` | `string` | Yes | - | The tool namespace key for i18n translations |
| `stats` | `object` | No | Default stats | Custom statistics to display |
| `stats.modelsCreated` | `string` | No | "25,000+" | Number of models/items created |
| `stats.averageRating` | `string` | No | "4.9/5" | Average user rating |
| `stats.successRate` | `string` | No | "99%" | Success rate percentage |
| `stats.countriesServed` | `string` | No | "80+" | Number of countries served |

## Styling

The component uses Tailwind CSS and is fully customizable. Key classes:

- **Container**: `container py-16 lg:py-24` - Main section padding
- **Stats Grid**: `grid-cols-2 lg:grid-cols-4` - Responsive stat layout
- **Cards**: `hover:shadow-lg transition-shadow` - Interactive card effects
- **Gradient Fade**: `before:bg-gradient-to-r after:bg-gradient-to-l` - Edge fade effect

## Customization Examples

### Change Carousel Speed

```tsx
// In ToolTestimonials.tsx
const plugin = useRef(
  AutoScroll({
    startDelay: 500,
    speed: 1.0, // Increase for faster scrolling (default: 0.7)
  })
);
```

### Adjust Card Size

```tsx
// In the CarouselItem
<CarouselItem className="pl-4 basis-full md:basis-1/2 lg:basis-1/2">
  {/* Larger cards on desktop */}
</CarouselItem>
```

### Custom Avatar Placeholders

Use a service like:
- https://randomuser.me/api/portraits/
- https://ui-avatars.com/api/
- https://avatar.vercel.sh/

## Dependencies

- `next-intl` - Internationalization
- `embla-carousel-auto-scroll` - Auto-scroll functionality
- `lucide-react` - Star icons
- `@radix-ui/react-avatar` - Avatar components
- Shadcn UI components: `Card`, `Avatar`, `Carousel`

## Best Practices

1. **Keep quotes concise**: 1-2 sentences work best
2. **Use real avatars**: Professional photos build trust
3. **Vary the roles**: Show diverse user types
4. **Update stats regularly**: Keep numbers current
5. **Localize properly**: Translate all testimonials for each locale

## Example Implementation

See the complete example at:
- Component: `src/components/blocks/tools/ToolTestimonials.tsx`
- Usage: `src/app/[locale]/(default)/tools/example/page.tsx`
- Translations: `src/i18n/pages/tools/example/en.json`

## Design Inspiration

Based on the testimonials section from [modelfy.art](https://modelfy.art/) with:
- Clean card design with star ratings
- Auto-scrolling carousel
- Stats header section
- Professional avatar presentation
- Smooth hover effects

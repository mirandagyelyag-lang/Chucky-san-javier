# Chucky San Javier

> Mobile-first ordering experience for a local fried chicken and sushi business in San Javier, Chile.

Chucky is a production web application designed to make ordering from a phone fast and straightforward. Customers can browse the menu, search products, build an order, choose pickup or delivery, provide delivery details and send the order to the business for confirmation.

## Live application

**Production:** https://chuckysanjavier.vercel.app

The customer experience is intentionally optimized for mobile devices.

## Highlights

- Mobile-first restaurant ordering interface
- Menu organized by fried chicken, sushi, sauces and drinks
- Product search and category filtering
- Product detail views and shopping cart
- Pickup and delivery workflows
- Customer and payment-detail collection
- Address autocomplete and validation for San Javier
- Device geolocation support for delivery addresses
- Geoapify integration through a server-side Vercel API route
- Order submission with an email confirmation workflow
- Responsive navigation and custom visual identity
- Production deployment on Vercel

## Tech stack

| Area | Technology |
| --- | --- |
| Frontend | React |
| Build tooling | Vite |
| Language | JavaScript / JSX |
| UI icons | Lucide React |
| Geocoding | Geoapify |
| Server-side API | Vercel Functions |
| Deployment | Vercel |
| CI / alternate static deployment | GitHub Actions / GitHub Pages |

## Project structure

```text
.
├── api/
│   └── geoapify.js
├── public/
├── src/
│   ├── main.jsx
│   └── style.css
├── .github/
│   └── workflows/
├── .env.example
├── index.html
└── package.json
```

## Local development

### Requirements

- Node.js 20+
- npm

### Installation

```bash
git clone https://github.com/mirandagyelyag-lang/Chucky-san-javier.git
cd Chucky-san-javier
npm install
npm run dev
```

For address search and geocoding, create a local environment file from `.env.example` and configure the required Geoapify API key.

## Production build

```bash
npm run build
npm run preview
```

## Ordering flow

1. Browse or search the menu.
2. Add products to the cart.
3. Choose pickup or delivery.
4. Enter contact information and, for delivery, a San Javier address.
5. Select a payment method.
6. Submit the order.
7. The business receives the order and confirms availability, timing and delivery with the customer.

Submitting the form sends an order request. It does not itself confirm that preparation has started.

## Project status

Active production project for a real local business. The application is deployed on Vercel and the `main` branch is the production source.

## Author

**Antonia Miranda**

Built as a real-world web product focused on mobile UX, ordering flow and practical business needs.

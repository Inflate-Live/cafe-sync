
# Restaurant Management System

A comprehensive restaurant management solution with kitchen display, order management, inventory tracking, and more.

![Restaurant Management System](https://example.com/screenshot.png)

## Features

- **Multi-branch Management**: Manage multiple restaurant locations from a single interface
- **Real-time Order Processing**: Instantly receive and process customer orders
- **Kitchen Display System**: Dedicated interface for kitchen staff to manage cooking workflow
- **Inventory Management**: Track stock levels and get low inventory alerts
- **Menu Management**: Easily update menu items, categories, and pricing
- **Receipt Generation**: Generate and print professional receipts
- **Customer Feedback**: Collect and analyze customer ratings and feedback
- **Sales Reporting**: Generate detailed reports on sales performance
- **Secure Authentication**: Role-based access control for different staff members

## Technology Stack

- React with TypeScript
- Tailwind CSS for styling
- React Query for server state management
- Server-side storage implementation (in-memory)
- PDF generation for receipts and reports

## Installation

Follow these steps to set up the project locally:

```bash
# Step 1: Clone the repository
git clone <repository-url>

# Step 2: Navigate to the project directory
cd restaurant-management-system

# Step 3: Install dependencies
npm install

# Step 4: Start the development server
npm run dev
```

The application should now be running at http://localhost:8080

## Project Structure

```
src/
├── components/         # UI components
│   ├── admin/          # Admin panel components
│   ├── layout/         # Layout components (header, footer, etc.)
│   ├── menu/           # Menu-related components
│   └── ui/             # Reusable UI components
├── context/            # React context for global state
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
├── pages/              # Main application pages
└── types/              # TypeScript type definitions
```

## Usage Instructions

### Kitchen Panel

1. Access the Kitchen Panel via the `/kitchen` route
2. Enter the kitchen password (configured in settings)
3. Select the appropriate branch
4. Process incoming orders by accepting, cooking, and completing them

### Admin Panel

1. Access the Admin Panel via the `/admin` route
2. Configure system settings including:
   - Branch information
   - Menu items and categories
   - Kitchen password
   - Receipt settings
   - Inventory thresholds

### Order Processing

1. Create new orders from the main interface
2. Select menu items, specify quantities
3. Enter customer information
4. Submit order to kitchen
5. Generate receipt once order is complete

## Data Storage

The system uses a server-side storage implementation with folder structure:

- `Storage-Confidential/orders`: All customer orders
- `Storage-Confidential/menu`: Menu items and categories
- `Storage-Confidential/branches`: Branch information
- `Storage-Confidential/settings`: System settings
- `Storage-Confidential/receipts`: Receipt data
- `Storage-Confidential/ratings`: Customer feedback
- `Storage-Confidential/inventory`: Inventory data

## Advanced Configuration

### Environment Variables

Create a `.env` file in the root directory:

```
# Server Configuration
SERVER_PORT=8080
SERVER_HOST=localhost

# Security
AUTH_SECRET=your-secret-key
KITCHEN_DEFAULT_PASSWORD=kitchen123

# Other Settings
DEFAULT_CURRENCY=USD
RECEIPT_FOOTER=Thank you for your business!
```

## Development

### Building for Production

```bash
# Generate production build
npm run build

# Preview production build
npm run preview
```

### Running Tests

```bash
# Run unit tests
npm test

# Run end-to-end tests
npm run e2e
```

## Troubleshooting

### Common Issues

1. **Orders not updating in real-time**
   - Check your network connection
   - Ensure the server is running properly
   - Try refreshing the page

2. **Receipt printing issues**
   - Verify printer connection
   - Check receipt template configuration
   - Ensure correct printer settings

3. **Authentication problems**
   - Clear browser cache and cookies
   - Reset passwords in the Admin Panel
   - Check for correct permission settings

## License

[MIT License](LICENSE)

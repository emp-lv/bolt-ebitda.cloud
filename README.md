# My Earnings - Revenue Transparency Platform

A modern web application that enables entrepreneurs and businesses to transparently share their revenue streams, build trust with their audience, and connect with other transparent businesses.

## 🚀 Features

- **Revenue Stream Visualization**: Interactive particle-based animations showing money flow
- **Profile Management**: Create personal and company profiles with detailed revenue information
- **Business Connections**: Connect with other transparent businesses and show revenue relationships
- **Privacy Controls**: Fine-grained control over what information is public vs private
- **Analytics**: Comprehensive insights into revenue patterns and growth trends
- **100% Free**: All features available at no cost, with optional sponsor tier for support

## 🛠 Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Styled Components
- **State Management**: Zustand with persistence
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Animations**: Canvas API with custom particle systems
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Deployment**: Netlify

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── auth/           # Authentication components
│   ├── stream/         # Revenue stream visualization
│   └── ...
├── pages/              # Route components
├── store/              # Zustand state management
│   ├── userStore.ts    # User authentication & account
│   ├── userProfilesStore.ts  # User's owned profiles
│   └── profilesStore.ts      # Global profile cache
├── database/           # Database schema & operations
│   ├── schema.ts       # TypeScript database types
│   ├── functions.ts    # Database operation functions
│   └── migrations/     # SQL migration files
├── types/              # TypeScript type definitions
├── lib/                # Utility libraries
└── hooks/              # Custom React hooks
```

## 🗄️ Database Schema

The application uses a comprehensive PostgreSQL schema with the following main tables:

- **users**: User accounts and authentication
- **profiles**: Revenue stream profiles (personal/company)
- **connections**: Revenue connections between profiles
- **profile_views**: Analytics for profile views
- **notifications**: User notification system
- **api_keys**: API access for integrations
- **audit_logs**: System audit trail

## 🔐 Security Features

- Row Level Security (RLS) on all tables
- User-based data access policies
- Public profile visibility controls
- Secure authentication with Supabase
- Data encryption in transit and at rest

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account (for database)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd my-earnings
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Add your Supabase credentials:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Set up the database:
```bash
# Run the migration files in your Supabase SQL editor
# 1. src/database/migrations/001_initial_schema.sql
# 2. src/database/migrations/002_sample_data.sql
```

5. Start the development server:
```bash
npm run dev
```

## 🏗️ Architecture

### State Management

The application uses a three-store architecture:

1. **userStore**: Manages user authentication and account data
2. **userProfilesStore**: Manages profiles owned by the current user
3. **profilesStore**: Global cache for discovered profiles

### Data Flow

1. User authenticates → `userStore` manages auth state
2. User data loads → `userProfilesStore` loads owned profiles  
3. External profiles viewed → `profilesStore` caches public profiles
4. Smart caching prevents unnecessary API calls

### Component Architecture

- **Pages**: Route-level components
- **Components**: Reusable UI components with clear separation of concerns
- **Hooks**: Custom hooks for common functionality
- **Stores**: Centralized state management with Zustand

## 🎨 Design System

- **Colors**: Comprehensive color system with primary, secondary, accent, and semantic colors
- **Typography**: Consistent typography scale with proper line heights
- **Spacing**: 8px grid system for consistent spacing
- **Components**: Reusable components following atomic design principles

## 📊 Analytics

The platform includes comprehensive analytics:

- Profile view tracking
- Revenue trend analysis
- Connection performance metrics
- Growth rate calculations
- Platform-wide statistics

## 🔌 API Integration

Ready for future integrations:

- Stripe revenue sync
- PayPal transaction import
- Custom API endpoints
- Webhook support for real-time updates

## 🚀 Deployment

The application is optimized for deployment on modern platforms:

1. **Build the application**:
```bash
npm run build
```

2. **Deploy to Netlify** (or your preferred platform):
```bash
# The dist/ folder contains the built application
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with [bolt.new](https://bolt.new) - AI-powered development platform
- Powered by [StackBlitz](https://stackblitz.com) WebContainers
- Created by [Emīls Pļavenieks](https://emp.lv)

## 📞 Support

- Email: emils@emp.lv
- Website: [emp.lv](https://emp.lv)
- LinkedIn: [emplv](https://www.linkedin.com/in/emplv/)

---

**Building transparency, one revenue stream at a time.** 🌟
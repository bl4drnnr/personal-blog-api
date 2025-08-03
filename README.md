# Personal Blog API

A comprehensive NestJS-based REST API for a personal blog platform with advanced content management, authentication, and SEO features. This API serves as the backend for a full-stack personal blog application with Angular SSR frontend integration.

## Table of Contents

1. [Overview](#overview)
2. [Technology Stack](#technology-stack)
3. [Prerequisites](#prerequisites)
4. [Installation & Setup](#installation--setup)
5. [Environment Variables](#environment-variables)
6. [Available Scripts](#available-scripts)
7. [Architecture](#architecture)
8. [API Endpoints](#api-endpoints)
9. [Authentication & Security](#authentication--security)
10. [Database Schema](#database-schema)
11. [Email System](#email-system)
12. [Testing](#testing)
13. [Deployment](#deployment)
14. [Configuration](#configuration)
15. [Frontend Integration](#frontend-integration)
16. [Troubleshooting](#troubleshooting)

## Overview

The Personal Blog API is a robust, scalable backend service built with modern technologies and best practices. It provides comprehensive content management capabilities, advanced security features, and seamless integration with server-side rendering (SSR) frontend applications.

### Key Features

- **🔐 Advanced Authentication**: JWT-based authentication with refresh tokens and TOTP-based 2FA
- **📝 Content Management**: Full CRUD operations for articles, projects, pages, and dynamic content
- **🎯 SEO Optimization**: Built-in SEO metadata, Open Graph tags, and structured data support
- **📧 Email Integration**: SendGrid-powered email system for contact forms and newsletters
- **🔄 Transaction Management**: Database transactions with custom decorators for data consistency
- **🐳 Docker Support**: Containerized development environment with Docker Compose
- **🧪 Testing**: Comprehensive test suite with Jest and E2E testing
- **📊 Database Seeding**: Mock data generation for development and testing

## Technology Stack

- **Framework**: [NestJS](https://nestjs.com/) 10.x with TypeScript
- **Database**: PostgreSQL with [Sequelize ORM](https://sequelize.org/)
- **Authentication**: JWT with refresh tokens + [Speakeasy](https://github.com/speakeasyjs/speakeasy) TOTP 2FA
- **Email Service**: [SendGrid](https://sendgrid.com/) integration
- **Cloud Storage**: AWS S3 integration
- **Security**: bcryptjs password hashing + AES encryption
- **Containerization**: Docker & Docker Compose
- **Process Management**: PM2 for production deployment
- **Testing**: Jest for unit testing, Supertest for E2E testing

## Prerequisites

- Node.js 18+ and npm
- Docker and Docker Compose
- PostgreSQL 13+ (if running without Docker)
- SendGrid account (for email functionality)
- AWS S3 bucket (for file storage)

## Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd personal-blog-api
```

### 2. Environment Configuration

Create environment files based on your needs:

```bash
# Copy and configure development environment
cp .env.development.example .env.development

# Copy and configure production environment  
cp .env.production.example .env.production
```

### 3. Development Setup

#### Option A: Docker Compose (Recommended)

```bash
# Start development environment with PostgreSQL
npm run api:dev

# Or build and start fresh containers
npm run api:dev:build

# Stop services
npm run api:dev:down
```

#### Option B: Local Development

```bash
# Install dependencies
npm install

# Ensure PostgreSQL is running locally
# Update .env.development with your local database credentials

# Start development server
npm run start:dev
```

### 4. Database Setup

```bash
# Seed database with mock data (after containers are running)
npm run database:dev:mock

# To remove mock data
npm run database:dev:mock:undo

# To completely wipe database
npm run database:dev:wipe
```

The API will be available at `http://localhost:3000` (or your configured API_PORT).

## Environment Variables

### Database Configuration
```bash
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USERNAME=your_username
POSTGRES_PASSWORD=your_password
POSTGRES_DATABASE=personal_blog
```

### API Configuration
```bash
API_PORT=3000
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your_refresh_secret_key
JWT_REFRESH_EXPIRES_IN=7d
```

### Security & Encryption
```bash
HASH_PASSWORD_ROUNDS=12
RECOVERY_ENCRYPTION_KEY_SIZE=256
RECOVERY_ENCRYPTION_ITERATIONS=100000
RECOVERY_ENCRYPTION_SALT=your_salt_here
RECOVERY_ENCRYPTION_IV=your_iv_here
```

### Email Configuration (SendGrid)
```bash
SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_FROM_EMAIL=noreply@yourdomain.com
SENDGRID_FROM_NAME="Your Blog Name"
```

### AWS S3 Configuration
```bash
AWS_S3_BUCKET_NAME=your_s3_bucket
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_S3_REGION=us-east-1
```

### Frontend Integration
```bash
FRONTEND_URL=http://localhost:4200
```

## Available Scripts

### Development Scripts

| Script | Description |
|--------|-------------|
| `npm run start:dev` | Start development server with watch mode |
| `npm run api:dev` | Run via Docker Compose for development |
| `npm run api:dev:build` | Build and run Docker Compose containers |
| `npm run api:dev:down` | Stop Docker Compose services |

### Production Scripts

| Script | Description |
|--------|-------------|
| `npm run api:build` | Build NestJS application for production |
| `npm run prod` | Start production server |
| `npm run api:process-start` | Start with PM2 process manager |
| `npm run api:restart` | Restart PM2 process |

### Database Scripts

| Script | Description |
|--------|-------------|
| `npm run database:dev:mock` | Seed database with mock data |
| `npm run database:dev:mock:undo` | Remove mock data |
| `npm run database:dev:wipe` | Clear all seeded data |

### Testing & Quality Scripts

| Script | Description |
|--------|-------------|
| `npm test` | Run Jest unit tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:cov` | Run tests with coverage report |
| `npm run test:e2e` | Run end-to-end tests |
| `npm run lint` | Run ESLint with automatic fixes |
| `npm run format` | Format code with Prettier and ESLint |

## Architecture

### Module Structure

The application follows a feature-based modular architecture:

```
src/
├── modules/              # Feature modules
│   ├── auth/            # Authentication & session management
│   ├── articles/        # Blog post management
│   ├── projects/        # Portfolio project showcase
│   ├── about/           # Professional experience & certifications
│   ├── security/        # Two-factor authentication (TOTP)
│   ├── newsletters/     # Email subscription management
│   ├── contact/         # Contact form handling
│   ├── home/           # Landing page content
│   ├── changelog/      # Platform changelog
│   ├── license/        # License page management
│   ├── privacy/        # Privacy policy management
│   ├── pages/          # Dynamic page management
│   ├── blog/           # Blog listing functionality
│   ├── site-config/    # Global site configuration
│   ├── users/          # User management
│   └── control/        # System health checks
├── models/              # Sequelize TypeScript models
├── dto/                 # Data Transfer Objects for validation
├── guards/              # Authentication guards
├── interceptors/        # Transaction interceptors
├── decorators/          # Custom decorators
├── exceptions/          # Custom exception classes
├── shared/              # Shared services and utilities
└── libs/                # Interfaces, enums, and utilities
```

### Key Design Patterns

- **Domain-Driven Design**: Feature-based modular organization
- **Repository Pattern**: Sequelize models with TypeScript interfaces
- **Transaction Management**: Global transaction interceptor with `@Transaction()` decorator
- **Exception Handling**: Custom exception classes for different error types
- **Interface-Driven Development**: Comprehensive TypeScript interfaces for type safety

## API Endpoints

### Public Endpoints

#### Content Retrieval
```http
# Articles
GET /posts                    # Get all published blog posts
GET /posts/slugs             # Get post slugs for route generation
GET /posts/:slug             # Get specific post by slug

# Projects  
GET /projects                # Get projects with pagination
GET /projects/slugs          # Get project slugs for route generation
GET /projects/:slug          # Get specific project by slug
GET /projects/featured       # Get featured projects

# Pages
GET /pages                   # Get all published pages
GET /pages/slugs            # Get page slugs for route generation
GET /pages/:slug            # Get specific page by slug

# Static Pages (SSR Data)
GET /home                   # Home page data
GET /about                  # About page data  
GET /blog                   # Blog listing page data
GET /changelog              # Changelog page data
GET /license                # License page data
GET /privacy                # Privacy policy page data

# Site Configuration
GET /site/config            # Public site configuration

# System
GET /control/health-check   # Health check endpoint
```

#### User Actions
```http
# Authentication
POST /auth/login            # User login
GET /auth/logout            # User logout
GET /auth/refresh           # Refresh access token

# Contact & Newsletter
POST /contact/contact       # Submit contact form
POST /newsletters/subscribe # Subscribe to newsletter
POST /newsletters/confirm-newsletters-subscription # Confirm subscription
POST /newsletters/unsubscribe-from-newsletters # Unsubscribe

# Password Recovery
POST /users/forgot-password # Send password reset email
```

### Protected Endpoints (Require Authentication)

#### User Management
```http
GET /users/user-info        # Get current user information
```

#### Content Management
```http
# Articles Management
GET /admin/posts            # Get admin posts list
POST /admin/posts           # Create new post
PUT /admin/posts/:id        # Update existing post
DELETE /admin/posts/:id     # Delete post
PUT /admin/posts/:id/publish # Toggle publish status

# Projects Management
GET /admin/projects         # Get admin projects list
POST /admin/projects        # Create new project
PUT /admin/projects/:id     # Update existing project
DELETE /admin/projects/:id  # Delete project

# Pages Management
GET /admin/pages            # Get all pages for admin
GET /admin/pages/:slug      # Get specific page for editing
POST /admin/pages           # Create new page
PUT /admin/pages/:id        # Update existing page
DELETE /admin/pages/:id     # Delete page
```

#### About Page Management
```http
# About Page
GET /admin/about            # Get admin about page data
POST /admin/about           # Create about page content
PUT /admin/about/:id        # Update about page content

# Experience Management
GET /admin/experiences      # Get all experiences
POST /admin/experiences     # Create experience entry
PUT /admin/experiences/:id  # Update experience entry
DELETE /admin/experiences/:id # Delete experience entry

# Certificate Management
GET /admin/certificates     # Get all certificates
POST /admin/certificates    # Create certificate entry
PUT /admin/certificates/:id # Update certificate entry
DELETE /admin/certificates/:id # Delete certificate entry
```

#### Specialized Page Management
```http
# Changelog Management
GET /admin/changelog/entries     # Get changelog entries
POST /admin/changelog/entries    # Create changelog entry
PUT /admin/changelog/entries/:id # Update changelog entry
DELETE /admin/changelog/entries/:id # Delete changelog entry
PUT /admin/changelog/page        # Update changelog page settings

# License Management
GET /admin/license/tiles         # Get license tiles
POST /admin/license/tiles        # Create license tile
PUT /admin/license/tiles/:id     # Update license tile
DELETE /admin/license/tiles/:id  # Delete license tile
PUT /admin/license/page          # Update license page settings

# Privacy Management
PUT /admin/privacy/page          # Update privacy page settings
POST /admin/privacy/create-sections     # Create privacy section
PUT /admin/privacy/update-sections/:id  # Update privacy section
DELETE /admin/privacy/delete-sections/:id # Delete privacy section
```

#### Site Configuration
```http
GET /admin/site/config      # Get admin site configuration
PUT /admin/site/config      # Update site configuration
```

#### Two-Factor Authentication
```http
POST /security/login-generate-2fa-qr # Generate 2FA QR during login
GET /security/generate-2fa-qr        # Generate 2FA QR for user
POST /security/login-verify-2fa      # Verify 2FA during login
POST /security/verify-2fa            # Verify 2FA for user
```

### API Response Formats

#### Success Response
```json
{
  "success": true,
  "data": {
    // Response data
  },
  "message": "Operation completed successfully"
}
```

#### Error Response
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description",
    "details": {}
  }
}
```

#### Paginated Response
```json
{
  "success": true,
  "data": {
    "items": [],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 100,
      "totalPages": 10
    }
  }
}
```

## Authentication & Security

### JWT Authentication

The API uses a dual-token JWT authentication system:

- **Access Token**: Short-lived (15 minutes) for API requests
- **Refresh Token**: Long-lived (7 days) stored in HTTP-only cookies
- **Custom Header**: `x-access-token: Bearer <token>`

### Two-Factor Authentication

- **TOTP-based 2FA** using Speakeasy library
- **QR Code generation** for authenticator apps
- **Time-based verification** with delta tolerance

### Security Features

- **Password Hashing**: bcryptjs with configurable salt rounds
- **AES Encryption**: CryptoJS for sensitive data encryption
- **Session Management**: Database-stored refresh tokens with rotation
- **Input Validation**: class-validator decorators on all DTOs
- **CORS Protection**: Configurable CORS for frontend integration

### Authentication Flow

1. **Login**: `POST /auth/login` with email/password
2. **2FA Check**: If enabled, requires TOTP verification
3. **Token Generation**: Returns access token + HTTP-only refresh token cookie
4. **API Requests**: Include `x-access-token: Bearer <token>` header
5. **Token Refresh**: `GET /auth/refresh` using refresh token cookie
6. **Logout**: `GET /auth/logout` clears refresh token

## Database Schema

### Core Models

#### User Management
- **User**: Core user authentication and profiles
- **UserSettings**: User-specific settings and 2FA tokens
- **Session**: JWT session management and refresh tokens

#### Content Management
- **Article**: Blog posts with SEO optimization
- **Project**: Portfolio projects showcase
- **Page**: Dynamic pages with custom content

#### Specialized Pages
- **AboutPage**: Professional experience & certifications
- **Experience**: Professional work history
- **Position**: Individual job positions
- **Certificate**: Professional certifications
- **HomePage**: Landing page configuration
- **ChangelogPage**: Platform changelog
- **ChangelogEntry**: Individual changelog entries
- **LicensePage**: License documentation
- **LicenseTile**: License information tiles
- **PrivacyPage**: Privacy policy management
- **PrivacySection**: Privacy policy sections
- **PrivacyContentItem**: Flexible privacy content

#### Utility Models
- **Newsletter**: Email subscription management
- **SiteConfig**: Global site configuration
- **FAQ**: Frequently asked questions
- **WhysSection**: "Why choose us" content

### Database Features

- **UUID Primary Keys**: All models use UUID for enhanced security
- **Timestamps**: Automatic `createdAt` and `updatedAt` management
- **JSONB Fields**: PostgreSQL JSONB for flexible content storage
- **SEO Fields**: Comprehensive meta tags, Open Graph, and structured data
- **Relationships**: Proper foreign key relationships and cascading
- **Constraints**: Unique constraints on slugs and email addresses

## Email System

The API includes a comprehensive email system powered by SendGrid:

### Email Templates
- **Contact Form**: Professional contact form notifications
- **Newsletter Subscription**: Welcome and confirmation emails
- **Password Recovery**: Secure password reset functionality

### Email Features
- **HTML Templates**: Professional email templates with branding
- **Template Service**: Centralized email template management
- **Error Handling**: Robust error handling for email delivery
- **Configuration**: Environment-based email configuration

### Email Endpoints
```http
POST /contact/contact                    # Sends contact notification
POST /newsletters/subscribe              # Sends subscription confirmation
POST /users/forgot-password             # Sends password reset email
```

## Testing

### Test Structure
```bash
src/
├── **/*.spec.ts            # Unit tests
test/
├── **/*.e2e-spec.ts       # End-to-end tests
└── jest-e2e.json          # E2E test configuration
```

### Running Tests
```bash
# Unit tests
npm test                    # Run all tests
npm run test:watch          # Watch mode
npm run test:cov           # With coverage

# E2E tests
npm run test:e2e           # End-to-end tests

# Debug tests
npm run test:debug         # Debug mode
```

### Test Configuration
- **Framework**: Jest with TypeScript support
- **Coverage**: Istanbul code coverage reports
- **E2E Testing**: Supertest for HTTP testing
- **Mocking**: Jest mocking capabilities
- **Test Environment**: Node.js test environment

## Deployment

### Development Deployment

#### Docker Compose (Recommended)
```bash
# Start development environment
npm run api:dev:build

# View logs
docker-compose logs -f

# Stop environment
npm run api:dev:down
```

#### Local Development
```bash
# Install dependencies
npm install

# Start development server
npm run start:dev
```

### Production Deployment

#### PM2 Process Manager
```bash
# Build application
npm run api:build

# Start with PM2
npm run api:process-start

# Restart PM2 process
npm run api:restart

# Monitor PM2 processes
pm2 monit

# View PM2 logs
pm2 logs personal-blog-api
```

#### Docker Production Setup
```bash
# Build production image
docker build -t personal-blog-api .

# Run production container
docker run -d \
  --name personal-blog-api \
  --env-file .env.production \
  -p 3000:3000 \
  personal-blog-api
```

### Environment Configuration

#### Development Environment
- Uses `.env.development` configuration
- Docker Compose with PostgreSQL container
- Hot reload enabled
- Debug logging enabled

#### Production Environment
- Uses `.env.production` configuration
- External PostgreSQL database
- PM2 process management
- Optimized build and logging

### Health Monitoring
```bash
# Health check endpoint
GET /control/health-check

# Response format
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 12345
}
```

## Configuration

### Environment Files
- `.env.development` - Development configuration
- `.env.production` - Production configuration

### Key Configuration Options

#### Database Configuration
```bash
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USERNAME=username
POSTGRES_PASSWORD=password
POSTGRES_DATABASE=personal_blog
```

#### JWT Configuration
```bash
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your_refresh_secret_here
JWT_REFRESH_EXPIRES_IN=7d
```

#### Security Configuration
```bash
HASH_PASSWORD_ROUNDS=12
RECOVERY_ENCRYPTION_KEY_SIZE=256
RECOVERY_ENCRYPTION_ITERATIONS=100000
```

#### Email Configuration
```bash
SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_FROM_EMAIL=noreply@yourdomain.com
SENDGRID_FROM_NAME="Your Blog Name"
```

#### AWS S3 Configuration
```bash
AWS_S3_BUCKET_NAME=your_s3_bucket
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_S3_REGION=us-east-1
```

## Frontend Integration

### SSR Data Endpoints
The API provides specialized endpoints for Angular SSR integration:

```http
GET /home          # Home page data with featured content
GET /about         # About page with experience & certificates
GET /blog          # Blog listing with pagination
GET /changelog     # Changelog with entries
GET /license       # License page with tiles
GET /privacy       # Privacy policy with sections
```

### Route Generation
```http
GET /posts/slugs    # Blog post slugs for route generation
GET /projects/slugs # Project slugs for route generation
GET /pages/slugs    # Page slugs for route generation
```

### SEO Integration
All public endpoints include:
- **Meta Tags**: Title, description, keywords
- **Open Graph**: Social media optimization
- **Structured Data**: JSON-LD for search engines
- **Canonical URLs**: SEO-friendly URL structure

## Troubleshooting

### Common Issues

#### Database Connection Issues
```bash
# Check PostgreSQL is running
docker-compose ps

# Check database logs
docker-compose logs db

# Restart database container
docker-compose restart db
```

#### Email Delivery Issues
```bash
# Verify SendGrid API key
curl -X "GET" "https://api.sendgrid.com/v3/user/account" \
  -H "Authorization: Bearer YOUR_API_KEY"

# Check email service logs
docker-compose logs api | grep email
```

#### Authentication Issues
```bash
# Verify JWT configuration
echo $JWT_SECRET
echo $JWT_REFRESH_SECRET

# Check token expiration settings
echo $JWT_EXPIRES_IN
echo $JWT_REFRESH_EXPIRES_IN
```

### Debug Mode
```bash
# Start in debug mode
npm run start:debug

# Debug tests
npm run test:debug
```

### Logging
```bash
# View application logs
docker-compose logs -f api

# View database logs
docker-compose logs -f db

# PM2 logs (production)
pm2 logs personal-blog-api
```

## Related Projects

- **Frontend**: [Personal Blog Frontend](../personal-blog-front) - Angular SSR application

---

**Built with ❤️ using NestJS, TypeScript, and modern web technologies.**
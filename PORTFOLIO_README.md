# Portfolio Management System

This portfolio management system allows users to create, read, update, and delete portfolio items with image upload functionality.

## Features

- ✅ **CRUD Operations**: Create, Read, Update, Delete portfolio items
- ✅ **Image Upload**: Upload images to Supabase storage bucket
- ✅ **Form Validation**: Client-side and server-side validation
- ✅ **User Authentication**: Clerk integration for user management
- ✅ **Toast Notifications**: User feedback with react-hot-toast
- ✅ **Responsive Design**: DaisyUI components with Tailwind CSS
- ✅ **Type Safety**: Full TypeScript implementation

## API Endpoints

### Portfolio Management
- `GET /api/portfolio` - Fetch all portfolio items for current user
- `POST /api/portfolio` - Create new portfolio item
- `PUT /api/portfolio` - Update existing portfolio item
- `DELETE /api/portfolio?id={id}` - Delete portfolio item

### Image Upload
- `POST /api/portfolio/upload-image` - Upload image to portfolio bucket

## Database Schema

The system uses a `portfolio` table with the following structure:

```sql
CREATE TABLE portfolio (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT NOT NULL,
  location VARCHAR(100) NOT NULL,
  user_id UUID NOT NULL REFERENCES users(public_id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Setup Instructions

### 1. Database Setup
Run the SQL commands in `database-schema.sql` in your Supabase SQL editor to create the necessary tables and policies.

### 2. Environment Variables
Ensure you have the following environment variables set:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

### 3. Install Dependencies
```bash
npm install react-hot-toast
```

### 4. Storage Bucket
The system automatically creates a `portfolio` storage bucket in Supabase for image uploads.

## Usage

### Creating Portfolio Items
1. Click the "Add Portfolio Item" button
2. Fill in the required fields:
   - Title (max 100 characters)
   - Description (max 500 characters)
   - Upload an image (JPEG, PNG, WebP, max 5MB)
   - Location (max 100 characters)
3. Click "Create Portfolio Item"

### Editing Portfolio Items
1. Click the "Edit" button on any portfolio item
2. Modify the fields as needed
3. Click "Update Portfolio Item"

### Deleting Portfolio Items
1. Click the "Delete" button on any portfolio item
2. Confirm the deletion in the popup

## Validation Rules

### Client-side Validation
- All fields are required
- Title: max 100 characters
- Description: max 500 characters
- Location: max 100 characters
- Image: JPEG, PNG, WebP formats only, max 5MB

### Server-side Validation
- Same validation rules as client-side
- User authentication required
- User ownership verification for updates/deletes

## Security Features

- **Row Level Security (RLS)**: Users can only access their own portfolio items
- **Authentication**: Clerk integration for user management
- **File Validation**: File type and size validation
- **User Ownership**: Users can only modify their own items

## Error Handling

The system includes comprehensive error handling:
- Form validation errors displayed inline
- Toast notifications for success/error feedback
- Graceful handling of network errors
- User-friendly error messages

## Dependencies

- `@clerk/nextjs`: User authentication
- `@supabase/supabase-js`: Database and storage
- `react-hot-toast`: Toast notifications
- `lucide-react`: Icons
- `daisyui`: UI components
- `tailwindcss`: Styling

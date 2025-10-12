# Messages Page Documentation

## Overview

The Messages page is a real-time messaging interface that allows users to communicate with each other. It features a responsive design with a conversation sidebar and chat window, supporting both desktop and mobile views.

## Features

### Core Functionality
- **Conversation List**: View all active conversations with other users
- **Real-time Messaging**: Send and receive messages in real-time
- **User Search**: Find and start new conversations by searching users
- **Read Status**: See when messages have been read by recipients
- **Mobile Responsive**: Optimized for both desktop and mobile devices

### User Interface
- **Sidebar Navigation**: List of conversations with user avatars and last messages
- **Chat Window**: Full-featured messaging interface with message bubbles
- **User Profiles**: View detailed user information within conversations
- **Loading States**: Skeleton loaders for better user experience
- **Error Handling**: Comprehensive error states and user feedback

## API Endpoints

### 1. Get Conversations
**Endpoint**: `GET /api/conversations`

**Purpose**: Fetches all conversations for the current user

**Response Structure**:
```typescript
{
  conversations: Array<{
    id: string;
    otherUser: {
      public_id: string;
      name: string;
      email: string;
      phoneNumber: string;
      avatarUrl: string | null;
      location: string;
    };
    lastMessage: string;
    timestamp: string;
    unreadCount: number;
  }>;
  count: number;
}
```

### 2. Get Messages
**Endpoint**: `GET /api/messages/[user_id]`

**Purpose**: Fetches all messages between current user and specified user

**Response Structure**:
```typescript
{
  messages: Array<{
    id: string;
    content: string;
    created_at: string;
    is_read: boolean;
    sender: User;
    receiver: User;
  }>;
}
```

### 3. Send Message
**Endpoint**: `POST /api/messages`

**Purpose**: Sends a new message to a user

**Request Body**:
```typescript
{
  sender_id: string;
  receiver_id: string;
  content: string;
}
```

## Component Structure

### Main Components

1. **MessagesPage** (`/app/messages/page.tsx`)
   - Main container component
   - Manages state and data fetching
   - Handles URL parameters for direct conversation links

2. **ChatWindow** (`/components/messages/ChatWindow.tsx`)
   - Displays conversation messages
   - Handles message sending
   - Shows user information modal

3. **ConversationItem** (`/components/messages/ConversationItem.tsx`)
   - Individual conversation list item
   - Shows user info and last message preview

4. **NewChatForm** (`/components/messages/NewChatForm.tsx`)
   - User search and selection interface
   - Creates new conversations

5. **UserInfoModal** (`/components/messages/UserInfoModal.tsx`)
   - Displays detailed user profile information

### Loading Components

- **ConversationListSkeleton**: Loading state for conversation list
- **MessagesSkeleton**: Loading state for message history

## Data Flow

### Conversation Flow
1. User loads messages page
2. Fetch current user data and conversations
3. Display conversation list with last messages
4. User selects conversation or starts new one
5. Fetch message history for selected conversation
6. Send/receive messages in real-time

### New Conversation Flow
1. User clicks "New Conversation"
2. Search for users by email or phone number
3. Select user from search results
4. Create new conversation and open chat window

## State Management

### Key State Variables
- `conversations`: List of user conversations
- `selectedChat`: Currently active conversation
- `messages`: Messages for current conversation
- `currentUser`: Authenticated user data
- `showNewChat`: New conversation form visibility
- `loading`: Data loading states

## Error Handling

### Common Error Scenarios
- **Authentication failures**: Redirect to login
- **Network errors**: Retry mechanisms and user feedback
- **User not found**: Clear error messages in search
- **Message sending failures**: Temporary message states and retry options

## Performance Optimizations

- **Lazy Loading**: Components load as needed
- **Skeleton Screens**: Better perceived performance
- **Efficient Queries**: Optimized database queries
- **Message Caching**: Temporary message states for instant feedback

## Mobile Considerations

- **Responsive Design**: Adapts to screen size
- **Touch Interactions**: Optimized for touch devices
- **Back Navigation**: Mobile-friendly navigation patterns
- **Viewport Optimization**: Proper height calculations for mobile browsers

## Usage Examples

### Starting a New Conversation
```typescript
// Programmatically open chat with user
router.push('/messages?user=user_public_id');

// Or use the NewChatForm component
<NewChatForm onCreate={handleNewChat} onCancel={handleCancel} />
```

### Sending a Message
```typescript
const success = await handleSendMessage(content, receiverId);
if (success) {
  // Update UI accordingly
  setMessages(prev => [...prev, newMessage]);
}
```

## Dependencies

### Required APIs
- User authentication endpoint (`/api/user`)
- Conversations endpoint (`/api/conversations`)
- Messages endpoint (`/api/messages/[user_id]`)
- User search endpoint (`/api/user/search`)

### External Dependencies
- **Supabase**: Database operations and real-time features
- **Next.js**: Routing and API routes
- **Lucide React**: UI icons
- **Tailwind CSS**: Styling and responsive design

## Security Considerations

- **Authentication**: All endpoints require valid user session
- **Authorization**: Users can only access their own conversations
- **Input Validation**: Message content sanitization
- **Rate Limiting**: Consider implementing for message sending

## Future Enhancements

- **Real-time Updates**: WebSocket integration for live messaging
- **File Attachments**: Support for image and file sharing
- **Message Reactions**: Like and emoji reactions
- **Group Chats**: Multi-user conversations
- **Message Search**: Search within conversations
- **Push Notifications**: Desktop and mobile notifications

This messaging system provides a robust foundation for user communication with room for expansion into more advanced features as needed.
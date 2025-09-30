import { NextRequest, NextResponse } from 'next/server';

interface User {
  public_id: string;
  name: string;
  avatarUrl: string | null;
  location: string | null;
  coreSkills: string[] | null;
  experience: string | null;
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    console.log('=== USER/NETWORK API CALLED ===');
    
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type') || 'network';
    const search = searchParams.get('search') || '';
    const baseUrl = request.nextUrl.origin;

    console.log('Request params - type:', type, 'search:', search);

    // Get current user
    const userResponse = await fetch(`${baseUrl}/api/user`);
    if (!userResponse.ok) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const currentUser = await userResponse.json();
    console.log('Current user payload from /api/user:', currentUser);

    // ✅ fixed extraction
    const currentUserId = currentUser?.user?.public_id;
    console.log('Resolved currentUserId:', currentUserId);

    if (!currentUserId) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    let users: User[] = [];

    if (type === 'network') {
      users = await getNetworkUsers(currentUserId, baseUrl);
    } else if (type === 'requests') {
      users = await getPendingRequests(currentUserId, baseUrl);
    } else if (type === 'discover') {
      if (search) {
        const searchResponse = await fetch(`${baseUrl}/api/user/search?q=${encodeURIComponent(search)}`);
        if (searchResponse.ok) {
          const searchData = await searchResponse.json();
          users = searchData.users || [];
        }
      } else {
        users = await getDiscoverUsers(currentUserId, baseUrl);
      }
    }

    return NextResponse.json(users);
  } catch (error) {
    console.error('Network API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function getNetworkUsers(currentUserId: string, baseUrl: string): Promise<User[]> {
  const response = await fetch(`${baseUrl}/api/network?type=connections&userId=${currentUserId}`);
  if (!response.ok) return [];
  const connections = await response.json();

  const users = await Promise.all(
    connections.map(async (connection: any) => {
      const userResponse = await fetch(`${baseUrl}/api/user/${connection.target_user_id}`);
      return userResponse.ok ? await userResponse.json() : null;
    })
  );

  return users.filter((user): user is User => user !== null);
}

async function getPendingRequests(currentUserId: string, baseUrl: string): Promise<User[]> {
  const response = await fetch(`${baseUrl}/api/network?type=requests&userId=${currentUserId}`);
  if (!response.ok) return [];
  const requests = await response.json();

  const users = await Promise.all(
    requests.map(async (request: any) => {
      const userResponse = await fetch(`${baseUrl}/api/user/${request.user_id}`);
      if (userResponse.ok) {
        const user = await userResponse.json();
        return { ...user, requestId: request.id }; // attach requestId for frontend
      }
      return null;
    })
  );

  return users.filter((user): user is User => user !== null);
}

async function getDiscoverUsers(currentUserId: string, baseUrl: string): Promise<User[]> {
  const response = await fetch(`${baseUrl}/api/network?type=discover&userId=${currentUserId}`);
  if (!response.ok) return [];
  const suggestedUsers = await response.json();

  const users = await Promise.all(
    suggestedUsers.map(async (suggestion: any) => {
      const userResponse = await fetch(`${baseUrl}/api/user/${suggestion.user_id}`);
      return userResponse.ok ? await userResponse.json() : null;
    })
  );

  return users.filter((user): user is User => user !== null);
}

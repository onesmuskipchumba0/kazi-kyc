import { NextRequest, NextResponse } from 'next/server';

interface User {
  publicId: string;
  name: string;
  avatarUrl: string | null;
  location: string | null;
  coreSkills: string[] | null;
  experience: string | null;
}

interface TransformedUser {
  id: string;
  name: string;
  role: string;
  location: string;
  rating: number;
  experience: string;
  connections: string;
  skills: string[];
  initials: string;
  image?: string;
  requestId?: string;
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type') || 'network';
    const search = searchParams.get('search') || '';
    const baseUrl = request.nextUrl.origin;

    // Get current user from the API endpoint
    const userResponse = await fetch(`${baseUrl}/api/user`, {
      headers: {
        'Cookie': request.headers.get('Cookie') || '',
      },
    });

    if (!userResponse.ok) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const currentUser = await userResponse.json();

    let users: User[] = [];

    // Get users based on the tab type
    if (type === 'network') {
      users = await getNetworkUsers(currentUser.publicId, baseUrl);
    } else if (type === 'requests') {
      users = await getPendingRequests(currentUser.publicId, baseUrl);
    } else if (type === 'discover') {
      users = await getDiscoverUsers(currentUser.publicId, baseUrl);
    }

    // Apply search filter
    if (search) {
      users = users.filter(user => 
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.location?.toLowerCase().includes(search.toLowerCase()) ||
        user.coreSkills?.some((skill: string) => 
          skill.toLowerCase().includes(search.toLowerCase())
        )
      );
    }

    // Transform data to match frontend expectations
    const transformedUsers: TransformedUser[] = users.map(user => ({
      id: user.publicId,
      name: user.name,
      role: getRoleFromSkills(user.coreSkills),
      location: user.location || 'Not specified',
      rating: 4.5,
      experience: user.experience || 'Experience not specified',
      connections: '0 mutual connections', // You can implement this later
      skills: user.coreSkills || [],
      initials: getInitials(user.name),
      image: user.avatarUrl || undefined
    }));

    return NextResponse.json(transformedUsers);
  } catch (error) {
    console.error('Network API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Get users in current user's network from your network table
async function getNetworkUsers(currentUserId: string, baseUrl: string): Promise<User[]> {
  try {
    // Fetch network connections from your network table API
    const response = await fetch(`${baseUrl}/api/network?type=connections&userId=${currentUserId}`);
    if (!response.ok) return [];
    
    const connections = await response.json();
    
    // Fetch user details for each connection
    const users = await Promise.all(
      connections.map(async (connection: any) => {
        const userResponse = await fetch(`${baseUrl}/api/user/${connection.targetUserId}`);
        if (userResponse.ok) {
          return await userResponse.json();
        }
        return null;
      })
    );
    
    return users.filter((user): user is User => user !== null);
  } catch (error) {
    console.error('Error fetching network users:', error);
    return [];
  }
}

// Get pending connection requests from your network table
async function getPendingRequests(currentUserId: string, baseUrl: string): Promise<User[]> {
  try {
    // Fetch pending requests from your network table API
    const response = await fetch(`${baseUrl}/api/network?type=requests&userId=${currentUserId}`);
    if (!response.ok) return [];
    
    const requests = await response.json();
    
    // Fetch user details for each request
    const users = await Promise.all(
      requests.map(async (request: any) => {
        const userResponse = await fetch(`${baseUrl}/api/user/${request.userId}`);
        if (userResponse.ok) {
          const user = await userResponse.json();
          return { ...user, requestId: request.id };
        }
        return null;
      })
    );
    
    return users.filter((user): user is User => user !== null);
  } catch (error) {
    console.error('Error fetching pending requests:', error);
    return [];
  }
}

// Discover users not in network
async function getDiscoverUsers(currentUserId: string, baseUrl: string): Promise<User[]> {
  try {
    // Fetch suggested users from your network table API
    const response = await fetch(`${baseUrl}/api/network?type=discover&userId=${currentUserId}`);
    if (!response.ok) return [];
    
    const suggestedUsers = await response.json();
    
    // Fetch user details for each suggested user
    const users = await Promise.all(
      suggestedUsers.map(async (suggestion: any) => {
        const userResponse = await fetch(`${baseUrl}/api/user/${suggestion.userId}`);
        if (userResponse.ok) {
          return await userResponse.json();
        }
        return null;
      })
    );
    
    return users.filter((user): user is User => user !== null);
  } catch (error) {
    console.error('Error fetching discover users:', error);
    return [];
  }
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function getRoleFromSkills(skills: string[] | null): string {
  if (!skills || skills.length === 0) return 'Professional';
  return skills[0] || 'Professional';
}
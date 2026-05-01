/// <reference types="vite/client" />

// =============================================
// SELISE IAM BLOCK — Authentication
// =============================================
class SeliseIAM {
  async authenticate(email: string, password: string): Promise<any> {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'https://api.seliseblocks.com';
    const projectKey = import.meta.env.VITE_X_BLOCKS_KEY || '';

    const payload = new URLSearchParams();
    payload.append('grant_type', 'password');
    payload.append('username', email);
    payload.append('password', password);

    const response = await fetch(`${baseUrl}/idp/v1/Authentication/Token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'x-blocks-key': projectKey,
      },
      body: payload
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error_description || err.message || 'Authentication failed. Check your credentials.');
    }

    const data = await response.json();

    const user = {
      id: data.sub || data.username || email,
      email: data.email || email,
      name: `${data.firstName || ''} ${data.lastName || ''}`.trim() || email.split('@')[0],
      username: data.username || email.split('@')[0],
      token: data.access_token,
      refreshToken: data.refresh_token
    };

    localStorage.setItem('selise_auth_token', data.access_token);
    localStorage.setItem('selise_refresh_token', data.refresh_token);
    localStorage.setItem('selise_user_profile', JSON.stringify(user));
    return user;
  }

  async authenticateWithOIDC(code: string, redirectUri: string): Promise<any> {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'https://api.seliseblocks.com';
    const projectKey = import.meta.env.VITE_X_BLOCKS_KEY || '';
    const clientId = import.meta.env.VITE_BLOCKS_OIDC_CLIENT_ID || '';

    const payload = new URLSearchParams();
    payload.append('grant_type', 'authorization_code');
    payload.append('client_id', clientId);
    payload.append('redirect_uri', redirectUri);
    payload.append('code', code);

    const response = await fetch(`${baseUrl}/idp/v1/Authentication/Token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'x-blocks-key': projectKey,
      },
      body: payload
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error_description || 'OIDC Authentication failed');
    }

    const data = await response.json();

    const user = {
      id: data.sub || data.username || data.email || 'oidc_user',
      email: data.email || 'unknown',
      name: `${data.firstName || ''} ${data.lastName || ''}`.trim() || data.username || 'User',
      username: data.username || data.email?.split('@')[0] || 'user',
      token: data.access_token,
      refreshToken: data.refresh_token
    };

    localStorage.setItem('selise_auth_token', data.access_token);
    localStorage.setItem('selise_refresh_token', data.refresh_token);
    localStorage.setItem('selise_user_profile', JSON.stringify(user));
    return user;
  }

  getOIDCUrl(): string {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'https://api.seliseblocks.com';
    const projectKey = import.meta.env.VITE_X_BLOCKS_KEY || '';
    const redirectUri = import.meta.env.VITE_BLOCKS_OIDC_REDIRECT_URI || `${window.location.origin}/oidc`;
    return `${baseUrl}/idp/v1/Authentication/ExternalLogin?provider=Google&X-Blocks-Key=${projectKey}&redirectUri=${encodeURIComponent(redirectUri)}`;
  }

  logout() {
    localStorage.removeItem('selise_auth_token');
    localStorage.removeItem('selise_refresh_token');
    localStorage.removeItem('selise_user_profile');
  }

  getCurrentUser(): any | null {
    const saved = localStorage.getItem('selise_user_profile');
    try { return saved ? JSON.parse(saved) : null; } catch { return null; }
  }
}

// =============================================
// SELISE DATA GATEWAY — GraphQL (PascalCase fields)
// =============================================
class SeliseDataGateway {
  private getHeaders() {
    const token = localStorage.getItem('selise_auth_token');
    const projectKey = import.meta.env.VITE_X_BLOCKS_KEY || '';
    return {
      'Content-Type': 'application/json',
      'x-blocks-key': projectKey,
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
  }

  async query<T>(entityName: string, filter?: any): Promise<T> {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'https://api.seliseblocks.com';
    const projectSlug = import.meta.env.VITE_PROJECT_SLUG || '';

    // Selise DGS uses PascalCase field names matching the schema
    const query = `
      query GetData($filter: ${entityName}_bool_exp) {
        ${entityName}(where: $filter) {
          UserId
          Username
          IsPublished
          RootNode
        }
      }
    `;

    const response = await fetch(
      `${baseUrl}/dgs/v1/${projectSlug}/graphql`,
      {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ query, variables: { filter } })
      }
    );
    const json = await response.json();
    if (json.errors) {
      console.warn('GraphQL errors:', json.errors);
    }
    return json.data as T;
  }

  async mutate(entityName: string, payload: any): Promise<any> {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'https://api.seliseblocks.com';
    const projectSlug = import.meta.env.VITE_PROJECT_SLUG || '';

    const mutation = `
      mutation UpsertData($object: ${entityName}_insert_input!) {
        insert_${entityName}_one(
          object: $object,
          on_conflict: {
            constraint: ${entityName}_UserId_key,
            update_columns: [IsPublished, RootNode, Username]
          }
        ) {
          UserId
          Username
        }
      }
    `;

    const response = await fetch(
      `${baseUrl}/dgs/v1/${projectSlug}/graphql`,
      {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ query: mutation, variables: { object: payload } })
      }
    );
    const json = await response.json();
    if (json.errors) {
      console.warn('GraphQL mutation errors:', json.errors);
    }
    return json.data;
  }
}

// =============================================
// SELISE MEDIA BLOCK — File Upload
// =============================================
class SeliseMedia {
  async uploadAsset(file: File): Promise<string> {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'https://api.seliseblocks.com';
    const projectKey = import.meta.env.VITE_X_BLOCKS_KEY || '';
    const token = localStorage.getItem('selise_auth_token') || '';

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${baseUrl}/mds/v1/Media`, {
        method: 'POST',
        headers: {
          'x-blocks-key': projectKey,
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) return URL.createObjectURL(file);
      const data = await response.json();
      return data.url || data.fileUrl || data.path || URL.createObjectURL(file);
    } catch {
      return URL.createObjectURL(file);
    }
  }
}

export const iam = new SeliseIAM();
export const dg = new SeliseDataGateway();
export const media = new SeliseMedia();

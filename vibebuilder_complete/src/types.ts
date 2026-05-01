/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface User {
  id: string;
  email: string;
  token: string;
}

export interface ComponentProps {
  id: string;
  type: 'hero' | 'text' | 'gallery' | 'contact' | 'navbar' | 'footer';
  content: any;
  styles?: Record<string, string>;
}

export interface Page {
  id: string;
  name: string;
  slug: string;
  components: ComponentProps[];
}

export interface Website {
  id: string;
  userId: string;
  name: string;
  description?: string;
  pages: Page[];
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export type BlockType = ComponentProps['type'];

import { Models } from "node-appwrite";

/**
 * Interface para as propriedades de navegação móvel
 * @interface MobileNavigationProps
 */
export interface MobileNavigationProps {
  $id: string;
  accountId: string;
  fullName: string;
  avatar: string;
  email: string;
}

/**
 * Interface para as propriedades da barra lateral
 * @interface SidebarProps
 */
export interface SidebarProps {
  fullName: string;
  avatar: string;
  email: string;
}

/**
 * Interface para usuário
 * @interface User
 */
export interface User {
  id: string;
  name: string;
  email: string;
  imageUrl?: string;
  accountId: string;
  $id?: string;
  $collectionId?: string;
  $databaseId?: string;
  $createdAt?: string;
  $updatedAt?: string;
  $permissions?: string[];
}

/**
 * Interface para as propriedades do hook useUser
 * @interface UseUserProps
 */
export interface UseUserProps {
  userId: string;
  accountId: string;
}

/**
 * Type guard para verificar se um objeto é um usuário válido
 * @param {unknown} user - O objeto a ser verificado
 * @returns {boolean} - Verdadeiro se for um usuário válido
 */
export function isUser(user: unknown): user is User {
  if (!user || typeof user !== 'object') return false;
  
  const requiredProps = ['id', 'name', 'email', 'accountId'];
  return requiredProps.every(prop => prop in user);
}

/**
 * Interface para resposta da API de usuário
 * @interface UserApiResponse
 */
export interface UserApiResponse {
  user: Models.User<User>;
  session?: Models.Session;
} 
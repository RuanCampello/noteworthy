/**
 * An array of routes that are acessible to anyone.
 * Those routes do not require any authentication.
 * @type {string[]}
 */

export const publicRoutes: string[] = [''];

/**
 * An array of routes that are used for authentication.
 * @type {string[]}
 */

export const authRoutes: string[] = ['/register', '/login', '/error', '/reset', '/new-password'];

/**
 * The prefix for API authentication routes.
 * @type {string}
 */

export const apiAuthPrefix: string = '/api/auth';

/**
 * The default redirect path after login.
 * @type {string}
 */

export const DEFAULT_REDIRECT: string = '/';

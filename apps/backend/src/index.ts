/**
 * VibeSpace Backend Service Entrypoint
 * Ready for REST API, WebSockets, Supabase Webhooks or custom microservices.
 */

export const serverConfig = {
  port: process.env.PORT || 4000,
  env: process.env.NODE_ENV || 'development'
};

console.log(`[VibeSpace Backend] Initialized placeholder service in ${serverConfig.env} mode on port ${serverConfig.port}`);

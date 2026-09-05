// src/core/database/database-error-handler.ts
export function handleDatabaseError<T>(data: T | null, error: unknown, contextMessage: string): T {
    if (error || !data) {
        throw new Error(`[DATABASE_ERROR] ${contextMessage}: ${error ? String(error) : 'No data returned'}`);
    }
    return data;
}
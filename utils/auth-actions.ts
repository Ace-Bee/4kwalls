'use server'

import { supabaseAdmin } from './supabase-admin';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function deleteAccount(accessToken: string) {
    try {
        // 1. Verify the user using the access token
        // We create a temporary client just to verify the token
        const supabase = createClient(supabaseUrl, supabaseAnonKey, {
            auth: {
                autoRefreshToken: false,
                persistSession: false,
            }
        });

        const { data: { user }, error: userError } = await supabase.auth.getUser(accessToken);

        if (userError || !user) {
            console.error('SERVER ACTION: Token verification failed:', userError);
            throw new Error('Unauthorized');
        }

        console.log(`SERVER ACTION: Deleting user ${user.id}`);

        // 2. Safety Step: Explicitly remove favorites (though cascade might handle it, this is requested)
        const { error: deleteFavError } = await supabaseAdmin
            .from('user_favorites')
            .delete()
            .eq('user_id', user.id);

        if (deleteFavError) {
            console.error('SERVER ACTION: Failed to delete favorites:', deleteFavError);
            // We continue to try to delete the user anyway
        }

        // 3. Delete the user from Auth (This wipes everything if cascaded properly)
        const { error: deleteUserError } = await supabaseAdmin.auth.admin.deleteUser(user.id);

        if (deleteUserError) {
            console.error('SERVER ACTION: Failed to delete user:', deleteUserError);
            throw new Error('Failed to delete account');
        }

        return { success: true };
    } catch (error: unknown) {
        console.error('SERVER ACTION: deleteAccount error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return { success: false, error: errorMessage };
    }
}

export async function deleteAllFavorites(accessToken: string) {
    try {
        const supabase = createClient(supabaseUrl, supabaseAnonKey, {
            auth: {
                autoRefreshToken: false,
                persistSession: false,
            }
        });

        const { data: { user }, error: userError } = await supabase.auth.getUser(accessToken);

        if (userError || !user) {
            throw new Error('Unauthorized');
        }

        const { error } = await supabaseAdmin
            .from('user_favorites')
            .delete()
            .eq('user_id', user.id);

        if (error) throw error;

        return { success: true };
    } catch (error: unknown) {
        console.error('Failed to delete favorites:', error);
        return { success: false, error: 'Failed to delete favorites' };
    }
}

import { getSupabaseAdmin } from '../../db/client';

export const TradeRepository = {
    async create(tradeData: Record<string, any>) {
        const supabase = getSupabaseAdmin();
        const { data, error } = await supabase
            .from('trades')
            .insert(tradeData)
            .select()
            .single();

        if (error) {
            throw new Error(`Database error creating trade: ${error.message}`);
        }
        return data;
    },

    async findByIdAndOwner(id: string, userId: string) {
        const supabase = getSupabaseAdmin();
        const { data, error } = await supabase
            .from('trades')
            .select('*')
            .eq('id', id)
            .eq('user_id', userId)
            .maybeSingle();

        if (error) {
            throw new Error(`Database error fetching trade: ${error.message}`);
        }
        return data;
    },

    async update(id: string, userId: string, updateData: Record<string, any>) {
        const supabase = getSupabaseAdmin();
        const { data, error } = await supabase
            .from('trades')
            .update(updateData)
            .eq('id', id)
            .eq('user_id', userId)
            .select()
            .single();

        if (error) {
            throw new Error(`Database error updating trade: ${error.message}`);
        }
        return data;
    },

    async delete(id: string, userId: string): Promise<boolean> {
        const supabase = getSupabaseAdmin();
        const { error, count } = await supabase
            .from('trades')
            .delete({ count: 'exact' })
            .eq('id', id)
            .eq('user_id', userId);

        if (error) {
            throw new Error(`Database error deleting trade: ${error.message}`);
        }
        return count !== null && count > 0;
    },

    async findAllByOwner(userId: string, options: {
        page: number;
        pageSize: number;
        symbol?: string;
        side?: string;
        outcome?: string;
        status?: 'OPEN' | 'CLOSED';
        from?: string;
        to?: string;
        sortBy: string;
        sortOrder: 'asc' | 'desc';
    }) {
        const supabase = getSupabaseAdmin();
        let query = supabase
            .from('trades')
            .select('*', { count: 'exact' })
            .eq('user_id', userId);

        if (options.symbol) {
            query = query.eq('symbol', options.symbol);
        }
        if (options.side) {
            query = query.eq('side', options.side);
        }
        if (options.outcome) {
            query = query.eq('outcome', options.outcome);
        }
        if (options.status) {
            if (options.status === 'OPEN') {
                query = query.is('exit_timestamp', null);
            } else if (options.status === 'CLOSED') {
                query = query.not('exit_timestamp', 'is', null);
            }
        }
        if (options.from) {
            query = query.gte('entry_timestamp', options.from);
        }
        if (options.to) {
            query = query.lte('entry_timestamp', options.to);
        }

        query = query.order(options.sortBy, { ascending: options.sortOrder === 'asc' });
        if (options.sortBy !== 'id') {
            query = query.order('id', { ascending: false });
        }

        const fromRow = (options.page - 1) * options.pageSize;
        const toRow = fromRow + options.pageSize - 1;
        query = query.range(fromRow, toRow);

        const { data, error, count } = await query;

        if (error) {
            throw new Error(`Database error fetching trades: ${error.message}`);
        }

        return {
            data: data || [],
            total: count || 0
        };
    }
};

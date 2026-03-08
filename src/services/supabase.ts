/**
 * Supabase-compatible HTTP shim.
 * All DB calls go through /api/db/* (Next.js API routes).
 * Uses absolute URL on server to avoid ECONNREFUSED during build.
 */

function getBaseUrl(): string {
    if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
    if (typeof window !== 'undefined') return ''; // browser: relative URL is fine
    // SSR / build: use absolute URL
    const port = process.env.PORT || 3000;
    return `http://localhost:${port}`;
}

async function fetchTable(table: string, params?: URLSearchParams): Promise<any[]> {
    const base = getBaseUrl();
    const qs = params && params.size > 0 ? `?${params}` : '';
    const res = await fetch(`${base}/api/db/${table}${qs}`, { cache: 'no-store' });
    if (!res.ok) return [];
    return res.json();
}

function buildQuery(table: string) {
    const state: {
        eqFilters: Record<string, any>;
        orderCol?: string;
        orderAsc?: boolean;
        limitVal?: number;
        rangeFrom?: number;
        rangeTo?: number;
        isSingle?: boolean;
        isHead?: boolean;
        isCount?: boolean;
    } = { eqFilters: {} };

    const execute = async (): Promise<{ data: any; count: number | null; error: any }> => {
        try {
            const params = new URLSearchParams();
            Object.entries(state.eqFilters).forEach(([k, v]) => params.set(k, String(v)));
            if (state.orderCol) params.set('order', `${state.orderCol}.${state.orderAsc === false ? 'asc' : 'desc'}`);
            if (state.limitVal) params.set('limit', String(state.limitVal));

            const rows = await fetchTable(table, params);
            let data: any = state.isSingle ? (rows[0] || null) : rows;
            const count = Array.isArray(rows) ? rows.length : null;
            return { data, count, error: null };
        } catch (err: any) {
            return { data: state.isSingle ? null : [], count: null, error: err };
        }
    };

    const q: any = {
        then: (resolve: any, reject: any) => execute().then(resolve, reject),

        select: (_cols?: string, opts?: any) => {
            if (opts?.count === 'exact') state.isCount = true;
            if (opts?.head) state.isHead = true;
            return q;
        },
        eq: (col: string, val: any) => { state.eqFilters[col] = val; return q; },
        ilike: (_col: string, _val: any) => q,
        not: (_col: string, _op: string, _val: any) => q,
        in: (_col: string, _arr: any[]) => q,
        or: (_cond: string) => q,
        gte: (_col: string, _val: any) => q,
        lte: (_col: string, _val: any) => q,
        gt: (_col: string, _val: any) => q,
        lt: (_col: string, _val: any) => q,
        order: (col: string, opts?: { ascending?: boolean }) => {
            state.orderCol = col;
            state.orderAsc = opts?.ascending !== false;
            return q;
        },
        limit: (n: number) => { state.limitVal = n; return q; },
        range: (from: number, to: number) => {
            state.rangeFrom = from;
            state.rangeTo = to;
            return q;
        },
        single: () => { state.isSingle = true; return q; },
        maybeSingle: () => { state.isSingle = true; return q; },
    };

    return q;
}

export const supabase = {
    from: (table: string) => ({
        select: (cols?: string, opts?: any) => buildQuery(table).select(cols, opts),

        insert: (data: any) => {
            const row = Array.isArray(data) ? data[0] : data;
            const doInsert = async () => {
                const base = getBaseUrl();
                const res = await fetch(`${base}/api/db/${table}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(row),
                });
                return { data: await res.json(), error: null };
            };
            const p: any = doInsert();
            p.select = () => ({ single: () => doInsert() });
            return p;
        },

        update: (data: any) => ({
            eq: (key: string, val: any) => {
                const doUpdate = async () => {
                    const base = getBaseUrl();
                    const res = await fetch(`${base}/api/db/${table}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ ...data, [key]: val }),
                    });
                    return { data: await res.json(), error: null };
                };
                const p: any = doUpdate();
                p.select = () => ({ single: () => doUpdate() });
                return p;
            },
        }),

        delete: () => ({
            eq: (_key: string, val: any) => {
                const base = getBaseUrl();
                return fetch(`${base}/api/db/${table}?id=${val}`, { method: 'DELETE' })
                    .then(() => ({ error: null }));
            },
        }),
    }),

    auth: {
        signUp: async (_d: any) => ({ data: { user: null }, error: 'Handled via Firebase' }),
        signInWithPassword: async (_d: any) => ({ data: { user: null }, error: 'Handled via Firebase' }),
        getSession: async () => ({ data: { session: null } }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => { } } } }),
        getUser: async () => ({ data: { user: null } }),
        signOut: async () => ({ error: null }),
    },

    storage: {
        from: (_bucket: string) => ({
            upload: async (path: string, file: File) => {
                const base = getBaseUrl();
                const res = await fetch(`${base}/api/gcp-upload`, {
                    method: 'POST',
                    body: JSON.stringify({ filename: path, contentType: file.type }),
                });
                const { url } = await res.json();
                await fetch(url, { method: 'PUT', body: file });
                return { data: { path }, error: null };
            },
        }),
    },
};

export const supabase = {
    from: (table: string) => ({
        select: (query: string = '*') => {
            const fetchTable = async () => {
                const res = await fetch(`/api/db/${table}`);
                if (!res.ok) throw new Error('Query failed');
                return { data: await res.json(), error: null };
            };
            const proxy: any = fetchTable();
            proxy.eq = (key: string, val: any) => {
                const filtered = async () => {
                    const r = await fetchTable();
                    return { data: r.data.filter((i: any) => i[key] === val), error: null };
                };
                const p2: any = filtered();
                p2.order = () => p2;
                p2.single = () => filtered().then(r => ({ data: r.data[0], error: null }));
                p2.maybeSingle = p2.single;
                p2.limit = () => p2;
                return p2;
            };
            proxy.order = () => proxy;
            proxy.limit = () => proxy;
            return proxy;
        },
        insert: (data: any) => {
            const postData = async () => {
                const res = await fetch(`/api/db/${table}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(Array.isArray(data) ? data[0] : data)
                });
                return { data: await res.json(), error: null };
            };
            const proxy: any = postData();
            proxy.select = () => ({ single: () => postData() });
            return proxy;
        },
        update: (data: any) => ({
            eq: (key: string, val: any) => {
                const putData = async () => {
                    const res = await fetch(`/api/db/${table}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ ...data, [key]: val })
                    });
                    return { data: await res.json(), error: null };
                };
                const proxy: any = putData();
                proxy.select = () => ({ single: () => putData() });
                return proxy;
            }
        }),
        delete: () => ({
            eq: (key: string, val: any) => fetch(`/api/db/${table}?id=${val}`, { method: 'DELETE' }).then(() => ({ error: null }))
        })
    }),
    auth: {
        signUp: async (data: any) => ({ data: { user: null }, error: 'Sign up handled via Firebase' }),
        signInWithPassword: async (data: any) => ({ data: { user: null }, error: 'Sign in handled via Firebase' }),
        getSession: async () => ({ data: { session: null } }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => { } } } }),
        getUser: async () => ({ data: { user: null } }),
        signOut: async () => ({ error: null })
    },
    storage: {
        from: (bucket: string) => ({
            upload: async (path: string, file: File) => {
                const res = await fetch('/api/gcp-upload', {
                    method: 'POST',
                    body: JSON.stringify({ filename: path, contentType: file.type })
                });
                const { url } = await res.json();
                await fetch(url, { method: 'PUT', body: file });
                return { data: { path }, error: null };
            }
        })
    }
};

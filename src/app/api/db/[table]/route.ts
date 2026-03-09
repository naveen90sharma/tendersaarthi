import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: Request, { params }: { params: { table: string } }) {
    try {
        const { table } = await (params as any);
        const { searchParams } = new URL(req.url);

        // Basic protection: Only allow specific tables
        const allowedTables = [
            'tenders', 'news', 'contractors', 'profiles', 'tender_categories',
            'authorities', 'states', 'portals', 'saved_tenders',
            'testimonials', 'homepage_metrics', 'seo_metadata',
            'contractor_profiles', 'contractor_projects', 'contractor_documents',
            'whatsapp_alerts', 'whatsapp_logs', 'email_logs', 'tender_drafts'
        ];

        if (!allowedTables.includes(table)) {
            return NextResponse.json({ error: 'Illegal table access' }, { status: 403 });
        }

        let query = `SELECT * FROM ${table}`;
        const values: any[] = [];
        const conditions: string[] = [];

        // Simple filtering (e.g. ?status=Active or ?id=neq.123 or ?title=ilike.test)
        searchParams.forEach((val, key) => {
            if (key !== 'order' && key !== 'limit' && key !== 'offset' && key !== 'or') {
                if (val.startsWith('neq.')) {
                    values.push(val.substring(4));
                    conditions.push(`${key} != $${values.length}`);
                } else if (val.startsWith('ilike.')) {
                    values.push(`%${val.substring(6).replace(/\*/g, '%')}%`);
                    conditions.push(`${key} ILIKE $${values.length}`);
                } else {
                    values.push(val);
                    conditions.push(`${key} = $${values.length}`);
                }
            }
        });

        const or = searchParams.get('or');
        if (or) {
            // Format: (col1.ilike.%val%,col2.eq.val)
            // Very simplified parser for the admin panel's needs
            const parts = or.replace(/^\(|\)$/g, '').split(',');
            const orConditions: string[] = [];
            parts.forEach(p => {
                const match = p.match(/^([^.]+)\.([^.]+)\.(.+)$/);
                if (match) {
                    const [, col, op, rawVal] = match;
                    let val = rawVal.replace(/^%|%$/g, '');
                    if (op === 'ilike') {
                        values.push(`%${val}%`);
                        orConditions.push(`${col} ILIKE $${values.length}`);
                    } else if (op === 'eq') {
                        values.push(val);
                        orConditions.push(`${col} = $${values.length}`);
                    }
                }
            });
            if (orConditions.length > 0) {
                conditions.push(`(${orConditions.join(' OR ')})`);
            }
        }

        if (conditions.length > 0) {
            query += ` WHERE ${conditions.join(' AND ')}`;
        }

        const order = searchParams.get('order'); // e.g. created_at.desc
        if (order) {
            const [col, dir] = order.split('.');
            query += ` ORDER BY ${col} ${dir === 'desc' ? 'DESC' : 'ASC'}`;
        }

        const limit = searchParams.get('limit');
        if (limit) {
            values.push(parseInt(limit));
            query += ` LIMIT $${values.length}`;
        }

        const offset = searchParams.get('offset');
        if (offset) {
            values.push(parseInt(offset));
            query += ` OFFSET $${values.length}`;
        }

        const result = await db.query(query, values);
        return NextResponse.json(result.rows, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            }
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req: Request, { params }: { params: { table: string } }) {
    try {
        const { table } = await (params as any);
        const body = await req.json();

        const keys = Object.keys(body);
        const values = Object.values(body);
        const cols = keys.join(', ');
        const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');

        const query = `INSERT INTO ${table} (${cols}) VALUES (${placeholders}) RETURNING *`;
        const result = await db.query(query, values);

        return NextResponse.json(result.rows[0], {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            }
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(req: Request, { params }: { params: { table: string } }) {
    try {
        const { table } = await (params as any);
        const body = await req.json();
        const { id, ...data } = body;

        const keys = Object.keys(data);
        const values = Object.values(data);
        values.push(id);

        const setClause = keys.map((k, i) => `${k} = $${i + 1}`).join(', ');
        const query = `UPDATE ${table} SET ${setClause} WHERE id = $${values.length} RETURNING *`;

        const result = await db.query(query, values);
        return NextResponse.json(result.rows[0], {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            }
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: { table: string } }) {
    try {
        const { table } = await (params as any);
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) throw new Error('ID required');

        await db.query(`DELETE FROM ${table} WHERE id = $1`, [id]);
        return NextResponse.json({ success: true }, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            }
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function OPTIONS() {
    return NextResponse.json({}, {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        }
    });
}

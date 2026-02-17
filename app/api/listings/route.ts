import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    const { data, error } = await supabase
      .from('listings')
      .insert({
        collector_id: user.id,
        material_type: body.material_type,
        weight_kg: body.weight_kg,
        purity_score: body.purity_score,
        grade: body.grade || 'B',
        asking_price: body.asking_price,
        location: body.location,
        description: body.description,
        status: 'ACTIVE',
      })
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    const searchParams = request.nextUrl.searchParams
    const materialType = searchParams.get('material_type')
    const location = searchParams.get('location')

    let query = supabase
      .from('listings')
      .select('*')
      .eq('status', 'ACTIVE')
      .order('created_at', { ascending: false })

    if (materialType) {
      query = query.eq('material_type', materialType)
    }

    if (location) {
      query = query.ilike('location', `%${location}%`)
    }

    const { data, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const EGITIM_GECMISI_FILE = path.join(process.cwd(), '..', '..', 'data', 'egitim-gecmisi.json');

// GET - Tüm eğitim geçmişini getir
export async function GET() {
  try {
    const data = fs.readFileSync(EGITIM_GECMISI_FILE, 'utf8');
    const egitimGecmisi = JSON.parse(data);
    return NextResponse.json(egitimGecmisi);
  } catch (error) {
    console.error('Error reading egitim geçmişi file:', error);
    return NextResponse.json({ error: 'Failed to read egitim geçmişi' }, { status: 500 });
  }
}

// POST - Eğitim geçmişini kaydet
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { egitimGecmisi } = body;
    
    if (!egitimGecmisi) {
      return NextResponse.json({ error: 'egitimGecmisi is required' }, { status: 400 });
    }
    
    fs.writeFileSync(EGITIM_GECMISI_FILE, JSON.stringify({ egitimGecmisi }, null, 2));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving egitim geçmişi:', error);
    return NextResponse.json({ error: 'Failed to save egitim geçmişi' }, { status: 500 });
  }
}

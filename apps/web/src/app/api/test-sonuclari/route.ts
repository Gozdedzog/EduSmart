import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');

// Server-side JSON dosya işlemleri
const readJsonFile = <T>(fileKey: string): T | null => {
  try {
    const filePath = path.join(DATA_DIR, `${fileKey}.json`);
    
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data);
    }
    
    return null;
  } catch (error) {
    console.error(`JSON dosyası okuma hatası (${fileKey}):`, error);
    return null;
  }
};

const writeJsonFile = <T>(fileKey: string, data: T): boolean => {
  try {
    // data klasörünü oluştur
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    
    const filePath = path.join(DATA_DIR, `${fileKey}.json`);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`💾 JSON dosyasına kaydedildi: ${filePath}`);
    return true;
  } catch (error) {
    console.error(`JSON dosyası yazma hatası (${fileKey}):`, error);
    return false;
  }
};

const initializeJsonFile = (fileKey: string, initialData: any): boolean => {
  try {
    const existingData = readJsonFile(fileKey);
    if (existingData === null) {
      return writeJsonFile(fileKey, initialData);
    }
    return true;
  } catch (error) {
    console.error(`JSON dosyası oluşturma hatası (${fileKey}):`, error);
    return false;
  }
};

// Test sonuçlarını getir
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json({ error: 'userId gerekli' }, { status: 400 });
    }
    
    // JSON dosyasını başlat
    initializeJsonFile('testSonuclari', { sonuclar: [] });
    
    const data = readJsonFile<{ sonuclar: any[] }>('testSonuclari');
    const userResults = data?.sonuclar?.filter((sonuc: any) => sonuc.userId === userId) || [];
    
    return NextResponse.json({ sonuclar: userResults });
  } catch (error) {
    console.error('Test sonuçları getirme hatası:', error);
    return NextResponse.json({ error: 'Test sonuçları getirilemedi' }, { status: 500 });
  }
}

// Test sonucu ekle
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // JSON dosyasını başlat
    initializeJsonFile('testSonuclari', { sonuclar: [] });
    
    const data = readJsonFile<{ sonuclar: any[] }>('testSonuclari') || { sonuclar: [] };
    
    const yeniSonuc = {
      ...body,
      id: Date.now().toString()
    };
    
    data.sonuclar.push(yeniSonuc);
    
    const success = writeJsonFile('testSonuclari', data);
    
    if (success) {
      return NextResponse.json({ success: true, sonuc: yeniSonuc });
    } else {
      return NextResponse.json({ error: 'Test sonucu kaydedilemedi' }, { status: 500 });
    }
  } catch (error) {
    console.error('Test sonucu kaydetme hatası:', error);
    return NextResponse.json({ error: 'Test sonucu kaydedilemedi' }, { status: 500 });
  }
}
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: 'URL gerekli' }, { status: 400 });
    }

    // URL'yi doğrula
    try {
      new URL(url);
    } catch {
      return NextResponse.json({ error: 'Geçersiz URL' }, { status: 400 });
    }

    // Web sayfasını çek
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Sayfa çekilemedi' }, { status: 400 });
    }

    const html = await response.text();

    // HTML'i parse et ve içeriği çıkar
    const content = extractContentFromHTML(html);

    return NextResponse.json({ 
      success: true, 
      content: content.text,
      title: content.title,
      description: content.description
    });

  } catch (error) {
    console.error('URL çekme hatası:', error);
    return NextResponse.json({ error: 'İçerik çekilemedi' }, { status: 500 });
  }
}

function extractContentFromHTML(html: string) {
  // Basit HTML parsing - gerçek projede cheerio veya jsdom kullanılabilir
  const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : 'Başlık bulunamadı';

  // Meta description'ı çek
  const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i);
  const description = descMatch ? descMatch[1].trim() : '';

  // Ana içeriği çıkar - çeşitli selector'ları dene
  let mainContent = '';
  
  // Önce main, article, veya content class'ı olan elementleri ara
  const mainSelectors = [
    /<main[^>]*>(.*?)<\/main>/is,
    /<article[^>]*>(.*?)<\/article>/is,
    /<div[^>]*class=["'][^"']*content[^"']*["'][^>]*>(.*?)<\/div>/is,
    /<div[^>]*class=["'][^"']*main[^"']*["'][^>]*>(.*?)<\/div>/is,
    /<div[^>]*class=["'][^"']*post[^"']*["'][^>]*>(.*?)<\/div>/is,
  ];

  for (const selector of mainSelectors) {
    const match = html.match(selector);
    if (match && match[1]) {
      mainContent = match[1];
      break;
    }
  }

  // Eğer ana içerik bulunamazsa, body'den çıkar
  if (!mainContent) {
    const bodyMatch = html.match(/<body[^>]*>(.*?)<\/body>/is);
    if (bodyMatch) {
      mainContent = bodyMatch[1];
    }
  }

  // HTML tag'lerini temizle ve metni çıkar
  const cleanText = cleanHTML(mainContent || html);

  return {
    title,
    description,
    text: cleanText
  };
}

function cleanHTML(html: string): string {
  // HTML tag'lerini kaldır
  let text = html.replace(/<script[^>]*>.*?<\/script>/gis, '');
  text = text.replace(/<style[^>]*>.*?<\/style>/gis, '');
  text = text.replace(/<nav[^>]*>.*?<\/nav>/gis, '');
  text = text.replace(/<header[^>]*>.*?<\/header>/gis, '');
  text = text.replace(/<footer[^>]*>.*?<\/footer>/gis, '');
  text = text.replace(/<aside[^>]*>.*?<\/aside>/gis, '');
  
  // Diğer HTML tag'lerini kaldır
  text = text.replace(/<[^>]+>/g, '');
  
  // HTML entity'lerini decode et
  text = text.replace(/&nbsp;/g, ' ');
  text = text.replace(/&amp;/g, '&');
  text = text.replace(/&lt;/g, '<');
  text = text.replace(/&gt;/g, '>');
  text = text.replace(/&quot;/g, '"');
  text = text.replace(/&#39;/g, "'");
  
  // Fazla boşlukları temizle
  text = text.replace(/\s+/g, ' ');
  text = text.replace(/\n\s*\n/g, '\n\n');
  
  // Başlık ve açıklama kısımlarını temizle
  text = text.replace(/^.*?(?=Trigonometrik Fonksiyonlar)/s, '');
  
  return text.trim();
}

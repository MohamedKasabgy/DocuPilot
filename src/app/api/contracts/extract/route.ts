import { NextResponse } from 'next/server';
import { extractText, getDocumentProxy } from 'unpdf';

export const runtime = 'nodejs';
export const maxDuration = 60;

const MAX_BYTES = 15 * 1024 * 1024;

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get('file');

    if (!(file instanceof File)) {
      return NextResponse.json({ success: false, error: 'No file uploaded.' }, { status: 400 });
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ success: false, error: 'File exceeds 15 MB limit.' }, { status: 413 });
    }

    const name = file.name.toLowerCase();
    const isPdf = name.endsWith('.pdf') || file.type === 'application/pdf';
    const isText = name.endsWith('.txt') || name.endsWith('.md') || file.type.startsWith('text/');

    if (isText) {
      const text = await file.text();
      return NextResponse.json({ success: true, text, fileName: file.name, pages: null });
    }

    if (!isPdf) {
      return NextResponse.json(
        { success: false, error: 'Unsupported file type. Upload a PDF, TXT, or MD file.' },
        { status: 415 },
      );
    }

    const buffer = new Uint8Array(await file.arrayBuffer());
    const pdf = await getDocumentProxy(buffer);
    const { text, totalPages } = await extractText(pdf, { mergePages: true });
    const flat = Array.isArray(text) ? text.join('\n') : text;

    if (!flat || flat.trim().length < 20) {
      return NextResponse.json(
        { success: false, error: 'Could not extract readable text. The PDF may be scanned/image-based.' },
        { status: 422 },
      );
    }

    return NextResponse.json({ success: true, text: flat, fileName: file.name, pages: totalPages });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to read file.';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

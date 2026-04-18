import { useParams, Link } from 'react-router';
import { Clock, Calendar, User, BookOpen, ChevronRight, MessageCircle } from 'lucide-react';
import { useData } from '../context/DataContext';

// Simple markdown renderer
function MarkdownContent({ content }: { content: string }) {
  const lines = content.split('\n');
  const elements: JSX.Element[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith('## ')) {
      elements.push(
        <h2 key={i} className="text-xl font-black text-white mt-8 mb-3 pb-2 border-b border-slate-800">
          {line.replace('## ', '')}
        </h2>
      );
    } else if (line.startsWith('### ')) {
      elements.push(
        <h3 key={i} className="text-lg font-bold text-white mt-6 mb-2">
          {line.replace('### ', '')}
        </h3>
      );
    } else if (line.startsWith('```')) {
      // Code block
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      elements.push(
        <pre key={i} className="bg-slate-900 border border-slate-800 rounded-xl p-4 overflow-x-auto my-4">
          <code className="text-blue-300 text-sm font-mono">{codeLines.join('\n')}</code>
        </pre>
      );
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      const listItems: string[] = [];
      while (i < lines.length && (lines[i].startsWith('- ') || lines[i].startsWith('* '))) {
        listItems.push(lines[i].replace(/^[-*] /, ''));
        i++;
      }
      elements.push(
        <ul key={i} className="space-y-1.5 my-3 pl-1">
          {listItems.map((item, li) => (
            <li key={li} className="flex items-start gap-2 text-slate-400">
              <span className="text-blue-400 mt-1.5 flex-shrink-0">•</span>
              <span dangerouslySetInnerHTML={{ __html: item.replace(/\*\*(.*?)\*\*/g, '<strong class="text-slate-200">$1</strong>').replace(/`(.*?)`/g, '<code class="bg-slate-800 text-blue-300 px-1.5 py-0.5 rounded text-sm font-mono">$1</code>') }} />
            </li>
          ))}
        </ul>
      );
      continue;
    } else if (/^\d+\./.test(line)) {
      const listItems: string[] = [];
      while (i < lines.length && /^\d+\./.test(lines[i])) {
        listItems.push(lines[i].replace(/^\d+\. /, ''));
        i++;
      }
      elements.push(
        <ol key={i} className="space-y-1.5 my-3 pl-1">
          {listItems.map((item, li) => (
            <li key={li} className="flex items-start gap-2 text-slate-400">
              <span className="text-blue-400 flex-shrink-0 font-bold">{li + 1}.</span>
              <span dangerouslySetInnerHTML={{ __html: item.replace(/\*\*(.*?)\*\*/g, '<strong class="text-slate-200">$1</strong>').replace(/`(.*?)`/g, '<code class="bg-slate-800 text-blue-300 px-1.5 py-0.5 rounded text-sm font-mono">$1</code>') }} />
            </li>
          ))}
        </ol>
      );
      continue;
    } else if (line.trim() === '') {
      // Skip empty lines
    } else {
      elements.push(
        <p key={i} className="text-slate-400 leading-relaxed my-3"
          dangerouslySetInnerHTML={{
            __html: line
              .replace(/\*\*(.*?)\*\*/g, '<strong class="text-slate-200 font-semibold">$1</strong>')
              .replace(/`(.*?)`/g, '<code class="bg-slate-800 text-blue-300 px-1.5 py-0.5 rounded text-sm font-mono">$1</code>')
          }}
        />
      );
    }
    i++;
  }

  return <div>{elements}</div>;
}

export default function EdukasiDetail() {
  const { slug } = useParams();
  const { blogPosts, waNumber } = useData();

  const post = blogPosts.find((p) => p.slug === slug);
  const related = blogPosts.filter((p) => p.slug !== slug).slice(0, 2);

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center pt-16">
        <div className="text-center">
          <BookOpen className="w-16 h-16 text-slate-700 mx-auto mb-4" />
          <h2 className="text-white font-bold text-xl mb-2">Artikel tidak ditemukan</h2>
          <Link
            to="/edukasi"
            className="px-6 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-500 transition-colors"
          >
            Kembali ke Edukasi
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 pt-20 pb-16">
      {/* Hero image */}
      <div className="relative h-72 sm:h-96 overflow-hidden">
        <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-slate-950/50 to-slate-950" />
      </div>

      <div className="max-w-3xl mx-auto px-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-6 mt-4">
          <Link to="/" className="hover:text-white transition-colors">Beranda</Link>
          <ChevronRight className="w-3 h-3" />
          <Link to="/edukasi" className="hover:text-white transition-colors">Edukasi</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-slate-300 truncate">{post.title}</span>
        </div>

        {/* Article Header */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-medium">
              {post.category}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-4 leading-tight">{post.title}</h1>
          <p className="text-slate-400 text-lg leading-relaxed mb-5">{post.excerpt}</p>
          <div className="flex flex-wrap items-center gap-4 text-slate-500 text-sm pb-6 border-b border-slate-800">
            <span className="flex items-center gap-1.5">
              <User className="w-4 h-4" />
              {post.author}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {formatDate(post.date)}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {post.readTime} baca
            </span>
          </div>
        </div>

        {/* Article Content */}
        <div className="mb-12">
          <MarkdownContent content={post.content} />
        </div>

        {/* CTA */}
        <div className="rounded-2xl bg-gradient-to-br from-blue-600/20 to-cyan-600/10 border border-blue-500/30 p-6 mb-10">
          <h3 className="text-white font-bold text-lg mb-2">Masih punya pertanyaan?</h3>
          <p className="text-slate-400 text-sm mb-4">
            Tim teknisi kami siap membantu konsultasi gratis seputar jual beli HP second.
          </p>
          <a
            href={`https://wa.me/${waNumber}?text=Halo%20COREPAWAS!%20Saya%20baru%20baca%20artikel%20%22${encodeURIComponent(post.title)}%22%20dan%20punya%20pertanyaan.`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-green-600 hover:bg-green-500 text-white font-bold transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            Tanya via WhatsApp
          </a>
        </div>

        {/* Related Articles */}
        {related.length > 0 && (
          <div>
            <h3 className="text-xl font-bold text-white mb-5">Artikel Terkait</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {related.map((r) => (
                <Link key={r.id} to={`/edukasi/${r.slug}`} className="group">
                  <div className="rounded-xl overflow-hidden border border-slate-800 hover:border-slate-700 bg-slate-900 transition-all">
                    <img src={r.image} alt={r.title} className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="p-4">
                      <span className="text-purple-400 text-xs font-medium">{r.category}</span>
                      <h4 className="text-white font-bold text-sm mt-1 group-hover:text-blue-400 transition-colors line-clamp-2">
                        {r.title}
                      </h4>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
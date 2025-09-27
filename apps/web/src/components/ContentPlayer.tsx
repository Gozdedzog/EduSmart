interface ContentPlayerProps {
  type: 'VIDEO' | 'ARTICLE';
  content: string; // URL for video, markdown content for article
}

export function ContentPlayer({ type, content }: ContentPlayerProps) {
  if (type === 'VIDEO') {
    return (
      <div className="w-full">
        <div className="relative w-full h-0 pb-[56.25%] bg-gray-100 rounded-lg overflow-hidden">
          <iframe
            src={content}
            className="absolute top-0 left-0 w-full h-full"
            title="Video content"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    );
  }

  if (type === 'ARTICLE') {
    return (
      <div className="w-full">
        <div className="prose prose-lg max-w-none">
          <div
            className="whitespace-pre-wrap"
            dangerouslySetInnerHTML={{
              __html: content
                .replace(
                  /```(\w+)?\n([\s\S]*?)```/g,
                  '<pre class="bg-gray-100 p-4 rounded-lg overflow-x-auto"><code>$2</code></pre>'
                )
                .replace(
                  /`([^`]+)`/g,
                  '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm">$1</code>'
                )
                .replace(
                  /^# (.*$)/gm,
                  '<h1 class="text-3xl font-bold mb-4">$1</h1>'
                )
                .replace(
                  /^## (.*$)/gm,
                  '<h2 class="text-2xl font-semibold mb-3 mt-6">$1</h2>'
                )
                .replace(
                  /^### (.*$)/gm,
                  '<h3 class="text-xl font-semibold mb-2 mt-4">$1</h3>'
                )
                .replace(/^\- (.*$)/gm, '<li class="ml-4">$1</li>')
                .replace(/^\d+\. (.*$)/gm, '<li class="ml-4">$1</li>')
                .replace(/\n\n/g, '</p><p class="mb-4">')
                .replace(/^(?!<[h|l])(.*$)/gm, '<p class="mb-4">$1</p>'),
            }}
          />
        </div>
      </div>
    );
  }

  return null;
}

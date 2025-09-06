
import React, { useState } from 'react';
import { mockDocumentation } from '../../services/mockData';
import { DocumentationArticle } from '../../types';

const Documentation: React.FC = () => {
    const [articles, setArticles] = useState<DocumentationArticle[]>(mockDocumentation);
    const [selectedArticle, setSelectedArticle] = useState<DocumentationArticle>(articles[0]);

    return (
        <div className="flex-1 flex flex-col">
            <div className="p-8 flex-1 flex gap-8">
                <aside className="w-1/4">
                    <h3 className="text-lg font-semibold mb-4">Categories</h3>
                    <nav className="space-y-1">
                        {articles.map(article => (
                            <button 
                                key={article.id}
                                onClick={() => setSelectedArticle(article)}
                                className={`w-full text-left px-3 py-2 rounded-md text-sm ${selectedArticle.id === article.id ? 'bg-primary/20 text-primary' : 'hover:bg-card'}`}
                            >
                                {article.title}
                            </button>
                        ))}
                    </nav>
                </aside>
                <main className="w-3/4 bg-card rounded-lg border border-border p-6">
                    <h2 className="text-2xl font-bold mb-4">{selectedArticle.title}</h2>
                    <div className="prose prose-invert max-w-none prose-p:text-text-secondary prose-headings:text-text-primary prose-strong:text-text-primary">
                        <p>This is a mock documentation page. In a real application, this content could be written in Markdown and rendered here.</p>
                        <pre className="bg-background p-4 rounded-md text-sm">
                            <code>
                                {selectedArticle.content}
                            </code>
                        </pre>
                        <p>For further assistance, please contact our support team.</p>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Documentation;

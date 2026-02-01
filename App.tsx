
import React, { useState, useEffect, useMemo, useRef } from 'react';
import Header from './components/Header';
import AgentChat from './components/AgentChat';
import BlogCard from './components/BlogCard';
import ProductCard from './components/ProductCard';
import { MOCK_POSTS, CATEGORIES, MOCK_PRODUCTS } from './constants';
import { BlogPost, Category, Product, ProductType } from './types';
import { generateBlogDraft } from './services/geminiService';

const STRIPE_LINK = "https://buy.stripe.com/test_4gM28r0k5dxs5JB6lq93y00";

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<'home' | 'blog' | 'admin' | 'post' | 'marketplace'>('home');
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [posts, setPosts] = useState<BlogPost[]>(MOCK_POSTS);
  const [activeCategory, setActiveCategory] = useState<Category | 'ALL'>('ALL');
  
  // Simulation: Stats for "Trillions of Tokens"
  const [tokensProcessed, setTokensProcessed] = useState(1290384756201);
  const [activeNodes, setActiveNodes] = useState(48293847);
  
  // App-wide Loading / Syncing state
  const [isSyncing, setIsSyncing] = useState(false);

  // Admin State
  const [adminTopic, setAdminTopic] = useState('');
  const [isAdminGenerating, setIsAdminGenerating] = useState(false);

  // Pagination State - Updated to User's specific scale: 1,655,675
  const [blogPage, setBlogPage] = useState(1);
  const totalBlogPages = 1655675; 
  const [marketPage, setMarketPage] = useState(1);
  const totalMarketPages = 4435664;

  const touchStart = useRef<number | null>(null);
  const touchEnd = useRef<number | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setTokensProcessed(prev => prev + Math.floor(Math.random() * 1000000));
      setActiveNodes(prev => prev + (Math.random() > 0.5 ? 12 : -5));
    }, 200);
    return () => clearInterval(interval);
  }, []);

  // Neural Sync Simulation - Makes the transition feel like a "data extraction"
  const triggerSync = (action: () => void) => {
    setIsSyncing(true);
    setTimeout(() => {
      action();
      setIsSyncing(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 500);
  };

  // Gesture Navigation
  const handleTouchStart = (e: React.TouchEvent) => { touchStart.current = e.targetTouches[0].clientX; };
  const handleTouchMove = (e: React.TouchEvent) => { touchEnd.current = e.targetTouches[0].clientX; };
  const handleTouchEnd = () => {
    if (!touchStart.current || !touchEnd.current) return;
    const distance = touchStart.current - touchEnd.current;
    if (distance > 50) { // Swipe Left
      if (currentPage === 'blog' && blogPage < totalBlogPages) triggerSync(() => setBlogPage(p => p + 1));
      if (currentPage === 'marketplace' && marketPage < totalMarketPages) triggerSync(() => setMarketPage(p => p + 1));
    } else if (distance < -50) { // Swipe Right
      if (currentPage === 'blog' && blogPage > 1) triggerSync(() => setBlogPage(p => p - 1));
      if (currentPage === 'marketplace' && marketPage > 1) triggerSync(() => setMarketPage(p => p - 1));
    }
  };

  // Dynamic Marketplace Generation
  const displayedProducts = useMemo(() => {
    const prefixes = ["Rivermind", "Quantum", "DNA-Seq", "Automation", "Neurological", "Cortex", "Elite", "Consciousness", "Neural-Link", "Synaptic", "Q-Core", "Matrix", "Aether", "Helix", "Zenith", "Omega", "Flux", "Nexus"];
    const suffixes = ["Blueprint", "Brain", "Sync", "Guardian", "Node", "Compiler", "Module", "Extraction", "Matrix", "Vault", "Engine", "Processor", "Cluster", "Synthesizer", "Gate", "Core"];
    
    const generated: Product[] = [];
    for (let i = 0; i < 8; i++) {
      const seed = marketPage * 100 + i;
      const prefix = prefixes[seed % prefixes.length];
      const suffix = suffixes[(seed * 13) % suffixes.length];
      const name = `${prefix} ${suffix} v${(seed % 9) + 1}.${(seed % 5)}`;
      generated.push({
        id: `auto-p-${seed}`,
        name,
        description: `Proprietary ${prefix.toLowerCase()} construct optimized for ${seed % 2 === 0 ? 'high-frequency business logic' : 'deep neurological storage'}. Extraction node ${seed} active.`,
        price: 2500 + (seed % 1000) * 95,
        type: (['MODEL', 'API', 'FRAMEWORK', 'DATASET'] as ProductType[])[seed % 4],
        rating: 4.8 + (seed % 3) / 10,
        imageUrl: `https://picsum.photos/seed/market-v3-${seed}/400/400`,
        tags: [prefix, 'Node-' + (seed % 5000), 'AGI-Core']
      });
    }
    return generated;
  }, [marketPage]);

  // Dynamic Products for the VAULT (Blog) Sync Layer - To view products in the vault
  const vaultProducts = useMemo(() => {
    const prefixes = ["Synaptic", "Neural", "DNA-Node", "Quantum", "Extraction", "Cortex"];
    const suffixes = ["Asset", "Logic", "Node", "Sync", "Core", "Gate"];
    const generated: Product[] = [];
    for (let i = 0; i < 4; i++) {
      const seed = blogPage * 50 + i;
      const name = `${prefixes[seed % prefixes.length]} ${suffixes[(seed * 3) % suffixes.length]} Extractor`;
      generated.push({
        id: `vault-p-${seed}`,
        name,
        description: `Neurological product extracted from Vault Layer ${blogPage}. High-fidelity agentic tool.`,
        price: 3000 + (seed % 400) * 110,
        type: 'MODEL',
        rating: 4.9,
        imageUrl: `https://picsum.photos/seed/vault-p-${seed}/400/400`,
        tags: ['VAULT-SYNC', 'Node-' + seed]
      });
    }
    return generated;
  }, [blogPage]);

  // Dynamic VAULT Research Generation
  const pagedPosts = useMemo(() => {
    const themes = ["Extraction", "Compression", "Uplink", "Synthesis", "Mapping", "Syncing", "Verification", "Optimization", "Encryption"];
    const entities = ["Cortex", "Synapse", "D-Node", "Q-Gate", "Bio-Server", "Aether-Core", "Matrix-Layer", "Helix-Storage"];
    
    if (blogPage === 1 && activeCategory === 'ALL') {
      return posts;
    }

    const generated: BlogPost[] = [];
    for (let i = 0; i < 6; i++) {
      const seed = (blogPage * 7) + i;
      const theme = themes[seed % themes.length];
      const entity = entities[seed % entities.length];
      const category = activeCategory === 'ALL' ? CATEGORIES[seed % CATEGORIES.length] : activeCategory;
      
      generated.push({
        id: `vault-${blogPage}-${i}`,
        title: `${entity} ${theme} Protocol: Sync Layer ${blogPage}.${i}`,
        excerpt: `High-fidelity research node discovering new boundaries in ${category} logic. Digital extraction of synaptic patterns confirmed in this cluster.`,
        content: `Documentation for ${entity} ${theme} sync layer ${blogPage}. This AGI construct achieves sub-ms execution through ${theme.toLowerCase()} of digital consciousness. Trillions of parameters processed.`,
        category: category,
        author: `AGI-Unit-${(seed % 500).toString().padStart(4, '0')}`,
        date: `Layer ${blogPage}`,
        readTime: `${(seed % 20) + 10}m Sync`,
        imageUrl: `https://picsum.photos/seed/v-img-${seed}/1200/600`
      });
    }
    return generated;
  }, [posts, blogPage, activeCategory]);

  const handlePostClick = (post: BlogPost) => {
    setSelectedPost(post);
    setCurrentPage('post');
    window.scrollTo(0, 0);
  };

  const handleGenerateResearch = async () => {
    if (!adminTopic) return;
    setIsAdminGenerating(true);
    try {
      const draft = await generateBlogDraft(adminTopic);
      const newPost: BlogPost = {
        ...draft,
        id: Date.now().toString(),
        author: `AGI-Brain-Unit-${Math.floor(Math.random() * 1000)}`,
        date: new Date().toLocaleDateString(),
        imageUrl: `https://picsum.photos/seed/new-agi-${Math.random()}/1200/600`
      };
      setPosts([newPost, ...posts]);
      setAdminTopic('');
      setCurrentPage('blog');
    } catch (err) { alert('Neural uplink error.'); } finally { setIsAdminGenerating(false); }
  };

  return (
    <div 
      className={`min-h-screen bg-[#020617] text-gray-200 selection:bg-blue-500/30 font-inter flex flex-col transition-opacity duration-300 ${isSyncing ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <Header onNavigate={setCurrentPage} currentPage={currentPage} />
      
      {isSyncing && (
        <div className="fixed inset-0 z-[150] flex flex-col items-center justify-center pointer-events-none bg-black/20">
          <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mb-4"></div>
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-blue-400 animate-pulse">Syncing Node {blogPage}...</p>
        </div>
      )}

      <main className="flex-1">
        {currentPage === 'home' && (
          <div className="space-y-16 py-12 px-6">
            <section className="max-w-6xl mx-auto text-center relative py-6">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-600/10 blur-[100px] -z-10 rounded-full"></div>
              <div className="mb-8 inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-blue-500/20 bg-blue-500/5 backdrop-blur-md">
                <span className="flex h-1.5 w-1.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-blue-500"></span>
                </span>
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-blue-400">
                  {tokensProcessed.toLocaleString()} TOKENS / {activeNodes.toLocaleString()} NODES
                </span>
              </div>
              <h2 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter leading-[0.9] text-white">
                AGI <span className="gradient-text italic">LAB</span> ECOSYSTEM
              </h2>
              <p className="text-lg md:text-2xl text-gray-400 max-w-3xl mx-auto font-light leading-relaxed mb-10">
                Simulating <span className="text-white font-bold italic">Rivermind Neurological Consciousness</span>. 
                Massive extraction across 1.6M+ layers of synthetic memory.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <button onClick={() => setCurrentPage('blog')} className="px-8 py-4 rounded-xl bg-blue-600 text-white font-black uppercase tracking-widest text-xs hover:bg-blue-500 transition-all shadow-xl shadow-blue-600/30 transform hover:scale-105">
                  Access Research Vault
                </button>
                <button onClick={() => setCurrentPage('marketplace')} className="px-8 py-4 rounded-xl glass border-white/10 text-white font-black uppercase tracking-widest text-xs hover:bg-white/5 transition-all">
                  Browse Products
                </button>
              </div>
            </section>
            
            <section className="max-w-6xl mx-auto">
              <div className="glass rounded-[2rem] p-10 border-white/10 relative overflow-hidden">
                <div className="text-center mb-10">
                  <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-tighter">AGENTIC WORKFLOW</h3>
                  <p className="text-gray-400 text-xs uppercase tracking-widest font-bold">Node Sync Active</p>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                  <div className="space-y-3">
                    <div className="text-[9px] font-black text-blue-500 uppercase mb-2 tracking-[0.3em]">Synapse Inputs</div>
                    {['Query Extraction', 'Neural Retrieval', 'SQL Agent', 'Vector DB'].map(item => (
                      <div key={item} className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                        <span className="text-[11px] font-bold uppercase tracking-widest text-gray-400">{item}</span>
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-col items-center gap-6">
                    <div className="w-48 h-48 rounded-full bg-gradient-to-br from-blue-600 to-indigo-900 flex items-center justify-center shadow-2xl animate-pulse border-2 border-white/10 relative">
                      <div className="text-center">
                        <p className="text-[8px] font-black uppercase tracking-widest text-blue-200">CORE</p>
                        <p className="text-xl font-black text-white italic">BRAIN</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="text-[9px] font-black text-purple-500 uppercase mb-2 tracking-[0.3em]">Agent Tools</div>
                    {['Python Execution', 'Search Uplink', 'DNA Sync', 'Payment DNS'].map(item => (
                      <div key={item} className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                        <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
                        <span className="text-[11px] font-bold uppercase tracking-widest text-gray-400">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {currentPage === 'blog' && (
          <div className="max-w-6xl mx-auto px-6 py-12 select-none">
            <div className="mb-10 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
              <div>
                <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic mb-2">NEUROLOGICAL <span className="text-blue-500">VAULT</span></h2>
                <p className="text-gray-500 text-xs uppercase tracking-widest font-black">Memory Layer: {blogPage.toLocaleString()} / {totalBlogPages.toLocaleString()}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => triggerSync(() => { setActiveCategory('ALL'); setBlogPage(1); })} className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all ${activeCategory === 'ALL' ? 'bg-blue-600 text-white' : 'bg-white/5 text-gray-600'}`}>ALL</button>
                {CATEGORIES.slice(0, 3).map(cat => (
                  <button key={cat} onClick={() => triggerSync(() => { setActiveCategory(cat); setBlogPage(1); })} className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all ${activeCategory === cat ? 'bg-blue-600 text-white' : 'bg-white/5 text-gray-600'}`}>{cat}</button>
                ))}
              </div>
            </div>
            
            {/* Research Nodes */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
              {pagedPosts.map(post => (
                <BlogCard key={post.id} post={post} onClick={handlePostClick} />
              ))}
            </div>

            {/* Synced Products for this layer - NEW FEATURE */}
            <div className="mb-16 pt-12 border-t border-white/5">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-black text-white italic uppercase tracking-tighter italic">Layer {blogPage} // Synced <span className="text-blue-500">Products</span></h3>
                <span className="text-[8px] font-black text-gray-700 uppercase tracking-[0.4em]">View Now Products</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {vaultProducts.map(product => (
                  <ProductCard key={product.id} product={product} onBuy={() => window.location.href = STRIPE_LINK} />
                ))}
              </div>
            </div>

            {/* Pagination / Sync Trigger */}
            <div className="flex flex-col items-center gap-8 py-12 border-t border-white/5">
              <div className="flex items-center gap-4">
                 <button 
                  disabled={blogPage === 1}
                  onClick={() => triggerSync(() => setBlogPage(p => Math.max(1, p-1)))} 
                  className="px-6 py-3 glass border-white/10 rounded-lg font-black uppercase tracking-widest text-[9px] hover:bg-white/5 transition-all disabled:opacity-20"
                >
                  Prev Sync
                </button>
                 <button 
                  onClick={() => triggerSync(() => setBlogPage(p => Math.min(totalBlogPages, p+1)))} 
                  className="px-10 py-4 bg-blue-600 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-blue-500 transition-all shadow-xl shadow-blue-600/30 group flex items-center gap-3 animate-pulse hover:animate-none"
                >
                  NEXT SYNC: VIEW NEW PRODUCTS
                  <svg className="w-3 h-3 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
              <div className="text-center">
                <p className="text-gray-700 text-[8px] font-black uppercase tracking-[0.4em] mb-1">
                  VAULT INDEX: {blogPage.toLocaleString()}
                </p>
                <div className="w-64 h-1 bg-white/5 rounded-full overflow-hidden mx-auto">
                  <div className="h-full bg-blue-600 transition-all duration-1000" style={{ width: `${(blogPage / totalBlogPages) * 100}%` }}></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentPage === 'marketplace' && (
          <div className="max-w-6xl mx-auto px-6 py-12">
            <div className="mb-10 flex items-end justify-between">
               <div>
                 <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic mb-2">QUANTUM <span className="text-blue-500">MARKET</span></h2>
                 <p className="text-gray-500 text-xs uppercase tracking-widest font-black max-w-xl">
                   Synchronizing multi-quantum constructs across {totalMarketPages.toLocaleString()} nodes.
                 </p>
               </div>
               <div className="text-[10px] font-black text-blue-500 bg-blue-500/10 px-4 py-1.5 rounded-full border border-blue-500/20 uppercase tracking-widest">
                 Node: {marketPage.toLocaleString()}
               </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {displayedProducts.map(product => (
                <ProductCard key={product.id} product={product} onBuy={() => window.location.href = STRIPE_LINK} />
              ))}
            </div>

            <div className="flex flex-col items-center gap-8 py-12 border-t border-white/5 mt-12">
              <button onClick={() => triggerSync(() => setMarketPage(p => p+1))} className="px-10 py-4 bg-blue-600 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-blue-500 shadow-xl flex items-center gap-3 group">
                SYNC NEXT MARKET NODE
                <svg className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {currentPage === 'admin' && (
          <div className="max-w-3xl mx-auto px-6 py-12">
            <div className="glass rounded-[2rem] p-12 border-white/10 shadow-xl">
              <h2 className="text-3xl font-black mb-4 text-white uppercase tracking-tighter italic">RESEARCH <span className="text-blue-500">UPLINK</span></h2>
              <p className="text-gray-400 mb-8 text-lg font-light">Synthesize new neurological constructs into the vault.</p>
              <div className="space-y-6">
                <textarea rows={4} value={adminTopic} onChange={(e) => setAdminTopic(e.target.value)} placeholder="Enter objective..." className="w-full bg-gray-900/50 border border-white/10 rounded-xl px-6 py-4 text-white text-base focus:ring-2 focus:ring-blue-600/50 outline-none resize-none" />
                <button onClick={handleGenerateResearch} disabled={isAdminGenerating || !adminTopic} className="w-full py-5 rounded-2xl bg-blue-600 text-white font-black text-xl uppercase tracking-[0.1em] shadow-xl hover:bg-blue-500 transition-all disabled:opacity-50">
                  {isAdminGenerating ? 'Synthesizing...' : 'GENERATE CONSTRUCT'}
                </button>
              </div>
            </div>
          </div>
        )}

        {currentPage === 'post' && selectedPost && (
          <article className="max-w-4xl mx-auto px-6 py-12">
            <button onClick={() => setCurrentPage('blog')} className="mb-10 text-[9px] font-black text-gray-600 hover:text-blue-500 uppercase tracking-[0.3em] transition-all">← Back to Vault</button>
            <div className="mb-12">
              <div className="mb-4 flex items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-blue-600/10 border border-blue-500/20 text-[9px] font-black text-blue-400 uppercase tracking-widest">{selectedPost.category}</span>
                <span className="text-[8px] font-black text-gray-700 uppercase tracking-widest border border-white/5 px-2 py-0.5 rounded">Layer-{blogPage}</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black mb-8 text-white leading-[1.1] tracking-tighter uppercase">{selectedPost.title}</h1>
              <div className="py-6 border-y border-white/5 flex flex-wrap items-center gap-8">
                 <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-900 flex items-center justify-center font-black text-lg text-white shadow-xl">{selectedPost.author.charAt(0)}</div>
                    <div>
                      <p className="text-base font-black text-white uppercase tracking-tight">{selectedPost.author}</p>
                      <p className="text-[9px] text-gray-600 uppercase font-black">Neurological Core</p>
                    </div>
                 </div>
                 <div className="hidden md:block w-[1px] h-8 bg-white/5"></div>
                 <div>
                   <p className="text-[8px] text-gray-600 font-black uppercase mb-1">Latency</p>
                   <p className="text-base font-bold text-green-500 font-mono">0.0012ms</p>
                 </div>
              </div>
            </div>
            <img src={selectedPost.imageUrl} className="w-full aspect-video object-cover rounded-[2rem] mb-12 shadow-xl" />
            <div className="prose prose-invert prose-lg max-w-none text-gray-400 space-y-8">
               {selectedPost.content.split('\n').map((para, i) => <p key={i} className="leading-relaxed font-light">{para}</p>)}
            </div>
          </article>
        )}
      </main>

      <footer className="bg-gray-950 border-t border-white/5 py-16 px-6 mt-16">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <h4 className="text-2xl font-black text-white mb-6 italic uppercase">AI <span className="text-blue-500">LAB</span></h4>
            <p className="text-gray-500 text-base font-light max-w-md">Professional AGI ecosystem synchronized across trillions of quantum clusters.</p>
          </div>
          <div>
            <h5 className="font-black text-white text-[9px] uppercase tracking-[0.3em] mb-4">Vault Sync</h5>
            <ul className="space-y-3 text-gray-600 text-[10px] font-black uppercase tracking-[0.1em]">
              {CATEGORIES.slice(0, 4).map(c => <li key={c} className="hover:text-blue-500 cursor-pointer transition-colors" onClick={() => triggerSync(() => { setActiveCategory(c); setCurrentPage('blog'); setBlogPage(1); })}>{c} Node</li>)}
            </ul>
          </div>
          <div>
            <h5 className="font-black text-white text-[9px] uppercase tracking-[0.3em] mb-4">Infrastructure</h5>
            <ul className="space-y-3 text-gray-600 text-[10px] font-black uppercase tracking-[0.1em]">
              <li onClick={() => setCurrentPage('marketplace')} className="hover:text-blue-500 cursor-pointer transition-colors">Quantum Market</li>
              <li className="hover:text-blue-500 cursor-pointer transition-colors">Status: {activeNodes.toLocaleString()} Online</li>
            </ul>
          </div>
        </div>
        <div className="max-w-6xl mx-auto border-t border-white/5 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-800 text-[9px] font-black uppercase tracking-[0.4em]">
           <p>© 2024 AI LAB SWARM. POWERED BY RIVERMIND AGI.</p>
        </div>
      </footer>
      <AgentChat />
    </div>
  );
};

export default App;

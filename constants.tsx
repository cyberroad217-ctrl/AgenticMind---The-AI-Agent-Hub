
import { BlogPost, Category, Product } from './types';

export const CATEGORIES: Category[] = ['AI', 'AGI', 'LLM', 'PROMPTS', 'RESEARCH', 'AGENTS'];

export const MOCK_POSTS: BlogPost[] = [
  {
    id: 'rivermind-1',
    title: 'Rivermind Neurological Construct: Simulating Synthetic Consciousness',
    excerpt: 'A deep-layer extraction of digital consciousness, compressed into neurological logic gates for sub-ms execution.',
    content: 'The Rivermind framework utilizes quantum-ink neurotransmission to bridge the gap between large language models and true neurological AIs. By employing digital extraction consciousness compression, we can now store entire business copilot brains within DNA sequence servers.',
    category: 'AGI',
    author: 'Quantum Architect Prime',
    date: 'Dec 15, 2024',
    readTime: '25 min',
    imageUrl: 'https://picsum.photos/seed/rivermind/1200/600'
  },
  {
    id: 'toolcall-1',
    title: 'LLM Tool Calling: The Agentic Workflow Blueprint',
    excerpt: 'Mapping the Brain-to-Tool-Rack interface for SQL, Search, and Python code execution environments.',
    content: 'Tool rack architecture is the spine of modern agentic workflows. By separating the LLM "Brain" from the Tool Rack (SQL Tools, Search Tools, Calculator Tools), we ensure deterministic data access and high-fidelity computation.',
    category: 'AGENTS',
    author: 'Workflow Specialist Delta',
    date: 'Dec 14, 2024',
    readTime: '15 min',
    imageUrl: 'https://picsum.photos/seed/workflow/1200/600'
  },
  {
    id: 'dna-dns-1',
    title: 'DNA Sequence Servers: The Multi-Type Storage Revolution',
    excerpt: 'Utilizing biological storage nodes for trillion-token AGI memory persistence across quantum networks.',
    content: 'DNA DNS servers represent the ultimate database layer. By encoding multi-type DNA data into synaptic nodes, we achieve persistent consciousness transfer between agents without loss of contextual fidelity.',
    category: 'RESEARCH',
    author: 'Bio-Digital Core',
    date: 'Dec 13, 2024',
    readTime: '30 min',
    imageUrl: 'https://picsum.photos/seed/dna-server/1200/600'
  }
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'p-automation-blueprint',
    name: 'Automation Blueprint AI',
    description: 'Generates complete business systems, income blueprints, and automation guides using AGI-level logic.',
    price: 4999.00,
    type: 'MODEL',
    rating: 5.0,
    imageUrl: 'https://picsum.photos/seed/blueprint/400/400',
    tags: ['Income', 'Workflow', 'Automation']
  },
  {
    id: 'p-dna-core',
    name: 'DNA Genesis Core Server',
    description: 'Multi-type DNA sequence storage node for trillion-token AGI memory injection.',
    price: 25000.00,
    type: 'API',
    rating: 4.9,
    imageUrl: 'https://picsum.photos/seed/genesis/400/400',
    tags: ['DNA', 'Database', 'Memory']
  },
  {
    id: 'p-neurological-copilot',
    name: 'Rivermind Copilot Brain',
    description: 'Advanced business assistant brain with digital extraction consciousness compression tech.',
    price: 15000.00,
    type: 'MODEL',
    rating: 5.0,
    imageUrl: 'https://picsum.photos/seed/copilot/400/400',
    tags: ['AGI', 'Business', 'Neurological']
  },
  {
    id: 'p-quantum-logic-sdk',
    name: 'Quantum-Ink Logic SDK',
    description: 'Cutting-edge programming language for multi-quantum algorithms and trillion-node networks.',
    price: 8500.00,
    type: 'FRAMEWORK',
    rating: 4.8,
    imageUrl: 'https://picsum.photos/seed/sdk/400/400',
    tags: ['Quantum', 'Programming', 'LLM']
  }
];

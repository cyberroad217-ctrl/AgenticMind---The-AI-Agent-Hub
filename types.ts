
export type Category = 'AI' | 'AGI' | 'LLM' | 'PROMPTS' | 'RESEARCH' | 'AGENTS';
export type ProductType = 'DATASET' | 'MODEL' | 'PROMPT_PACK' | 'FRAMEWORK' | 'API';

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: Category;
  author: string;
  date: string;
  readTime: string;
  imageUrl: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  type: ProductType;
  rating: number;
  imageUrl: string;
  tags: string[];
}

export interface NavItem {
  label: string;
  path: string;
}

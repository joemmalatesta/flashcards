import { Category } from '@prisma/client';
import { FlashcardColumn } from './_flashcards/flashcards-columns';
import { CategoriesDataTable } from './_categories/categories-data-table';
import { FlashcardsDataTable } from './_flashcards/flashcards-data-table';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import CreateCategory from './_categories/create-category-dialog';
import CreateFlashcard from './_flashcards/create-flashcard-dialog';

const categories: Category[] = [
  {
    id: 1,
    name: 'JavaScript',
    slug: 'javascript',
  },
  {
    id: 2,
    name: 'TypeScript',
    slug: 'typescript',
  },
  {
    id: 3,
    name: 'React',
    slug: 'react',
  },
  {
    id: 4,
    name: 'Next.js',
    slug: 'next-js',
  },
  {
    id: 5,
    name: 'Tailwind CSS',
    slug: 'tailwind-css',
  },
  {
    id: 6,
    name: 'Node.js',
    slug: 'node-js',
  },
];

const flashcards: FlashcardColumn[] = [
  {
    id: 1,
    question: 'What is JavaScript?',
    answer: 'JavaScript is a programming language.',
    category: categories[0],
    slug: 'what-is-javascript',
  },
  {
    id: 2,
    question: 'What is TypeScript?',
    answer: 'TypeScript is a superset of JavaScript.',
    category: categories[1],
    slug: 'what-is-typescript',
  },
  {
    id: 3,
    question: 'What is React?',
    answer: 'React is a JavaScript library for building user interfaces.',
    category: categories[2],
    slug: 'what-is-react',
  },
  {
    id: 4,
    question: 'What is Next.js?',
    answer: 'Next.js is a React framework.',
    category: categories[3],
    slug: 'what-is-next-js',
  },
  {
    id: 5,
    question: 'What is Tailwind CSS?',
    answer: 'Tailwind CSS is a utility-first CSS framework.',
    category: categories[4],
    slug: 'what-is-tailwind-css',
  },
  {
    id: 6,
    question: 'What is Node.js?',
    answer: 'Node.js is a JavaScript runtime.',
    category: categories[5],
    slug: 'what-is-node-js',
  },
];

export default function Manage() {
  return (
    <div className='flex flex-col md:flex-row gap-6'>
      <Card>
        <CardHeader className='flex flex-row justify-between items-center'>
          <span className='font-bold text-3xl'>Categories</span>
          <CreateCategory />
        </CardHeader>
        <CardContent>
          <CategoriesDataTable categories={categories} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader className='flex flex-row justify-between items-center'>
          <span className='font-bold text-3xl'>Flashcards</span>
          <CreateFlashcard categories={categories} />
        </CardHeader>
        <CardContent>
          <FlashcardsDataTable
            flashcards={flashcards}
            categories={categories}
          />
        </CardContent>
      </Card>
    </div>
  );
}

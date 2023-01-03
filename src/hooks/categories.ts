import useSWR, { mutate } from 'swr';
import type { Category, Flashcard } from '@prisma/client';
import * as Sentry from '@sentry/nextjs';

export function useCategories() {
  const { data: categories } = useSWR<Category[]>('/api/categories', () => {
    return new Promise((resolve, reject) => {
      Sentry.withScope(async (scope) => {
        const transaction = Sentry.startTransaction({
          name: 'fetch-categories',
          op: 'http.client',
        });
        scope.setSpan(transaction);
        const span = transaction?.startChild({
          op: 'http.client',
          description: 'Fetching categories',
        });

        const res = await fetch('/api/categories', {
          headers: {
            'Content-Type': 'application/json',
            'sentry-trace': transaction?.toTraceparent(),
          },
        });

        if (res.ok) {
          span?.setStatus('Ok');
          span?.setTag('http.status_code', res.status);
          span?.finish();
          transaction?.finish();
          resolve(res.json());
        } else {
          span?.setStatus('UnknownError');
          span?.finish();
          transaction?.finish();
          reject(`Failed to fetch flashcards. Reason: ${res.statusText}`);
        }
      });
    });
  });

  const create = async (name: string) => {
    return new Promise((resolve, reject) => {
      Sentry.withScope(async (scope) => {
        const transaction = Sentry.startTransaction({
          name: 'create-category',
          op: 'http.client',
        });
        scope.setSpan(transaction);
        const span = transaction.startChild({
          op: 'http.client',
          description: 'Creating flashcard',
        });
        const res = await fetch('/api/categories', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'sentry-trace': transaction.toTraceparent(),
          },
          body: JSON.stringify({
            name,
          }),
        });

        if (res.ok) {
          mutate('/api/categories');
          span.setStatus('Ok');
          span.setTag('http.status_code', res.status);
          span.finish();
          transaction.finish();
          resolve(await res.json());
        } else {
          span.setStatus('UnknownError');
          span.finish();
          transaction.finish();
          reject(`Failed to create category. Reason: ${res.statusText}`);
        }
      });
    });
  };

  return {
    categories,
    create,
  };
}

export function useCategory(slug?: string) {
  const { data: category, isLoading } = useSWR<
    Category & { flashcards?: Flashcard[] }
  >(slug && `/api/categories/${slug}`, async () => {
    return new Promise((resolve, reject) => {
      Sentry.withScope(async (scope) => {
        const transaction = Sentry.startTransaction({
          name: 'fetch-category',
          op: 'http.client',
        });
        scope.setSpan(transaction);
        const span = transaction.startChild({
          op: 'http.client',
          description: 'Fetching category by slug',
          tags: {
            slug,
          },
        });
        const res = await fetch(`/api/categories/${slug}`, {
          headers: {
            'Content-Type': 'application/json',
            'sentry-trace': transaction.toTraceparent(),
          },
        });

        if (res.ok) {
          span.setStatus('Ok');
          span.setTag('http.status_code', res.status);
          span.finish();
          transaction.finish();
          resolve(await res.json());
        } else {
          span.setStatus('UnknownError');
          span.finish();
          transaction.finish();
          reject(`Failed to fetch categories. Reason: ${res.statusText}`);
        }
      });
    });
  });

  const remove = async () => {
    return new Promise((resolve, reject) => {
      Sentry.withScope(async (scope) => {
        const transaction = Sentry.startTransaction({
          name: 'remove-category',
          op: 'http.client',
        });
        scope.setSpan(transaction);
        const span = transaction.startChild({
          op: 'http.client',
          description: 'Deleting category',
          tags: {
            slug,
          },
        });
        const res = await fetch(`/api/categories/${slug}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'sentry-trace': transaction.toTraceparent(),
          },
        });

        if (res.ok) {
          mutate('/api/categories');
          span.setStatus('Ok');
          span.setTag('http.status_code', res.status);
          span.finish();
          transaction.finish();
          resolve(await res.json());
        } else {
          span.setStatus('UnknownError');
          span.finish();
          transaction.finish();
          reject(`Failed to delete category. Reason: ${res.statusText}`);
        }
      });
    });
  };

  const update = async (slug: string, name: string) => {
    return new Promise<Category>((resolve, reject) => {
      Sentry.withScope(async (scope) => {
        const transaction = Sentry.startTransaction({
          name: 'update-category',
          op: 'http.client',
        });
        scope.setSpan(transaction);
        const span = transaction.startChild({
          op: 'http.client',
          description: 'Updating category',
          tags: {
            slug,
          },
        });
        const res = await fetch(`/api/categories/${slug}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'sentry-trace': transaction.toTraceparent(),
          },
          body: JSON.stringify({
            name,
          }),
        });

        if (res.ok) {
          mutate(`/api/categories/${slug}`);
          mutate('/api/categories');
          span.setStatus('Ok');
          span.setTag('http.status_code', res.status);
          span.finish();
          resolve(await res.json());
        } else {
          span.setStatus('UnknownError');
          span.finish();
          reject(`Failed to delete category. Reason: ${res.statusText}`);
        }
      });
    });
  };

  return {
    category,
    isLoading,
    remove,
    update,
  };
}

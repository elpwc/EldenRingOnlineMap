/**
 * references:
 * https://github.com/vueuse/vueuse/blob/main/packages/core/useStorage/index.ts
 * https://github.com/MacFJA/svelte-persistent-store/blob/main/src/index.ts
 */

import type { Writable } from "svelte/store";
import { get } from 'svelte/store';

export function guessSerializerType<T extends (string | number | boolean | object | null)>(rawInit: T) {
  return rawInit == null
    ? 'any'
    : rawInit instanceof Set
      ? 'set'
      : rawInit instanceof Map
        ? 'map'
        : rawInit instanceof Date
          ? 'date'
          : typeof rawInit === 'boolean'
            ? 'boolean'
            : typeof rawInit === 'string'
              ? 'string'
              : typeof rawInit === 'object'
                ? 'object'
                : Array.isArray(rawInit)
                  ? 'object'
                  : !Number.isNaN(rawInit)
                    ? 'number'
                    : 'any';
}

export interface Serializer<T> {
  read(raw: string): T
  write(value: T): string
}

export const StorageSerializers: Record<'boolean' | 'object' | 'number' | 'any' | 'string' | 'map' | 'set' | 'date', Serializer<any>> = {
  boolean: {
    read: (v: string) => v === 'true',
    write: (v: any) => String(v),
  },
  object: {
    read: (v: string) => JSON.parse(v),
    write: (v: any) => JSON.stringify(v),
  },
  number: {
    read: (v: string) => Number.parseFloat(v),
    write: (v: any) => String(v),
  },
  any: {
    read: (v: string) => v,
    write: (v: any) => String(v),
  },
  string: {
    read: (v: string) => v,
    write: (v: any) => String(v),
  },
  map: {
    read: (v: string) => new Map(JSON.parse(v)),
    write: (v: any) => JSON.stringify(Array.from((v as Map<any, any>).entries())),
  },
  set: {
    read: (v: string) => new Set(JSON.parse(v)),
    write: (v: any) => JSON.stringify(Array.from(v as Set<any>)),
  },
  date: {
    read: (v: string) => new Date(v),
    write: (v: any) => v.toISOString(),
  },
}

/**
 * A store that keep it's value in time.
 */
export interface PersistentStore<T> extends Writable<T> {
  /**
   * Delete the store value from the persistent storage
   * Use when only do not need the store 
   */
  delete(): void;
}

export interface StorageOptions<T> {
  storage?: Storage;
  serializer?: Serializer<T>;
}

/**
 * Make a store persistent
 * @param {Writable<*>} store The store to enhance
 * @param {string} key The name of the data key
 * @param {StorageOptions<T>} options More options
 */
export function persist<T extends (string | number | boolean | object | null)>(store: Writable<T>, key: string, options: StorageOptions<T> = {}): PersistentStore<T> {
  const storage = options.storage || localStorage;

  const type = guessSerializerType<T>(get(store));
  const serializer = options.serializer ?? StorageSerializers[type];

  const value = storage.getItem(key);
  if (value !== null) {
    try {
      store.set(serializer.read(value));
    } catch (e) {
      console.error(e);
    }
  }

  store.subscribe(value => {
    storage.setItem(key, value ? serializer.write(value) : '');
  });

  return {
    ...store,
    delete() {
      store.set(undefined);
      storage.removeItem(key);
    },
  };
}

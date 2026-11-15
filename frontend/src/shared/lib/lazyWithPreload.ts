import { lazy, type ComponentType, type LazyExoticComponent } from 'react'

export type PreloadableComponent = LazyExoticComponent<ComponentType> & {
  /** Starts downloading the chunk without rendering it. Safe to call many times. */
  preload: () => Promise<unknown>
}

/** React.lazy + a `preload()` method, so we can fetch the next screen's code in advance. */
export function lazyWithPreload(
  factory: () => Promise<{ default: ComponentType }>,
): PreloadableComponent {
  let promise: Promise<{ default: ComponentType }> | undefined
  const load = () => (promise ??= factory())
  return Object.assign(lazy(load), { preload: load })
}

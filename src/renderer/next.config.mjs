/** @type {import('next').NextConfig} */
const nextConfig = {
  /**
   * Static HTML export — required for Electron's file:// protocol.
   * No server runtime or SSR is used; every page must be client-renderable.
   */
  output: 'export',

  /**
   * Next.js Image Optimization is server-side only and therefore incompatible
   * with a static export.  Disable it and serve images as plain <img> tags.
   */
  images: {
    unoptimized: true,
  },

  /**
   * Disable the `x-powered-by` header (best practice for any deployment).
   */
  poweredByHeader: false,

  /**
   * Trailing slashes ensure that each route resolves to an index.html file,
   * which is the expected layout when Electron uses loadFile().
   */
  trailingSlash: true,
};

export default nextConfig;

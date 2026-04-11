import { describe, it, expect, vi } from "vitest";

// Mock the csrf module so the middleware CSRF check always passes in these
// authorization-focused tests.
vi.mock("@/lib/security/csrf", () => ({
  validateCsrf: () => ({ valid: true }),
}));

import { middleware } from "@/middleware";
import { NextRequest } from "next/server";

type RouteKind = "dashboard" | "admin" | "public" | "api";

interface RouteCase {
  path: string;
  kind: RouteKind;
}

const ROUTES: RouteCase[] = [
  { path: "/", kind: "public" },
  { path: "/pricing", kind: "public" },
  { path: "/contact", kind: "public" },
  { path: "/login", kind: "public" },
  { path: "/dashboard", kind: "dashboard" },
  { path: "/dashboard/orders", kind: "dashboard" },
  { path: "/dashboard/vehicles", kind: "dashboard" },
  { path: "/dashboard/documents", kind: "dashboard" },
  { path: "/admin", kind: "admin" },
  { path: "/admin/orders", kind: "admin" },
  { path: "/admin/users", kind: "admin" },
  { path: "/api/orders", kind: "api" },
  { path: "/api/health", kind: "api" },
];

function makeRequest(path: string, withSessionCookie = false): NextRequest {
  const url = `https://infolog24.ru${path}`;
  const init: { headers: Record<string, string> } = { headers: {} };
  if (withSessionCookie) {
    init.headers.cookie = "better-auth.session_token=test-token";
  }
  return new NextRequest(url, init);
}

describe("middleware authorization", () => {
  describe("anonymous user", () => {
    it("redirects /dashboard to /login", async () => {
      const request = makeRequest("/dashboard", false);
      const response = await middleware(request);
      expect(response?.status).toBe(307); // redirect
      expect(response?.headers.get("location")).toContain("/login");
    });

    it("redirects /admin to /login", async () => {
      const request = makeRequest("/admin/orders", false);
      const response = await middleware(request);
      expect(response?.status).toBe(307);
      expect(response?.headers.get("location")).toContain("/login");
    });

    it("allows access to public /pricing", async () => {
      // Public paths are outside the matcher. The middleware config.matcher
      // ensures this handler is not invoked for public paths, but if called
      // directly, the middleware must not redirect them.
      const request = makeRequest("/pricing", false);
      const response = await middleware(request);
      // .next() returns a 200-like passthrough
      expect(response?.status).toBeLessThan(400);
    });
  });

  describe("authenticated user (cookie present)", () => {
    it("allows access to /dashboard", async () => {
      const request = makeRequest("/dashboard", true);
      const response = await middleware(request);
      expect(response?.status).toBeLessThan(400);
    });

    it("allows access to /dashboard/orders", async () => {
      const request = makeRequest("/dashboard/orders", true);
      const response = await middleware(request);
      expect(response?.status).toBeLessThan(400);
    });

    it("passes /admin with cookie through (role check happens downstream)", async () => {
      const request = makeRequest("/admin", true);
      const response = await middleware(request);
      expect(response?.status).toBeLessThan(400);
    });
  });

  describe("route matrix coverage", () => {
    // Verifies every route in the matrix hits a deterministic outcome,
    // catching regressions if routes are added/removed without updating
    // middleware logic.
    for (const route of ROUTES) {
      it(`handles ${route.path} (kind=${route.kind}) for anonymous user`, async () => {
        const request = makeRequest(route.path, false);
        const response = await middleware(request);

        if (route.kind === "dashboard" || route.kind === "admin") {
          expect(response?.status).toBe(307);
        } else {
          expect(response?.status).toBeLessThan(400);
        }
      });

      it(`handles ${route.path} (kind=${route.kind}) for authenticated user`, async () => {
        const request = makeRequest(route.path, true);
        const response = await middleware(request);
        // With cookie present, nothing should redirect.
        expect(response?.status).toBeLessThan(400);
      });
    }
  });
});

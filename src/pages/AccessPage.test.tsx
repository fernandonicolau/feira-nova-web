import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, expect, it, vi } from "vitest";
import { AccessPage } from "./AccessPage";

afterEach(() => vi.unstubAllGlobals());

it("submits only a six-digit code and shows a clear error", async () => {
  const user = userEvent.setup();
  const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ error: { message: "Código incorreto" } }), { status: 403 }));
  vi.stubGlobal("fetch", fetchMock);
  render(<QueryClientProvider client={new QueryClient({ defaultOptions: { mutations: { retry: false } } })}><AccessPage /></QueryClientProvider>);
  const button = screen.getByRole("button", { name: "Entrar" });
  expect(button).toBeDisabled();
  await user.type(screen.getByLabelText("Código de acesso"), "123456");
  await user.click(button);
  expect(fetchMock).toHaveBeenCalledTimes(1);
  expect((fetchMock.mock.calls[0][1] as RequestInit).credentials).toBe("include");
  expect(await screen.findByRole("alert")).toHaveTextContent("Código incorreto");
});

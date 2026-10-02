import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NewBatchForm } from "./NewBatchForm";

function renderForm() {
  return render(<QueryClientProvider client={new QueryClient()}><NewBatchForm /></QueryClientProvider>);
}

describe("NewBatchForm", () => {
  it("associa labels aos campos e mostra erros acessíveis", async () => {
    const user = userEvent.setup();
    renderForm();
    expect(screen.getByLabelText("Nome do lote")).toBeInTheDocument();
    expect(screen.getByLabelText("Loja de origem")).toBeInTheDocument();
    expect(screen.getByLabelText("Itens do pedido")).toBeInTheDocument();
    await user.clear(screen.getByLabelText("Nome do lote"));
    await user.click(screen.getByRole("button", { name: "Processar pedido" }));
    expect(await screen.findByText("Informe um nome com pelo menos 3 caracteres.")).toHaveAttribute("role", "alert");
    expect(screen.getByLabelText("Nome do lote")).toHaveAttribute("aria-invalid", "true");
  });
});

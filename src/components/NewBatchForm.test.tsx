import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NewBatchForm } from "./NewBatchForm";

function renderForm() {
  return render(<QueryClientProvider client={new QueryClient()}><NewBatchForm /></QueryClientProvider>);
}

describe("NewBatchForm", () => {
  it("exposes the unified file and manual controls", async () => {
    const user = userEvent.setup();
    renderForm();
    expect(screen.getByLabelText("Nome do lote")).toBeInTheDocument();
    expect(screen.getByLabelText("Loja da entrada manual 1")).toBeInTheDocument();
    expect(screen.getByLabelText("Itens da entrada manual 1")).toBeInTheDocument();
    expect(screen.getByLabelText(/Solte os arquivos aqui/)).toHaveAttribute("multiple");
    await user.click(screen.getByRole("button", { name: "Adicionar" }));
    expect(screen.getByLabelText("Itens da entrada manual 2")).toBeInTheDocument();
  });
});

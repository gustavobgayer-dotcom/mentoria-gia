"use client";

import { useRef, useState } from "react";
import * as XLSX from "xlsx";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { CLUSTER_NAMES, MONTHS, PAYMENT_METHODS } from "@/lib/clusters";
import { BottomSheet } from "./BottomSheet";
import { Upload, FileSpreadsheet, Download, AlertCircle, CheckCircle2 } from "lucide-react";
import { useMonth } from "@/hooks/useMonth";

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface ParsedRow {
  index: number;
  cluster: string;
  tipo: string;
  ident: string;
  valor: number | null;
  pagamento: string;
  errors: string[];
}

interface Props {
  open: boolean;
  onClose: () => void;
}

const VALID_CLUSTERS = new Set(CLUSTER_NAMES);

// ─── Componente principal ─────────────────────────────────────────────────────

export function ImportExcelSheet({ open, onClose }: Props) {
  const { mes: mesCurrent, ano: anoCurrent } = useMonth();
  const [mes, setMes] = useState(mesCurrent);
  const [ano, setAno] = useState(anoCurrent);
  const [rows, setRows] = useState<ParsedRow[]>([]);
  const [fileName, setFileName] = useState("");
  const [importing, setImporting] = useState(false);
  const [success, setSuccess] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const addBulk = useMutation(api.lancamentos.addBulk);

  // ── Parse do arquivo ──────────────────────────────────────────────────────

  function handleFile(file: File) {
    setSuccess(false);
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      const wb = XLSX.read(data, { type: "array" });
      const sheet = wb.Sheets[wb.SheetNames[0]];
      const raw = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: "" });
      setRows(raw.map((r, i) => parseRow(r, i)));
    };
    reader.readAsArrayBuffer(file);
  }

  function parseRow(r: Record<string, unknown>, index: number): ParsedRow {
    const errors: string[] = [];

    const cluster = String(r["Cluster"] ?? r["cluster"] ?? "").trim();
    const tipo = String(r["Tipo"] ?? r["tipo"] ?? "").trim();
    const ident = String(r["Descrição"] ?? r["Descricao"] ?? r["ident"] ?? "").trim();
    const rawValor = String(r["Valor"] ?? r["valor"] ?? "").replace(",", ".");
    const pagamento = String(r["Pagamento"] ?? r["pagamento"] ?? "").trim() || "-";

    if (!cluster) errors.push("Cluster vazio");
    else if (!VALID_CLUSTERS.has(cluster as never)) errors.push(`Cluster inválido: "${cluster}"`);

    if (!tipo) errors.push("Tipo vazio");
    if (!ident) errors.push("Descrição vazia");

    const valor = parseFloat(rawValor);
    if (!rawValor || isNaN(valor) || valor <= 0) errors.push("Valor inválido");

    return { index, cluster, tipo, ident, valor: isNaN(valor) ? null : valor, pagamento, errors };
  }

  // ── Drag & Drop ───────────────────────────────────────────────────────────

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  // ── Download do template ──────────────────────────────────────────────────

  function downloadTemplate() {
    const data = [
      { Cluster: "Custo Fixo", Tipo: "Aluguel", Descrição: "Ap Centro", Valor: 2500, Pagamento: "Pix" },
      { Cluster: "Conforto", Tipo: "Streaming", Descrição: "Netflix", Valor: 55.90, Pagamento: "Cartão de Crédito | XP" },
      { Cluster: "Prazeres", Tipo: "Restaurante", Descrição: "Jantar aniversário", Valor: 180, Pagamento: "Cartão de Crédito | XP" },
    ];
    const ws = XLSX.utils.json_to_sheet(data);
    ws["!cols"] = [{ wch: 22 }, { wch: 18 }, { wch: 24 }, { wch: 10 }, { wch: 28 }];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Lançamentos");
    XLSX.writeFile(wb, "template-sardinha.xlsx");
  }

  // ── Importar ──────────────────────────────────────────────────────────────

  async function handleImport() {
    const valid = rows.filter((r) => r.errors.length === 0);
    if (!valid.length) return;
    setImporting(true);
    try {
      await addBulk({
        lancamentos: valid.map((r) => ({
          cluster: r.cluster,
          tipo: r.tipo,
          ident: r.ident,
          valor: r.valor!,
          mes,
          ano,
          pagamento: r.pagamento,
        })),
      });
      setSuccess(true);
      setRows([]);
      setFileName("");
      setTimeout(onClose, 1200);
    } finally {
      setImporting(false);
    }
  }

  function handleClose() {
    setRows([]);
    setFileName("");
    setSuccess(false);
    onClose();
  }

  const validCount = rows.filter((r) => r.errors.length === 0).length;
  const errorCount = rows.filter((r) => r.errors.length > 0).length;

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <BottomSheet open={open} onClose={handleClose} title="Importar Excel">

      {/* Mês / Ano */}
      <div className="flex gap-3 mb-5">
        <div className="flex-1">
          <label className="block text-[11px] uppercase tracking-wider mb-2" style={{ color: "var(--muted)", fontFamily: "var(--font-dm-mono)" }}>
            Mês
          </label>
          <select
            value={mes}
            onChange={(e) => setMes(Number(e.target.value))}
            className="w-full h-[42px] rounded-lg px-3 text-sm outline-none appearance-none"
            style={{ background: "var(--surface2)", border: "1px solid var(--border2)", color: "var(--text)" }}
          >
            {MONTHS.map((m, i) => (
              <option key={m} value={i + 1} style={{ background: "var(--surface)" }}>{m}</option>
            ))}
          </select>
        </div>
        <div className="w-[90px]">
          <label className="block text-[11px] uppercase tracking-wider mb-2" style={{ color: "var(--muted)", fontFamily: "var(--font-dm-mono)" }}>
            Ano
          </label>
          <input
            type="number"
            value={ano}
            onChange={(e) => setAno(Number(e.target.value))}
            className="w-full h-[42px] rounded-lg px-3 text-sm outline-none text-center"
            style={{ background: "var(--surface2)", border: "1px solid var(--border2)", color: "var(--text)" }}
          />
        </div>
      </div>

      {/* Template download */}
      <button
        onClick={downloadTemplate}
        className="w-full h-[38px] rounded-lg flex items-center justify-center gap-2 text-[13px] font-medium mb-4 transition-opacity active:opacity-70"
        style={{ background: "var(--surface2)", border: "1px solid var(--border2)", color: "var(--muted)" }}
      >
        <Download size={14} />
        Baixar template .xlsx
      </button>

      {/* Drop zone */}
      <div
        onDrop={onDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => fileRef.current?.click()}
        className="rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors mb-4"
        style={{
          border: "1.5px dashed var(--border2)",
          background: "var(--surface2)",
          minHeight: 90,
          padding: "20px 16px",
        }}
      >
        {fileName ? (
          <>
            <FileSpreadsheet size={22} style={{ color: "var(--green)" }} />
            <span className="text-[13px]" style={{ color: "var(--text)" }}>{fileName}</span>
            <span className="text-[11px]" style={{ color: "var(--muted)" }}>Clique para trocar o arquivo</span>
          </>
        ) : (
          <>
            <Upload size={22} style={{ color: "var(--muted)" }} />
            <span className="text-[13px]" style={{ color: "var(--muted)" }}>Arraste ou clique para enviar</span>
            <span className="text-[11px]" style={{ color: "var(--muted)" }}>.xlsx · .xls · .csv</span>
          </>
        )}
      </div>

      <input
        ref={fileRef}
        type="file"
        accept=".xlsx,.xls,.csv"
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
      />

      {/* Preview */}
      {rows.length > 0 && (
        <>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] uppercase tracking-wider" style={{ color: "var(--muted)", fontFamily: "var(--font-dm-mono)" }}>
              Preview
            </span>
            <div className="flex gap-3 text-[11px]">
              {validCount > 0 && (
                <span style={{ color: "var(--green)" }}>{validCount} válido{validCount !== 1 ? "s" : ""}</span>
              )}
              {errorCount > 0 && (
                <span style={{ color: "var(--red, #f87171)" }}>{errorCount} com erro</span>
              )}
            </div>
          </div>

          <div className="rounded-xl overflow-hidden mb-4" style={{ border: "1px solid var(--border2)" }}>
            <div
              className="overflow-x-auto"
              style={{ maxHeight: 220, overflowY: "auto" }}
            >
              <table className="w-full text-[11px]" style={{ borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "var(--surface2)" }}>
                    {["Cluster", "Tipo", "Descrição", "Valor", "Pagamento"].map((h) => (
                      <th key={h} className="text-left px-3 py-2 font-medium" style={{ color: "var(--muted)", whiteSpace: "nowrap", borderBottom: "1px solid var(--border2)" }}>
                        {h}
                      </th>
                    ))}
                    <th className="px-3 py-2" style={{ borderBottom: "1px solid var(--border2)" }} />
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => {
                    const hasError = row.errors.length > 0;
                    return (
                      <tr
                        key={row.index}
                        style={{
                          background: hasError ? "rgba(248,113,113,0.07)" : "transparent",
                          borderBottom: "1px solid var(--border2)",
                        }}
                      >
                        <td className="px-3 py-2" style={{ color: hasError ? "var(--red, #f87171)" : "var(--text)", whiteSpace: "nowrap" }}>
                          {row.cluster || "—"}
                        </td>
                        <td className="px-3 py-2" style={{ color: "var(--text)", whiteSpace: "nowrap" }}>
                          {row.tipo || "—"}
                        </td>
                        <td className="px-3 py-2" style={{ color: "var(--text)" }}>
                          {row.ident || "—"}
                        </td>
                        <td className="px-3 py-2" style={{ color: hasError && row.valor === null ? "var(--red, #f87171)" : "var(--text)", whiteSpace: "nowrap" }}>
                          {row.valor !== null ? `R$ ${row.valor.toFixed(2).replace(".", ",")}` : "—"}
                        </td>
                        <td className="px-3 py-2" style={{ color: "var(--muted)", whiteSpace: "nowrap" }}>
                          {row.pagamento}
                        </td>
                        <td className="px-3 py-2">
                          {hasError ? (
                            <div title={row.errors.join(" · ")}>
                              <AlertCircle size={13} style={{ color: "var(--red, #f87171)" }} />
                            </div>
                          ) : (
                            <CheckCircle2 size={13} style={{ color: "var(--green)" }} />
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Feedback de sucesso */}
      {success && (
        <div className="flex items-center gap-2 mb-3 text-[13px]" style={{ color: "var(--green)" }}>
          <CheckCircle2 size={16} />
          Lançamentos importados com sucesso!
        </div>
      )}

      {/* Botão importar */}
      <button
        onClick={handleImport}
        disabled={validCount === 0 || importing}
        className="w-full h-[46px] rounded-lg text-[15px] font-semibold transition-opacity active:opacity-85 disabled:opacity-40 disabled:cursor-not-allowed"
        style={{ background: "var(--green)", color: "#0a0f1e" }}
      >
        {importing ? "Importando..." : `Importar ${validCount > 0 ? validCount : ""} lançamento${validCount !== 1 ? "s" : ""}`}
      </button>

    </BottomSheet>
  );
}

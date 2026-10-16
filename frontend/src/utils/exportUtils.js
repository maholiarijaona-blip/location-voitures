import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export function exportToPDF(title, columns, rows) {
  const doc = new jsPDF({ orientation: 'landscape' })
  doc.setFontSize(14)
  doc.text(title, 14, 15)
  autoTable(doc, {
    startY: 22,
    head: [columns.map((c) => c.label)],
    body: rows.map((row) => columns.map((c) => (c.value ? c.value(row) : row[c.key] ?? ''))),
    styles: { fontSize: 9 },
    headStyles: { fillColor: [35, 122, 115] },
  })
  doc.save(`${title.toLowerCase().replace(/\s+/g, '_')}.pdf`)
}

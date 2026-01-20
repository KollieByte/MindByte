// Feste fachliche Reihenfolge
export const COIN_FIELD_ORDER = [
  "identification",
  "physical",
  "avers",
  "revers",
  "condition",
  "authenticity",
  "history",
  "provenance",
  "storage"
];

export const COIN_FIELDS = {
  identification: {
    label: "1. Grunddaten der Münze",
    fields: {
      inventoryNumber: { label: "Sammlungsnummer", type: "text" },
      country: { label: "Land / Staat", type: "text" },
      ruler: { label: "Herrscher / Ausgabe", type: "text" },
      nominal: { label: "Nominal", type: "text" },
      year: { label: "Prägejahr", type: "number" },
      mint: { label: "Prägeort / Münzstätte", type: "text" },
      mintMark: { label: "Münzzeichen", type: "text" },
      epoch: { label: "Epoche / Dynastie", type: "text" },
      catalogNumber: { label: "Katalog- / Referenznummer", type: "text" }
    }
  },

  physical: {
    label: "2. Physische Eigenschaften",
    fields: {
      material: { label: "Material / Legierung", type: "text" },
      weight: { label: "Gewicht (g)", type: "number" },
      diameter: { label: "Durchmesser (mm)", type: "number" },
      thickness: { label: "Dicke (mm)", type: "number" },
      edge: { label: "Rand", type: "text" },
      alignment: { label: "Stempelstellung", type: "text" }
    }
  },

  avers: {
    label: "3. Avers (Vorderseite)",
    fields: {
      motif: { label: "Motiv / Porträt", type: "text" },
      description: { label: "Beschreibung", type: "text" },
      inscription: { label: "Inschrift", type: "text" },
      titles: { label: "Titel / Abkürzungen", type: "text" },
      features: { label: "Besondere Merkmale", type: "text" },
      photoAvers: { label: "Foto Avers", type: "image" }
    }
  },

  revers: {
    label: "4. Revers (Rückseite)",
    fields: {
      motif: { label: "Motiv", type: "text" },
      description: { label: "Beschreibung", type: "text" },
      inscription: { label: "Inschrift", type: "text" },
      valueDate: { label: "Jahreszahl / Wertangabe", type: "text" },
      symbols: { label: "Symbole / Beizeichen", type: "text" },
      photoRevers: { label: "Foto Revers", type: "image" }
    }
  },

  condition: {
    label: "5. Erhaltungszustand",
    fields: {
      grade: {
        label: "Erhaltungsgrad",
        type: "select",
        options: ["s", "ss", "vz", "stgl"]
      },
      wear: { label: "Abnutzung", type: "text" },
      patina: { label: "Patina", type: "text" },
      cleaning: { label: "Reinigungsspuren", type: "boolean" },
      corrosion: { label: "Korrosion", type: "boolean" }
    }
  },

  authenticity: {
    label: "6. Echtheit & Besonderheiten",
    fields: {
      verified: { label: "Echtheit geprüft", type: "boolean" },
      verificationType: { label: "Art der Prüfung", type: "text" },
      variant: { label: "Variante", type: "text" },
      mintErrors: { label: "Prägefehler", type: "text" },
      rarity: { label: "Seltenheitsgrad", type: "text" }
    }
  },

  history: {
    label: "7. Historischer Kontext",
    fields: {
      background: { label: "Historischer Hintergrund", type: "text" },
      occasion: { label: "Anlass der Prägung", type: "text" },
      circulation: { label: "Umlaufgebiet", type: "text" },
      meaning: { label: "Bedeutung", type: "text" }
    }
  },

  provenance: {
    label: "8. Provenienz & Wert",
    fields: {
      acquisitionDate: { label: "Erwerbsdatum", type: "date" },
      source: { label: "Herkunft", type: "text" },
      auction: { label: "Auktionshaus / Los", type: "text" },
      purchasePrice: { label: "Kaufpreis", type: "number" },
      marketValue: { label: "Marktwert", type: "number" }
    }
  },

  storage: {
    label: "9. Aufbewahrung & Dokumentation",
    fields: {
      storageType: { label: "Aufbewahrungsart", type: "text" },
      location: { label: "Lagerort", type: "text" },
      notes: { label: "Notizen", type: "text" }
    }
  }
};

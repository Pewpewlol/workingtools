#!/bin/bash

# Setup Script für lokale Ausführung

echo "🚀 Urban Sports Club Crawler - Lokales Setup"
echo "============================================="

# Prüfen ob Node.js installiert ist
if ! command -v node &> /dev/null; then
    echo "❌ Node.js ist nicht installiert. Bitte installieren Sie Node.js first."
    exit 1
fi

echo "✅ Node.js gefunden: $(node --version)"

# Dependencies installieren
echo "📦 Installiere Dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencies erfolgreich installiert"
else
    echo "❌ Fehler beim Installieren der Dependencies"
    exit 1
fi

# Playwright Browser installieren
echo "🎭 Installiere Playwright Browser..."
npx playwright install chromium

if [ $? -eq 0 ]; then
    echo "✅ Playwright Browser erfolgreich installiert"
else
    echo "❌ Fehler beim Installieren der Playwright Browser"
    exit 1
fi

# .env.local erstellen falls nicht vorhanden
if [ ! -f ".env.local" ]; then
    echo "📝 Erstelle .env.local aus Beispiel-Datei..."
    cp .env.local.example .env.local
    echo "⚠️  WICHTIG: Bearbeiten Sie .env.local und tragen Sie Ihre echten Daten ein!"
    echo "   Editor öffnen mit: nano .env.local"
else
    echo "✅ .env.local bereits vorhanden"
fi

echo ""
echo "🎉 Setup abgeschlossen!"
echo ""
echo "📋 Nächste Schritte:"
echo "1. Bearbeiten Sie .env.local mit Ihren Daten:"
echo "   nano .env.local"
echo ""
echo "2. Testen Sie die lokale Ausführung:"
echo "   npm run urban:local    # Headless mit Email"
echo "   npm run urban          # Mit Browser-Anzeige"
echo ""
echo "📖 Mehr Informationen in README_LOCAL.md"
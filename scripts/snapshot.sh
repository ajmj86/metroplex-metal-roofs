#!/bin/bash
SNAPSHOT_DIR="/Users/drewbot/Documents/Metroplex Metal Roofs/snapshots"
TIMESTAMP=$(date +"%Y-%m-%d_%H-%M")
mkdir -p "$SNAPSHOT_DIR/$TIMESTAMP"
cp components/Homepage.jsx "$SNAPSHOT_DIR/$TIMESTAMP/Homepage.jsx"
cp app/globals.css "$SNAPSHOT_DIR/$TIMESTAMP/globals.css"
cp app/layout.tsx "$SNAPSHOT_DIR/$TIMESTAMP/layout.tsx"
cp app/visualizer/page.tsx "$SNAPSHOT_DIR/$TIMESTAMP/visualizer-page.tsx"
cp components/SiteFooter.jsx "$SNAPSHOT_DIR/$TIMESTAMP/SiteFooter.jsx"
cp components/SiteNav.tsx "$SNAPSHOT_DIR/$TIMESTAMP/SiteNav.tsx"
echo "Snapshot saved to $SNAPSHOT_DIR/$TIMESTAMP"

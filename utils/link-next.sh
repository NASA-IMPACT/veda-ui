#!/bin/bash

# This script automates the local development workflow between veda-ui and next-veda-ui.
# It builds the veda-ui library, links it globally, links it into the Next.js project,
# and starts a file watcher to rebuild the library on changes.
#
# Assumes that the veda-ui and next-veda-ui folders are siblings, i.e. located at the same directory level.
# If they are not, the NEXT_DIR path in this script must be modified manually.
#
# Usage:
# 1) Start the Next.js project (e.g. with `yarn dev` or `npm run dev`) in a separate terminal first
# 2) Then run this script (`./utils/link-next.sh`) from the veda-ui/utils directory in a separate terminal

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
VEDA_UI_DIR="$SCRIPT_DIR/.."
NEXT_DIR="$VEDA_UI_DIR/../next-veda-ui"

GREEN="\033[0;32m"
RED="\033[0;31m"
NC="\033[0m"

echo -e "${GREEN}Starting veda-ui link script...${NC}"

if [ ! -d "$NEXT_DIR" ]; then
  echo -e "${RED}next-veda-ui folder not found at: $NEXT_DIR${NC}"
  exit 1
fi

echo -e "${GREEN}Building veda-ui library...${NC}"
cd "$VEDA_UI_DIR"
yarn buildlib
if [ $? -ne 0 ]; then
  echo -e "${RED}Failed to build veda-ui library${NC}"
  exit 1
fi

echo -e "${GREEN}Running yarn link in veda-ui...${NC}"
yarn link
if [ $? -ne 0 ]; then
  echo -e "${RED}yarn link failed in veda-ui${NC}"
  exit 1
fi

echo -e "${GREEN}Linking veda-ui in next-veda-ui...${NC}"
cd "$NEXT_DIR"
yarn link @teamimpact/veda-ui
if [ $? -ne 0 ]; then
  echo -e "${RED}Failed to link @teamimpact/veda-ui in Next.js project${NC}"
  exit 1
fi

echo -e "${GREEN}Watching for changes in veda-ui and rebuilding...${NC}"
cd "$VEDA_UI_DIR"
./node_modules/.bin/chokidar "app/scripts/**/*" -c "yarn buildlib" --initial &
WATCH_PID=$!

echo -e "${GREEN}Link setup complete. Verifying...${NC}"
NODE_SCRIPT="require.resolve('@teamimpact/veda-ui')"
if node -e "$NODE_SCRIPT"; then
  echo -e "${GREEN}Link verified successfully${NC}"
else
  echo -e "${RED}Link verification failed. Please check manually${NC}"
fi

echo -e "\n${GREEN}To unlink later, run the following:${NC}"
echo -e "cd $NEXT_DIR && yarn unlink @teamimpact/veda-ui"
echo -e "cd $VEDA_UI_DIR && yarn unlink"

echo -e "${GREEN}Watching for changes (PID $WATCH_PID). Press Ctrl+C to stop.${NC}"
wait $WATCH_PID

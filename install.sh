#!/bin/bash

echo "checking nodejs version..."
sleep 1
if ! command -v node &> /dev/null; then
  echo "nodejs not installed"
  echo "installing nodejs..."
  if [ -n "$PREFIX" ]; then
    pkg update && pkg upgrade
    pkg install node -y
  else
    sudo apt update && apt upgrade
    sudo apt install nodejs -y
fi

echo "nodejs installed"
sleep 1
echo "creating symlink.."
chmod +x sav.js

if [ -n "$PREFIX" ]; then
  #ln -sf "$(pwd)/sav.js" $PREFIX/bin/sav
  rm -f $PREFIX/bin/sav
  cp "$(pwd)/sav.js" $PREFIX/bin/sav
  chmod +x $PREFIX/bin/sav
else
  sudo cp "$(pwd)/sav.js" /usr/local/bin/sav
  sudo chmod +x /usr/local/bin/sav
fi

sleep 2
echo "complete."
sleep 1
echo "type 'sav -v' to check the current version of salvare or 'sav help' to show all sav commands" 
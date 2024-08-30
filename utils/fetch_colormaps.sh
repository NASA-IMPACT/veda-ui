#!/bin/bash

# This script generates a TypeScript object containing colormaps grouped into three categories:
# sequential, diverging, and mixed/rest colormaps. The colormaps are categorized based on the
# groupings defined by Matplotlib (https://matplotlib.org/stable/users/explain/colors/colormaps.html).
# It fetches the data from the specified URL and writes the fetched colormap data to 'colorMaps.ts'.
# The currently hardcoded colormap lists (sequential and diverging) will eventually be replaced by
# dynamically fetching the full list of colormaps directly from the colorMaps endpoint.

# Sequential colormaps list (grouped based on Matplotlib's sequential colormaps)
sequentialColorMaps=("afmhot" "algae" "autumn" "balance" "binary" "blues" "bone" "bugn" "bupu" "cividis" "cmrmap" "cool" "copper" "cubehelix" "gnbu" "gray" "greens" "greys" "haline" "hot" "inferno" "jet" "magma" "matter" "nipy_spectral" "ocean" "oranges" "pink" "plasma" "prgn" "pubu" "pubugn" "purd" "purples" "rain" "reds" "rplumbo" "schwarzwald" "thermal" "turbid" "turbo" "twilight" "twilight_shifted" "viridis" "wistia" "ylgn" "ylgnbu" "ylorbr" "ylorrd")

# Diverging colormaps list (grouped based on Matplotlib's diverging colormaps)
divergingColorMaps=("brbg" "brg" "bwr" "coolwarm" "piyg" "prgn" "puor" "rdbu" "rdgy" "rdpu" "rdylbu" "rdylgn" "seismic")

# Array of colormaps supported by current VEDA back-end
allColorMaps=("accent" "afmhot" "algae" "amp" "autumn" "balance" "binary" "blues" "bone" "brbg" "brg" "bugn" "bupu" "bwr" "cfastie" "cividis" "cmrmap" "cool" "coolwarm" "copper" "cubehelix" "curl" "dark2" "deep" "delta" "dense" "diff" "flag" "gist_earth" "gist_gray" "gist_heat" "gist_ncar" "gist_rainbow" "gist_stern" "gist_yarg" "gnbu" "gnuplot" "gnuplot2" "gray" "greens" "greys" "haline" "hot" "hsv" "ice" "inferno" "jet" "magma" "matter" "nipy_spectral" "ocean" "oranges" "orrd" "oxy" "paired" "pastel1" "pastel2" "phase" "pink" "piyg" "plasma" "prgn" "prism" "pubu" "pubugn" "puor" "purd" "purples" "rain" "rainbow" "rdbu" "rdgy" "rdpu" "rdylbu" "rdylgn" "reds" "rplumbo" "schwarzwald" "seismic" "set1" "set2" "set3" "solar" "spectral" "speed" "spring" "summer" "tab10" "tab20" "tab20b" "tab20c" "tarn" "tempo" "terrain" "thermal" "topo" "turbid" "turbo" "twilight" "twilight_shifted" "viridis" "winter" "wistia" "ylgn" "ylgnbu" "ylorbr" "ylorrd")

url="https://openveda.cloud/api/raster/colorMaps"

# Output file for TypeScript object
outputFile="colorMaps.ts"

# Start writing the TypeScript objects
echo "export const sequentialColorMaps = {" > $outputFile

for colorMap in "${allColorMaps[@]}"; do
  response=$(curl -s "${url}/${colorMap}")

  if [[ $response == \{* ]]; then
    if [[ " ${sequentialColorMaps[@]} " =~ " ${colorMap} " ]]; then
      echo "  $colorMap: $response," >> $outputFile
    fi
  else
    echo "Warning: Failed to fetch data for $colorMap"
  fi
done

echo "};" >> $outputFile

# Write diverging colormaps object
echo "export const divergingColorMaps = {" >> $outputFile

for colorMap in "${allColorMaps[@]}"; do
  response=$(curl -s "${url}/${colorMap}")

  if [[ $response == \{* ]]; then
    if [[ " ${divergingColorMaps[@]} " =~ " ${colorMap} " ]]; then
      echo "  $colorMap: $response," >> $outputFile
    fi
  else
    echo "Warning: Failed to fetch data for $colorMap"
  fi
done

echo "};" >> $outputFile

# Write rest/mixed colormaps object
echo "export const restColorMaps = {" >> $outputFile

for colorMap in "${allColorMaps[@]}"; do
  response=$(curl -s "${url}/${colorMap}")

  if [[ $response == \{* ]]; then
    if [[ ! " ${sequentialColorMaps[@]} " =~ " ${colorMap} " && ! " ${divergingColorMaps[@]} " =~ " ${colorMap} " ]]; then
      echo "  $colorMap: $response," >> $outputFile
    fi
  else
    echo "Warning: Failed to fetch data for $colorMap"
  fi
done

echo "};" >> $outputFile

echo "Color maps have been written to $outputFile"

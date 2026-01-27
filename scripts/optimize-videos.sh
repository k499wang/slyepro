#!/bin/bash

# Video Optimization Script for Landing Page
# Requires: ffmpeg (brew install ffmpeg)
#
# This script:
# 1. Compresses MP4 files for smaller file sizes
# 2. Creates WebM versions (typically 25-50% smaller)
# 3. Backs up originals to a backup folder

set -e

# Configuration
INPUT_DIR="public/presets"
BACKUP_DIR="public/presets/originals"
MAX_WIDTH=720
CRF_MP4=28      # 18-28 range, higher = smaller file
CRF_WEBM=32     # 30-35 range for VP9

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Video Optimization Script ===${NC}"
echo ""

# Check for ffmpeg
if ! command -v ffmpeg &> /dev/null; then
    echo -e "${RED}Error: ffmpeg is not installed.${NC}"
    echo "Install it with: brew install ffmpeg"
    exit 1
fi

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Landing page videos to optimize
VIDEOS=(
    "disneymovie.mp4"
    "asmr.mp4"
    "looksmax.mp4"
    "ai_ugc.mp4"
)

optimize_video() {
    local input="$1"
    local filename=$(basename "$input")
    local name="${filename%.*}"
    local output_mp4="${INPUT_DIR}/${name}_optimized.mp4"
    local output_webm="${INPUT_DIR}/${name}.webm"

    if [ ! -f "$input" ]; then
        echo -e "${YELLOW}Skipping: $filename (not found)${NC}"
        return
    fi

    # Get original file size
    local original_size=$(du -h "$input" | cut -f1)
    echo -e "${GREEN}Processing: $filename (${original_size})${NC}"

    # Backup original
    if [ ! -f "${BACKUP_DIR}/${filename}" ]; then
        cp "$input" "${BACKUP_DIR}/${filename}"
        echo "  → Backed up original"
    fi

    # Compress MP4
    echo "  → Compressing MP4..."
    ffmpeg -i "$input" \
        -vcodec libx264 \
        -crf $CRF_MP4 \
        -preset slow \
        -vf "scale='min(${MAX_WIDTH},iw)':-2" \
        -an \
        -movflags +faststart \
        -y \
        "$output_mp4" \
        -loglevel warning

    # Replace original with optimized
    mv "$output_mp4" "$input"
    local new_size=$(du -h "$input" | cut -f1)
    echo "  → MP4: ${original_size} → ${new_size}"

    # Create WebM version
    echo "  → Creating WebM..."
    ffmpeg -i "$input" \
        -c:v libvpx-vp9 \
        -crf $CRF_WEBM \
        -b:v 0 \
        -vf "scale='min(${MAX_WIDTH},iw)':-2" \
        -an \
        -y \
        "$output_webm" \
        -loglevel warning

    local webm_size=$(du -h "$output_webm" | cut -f1)
    echo "  → WebM: ${webm_size}"
    echo ""
}

# Process each video
for video in "${VIDEOS[@]}"; do
    optimize_video "${INPUT_DIR}/${video}"
done

echo -e "${GREEN}=== Optimization Complete ===${NC}"
echo ""
echo "Originals backed up to: $BACKUP_DIR"
echo "WebM files created alongside MP4 files"
echo ""
echo -e "${YELLOW}Note: The LazyVideo component will automatically use WebM when supported.${NC}"

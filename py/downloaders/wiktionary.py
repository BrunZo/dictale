#!/usr/bin/env python3
"""
Wiktionary Downloader
Downloads and processes Spanish Wiktionary data from kaikki.org
"""

import json
import gzip
import requests
from pathlib import Path
from typing import List, Dict, Optional


WIKTIONARY_URL = "https://kaikki.org/eswiktionary/raw-wiktextract-data.jsonl.gz"
LOCAL_FILE = "eswiktionary.jsonl.gz"

  
def download() -> bool:
  print(f"Downloading Spanish Wiktionary data from kaikki.org...")
  print(f"This may take several minutes (file is ~100-200MB)...")
  
  response = requests.get(WIKTIONARY_URL, stream=True)
  response.raise_for_status()
  
  total_size = int(response.headers.get('content-length', 0))
  downloaded = 0
  
  with open(LOCAL_FILE, 'wb') as f:
    for chunk in response.iter_content(chunk_size=8192):
      if chunk:
        f.write(chunk)
        downloaded += len(chunk)
        if total_size > 0:
          percent = (downloaded / total_size) * 100
          print(f"\rDownloaded: {percent:.1f}%", end='', flush=True)
  
  print(f"\nDownload complete! Saved to {LOCAL_FILE}")
  return True

def process(word_list: Optional[List[str]] = None, word_limit: Optional[int] = None) -> Dict[str, List[str]]:
  if not Path(LOCAL_FILE).exists():
    print(f"File {LOCAL_FILE} not found. Downloading...")
    if not download():
      return {}
  
  print(f"\nProcessing Wiktionary data...")
  definitions = {}
  processed = 0
  found = 0
  
  with gzip.open(LOCAL_FILE, 'rt', encoding='utf-8') as f:
    for line in f:
      try:
        entry = json.loads(line.strip())

        processed += 1
        if processed % 10000 == 0:
          print(f"Processed {processed} entries, found {found} words with definitions...")

        lang_code = entry.get('lang_code', '').lower().strip()
        if lang_code != 'es':
          continue

        word = entry.get('word', '').lower().strip()
        if word_list and word not in word_list:
          continue
        
        senses = entry.get('senses', [])
        word_defs = []
        
        for sense in senses:
          glosses = sense.get('glosses', [])
          for gloss in glosses:
            if isinstance(gloss, str) and gloss.strip():
              word_defs.append(gloss.strip())
          
          raw_glosses = sense.get('raw_glosses', [])
          for raw_gloss in raw_glosses:
            if isinstance(raw_gloss, str) and raw_gloss.strip():
              word_defs.append(raw_gloss.strip())
        
        if len(' '.join(word_defs)) < 100:
          continue
        
        if word_defs:
          seen = set()
          unique_defs = []
          for def_text in word_defs:
            if def_text not in seen:
              seen.add(def_text)
              unique_defs.append(def_text)
          definitions[word] = unique_defs[:3]
          found += 1
      
        if word_limit and found > word_limit:
          print(f"Already found {word_limit} words with definitions, stopping...")
          break

      except json.JSONDecodeError:
        continue
  
  print(f"\nProcessing complete! Found definitions for {found} words.")
  return definitions
    
def save(definitions: Dict[str, List[str]], output_file: str):
  output = []
  for word, defs in definitions.items():
    output.append({
      "word": word,
      "definitions": defs
    })
  
  with open(output_file, 'w', encoding='utf-8') as f:
    json.dump(output, f, ensure_ascii=False, indent=2)
  
  print(f"Saved {len(definitions)} words to {output_file}")

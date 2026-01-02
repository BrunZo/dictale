#!/usr/bin/env python3
"""
Dictionary Downloader for Spanish Word Game
Supports RAE (Real Academia Española), Spanish WordNet, and Wiktionary
"""

import argparse
from typing import List, Optional

from downloaders import wiktionary


def load_word_list(lemario_file: str) -> List[str]:
  """Load words from lemario.txt file"""
  words = []  
  with open(lemario_file, 'r', encoding='utf-8') as f:
    for line in f:
      parts = line.strip().split('\t')
      if parts and parts[0]:
        words.append(parts[0].lower().strip())
  print(f"Loaded {len(words)} words from {lemario_file}")
  return words


def main():
  parser = argparse.ArgumentParser(description='Download Spanish dictionary definitions')
  parser.add_argument('--source', choices=['wiktionary'], 
             default='rae', help='Dictionary source to use (default: rae for Spanish definitions)')
  parser.add_argument('--lemario', type=str, default=None,
             help='Path to lemario.txt file')
  parser.add_argument('--word-limit', type=int, default=None,
             help='Maximum number of words to process')
  parser.add_argument('--output', type=str, default='definitions.json',
             help='Output file name')
  
  args = parser.parse_args()
  
  word_list = None
  if args.lemario:
    word_list = load_word_list(args.lemario)
  
  if args.source == 'wiktionary':
    print("\n=== Using Wiktionary ===")
    defs = wiktionary.process(word_list)
    wiktionary.save(defs, args.output)
  
  print("\nDone!")


if __name__ == "__main__":
  main()

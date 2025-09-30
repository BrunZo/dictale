import {immerable} from "immer"

String.prototype.toPlainLetters = function() 
{
  return this.replace(/[^a-zA-Z]/g, '').toLowerCase()
}

export function isValidLetter(letter: string): boolean 
{
  return /^[a-zA-Z]$/.test(letter)
}

export class Letter 
{
  letter: string
  revealed: boolean
  green: boolean

  constructor(content: string) 
  {
    this.letter = content
    this.revealed = !isValidLetter(content)
    this.green = false
  }

  reveal(prompt?: string, green?: boolean) 
  {
    if (!this.revealed && (!prompt || prompt == this.letter))
      this.green = green
    this.revealed = this.revealed || !prompt || prompt == this.letter
  }
}

export class Word 
{
  content: string
  letters: Letter[]

  constructor(content: string) 
  {
    this.content = content
    this.letters = content.split('').map(letter => new Letter(letter))
  }

  isEqual(prompt: string): string
  {
    return this.content.toPlainLetters() == prompt
  }

  getLetterCount()
  {
    return this.letters.filter(letter => isValidLetter(letter.letter)).length
  }

  getRevealedLetterCount()
  {
    return this.letters.filter(letter => letter.revealed && isValidLetter(letter.letter)).length
  }

  guess(prompt: string)
  {
    if (this.isEqual(prompt)) 
    {
      this.letters.forEach(letter => letter.reveal())
    }
  }

  revealLetter(prompt: string) 
  {
    this.letters.forEach(letter => letter.reveal(prompt, true))
  }

  reveal()
  {
    this.letters.forEach(letter => letter.reveal())
  }
}

export class WordToGuess extends Word 
{

}

export class Definition 
{
  words: Word[]

  constructor(content: string) 
  {
    this.words = content.split(' ').map(word => new Word(word))
  }

  getLetterCount()
  {
    return this.words.reduce((acc, word) => acc + word.getLetterCount(), 0)
  }

  getRevealedLetterCount()
  {
    return this.words.reduce((acc, word) => acc + word.getRevealedLetterCount(), 0)
  }

  guessWord(prompt: string) 
  {
    this.words.forEach(word => word.guess(prompt))
  }

  revealLetter(prompt: string)
  {
    this.words.forEach(word => word.revealLetter(prompt))
  }

  reveal()
  {
    this.words.forEach(word => word.reveal())
  }
}

export class Game
{
  [immerable] = true
  
  wordToGuess: WordToGuess
  definitions: Definition[]

  guessedWords: string[]
  revealedLetters: string[]
  revealedWords: number[][]

  constructor(word: string, definitions: string[])
  {
    this.wordToGuess = new WordToGuess(word)
    this.definitions = definitions.map(def => new Definition(def))
    this.guessedWords = []
    this.revealedLetters = []
    this.revealedWords = []
  }

  getLetterCount()
  {
    return this.definitions.reduce((acc, def) => acc + def.getLetterCount(), 0)
  }

  getRevealedLetterCount()
  {
    return this.definitions.reduce((acc, def) => acc + def.getRevealedLetterCount(), 0)
  }

  riskWordToGuess(prompt: string): 'not-full' | 'correct' | 'wrong'
  {
    if (!prompt)
      return 'empty'

    prompt = prompt.toPlainLetters()

    if (this.wordToGuess.isEqual(prompt))
      return 'correct'
    else
      return 'wrong'
  }

  guessWord(prompt: string): 'empty' | 'already-guessed' | 'ok'
  { 
    if (!prompt)
      return 'empty'

    if (this.guessedWords.includes(prompt))
      return 'already-guessed'

    prompt = prompt.toPlainLetters()

    this.definitions.forEach(def => def.guessWord(prompt))
    this.guessedWords.push(prompt)

    return 'ok'
  }

  revealLetter(prompt: string): 'empty' | 'invalid-letter' | 'already-revealed' | 'ok'
  {
    if (!prompt)
      return 'empty'

    if (!isValidLetter(prompt))
      return 'invalid-letter'

    if (this.revealedLetters.includes(prompt))
      return 'already-revealed'

    prompt = prompt.toLowerCase()
    this.definitions.forEach(def => def.revealLetter(prompt))
    this.revealedLetters.push(prompt)

    return 'ok'
  }

  revealWord(position: number[]): 'empty' | 'invalid-position' | 'already-revealed' | 'ok'
  {
    // TODO
    this.revealedWords.push(position)
    return 'ok'
  }
}

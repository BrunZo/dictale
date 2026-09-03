const ISLET = /[a-záéíñóúüA-ZÁÉÍÑÓÚÜ]/g
const ALLLET = "aábcdeéfghiíjklmnñoópqrstuúüvwxyzAÁBCDEÉFGHIÍJKLKMNÑOÓPQRSTUÚÜVWXYZ"

var DEFS = []
var WORDS = new Set()
var positions = [], letters = [], words = [], failed = []
var word_to_guess = {}, words_in_def = []

function buildWordsSet(defs) {
  const set = new Set()
  defs.forEach(function (entry) {
    entry.definitions.forEach(function (s) {
      s.split(" ").forEach(function (w) {
        const nw = w.toLowerCase().replace(/[.,:;]/g, '')
        if (nw.length > 0) set.add(nw)
      })
    })
  })
  return set
}

function initGame() {
  DEFS = window.__WORD_LIST__ || []
  WORDS = buildWordsSet(DEFS)
  if (DEFS.length === 0) {
    $("#loading").html("Error: no se pudo cargar el diccionario. Ejecuta desde un servidor local (ej: npx serve .)")
    return
  }
  $("#loading").hide()
  $("#game-container").show()
  start_game()
}

$(() => {
  if (window.__WORD_LIST__) {
    initGame()
  } else {
    fetch("../data/word_list.json")
      .then(r => r.json())
      .then(data => {
        window.__WORD_LIST__ = data
        initGame()
      })
      .catch(err => {
        $("#loading").html("Error al cargar: " + err.message + ". Ejecuta desde un servidor (npx serve .)")
      })
  }
})

$("#definitions-container").click((e) => {
  var target = $(e.target)
  var num = letters.length + 1
  if (target.hasClass("word") && num <= 3) {
    positions.push(target.data("pos"))
    letters.push("-")
    $("#letter-guess-" + num).val("-")
    $("#letter-guess-" + num).prop("disabled", true)
    if (num < 3)
      $("#letter-guess-" + (num + 1)).prop("disabled", false)
    else
      $("#letter-guess-button").prop("disabled", true)
    show_progress()
  }
})

function get_random_word(array) {
  return array[Math.floor(Math.random() * array.length)]
}

function start_game() {
  positions = [], letters = [], words = [], failed = []
  word_to_guess = get_random_word(DEFS)
  word_to_guess["definitions"] = word_to_guess["definitions"].slice(0, 3)
  words_in_def = []
  word_to_guess["definitions"].forEach((s) => {
    s.split(" ").forEach((w) => {
      var nw = w.toLowerCase().replace(/[.,:;]/g, '')
      if (!words_in_def.includes(nw))
        words_in_def.push(nw)
    })
  })
  show_progress()
}

function send_letter_guess() {
  var num = letters.length + 1
  var letter = $("#letter-guess-" + num).val().toLowerCase()
  if (!ALLLET.includes(letter) || letter == "") {
    $("#letter-guess-error").html("Ingresa una letra válida.")
    $("#letter-guess-" + num).val("")
  } else if (letters.includes(letter)) {
    $("#letter-guess-error").html("Esta letra ya fue ingresada.")
    $("#letter-guess-" + num).val("")
  } else {
    letters.push(letter)
    $("#letter-guess-error").html("")
    $("#letter-guess-" + num).prop("disabled", true)
    if (num < 3)
      $("#letter-guess-" + (num + 1)).prop("disabled", false)
    else
      $("#letter-guess-button").prop("disabled", true)
    show_progress()
  }
}

function send_word_guess() {
  var guess = $("#word-guess").val().toLowerCase()
  $("#word-guess").val("")
  if (!WORDS.has(guess))
    $("#word-guess-error").html("La palabra ingresada no existe.")
  else if (words.includes(guess))
    $("#word-guess-error").html("Esta palabra ya fue ingresada.")
  else {
    $("#word-guess-error").html("")
    words.push(guess)
    if (!words_in_def.includes(guess))
      failed.push(guess)
    show_progress()
  }
}

function send_final_guess() {
  var guess = $("#final-word-guess").val().toLowerCase()
  if (!WORDS.has(guess))
    $("#final-word-guess-error").html("La palabra ingresada no existe.")
  else {
    $("#final-word-guess-error").html("")
    show_solution(word_to_guess, guess == word_to_guess["word"])
  }
}

function show_progress() {
  var wordKey = word_to_guess["word"] || word_to_guess["lemma"]
  $("#word-to-guess").text(wordKey.split("").map((l) => {
    if (letters.includes(l)) return l
    else return l.replace(ISLET, '_')
  }).join("").toUpperCase())
  $("#definitions-container").html(
    word_to_guess["definitions"].map((s, i) => {
      return s.split(" ").map((w, j) => {
        if (words.includes(w.toLowerCase().replace(/[.,:;]/g, '')) ||
          positions.includes(i + ";" + j)) return w
        else {
          return w.split("").map((l) => {
            if (letters.includes(l)) return l
            else return l.replace(ISLET, '_')
          }).join("")
        }
      }).join(" ")
    }).map((d, i) => {
      return "<p><b>" + (i + 1) + ".</b> " + d.split(" ").map((w, j) => {
        return "<a class='word pointer' data-pos='" + i + ";" + j + "'>" + w + "</a>"
      }).join(" ") + "</p>"
    }).join("\n")
  )
  $("#right-guess-column").html(
    "<a id='word-list-title' class='medium under'>Fallos (" + failed.length + ")</a>" +
    "<ul id='word-list' class='simple-ul'>" +
    failed.map((w, i) => {
      if (failed.length > 6 && i == 2)
        return "<a class='gray'> ... </a>"
      else if (failed.length <= 6 || i <= 1 || i >= failed.length - 3)
        return "<li>" + w.toUpperCase() + "</li>"
    }).filter(Boolean).join("\n") +
    "</ul>"
  )
}

function show_solution(word, win) {
  var wordKey = word["word"] || word["lemma"]
  $("#word-to-guess").text(wordKey.toUpperCase())
  $("#definitions-container").html(
    word["definitions"].map((d, i) => {
      return "<p><b>" + (i + 1) + ".</b> " + d + "</p>"
    }).join("\n")
  )
  if (win) {
    $("#letter-guess-container").hide()
    $("#word-guess-container").hide()
    $("#win-container").show()
    $("#win-message").html("¡Has adivinado en " + words.length + " intentos con "
      + failed.length + " fallos!")
    $("body").css("background-color", "lightgreen")
  } else {
    $("#letter-guess-container").hide()
    $("#word-guess-container").hide()
    $("#lose-container").show()
    $("body").css("background-color", "lightcoral")
  }
  $(".final-stats").html(
    "<b>Letras: </b>" + letters.map((l) => l.toUpperCase()).join(" ") + "<br>" +
    "<b>Palabras: </b>" +
    "<ul class='simple-ul'>" +
    words.map((w) => "<li>" + w.toUpperCase() + "</li>").join("\n") +
    "</ul>"
  )
}

function twitter_share() {
  var wordKey = word_to_guess["word"] || word_to_guess["lemma"]
  window.open("https://twitter.com/intent/tweet?text=Me ha tocado la palabra \"" + wordKey +
    "\" en Dictale. ¿Tú sabes lo que significa? ¡Prueba Dictale!&url=https://brunzi-codes.herokuapp.com/dictale", "_blank").focus()
}

function facebook_share() {
  window.open("https://www.facebook.com/sharer/sharer.php?u=https://brunzi-codes.herokuapp.com/dictale", "_blank").focus()
}

function whatsapp_share() {
  var wordKey = word_to_guess["word"] || word_to_guess["lemma"]
  window.open("whatsapp://send?text=Me ha tocado la palabra \"" + wordKey +
    "\" en Dictale. ¿Tú sabes lo que significa? ¡Prueba Dictale! https://brunzi-codes.herokuapp.com/dictale", "_blank").focus()
}

function copy_to_clipboard() {
  var wordKey = word_to_guess["word"] || word_to_guess["lemma"]
  navigator.clipboard.writeText("Me ha tocado la palabra \"" + wordKey +
    "\" en Dictale. ¿Tú sabes lo que significa? ¡Prueba Dictale! https://brunzi-codes.herokuapp.com/dictale")
}

let wordSet = new Set();

function normalize(word) {
  return word.trim().toLowerCase();
}

async function loadWords() {
  const response = await fetch("words.json");
  const words = await response.json();

  wordSet = new Set(words.map(normalize));
}

// // Check exact match
// function checkWord() {
//   const input = document.getElementById("wordInput");
//   const result = document.getElementById("result");

//   const word = normalize(input.value);

//   if (!word) {
//     result.textContent = "Please enter a word.";
//     return;
//   }

//   if (wordSet.has(word)) {
//     result.textContent = `"${input.value}" has already been used.`;
//   } else {
//     result.textContent = `"${input.value}" has not been used yet.`;
//   }
// }

// Check exact match and similar words
function checkWord() {
  const input = document.getElementById("wordInput");
  const result = document.getElementById("result");

  const word = normalize(input.value);

  if (!word) {
    result.textContent = "Please enter a word.";
    return;
  }

  const wordsArray = Array.from(wordSet);

  if (wordSet.has(word)) {
    result.innerHTML = `
      <span class="used">"${input.value}" has already been used.</span>
    `;
    return;
  }

  // find similar words
  const similar = findSimilarWords(word, wordsArray)
    .filter(w => w !== word)  // just in case
    .slice(0, 5); // limit output

  const similarText = similar.map(w => `"${w}"`).join(", ");

  if (similar.length > 0) {
    result.innerHTML = `
      <span class="similar">"${input.value}" has not been used yet.</span>
      <br>
      <span style="color:#787878; font-weight:normal !important">⚠️ similar word(s) previously used: ${similarText}</span>
    `;
  } else {
    result.innerHTML = `
      <span class="new">"${input.value}" has not been used yet.</span>
    `;
  }
}



// Find substrings
function findSimilar(word, wordList) {
  const w = word.toLowerCase();
  return wordList.filter(existing => {
    return existing.includes(w) || w.includes(existing);
  });

}

// Find closest match by levenshtein
function levenshtein(a, b) {
  const dp = Array.from({ length: a.length + 1 }, () =>
    Array(b.length + 1).fill(0)
  );

  for (let i = 0; i <= a.length; i++) dp[i][0] = i;
  for (let j = 0; j <= b.length; j++) dp[0][j] = j;

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
    }
  }

  return dp[a.length][b.length];
}

function findCloseMatches(word, wordList) {
  return wordList.filter(w => levenshtein(word, w) <= 3);

}

function findSimilarWords(word, wordList) {
  const normalized = word.toLowerCase();
  return wordList.filter(w => {
    return (
      w.includes(normalized) ||
      normalized.includes(w) ||
      levenshtein(normalized, w) <= 3
    );
  });

}

document.getElementById("checkButton").addEventListener("click", checkWord);

document.getElementById("wordInput").addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    checkWord();
  }
});

loadWords();
